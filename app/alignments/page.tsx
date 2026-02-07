"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  Loader2,
  Trash2,
  File,
  BookOpen,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockAlignmentDocuments } from "@/lib/mock-data";
import type { AlignmentDocument } from "@/lib/types";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function getStatusConfig(status: AlignmentDocument["status"]) {
  switch (status) {
    case "ready":
      return { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10", label: "Ready" };
    case "processing":
      return { icon: Loader2, color: "text-yellow-400", bg: "bg-yellow-400/10", label: "Processing" };
    case "error":
      return { icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10", label: "Error" };
  }
}

export default function AlignmentsPage() {
  const [documents, setDocuments] = useState<AlignmentDocument[]>(mockAlignmentDocuments);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const totalRules = documents
    .filter((d) => d.status === "ready")
    .reduce((acc, d) => acc + d.rulesExtracted, 0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    // Simulate upload
    setUploading(true);
    setTimeout(() => {
      const newDoc: AlignmentDocument = {
        id: String(Date.now()),
        name: "New Document",
        fileName: "uploaded-document.pdf",
        fileSize: 1500000,
        uploadedAt: new Date().toISOString(),
        status: "processing",
        rulesExtracted: 0,
        description: "Newly uploaded alignment document - processing...",
      };
      setDocuments((prev) => [...prev, newDoc]);
      setUploading(false);

      // Simulate processing completion
      setTimeout(() => {
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === newDoc.id
              ? { ...d, status: "ready" as const, rulesExtracted: 15 }
              : d
          )
        );
      }, 3000);
    }, 1500);
  }, []);

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Alignments</h1>
        <p className="mt-1 text-sm text-[#888888]">
          Upload and manage organizational alignment documents used for AI-powered code reviews.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="gradient-border border-border bg-[#0a0a0a] transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                <FileText className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">{documents.length}</p>
                <p className="text-sm text-[#888888]">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-border border-border bg-[#0a0a0a] transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                <BookOpen className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">{totalRules}</p>
                <p className="text-sm text-[#888888]">Rules Extracted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-border border-border bg-[#0a0a0a] transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                <CheckCircle2 className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">
                  {documents.filter((d) => d.status === "ready").length}
                </p>
                <p className="text-sm text-[#888888]">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upload zone */}
      <motion.div variants={item}>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed transition-all ${
            dragActive
              ? "border-violet-500/40 bg-violet-500/5"
              : "border-border bg-[#0a0a0a] hover:border-[#333333]"
          }`}
        >
          <div className="flex flex-col items-center justify-center py-12">
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                <p className="mt-3 text-sm font-medium text-white">Uploading document...</p>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                  <Upload className="h-5 w-5 text-violet-400" />
                </div>
                <p className="mt-3 text-sm font-medium text-white">
                  Drag and drop your PDF alignment documents
                </p>
                <p className="mt-1 text-xs text-[#888888]">
                  or click to browse. Supports PDF files up to 50MB.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 gap-1.5 border-border text-[#888888] hover:bg-[#1a1a1a] hover:text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Browse Files
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/10 to-transparent" />

      {/* Documents list */}
      <motion.div variants={item}>
        <h2 className="mb-4 text-base font-medium text-white">Uploaded Documents</h2>
        <div className="space-y-3">
          {documents.map((doc) => {
            const statusConfig = getStatusConfig(doc.status);
            const StatusIcon = statusConfig.icon;
            return (
              <Card key={doc.id} className="border-border bg-[#0a0a0a] transition-all duration-200 hover:border-[#333333]">
                <CardContent className="flex items-center gap-4 p-4">
                  {/* File icon */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a]">
                    <File className="h-5 w-5 text-[#888888]" />
                  </div>

                  {/* Document info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white">{doc.name}</h3>
                      <Badge variant="outline" className={`text-[10px] ${statusConfig.color} border-transparent`}>
                        <StatusIcon className={`mr-1 h-3 w-3 ${doc.status === "processing" ? "animate-spin" : ""}`} />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-[#888888]">{doc.description}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-[#555555]">
                      <span>{doc.fileName}</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Rules extracted */}
                  {doc.status === "ready" && (
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-semibold text-white">{doc.rulesExtracted}</p>
                      <p className="text-xs text-[#888888]">rules</p>
                    </div>
                  )}

                  {doc.status === "processing" && (
                    <div className="w-24 shrink-0">
                      <Progress value={45} className="h-1.5 bg-[#1a1a1a] [&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-amber-400" />
                      <p className="mt-1 text-center text-xs text-[#888888]">45%</p>
                    </div>
                  )}

                  {/* Actions */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(doc.id)}
                    className="h-8 w-8 shrink-0 text-[#555555] hover:bg-red-400/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
