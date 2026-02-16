"use client";
import React, { useEffect, useState } from "react";
import ProjectHeader from "./_shared/ProjectHeader";
import { THEME_NAME_LIST, THEMES, ThemeKey } from "@/data/Themes";
// import { ProjectType } from "@/types";
import { SettingSection } from "./_shared/SettingSection";
import { useParams } from "next/navigation";
import axios from "axios";
import { set } from "date-fns";
import { Loader2Icon } from "lucide-react";
import Canvas from "./_shared/Canvas";

export const ProjectCanvasPlayground = () => {
  const { ProjectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<any>();
  const [screenConfig, setScreenConfig] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Loading...");
  const [progress, setProgress] = useState(0); // ✅ added

  const PAUSE_PROJECT_FLOW = false;

  // useEffect(() => {
  //   ProjectId && GetProjectDetail();
  // }, [ProjectId]);

  useEffect(() => {
    if (!PAUSE_PROJECT_FLOW && ProjectId) {
      GetProjectDetail();
    }
  }, [ProjectId]);

  // const generateScreenConfig = async () => {
  //   try {
  //     setLoading(true);
  //     setLoadingMsg("Generating screens...");

  //     const result = await axios.post("/api/generate-congif", {
  //       projectId: ProjectId,
  //       deviceType: projectDetail?.device,
  //       userInput: projectDetail?.userInput,
  //     });

  //     const screens = result.data?.screens || [];

  //     setLoadingMsg("Generating screen UI...");

  //     for (const screen of screens) {
  //       await axios.post("/api/generate-screen-ui", {
  //         projectId: ProjectId,
  //         screenId: screen.id,
  //         ScreenName: screen.name,
  //         purpose: screen.purpose,
  //         screenDescription: screen.screenDescription,
  //       });
  //     }

  //     console.log("All screens + UI generated");

  //     setScreenConfig(screens);
  //   } catch (e) {
  //     console.error(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };  this is working

  // useEffect(() => {
  //   if (projectDetail && screenConfig && screenConfig?.length == 0) {
  //     // generateScreenConfig();
  //   }
  // }, [projectDetail && screenConfig]);

  // app/project/[ProjectId]/page.tsx

  // app/project/[ProjectId]/page.tsx

  const generateScreenConfig = async () => {
    try {
      setLoading(true); // Start the global loader
      setLoadingMsg("Designing your application architecture...");
      setProgress(0); // ✅ added reset

      const result = await axios.post("/api/generate-congif", {
        projectId: ProjectId,
        deviceType: projectDetail?.device,
        userInput: projectDetail?.userInput,
      });

      const screens = result.data?.screens || [];
      setScreenConfig(screens); // Show initial frames

      // Loop through each screen to generate UI
      for (let i = 0; i < screens.length; i++) {
        const screen = screens[i];
        // Update loading message to show progress (e.g., "Generating Screen 1 of 5...")
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

        // Update state so the screen renders immediately once ready
        setScreenConfig((prev) =>
          prev.map((s) =>
            s.id === screen.id ? { ...s, code: response.data } : s
          )
        );

        // ✅ added percentage progress
        const currentProgress = Math.round(((i + 1) / screens.length) * 100);
        setProgress(currentProgress);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false); // Hide the loader when everything is done
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
    setLoading(true);
    setLoadingMsg("Fetching project details...");
    const result = await axios.get(`/api/project?projectId=${ProjectId}`);
    console.log(result.data);
    setProjectDetail(result?.data?.projectDetail);
    // setScreenConfig(result?.data?.screenConfig);
    // if(result.data?.screenConfig?.length === 0){
    //   generateScreenConfig();
    // }
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Pass progress to Header */}
      <ProjectHeader progress={progress} loading={loading} />

      {/* Main workspace */}
      <div className="flex flex-1 min-h-0">
        {/* Left settings */}
        <div className="w-[300px] border-r overflow-y-auto">
          <SettingSection projectDetail={projectDetail} />
        </div>

        {/* Right canvas */}
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
