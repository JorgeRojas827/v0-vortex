"use client";

import { motion } from "framer-motion";
import {
  FolderGit2,
  Star,
  GitFork,
  GitPullRequest,
  Lock,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockRepositories } from "@/lib/mock-data";
import { Search, Plus } from "lucide-react";
import { useState } from "react";

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

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-400",
  Go: "bg-cyan-400",
  Python: "bg-yellow-400",
  HCL: "bg-purple-400",
  JavaScript: "bg-yellow-300",
  Rust: "bg-orange-400",
};

export default function RepositoriesPage() {
  const [search, setSearch] = useState("");

  const filtered = mockRepositories.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Repositories
          </h1>
          <p className="mt-1 text-sm text-[#888888]">
            Manage connected GitHub repositories for AI-powered reviews.
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          <Plus className="h-4 w-4" />
          Connect Repository
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888888]" />
        <Input
          placeholder="Filter repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 border-border bg-[#111111] pl-9 text-sm text-white placeholder:text-[#555555]"
        />
      </motion.div>

      {/* Repository grid */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {filtered.map((repo) => (
          <Card
            key={repo.id}
            className="group gradient-border border-border bg-[#0a0a0a] transition-all duration-200 hover:border-[#333333]"
          >
            <CardContent className="p-5 py-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a]">
                    <FolderGit2 className="h-5 w-5 text-[#888888]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white">
                        {repo.name}
                      </h3>
                      {repo.isPrivate ? (
                        <Lock className="h-3 w-3 text-[#555555]" />
                      ) : (
                        <Globe className="h-3 w-3 text-[#555555]" />
                      )}
                    </div>
                    <p className="text-xs text-[#888888]">{repo.fullName}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#555555] opacity-0 transition-opacity group-hover:opacity-100 hover:text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[#888888]">
                {repo.description}
              </p>

              <div className="mt-4 flex items-center gap-4 text-xs text-[#888888]">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${languageColors[repo.language] || "bg-gray-400"}`}
                  />
                  <span>{repo.language}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" />
                  <span>{repo.stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-3.5 w-3.5" />
                  <span>{repo.forks}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-1.5 text-xs">
                  <GitPullRequest className="h-3.5 w-3.5 text-green-400" />
                  <span className="text-[#ededed]">{repo.openPRs}</span>
                  <span className="text-[#888888]">open PRs</span>
                </div>
                <Badge
                  variant="outline"
                  className="border-border text-xs text-[#888888]"
                >
                  {repo.defaultBranch}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
