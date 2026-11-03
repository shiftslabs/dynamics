"use client";

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>404 - Page Not Found</h1>
      <a href="/craftkoru/dashboard">Go to dashboard</a>
    </div>
  );
}
