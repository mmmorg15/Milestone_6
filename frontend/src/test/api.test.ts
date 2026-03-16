import { describe, expect, it } from "vitest";

import { buildApiUrl, getApiBaseUrl, missingApiUrlMessage, normalizeApiBaseUrl } from "@/lib/api";

describe("api config", () => {
  it("returns the configured API base URL", () => {
    expect(getApiBaseUrl("http://is401team09.us-east-2.elasticbeanstalk.com")).toBe(
      "http://is401team09.us-east-2.elasticbeanstalk.com"
    );
  });

  it("normalizes a trailing slash away", () => {
    expect(normalizeApiBaseUrl("http://is401team09.us-east-2.elasticbeanstalk.com/")).toBe(
      "http://is401team09.us-east-2.elasticbeanstalk.com"
    );
    expect(buildApiUrl("/api/health", "http://is401team09.us-east-2.elasticbeanstalk.com/")).toBe(
      "http://is401team09.us-east-2.elasticbeanstalk.com/api/health"
    );
  });

  it("throws a clear error when the env value is missing", () => {
    expect(() => getApiBaseUrl("")).toThrow(missingApiUrlMessage);
  });
});
