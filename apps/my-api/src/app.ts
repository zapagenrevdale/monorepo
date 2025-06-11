import { version } from "../package.json";
import { Hono } from 'hono'
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";

export function createApp({ enableCors }: { enableCors?: boolean }) {
  const app = new Hono()
  app.use(trimTrailingSlash());
  app.use(logger());

  // when using SST local dev, router/lambda is used to handle CORS
  if (enableCors) {
    app.use("/v1/*", cors());
  }

  app.get("/", (c) => {
    return c.text(`My API ${version}`);
  });


  app.get("/api", (c) => {
    return c.text("API is working just fine");
  });

  return app;
}


