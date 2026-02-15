import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ScreenFrame from "./ScreenFrame";
import { ProjectType, ScreenConfigType } from "@/type/types";

type Props = {
  projectDetail: ProjectType | undefined;
  screenConfig: ScreenConfigType[];
  loading?: boolean;
};

function Canvas({ projectDetail, screenConfig, loading }: Props) {
  const [panningEnabled, setPanningEnabled] = useState(true);
  const isMobile = projectDetail?.device == "mobile";

  const SCREEN_WIDTH = isMobile ? 400 : 1200;
  const SCREEN_HIGHT = isMobile ? 800 : 800;
  const GAP = isMobile ? 10 : 70;


  return (
    <div
      className="w-full h-full bg-gray-100 overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <TransformWrapper
        initialScale={0.7}
        minScale={0.7}
        maxScale={3}
        initialPositionX={50}
        initialPositionY={50}
        limitToBounds={false}
        doubleClick={{ disabled: false }}
        wheel={{ step: 0.8 }}
        panning={{ disabled: !panningEnabled }}
      >
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            {screenConfig.map((screen, index) => (
              <ScreenFrame
                x={index * (SCREEN_WIDTH + GAP)}
                y={0}
                width={SCREEN_WIDTH}
                height={SCREEN_HIGHT}
                key={index}
                setPanningEnabled={setPanningEnabled}
              />
            ))}
            <ScreenFrame
              x={300}
              y={0}
              width={SCREEN_WIDTH}
              height={SCREEN_HIGHT}
              setPanningEnabled={setPanningEnabled}
            />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default Canvas;
