"use client";

import { useState } from "react";
import { User, Mail, Shield, Award, Key, Copy, PlusCircle, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";

export default function ProfilePage() {
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopy = () => {
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[850px] mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Instructor Profile
          </h1>
          <p className="text-zinc-550 text-xs md:text-sm font-light mt-1">
            Manage your personal settings, academic roles, and developer credentials.
          </p>
        </div>

        {/* Profile Card details */}
        <Card hoverBorder={false} className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
            AN
          </div>
          
          <div className="flex-1 flex flex-col gap-2 font-sans select-none">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white leading-none">Anay Patel</h2>
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900 font-mono text-[9px] font-bold uppercase tracking-wider">
                Instructor Role
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-zinc-400 font-light mt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>anay@university.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-zinc-500" />
                <span>State University of Engineering</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-zinc-500" />
                <span>Department of Computer Science</span>
              </div>
            </div>
          </div>
        </Card>

        {/* API keys section */}
        <Card hoverBorder={false} className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-white font-bold text-sm select-none">
                LMS Integrations API Credentials
              </span>
            </div>
            <button className="flex items-center gap-1 text-blue-500 hover:underline font-semibold text-[10px] select-none">
              <PlusCircle className="w-3 h-3" /> Generate New Key
            </button>
          </div>

          <p className="text-zinc-550 text-[11px] leading-relaxed font-light">
            Use these developer credentials to synchronize generated assessments directly with Moodle, Canvas, or Blackboard platforms. Keep keys secure.
          </p>

          {/* Key list */}
          <div className="flex flex-col gap-2.5 mt-2 font-mono">
            <div className="p-3 bg-black border border-zinc-900 rounded-lg flex items-center justify-between gap-6 text-[10px]">
              <div className="flex flex-col gap-1 overflow-hidden min-w-0">
                <span className="text-zinc-500 text-[8px] uppercase tracking-wider font-semibold select-none">Midterm API Token</span>
                <span className="text-zinc-300 font-semibold truncate">qgen_live_839a28841dfb3420cc5820ee1a2c</span>
              </div>
              
              <div className="flex items-center gap-3 shrink-0 select-none">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors text-[9px]"
                >
                  <Copy className="w-3 h-3" /> {copiedKey ? "Copied" : "Copy"}
                </button>
                <button title="Revoke Key" className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
}
