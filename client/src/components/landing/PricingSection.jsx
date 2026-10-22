import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, Zap, ShieldCheck, Crown, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PricingSection = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      tagline: 'Perfect for students beginning their financial journey',
      monthlyPrice: 0,
      annualPrice: 0,
      badge: null,
      isPopular: false,
      icon: <Zap className="w-5 h-5 text-[#073746]" />,
      accentColor: '#073746',
      features: [
        'Unlimited transaction logging (UPI, card, cash)',
        'Up to 3 monthly budget categories',
        '2 active savings goals',
        'Monthly cashflow summary',
        'CSV transaction export',
        'Student Money Community access',
      ],
      buttonLabel: 'Get Started Free',
      buttonVariant: 'secondary',
    },
    {
      id: 'pro',
      name: 'AI Pro',
      tagline: 'Full AI Money Coach powered by Gemini & Mistral',
      monthlyPrice: 99,
      annualPrice: 79,
      badge: 'Most Popular',
      isPopular: true,
      icon: <Sparkles className="w-5 h-5 text-white" />,
      accentColor: '#FF624F',
      features: [
        'Everything in Starter',
        'Unlimited AI Money Coach queries',
        'Gemini 2.5 & Mistral model access',
        'What-If SIP compounding simulator',
        'Unlimited smart budgets & alerts',
        'Unlimited savings milestones',
        'Bulk bank CSV statement import',
        'Financial Wellness Score',
        'Automated savings tips',
      ],
      buttonLabel: 'Start 14-Day Free Trial',
      buttonVariant: 'primary',
    },
    {
      id: 'wealth',
      name: 'Wealth',
      tagline: 'Advanced tracking & tax tools for working professionals',
      monthlyPrice: 249,
      annualPrice: 199,
      badge: 'For Professionals',
      isPopular: false,
      icon: <Crown className="w-5 h-5 text-[#073746]" />,
      accentColor: '#073746',
      features: [
        'Everything in AI Pro',
        'Multi-account portfolio consolidation',
        'Tax regime optimization insights',
        'CA-ready tax export packet',
        'MoM spending spike deep-dives',
        'Early access to new AI models',
        'Priority email & chat support',
      ],
      buttonLabel: 'Upgrade to Wealth',
      buttonVariant: 'secondary',
    },
    {
      id: 'enterprise',
      name: 'Family & Teams',
      tagline: 'Shared finance management for families, groups & small teams',
      monthlyPrice: 499,
      annualPrice: 399,
      badge: 'Best Value for Groups',
      isPopular: false,
      icon: <Users className="w-5 h-5 text-[#073746]" />,
      accentColor: '#073746',
      features: [
        'Everything in Wealth',
        'Up to 6 linked member accounts',
        'Shared household budgets & goals',
        'Consolidated family expense reports',
        'Role-based spending permissions',
        'Dedicated relationship manager',
        'Custom AI coaching for each member',
        'SSO & admin dashboard (teams)',
      ],
      buttonLabel: 'Contact for Teams',
      buttonVariant: 'secondary',
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-[#FAF6EE] relative select-none overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-[#FFEADB]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#FFD6C4]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFEADB] text-[11px] font-bold uppercase tracking-wider text-[#073746]">
            SIMPLE &amp; TRANSPARENT
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#0B1D33] leading-tight">
            Plans That Pay For Themselves in <br />
            <span className="text-[#FF624F]">Your First Week.</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Free forever for core tracking. College students get AI Pro free with any verified <code className="bg-white/80 px-1.5 py-0.5 rounded text-[#073746] font-semibold">.edu</code> or college email.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1 bg-white rounded-full border border-gray-200/90 shadow-sm mt-5">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-[#073746] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                billingCycle === 'annual'
                  ? 'bg-[#073746] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Annual</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid — 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 text-left ${
                  plan.isPopular
                    ? 'bg-[#073746] text-white border-2 border-[#073746] shadow-xl xl:-translate-y-3 scale-[1.02]'
                    : 'bg-white border border-gray-200/80 shadow-md hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Badge Pill */}
                {plan.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${
                      plan.isPopular
                        ? 'bg-[#FF624F] text-white'
                        : 'bg-[#073746] text-white'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div>
                  {/* Icon + Plan Name */}
                  <div className="flex items-center gap-2.5 mt-1">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        plan.isPopular
                          ? 'bg-white/15'
                          : 'bg-[#FAF6EE]'
                      }`}
                    >
                      {plan.icon}
                    </div>
                    <h3
                      className={`text-lg font-extrabold tracking-tight ${
                        plan.isPopular ? 'text-white' : 'text-[#0B1D33]'
                      }`}
                    >
                      {plan.name}
                    </h3>
                  </div>
                  <p
                    className={`text-xs mt-2 min-h-[36px] leading-relaxed ${
                      plan.isPopular ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {plan.tagline}
                  </p>

                  {/* Price Display */}
                  <div
                    className={`my-5 pb-5 flex items-baseline gap-1 ${
                      plan.isPopular ? 'border-b border-white/15' : 'border-b border-gray-100'
                    }`}
                  >
                    <span
                      className={`text-4xl font-black tracking-tight ${
                        plan.isPopular ? 'text-white' : 'text-[#073746]'
                      }`}
                    >
                      ₹{price}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        plan.isPopular ? 'text-white/60' : 'text-gray-500'
                      }`}
                    >
                      {price === 0 ? 'forever' : '/ mo'}
                    </span>
                    {billingCycle === 'annual' && price > 0 && (
                      <span
                        className={`text-[10px] font-bold ml-1 ${
                          plan.isPopular ? 'text-emerald-300' : 'text-emerald-700'
                        }`}
                      >
                        billed yearly
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-6">
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        plan.isPopular ? 'text-white/50' : 'text-gray-400'
                      }`}
                    >
                      What's included:
                    </p>
                    {plan.features.map((feature, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 text-xs ${
                          plan.isPopular ? 'text-white/90' : 'text-gray-700'
                        }`}
                      >
                        <Check
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            plan.isPopular ? 'text-emerald-400' : 'text-emerald-600'
                          }`}
                        />
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div>
                  <button
                    onClick={() => navigate('/register')}
                    className={`w-full py-3 px-5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                      plan.isPopular
                        ? 'bg-[#FF624F] hover:bg-[#e5533f] text-white shadow-lg hover:shadow-xl'
                        : plan.buttonVariant === 'primary'
                          ? 'bg-[#073746] hover:bg-[#0C2B35] text-white shadow-md hover:shadow-lg'
                          : 'bg-[#FAF6EE] hover:bg-[#F0EAE0] text-[#073746] border border-gray-200'
                    }`}
                  >
                    <span>{plan.buttonLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p
                    className={`text-[10px] text-center mt-2.5 ${
                      plan.isPopular ? 'text-white/40' : 'text-gray-400'
                    }`}
                  >
                    {price === 0 ? 'No credit card required' : 'Cancel anytime · No lock-in'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom trust banner */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-sm border border-gray-200/60 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-gray-600">
              256-bit encryption · RBI-compliant · SOC 2 certified · Data stored in India
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
