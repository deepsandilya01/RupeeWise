import React from 'react';
import { ArrowRight, CheckCircle2, Cpu, LineChart, Target, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HowItWorksSection = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: '01',
      title: 'Connect & Log Outflows',
      desc: 'Record day-to-day spending via UPI, cards, cash, or import statements in 1 click with our bulk CSV engine.',
      icon: <UploadCloud className="w-6 h-6 text-coral-500" />,
      tag: 'Instant Capture',
      highlight: 'Zero manual spreadsheet errors',
    },
    {
      number: '02',
      title: 'Automated AI Intelligence',
      desc: 'Our Gemini & Mistral neural models categorize spending, calculate your Financial Wellness Score, and flag MoM budget spikes.',
      icon: <Cpu className="w-6 h-6 text-[#073746]" />,
      tag: 'Real-time Analysis',
      highlight: '98.5% categorization accuracy',
    },
    {
      number: '03',
      title: 'Personalized Action Engine',
      desc: 'Receive tailored, actionable money-saving opportunities grounded in your live cashflow, not generic financial platitudes.',
      icon: <LineChart className="w-6 h-6 text-coral-500" />,
      tag: 'Custom Advice',
      highlight: 'Save ₹3,000–₹8,000 every month',
    },
    {
      number: '04',
      title: 'Crush Savings Milestones',
      desc: 'Simulate compound SIP growth, enforce smart category thresholds, and watch your Emergency Fund and dream gadgets get funded.',
      icon: <Target className="w-6 h-6 text-[#073746]" />,
      tag: 'Wealth Goals',
      highlight: 'Automated progress pacing',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#FAF7F0] border-t border-gray-200/60 relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFEADB] text-[11px] font-bold uppercase tracking-wider text-[#073746]">
            HOW RUPEEWISE WORKS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#0B1D33] leading-tight">
            From Chaos to Clarity in <br />
            <span className="text-[#FF624F]">4 Effortless Steps.</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Follow the closed-loop financial action cycle: Analyze Spending → Identify Opportunity → Simulate Compounding → Achieve Milestones.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between text-left relative group overflow-hidden"
            >
              {/* Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#073746] via-[#FF624F] to-[#FFE5D4] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Step Number & Tag */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl font-black text-[#073746]/20 font-sans tracking-tight">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-peach-100 text-[#073746] border border-[#FED2B8]">
                    {step.tag}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-[#FAF6EE] border border-gray-200/80 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-extrabold text-[#0B1D33] tracking-tight mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Bottom Highlight */}
              <div className="pt-5 mt-5 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>{step.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-14 bg-white rounded-3xl p-6 sm:p-8 border border-[#FED2B8] shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6 max-w-4xl mx-auto text-left">
          <div className="space-y-1">
            <h4 className="text-lg font-extrabold text-[#0B1D33]">
              Experience it with live sample financial data
            </h4>
            <p className="text-xs text-gray-500">
              No sign-up or credit card required. Explore our full AI Money Coach in demo mode right now.
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center gap-2 bg-[#073746] hover:bg-[#0C2B35] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full shadow-card hover:shadow-elevated transition-all shrink-0"
          >
            <span>Launch Live Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
