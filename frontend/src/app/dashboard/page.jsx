"use client";

import { FileText, MessageSquare, Files, Target } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import PaperTable from "@/components/dashboard/PaperTable";
import SuggestionCard from "@/components/dashboard/SuggestionCard";
import BloomChart from "@/components/dashboard/BloomChart";
import DifficultyChart from "@/components/dashboard/DifficultyChart";
import DocumentList from "@/components/dashboard/DocumentList";
import QuickActions from "@/components/dashboard/QuickActions";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import { useDashboardStore } from "@/lib/store";

export default function DashboardPage() {
  const { papers, documents } = useDashboardStore();

  // Normalize papers for the PaperTable format
  const normalizedPapers = papers.map(p => ({
    id: p.id,
    title: p.title,
    subject: p.subject,
    marks: p.marks.replace(" Marks", "").replace(" M", ""),
    date: p.date,
    status: p.status
  }));

  // Calculate dynamic stats
  const papersCount = papers.length;
  const docsCount = documents.length;

  return (
    <DashboardLayout>
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        
        {/* Welcome Section */}
        <PageHeader />

        {/* Row 1: Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Question Papers"
            value={papersCount.toString()}
            icon={FileText}
            trend="+12% this month"
            trendDirection="up"
            sparkPoints={[4, 8, 6, 12, 10, 15, papersCount]}
          />
          <StatsCard
            title="Questions Generated"
            value="1,247"
            icon={MessageSquare}
            trend="+8% this week"
            trendDirection="up"
            sparkPoints={[10, 15, 14, 20, 18, 25, 30]}
          />
          <StatsCard
            title="Documents Uploaded"
            value={docsCount.toString()}
            icon={Files}
            trend="+3 new uploads"
            trendDirection="up"
            sparkPoints={[8, 12, 10, 14, 18, 22, docsCount]}
          />
          <StatsCard
            title="Bloom Accuracy"
            value="92%"
            icon={Target}
            trend="-1.2% vs last batch"
            trendDirection="down"
            sparkPoints={[88, 90, 91, 94, 93, 92, 92]}
          />
        </div>

        {/* Row 2: Recent Papers Table + AI Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <PaperTable papers={normalizedPapers} />
          </div>
          <div className="lg:col-span-4">
            <SuggestionCard />
          </div>
        </div>

        {/* Row 3: Bloom Distribution + Difficulty Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BloomChart />
          <DifficultyChart />
        </div>

        {/* Row 4: Documents + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <DocumentList />
          </div>
          <div className="lg:col-span-5">
            <QuickActions />
          </div>
        </div>

        {/* Row 5: Activity Timeline */}
        <ActivityTimeline />

      </div>
    </DashboardLayout>
  );
}
