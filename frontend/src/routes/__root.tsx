import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import TanStackQueryProvider from "../integrations/tanstack-query/provider.tsx";

export const Route = createRootRouteWithContext()({
  shellComponent: RootComponent,
});

function RootComponent() {
  return (
    <>
      <TanStackQueryProvider>
        <HeadContent />

        <Outlet />
        <TanStackRouterDevtools />
      </TanStackQueryProvider>

      <Scripts />
    </>
  );
}
