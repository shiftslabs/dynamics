"use client";
import React, { useState } from "react";
import { Card, Button, Input } from "@shiftslabs/ui";
import { ArrowLeft } from "lucide-react";

export default function NewCustomerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, address }) });
      if (!res.ok) throw new Error("Failed");
      window.location.href = "/craftkoru/customers";
    } catch {
      setError("Could not save client.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <a href="/craftkoru/customers" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"><ArrowLeft size={14} /> Back</a>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Client</h1>
      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <div><label className="text-sm font-medium text-slate-700">Name</label><Input value={name} onChange={(e: any) => setName(e.target.value)} required /></div>
          <div><label className="text-sm font-medium text-slate-700">Email</label><Input value={email} onChange={(e: any) => setEmail(e.target.value)} /></div>
          <div><label className="text-sm font-medium text-slate-700">Phone</label><Input value={phone} onChange={(e: any) => setPhone(e.target.value)} /></div>
          <div><label className="text-sm font-medium text-slate-700">Address</label><Input value={address} onChange={(e: any) => setAddress(e.target.value)} /></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Client"}</Button>
        </form>
      </Card>
    </div>
  );
}
" filePath="C:\Users\USER\OneDrive\Documents\dynamics\apps\craftkoru\app\craftkoru\customers\new\page.tsx"