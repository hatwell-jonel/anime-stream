import { createORPCClient, onError } from "@orpc/client";
import type { InferClientOutputs } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { DedupeRequestsPlugin } from "@orpc/client/plugins";
import type { RouterClient } from "@orpc/server";
import type { TAnimeRouter } from "./router";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

const link = new RPCLink({
  url: `${getBaseUrl()}/rpc`,
  plugins: [
    new DedupeRequestsPlugin({
      filter: ({ request }) => request.method === "GET",
      groups: [
        {
          condition: () => true,
          context: {},
        },
      ],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error("[oRPC Error]:", error);
    }),
  ],
});

export const orpcClient: RouterClient<TAnimeRouter> = createORPCClient(link);

export type RouterOutputs = InferClientOutputs<RouterClient<AppRouter>>;


// import { createORPCClient, onError } from '@orpc/client'
// import { RPCLink } from '@orpc/client/fetch'
// import { RouterClient } from '@orpc/server'
// import { DedupeRequestsPlugin } from "@orpc/client/plugins";
// import { TAnimeRouter } from './router';

// function isAbortError(error: unknown): boolean {
//   if (!error || typeof error !== "object") return false;
//   const name = "name" in error ? String(error.name) : "";
//   const message = "message" in error ? String(error.message) : "";
//   return (
//     name === "AbortError" ||
//     message.toLowerCase().includes("signal is aborted")
//   );
// }

// function getBaseUrl() {
//   if (typeof window !== "undefined") {
//     return window.location.origin;
//   }
//   return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
// }


// const link = new RPCLink({
//     url: `${getBaseUrl()}/rpc`,
//     headers: async () => {
//         if (typeof window !== 'undefined') {
//             return {}
//         }
//         const { headers } = await import('next/headers')
//         return await headers()
//     },
//     plugins: [
//         new DedupeRequestsPlugin({
//             filter: ({ request }) => request.method === "GET",
//             groups: [
//                 {
//                     condition: () => true,
//                     context: {},
//                 },
//             ],
//         }),
//     ],
//     interceptors: [
//         onError((error) => {
//             if (isAbortError(error)) return;
//             console.error(error)
//         })
//     ],
// })

// // Create a client for your router
// export const orpcClient: RouterClient<TAnimeRouter> = createORPCClient(link)


