"use client";

import { PlusCircle, UploadCloud } from "lucide-react";
import Button from "@/components/common/Button";

export default function PageHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      
      {/* Greetings Title */}
      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Good Afternoon, Anay 👋
        </h1>
        <p className="text-zinc-550 text-xs md:text-sm font-light mt-1">
          Create curriculum-aligned question papers using Artificial Intelligence.
        </p>
      </div>

      {/* Control Triggers */}
      <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
        <Button variant="secondary" className="flex-1 sm:flex-initial py-2 px-3.5 gap-1.5 font-semibold">
          <UploadCloud className="w-3.5 h-3.5" /> Upload Document
        </Button>
        <Button variant="accent" className="flex-1 sm:flex-initial py-2 px-3.5 gap-1.5 font-bold">
          <PlusCircle className="w-3.5 h-3.5" /> Generate New Paper
        </Button>
      </div>

    </div>
  );
}
