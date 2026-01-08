import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle, XCircle, AlertCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

/**
 * Design: Technical Minimalism with Precision
 * - Dark charcoal background with cyan/lime accents
 * - Monospace typography for technical content
 * - Asymmetric two-column layout
 * - Terminal-style interactions with micro-animations
 */

interface RobotsResult {
  url: string;
  userAgent: string;
  allowed: boolean;
  rules: string[];
  robotsTxtContent: string;
  resources?: {
    css: boolean;
    javascript: boolean;
    images: boolean;
  };
}

const USER_AGENTS = [
  { value: "googlebot", label: "Googlebot" },
  { value: "bingbot", label: "Bingbot" },
  { value: "slurp", label: "Yahoo Slurp" },
  { value: "duckduckbot", label: "DuckDuckBot" },
  { value: "baiduspider", label: "Baidu Spider" },
  { value: "yandexbot", label: "Yandex Bot" },
  { value: "*", label: "All Robots (*)" },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [userAgent, setUserAgent] = useState("googlebot");
  const [checkResources, setCheckResources] = useState(false);
  const [result, setResult] = useState<RobotsResult | null>(null);
  const [mode, setMode] = useState<"live" | "editor">("live");
  const [copied, setCopied] = useState(false);

  const validateMutation = trpc.robots.validate.useMutation({
    onSuccess: (data) => {
      setResult(data);
      toast.success("Robots.txt validated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
      setResult(null);
    },
  });

  const validateRobotsTxt = () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    validateMutation.mutate({
      url,
      userAgent,
      checkResources,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-accent">robots.txt</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Validator and Testing Tool
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={mode === "live" ? "default" : "outline"}
                onClick={() => setMode("live")}
                className="bg-accent text-accent-foreground hover:opacity-90 border border-accent"
              >
                Live
              </Button>
              <Button
                variant={mode === "editor" ? "default" : "outline"}
                onClick={() => setMode("editor")}
                className="bg-transparent text-accent hover:bg-accent/10 border border-accent"
              >
                Editor
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel - Left */}
          <div className="space-y-6">
            <Card className="bg-card border-border p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  URL
                </label>
                <Input
                  type="text"
                  placeholder="example.com or https://example.com/page"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && validateRobotsTxt()}
                  className="bg-input border border-border rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  User Agent
                </label>
                <Select value={userAgent} onValueChange={setUserAgent}>
                  <SelectTrigger className="bg-input border border-border rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {USER_AGENTS.map((agent) => (
                      <SelectItem key={agent.value} value={agent.value}>
                        {agent.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="resources"
                  checked={checkResources}
                  onCheckedChange={(checked) =>
                    setCheckResources(checked as boolean)
                  }
                  className="border-accent"
                />
                <label
                  htmlFor="resources"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Check Resources (CSS, JS, Images)
                </label>
              </div>

              <Button
                onClick={validateRobotsTxt}
                disabled={validateMutation.isPending}
                className="w-full bg-accent text-accent-foreground hover:opacity-90 border border-accent"
              >
                {validateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test robots.txt"
                )}
              </Button>
            </Card>

            {/* Info Section */}
            <Card className="bg-card border-border p-6">
              <h3 className="font-bold text-sm text-accent mb-3">About</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Test and validate your robots.txt file. Check if a URL is blocked,
                which statement is blocking it, and for which user agent. You can
                also check if the resources for the page (CSS, JavaScript, images)
                are disallowed.
              </p>
            </Card>
          </div>

          {/* Results Panel - Right */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Status Card */}
                <Card className="bg-card border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground">Status</h3>
                    {result.allowed ? (
                      <div className="status-badge status-allowed">
                        <CheckCircle className="w-4 h-4" />
                        ALLOWED
                      </div>
                    ) : (
                      <div className="status-badge status-blocked">
                        <XCircle className="w-4 h-4" />
                        BLOCKED
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">URL:</span>
                      <p className="text-foreground font-mono break-all mt-1">
                        {result.url}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">User Agent:</span>
                      <p className="text-foreground font-mono mt-1">
                        {result.userAgent}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Rules Card */}
                <Card className="bg-card border-border p-6">
                  <h3 className="font-bold text-foreground mb-3">Matching Rules</h3>
                  <div className="bg-card border border-border rounded-sm p-4 font-mono text-sm overflow-x-auto space-y-2">
                    {result.rules.map((rule, idx) => (
                      <div key={idx} className="text-xs">
                        <span className="text-accent">{rule}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Resources Check */}
                {result.resources && (
                  <Card className="bg-card border-border p-6">
                    <h3 className="font-bold text-foreground mb-3">
                      Resources Status
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">CSS</span>
                        {result.resources.css ? (
                          <span className="status-badge status-allowed">
                            <CheckCircle className="w-3 h-3" />
                            Available
                          </span>
                        ) : (
                          <span className="status-badge status-unknown">
                            <AlertCircle className="w-3 h-3" />
                            Not Found
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">JavaScript</span>
                        {result.resources.javascript ? (
                          <span className="status-badge status-allowed">
                            <CheckCircle className="w-3 h-3" />
                            Available
                          </span>
                        ) : (
                          <span className="status-badge status-unknown">
                            <AlertCircle className="w-3 h-3" />
                            Not Found
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Images</span>
                        {result.resources.images ? (
                          <span className="status-badge status-allowed">
                            <CheckCircle className="w-3 h-3" />
                            Available
                          </span>
                        ) : (
                          <span className="status-badge status-unknown">
                            <AlertCircle className="w-3 h-3" />
                            Not Found
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                {/* robots.txt Content */}
                {mode === "editor" && (
                  <Card className="bg-card border-border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-foreground">robots.txt Content</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard(result.robotsTxtContent)
                        }
                        className="text-accent hover:bg-accent/10"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-card border border-border rounded-sm p-4 font-mono text-sm overflow-x-auto max-h-64 overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap break-words text-foreground">
                        {result.robotsTxtContent}
                      </pre>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <Card className="bg-card border-border p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter a URL and click "Test robots.txt" to see results
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
