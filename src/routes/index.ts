import { fetchPopulationCompositionPerYear } from "@/domains/population";
import { fetchPrefectures } from "@/domains/prefectures";
import { Hono } from "hono";
import { validator } from "hono/validator";

const routes = new Hono<{ Bindings: Bindings }>();

routes.get("/prefectures", async (c) => {
  const response = await fetchPrefectures(c.env);
  return c.json(response);
});

routes.get(
  "/population/compotion/perYear/:prefCode",
  validator("param", (_, c) => {
    const prefCode = Number(c.req.param("prefCode"));
    if (typeof prefCode !== "number" || Number.isNaN(prefCode)) {
      return c.json({ message: "prefCode must be a number" }, { status: 400 });
    }
    return {
      prefCode,
    };
  }),
  async (c) => {
    const prefCode = Number(c.req.param("prefCode"));
    const response = await fetchPopulationCompositionPerYear(prefCode, c.env);
    return c.json(response);
  },
);

export default routes;
