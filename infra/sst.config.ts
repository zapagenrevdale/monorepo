/// <reference path="./.sst/platform/config.d.ts" />

function getSubDomain({ domain, preview }: { domain: string; preview: boolean }) {
  if ($app.stage === "prod") {
    return "prod." + domain;
  }
  if ($app.stage === "dev" || preview) {
    return "dev." + domain;
  }
}

function getRouter({ subdomain }: { subdomain: string }) {
  return $app.stage === "prod" || $app.stage === "dev"
    ? new sst.aws.Router("MyRouter", {
      domain: {
        name: subdomain,
        aliases: [`*.${subdomain}`],
      },
    })
    : sst.aws.Router.get("MyRouter", "E3R5CI23JSB7S7");
}

function getDomain({
  name,
  prNumber,
  subdomain,
}: {
  name: string;
  subdomain: string;
  prNumber?: string;
}) {
  const previewTag = prNumber ? `-${prNumber}` : "";
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
    const prNumber = process.env.PR_NUMBER ?? undefined;

    const subdomain = getSubDomain({ domain, preview: Boolean(prNumber) });

    const router = subdomain ? getRouter({ subdomain }) : new sst.aws.Router("MyRouter");


    const api = new sst.aws.Function("MyApi", {
      architecture: "arm64",
      handler: "../apps/my-api/src/index.handler",
      copyFiles: [
        {
          from: "../packages/db/node_modules/@prisma/client/runtime/",
          to: "node_modules/@prisma/client/runtime"
        },
        {
          from: "../packages/db/node_modules/@prisma/client/default.js",
          to: "node_modules/@prisma/client/default.js"
        },
        {
          from: "../packages/db/node_modules/@prisma/client/edge.js",
          to: "node_modules/@prisma/client/edge.js"
        },
        {
          from: "../packages/db/node_modules/@prisma/client/extension.js",
          to: "node_modules/@prisma/client/extension.js"
        },
        {
          from: "../packages/db/node_modules/@prisma/client/index-browser.js",
          to: "node_modules/@prisma/client/index-browser.js"
        },
        {
          from: "../packages/db/node_modules/@prisma/client/index.js",
          to: "node_modules/@prisma/client/index.js"
        },
        {
          from: "../packages/db/node_modules/@prisma/client/package.json",
          to: "node_modules/@prisma/client/package.json"
        },
        {
          from: "../packages/db/node_modules/@prisma/client/react-native.js",
          to: "node_modules/@prisma/client/react-native.js"
        },

        {
          from: "../packages/db/node_modules/@prisma/client/sql.js",
          to: "node_modules/@prisma/client/sql.js"
        },
        {
          from: "../packages/db/node_modules/@prisma/client/sql.mjs",
          to: "node_modules/@prisma/client/sql.mjs"
        },
        {
          from: "../packages/db/node_modules/@prisma/client/wasm.js",
          to: "node_modules/@prisma/client/wasm.js"
        },
      ],

      url: {
        router: {
          instance: router,
          domain: subdomain ? getDomain({ subdomain, name: "api", prNumber }) : undefined,
        },
      },
      environment: {
        DATABASE_URL: process.env.DATABASE_URL,
      },
      logging: {
        logGroup: "my-api",
      },
      nodejs: {
        esbuild: {
          external: ["@prisma/client"],
          platform: "node",
        },
        install: ["@prisma/client"],
      },
      runtime: "nodejs22.x",
    });

    new sst.aws.StaticSite("MyWeb", {
      path: "../apps/my-app/",
      router: {
        instance: router,
        domain: subdomain ? getDomain({ subdomain, name: "app", prNumber }) : router.url,
      },
      build: {
        command: "pnpm run build",
        output: "dist",
      },
      environment: {
        VITE_API_URL: api.url,
      }
    });

    new sst.aws.Nextjs("MyDocs", {
      path: "../apps/my-docs/",
      router: {
        instance: router,
        domain: subdomain ? getDomain({ subdomain, name: "docs", prNumber }) : router.url,
      },
      environment: {
        NEXT_PUBLIC_API_URL: api.url
      }
    });


  },
});
