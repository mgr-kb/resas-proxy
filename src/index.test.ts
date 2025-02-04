import {
  type Unstable_DevWorker,
  getPlatformProxy,
  unstable_dev,
} from "wrangler";

import app from "./index";

const { env } = await getPlatformProxy();

describe("src/index.ts", async () => {
  let worker: Unstable_DevWorker;

  beforeAll(async () => {
    worker = await unstable_dev("./src/index.ts", {
      experimental: {
        disableExperimentalWarning: true,
      },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  /**
   * [NOTE]
   * routes系のテストは、route定義側で実施
   */

  it("エラーレスポンス 404", async () => {
    const response = await app.request(
      "/error",
      { method: "GET", headers: { "Content-Type": "application/json" } },
      env,
    );

    expect(response.status).toBe(404);
  });
});
