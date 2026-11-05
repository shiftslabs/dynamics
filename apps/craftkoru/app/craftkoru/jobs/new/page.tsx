"use client";
import React, { useState } from "react";
import { Card, Button, Input } from "@shiftslabs/ui";
import { Scissors, ArrowLeft } from "lucide-react";

export default function NewJobPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, priceChargedCents: Number(price) || 0, dueDate, notes }) });
      if (!res.ok) throw new Error("Failed");
      window.location.href = "/craftkoru/jobs";
    } catch {
      setError("Could not create job.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <a href="/craftkoru/jobs" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"><ArrowLeft size={14} /> Back to jobs</a>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Bespoke Job</h1>
      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <div><label className="text-sm font-medium text-slate-700">Job title</label><Input value={title} onChange={(e: any) => setTitle(e.target.value)} required /></div>
          <div><label className="text-sm font-medium text-slate-700">Service price (minor units)</label><Input type="number" value={price} onChange={(e: any) => setPrice(e.target.value)} /></div>
          <div><label className="text-sm font-medium text-slate-700">Due date</label><Input type="date" value={dueDate} onChange={(e: any) => setDueDate(e.target.value)} /></div>
          <div><label className="text-sm font-medium text-slate-700">Notes</label><textarea className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} /></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Job"}</Button>
        </form>
      </Card>
    </div>
  );
}
" filePath="C:\Users\USER\OneDrive\Documents\dynamics\apps\craftkoru\app\craftkoru\jobs\new\page.tsx"