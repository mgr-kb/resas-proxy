import { configs } from "@/configs";
import { HttpClient } from "@/utils/HttpClient";

interface PopulationCompositionPerYearResponse {
  message: string;
  result: {
    boundaryYear: number;
    data: {
      label: string;
      data: {
        year: number;
        value: number;
        rate: number;
      }[];
    }[];
  };
}

export const fetchPopulationCompositionPerYear = async (
  prefCode: number,
  bindings: Bindings,
) => {
  const path = `${configs.populationCompositionPerYear.path}?prefCode=${prefCode}`;
  const httpClient = new HttpClient({ baseURL: configs.baseUrl });
  const response = await httpClient.get<PopulationCompositionPerYearResponse>(
    path,
    {
      "X-API-KEY": bindings.API_SECRET,
    },
  );
  return response;
};
