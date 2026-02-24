import { createORPCClient, onError } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { RouterClient } from '@orpc/server'
import { DedupeRequestsPlugin } from "@orpc/client/plugins";
import { TAnimeRouter } from './procedures/anime';

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}


const link = new RPCLink({
    url: `${getBaseUrl()}/rpc`,
    headers: async () => {
        if (typeof window !== 'undefined') {
            return {}
        }
        const { headers } = await import('next/headers')
        return await headers()
    },
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
        console.error(error)
        })
    ],
})

// Create a client for your router
export const orpcClient: RouterClient<TAnimeRouter> = createORPCClient(link)


