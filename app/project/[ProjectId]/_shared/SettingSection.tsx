"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { THEME_NAME_LIST, THEMES, ThemeKey } from "@/data/Themes";
import { Camera, Share, Sparkle } from "lucide-react";
import { ProjectType } from '@/type/types'

interface Props {
  projectDetail: ProjectType | undefined;
}

export const SettingSection: React.FC<Props> = ({ projectDetail }) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey | null>(null);
  const [projectName, setProjetName] = useState(projectDetail?.projectName);
  const [userNewScreenInput, setUserNewScreenInput] = useState<string>("");

useEffect(() => {
  projectDetail&&setProjetName(projectDetail?.projectName);
}, [projectDetail])

  return (
    <div className="w-[300px] h-[90vh] p-5 border-r">
      <h2 className="font-medium text-lg">Settings</h2>

      <div className="mt-3">
        <h2 className="text-sm mb-1">Project Name</h2>
        <Input
          placeholder="Project Name"
          value={projectName}
          onChange={(event) => setProjetName(event.target.value)}
        />
      </div>

      <div className="mt-3">
        <h2 className="text-sm mb-1">Generate New Screen</h2>
        <Textarea
          placeholder="Enter prompt to generate screen using AI"
          value={userNewScreenInput}
          onChange={(event) => setUserNewScreenInput(event.target.value)}
        />
        <Button
          size="sm"
          className="cursor-pointer bg-red-600 hover:bg-red-500 mt-2 w-full"
        >
          <Sparkle />
          Generate with AI
        </Button>
      </div>

      <div className="mt-5">
        <h2 className="text-sm mb-1">Themes</h2>
        <div className="h-50 overflow-auto">
          {THEME_NAME_LIST.map((theme: ThemeKey, index: number) => (
            <div
              key={index}
              className={`p-3 border rounded-2xl mb-3 cursor-pointer transition-all ${
                theme === selectedTheme ? "border-primary bg-primary/20" : ""
              }`}
              onClick={() => setSelectedTheme(theme)}
            >
              <h2 className="text-sm font-semibold tracking-wide uppercase">
                {theme.replaceAll("_", " ")}
              </h2>

              <div className="flex gap-2 p-2">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ background: THEMES[theme].primary }}
                />
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ background: THEMES[theme].secondary }}
                />
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ background: THEMES[theme].accent }}
                />
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ background: THEMES[theme].background }}
                />
                <div
                  className="h-4 w-4 rounded-full"
                  style={{
                    background: `linear-gradient(
                      135deg,
                      ${THEMES[theme].background},
                      ${THEMES[theme].primary},
                      ${THEMES[theme].accent}
                    )`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-sm mb-1">Extras</h2>
        <div className="flex gap-3">
          <Button size="sm" variant="outline">
            <Camera />
            Screenshot
          </Button>
          <Button size="sm" variant="outline">
            <Share />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};
