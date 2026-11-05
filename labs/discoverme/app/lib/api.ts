export type ApiResult<T> = { data?: T; meta?: any; error?: { code: string; message: string } };
async function req<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const res = await fetch(path, { headers: { "Content-Type": "application/json", ...(init?.headers || {}) }, credentials: "include", ...init });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { error: json.error || { code: "REQUEST_FAILED", message: "Request failed." } };
  return json as ApiResult<T>;
}
export const api = {
  get: <T>(p: string) => req<T>(p),
  post: <T>(p: string, body?: any) => req<T>(p, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T>(p: string, body?: any) => req<T>(p, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  put: <T>(p: string, body?: any) => req<T>(p, { method: "PUT", body: JSON.stringify(body ?? {}) }),
  del: <T>(p: string) => req<T>(p, { method: "DELETE" }),
};