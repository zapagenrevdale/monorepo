/// <reference path="./.sst/platform/config.d.ts" />


function getDomain({
  domain,
  name
}: {
  domain: string
  name?: string;
}) {
  let prefix = name ? `${name}.` : "";

  let subdomain = $app.protect ? `${prefix}${$app.stage}.${domain}` : null;
  return subdomain;
}

export default $config({
  app(input) {
    return {
      name: "gdz-infra",
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod", "dev"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {

    const domain = "genrevzapa.com";
    const name = process.env.PREVIEW_NAME ?? undefined;

    const subdomain = getDomain({ domain, name })

    const router = subdomain ? new sst.aws.Router("MyRouter", {
      domain: {
        name: subdomain,
        aliases: [`*.${subdomain}`]
      }
    }) : new sst.aws.Router("MyRouter");

    new sst.aws.StaticSite("MyWeb", {
      path: "../apps/my-app/",
      router: {
        instance: router,
      },
      build: {
        command: "pnpm run build",
        output: "dist"
      }
    });


    new sst.aws.Nextjs("MyDocs", {
      path: "../apps/my-docs/",
      router: {
        instance: router,
        domain: `docs.${subdomain}`
      }
    });


    new sst.aws.Function("MyApi", {
      handler: "../apps/my-api/src/index.handler",
      url: {
        router: {
          instance: router,
          path: "/api"
        }
      }
    });
  },
});
