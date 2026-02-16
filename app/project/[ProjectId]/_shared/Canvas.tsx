import React, { useState, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import ScreenFrame from "./ScreenFrame";
import { ProjectType, ScreenConfigType } from "@/type/types";
import { ZoomIn, ZoomOut, Maximize, MousePointer2 } from "lucide-react";

type Props = {
  projectDetail: ProjectType | undefined;
  screenConfig: ScreenConfigType[];
  loading?: boolean;
};

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-xl shadow-2xl border border-gray-200">
      <button
        onClick={() => zoomIn()}
        className="p-2.5 hover:bg-white hover:text-blue-600 rounded-lg text-gray-500 transition-all shadow-sm border border-transparent hover:border-gray-100"
      >
        <ZoomIn size={20} />
      </button>
      <button
        onClick={() => zoomOut()}
        className="p-2.5 hover:bg-white hover:text-blue-600 rounded-lg text-gray-500 transition-all shadow-sm border border-transparent hover:border-gray-100"
      >
        <ZoomOut size={20} />
      </button>
      <div className="h-px bg-gray-200 mx-2" />
      <button
        onClick={() => resetTransform()}
        className="p-2.5 hover:bg-white hover:text-blue-600 rounded-lg text-gray-500 transition-all shadow-sm border border-transparent hover:border-gray-100"
      >
        <Maximize size={20} />
      </button>
    </div>
  );
};

function Canvas({ projectDetail, screenConfig, loading }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [panningEnabled, setPanningEnabled] = useState(true);
  const isMobile = projectDetail?.device == "mobile";

  const SCREEN_WIDTH = isMobile ? 400 : 1200;
  const SCREEN_HIGHT = isMobile ? 800 : 800;
  const GAP = isMobile ? 10 : 70;

  // Prevent browser-level zooming on the canvas container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gray-100 overflow-hidden select-none"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <TransformWrapper
        initialScale={0.7}
        minScale={0.1}
        maxScale={4}
        centerOnInit={true}
        limitToBounds={false}
        wheel={{
          step: 0.1,
          activationKeys: [],
        }}
        pinch={{ disabled: false }}
        panning={{ disabled: !panningEnabled }}
        doubleClick={{ disabled: true }}
      >
        <Controls />

        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            cursor: panningEnabled ? "grab" : "default",
          }}
        >
          <div className="flex items-start p-[500px]">
            {screenConfig.map((screen, index) => (
              <ScreenFrame
                x={index * (SCREEN_WIDTH + GAP)}
                y={0}
                width={SCREEN_WIDTH}
                height={SCREEN_HIGHT}
                key={index}
                setPanningEnabled={setPanningEnabled}
                htmlCode={screen?.code}
                projectDetail={projectDetail}
                panningEnabled={panningEnabled} 
              />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default Canvas;
