import React from "react";
import { Card } from "@shiftslabs/ui";
import { Scissors } from "lucide-react";

export default function CraftkoruLanding() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        <Scissors size={40} className="mx-auto text-blue-600" />
        <h1 className="text-2xl font-bold text-slate-900">Craftkoru</h1>
        <p className="text-sm text-slate-500">Personal services business software for tailors, barbers, stylists and beauty artists.</p>
        <a href="/login" className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full">Sign in</a>
        <a href="/register" className="inline-block px-6 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-full">Create account</a>
      </Card>
    </div>
  );
}
