'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lottie from 'lottie-react'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollVideoHeroProps {
  videoSrc?: string
  sprayAnimationData?: unknown // Lottie animation data
}

export default function ScrollVideoHero({
  videoSrc = '/video/Whisk_q2yyqdnmljzjntn20cn5gjytatmzqtlzuznx0cz.mp4',
  sprayAnimationData,
}: ScrollVideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const textOverlay1Ref = useRef<HTMLDivElement>(null)
  const textOverlay2Ref = useRef<HTMLDivElement>(null)
  const sprayContainerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const sprayTriggeredRef = useRef(false)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        window.innerWidth < 768
      )
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Setup GSAP ScrollTrigger animations
  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current

    if (!container || !video) return

    // Mobile: let video play and loop normally
    if (isMobile) {
      video.loop = true
      video.play().catch((err) => {
        console.log('Autoplay prevented on mobile:', err)
      })
      return
    }

    // Desktop: setup scroll scrubbing
    // Ensure video doesn't autoplay or loop
    video.loop = false
    video.autoplay = false

    // Wait for video to be ready
    const setupScrollTrigger = () => {
      if (video.readyState < 2) {
        console.log('Video not ready, waiting...')
        return
      }

      // Setup scroll scrubbing

      // Set video to first frame and ensure it's paused
      video.currentTime = 0
      video.pause()
      video.muted = true // Ensure muted for better browser compatibility

      // Kill any existing ScrollTrigger instances for this container
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill()
        }
      })

      // Create scroll-linked video scrubbing
      const scrubAnimation = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing (1 second lag for smoothness)
        onUpdate: (self) => {
          // Calculate video time based on scroll progress
          const progress = self.progress
          if (video && video.duration && !isNaN(video.duration) && video.duration > 0) {
            const targetTime = progress * video.duration
            // Always update currentTime for smooth scrubbing
            video.currentTime = targetTime
          }

          // Trigger spray animation at 90% (only once)
          if (
            progress >= 0.9 &&
            sprayContainerRef.current &&
            !sprayTriggeredRef.current
          ) {
            sprayTriggeredRef.current = true
            gsap.to(sprayContainerRef.current, {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: 'power2.out',
            })
          } else if (progress < 0.9 && sprayTriggeredRef.current) {
            // Reset trigger when scrolling back up
            sprayTriggeredRef.current = false
            if (sprayContainerRef.current) {
              gsap.to(sprayContainerRef.current, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
              })
            }
          }
        },
      })

      // Set initial states for text overlays
      if (textOverlay1Ref.current) {
        gsap.set(textOverlay1Ref.current, { opacity: 0, y: 50 })
      }
      if (textOverlay2Ref.current) {
        gsap.set(textOverlay2Ref.current, { opacity: 0, y: 50 })
      }

      // Text overlay 1: "Welcome to Rawaj" - appears at 20% scroll
      if (textOverlay1Ref.current) {
        gsap.to(textOverlay1Ref.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: container,
            start: '20% top',
            end: '40% top',
            scrub: 1,
          },
        })

        // Text overlay 1: fade out after 60%
        gsap.to(textOverlay1Ref.current, {
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: container,
            start: '60% top',
            end: '80% top',
            scrub: 1,
          },
        })
      }

      // Text overlay 2: "Craft Your Signature Scent" - appears at 50% scroll
      if (textOverlay2Ref.current) {
        gsap.to(textOverlay2Ref.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: container,
            start: '50% top',
            end: '70% top',
            scrub: 1,
          },
        })

        // Text overlay 2: fade out before spray
        gsap.to(textOverlay2Ref.current, {
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: container,
            start: '85% top',
            end: '95% top',
            scrub: 1,
          },
        })
      }

      // Initially hide spray container
      if (sprayContainerRef.current) {
        gsap.set(sprayContainerRef.current, {
          opacity: 0,
          scale: 0.8,
        })
      }

      scrollTriggerRef.current = scrubAnimation
    }

    // Setup when video is loaded
    const handleLoadedData = () => {
      setVideoLoaded(true)
      if (!isMobile) {
        // Small delay to ensure video is fully ready
        setTimeout(() => {
          setupScrollTrigger()
        }, 100)
      }
    }

    const handleCanPlay = () => {
      if (!isMobile && !videoLoaded) {
        handleLoadedData()
      }
    }

    const handleLoadedMetadata = () => {
      if (!isMobile && !videoLoaded) {
        handleLoadedData()
      }
    }

    const handleError = (e: Event) => {
      console.error('Error loading video:', videoSrc, e)
    }

    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    // Try to load the video
    video.load()

    // Cleanup function
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      
      // Kill all ScrollTriggers for this container
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill()
        }
      })
    }
  }, [videoLoaded, isMobile, videoSrc])

  return (
    <div
      ref={containerRef}
      className="relative h-[200vh] w-full overflow-hidden bg-black"
    >
      {/* Video Container */}
      <div className="sticky top-0 h-screen w-full z-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          preload="auto"
          playsInline
          muted
          loop={isMobile}
          {...(isMobile && { autoPlay: true })}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Text Overlay 1: Welcome to Rawaj */}
        <div
          ref={textOverlay1Ref}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white text-center px-4 drop-shadow-2xl">
            Welcome to Rawaj
          </h1>
        </div>

        {/* Text Overlay 2: Craft Your Signature Scent */}
        <div
          ref={textOverlay2Ref}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-white text-center px-4 drop-shadow-2xl">
            Craft Your Signature Scent
          </h2>
        </div>

        {/* Spray Animation Container */}
        <div
          ref={sprayContainerRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        >
          {sprayAnimationData ? (
            <div className="w-full h-full flex items-center justify-center">
              <Lottie
                animationData={sprayAnimationData}
                loop={false}
                autoplay={true}
                className="w-full max-w-2xl h-full"
              />
            </div>
          ) : (
            // Placeholder spray animation - replace with actual Lottie or video
            <div className="text-white text-4xl font-bold animate-pulse">
              ✨ Spray Animation ✨
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

