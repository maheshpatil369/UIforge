"use client";
import React, { useEffect, useState, use } from "react";
import ProjectHeader from "./_shared/ProjectHeader";
import { SettingSection } from "./_shared/SettingSection";
import axios from "axios";
import Canvas from "./_shared/Canvas";

interface PageProps {
  params: Promise<{ ProjectId: string }>;
}

const ProjectCanvasPlayground = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const ProjectId = resolvedParams.ProjectId;

  const [projectDetail, setProjectDetail] = useState<any>();
  const [screenConfig, setScreenConfig] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Loading...");
  const [progress, setProgress] = useState(0);

  const PAUSE_PROJECT_FLOW = false;

  /* ================= FETCH PROJECT ================= */
  useEffect(() => {
    if (!PAUSE_PROJECT_FLOW && ProjectId) {
      GetProjectDetail();
    }
  }, [ProjectId]);

  /* ================= GENERATE UI ================= */
  const generateScreenConfig = async () => {
    console.log("🚀 Starting screen generation flow");

    try {
      setLoading(true);
      setProgress(0);

      console.log("📡 Calling /api/generate-config");

      const result = await axios.post("/api/generate-congif", {
        projectId: ProjectId,
        deviceType: projectDetail?.device,
        userInput: projectDetail?.userInput,
      });

      const screens = result.data?.screens || [];
      console.log("🧩 Screens received:", screens);

      setScreenConfig(screens);

      for (let i = 0; i < screens.length; i++) {
        const screen = screens[i];

        console.log(`🎨 Generating UI for: ${screen.name}`);

        const response = await axios.post("/api/generate-screen-ui", {
          projectId: ProjectId,
          screenId: screen.id,
          ScreenName: screen.name,
          purpose: screen.purpose,
          screenDescription: screen.screenDescription,
        });

        console.log("🧾 Raw screen-ui response:", response.data);

        setScreenConfig((prev) =>
          prev.map((s) =>
            s.id === screen.id
              ? {
                  ...s,
                  code: response.data?.code ?? "", // ✅ FIX
                }
              : s
          )
        );

        setProgress(Math.round(((i + 1) / screens.length) * 100));
      }

      console.log("✅ All screens generated");
    } catch (e) {
      console.error("❌ Generation Error:", e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAFE AUTO TRIGGER ================= */
  useEffect(() => {
    if (
      !PAUSE_PROJECT_FLOW &&
      projectDetail &&
      screenConfig.length === 0
    ) {
      console.log("⚙️ Triggering generation automatically");
      generateScreenConfig();
    }
  }, [projectDetail]); // ✅ FIX: removed screenConfig dependency

  /* ================= FETCH PROJECT ================= */
  const GetProjectDetail = async () => {
    try {
      console.log("📡 Fetching project detail");
      setLoading(true);

      const result = await axios.get(
        `/api/project?projectId=${ProjectId}`
      );

      console.log("📦 Project detail:", result.data);
      setProjectDetail(result?.data?.projectDetail);
    } catch (e) {
      console.error("❌ Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ProjectHeader progress={progress} loading={loading} />

      <div className="flex flex-1 min-h-0">
        <div className="w-[300px] border-r overflow-y-auto">
          <SettingSection projectDetail={projectDetail} />
        </div>

        <div className="flex-1 overflow-hidden bg-gray-100">
          <Canvas
            projectDetail={projectDetail}
            screenConfig={screenConfig}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectCanvasPlayground;
