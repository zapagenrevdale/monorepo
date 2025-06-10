/// <reference path="./.sst/platform/config.d.ts" />

function getSubDomain({
  domain,
  sha
}: {
  domain: string
  sha: string;
}) {
  let prefix = sha ? `${sha}.` : "";

  let subdomain = $app.protect ? `${prefix}${$app.stage}.${domain}` : null;
  return subdomain;
}

function getPrefix({
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

    const subdomain = getSubDomain({ domain, sha })

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
        domain: `${getPrefix({ subdomain, name: "app", sha })}.${subdomain}`
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
        domain: `${getPrefix({ subdomain, name: "docs", sha })}.${subdomain}`
      }
    });

    new sst.aws.Function("MyApi", {
      handler: "../apps/my-api/src/index.handler",
      url: {
        router: {
          instance: router,
          domain: `${getPrefix({ subdomain, name: "api", sha })}.${subdomain}`
        }
      }
    });
  },
});
