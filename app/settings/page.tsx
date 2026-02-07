"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Github,
  Key,
  Users,
  Bell,
  Bot,
  Shield,
  Save,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-sm text-[#888888]">
          Configure your Vortex platform, integrations, and review preferences.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="general">
          <TabsList className="bg-[#111111]">
            <TabsTrigger value="general" className="gap-1.5 text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white">
              <Bot className="h-3.5 w-3.5" />
              General
            </TabsTrigger>
            <TabsTrigger value="github" className="gap-1.5 text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white">
              <Github className="h-3.5 w-3.5" />
              GitHub
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-1.5 text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white">
              <Key className="h-3.5 w-3.5" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-1.5 text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white">
              <Users className="h-3.5 w-3.5" />
              Team
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5 text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white">
              <Bell className="h-3.5 w-3.5" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* General */}
          <TabsContent value="general" className="mt-6 space-y-6">
            <Card className="border-border bg-[#0a0a0a]">
              <CardHeader>
                <CardTitle className="text-base text-white">Review Settings</CardTitle>
                <CardDescription className="text-[#888888]">
                  Configure how AI reviews are generated and what standards are applied.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ededed]">Organization Name</label>
                  <Input
                    defaultValue="Acme Corp"
                    className="border-border bg-[#111111] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ededed]">Default Review Depth</label>
                  <div className="flex gap-2">
                    {["Quick", "Standard", "Deep"].map((depth) => (
                      <Button
                        key={depth}
                        variant="outline"
                        size="sm"
                        className={`border-border ${
                          depth === "Standard"
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent hover:from-violet-500 hover:to-indigo-500"
                            : "bg-transparent text-[#888888] hover:bg-[#1a1a1a] hover:text-white"
                        }`}
                      >
                        {depth}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ededed]">Minimum Score Threshold</label>
                  <Input
                    type="number"
                    defaultValue="70"
                    className="w-24 border-border bg-[#111111] text-white"
                  />
                  <p className="text-xs text-[#888888]">
                    PRs below this score will be flagged for manual review.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-[#0a0a0a]">
              <CardHeader>
                <CardTitle className="text-base text-white">AI Model Configuration</CardTitle>
                <CardDescription className="text-[#888888]">
                  Select the AI model used for generating code reviews.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { name: "Claude Sonnet 4.5", desc: "Best balance of speed and quality", active: true },
                    { name: "Claude Opus 4.6", desc: "Highest accuracy for complex reviews", active: false },
                    { name: "GPT-4o", desc: "Alternative model for diverse perspectives", active: false },
                  ].map((model) => (
                    <div
                      key={model.name}
                      className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                        model.active
                          ? "border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-indigo-500/5"
                          : "border-border bg-[#111111] hover:border-[#333333]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">{model.name}</p>
                        {model.active && (
                          <CheckCircle2 className="h-4 w-4 text-violet-400" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-[#888888]">{model.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GitHub */}
          <TabsContent value="github" className="mt-6 space-y-6">
            <Card className="border-border bg-[#0a0a0a]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <Github className="h-5 w-5" />
                  GitHub Integration
                </CardTitle>
                <CardDescription className="text-[#888888]">
                  Connect your GitHub account to access repositories and publish reviews.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border bg-[#111111] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a]">
                      <Github className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">acme-corp</p>
                      <p className="text-xs text-[#888888]">Organization connected</p>
                    </div>
                  </div>
                  <Badge className="gap-1 bg-green-400/10 text-green-400 border-green-400/20">
                    <CheckCircle2 className="h-3 w-3" />
                    Connected
                  </Badge>
                </div>

                <Separator className="bg-border" />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ededed]">GitHub Token</label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      defaultValue="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="border-border bg-[#111111] text-white font-mono"
                    />
                    <Button variant="outline" size="sm" className="shrink-0 border-border text-[#888888] hover:bg-[#1a1a1a] hover:text-white">
                      Rotate
                    </Button>
                  </div>
                  <p className="text-xs text-[#888888]">
                    Personal access token with repo and pull request permissions.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ededed]">Webhook URL</label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      defaultValue="https://vortex.app/api/webhook/github"
                      className="border-border bg-[#111111] text-[#888888] font-mono"
                    />
                    <Button variant="outline" size="sm" className="shrink-0 border-border text-[#888888] hover:bg-[#1a1a1a] hover:text-white">
                      Copy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys */}
          <TabsContent value="api" className="mt-6 space-y-6">
            <Card className="border-border bg-[#0a0a0a]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <Key className="h-5 w-5" />
                  API Configuration
                </CardTitle>
                <CardDescription className="text-[#888888]">
                  Manage API keys for AI model providers and external services.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ededed]">Anthropic API Key</label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      defaultValue="sk-ant-xxxxxxxxxxxxx"
                      className="border-border bg-[#111111] text-white font-mono"
                    />
                    <Badge className="shrink-0 gap-1 bg-green-400/10 text-green-400 border-green-400/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Valid
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ededed]">OpenAI API Key</label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="sk-..."
                      className="border-border bg-[#111111] text-white font-mono placeholder:text-[#555555]"
                    />
                    <Badge variant="outline" className="shrink-0 text-[#888888] border-border">
                      Not configured
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ededed]">Vector Database</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-[#111111] px-3 py-2">
                      <Shield className="h-4 w-4 text-[#888888]" />
                      <span className="text-sm text-white">Pinecone</span>
                    </div>
                    <Badge className="gap-1 bg-green-400/10 text-green-400 border-green-400/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Connected
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team */}
          <TabsContent value="team" className="mt-6 space-y-6">
            <Card className="border-border bg-[#0a0a0a]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base text-white">Team Members</CardTitle>
                  <CardDescription className="text-[#888888]">
                    Manage team access and roles for the Vortex platform.
                  </CardDescription>
                </div>
                <Button size="sm" className="gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  <Users className="h-3.5 w-3.5" />
                  Invite
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Admin User", email: "admin@acme.com", role: "Owner", active: true },
                  { name: "Sarah Chen", email: "sarah@acme.com", role: "Admin", active: true },
                  { name: "Marcus Johnson", email: "marcus@acme.com", role: "Member", active: true },
                  { name: "Priya Patel", email: "priya@acme.com", role: "Member", active: false },
                ].map((member) => (
                  <div key={member.email} className="flex items-center justify-between rounded-lg border border-border bg-[#111111] p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a1a] text-sm font-medium text-white">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{member.name}</p>
                        <p className="text-xs text-[#888888]">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-border text-xs text-[#888888]">
                        {member.role}
                      </Badge>
                      <div className={`h-2 w-2 rounded-full ${member.active ? "bg-green-400" : "bg-[#555555]"}`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card className="border-border bg-[#0a0a0a]">
              <CardHeader>
                <CardTitle className="text-base text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-[#888888]">
                  Configure when and how you receive notifications about reviews and activity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Review completed", desc: "Get notified when an AI review is generated", enabled: true },
                  { label: "Low score alerts", desc: "Alert when a PR scores below your threshold", enabled: true },
                  { label: "New PR detected", desc: "Notify when new PRs are opened in connected repos", enabled: false },
                  { label: "Alignment failures", desc: "Alert when alignment checks fail", enabled: true },
                  { label: "Weekly digest", desc: "Receive a weekly summary of review activity", enabled: false },
                ].map((notif) => (
                  <div key={notif.label} className="flex items-center justify-between rounded-lg border border-border bg-[#111111] p-4">
                    <div>
                      <p className="text-sm font-medium text-white">{notif.label}</p>
                      <p className="text-xs text-[#888888]">{notif.desc}</p>
                    </div>
                    <div
                      className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${
                        notif.enabled ? "bg-gradient-to-r from-violet-500 to-indigo-500" : "bg-[#333333]"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 h-5 w-5 rounded-full transition-transform ${
                          notif.enabled
                            ? "translate-x-5 bg-white"
                            : "translate-x-0.5 bg-[#888888]"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Save button */}
      <motion.div variants={item} className="flex justify-end">
        <Button onClick={handleSave} className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
