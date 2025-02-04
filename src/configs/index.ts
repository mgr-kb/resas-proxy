/**
 * [NOTE]
 * baseUrl, apiごとのendpointは環境によって変更される可能性もあるが、
 * 今回は固定値として設定します。
 */
export const configs = {
  baseUrl: "https://yumemi-frontend-engineer-codecheck-api.vercel.app",
  prefectures: {
    path: "/api/v1/prefectures",
  },
  populationCompositionPerYear: {
    path: "/api/v1/population/composition/perYear",
  },
} as const;
