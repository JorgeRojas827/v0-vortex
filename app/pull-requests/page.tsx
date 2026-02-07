"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  GitPullRequest,
  GitMerge,
  Search,
  Bot,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPullRequests } from "@/lib/mock-data";
import type { PullRequest } from "@/lib/types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function getPRIcon(state: PullRequest["state"]) {
  if (state === "merged") return <GitMerge className="h-4 w-4 text-purple-400" />;
  return <GitPullRequest className="h-4 w-4 text-green-400" />;
}

function getReviewBadge(pr: PullRequest) {
  if (pr.aiReview) {
    const score = pr.aiReview.score;
    const color =
      score >= 80
        ? "text-green-400 border-green-400/20 bg-green-400/5"
        : score >= 60
          ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/5"
          : "text-red-400 border-red-400/20 bg-red-400/5";
    return (
      <Badge variant="outline" className={`text-xs ${color}`}>
        <Bot className="mr-1 h-3 w-3" />
        Score: {score}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-border text-xs text-[#888888]">
      Not reviewed
    </Badge>
  );
}

function getStatusBadge(reviewStatus: PullRequest["reviewStatus"]) {
  const config = {
    pending: { label: "Pending", className: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5" },
    reviewed: { label: "Reviewed", className: "text-blue-400 border-blue-400/20 bg-blue-400/5" },
    approved: { label: "Approved", className: "text-green-400 border-green-400/20 bg-green-400/5" },
    changes_requested: { label: "Changes", className: "text-red-400 border-red-400/20 bg-red-400/5" },
  };
  const c = config[reviewStatus];
  return (
    <Badge variant="outline" className={`text-xs ${c.className}`}>
      {c.label}
    </Badge>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function PullRequestsPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = mockPullRequests.filter((pr) => {
    const matchesSearch =
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.repository.toLowerCase().includes(search.toLowerCase());
    if (tab === "all") return matchesSearch;
    if (tab === "open") return matchesSearch && pr.state === "open";
    if (tab === "reviewed") return matchesSearch && pr.aiReview;
    if (tab === "pending") return matchesSearch && !pr.aiReview && pr.state === "open";
    return matchesSearch;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Pull Requests</h1>
        <p className="mt-1 text-sm text-[#888888]">
          View and review pull requests across all connected repositories.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-[#111111]">
            <TabsTrigger value="all" className="text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white">
              All ({mockPullRequests.length})
            </TabsTrigger>
            <TabsTrigger value="open" className="text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white">
              Open ({mockPullRequests.filter((p) => p.state === "open").length})
            </TabsTrigger>
            <TabsTrigger value="reviewed" className="text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white">
              Reviewed ({mockPullRequests.filter((p) => p.aiReview).length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white">
              Needs Review ({mockPullRequests.filter((p) => !p.aiReview && p.state === "open").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888888]" />
            <Input
              placeholder="Search pull requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-[240px] border-border bg-[#111111] pl-9 text-sm text-white placeholder:text-[#555555]"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 border-border bg-transparent text-[#888888] hover:bg-[#1a1a1a] hover:text-white">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
        </div>
      </motion.div>

      {/* PR List */}
      <motion.div variants={item} className="space-y-5">
        {filtered.map((pr) => (
          <Link key={pr.id} href={`/pull-requests/${pr.id}`}>
            <Card className="group gradient-border border-border bg-[#0a0a0a] mb-5 transition-all duration-200 hover:border-[#333333]">
              <CardContent className="flex items-center gap-4 p-4 py-2">
                {/* PR icon */}
                <div className="shrink-0">{getPRIcon(pr.state)}</div>

                {/* PR info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-white">{pr.title}</span>
                    {pr.labels.map((label) => (
                      <Badge key={label} variant="secondary" className="shrink-0 bg-[#1a1a1a] text-[10px] text-[#888888]">
                        {label}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[#888888]">
                    <span className="font-mono text-[#555555]">{pr.repository.split("/")[1]}</span>
                    <span>#{pr.number}</span>
                    <span>{pr.author.name}</span>
                    <span>{pr.sourceBranch} → {pr.targetBranch}</span>
                    <span>{timeAgo(pr.updatedAt)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden shrink-0 items-center gap-4 sm:flex">
                  <div className="text-right text-xs">
                    <span className="text-green-400">+{pr.additions}</span>
                    <span className="mx-1 text-[#555555]">/</span>
                    <span className="text-red-400">-{pr.deletions}</span>
                  </div>
                  <div className="text-xs text-[#888888]">{pr.changedFiles} files</div>
                </div>

                {/* Badges */}
                <div className="flex shrink-0 items-center gap-2">
                  {getReviewBadge(pr)}
                  {getStatusBadge(pr.reviewStatus)}
                </div>

                {/* Arrow */}
                <ChevronRight className="h-4 w-4 shrink-0 text-[#555555] transition-transform group-hover:translate-x-0.5" />
              </CardContent>
            </Card>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
            <GitPullRequest className="h-8 w-8 text-[#555555]" />
            <p className="mt-3 text-sm text-[#888888]">No pull requests found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
