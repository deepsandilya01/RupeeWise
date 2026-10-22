import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import LandingNavbar from '../../components/landing/LandingNavbar.jsx';
import LandingFooter from '../../components/landing/LandingFooter.jsx';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#0B1D33] font-sans antialiased flex flex-col justify-between">
      <LandingNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full text-left space-y-8">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#073746] hover:text-coral-500 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-peach-100 text-coral-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1D33] tracking-tight">
                Terms of Service
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Effective Date: October 2026 &bull; RupeeWise AI Platform Terms</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-6 text-xs sm:text-sm leading-relaxed text-gray-700">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#073746]">1. Acceptance of Terms</h2>
            <p>
              By creating an account or accessing RupeeWise AI, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you should discontinue using the application.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#073746]">2. Nature of the Service &amp; Financial Disclaimer</h2>
            <p>
              RupeeWise AI is an educational personal finance management, tracking, and budgeting tool. It provides analytical projections, AI Money Coach insights, and expense summaries for personal planning purposes only.
            </p>
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-amber-900 text-xs font-medium">
              <strong>Notice</strong>: RupeeWise AI does not provide licensed investment advisory, certified financial planning, tax preparation, or legal counsel. Projected savings in the What-If Simulator are mathematical estimates and not guaranteed investment returns.
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#073746]">3. User Responsibilities &amp; Account Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree not to upload malicious scripts, attempt unauthorized database access, or probe administrative endpoints without authorization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#073746]">4. Intellectual Property</h2>
            <p>
              The RupeeWise AI branding, algorithms, interface designs, logos, and software code are the intellectual property of RupeeWise AI. All user-entered transaction data remains the exclusive property of the individual account holder.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#073746]">5. Contact &amp; Queries</h2>
            <p>
              For legal notices or questions regarding these terms, please contact our support team at <Link to="/help" className="text-[#073746] font-bold underline">Help &amp; Support</Link>.
            </p>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default TermsPage;
