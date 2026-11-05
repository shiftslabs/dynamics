import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";
export type User = { id: string; email: string; name?: string | null; isEmailVerified?: boolean; isPlatformAdmin?: boolean; platformRole?: string } | null;
type AuthCtx = { user: User; loading: boolean; refresh: () => Promise<void>; signOut: () => Promise<void> };
const Ctx = createContext<AuthCtx>({ user: null, loading: true, refresh: async () => {}, signOut: async () => {} });
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const refresh = async () => { const r = await api.get<any>("/api/v1/auth/session"); setUser(r.data?.authenticated ? r.data.user : null); setLoading(false); };
  useEffect(() => { refresh(); }, []);
  const signOut = async () => { await api.post("/api/v1/auth/logout"); setUser(null); };
  return <Ctx.Provider value={{ user, loading, refresh, signOut }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);