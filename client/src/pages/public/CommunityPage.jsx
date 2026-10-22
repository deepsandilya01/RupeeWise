import React, { useState } from 'react';
import LandingNavbar from '../../components/landing/LandingNavbar.jsx';
import LandingFooter from '../../components/landing/LandingFooter.jsx';
import { Users, MessageSquare, Trophy, Flame, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CommunityPage = () => {
  const navigate = useNavigate();
  const [joinedChallenge, setJoinedChallenge] = useState(null);

  const challenges = [
    {
      id: 'swiggy-challenge',
      title: 'The ₹3,000 Food Delivery Reset',
      desc: 'Cook home meals or eat at campus canteens 5 days a week. Put the saved money directly into a 12% index fund.',
      participants: 1840,
      badge: 'Trending Challenge',
      savedAverage: '₹3,400 avg saved',
      daysLeft: 12,
    },
    {
      id: 'emergency-corpus',
      title: 'First ₹50,000 Emergency Shield',
      desc: 'Milestone cohort for freshers and students building their initial 3-month survival corpus.',
      participants: 920,
      badge: 'High Impact',
      savedAverage: '₹14,500 milestone',
      daysLeft: 18,
    },
    {
      id: 'student-sip',
      title: 'The ₹500/Month SIP Kickstart',
      desc: 'Start compounding while still in college. Learn how starting at age 20 vs 28 doubles your retirement corpus.',
      participants: 2450,
      badge: 'Beginner Friendly',
      savedAverage: '100% automated',
      daysLeft: 24,
    },
  ];

  const discussions = [
    {
      id: 1,
      author: 'Aarav Mehta (IIT Delhi)',
      role: 'Student & Intern',
      title: 'How I manage ₹18,000 monthly living costs in South Delhi without running out by day 20',
      category: 'Frugal Living',
      replies: 42,
      likes: 189,
      time: '3 hours ago',
    },
    {
      id: 2,
      author: 'Priya Sharma (Bengaluru)',
      role: 'Associate Product Manager',
      title: 'Are co-living spaces (Zolo/Stanza) actually cheaper than sharing a 2BHK once you add electricity?',
      category: 'Rent & Housing',
      replies: 67,
      likes: 240,
      time: '5 hours ago',
    },
    {
      id: 3,
      author: 'Kunal Verma (Pune)',
      role: 'Software Engineer',
      title: 'Parag Parikh Flexi Cap vs UTI Nifty 50: Where should a 22-year-old allocate their first ₹5,000 SIP?',
      category: 'Mutual Funds',
      replies: 53,
      likes: 312,
      time: 'Yesterday',
    },
    {
      id: 4,
      author: 'Neha Roy (Kolkata)',
      role: 'B.Tech 3rd Year',
      title: 'Zero annual fee credit cards for college students based on FD — Which one gives better reward points?',
      category: 'Banking & Credit',
      replies: 38,
      likes: 145,
      time: '2 days ago',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#0B1D33] font-sans antialiased flex flex-col justify-between select-none">
      <div>
        <LandingNavbar />

        {/* Hero Header */}
        <div className="py-14 sm:py-18 bg-[#FAF7F0] border-b border-gray-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFEADB] text-[11px] font-bold uppercase tracking-wider text-[#073746]">
              <Users className="w-3.5 h-3.5 text-coral-500" />
              <span>PEER FINANCIAL NETWORK</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1D33]">
              Student &amp; Professional <br />
              <span className="text-[#FF624F]">Money Community.</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
              Connect with over 10,000+ ambitious young Indians. Compare budgeting systems, join peer savings sprints, and build wealth without shame.
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left space-y-14">
          {/* Section 1: Active Money Sprints */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-coral-500" />
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1D33] tracking-tight">
                    Active Money Sprints
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Join friendly time-boxed challenges with real accountability and progress tracking.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {challenges.map((c) => {
                const isJoined = joinedChallenge === c.id;

                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-peach-100 text-[#073746] border border-[#FED2B8]">
                          {c.badge}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400">
                          {c.daysLeft} days left
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-[#0B1D33] tracking-tight mb-2">
                        {c.title}
                      </h3>

                      <p className="text-xs text-gray-600 leading-relaxed mb-4">
                        {c.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-3">
                      <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                        <span>{c.participants.toLocaleString()} joined</span>
                        <span className="text-emerald-700 font-bold">{c.savedAverage}</span>
                      </div>

                      <button
                        onClick={() => setJoinedChallenge(isJoined ? null : c.id)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                          isJoined
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#073746] hover:bg-[#0C2B35] text-white shadow-2xs'
                        }`}
                      >
                        {isJoined ? 'Joined Challenge ✓' : 'Join Sprint Free'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Trending Discussions */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#073746]" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1D33] tracking-tight">
                Trending Peer Discussions
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-card divide-y divide-gray-100 overflow-hidden">
              {discussions.map((d) => (
                <div
                  key={d.id}
                  className="p-5 sm:p-6 hover:bg-peach-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => navigate('/login')}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-peach-100 text-[#073746] font-bold text-[10px]">
                        {d.category}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        By {d.author} &bull; {d.time}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#0B1D33] hover:text-[#073746] transition-colors leading-snug">
                      {d.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-gray-500 shrink-0 self-end sm:self-center">
                    <span className="flex items-center gap-1 hover:text-coral-500 transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                      {d.likes}
                    </span>
                    <span className="flex items-center gap-1 hover:text-[#073746] transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {d.replies} replies
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Join CTA Banner */}
          <div className="bg-gradient-to-br from-[#FAF7F0] to-[#FFE5D4]/40 rounded-3xl p-8 border border-[#FED2B8] text-center space-y-4 shadow-card">
            <h3 className="text-2xl font-extrabold text-[#0B1D33]">
              Ready to take control of your financial future?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
              Join thousands of students and young professionals using RupeeWise AI to save more, spend smarter, and invest early.
            </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 bg-[#073746] hover:bg-[#0C2B35] text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-full shadow-card hover:shadow-elevated transition-all"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
};

export default CommunityPage;
