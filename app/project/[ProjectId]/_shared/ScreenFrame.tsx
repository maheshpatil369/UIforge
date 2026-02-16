import { themeToCssVars, THEMES, ThemeKey } from "@/data/Themes";
import { ProjectType } from "@/type/types";
import { GripVertical } from "lucide-react";
import React from "react";
import { Rnd } from "react-rnd";
// import { THEMES, themeToCssVars } from "@/data/Themes";


type Props = {
  x: number;
  y: number;
  setPanningEnabled: (enabled: boolean) => void,
  width:number,
  height:number,
  htmlCode:string | undefined,
  projectDetail:ProjectType | undefined
};

function ScreenFrame({ x, y, width, height, setPanningEnabled, htmlCode, projectDetail }: Props) {

const themeCss = projectDetail?.theme
  ? themeToCssVars(THEMES[projectDetail.theme])
  : "";

const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- Google Font -->
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">


<!-- Tailwind + Iconify -->
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>
<style>
  ${themeCss}
</style>
</head>
<body class="bg-[var(--background)] text-[var(--foreground)] w-full">
  ${htmlCode?.trim()
  ? htmlCode
  : `<div class="h-full flex items-center justify-center text-sm opacity-60">
       No UI generated yet
     </div>`}
</body>
</html>
`;



  return (
    <Rnd
      default={{
        x,
        y,
        width: width,
        height: height,
      }}
      dragHandleClassName="drag-handle"
      enableResizing={{
        bottomRight: true,
        bottomLeft: true,
      }}
      onDragStart={() => setPanningEnabled(false)}
      onDragStop={() => setPanningEnabled(true)}
      onResizeStart={() => setPanningEnabled(false)}
      onResizeStop={() => setPanningEnabled(true)}
    >
      <div className="drag-handle flex gap-2 items-center cursor-move bg-gray-100 p-2">
        <GripVertical className="text-gray-500 h-4 w-4"  />
        <h2>Drag here </h2>
        </div>
    <iframe 
    className='w-full h-[calc(100%-40px)] bg-white'
    sandbox='allow-same-origin allow-scripts'
    srcDoc={html}
    />
    </Rnd>
  );
}

export default ScreenFrame;
