"use client";

import { motion } from "framer-motion";
import { use, useState } from "react";
import Link from "next/link";
import {
  GitPullRequest,
  ArrowLeft,
  Bot,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  FileCode,
  GitBranch,
  Clock,
  User,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { mockPullRequests } from "@/lib/mock-data";
import type { AIReview, AIReviewIssue } from "@/lib/types";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function getSeverityConfig(severity: AIReviewIssue["severity"]) {
  switch (severity) {
    case "critical":
      return {
        icon: AlertCircle,
        color: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-400/20",
      };
    case "warning":
      return {
        icon: AlertTriangle,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/20",
      };
    case "info":
      return {
        icon: Info,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20",
      };
  }
}

function getAlignmentIcon(status: "pass" | "fail" | "warning") {
  switch (status) {
    case "pass":
      return <ShieldCheck className="h-4 w-4 text-green-400" />;
    case "fail":
      return <ShieldAlert className="h-4 w-4 text-red-400" />;
    case "warning":
      return <ShieldQuestion className="h-4 w-4 text-yellow-400" />;
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

function getScoreGradient(score: number) {
  if (score >= 80)
    return "[&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-400";
  if (score >= 60)
    return "[&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-amber-400";
  return "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-rose-400";
}

// Simulated review generation
const generateMockReview = (): AIReview => ({
  id: `r-${Date.now()}`,
  summary:
    "The code changes are well-structured and follow good practices. Authentication middleware implementation is solid with proper JWT validation. Minor improvements suggested for error handling and token refresh logic.",
  score: 85,
  issues: [
    {
      severity: "warning",
      title: "Token expiry check could be more robust",
      description:
        "The current token expiry validation doesn't account for clock skew between servers. Consider adding a configurable tolerance window.",
      file: "src/middleware/auth.ts",
      line: 34,
    },
    {
      severity: "info",
      title: "Consider extracting rate limit config",
      description:
        "Rate limiting values are hardcoded. Consider moving them to environment variables for easier configuration across environments.",
      file: "src/middleware/rateLimit.ts",
      line: 12,
    },
  ],
  suggestions: [
    {
      title: "Add clock skew tolerance",
      description: "Add a configurable tolerance for JWT expiry checks",
      file: "src/middleware/auth.ts",
      code: "const CLOCK_SKEW_TOLERANCE = parseInt(process.env.JWT_CLOCK_SKEW || '30');",
    },
    {
      title: "Centralize rate limit config",
      description: "Move rate limiting configuration to a central config file",
      file: "src/config/rateLimit.ts",
      code: "export const RATE_LIMIT = {\n  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'),\n  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),\n};",
    },
  ],
  alignmentChecks: [
    {
      rule: "Code Quality Standards",
      status: "pass",
      description: "Follows naming conventions and code structure guidelines",
    },
    {
      rule: "Security Guidelines",
      status: "pass",
      description: "Proper authentication and input validation",
    },
    {
      rule: "API Design Principles",
      status: "pass",
      description: "RESTful conventions followed",
    },
    {
      rule: "Error Handling",
      status: "warning",
      description:
        "Some edge cases in token refresh may need additional error handling",
    },
    {
      rule: "Test Coverage",
      status: "pass",
      description: "Unit tests cover 85% of new code",
    },
  ],
  generatedAt: new Date().toISOString(),
});

export default function PullRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pr = mockPullRequests.find((p) => p.id === id);
  const [review, setReview] = useState<AIReview | null>(pr?.aiReview || null);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(!!pr?.aiReview?.publishedAt);

  if (!pr) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <GitPullRequest className="h-8 w-8 text-[#555555]" />
        <p className="mt-3 text-sm text-[#888888]">Pull request not found</p>
        <Link href="/pull-requests">
          <Button
            variant="ghost"
            className="mt-4 text-[#888888] hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pull Requests
          </Button>
        </Link>
      </div>
    );
  }

  const handleGenerateReview = async () => {
    setGenerating(true);
    // Simulate AI review generation
    await new Promise((r) => setTimeout(r, 10000));
    setReview(generateMockReview());
    setGenerating(false);
  };

  console.log(review);
  console.log(generating);

  const handlePublish = async () => {
    setPublishing(true);
    // Simulate publishing to GitHub
    await new Promise((r) => setTimeout(r, 1500));
    setPublished(true);
    setPublishing(false);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Back navigation */}
      <motion.div variants={item}>
        <Link href="/pull-requests">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-[#888888] hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Pull Requests
          </Button>
        </Link>
      </motion.div>

      {/* PR Header */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <GitPullRequest className="mt-1 h-5 w-5 text-green-400" />
            <div>
              <h1 className="text-xl font-semibold text-white">{pr.title}</h1>
              <p className="mt-1 text-sm text-[#888888]">{pr.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!review && (
              <Button
                onClick={handleGenerateReview}
                disabled={generating}
                className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Review...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    AI Review
                  </>
                )}
              </Button>
            )}
            {review && !published && (
              <Button
                onClick={handlePublish}
                disabled={publishing}
                variant="outline"
                className="gap-2 border-violet-500/30 text-white hover:bg-violet-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {publishing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Publish to GitHub
                  </>
                )}
              </Button>
            )}
            {published && (
              <Badge className="gap-1 bg-green-400/10 text-green-400 border-green-400/20">
                <CheckCircle2 className="h-3 w-3" />
                Published
              </Badge>
            )}
          </div>
        </div>

        {/* PR Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#888888]">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>{pr.author.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5" />
            <span className="font-mono">{pr.sourceBranch}</span>
            <span>→</span>
            <span className="font-mono">{pr.targetBranch}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileCode className="h-3.5 w-3.5" />
            <span>{pr.changedFiles} files changed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated {new Date(pr.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">+{pr.additions}</span>
            <span className="text-red-400">-{pr.deletions}</span>
          </div>
          {pr.labels.map((label) => (
            <Badge
              key={label}
              variant="secondary"
              className="bg-[#1a1a1a] text-[10px] text-[#888888]"
            >
              {label}
            </Badge>
          ))}
        </div>
      </motion.div>

      <Separator className="bg-border" />

      {/* AI Review content or generating state */}
      {generating && (
        <motion.div variants={container} initial="hidden" animate="show">
          <Card className="border-border bg-[#0a0a0a]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-violet-500/20 to-indigo-500/20" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
                  <Bot className="h-7 w-7 text-violet-400" />
                </div>
              </div>
              <p className="mt-6 text-sm font-medium text-white">
                Generating AI Review
              </p>
              <p className="mt-1 text-xs text-[#888888]">
                Analyzing code changes against organizational alignments...
              </p>
              <div className="mt-6 w-full max-w-xs space-y-2">
                <div className="flex justify-between text-xs text-[#888888]">
                  <span>Analyzing code diff</span>
                  <span>Processing...</span>
                </div>
                <Progress
                  value={65}
                  className="h-1 bg-[#1a1a1a] [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-indigo-500"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {review && !generating && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Score overview */}
          <motion.div variants={item}>
            <Card className="border-border bg-[#0a0a0a]">
              <CardContent className="p-6 py-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                      <span
                        className={`text-2xl font-bold ${getScoreColor(review.score)}`}
                      >
                        {review.score}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        AI Review Score
                      </h3>
                      <p className="mt-0.5 text-xs text-[#888888]">
                        Generated{" "}
                        {new Date(review.generatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={review.score}
                    className={`h-2 w-32 bg-[#1a1a1a] ${getScoreGradient(review.score)}`}
                  />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#ededed]">
                  {review.summary}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Detailed review tabs */}
          <motion.div variants={item}>
            <Tabs defaultValue="issues">
              <TabsList className="bg-[#111111]">
                <TabsTrigger
                  value="issues"
                  className="gap-1.5 text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Issues ({review.issues.length})
                </TabsTrigger>
                <TabsTrigger
                  value="suggestions"
                  className="gap-1.5 text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Suggestions ({review.suggestions.length})
                </TabsTrigger>
                <TabsTrigger
                  value="alignment"
                  className="gap-1.5 text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Alignment ({review.alignmentChecks.length})
                </TabsTrigger>
              </TabsList>

              {/* Issues */}
              <TabsContent value="issues" className="mt-4 space-y-3">
                {review.issues.length === 0 ? (
                  <Card className="border-border bg-[#0a0a0a]">
                    <CardContent className="flex flex-col items-center py-10">
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                      <p className="mt-2 text-sm text-[#888888]">
                        No issues found
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  review.issues.map((issue, i) => {
                    const config = getSeverityConfig(issue.severity);
                    const Icon = config.icon;
                    return (
                      <Card
                        key={i}
                        className={`border ${config.border} ${config.bg}`}
                      >
                        <CardContent className="p-4 py-0">
                          <div className="flex items-start gap-3">
                            <Icon
                              className={`mt-0.5 h-4 w-4 shrink-0 ${config.color}`}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium text-white">
                                  {issue.title}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] ${config.color} border-transparent`}
                                >
                                  {issue.severity}
                                </Badge>
                              </div>
                              <p className="mt-1 text-sm text-[#888888]">
                                {issue.description}
                              </p>
                              {issue.file && (
                                <div className="mt-2 flex items-center gap-2 text-xs">
                                  <FileCode className="h-3 w-3 text-[#555555]" />
                                  <span className="font-mono text-[#555555]">
                                    {issue.file}
                                    {issue.line && `:${issue.line}`}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>

              {/* Suggestions */}
              <TabsContent value="suggestions" className="mt-4 space-y-3">
                {review.suggestions.map((suggestion, i) => (
                  <Card key={i} className="border-border bg-[#0a0a0a]">
                    <CardContent className="p-4 py-0">
                      <h4 className="text-sm font-medium text-white">
                        {suggestion.title}
                      </h4>
                      <p className="mt-1 text-sm text-[#888888]">
                        {suggestion.description}
                      </p>
                      {suggestion.file && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <FileCode className="h-3 w-3 text-[#555555]" />
                          <span className="font-mono text-[#555555]">
                            {suggestion.file}
                          </span>
                        </div>
                      )}
                      {suggestion.code && (
                        <pre className="mt-3 overflow-x-auto rounded-lg bg-[#111111] p-3 text-xs">
                          <code className="font-mono text-[#ededed]">
                            {suggestion.code}
                          </code>
                        </pre>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Alignment checks */}
              <TabsContent value="alignment" className="mt-4">
                <Card className="border-border bg-[#0a0a0a]">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-white">
                      Organization Alignment Checks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {review.alignmentChecks.map((check, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-border bg-[#111111] p-3"
                      >
                        <div className="flex items-center gap-3">
                          {getAlignmentIcon(check.status)}
                          <div>
                            <p className="text-sm font-medium text-white">
                              {check.rule}
                            </p>
                            <p className="text-xs text-[#888888]">
                              {check.description}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            check.status === "pass"
                              ? "border-green-400/20 text-green-400"
                              : check.status === "fail"
                                ? "border-red-400/20 text-red-400"
                                : "border-yellow-400/20 text-yellow-400"
                          }`}
                        >
                          {check.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      )}

      {/* No review state */}
      {!review && !generating && (
        <motion.div variants={item}>
          <Card className="border-border bg-[#0a0a0a]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                <Bot className="h-7 w-7 text-violet-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-white">
                No AI Review Yet
              </p>
              <p className="mt-1 max-w-sm text-center text-xs text-[#888888]">
                Generate an AI-powered review to analyze this pull request
                against your organizational alignment standards.
              </p>
              <Button
                onClick={handleGenerateReview}
                className="mt-6 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Sparkles className="h-4 w-4" />
                Generate AI Review
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
