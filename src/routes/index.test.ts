import {
  type Unstable_DevWorker,
  getPlatformProxy,
  unstable_dev,
} from "wrangler";

import * as domainsPrefectures from "@/domains/prefectures";
import { ApiError } from "@/utils/ApiError";
import routes from ".";

describe("routes", async () => {
  let worker: Unstable_DevWorker;
  const { env } = await getPlatformProxy();

  beforeAll(async () => {
    worker = await unstable_dev("./src/routes/index.ts", {
      experimental: {
        disableExperimentalWarning: true,
      },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  describe("GET /prefectures", () => {
    it("正常レスポンス", async () => {
      const mockResponse = {
        message: "success",
        result: [
          { prefCode: 1, prefName: "北海道" },
          { prefCode: 2, prefName: "青森県" },
        ],
      };
      const spyFetchPrefectures = vi
        .spyOn(domainsPrefectures, "fetchPrefectures")
        .mockResolvedValueOnce(mockResponse);

      const response = await routes.request(
        "/prefectures",
        { method: "GET", headers: { "Content-Type": "application/json" } },
        env,
      );
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json).toEqual(mockResponse);
      expect(spyFetchPrefectures).toHaveBeenCalledWith(env);
    });
    it("エラーレスポンス", async () => {
      const mockError = new ApiError({ message: "mock Error" });
      const spyFetchPrefectures = vi
        .spyOn(domainsPrefectures, "fetchPrefectures")
        .mockRejectedValueOnce(mockError);

      const response = await routes.request(
        "/prefectures",
        { method: "GET", headers: { "Content-Type": "application/json" } },
        env,
      );

      expect(response.status).toBe(500);
      expect(spyFetchPrefectures).toHaveBeenCalledWith(env);
    });
  });
});
