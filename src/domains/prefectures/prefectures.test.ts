import { ApiError } from "@/utils/ApiError";
import { HttpClient } from "@/utils/HttpClient";
import { fetchPrefectures } from "./prefectures";

describe("fetchPrefectures", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("リクエストに成功したらレスポンスボディを返す", async () => {
    const mockApiSecret = "test";
    const mockResponse = {
      message: "success",
      result: [
        { prefCode: 1, prefName: "北海道" },
        { prefCode: 2, prefName: "青森県" },
      ],
    };
    vi.spyOn(HttpClient.prototype, "get").mockResolvedValueOnce(mockResponse);
    const httpClient = new HttpClient({ baseURL: "https://sample.com" });

    const prefectures = await fetchPrefectures({ API_SECRET: mockApiSecret });

    expect(prefectures).toEqual(mockResponse);
    expect(httpClient.get).toHaveBeenCalledWith(expect.any(String), {
      "X-API-KEY": mockApiSecret,
    });
  });
  it("リクエストに失敗したらエラーがthrowされる", async () => {
    const mockApiSecret = "test";
    const mockError = new ApiError({ message: "mock Error" });
    vi.spyOn(HttpClient.prototype, "get").mockRejectedValueOnce(mockError);
    const httpClient = new HttpClient({ baseURL: "https://sample.com" });

    await expect(() =>
      fetchPrefectures({ API_SECRET: mockApiSecret }),
    ).rejects.toThrowError(mockError);
    expect(httpClient.get).toHaveBeenCalledWith(expect.any(String), {
      "X-API-KEY": mockApiSecret,
    });
  });
});
