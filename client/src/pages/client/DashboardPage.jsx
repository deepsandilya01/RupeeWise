import React from 'react';
import useAuth from '../../hooks/useAuth.js';
import Card from '../../components/ui/Card.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  UploadCloud,
  FileSpreadsheet,
  Info,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

export const DashboardPage = () => {
  const { user } = useAuth();

  // Illustrative category breakdown for Recharts demonstration (Clearly Marked Demo Data)
  const categoryData = [
    { name: 'Housing & Utilities', value: 18000, color: '#174B38' },
    { name: 'Groceries & Dining', value: 9500, color: '#2B6B53' },
    { name: 'Transport & Fuel', value: 4200, color: '#5EA286' },
    { name: 'Subscriptions & Tech', value: 3100, color: '#95C2AF' },
    { name: 'Investments / SIP', value: 15000, color: '#3D8569' },
  ];

  const recentTransactions = [
    {
      id: 'tx-1',
      title: 'Monthly Salary Credit',
      category: 'Income',
      date: '21 Oct 2026',
      amount: '+₹1,15,000',
      isCredit: true,
      tag: 'Demo Data',
    },
    {
      id: 'tx-2',
      title: 'Residential Rent & Maintenance',
      category: 'Housing',
      date: '18 Oct 2026',
      amount: '-₹18,000',
      isCredit: false,
      tag: 'Demo Data',
    },
    {
      id: 'tx-3',
      title: 'Mutual Fund Index SIP',
      category: 'Investment',
      date: '15 Oct 2026',
      amount: '-₹15,000',
      isCredit: false,
      tag: 'Demo Data',
    },
    {
      id: 'tx-4',
      title: 'Nature Basket Groceries',
      category: 'Groceries',
      date: '12 Oct 2026',
      amount: '-₹4,250',
      isCredit: false,
      tag: 'Demo Data',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-charcoal-900">
              Welcome back, {user?.name || 'Pilot'}!
            </h1>
            <Badge variant="primary" size="sm">Active Session</Badge>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Account Email: <span className="font-medium text-charcoal-700">{user?.email}</span> &bull; Role:{' '}
            <span className="font-semibold text-forest-800 capitalize">{user?.role}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<UploadCloud className="w-3.5 h-3.5 text-forest-700" />}
            onClick={() => alert('CSV Transaction Importer powered by PapaParse is scheduled for Phase 2!')}
          >
            Import Bank CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-300" />}
            onClick={() => alert('AI Money Coach engine will be wired in Phase 2!')}
          >
            Ask AI Coach
          </Button>
        </div>
      </div>

      {/* Explicit Demo Data Notice Banner */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900">
          <span className="font-bold">Illustrative Preview &mdash; Phase 1 Foundation:</span> Below financial figures and transaction logs are clearly labeled as <span className="font-semibold underline">Demo Data</span> to showcase the upcoming analytics UI layout. Real Mongoose aggregation and bank statements import will populate in Phase 2.
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Net Worth"
          value="₹4,82,500"
          trend="+8.4% this month"
          trendPositive={true}
          isDemo={true}
          icon={<Wallet className="w-5 h-5" />}
        />
        <StatCard
          title="Monthly Cash Inflow"
          value="₹1,15,000"
          subtext="Salary + Freelance"
          isDemo={true}
          icon={<TrendingUp className="w-5 h-5 text-emerald-700" />}
        />
        <StatCard
          title="Monthly Spending"
          value="₹42,300"
          trend="-6.2% vs last month"
          trendPositive={true}
          isDemo={true}
          icon={<TrendingDown className="w-5 h-5 text-amber-700" />}
        />
        <StatCard
          title="Projected Savings"
          value="₹72,700"
          subtext="63.2% Savings Rate"
          isDemo={true}
          icon={<PiggyBank className="w-5 h-5 text-forest-800" />}
        />
      </div>

      {/* Analytics & Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (Recharts Demonstration) */}
        <Card
          className="lg:col-span-1"
          header={
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-charcoal-900">Expense Allocation</h2>
              <Badge variant="demo" size="sm">Demo Data</Badge>
            </div>
          }
        >
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E5E7EB',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2 border-t border-gray-100 pt-3">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-charcoal-600 truncate">{cat.name}</span>
                </div>
                <span className="font-semibold text-charcoal-900">₹{cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity Table */}
        <Card
          className="lg:col-span-2"
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-charcoal-900">Recent Transactions</h2>
                <Badge variant="demo" size="sm">Demo Data</Badge>
              </div>
              <span className="text-xs text-charcoal-400">Ready for PapaParse CSV Import</span>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-charcoal-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Transaction</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            tx.isCredit ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-charcoal-600'
                          }`}
                        >
                          {tx.isCredit ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <span className="font-semibold text-charcoal-900">{tx.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-charcoal-600">{tx.category}</td>
                    <td className="py-3 px-3 text-charcoal-400">{tx.date}</td>
                    <td
                      className={`py-3 px-3 text-right font-bold ${
                        tx.isCredit ? 'text-emerald-700' : 'text-charcoal-900'
                      }`}
                    >
                      {tx.amount}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="demo" size="sm">{tx.tag}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* AI Assistant Preview Banner */}
      <div className="bg-gradient-to-r from-forest-800 to-forest-900 rounded-2xl p-6 text-white shadow-elevated flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-700/60 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PaisaPilot AI Intelligence</span>
          </div>
          <h3 className="text-lg font-bold">Proactive Anomaly Detection &amp; Micro-Budgeting</h3>
          <p className="text-xs text-forest-100 max-w-xl leading-relaxed">
            Phase 1 established your secure RBAC foundation and Google session. In Phase 2, PaisaPilot will automatically scan your recurring transactions, highlight subscription creep, and optimize your monthly SIP goals.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button
            variant="secondary"
            size="md"
            className="font-bold text-forest-900 bg-white hover:bg-forest-50"
            onClick={() => alert('Phase 2 AI engine will be connected next!')}
          >
            Explore Phase 2 Roadmap
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
