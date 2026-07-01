"use client";

import { useState } from "react";
import { Settings, ToggleLeft, ToggleRight, Shield, Key, Sliders, Server, Save } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState({
    canvas: true,
    moodle: false,
    blackboard: false
  });

  const toggleIntegration = (key) => {
    setIntegrations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-[850px] mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Console Settings
          </h1>
          <p className="text-zinc-550 text-xs md:text-sm font-light mt-1">
            Configure system configurations, paper templates, and LMS integration preferences.
          </p>
        </div>

        {/* Form sections */}
        <div className="flex flex-col gap-6">
          
          {/* Section 1: Paper Defaults */}
          <Card hoverBorder={false} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 mb-1 select-none">
              <Sliders className="w-4 h-4 text-blue-500" />
              <span className="text-white font-bold text-sm">Paper Configuration Defaults</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Default Institution Name</label>
                <input
                  type="text"
                  defaultValue="State University of Engineering"
                  className="bg-black border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-zinc-700"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Default Passing Marks (%)</label>
                <input
                  type="number"
                  defaultValue="40"
                  className="bg-black border border-zinc-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>
          </Card>

          {/* Section 2: Integrations */}
          <Card hoverBorder={false} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 mb-1 select-none">
              <Server className="w-4 h-4 text-blue-500" />
              <span className="text-white font-bold text-sm">LMS Platform Syncing</span>
            </div>

            <p className="text-zinc-550 text-[11px] leading-relaxed font-light">
              Toggle third-party integrations. Enabling sync permits papers and solutions keys to publish directly to your courses pages.
            </p>

            <div className="flex flex-col divide-y divide-zinc-900 mt-2 select-none">
              {[
                { key: "canvas", label: "Canvas LMS Integration", desc: "Syncs quiz sections automatically." },
                { key: "moodle", label: "Moodle Platform Connect", desc: "Export XML questions logs directly." },
                { key: "blackboard", label: "Blackboard Courseware", desc: "Integrate exam PDFs into modules." }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3.5">
                  <div className="flex flex-col">
                    <span className="text-zinc-200 text-xs font-semibold">{item.label}</span>
                    <span className="text-zinc-500 text-[9px] font-light">{item.desc}</span>
                  </div>
                  <button
                    onClick={() => toggleIntegration(item.key)}
                    className="text-zinc-450 hover:text-white transition-colors"
                  >
                    {integrations[item.key] ? (
                      <ToggleRight className="w-8 h-8 text-blue-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-zinc-700" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Save changes */}
          <div className="flex justify-end select-none">
            <Button variant="accent" className="py-2.5 px-6 gap-2 font-bold text-xs uppercase tracking-wider">
              <Save className="w-4 h-4" /> Save Settings
            </Button>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
