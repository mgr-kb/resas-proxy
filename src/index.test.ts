import {
	type Unstable_DevWorker,
	getPlatformProxy,
	unstable_dev,
} from "wrangler";

import app from "./index";

const { env } = await getPlatformProxy();

describe("GET /", async () => {
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

	it("正常レスポンス", async () => {
		const response = await app.request(
			"/",
			{ method: "GET", headers: { "Content-Type": "application/json" } },
			env,
		);
		const text = await response.text();

		expect(response.status).toBe(200);
		expect(text).toBe("Hello Hono!");
	});
});
