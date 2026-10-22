import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, FileText } from 'lucide-react';
import LandingNavbar from '../../components/landing/LandingNavbar.jsx';
import LandingFooter from '../../components/landing/LandingFooter.jsx';

export const PrivacyPage = () => {
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
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1D33] tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Last updated: October 2026 &bull; RupeeWise AI Security Practice</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-6 text-xs sm:text-sm leading-relaxed text-gray-700">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#073746]">1. Commitment to Financial Privacy</h2>
            <p>
              At RupeeWise AI, we believe your financial records belong exclusively to you. We are committed to maintaining the confidentiality, integrity, and security of all personal and financial data entrust to our platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#073746]">2. Information We Collect</h2>
            <p>
              We collect information strictly necessary to provide intelligent personal finance tracking:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Account Credentials</strong>: Name, email address, hashed passwords (via bcrypt salt factor 12), and verified Google profile identities.</li>
              <li><strong>Transaction Records</strong>: Date, merchant/payee name, category, amount, and payment mode logged or imported by the user.</li>
              <li><strong>Financial Planning Goals</strong>: User-defined budget thresholds, savings goals, and simulator projection variables.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#073746]">3. AI Data Handling &amp; Zero Provider Leakage</h2>
            <p>
              When communicating with AI providers (Google Gemini or Mistral AI) for Money Coach guidance:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>We <strong>never</strong> transmit user credentials, session tokens, database identifiers, or raw banking passwords.</li>
              <li>Prompts only receive anonymized mathematical aggregates (e.g. monthly expense total and top categories) solely to answer your questions.</li>
              <li>Neither Google nor Mistral uses your transient personal session queries to train public machine learning models.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#073746]">4. Security Safeguards</h2>
            <p>
              Our infrastructure enforces strict HttpOnly cookies with SameSite protections, CSRF origin verification, and isolated multi-tenant MongoDB query filters scoping every database transaction strictly to the authenticated user ID.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#073746]">5. Contact Us</h2>
            <p>
              If you have any questions regarding your data privacy or wish to request data erasure, visit our <Link to="/help" className="text-[#073746] font-bold underline">Help &amp; Support</Link> center.
            </p>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default PrivacyPage;
