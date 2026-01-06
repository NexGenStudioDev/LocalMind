import { useEffect, useState } from 'react'
import tubeImg from '../../../../../assets/tubeImg.png'
import blobImg from '../../../../../assets/blobImg.png'
import waveImg from '../../../../../assets/waveImg.png'
import dotShadowImg from '../../../../../assets/dotShadowImg.png'
import globeImg from '../../../../../assets/globeImg.png'
import linesImg from '../../../../../assets/linesImg.png'
import Card from '../../../../../shared/component/v1/Card'
import type { CardProps } from '../../../../../types/Interfaces'
import InlineLoader from '../Loader/InlineLoader'
import EmptyState from '../EmptyState'
import gsap from 'gsap'
import { ScrollTrigger, SplitText } from 'gsap/all'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText)

const HomePage: React.FC = () => {
  const [features, setFeatures] = useState<CardProps[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulate async fetch (realistic frontend pattern)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFeatures([
        {
          title: 'Custom Models',
          desc: 'Train and deploy custom AI models lightning fast.',
        },
        {
          title: 'Model Supports',
          desc: 'Supports GPT, Llama, Stability and more AI engines.',
        },
        {
          title: 'AI Chat Section',
          desc: 'Next-gen real-time AI chat system, built for speed.',
        },
        {
          title: 'Socket & REST APIs',
          desc: 'Ultra-low latency sockets and secure REST APIs.',
        },
      ])
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  useGSAP(() => {
    const split = new SplitText('.about-para', { type: 'words' })
    gsap.from(split.words, {
      opacity: 0,
      y: 20,
      stagger: 0.04,
      duration: 0.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about',
        start: 'top 20%',
        end: 'top 5%',
        scrub: 3,
      },
    })
  }, [])

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

      {/* Features Section (Loading / Empty / Data) */}
      <div className="py-20 px-10">
        {isLoading && <InlineLoader />}

        {!isLoading && features.length === 0 && (
          <EmptyState
            title="No features found"
            description="Features will appear here once available."
          />
        )}

        {!isLoading && features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={feature.title} {...feature} />
            ))}
          </div>
        )}
      </div>

      <div className="about w-full min-h-screen relative flex flex-col justify-center pt-10 font-Satoshi">
        <h1 className="text-white text-center uppercase text-3xl tracking-wider font-bold">
          About
        </h1>
        <p className="about-para w-2/3 mx-auto text-center text-xl mt-15">
          LocalMind is a free, open-source platform made for students, developers, and anyone who
          wants to use AI without paying expensive fees or worrying about usage limits.
        </p>
        <p className="about-para w-2/3 mx-auto text-center text-xl mt-15">
          With LocalMind, you can run powerful AI models directly on your computer or connect to
          cloud models using your own API key.
        </p>
      </div>
    </div>
  )
}

export default HomePage
