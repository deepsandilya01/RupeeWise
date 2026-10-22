import config from '../../config/env.js';

export const geminiProvider = {
  name: 'gemini',

  /**
   * Check whether Gemini is configured with an API key
   * @returns {boolean}
   */
  isConfigured() {
    return Boolean(config.GEMINI_API_KEY && config.GEMINI_API_KEY.length > 0);
  },

  /**
   * Generate AI response using Google Gemini API
   * @param {Object} params
   * @param {string} params.prompt - User message / prompt
   * @param {string} [params.systemPrompt] - System instructions
   * @param {Object} [params.context] - Minimal financial context object
   * @param {Object} [params.options] - Optional overrides (model, temperature, timeoutMs)
   * @returns {Promise<{ reply: string, provider: string, model: string, suggestions: string[], timestamp: string }>}
   */
  async generateResponse({ prompt, systemPrompt, context, options = {} }) {
    if (!this.isConfigured()) {
      const err = new Error('Google Gemini API key is not configured in the server environment.');
      err.statusCode = 503;
      err.isConfigError = true;
      err.provider = 'gemini';
      throw err;
    }

    let model = options.model || config.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    if (model.includes('1.5') || model.includes('2.5-flash') || model === 'gemini-pro') {
      model = 'gemini-3.5-flash-lite';
    }
    const timeoutMs = options.timeoutMs || config.AI_TIMEOUT_MS || 10000;
    const apiKey = config.GEMINI_API_KEY;

    // Construct full grounded user prompt with financial context
    let formattedUserPrompt = prompt;
    if (context && Object.keys(context).length > 0) {
      formattedUserPrompt = `[FINANCIAL CONTEXT]\n${JSON.stringify(context, null, 2)}\n\n[USER QUESTION]\n${prompt}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: formattedUserPrompt }],
        },
      ],
      generationConfig: {
        temperature: options.temperature ?? 0.3,
        maxOutputTokens: options.maxTokens ?? 1024,
      },
    };

    if (systemPrompt) {
      requestBody.systemInstruction = {
        parts: [{ text: systemPrompt }],
      };
    }

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch {
          // Response body was not JSON
        }

        const rawMessage = errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
        const err = new Error(`Gemini API error: ${rawMessage}`);
        err.statusCode = response.status;
        err.provider = 'gemini';

        // Categorize errors for safe fallback decisions
        if (response.status === 401 || response.status === 403 || rawMessage.toLowerCase().includes('api_key')) {
          err.isAuthError = true;
          err.isTransient = false;
        } else if (response.status === 429 || rawMessage.toLowerCase().includes('quota') || rawMessage.toLowerCase().includes('rate limit')) {
          err.isRateLimit = true;
          err.isTransient = false;
        } else if (response.status >= 500) {
          err.isTransient = true;
        }

        throw err;
      }

      const data = await response.json();
      const candidate = data?.candidates?.[0];

      if (!candidate || !candidate.content?.parts?.[0]?.text) {
        const finishReason = candidate?.finishReason;
        const err = new Error(`Gemini returned an empty candidate response (Finish reason: ${finishReason || 'unknown'})`);
        err.statusCode = 502;
        err.provider = 'gemini';
        err.isTransient = true;
        throw err;
      }

      const replyText = candidate.content.parts[0].text.trim();

      return {
        reply: replyText,
        provider: 'gemini',
        model,
        suggestions: options.suggestions || ['Analyze top expenses', 'How to save ₹2,000?', 'Review budget limits'],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error.name === 'AbortError' || controller.signal.aborted) {
        const timeoutErr = new Error(`Gemini request timed out after ${timeoutMs}ms`);
        timeoutErr.statusCode = 504;
        timeoutErr.isTimeout = true;
        timeoutErr.isTransient = true;
        timeoutErr.provider = 'gemini';
        throw timeoutErr;
      }

      // Mark network fetch failures (e.g. DNS or connect timeout) as transient
      if (!error.provider) {
        error.provider = 'gemini';
        error.isTransient = true;
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  },
};

export default geminiProvider;
