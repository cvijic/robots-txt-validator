import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import axios from "axios";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  robots: router({
    validate: publicProcedure
      .input(
        z.object({
          url: z.string(),
          userAgent: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { url, userAgent } = input;

        try {
          let urlToCheck = url;
          if (!urlToCheck.startsWith("http://") && !urlToCheck.startsWith("https://")) {
            urlToCheck = "https://" + urlToCheck;
          }

          const urlObj = new URL(urlToCheck);
          const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;

          // Fetch robots.txt
          const robotsResponse = await axios.get(robotsUrl, {
            timeout: 10000,
            headers: {
              "User-Agent": userAgent,
            },
          });
          const robotsTxtContent = robotsResponse.data;

          // Fetch HTML page for meta robots and X-Robots-Tag
          let metaRobots: string | null = null;
          let xRobotsTag: string | null = null;
          
          try {
            const pageResponse = await axios.get(urlToCheck, {
              timeout: 10000,
              headers: {
                "User-Agent": userAgent,
              },
            });

            // Extract X-Robots-Tag from response headers
            xRobotsTag = pageResponse.headers["x-robots-tag"] || null;

            // Extract meta robots from HTML
            const html = pageResponse.data;
            const metaRobotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
            if (metaRobotsMatch) {
              metaRobots = metaRobotsMatch[1];
            }
          } catch (error) {
            // Page might not be accessible, but we still have robots.txt
            console.log("Could not fetch page for meta robots check:", error);
          }

          // Parse robots.txt
          const isAllowed = checkIfAllowed(robotsTxtContent, urlObj.pathname, userAgent);
          const rules = parseRobotsTxtRules(robotsTxtContent, userAgent);

          return {
            url: urlToCheck,
            userAgent,
            allowed: isAllowed,
            rules,
            robotsTxtContent,
            metaRobots,
            xRobotsTag,
          };
        } catch (error: any) {
          throw new Error(
            error.response?.status === 404
              ? "robots.txt not found for this domain"
              : "Failed to fetch robots.txt. The domain may not exist or is not accessible."
          );
        }
      }),
  }),
});

function checkIfAllowed(content: string, path: string, agent: string): boolean {
  const lines = content.split("\n");
  let currentAgent: string | null = null;
  const disallowRules: string[] = [];
  const allowRules: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (trimmed.toLowerCase().startsWith("user-agent:")) {
      const agentName = trimmed.substring(11).trim().toLowerCase();
      if (agentName === agent || agentName === "*") {
        currentAgent = agentName;
      }
    } else if (trimmed.toLowerCase().startsWith("disallow:") && currentAgent) {
      const rule = trimmed.substring(9).trim();
      if (rule) disallowRules.push(rule);
    } else if (trimmed.toLowerCase().startsWith("allow:") && currentAgent) {
      const rule = trimmed.substring(6).trim();
      if (rule) allowRules.push(rule);
    }
  }

  for (const rule of allowRules) {
    if (path.startsWith(rule)) return true;
  }

  for (const rule of disallowRules) {
    if (path.startsWith(rule)) return false;
  }

  return true;
}

function parseRobotsTxtRules(content: string, agent: string): string[] {
  const lines = content.split("\n");
  const rules: string[] = [];
  let currentAgent: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (trimmed.toLowerCase().startsWith("user-agent:")) {
      const agentName = trimmed.substring(11).trim().toLowerCase();
      if (agentName === agent || agentName === "*") {
        currentAgent = agentName;
      }
    } else if (currentAgent && trimmed.toLowerCase().startsWith("disallow:")) {
      const rule = trimmed.substring(9).trim();
      if (rule) rules.push(`Disallow: ${rule}`);
    } else if (currentAgent && trimmed.toLowerCase().startsWith("allow:")) {
      const rule = trimmed.substring(6).trim();
      if (rule) rules.push(`Allow: ${rule}`);
    }
  }

  return rules.length > 0 ? rules : ["No specific rules found"];
}

export type AppRouter = typeof appRouter;
