"use client";
import React, { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, Send } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { suggestions } from "@/data/constant";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { randomUUID } from "crypto";

function Hero() {
  const [userInput, setUserInput] = useState<string>("");
const [device, setDevice] = useState<string>("mobile");
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onCreateProject = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    setLoading(true);

    const projectId = window.crypto.randomUUID();
    const result = await fetch("/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput: userInput,
        device: device,
        projectId: projectId,
      }),
    });

    const data = await result.json();
    console.log(data);
    setLoading(false);

    router.push(`/project/` + projectId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // stop new line
    if (!loading && userInput.trim()) {
      onCreateProject();
    }
  }
};


  return (
    <div className="
  mx-auto
  w-full
  max-w-[360px]
  sm:max-w-[640px]
  md:max-w-[768px]
  lg:max-w-[1024px]
  xl:max-w-[1280px]
">

<div className="
  h-screen
  overflow-hidden
  flex
  flex-col
  justify-center
  px-4
  sm:px-6
  md:px-24
">

   <div className="group relative mx-auto max-w-sm flex items-center justify-center rounded-full px-5 py-2 mb-6
  bg-white/10 backdrop-blur-md
  shadow-[0_0_25px_rgba(156,64,255,0.35)] 
  transition-all duration-500 ease-out 
  hover:shadow-[0_0_35px_rgba(156,64,255,0.6)]">

  {/* Strong Animated Border Glow */}
  <span
    className="absolute inset-0 rounded-full p-[2px] 
    bg-gradient-to-r from-orange-400 via-violet-500 to-cyan-400 
    bg-[length:300%_100%] animate-gradient"
    style={{
      WebkitMask:
        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "destination-out",
      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      maskComposite: "subtract",
    }}
  />

  <span className="relative flex items-center text-white font-medium">
    🎉 
    <hr className="mx-2 h-4 w-px bg-white/40" />
    <AnimatedGradientText className="text-sm font-semibold">
      Introducing Magic UI
    </AnimatedGradientText>
    <ChevronRight className="ml-1 size-4 text-white/80 transition-transform duration-300 group-hover:translate-x-1" />
  </span>
</div>

 <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-violet-600 leading-tight">

  Design High Quality{" "}
  <span className="text-teal-500">
    Website and Mobile App
  </span>{" "}
  Designs
</h2>

<p className="text-center text-gray-700 text-base sm:text-lg mt-3 px-2">

  <span className="text-violet-500 font-medium">
    Imagine your idea
  </span>{" "}
  and turn into{" "}
  <span className="text-teal-500 font-medium">
    reality
  </span>
</p>

      <div className="flex w-full gap-4 mt-6 items-center justify-center flex-col md:flex-row">

        <InputGroup className="w-full max-w-lg bg-white rounded-2xl">

          <InputGroupTextarea
            disabled={!isSignedIn}
            placeholder={
              isSignedIn
                ? "Enter what design you want..."
                : "Please sign-in to start designing"
            }
            className={cn(
              "flex field-sizing-content min-h-24 w-full resize-none rounded-md bg-transparent px-3 py-2.5 outline-none",
              !isSignedIn && "opacity-50",
            )}
            value={userInput}
            onChange={(event) => setUserInput(event.target?.value)}
            onKeyDown={handleKeyDown} 
          />
          <InputGroupAddon align="block-end">
            <Select value={device} onValueChange={(value) => setDevice(value)}>
             <SelectTrigger className="text-bold w-[130px] sm:w-[180px]">
                <SelectValue placeholder="Mobile" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <InputGroupButton 
              disabled={loading || !userInput} // Input empty ho toh button disable rakhein
              className="cursor-pointer ml-auto flex items-center justify-center bg-red-400 hover:bg-red-500 min-w-[40px]"
              size="sm"
              variant="default"
              onClick={onCreateProject}
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" /> // animate-spin class check karein
              ) : (
                <Send className=" h-4 w-4 text-white" /> // Icon ki height/width aur color specify karein
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-3 mt-6 justify-center">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
           className="p-3 border rounded-2xl flex flex-col items-center cursor-pointer bg-white z-20 w-full sm:w-auto"
            onClick={() => setUserInput(suggestion?.description)}
          >
            <h2 className="text-lg">{suggestion?.icon}</h2>
            <h2 className="text-center line-clamp-2 text-sm sm:text-base">
              {suggestion?.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Hero;
