import { fetchPrefectures } from "@/domains/prefectures";
import { Hono } from "hono";

const routes = new Hono<{ Bindings: Bindings }>();

routes.get("/prefectures", async (c) => {
  const response = await fetchPrefectures(c.env);
  return c.json(response);
});

export default routes;
