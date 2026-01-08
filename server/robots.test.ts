import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("robots.validate", () => {
  it("should validate robots.txt for a valid domain", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.robots.validate({
      url: "google.com",
      userAgent: "googlebot",
      checkResources: false,
    });

    expect(result).toBeDefined();
    expect(result.url).toContain("google.com");
    expect(result.userAgent).toBe("googlebot");
    expect(result.robotsTxtContent).toBeDefined();
    expect(result.robotsTxtContent.length).toBeGreaterThan(0);
    expect(result.rules).toBeDefined();
    expect(Array.isArray(result.rules)).toBe(true);
    expect(typeof result.allowed).toBe("boolean");
  });

  it("should handle URLs without protocol", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.robots.validate({
      url: "github.com",
      userAgent: "googlebot",
      checkResources: false,
    });

    expect(result.url).toMatch(/^https?:\/\//);
    expect(result.url).toContain("github.com");
  });

  it("should parse rules for specific user agent", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.robots.validate({
      url: "google.com",
      userAgent: "googlebot",
      checkResources: false,
    });

    expect(result.rules).toBeDefined();
    expect(result.rules.length).toBeGreaterThan(0);
  });

  it("should handle different user agents", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const userAgents = ["googlebot", "bingbot", "*"];

    for (const agent of userAgents) {
      const result = await caller.robots.validate({
        url: "google.com",
        userAgent: agent,
        checkResources: false,
      });

      expect(result.userAgent).toBe(agent);
      expect(result.robotsTxtContent).toBeDefined();
    }
  });

  it("should throw error for invalid domain", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.robots.validate({
        url: "this-domain-does-not-exist-12345678.com",
        userAgent: "googlebot",
        checkResources: false,
      })
    ).rejects.toThrow();
  });
});
