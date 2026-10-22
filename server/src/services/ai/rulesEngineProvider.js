export const rulesEngineProvider = {
  name: 'rules-based',

  isConfigured() {
    return true;
  },

  /**
   * Deterministic RupeeWise Financial Rules Engine
   * @param {Object} params
   * @param {string} params.query
   * @param {Object} params.analysis
   * @param {Array} params.goals
   * @returns {Object}
   */
  generateResponse({ query, analysis, goals = [] }) {
    const q = (query || '').toLowerCase().trim();
    const { currentSummary = {}, momComparisons = [], smallExpenses = {}, wellnessScore = {} } = analysis || {};
    const income = Number(currentSummary.monthlyIncome || 0);
    const expenses = Number(currentSummary.monthlyExpenses || 0);
    const net = Number(currentSummary.netCashFlow || 0);
    const savingsRate = Number(currentSummary.savingsRate || 0);

    // 1. Greetings & Introductory questions ("hi", "hello", "hey", "who are you")
    if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('who are you') || q.includes('what can you do')) {
      return {
        reply: `Hello! I am your **RupeeWise AI Money Coach**.\n\nI can help you with:\n* **Spending Analysis**: Discover your highest expense categories and leakage.\n* **Saving Plans**: Practical steps to trim dining, subscriptions, and micro-spends.\n* **Budgeting**: Implement the 50/30/20 rule customized to your exact income.\n* **Investments & Goals**: Guidance on SIPs, emergency funds, debt management, and future wealth targets.\n\nHow can I help you take control of your money today?`,
        provider: 'rules-based',
        model: 'RupeeWise Deterministic Financial Rules Engine',
        suggestions: ['Where is most of my money going?', 'How can I save ₹2,000 every month?', 'Help me create a monthly budget', 'What is an emergency fund?'],
        timestamp: new Date().toISOString(),
      };
    }

    // 2. "Where is most of my money going?" / "Analyze spending"
    if (q.includes('where') || q.includes('spending') || q.includes('going') || q.includes('breakdown')) {
      const topCat = (currentSummary.categories || [])[0];
      if (!topCat || expenses === 0) {
        return {
          reply: `You haven't recorded any expenses for this month yet. Once you log transactions or import your bank statement, I will break down your exact spending patterns!`,
          provider: 'rules-based',
          model: 'RupeeWise Deterministic Financial Rules Engine',
          suggestions: ['Add a transaction', 'Help me create a budget', 'Set a savings goal'],
          timestamp: new Date().toISOString(),
        };
      }

      const top3 = (currentSummary.categories || [])
        .slice(0, 3)
        .map((c) => `* **${c.category}**: ₹${Number(c.total).toLocaleString('en-IN')} (${c.percentage}%)`)
        .join('\n');

      return {
        reply: `Here is where your money went this month:\n\n${top3}\n\nYour highest outflow was in **${topCat.category}** accounting for **${topCat.percentage}%** of total expenses (₹${Number(topCat.total).toLocaleString('en-IN')}). Consider setting a monthly spending limit in your Budget tab to cap non-essential spikes.`,
        provider: 'rules-based',
        model: 'RupeeWise Deterministic Financial Rules Engine',
        suggestions: ['How can I save ₹2,000?', 'Which expenses increased?', 'Create a budget'],
        timestamp: new Date().toISOString(),
      };
    }

    // 3. "How can I save ₹2,000 every month?" / "Saving tips"
    if (q.includes('save') || q.includes('saving') || q.includes('2,000') || q.includes('2000')) {
      const dining = (currentSummary.categories || []).find((c) =>
        c.category.toLowerCase().includes('dining') || c.category.toLowerCase().includes('food')
      );

      const targetCut = dining && dining.total >= 3000 ? Math.round(dining.total * 0.25) : 2000;
      const weeklyCut = Math.round(targetCut / 4);

      return {
        reply: `Based on your recorded transactions, here is a practical plan to save ~₹2,000/month:\n\n1. **Dining & Delivery**: Trimming ₹${weeklyCut.toLocaleString('en-IN')}/week (about 1-2 restaurant meals or food orders) will free up ~₹${targetCut.toLocaleString('en-IN')}/month.\n2. **Micro-transactions**: Consolidating quick discretionary purchases could recover ~₹${Math.round((smallExpenses.total || 1500) * 0.3).toLocaleString('en-IN')}/month.\n\nOver 12 months, this would accumulate **₹24,000** in your cash buffer!`,
        provider: 'rules-based',
        model: 'RupeeWise Deterministic Financial Rules Engine',
        suggestions: ['Simulate this in What-If', 'Set up a dining budget', 'Track savings goal'],
        timestamp: new Date().toISOString(),
      };
    }

    // 4. "Which expenses increased this month?" / "MoM comparisons"
    if (q.includes('increased') || q.includes('increase') || q.includes('spiked') || q.includes('more than last month')) {
      const increases = (momComparisons || []).filter((m) => m.isIncrease && m.difference > 0);
      if (increases.length === 0) {
        return {
          reply: `Great news! None of your major expense categories showed a noticeable increase compared to last month. Your spending discipline is holding steady.`,
          provider: 'rules-based',
          model: 'RupeeWise Deterministic Financial Rules Engine',
          suggestions: ['Where is most money going?', 'How much can I save in 12 months?'],
          timestamp: new Date().toISOString(),
        };
      }

      const list = increases
        .slice(0, 3)
        .map((m) => `* **${m.category}**: +₹${Number(m.difference).toLocaleString('en-IN')} (+${m.percentageChange}% vs last month)`)
        .join('\n');

      return {
        reply: `The following categories increased in spending compared to last month:\n\n${list}\n\nReviewing these categories can help you spot recurring seasonal costs or lifestyle creep before they become habits.`,
        provider: 'rules-based',
        model: 'RupeeWise Deterministic Financial Rules Engine',
        suggestions: ['Set category budget', 'Simulate reduction', 'Ask anything'],
        timestamp: new Date().toISOString(),
      };
    }

    // 5. "Can I afford a major purchase?" / "Big purchase"
    if (q.includes('afford') || q.includes('major purchase') || q.includes('big purchase') || q.includes('laptop') || q.includes('car') || q.includes('iphone')) {
      if (net > 15000) {
        return {
          reply: `With your current monthly net surplus of **₹${net.toLocaleString('en-IN')}** (savings rate **${savingsRate}%**), you have solid discretionary capacity!\n\n* **Recommendation**: Rather than using emergency funds, allocate **₹${Math.round(net * 0.4).toLocaleString('en-IN')}/month** toward a dedicated savings goal.\n* You can comfortably fund a major purchase without taking high-interest consumer debt.`,
          provider: 'rules-based',
          model: 'RupeeWise Deterministic Financial Rules Engine',
          suggestions: ['Create a goal for this purchase', 'Simulate timeline in What-If'],
          timestamp: new Date().toISOString(),
        };
      }

      return {
        reply: `Your current monthly net surplus is **₹${Math.max(0, net).toLocaleString('en-IN')}**. A major purchase right now may strain your cashflow buffer.\n\n* **Recommendation**: Consider delaying discretionary big-ticket purchases by 2-3 months while setting aside ₹2,000–₹3,000 monthly in a target goal.`,
        provider: 'rules-based',
        model: 'RupeeWise Deterministic Financial Rules Engine',
        suggestions: ['How can I save ₹2,000?', 'Where is money going?'],
        timestamp: new Date().toISOString(),
      };
    }

    // 6. "How much could I save in 12 months?" / "12 months" / "future"
    if (q.includes('12 months') || q.includes('year') || q.includes('accumulate') || q.includes('annual')) {
      const positiveNet = Math.max(2000, net);
      const annualCurrent = positiveNet * 12;
      const annualOptimized = (positiveNet + 2500) * 12;

      return {
        reply: `Based on your monthly net cashflow (₹${positiveNet.toLocaleString('en-IN')}/mo):\n\n* **At Current Pace**: You will accumulate **₹${annualCurrent.toLocaleString('en-IN')}** in 12 months.\n* **With ₹2,500/mo Optimization**: You could accumulate **₹${annualOptimized.toLocaleString('en-IN')}** (+₹30,000 extra)!\n\nCheck out the **What-If Simulator** to visualize compounding returns.`,
        provider: 'rules-based',
        model: 'RupeeWise Deterministic Financial Rules Engine',
        suggestions: ['Open What-If Simulator', 'Plan for a big purchase', 'Create a budget'],
        timestamp: new Date().toISOString(),
      };
    }

    // 7. "Help me create a monthly budget" / "Budget" / "50/30/20"
    if (q.includes('budget') || q.includes('50/30/20') || q.includes('limits')) {
      const userIncome = income > 0 ? income : 50000;
      const needs = Math.round(userIncome * 0.5);
      const wants = Math.round(userIncome * 0.3);
      const savings = Math.round(userIncome * 0.2);

      return {
        reply: `Using the proven **50/30/20 Framework** tailored to your monthly income of **₹${userIncome.toLocaleString('en-IN')}**:\n\n1. **Essential Needs (50%)**: ~₹${needs.toLocaleString('en-IN')} (Rent, Groceries, Utilities, Transport)\n2. **Discretionary Wants (30%)**: ~₹${wants.toLocaleString('en-IN')} (Dining, Shopping, Entertainment)\n3. **Savings & Goals (20%)**: ~₹${savings.toLocaleString('en-IN')} (Emergency Fund, SIP, Debt payoff)\n\nYou can set hard category caps in your Budget tab to get alerts when you approach these limits.`,
        provider: 'rules-based',
        model: 'RupeeWise Deterministic Financial Rules Engine',
        suggestions: ['Set category budgets', 'Review dining expenses', 'Simulate savings'],
        timestamp: new Date().toISOString(),
      };
    }

    // 8. SIP & Mutual Funds & Equity Investments
    if (q.includes('sip') || q.includes('mutual fund') || q.includes('stock') || q.includes('equity') || q.includes('invest')) {
      const suggestedSip = Math.max(1000, Math.round(net * 0.5));
      return {
        reply: `Here is a clear guide on **SIP (Systematic Investment Plan)** and Mutual Funds in India:\n\n* **What is a SIP?**: An automated monthly deposit into a mutual fund scheme, capturing rupee-cost averaging.\n* **Suggested Allocation from Cashflow**: With your net surplus of **₹${net.toLocaleString('en-IN')}/mo**, you could comfortably start an SIP of **₹${suggestedSip.toLocaleString('en-IN')}/mo**.\n* **Beginner Tip**: Broad-market Nifty 50 or Large & Midcap index funds are low-cost, transparent vehicles for long-term compounding.\n* **Time Horizon**: Aim for a minimum 5-7 year horizon for equity funds to weather market cycles.`,
        provider: 'rules-based',
        model: 'RupeeWise Deterministic Financial Rules Engine',
        suggestions: ['How to start an emergency fund?', 'Help me create a budget', 'Where is my money going?'],
        timestamp: new Date().toISOString(),
      };
    }

    // 9. Emergency Fund & Safety Net
    if (q.includes('emergency') || q.includes('liquid') || q.includes('safety net')) {
      const monthlyNeed = expenses > 0 ? expenses : 30000;
      const targetFund = monthlyNeed * 6;
      return {
        reply: `An **Emergency Fund** is your essential financial shock absorber:\n\n* **Rule of Thumb**: Keep **3 to 6 months** of essential living expenses (₹${monthlyNeed.toLocaleString('en-IN')}/mo).\n* **Your Ideal Target**: Approximately **₹${targetFund.toLocaleString('en-IN')}**.\n* **Where to Park It**: Liquid Mutual Funds or High-yield Savings Accounts with instant redemption—never lock it in long-term locked instruments.\n* **Step 1**: Build the first ₹25,000 milestone before aggressive long-term equity investing.`,
        provider: 'rules-based',
        model: 'RupeeWise Deterministic Financial Rules Engine',
        suggestions: ['Set emergency fund goal', 'How can I save ₹2,000?', 'Create a budget'],
        timestamp: new Date().toISOString(),
      };
    }

    // 10. Debt, Credit Cards & Loans (EMI)
    if (q.includes('loan') || q.includes('emi') || q.includes('credit card') || q.includes('debt')) {
      return {
        reply: `Strategies for managing debt and credit effectively:\n\n* **High-Interest Debt First (Avalanche)**: Prioritize credit card balances (36–42% p.a.) and personal loans immediately.\n* **Credit Card Golden Rule**: Always pay the **Total Amount Due**, never just the Minimum Amount Due.\n* **EMI Limit**: Total monthly EMIs should not exceed **30-40%** of your monthly income (₹${income.toLocaleString('en-IN')}).\n* **Emergency Buffer**: Maintain a small cash buffer even while paying down debt to prevent taking new debt during unexpected expenses.`,
        provider: 'rules-based',
        model: 'RupeeWise Deterministic Financial Rules Engine',
        suggestions: ['Review monthly expenses', 'How can I save ₹2,000?', 'Check wellness score'],
        timestamp: new Date().toISOString(),
      };
    }

    // 11. Credit Score / CIBIL
    if (q.includes('cibil') || q.includes('credit score')) {
      return {
        reply: `Key factors to build and maintain a strong **CIBIL Score (750+)**:\n\n1. **On-Time Payments (35% weight)**: Never miss an EMI or credit card due date.\n2. **Credit Utilization Ratio (30% weight)**: Keep total card usage below **30%** of your approved credit limit.\n3. **Credit Age (15% weight)**: Avoid closing your oldest credit card accounts.\n4. **Healthy Credit Mix (10% weight)**: A balance of secured loans (home/car) and unsecured cards over time.\n5. **Limit Hard Inquiries (10% weight)**: Do not apply for multiple credit cards or personal loans within short intervals.`,
        provider: 'rules-based',
        model: 'RupeeWise Deterministic Financial Rules Engine',
        suggestions: ['How to manage loans?', 'Help me create a budget'],
        timestamp: new Date().toISOString(),
      };
    }

    // 12. Taxes & Section 80C
    if (q.includes('tax') || q.includes('80c') || q.includes('deduction')) {
      return {
        reply: `Tax-saving avenues under the Old vs New Tax Regime in India:\n\n* **Section 80C (up to ₹1,50,000)**: ELSS Tax-Saver Mutual Funds (3-year lock-in), PPF (15-year lock-in), EPF, and Term Insurance.\n* **Section 80D**: Health insurance premiums up to ₹25,000 for self/family, +₹50,000 for senior citizen parents.\n* **New vs Old Regime**: The New Regime has lower tax slabs with standard deduction (₹75,000), but eliminates most 80C/80D deductions. Choose based on your total available deductions.`,
        provider: 'rules-based',
        model: 'RupeeWise Deterministic Financial Rules Engine',
        suggestions: ['What is SIP?', 'Help me create a budget'],
        timestamp: new Date().toISOString(),
      };
    }

    // 13. General / Free-form Question Fallback (Personalized cashflow grounding)
    return {
      reply: `Here is a summary of your financial snapshot and personalized insights:\n\n* **Monthly Income**: ₹${income.toLocaleString('en-IN')}\n* **Monthly Expenses**: ₹${expenses.toLocaleString('en-IN')}\n* **Net Cashflow Surplus**: ₹${net.toLocaleString('en-IN')} (${savingsRate}% savings rate)\n* **Financial Wellness Score**: ${wellnessScore?.score || 75}/100\n\n**Financial Coach Guidance**:\n* Keep essential expenses capped below 50% of your income.\n* Put your net surplus of **₹${net.toLocaleString('en-IN')}** to work via automated monthly SIPs and emergency buffer contributions.\n* Set spending limits for your top categories to prevent discretionary lifestyle creep.`,
      provider: 'rules-based',
      model: 'RupeeWise Deterministic Financial Rules Engine',
      suggestions: [
        'Where is most of my money going?',
        'How can I save ₹2,000 every month?',
        'What is an emergency fund?',
        'Help me create a monthly budget',
      ],
      timestamp: new Date().toISOString(),
    };
  },
};

export default rulesEngineProvider;
