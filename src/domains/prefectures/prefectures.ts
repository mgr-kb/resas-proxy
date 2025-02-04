import { configs } from "@/configs";
import { HttpClient } from "@/utils/HttpClient";

interface PrefecturesResponse {
  message: string;
  result: {
    prefCode: number;
    prefName: string;
  }[];
}

export const fetchPrefectures = async (bindings: Bindings) => {
  const httpClient = new HttpClient({ baseURL: configs.baseUrl });
  const response = await httpClient.get<PrefecturesResponse>(
    configs.prefectures.path,
    {
      "X-API-KEY": bindings.API_SECRET,
    },
  );
  return response;
};
