"use client";
import React, { useEffect, useState, use } from "react"; // Added 'use' hook
import ProjectHeader from "./_shared/ProjectHeader";
import { SettingSection } from "./_shared/SettingSection";
import { useParams } from "next/navigation";
import axios from "axios";
import Canvas from "./_shared/Canvas";

// In Next.js 16, page props are Promises
interface PageProps {
  params: Promise<{ ProjectId: string }>;
}

const ProjectCanvasPlayground = ({ params }: PageProps) => {
  // Use the 'use' hook to unwrap the params promise
  const resolvedParams = use(params);
  const ProjectId = resolvedParams.ProjectId;

  const [projectDetail, setProjectDetail] = useState<any>();
  const [screenConfig, setScreenConfig] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Loading...");
  const [progress, setProgress] = useState(0);

  const PAUSE_PROJECT_FLOW = false;

  useEffect(() => {
    if (!PAUSE_PROJECT_FLOW && ProjectId) {
      GetProjectDetail();
    }
  }, [ProjectId]);

  const generateScreenConfig = async () => {
    try {
      setLoading(true);
      setLoadingMsg("Designing your application architecture...");
      setProgress(0);

      const result = await axios.post("/api/generate-congif", {
        projectId: ProjectId,
        deviceType: projectDetail?.device,
        userInput: projectDetail?.userInput,
      });

      const screens = result.data?.screens || [];
      setScreenConfig(screens);

      for (let i = 0; i < screens.length; i++) {
        const screen = screens[i];
        setLoadingMsg(
          `Generating UI for ${screen.name} (${i + 1}/${screens.length})...`
        );

        const response = await axios.post("/api/generate-screen-ui", {
          projectId: ProjectId,
          screenId: screen.id,
          ScreenName: screen.name,
          purpose: screen.purpose,
          screenDescription: screen.screenDescription,
        });

        setScreenConfig((prev) =>
          prev.map((s) =>
            s.id === screen.id ? { ...s, code: response.data } : s
          )
        );

        const currentProgress = Math.round(((i + 1) / screens.length) * 100);
        setProgress(currentProgress);
      }
    } catch (e) {
      console.error("Generation Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      !PAUSE_PROJECT_FLOW &&
      projectDetail &&
      screenConfig &&
      screenConfig.length === 0
    ) {
      generateScreenConfig();
    }
  }, [projectDetail, screenConfig]);

  const GetProjectDetail = async () => {
    try {
      setLoading(true);
      setLoadingMsg("Fetching project details...");
      const result = await axios.get(`/api/project?projectId=${ProjectId}`);
      setProjectDetail(result?.data?.projectDetail);
    } catch (e) {
      console.error("Fetch Error:", e);
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