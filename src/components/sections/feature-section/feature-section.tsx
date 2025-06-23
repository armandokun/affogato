'use client'

import { useRef, useEffect, VideoHTMLAttributes } from 'react'

function VideoOnScroll({ src, ...props }: VideoHTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current

    if (!video) return

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.currentSrc !== src) {
            video.src = src!
          }
          video.play()
        } else {
          video.pause()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(video)

    return () => {
      if (video) {
        observer.unobserve(video)
      }
    }
  }, [src])

  return <video ref={ref} preload="none" playsInline {...props} />
}

const FeatureSection = () => {
  return (
    <section id="features" className="text-center">
      <div className="container">
        <div className="grid grid-cols-1 gap-24 mt-10 max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center w-[80%] mx-auto mb-6">
              <h2 className="text-4xl font-medium mb-2 text-balance tracking-tighter">
                Deep thinking Plus+
              </h2>
              <p className="text-gray-400">
                AI models take more time to think and can use tools, like Web Search to make better
                decisions.
              </p>
            </div>
            <VideoOnScroll
              src="https://julzgytjnjizjjbnjgut.supabase.co/storage/v1/object/public/feature-videos/reasoning-web.mp4"
              poster="https://julzgytjnjizjjbnjgut.supabase.co/storage/v1/object/public/feature-videos/reasoning-web.png"
              muted
              loop
              playsInline
              className="rounded-xl w-full h-full object-cover [&::-webkit-media-controls-panel]:hidden [&::-webkit-media-controls]:hidden [&::--webkit-media-controls-play-button]:hidden [&::-webkit-media-controls-start-playback-button]:hidden"
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center w-[80%] mx-auto mb-6">
              <h2 className="text-4xl font-medium mb-2 text-balance tracking-tighter">
                Images, documents, you name it.
              </h2>
              <p className="text-gray-400">
                The models can use images and documents to get more context to get the best result.
              </p>
            </div>
            <VideoOnScroll
              src="https://julzgytjnjizjjbnjgut.supabase.co/storage/v1/object/public/feature-videos/files.mp4"
              poster="https://julzgytjnjizjjbnjgut.supabase.co/storage/v1/object/public/feature-videos/files.png"
              muted
              loop
              playsInline
              className="rounded-xl w-full h-full object-cover [&::-webkit-media-controls-panel]:hidden [&::-webkit-media-controls]:hidden [&::--webkit-media-controls-play-button]:hidden [&::-webkit-media-controls-start-playback-button]:hidden"
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center w-[80%] mx-auto mb-6">
              <h2 className="text-4xl font-medium mb-2 text-balance tracking-tighter">
                One conversation, multiple AI minds.
              </h2>
              <p className="text-gray-400">
                Use multiple AI models at once and enable features other models don&apos;t support.
              </p>
            </div>
            <VideoOnScroll
              src="https://julzgytjnjizjjbnjgut.supabase.co/storage/v1/object/public/feature-videos/multiple-ai.mp4"
              poster="https://julzgytjnjizjjbnjgut.supabase.co/storage/v1/object/public/feature-videos/multiple-ai.png"
              muted
              loop
              playsInline
              className="rounded-xl w-full h-full object-cover [&::-webkit-media-controls-panel]:hidden [&::-webkit-media-controls]:hidden [&::--webkit-media-controls-play-button]:hidden [&::-webkit-media-controls-start-playback-button]:hidden"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
