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
  const [device, setDevice] = useState<string>("website");
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

    router.push(`/project/`+projectId);
  };

  return (
    <div className="p-10 md:px-24 lg:px-48 xl:px-60 mt-20">
      <div className="group relative mx-auto max-w-sm flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
        <span
          className={cn(
            "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]",
          )}
          style={{
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "subtract",
            WebkitClipPath: "padding-box",
          }}
        />
        🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
        <AnimatedGradientText className="text-sm font-medium">
          Introducing Magic UI
        </AnimatedGradientText>
        <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </div>
      <h2 className="text-5xl font-bold text-center">
        Design High Quality{" "}
        <span className="text-primary">Website and Mobile App </span> Designs
      </h2>
      <p className="text-center text-gray-600 text-lg mt-3">
        {" "}
        Imagine your idea and turn into reality
      </p>
      <div className="flex w-full gap-6 mt-5 items-center justify-center">
        <InputGroup className="max-w-lg bg-white rounded-2xl">
          <InputGroupTextarea
            disabled={!isSignedIn}
            placeholder={
              isSignedIn
                ? "Enter what design you want..."
                : "Please sign-in to start designing"
            }
            className={cn(
              "flex field-sizing-content min-h-24 w-full resize-none rounded-md bg-transparent px-3 py-2.5 outline-none",
              !isSignedIn && "opacity-50 cursor-not-allowed",
            )}
            value={userInput}
            onChange={(event) => setUserInput(event.target?.value)}
          />
          <InputGroupAddon align="block-end">
            <Select onValueChange={(value) => setDevice(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <InputGroupButton
              disabled={loading || !userInput} // Input empty ho toh button disable rakhein
              className="cursor-pointer ml-auto flex items-center justify-center min-w-[40px]"
              size="sm"
              variant="default"
              onClick={onCreateProject}
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" /> // animate-spin class check karein
              ) : (
                <Send className="h-4 w-4 text-white" /> // Icon ki height/width aur color specify karein
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex gap-3 mt-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-2 border rounded-2xl flex flex-col items-center cursor-pointer bg-white z-20"
            onClick={() => setUserInput(suggestion?.description)}
          >
            <h2 className="text-lg">{suggestion?.icon}</h2>
            <h2 className="text-center line-clamp-2 text-sm">
              {suggestion?.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hero;
