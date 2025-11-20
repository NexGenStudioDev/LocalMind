import tubeImg from "../../../../../assets/tubeImg.png";
import blobImg from "../../../../../assets/blobImg.png";
import waveImg from "../../../../../assets/waveImg.png";
import dotShadowImg from "../../../../../assets/dotShadowImg.png";
import globeImg from "../../../../../assets/globeImg.png";
import linesImg from "../../../../../assets/linesImg.png";
import Card from "../../../../../shared/component/v1/Card";
import type { CardProps } from "../../../../../types/Interfaces";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const HomePage: React.FC = () => {
  // Typed array of feature objects
  const features: CardProps[] = [
    {
      title: "Custom Models",
      desc: "Train and deploy custom AI models lightning fast.",
    },
    {
      title: "Model Supports",
      desc: "Supports GPT, Llama, Stability and more AI engines.",
    },
    {
      title: "AI Chat Section",
      desc: "Next-gen real-time AI chat system, built for speed.",
    },
    {
      title: "Socket & REST APIs",
      desc: "Ultra-low latency sockets and secure REST APIs.",
    },
  ];

  useGSAP(() => {
    const split = new SplitText(".about-para", {
      type: "words",
    });
    gsap.from(split.words, {
      opacity: 0,
      y: 20,
      stagger: 0.04,
      duration: 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about",
        start: "top 20%",
        end: "top 5%",
        scrub: 3,
      },
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#1E1E1E] text-white overflow-hidden">
      <div className="w-full h-screen relative">
        <img
          className="w-full h-full absolute top-0 left-0 object-cover object-[25%_55%]"
          src={globeImg}
          alt="bgImage"
        />
        <div className="absolute top-0 left-0 z-20 w-full flex flex-col gap-y-75 items-center justify-center h-full">
          <h1 className="font-Fontspring text-6xl mt-15">Local Mind</h1>
          <p className="uppercase font-Satoshi font-bold leading-15 text-4xl w-1/2 text-center">
            "Build For Speed. Designed For Intelligence."
          </p>
        </div>
        <img src={linesImg} alt="" className="absolute w-full -bottom-15" />
      </div>
      <div className="about w-full min-h-screen relative flex flex-col justify-center pt-10 font-Satoshi">
        <h1 className="text-white text-center uppercase text-3xl tracking-wider font-bold">
          About
        </h1>
        <p className="about-para w-2/3 mx-auto text-center text-xl mt-15">
          LocalMind is a free, open-source platform made for students,
          developers, and anyone who wants to use AI without paying expensive
          fees or worrying about usage limits.
        </p>
        <p className="about-para w-2/3 mx-auto text-center text-xl mt-15">
          With LocalMind, you can run powerful AI models directly on your
          computer (like Mistral or LLaMA) or connect to cloud models (like
          Gemini) using your own API key — which is stored safely on your
          device. You can even upload Excel files to teach your AI more things,
          and expose your local port so others can access your AI too!
        </p>
      </div>
    </div>
  );
};

export default HomePage;
