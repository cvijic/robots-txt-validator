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
import { Loader2, CheckCircle, XCircle, AlertCircle, Copy, Check, Info } from "lucide-react";
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
  metaRobots: string | null;
  xRobotsTag: string | null;
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
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseMetaRobots = (metaContent: string | null) => {
    if (!metaContent) return null;
    
    const directives = metaContent.toLowerCase().split(',').map(d => d.trim());
    return {
      noindex: directives.includes('noindex'),
      nofollow: directives.includes('nofollow'),
      noarchive: directives.includes('noarchive'),
      nosnippet: directives.includes('nosnippet'),
      noimageindex: directives.includes('noimageindex'),
      raw: metaContent,
    };
  };

  const parseXRobotsTag = (xRobots: string | null) => {
    if (!xRobots) return null;
    
    const directives = xRobots.toLowerCase().split(',').map(d => d.trim());
    return {
      noindex: directives.includes('noindex'),
      nofollow: directives.includes('nofollow'),
      noarchive: directives.includes('noarchive'),
      nosnippet: directives.includes('nosnippet'),
      noimageindex: directives.includes('noimageindex'),
      raw: xRobots,
    };
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">robots<span className="text-accent">.txt</span></h1>
                <span className="text-sm text-muted-foreground">by</span>
                <span className="text-lg font-semibold text-accent">Funky Enterprises LLC</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Validator and Testing Tool
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setMode("live")}
                className={mode === "live" ? "bg-accent text-accent-foreground hover:opacity-90 border-accent" : "bg-transparent text-foreground hover:bg-accent/10 border-border"}
              >
                Live
              </Button>
              <Button
                variant="outline"
                onClick={() => setMode("editor")}
                className={mode === "editor" ? "bg-accent text-accent-foreground hover:opacity-90 border-accent" : "bg-transparent text-foreground hover:bg-accent/10 border-border"}
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
                  <SelectContent className="bg-card border-border z-50 max-h-[300px] overflow-y-auto">
                    {USER_AGENTS.map((agent) => (
                      <SelectItem key={agent.value} value={agent.value}>
                        {agent.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={validateRobotsTxt}
                disabled={validateMutation.isPending}
                className="w-full bg-accent text-accent-foreground hover:opacity-90 border-2 border-accent font-bold text-base py-6 shadow-[0_0_20px_rgba(212,255,0,0.6)] hover:shadow-[0_0_30px_rgba(212,255,0,0.8)] transition-all duration-300 hover:scale-[1.02]"
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
                Test and validate your robots.txt file, meta robots tags, and X-Robots-Tag HTTP headers. 
                Check if a URL is blocked, which directives are affecting it, and for which user agent.
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
                    <h3 className="font-bold text-foreground">robots.txt Status</h3>
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

                {/* Meta Robots Card */}
                {result.metaRobots && (
                  <Card className="bg-card border-border p-6">
                    <h3 className="font-bold text-foreground mb-3">Meta Robots Tag</h3>
                    <div className="space-y-2">
                      <div className="bg-card border border-border rounded-sm p-3 font-mono text-xs">
                        <span className="text-accent">{result.metaRobots}</span>
                      </div>
                      {(() => {
                        const parsed = parseMetaRobots(result.metaRobots);
                        if (!parsed) return null;
                        return (
                          <div className="space-y-1 text-xs">
                            {parsed.noindex && (
                              <div className="flex items-center gap-2">
                                <XCircle className="w-3 h-3 text-red-500" />
                                <span className="text-muted-foreground">noindex - Page will not be indexed</span>
                              </div>
                            )}
                            {parsed.nofollow && (
                              <div className="flex items-center gap-2">
                                <XCircle className="w-3 h-3 text-red-500" />
                                <span className="text-muted-foreground">nofollow - Links will not be followed</span>
                              </div>
                            )}
                            {parsed.noarchive && (
                              <div className="flex items-center gap-2">
                                <Info className="w-3 h-3 text-yellow-500" />
                                <span className="text-muted-foreground">noarchive - No cached version</span>
                              </div>
                            )}
                            {parsed.nosnippet && (
                              <div className="flex items-center gap-2">
                                <Info className="w-3 h-3 text-yellow-500" />
                                <span className="text-muted-foreground">nosnippet - No snippet in search results</span>
                              </div>
                            )}
                            {parsed.noimageindex && (
                              <div className="flex items-center gap-2">
                                <Info className="w-3 h-3 text-yellow-500" />
                                <span className="text-muted-foreground">noimageindex - Images will not be indexed</span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </Card>
                )}

                {/* X-Robots-Tag Card */}
                {result.xRobotsTag && (
                  <Card className="bg-card border-border p-6">
                    <h3 className="font-bold text-foreground mb-3">X-Robots-Tag Header</h3>
                    <div className="space-y-2">
                      <div className="bg-card border border-border rounded-sm p-3 font-mono text-xs">
                        <span className="text-accent">{result.xRobotsTag}</span>
                      </div>
                      {(() => {
                        const parsed = parseXRobotsTag(result.xRobotsTag);
                        if (!parsed) return null;
                        return (
                          <div className="space-y-1 text-xs">
                            {parsed.noindex && (
                              <div className="flex items-center gap-2">
                                <XCircle className="w-3 h-3 text-red-500" />
                                <span className="text-muted-foreground">noindex - Page will not be indexed</span>
                              </div>
                            )}
                            {parsed.nofollow && (
                              <div className="flex items-center gap-2">
                                <XCircle className="w-3 h-3 text-red-500" />
                                <span className="text-muted-foreground">nofollow - Links will not be followed</span>
                              </div>
                            )}
                            {parsed.noarchive && (
                              <div className="flex items-center gap-2">
                                <Info className="w-3 h-3 text-yellow-500" />
                                <span className="text-muted-foreground">noarchive - No cached version</span>
                              </div>
                            )}
                            {parsed.nosnippet && (
                              <div className="flex items-center gap-2">
                                <Info className="w-3 h-3 text-yellow-500" />
                                <span className="text-muted-foreground">nosnippet - No snippet in search results</span>
                              </div>
                            )}
                            {parsed.noimageindex && (
                              <div className="flex items-center gap-2">
                                <Info className="w-3 h-3 text-yellow-500" />
                                <span className="text-muted-foreground">noimageindex - Images will not be indexed</span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </Card>
                )}

                {/* No Meta/X-Robots Info */}
                {!result.metaRobots && !result.xRobotsTag && (
                  <Card className="bg-card border-border p-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <h3 className="font-bold text-foreground text-sm">No Blocking Directives</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          No meta robots tag or X-Robots-Tag header found. Page is indexable.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

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
