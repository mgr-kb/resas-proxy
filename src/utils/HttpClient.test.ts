import { ApiError } from "./ApiError";
import { HttpClient } from "./HttpClient";

const mockFetch = vi.fn();

globalThis.fetch = mockFetch as unknown as typeof fetch;

describe("HttpClient", () => {
	const baseURL = "https://sample-resas-api.com";
	let client: HttpClient;

	beforeEach(() => {
		client = new HttpClient({ baseURL });
		mockFetch.mockClear();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("getに成功したらレスポンスを返す", async () => {
		mockFetch.mockResolvedValueOnce(
			new Response(JSON.stringify({ id: 1, title: "Test" }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);

		const result = await client.get("/get/1");
		expect(result).toEqual({ id: 1, title: "Test" });
		expect(mockFetch).toHaveBeenCalledWith(
			`${baseURL}/get/1`,
			expect.any(Object),
		);
	});

	it("postに成功したらレスポンスを返す", async () => {
		mockFetch.mockResolvedValueOnce(
			new Response(JSON.stringify({ success: true }), {
				status: 201,
				headers: { "Content-Type": "application/json" },
			}),
		);

		const result = await client.post("/posts", { title: "New Post" });
		expect(result).toEqual({ success: true });
		expect(mockFetch).toHaveBeenCalledWith(
			`${baseURL}/posts`,
			expect.any(Object),
		);
	});

	it("リトライ回数を超えてエラーを受け取る場合、エラーをthrowする", async () => {
		mockFetch.mockResolvedValue(
			new Response(null, { status: 500, statusText: "Internal Server Error" }),
		);

		await expect(client.get("/error")).rejects.toThrow(
			"Http Error. Internal Server Error",
		);
	});

	it("リトライが成功した場合、レスポンスを返す", async () => {
		client = new HttpClient({ baseURL, retries: 1 });
		mockFetch.mockRejectedValueOnce(new Error("Network Error"));
		mockFetch.mockResolvedValueOnce(
			new Response(JSON.stringify({ id: 2, title: "Retried" }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);

		const result = await client.get("/retry");
		expect(result).toEqual({ id: 2, title: "Retried" });
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	it("AbortErrorが発生した場合、リトライする", async () => {
		client = new HttpClient({ baseURL, retries: 1 });
		// 1回目はAbortErrorを発生させる
		mockFetch.mockRejectedValueOnce(
			new ApiError({ message: "Abort Error.", name: "AbortError" }),
		);
		// 2回目は成功する
		mockFetch.mockResolvedValueOnce(
			new Response(JSON.stringify({ id: 1, title: "Test" }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);

		await client.get("/abort");
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});
});
