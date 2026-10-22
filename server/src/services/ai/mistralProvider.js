import config from '../../config/env.js';

export const mistralProvider = {
  name: 'mistral',

  /**
   * Check whether Mistral is configured with an API key
   * @returns {boolean}
   */
  isConfigured() {
    return Boolean(config.MISTRAL_API_KEY && config.MISTRAL_API_KEY.length > 0);
  },

  /**
   * Generate AI response using Mistral AI API
   * @param {Object} params
   * @param {string} params.prompt - User message / prompt
   * @param {string} [params.systemPrompt] - System instructions
   * @param {Object} [params.context] - Minimal financial context object
   * @param {Object} [params.options] - Optional overrides (model, temperature, timeoutMs)
   * @returns {Promise<{ reply: string, provider: string, model: string, suggestions: string[], timestamp: string }>}
   */
  async generateResponse({ prompt, systemPrompt, context, options = {} }) {
    if (!this.isConfigured()) {
      const err = new Error('Mistral AI API key is not configured in the server environment.');
      err.statusCode = 503;
      err.isConfigError = true;
      err.provider = 'mistral';
      throw err;
    }

    let model = options.model || config.MISTRAL_MODEL || 'ministral-8b-latest';
    if (model.includes('small') || model.includes('tiny')) {
      model = 'ministral-8b-latest';
    }
    const timeoutMs = options.timeoutMs || config.AI_TIMEOUT_MS || 10000;
    const apiKey = config.MISTRAL_API_KEY;

    // Construct full grounded user prompt with financial context
    let formattedUserPrompt = prompt;
    if (context && Object.keys(context).length > 0) {
      formattedUserPrompt = `[FINANCIAL CONTEXT]\n${JSON.stringify(context, null, 2)}\n\n[USER QUESTION]\n${prompt}`;
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: formattedUserPrompt });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const requestBody = {
      model,
      messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 1024,
    };

    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch {
          // Response was not JSON
        }

        const rawMessage = errorData?.message || errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
        const err = new Error(`Mistral API error: ${rawMessage}`);
        err.statusCode = response.status;
        err.provider = 'mistral';

        // Categorize errors for safe fallback decisions
        if (response.status === 401 || response.status === 403 || rawMessage.toLowerCase().includes('unauthorized') || rawMessage.toLowerCase().includes('api key')) {
          err.isAuthError = true;
          err.isTransient = false;
        } else if (response.status === 429 || rawMessage.toLowerCase().includes('rate limit') || rawMessage.toLowerCase().includes('quota')) {
          err.isRateLimit = true;
          err.isTransient = false;
        } else if (response.status >= 500) {
          err.isTransient = true;
        }

        throw err;
      }

      const data = await response.json();
      const choice = data?.choices?.[0];

      if (!choice || !choice.message?.content) {
        const err = new Error('Mistral returned an empty choice response');
        err.statusCode = 502;
        err.provider = 'mistral';
        err.isTransient = true;
        throw err;
      }

      const replyText = choice.message.content.trim();

      return {
        reply: replyText,
        provider: 'mistral',
        model,
        suggestions: options.suggestions || ['Analyze top expenses', 'How to save ₹2,000?', 'Review budget limits'],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error.name === 'AbortError' || controller.signal.aborted) {
        const timeoutErr = new Error(`Mistral request timed out after ${timeoutMs}ms`);
        timeoutErr.statusCode = 504;
        timeoutErr.isTimeout = true;
        timeoutErr.isTransient = true;
        timeoutErr.provider = 'mistral';
        throw timeoutErr;
      }

      // Mark network fetch failures as transient
      if (!error.provider) {
        error.provider = 'mistral';
        error.isTransient = true;
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  },
};

export default mistralProvider;
