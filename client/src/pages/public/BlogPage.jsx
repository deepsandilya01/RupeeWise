import React, { useState } from 'react';
import LandingNavbar from '../../components/landing/LandingNavbar.jsx';
import LandingFooter from '../../components/landing/LandingFooter.jsx';
import { Search, BookOpen, Clock, Tag, ArrowRight, Sparkles, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BlogPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeArticle, setActiveArticle] = useState(null);

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'budgeting', label: 'Smart Budgeting' },
    { id: 'sip', label: 'SIP & Investing' },
    { id: 'student', label: 'Student Finance' },
    { id: 'taxes', label: 'Taxes & Planning' },
  ];

  const articles = [
    {
      id: '50-30-20-rule',
      category: 'budgeting',
      categoryLabel: 'Smart Budgeting',
      title: 'The 50-30-20 Rule Adapted for Indian Metro & Tier-2 Living',
      readTime: '4 min read',
      date: 'Oct 20, 2026',
      excerpt: 'Standard budgeting books assume Western expenses. Here is how to realistically split high Indian rent, food delivery, and SIP wealth building on a ₹30K–₹90K salary.',
      content: `The traditional 50/30/20 rule suggests dividing your monthly take-home salary into three buckets:
• 50% for Needs: Rent, groceries, electricity, internet, minimum EMI commitments.
• 30% for Wants: Zomato, weekend trips, movies, shopping, OTT subscriptions.
• 20% for Savings & Investments: Mutual Fund SIPs, Emergency corpus, Sovereign Gold.

In Indian metros like Bengaluru, Mumbai, or Delhi-NCR, rent alone often eats 30–35% of a fresher's paycheck. If your rent is high, RupeeWise recommends adopting the **55-25-20 formula**:
1. Cap flexible food orders and dining out to 12% of net income.
2. Automate your 20% SIP on the 1st or 2nd of each month before discretionary spending starts.
3. Keep 6 months of basic living costs safely in a high-yield liquid fund or sweep-in FD as an untouched emergency barrier.`,
    },
    {
      id: 'sip-vs-fd',
      category: 'sip',
      categoryLabel: 'SIP & Investing',
      title: 'Why Compounding in an Index Mutual Fund Beats Fixed Deposits for Under-30s',
      readTime: '6 min read',
      date: 'Oct 18, 2026',
      excerpt: 'With inflation hovering at 5.5%, your 6.8% bank FD is yielding less than 1% real post-tax returns. Discover the power of disciplined ₹1,000/month compounding.',
      content: `A lot of beginners in India leave surplus salary sitting in savings accounts at 3% or lock everything into FDs. While FDs provide capital guarantee, they lose purchasing power against real urban inflation.

Consider investing ₹3,000 every month via a Systematic Investment Plan (SIP) in a low-cost Nifty 50 Index Fund averaging 12% annualized historical returns:
• In 5 years: Invested ₹1.8 Lakhs → Value ~₹2.47 Lakhs
• In 10 years: Invested ₹3.6 Lakhs → Value ~₹6.97 Lakhs
• In 20 years: Invested ₹7.2 Lakhs → Value ~₹29.97 Lakhs!

Notice that in 20 years, your profit (₹22.7 Lakhs) is over TRIPLE what you invested. The earlier you begin, the more heavy lifting compounding does for you.`,
    },
    {
      id: 'hidden-subscriptions',
      category: 'student',
      categoryLabel: 'Student Finance',
      title: 'Top 7 Hidden Subscriptions Draining Your Monthly UPI Balance',
      readTime: '5 min read',
      date: 'Oct 15, 2026',
      excerpt: 'Autopay mandates can slowly siphon ₹1,500–₹3,000 monthly without a notification ringing. Here is how to audit your active mandates in under 5 minutes.',
      content: `Between cloud storage, gym apps, OTT platforms, food delivery gold memberships, and gaming passes, automated micro-charges add up quickly:
1. Review your NPCI UPI Autopay dashboard inside your primary payment app (Google Pay, PhonePe, or Paytm).
2. Cancel multi-screen OTT plans if you only watch on your phone or share with flatmates.
3. Utilize student discount plans for Spotify (₹59/mo instead of ₹119/mo) and YouTube Premium.
4. RupeeWise AI automatically detects recurring merchant debits and flags dormant services so you never pay for forgotten subscriptions.`,
    },
    {
      id: 'tax-saving-regimes',
      category: 'taxes',
      categoryLabel: 'Taxes & Planning',
      title: 'New vs Old Tax Regime: Which Saves More Money for Salaried Employees?',
      readTime: '7 min read',
      date: 'Oct 12, 2026',
      excerpt: 'With standard deductions increased and rebate thresholds updated, should you claim HRA and 80C or switch to the simpler New Tax Regime?',
      content: `The New Tax Regime offers lower slab rates without requiring complicated documentation, receipts, or fake rent slips:
• Under ₹7 Lakhs taxable income: Nil tax liability after Section 87A rebate.
• Standard Deduction: ₹75,000 standard deduction available to all salaried taxpayers.
• Old Regime Advantage: Beneficial only if total deductions (HRA + 80C + 80D health insurance + home loan interest) exceed ₹3.75 Lakhs to ₹4.25 Lakhs per annum.

For young professionals without active home loans, the New Tax Regime is mathematically superior in over 85% of cases.`,
    },
    {
      id: 'emergency-fund-guide',
      category: 'budgeting',
      categoryLabel: 'Smart Budgeting',
      title: 'Emergency Funds 101: Where to Park It and How Much to Save',
      readTime: '5 min read',
      date: 'Oct 08, 2026',
      excerpt: 'Never invest your emergency fund in volatile equity stocks or crypto. Learn how to construct a liquid, accessible 6-month safety buffer.',
      content: `Your emergency fund is not an investment to generate wealth; it is an insurance policy against job transitions, medical emergencies, or family crises:
• Calculate Baseline Needs: Sum monthly rent, utilities, basic groceries, and mandatory loan EMIs.
• Target Size: 3 to 6 months of this baseline number (e.g. ₹25,000/mo × 6 = ₹1,50,000).
• Ideal Allocation: 
  - 30% in a high-interest savings account with debit card access.
  - 70% in high-credit-quality Liquid Mutual Funds (T+1 day redemption) or sweep-in flexi FDs.
• Never touch this corpus for flash sales, festive shopping, or holiday tickets.`,
    },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#0B1D33] font-sans antialiased flex flex-col justify-between select-none">
      <div>
        <LandingNavbar />

        {/* Hero Header */}
        <div className="py-14 sm:py-18 bg-[#FAF7F0] border-b border-gray-200/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFEADB] text-[11px] font-bold uppercase tracking-wider text-[#073746]">
              <BookOpen className="w-3.5 h-3.5 text-coral-500" />
              <span>FINANCIAL LITERACY HUB</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1D33]">
              Smart Money Knowledge for <br />
              <span className="text-[#FF624F]">Real Life in India.</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Clear, practical guides without Wall Street jargon. Master budgeting, mutual funds, UPI safety, and student savings.
            </p>

            {/* Search Input */}
            <div className="pt-4 max-w-md mx-auto relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles, SIPs, budgets, taxes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 bg-white text-xs text-[#0B1D33] focus:outline-none focus:ring-2 focus:ring-[#073746]/30 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-bold border-b border-gray-200/80">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === c.id
                    ? 'bg-[#073746] text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-peach-100 text-[#073746] font-bold">
                      {article.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-extrabold text-[#0B1D33] tracking-tight group-hover:text-[#073746] transition-colors leading-snug mb-2.5">
                    {article.title}
                  </h2>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">
                    {article.date}
                  </span>
                  <button
                    onClick={() => setActiveArticle(article)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#073746] hover:text-coral-500 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* AI Money Coach Teaser Banner */}
          <div className="mt-16 bg-gradient-to-br from-[#073746] to-[#0C2B35] rounded-3xl p-8 text-white text-left flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-elevated">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-peach-200 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-coral-400" />
                <span>AI-Powered Personal Advice</span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight">
                Have specific financial questions about your money?
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Ask RupeeWise AI Money Coach directly. We analyze your live income and outflows to generate personalized, deterministic answers.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center gap-2 bg-[#FF624F] hover:bg-[#EB4F3C] text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-full shadow-card shrink-0 transition-transform active:scale-98"
            >
              <span>Ask AI Coach</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs text-left">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-gray-200 shadow-2xl max-h-[85vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="px-3 py-1 rounded-full bg-peach-100 text-[#073746] text-xs font-bold">
                {activeArticle.categoryLabel}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="text-gray-400 hover:text-gray-700 text-xs font-bold px-2 py-1 rounded-lg hover:bg-gray-100"
              >
                Close ✕
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1D33] tracking-tight">
              {activeArticle.title}
            </h2>

            <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line space-y-2 bg-[#FAF6EE] p-5 rounded-2xl border border-gray-200/70">
              {activeArticle.content}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 rounded-full bg-[#073746] text-white text-xs font-bold hover:bg-[#0C2B35]"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      <LandingFooter />
    </div>
  );
};

export default BlogPage;
