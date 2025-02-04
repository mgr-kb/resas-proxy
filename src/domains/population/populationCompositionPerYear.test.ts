import { ApiError } from "@/utils/ApiError";
import { HttpClient } from "@/utils/HttpClient";
import { fetchPopulationCompositionPerYear } from "./populationCompositionPerYear";

describe("fetchPopulationCompositionPerYear", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("リクエストに成功したらレスポンスボディを返す", async () => {
    const mockApiSecret = "test";
    const mockPrefCode = 123;
    const mockResponse = {
      message: "success",
      result: {
        boundaryYear: 2020,
        data: [
          {
            label: "年少人口",
            data: [
              {
                year: 1960,
                value: 1681479,
                rate: 33.37,
              },
            ],
          },
        ],
      },
    };
    vi.spyOn(HttpClient.prototype, "get").mockResolvedValueOnce(mockResponse);
    const httpClient = new HttpClient({ baseURL: "https://sample.com" });

    const prefectures = await fetchPopulationCompositionPerYear(mockPrefCode, {
      API_SECRET: mockApiSecret,
    });

    expect(prefectures).toEqual(mockResponse);
    expect(httpClient.get).toHaveBeenCalledWith(
      expect.stringContaining(mockPrefCode.toString()),
      {
        "X-API-KEY": mockApiSecret,
      },
    );
  });
  it("リクエストに失敗したらエラーがthrowされる", async () => {
    const mockApiSecret = "test";
    const mockPrefCode = 123;
    const mockError = new ApiError({ message: "mock Error" });
    vi.spyOn(HttpClient.prototype, "get").mockRejectedValueOnce(mockError);
    const httpClient = new HttpClient({ baseURL: "https://sample.com" });

    await expect(() =>
      fetchPopulationCompositionPerYear(mockPrefCode, {
        API_SECRET: mockApiSecret,
      }),
    ).rejects.toThrowError(mockError);
    expect(httpClient.get).toHaveBeenCalledWith(
      expect.stringContaining(mockPrefCode.toString()),
      {
        "X-API-KEY": mockApiSecret,
      },
    );
  });
});
