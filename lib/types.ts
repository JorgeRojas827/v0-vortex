export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  openPRs: number;
  lastUpdated: string;
  isPrivate: boolean;
  defaultBranch: string;
  url: string;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  description: string;
  state: "open" | "closed" | "merged";
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  repository: string;
  sourceBranch: string;
  targetBranch: string;
  createdAt: string;
  updatedAt: string;
  additions: number;
  deletions: number;
  changedFiles: number;
  labels: string[];
  reviewStatus: "pending" | "reviewed" | "approved" | "changes_requested";
  aiReview?: AIReview;
}

export interface AIReview {
  id: string;
  summary: string;
  score: number;
  issues: AIReviewIssue[];
  suggestions: AIReviewSuggestion[];
  alignmentChecks: AlignmentCheck[];
  generatedAt: string;
  publishedAt?: string;
}

export interface AIReviewIssue {
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  file?: string;
  line?: number;
}

export interface AIReviewSuggestion {
  title: string;
  description: string;
  file?: string;
  code?: string;
}

export interface AlignmentCheck {
  rule: string;
  status: "pass" | "fail" | "warning";
  description: string;
}

export interface AlignmentDocument {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: "processing" | "ready" | "error";
  rulesExtracted: number;
  description: string;
}

export interface DashboardStats {
  totalReviews: number;
  totalPRs: number;
  averageScore: number;
  alignmentRate: number;
  reviewsThisWeek: number;
  issuesFound: number;
}
