/// <reference path="./.sst/platform/config.d.ts" />

function getSubDomain({
  domain,
  preview
}: {
  domain: string
  preview: boolean
}) {

  if ($app.stage === "prod") {
    return domain;
  }
  if ($app.stage === "dev" || preview) {
    return "dev." + domain
  }
}

function getRouter({
  subdomain,
}: {
  subdomain: string
}) {
  return $app.stage === "prod" || $app.stage === "dev" ? new sst.aws.Router("MyRouter", {
    domain: {
      name: subdomain,
      aliases: [`*.${subdomain}`]
    }
  }) : sst.aws.Router.get("MyRouter", "E3R5CI23JSB7S7");
}

function getDomain({
  name,
  sha,
  subdomain
}: {
  name: string
  subdomain: string;
  sha?: string;
}) {
  const previewTag = sha ? `-${sha}` : "";
  return `${name}${previewTag}.${subdomain}`;
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
    const sha = process.env.COMMIT_SHA ?? undefined;

    const subdomain = getSubDomain({ domain, preview: Boolean(sha) })

    const router = subdomain ? getRouter({ subdomain }) : new sst.aws.Router("MyRouter");

    new sst.aws.StaticSite("MyWeb", {
      path: "../apps/my-app/",
      router: {
        instance: router,
        domain: subdomain ? getDomain({ subdomain, name: "app", sha }) : router.url
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
        domain: subdomain ? getDomain({ subdomain, name: "docs", sha }) : router.url
      }
    });

    new sst.aws.Function("MyApi", {
      handler: "../apps/my-api/src/index.handler",
      url: {
        router: {
          instance: router,
          domain: subdomain ? getDomain({ subdomain, name: "api", sha }) : router.url
        }
      }
    });
  },
});
