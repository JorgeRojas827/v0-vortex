"use client";

import { motion } from "framer-motion";
import {
  GitPullRequest,
  Bot,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  AlertTriangle,
  ArrowUpRight,
  Upload,
  GitMerge,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  mockDashboardStats,
  mockActivityFeed,
  mockPullRequests,
  mockWeeklyActivity,
  mockReviewsByRepo,
  mockPRStatusDistribution,
  mockScoreDistribution,
} from "@/lib/mock-data";
import { useRouter } from "next/navigation";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const statsConfig = [
  {
    label: "Total Reviews",
    value: mockDashboardStats.totalReviews,
    icon: Bot,
    change: "+12%",
    positive: true,
  },
  {
    label: "Open PRs",
    value: mockDashboardStats.totalPRs,
    icon: GitPullRequest,
    change: "+5%",
    positive: true,
  },
  {
    label: "Avg. Score",
    value: `${mockDashboardStats.averageScore}%`,
    icon: TrendingUp,
    change: "+3%",
    positive: true,
  },
  {
    label: "Alignment Rate",
    value: `${mockDashboardStats.alignmentRate}%`,
    icon: ShieldCheck,
    change: "-2%",
    positive: false,
  },
  {
    label: "Reviews This Week",
    value: mockDashboardStats.reviewsThisWeek,
    icon: BarChart3,
    change: "+18%",
    positive: true,
  },
  {
    label: "Issues Found",
    value: mockDashboardStats.issuesFound,
    icon: AlertTriangle,
    change: "+8%",
    positive: false,
  },
];

function getActivityIcon(type: string) {
  switch (type) {
    case "review":
      return Bot;
    case "publish":
      return ArrowUpRight;
    case "upload":
      return Upload;
    case "merge":
      return GitMerge;
    default:
      return CheckCircle2;
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#222222] bg-[#0a0a0a] px-3 py-2 shadow-xl shadow-black/50">
      <p className="mb-1 text-xs font-medium text-[#888888]">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[#888888]">{entry.name}:</span>
          <span className="font-medium text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function DashboardPage() {
  const router = useRouter();
  const recentPRs = mockPullRequests
    .filter((pr) => pr.state === "open")
    .slice(0, 4);
  const totalPRStatus = mockPRStatusDistribution.reduce(
    (sum, d) => sum + d.count,
    0,
  );
  const totalScores = mockScoreDistribution.reduce(
    (sum, d) => sum + d.count,
    0,
  );
  const maxScoreCount = Math.max(...mockScoreDistribution.map((d) => d.count));
  const highScorePercent = Math.round(
    (mockScoreDistribution
      .filter((d) => d.range === "90-100" || d.range === "80-89")
      .reduce((s, d) => s + d.count, 0) /
      totalScores) *
      100,
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Page header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#888888]">
          Overview of your PR review activity and alignment metrics.
        </p>
      </motion.div>

      {/* Recent PRs + Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Recent PRs */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="border-border bg-[#0a0a0a]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base font-medium text-white">
                Recent Pull Requests
                <Badge
                  variant="secondary"
                  className="bg-[#1a1a1a] text-[#888888]"
                >
                  {recentPRs.length} open
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPRs.map((pr) => (
                <div
                  key={pr.id}
                  className="flex items-center cursor-pointer justify-between rounded-lg border border-border bg-[#111111] p-4 transition-all duration-200 hover:border-[#333333]"
                  onClick={() => {
                    router.push(`/pull-requests/${pr.id}`);
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="h-4 w-4 shrink-0 text-green-400" />
                      <span className="truncate text-sm font-medium text-white">
                        {pr.title}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-[#888888]">
                      <span>{pr.repository.split("/")[1]}</span>
                      <span>#{pr.number}</span>
                      <span>{pr.author.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <span className="text-green-400">+{pr.additions}</span>
                      <span className="mx-1 text-[#555555]">/</span>
                      <span className="text-red-400">-{pr.deletions}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`border-border text-xs ${
                        pr.reviewStatus === "pending"
                          ? "text-yellow-400"
                          : pr.reviewStatus === "approved"
                            ? "text-green-400"
                            : pr.reviewStatus === "changes_requested"
                              ? "text-red-400"
                              : "text-blue-400"
                      }`}
                    >
                      {pr.reviewStatus === "changes_requested"
                        ? "changes"
                        : pr.reviewStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity feed */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-border bg-[#0a0a0a]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-white">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockActivityFeed.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a]">
                      <Icon className="h-3.5 w-3.5 text-[#888888]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[#ededed]">
                        {activity.message}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        {activity.repo && (
                          <span className="text-xs text-[#555555]">
                            {activity.repo}
                          </span>
                        )}
                        <span className="text-xs text-[#555555]">
                          {activity.time}
                        </span>
                        {activity.score && (
                          <span
                            className={`text-xs font-medium ${getScoreColor(activity.score)}`}
                          >
                            Score: {activity.score}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      {/* Chart row 1: Area Chart + Donut Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Review Activity - Area Chart */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="border-border bg-[#0a0a0a]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base font-medium text-white">
                Review Activity
                <Badge
                  variant="secondary"
                  className="bg-[#1a1a1a] text-[#888888]"
                >
                  Last 7 days
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={mockWeeklyActivity}>
                  <defs>
                    <linearGradient
                      id="fillReviews"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillPRs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    horizontal={true}
                    vertical={false}
                    stroke="#222222"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#555555", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#555555", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="reviews"
                    name="Reviews"
                    stroke="#8b5cf6"
                    fill="url(#fillReviews)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="prsOpened"
                    name="PRs Opened"
                    stroke="#6366f1"
                    fill="url(#fillPRs)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* PR Status - Donut Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-border bg-[#0a0a0a]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base font-medium text-white">
                PR Status
                <Badge
                  variant="secondary"
                  className="bg-[#1a1a1a] text-[#888888]"
                >
                  {totalPRStatus} total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={mockPRStatusDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {mockPRStatusDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {mockPRStatusDistribution.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <span className="text-xs text-[#888888]">{entry.name}</span>
                    <span className="ml-auto text-xs font-medium text-white">
                      {entry.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      {/* Chart row 2: Bar Chart + Score Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Reviews by Repository - Bar Chart */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="border-border bg-[#0a0a0a]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base font-medium text-white">
                Reviews by Repository
                <Badge
                  variant="secondary"
                  className="bg-[#1a1a1a] text-[#888888]"
                >
                  All time
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={mockReviewsByRepo}>
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    horizontal={true}
                    vertical={false}
                    stroke="#222222"
                  />
                  <XAxis
                    dataKey="repo"
                    tick={{ fill: "#555555", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value: string) =>
                      value.length > 10 ? value.slice(0, 10) + "..." : value
                    }
                  />
                  <YAxis
                    tick={{ fill: "#555555", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="reviews"
                    name="Reviews"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Score Distribution - Animated Bars */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-border bg-[#0a0a0a]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-white">
                Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockScoreDistribution.map((bucket) => (
                <div key={bucket.range}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-[#888888]">{bucket.range}</span>
                    <span className="font-medium text-white">
                      {bucket.count}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#1a1a1a]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: bucket.fill }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(bucket.count / maxScoreCount) * 100}%`,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#222222] pt-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">
                    {mockDashboardStats.averageScore}
                  </p>
                  <p className="text-xs text-[#555555]">Avg. Score</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">
                    {totalScores}
                  </p>
                  <p className="text-xs text-[#555555]">Total Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">
                    {highScorePercent}%
                  </p>
                  <p className="text-xs text-[#555555]">Score 80+</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/10 to-transparent" />
    </motion.div>
  );
}
