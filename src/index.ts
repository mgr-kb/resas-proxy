import { Hono } from "hono";
import { logger } from "hono/logger";
import { ApiError } from "./utils/ApiError";
import { appLogger } from "./utils/appLogger";

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.onError((err, c) => {
  const statusCode = err instanceof ApiError ? err.status : 500;
  const message =
    err instanceof ApiError ? err.message : "Internal Server Error";

  appLogger(statusCode.toString(), message);

  return c.json<ErrorResponse>({ message }, statusCode);
});

export default app;
