import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";
import type { LoaderProps } from "../../../../../types/Interfaces";

gsap.registerPlugin(SplitText, useGSAP);

const MainLoader: React.FC<LoaderProps> = ({ fn }) => {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, { type: "chars" });

    gsap.set(".dot", { width: 0 });
    gsap.set(".flash", { opacity: 0 });
    gsap.set(".camera-flash", { opacity: 0 });
    gsap.set([".shutter-top", ".shutter-bottom"], { opacity: 0 });
    gsap.set(".photo-preview", { opacity: 0, scale: 1 });

    const tl = gsap.timeline();

    // Drop intro
    tl.from(split.chars, {
      y: -80,
      opacity: 0,
      ease: "elastic.out(1,0.3)",
      stagger: 0.05,
      duration: 1,
    });

    // Dot expand
    tl.to(".dot", {
      width: 40,
      duration: 0.5,
      ease: "power3.out",
    });

    // Shake
    tl.to(".loaderContent", {
      x: 3,
      repeat: 6,
      yoyo: true,
      duration: 0.035,
    });

    // Explosion flash
    tl.to(".flash", { opacity: 1, duration: 0.08 }).to(".flash", {
      opacity: 0,
      duration: 0.1,
    });

    // Shockwave
    tl.fromTo(
      ".shockwave",
      { scale: 0, opacity: 0.5 },
      { scale: 3, opacity: 0, duration: 0.6 }
    );

    // Flying letters
    tl.to(
      split.chars,
      {
        x: () => gsap.utils.random(-250, 250),
        y: () => gsap.utils.random(-250, 250),
        rotate: () => gsap.utils.random(-150, 150),
        opacity: 0,
        duration: 1,
      },
      "<"
    );

    // ✅ SCALE DOWN ONLY THE INSIDE CONTENT
    tl.to(".loaderContent", {
      scale: 0.8,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: "#ffffff",
      duration: 0.3,
      ease: "power2.out",
    });

    // Camera flash
    tl.to(".camera-flash", { opacity: 1, duration: 0.05 }).to(".camera-flash", {
      opacity: 0,
      duration: 0.15,
    });

    // Hide original
    tl.set(textRef.current, { opacity: 0 });

    // Show snapshot
    tl.to(".photo-preview", {
      opacity: 1,
      scale: 1.02,
      duration: 0.15,
    });

    // Hold snapshot
    tl.to(".photo-preview", {
      opacity: 1,
      duration: 0.55,
    });

    // Shutter closing
    tl.set([".shutter-top", ".shutter-bottom"], { opacity: 1 });

    tl.to(".shutter-top", {
      y: "100%",
      duration: 0.25,
    });

    tl.to(
      ".shutter-bottom",
      {
        y: "-100%",
        duration: 0.25,
      },
      "<"
    );

    // Fade out
    tl.to(".explodeWrapper", {
      opacity: 0,
      duration: 0.5,
      onComplete: () => fn(false),
    });
  });

  return (
    <div className="explodeWrapper fixed top-0 left-0 z-[9999] h-screen w-full bg-black/20 backdrop-blur-lg overflow-hidden flex items-center justify-center">
      {/* ✅ CONTENT THAT SHOULD SCALE DOWN */}
      <div className="loaderContent relative flex h-full w-full items-center justify-center bg-zinc-950">
        {/* Snapshot */}
        <div className="photo-preview absolute flex items-center gap-x-4 text-white text-7xl tracking-widest font-Fontspring pointer-events-none">
          Local <div className="h-2 w-10 bg-white"></div> Mind
        </div>

        {/* Shockwave */}
        <div className="shockwave absolute w-40 h-40 border border-white/30 rounded-full pointer-events-none"></div>

        {/* Original text */}
        <h1
          ref={textRef}
          className="text-white text-7xl tracking-widest font-Fontspring flex items-center gap-x-4 z-10">
          Local <div className="dot h-2 bg-white"></div> Mind
        </h1>
      </div>

      {/* Flashes */}
      <div className="flash absolute inset-0 bg-white"></div>
      <div className="camera-flash absolute inset-0 bg-white"></div>

      {/* Shutter */}
      <div className="shutter-top absolute top-0 left-0 w-full h-1/2 bg-black"></div>
      <div className="shutter-bottom absolute bottom-0 left-0 w-full h-1/2 bg-black"></div>
    </div>
  );
};

export default MainLoader;
