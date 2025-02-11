import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import routes from "./routes";
import { ApiError } from "./utils/ApiError";
import { appLogger } from "./utils/appLogger";

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

app.use(
  cors({
    origin: "https://mgr-kb.github.io",
    allowMethods: ["GET"],
    allowHeaders: ["Content-Type"],
    credentials: true,
    maxAge: 86400,
  }),
);
app.route("/", routes);

app.onError((err, c) => {
  const statusCode = err instanceof ApiError ? err.status : 500;
  const message =
    err instanceof ApiError ? err.message : "Internal Server Error";

  appLogger(statusCode.toString(), message);

  return c.json<ErrorResponse>({ message }, statusCode);
});

export default app;
