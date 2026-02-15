// uiforage\app\project\[ProjectId]\page.tsx

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
  //   setLoading(true);
  //   setLoadingMsg("Generating screen configuration...");
  //   const result = await axios.post("/api/generate-congif", {
  //     projectId: ProjectId,
  //     deviceType: projectDetail?.device,
  //     userInput: projectDetail?.userInput,
  //   });

  //   console.log(result.data);
  //   setScreenConfig(result.data);
  //   setLoading(false);
  // };

  const generateScreenConfig = async () => {
    try {
      setLoading(true);
      setLoadingMsg("Generating screens...");

      const result = await axios.post("/api/generate-congif", {
        projectId: ProjectId,
        deviceType: projectDetail?.device,
        userInput: projectDetail?.userInput,
      });

      const screens = result.data?.screens || [];

      setLoadingMsg("Generating screen UI...");

      for (const screen of screens) {
        await axios.post("/api/generate-screen-ui", {
          projectId: ProjectId,
          screenId: screen.id,
          ScreenName: screen.name,
          purpose: screen.purpose,
          screenDescription: screen.screenDescription,
        });
      }

      console.log("All screens + UI generated");

      setScreenConfig(screens);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (projectDetail && screenConfig && screenConfig?.length == 0) {
  //     // generateScreenConfig();
  //   }
  // }, [projectDetail && screenConfig]);

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
      <ProjectHeader />

      {/* Main workspace */}
      <div className="flex flex-1 min-h-0">
        {/* Left settings */}
        <div className="w-[300px] border-r overflow-y-auto">
          <SettingSection projectDetail={projectDetail} />
        </div>

        {/* Right canvas */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <Canvas projectDetail={projectDetail} 
          screenConfig={screenConfig} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCanvasPlayground;
