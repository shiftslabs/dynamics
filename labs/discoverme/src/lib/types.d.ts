import "hono";
declare module "hono" {
  interface ContextVariableMap {
    user: { id: string; email: string; name?: string | null; isPlatformAdmin: boolean; platformRole: string } | null;
  }
}