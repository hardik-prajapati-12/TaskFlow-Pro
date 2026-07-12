import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { FiActivity, FiCheckCircle, FiList } from 'react-icons/fi';
import { useTasks } from '@/hooks/useTasks';
import { StatCard } from '@/components/dashboard/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { completionTrend, tasksByCategory, tasksByPriority } from '@/utils/taskUtils';

const AXIS_COLOR = '#94A3B8';

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(15, 23, 42, 0.92)',
  border: 'none',
  borderRadius: 10,
  color: '#fff',
  fontSize: 12,
  padding: '8px 12px',
  boxShadow: '0 8px 24px -8px rgba(15,23,42,0.35)',
};
const TOOLTIP_LABEL_STYLE = { color: '#fff', fontWeight: 600, marginBottom: 4 };
const TOOLTIP_ITEM_STYLE = { color: '#E2E8F0' };

export default function Statistics() {
  const { tasks, categories, stats } = useTasks();

  const categoryData = useMemo(() => tasksByCategory(tasks, categories), [tasks, categories]);
  const priorityData = useMemo(() => tasksByPriority(tasks), [tasks]);
  const trendData = useMemo(() => completionTrend(tasks, 14), [tasks]);
  const hasTasks = stats.total > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Statistics</h1>
        <p className="mt-1 text-sm text-ink-400">A closer look at how you’re spending your time.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total tasks" value={stats.total} icon={<FiList aria-hidden="true" />} accent="flow" />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={<FiCheckCircle aria-hidden="true" />}
          accent="signal"
          delay={0.05}
        />
        <StatCard label="Pending" value={stats.pending} icon={<FiActivity aria-hidden="true" />} accent="amber" delay={0.1} />
        <StatCard
          label="Productivity"
          value={`${stats.productivity}%`}
          icon={<FiActivity aria-hidden="true" />}
          accent="rose"
          delay={0.15}
        />
      </div>

      {!hasTasks ? (
        <EmptyState
          icon={<FiActivity />}
          title="No data to chart yet"
          description="Add a few tasks and your charts will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="glass-card p-5">
            <h3 className="mb-4 font-display text-base font-semibold text-ink-800 dark:text-white">
              Tasks by category
            </h3>
            {categoryData.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-400">No active tasks in any category.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryData} margin={{ left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={AXIS_COLOR} opacity={0.2} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: AXIS_COLOR }} axisLine={{ stroke: AXIS_COLOR, opacity: 0.3 }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={TOOLTIP_LABEL_STYLE} itemStyle={TOOLTIP_ITEM_STYLE} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                  <Bar dataKey="value" name="Tasks" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="glass-card p-5">
            <h3 className="mb-4 font-display text-base font-semibold text-ink-800 dark:text-white">
              Tasks by priority
            </h3>
            {priorityData.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-400">No active tasks yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {priorityData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={30} wrapperStyle={{ fontSize: 12, color: AXIS_COLOR }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={TOOLTIP_LABEL_STYLE} itemStyle={TOOLTIP_ITEM_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="glass-card p-5 lg:col-span-2">
            <h3 className="mb-4 font-display text-base font-semibold text-ink-800 dark:text-white">
              Completion trend — last 14 days
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData} margin={{ left: -16 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={AXIS_COLOR} opacity={0.2} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: AXIS_COLOR }} axisLine={{ stroke: AXIS_COLOR, opacity: 0.3 }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={TOOLTIP_LABEL_STYLE} itemStyle={TOOLTIP_ITEM_STYLE} cursor={{ stroke: AXIS_COLOR, strokeOpacity: 0.3 }} />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#4F46E5" strokeWidth={2.5} fill="url(#trendFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
