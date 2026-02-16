import type { ThemeKey } from "@/data/Themes";
export type ProjectType = {
  id: number;
  projectId: string;
  device: string;
  userInput: string;
  createdon: string;
  createdtime:string;
  projectName: string;
  theme: ThemeKey | null;
  createdat: string;
};


export type ScreenConfigType = {
    id: number;
    screenId: string;
    screenName: string;
    purpose: string;
    screenDescription: string;
    code: string;
};