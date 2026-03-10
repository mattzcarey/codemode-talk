import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router"
import { AnimatePresence } from "framer-motion"
import {
  TitleSlide,
  IcebreakerSlide,
  ToolCallingSlide,
  MCPSlide,
  ContextWindowSlide,
  ProgressiveDisclosureSlide,
  ExampleIntroSlide,
  CLISlide,
  ToolSearchSlide,
  CodeModeIntroSlide,
  CodeModeSDKSlide,
  CodeModeExecuteSlide,
  WhyComposableSlide,
  WhyTokensSlide,
  BackToMCPSlide,
  UntrustedCodeSlide,
  WorkerLoadersSlide,
  CodeModeDemoSlide,
  CloudflareAPIDemoSlide,
  FindOutMoreSlide,
  ThankYouSlide,
} from "./slides"

export const slides = [
  { component: TitleSlide, slug: "title" },
  { component: IcebreakerSlide, slug: "icebreaker" },
  { component: ToolCallingSlide, slug: "tool-calling" },
  { component: MCPSlide, slug: "mcp" },
  { component: ContextWindowSlide, slug: "context-window" },
  { component: ProgressiveDisclosureSlide, slug: "progressive-disclosure" },
  { component: ExampleIntroSlide, slug: "pm-api" },
  { component: CLISlide, slug: "cli" },
  { component: ToolSearchSlide, slug: "tool-search" },
  { component: CodeModeIntroSlide, slug: "code-mode-intro" },
  { component: CodeModeSDKSlide, slug: "code-mode-sdk" },
  { component: CodeModeExecuteSlide, slug: "code-mode-execute" },
  { component: WhyComposableSlide, slug: "why-composable" },
  { component: WhyTokensSlide, slug: "why-tokens" },
  { component: UntrustedCodeSlide, slug: "untrusted-code" },
  { component: WorkerLoadersSlide, slug: "worker-loaders" },
  { component: CodeModeDemoSlide, slug: "code-mode-demo" },
  { component: BackToMCPSlide, slug: "back-to-mcp" },
  { component: CloudflareAPIDemoSlide, slug: "cf-api-demo" },
  { component: FindOutMoreSlide, slug: "find-out-more" },
  { component: ThankYouSlide, slug: "thank-you" },
]

const slugToIndex = new Map(slides.map((s, i) => [s.slug, i]))

export default function App() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const [isFullscreen, setIsFullscreen] = useState(false)

  const currentSlide = slug ? (slugToIndex.get(slug) ?? 0) : 0

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < slides.length) {
        navigate(`/${slides[index].slug}`)
      }
    },
    [navigate]
  )

  const nextSlide = useCallback(() => {
    goToSlide(Math.min(currentSlide + 1, slides.length - 1))
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide(Math.max(currentSlide - 1, 0))
  }, [currentSlide, goToSlide])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault()
          nextSlide()
          break
        case "ArrowLeft":
          e.preventDefault()
          prevSlide()
          break
        case "Home":
          e.preventDefault()
          goToSlide(0)
          break
        case "End":
          e.preventDefault()
          goToSlide(slides.length - 1)
          break
        case "f":
        case "F":
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextSlide, prevSlide, goToSlide, toggleFullscreen])

  const CurrentSlideComponent = slides[currentSlide].component

  return (
    <div className="relative flex h-screen w-screen flex-col bg-background-100">
      {/* Slide area — border stops above the nav strip */}
      <div className="flex-1 min-h-0 p-6 pb-3 md:p-12 md:pb-3">
        <AnimatePresence mode="wait">
          <CurrentSlideComponent key={currentSlide} />
        </AnimatePresence>
      </div>

      {/* Nav strip below the slide border */}
      <div className="relative flex shrink-0 items-center justify-center px-6 pt-2 pb-4 md:px-12">
        {/* Navigation dots — centered */}
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`size-2 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? "scale-125 bg-accent-100"
                  : "bg-border-100 hover:bg-accent-200"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrows + counter + fullscreen — right */}
        <div className="absolute right-6 md:right-12 flex items-center gap-3">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="font-mono text-sm text-foreground-200 hover:text-accent-100 disabled:opacity-20 transition-colors"
            aria-label="Previous slide"
          >
            ←
          </button>
          <span className="font-mono text-sm text-foreground-200">
            {currentSlide + 1}/{slides.length}
          </span>
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="font-mono text-sm text-foreground-200 hover:text-accent-100 disabled:opacity-20 transition-colors"
            aria-label="Next slide"
          >
            →
          </button>
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center size-7 rounded border border-border-100 bg-background-200 text-foreground-200 hover:bg-background-100 hover:text-accent-100 transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
