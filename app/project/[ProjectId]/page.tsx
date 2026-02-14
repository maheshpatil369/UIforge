"use client";
import React, { useEffect, useState } from "react";
import ProjectHeader from "./_shared/ProjectHeader";
import { SettingSection } from "./_shared/SettingSection";
import { useParams } from "next/navigation";
import axios from "axios";
import { set } from "date-fns";
import { Loader2Icon } from "lucide-react";
export const ProjectCanvasPlayground = () => {
  const { ProjectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<any>();
  const [screenConfig, setScreenConfig] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Loading...");

  useEffect(() => {
    ProjectId && GetProjectDetail();
  }, [ProjectId]);
  

  const generateScreenConfig = async () => {
    setLoading(true);
    setLoadingMsg("Generating screen configuration...");
    const result = await axios.post("/api/generate-congif", {
      projectId: ProjectId,
      deviceType: projectDetail?.device,
      userInput: projectDetail?.userInput,
    });

    console.log(result.data);
    setScreenConfig(result.data);
    setLoading(false);
  };

  useEffect(() => {
    if (projectDetail && screenConfig && screenConfig?.length == 0) {
      generateScreenConfig();
    }
  }, [projectDetail && screenConfig]);

  const GetProjectDetail = async () => {
    setLoading(true);
    setLoadingMsg("Fetching project details...");
    const result = await axios.get("/api/project?projectId=" + ProjectId);
    console.log(result.data);
    setProjectDetail(result?.data?.projectDetail);
    // setScreenConfig(result?.data?.screenConfig);
    // if(result.data?.screenConfig?.length === 0){
    //   generateScreenConfig();
    // }
    setLoading(false);
  };

  return (
    <div>
      <ProjectHeader />

      <div>
        {loading && (
          <div className="p-3 absolute bg-blue-300/20 border-blue-400 rounded-xl left-1/2 top-20">
            <h2 className="flex gap-2 item-center">
              {" "}
              <Loader2Icon className="animate-spin" /> {loadingMsg}
            </h2>
          </div>
        )}
        <SettingSection />

        {/* {Canvas} */}
      </div>
    </div>
  );
};

export default ProjectCanvasPlayground;
