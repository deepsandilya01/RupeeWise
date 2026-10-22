import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PricingSection = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      tagline: 'Ideal for students starting their budgeting journey',
      monthlyPrice: 0,
      annualPrice: 0,
      badge: null,
      isPopular: false,
      features: [
        'Unlimited transaction logging (UPI, card, cash)',
        'Up to 3 monthly budget categories',
        '2 active savings goals milestones',
        'Deterministic monthly cashflow summary',
        'CSV transaction export',
        'Student Money Community access',
      ],
      buttonLabel: 'Get Started Free',
      buttonVariant: 'secondary',
    },
    {
      id: 'pro',
      name: 'RupeeWise AI Pro',
      tagline: 'Full AI Money Coach powered by Gemini & Mistral',
      monthlyPrice: 99,
      annualPrice: 79,
      badge: 'Most Popular — Free for College Students',
      isPopular: true,
      features: [
        'Everything in Starter Plan',
        'Unlimited AI Money Coach queries (Gemini 3.5 & Mistral)',
        'What-If SIP compounding simulator engine',
        'Unlimited smart budget thresholds & MoM spike alerts',
        'Unlimited priority savings milestones',
        'Bulk bank CSV statement import engine',
        'Personalized Financial Wellness Score breakdown',
        'Automated savings recommendations',
      ],
      buttonLabel: 'Start 14-Day Free Trial',
      buttonVariant: 'primary',
    },
    {
      id: 'wealth',
      name: 'Wealth Navigator',
      tagline: 'Advanced portfolio tracking for working professionals',
      monthlyPrice: 249,
      annualPrice: 199,
      badge: 'For Fast Accumulators',
      isPopular: false,
      features: [
        'Everything in RupeeWise AI Pro',
        'Multi-account portfolio consolidation',
        'Tax regime optimization & harvesting insights',
        'Exportable Chartered Accountant (CA) tax packet',
        'Early access to new Gemini experimental models',
        'Priority 24/7 dedicated support',
      ],
      buttonLabel: 'Upgrade to Wealth',
      buttonVariant: 'secondary',
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-[#FAF6EE] relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFEADB] text-[11px] font-bold uppercase tracking-wider text-[#073746]">
            SIMPLE &amp; TRANSPARENT
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#0B1D33] leading-tight">
            Plans That Pay For Themselves in <br />
            <span className="text-[#FF624F]">Your First Week.</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Free forever for core tracking. College students get RupeeWise Pro free with any verified <code>.edu</code> or college email.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1 bg-white rounded-full border border-gray-200/90 shadow-2xs mt-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#073746] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-[#073746] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded-full bg-peach-100 text-coral-600 text-[10px] font-extrabold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan) => {
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 text-left ${
                  plan.isPopular
                    ? 'bg-white border-2 border-[#073746] shadow-elevated scale-102 lg:-translate-y-2'
                    : 'bg-[#FFFCF8] border border-gray-200/80 shadow-card hover:shadow-elevated'
                }`}
              >
                {/* Popular Pill */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#073746] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-coral-400" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <h3 className="text-xl font-extrabold text-[#0B1D33] tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 min-h-[32px]">
                    {plan.tagline}
                  </p>

                  {/* Price Display */}
                  <div className="my-6 pb-6 border-b border-gray-100 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-[#073746] tracking-tight">
                      ₹{price}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {price === 0 ? 'forever' : '/ month'}
                    </span>
                    {billingCycle === 'annual' && price > 0 && (
                      <span className="text-[10px] text-emerald-700 font-bold ml-1">
                        (billed annually)
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Included with plan:
                    </p>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-gray-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div>
                  <button
                    onClick={() => navigate('/register')}
                    className={`w-full py-3 px-6 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      plan.buttonVariant === 'primary'
                        ? 'bg-[#073746] hover:bg-[#0C2B35] text-white shadow-card hover:shadow-elevated'
                        : 'bg-white hover:bg-gray-100 text-[#073746] border border-gray-300'
                    }`}
                  >
                    <span>{plan.buttonLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-center text-gray-400 mt-2.5">
                    Cancel anytime with 1 click &bull; No lock-in
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
