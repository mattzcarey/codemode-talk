import { SlideContainer } from "@/components"

export function TitleSlide() {
  return (
    <SlideContainer>
      <div className="flex w-full max-w-5xl flex-col items-center gap-8 md:flex-row md:items-center md:justify-between md:gap-16">
        {/* Text content */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <h1 className="text-foreground-100">
            Every API is a Tool for Agents
            <br />
            <span className="text-accent-100">with Code Mode</span>
          </h1>

          <div className="mt-6 flex flex-col gap-2">
            <h3 className="text-foreground-100">Matt Carey</h3>
            <p className="text-foreground-200">
              Agents & MCP at Cloudflare
            </p>
            <a
              href="https://twitter.com/mattzcarey"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-accent-100 transition-opacity hover:opacity-70"
            >
              @mattzcarey
            </a>
          </div>

          <p className="mt-2 font-mono text-sm text-foreground-200">
            Node Congress
          </p>
        </div>

        {/* Photo */}
        <div className="flex-shrink-0">
          <div className="relative size-48 overflow-hidden rounded-2xl border-2 border-border-100 bg-background-200 md:size-64">
            <img
              src="/photo.jpg"
              alt="Matt Carey"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none"
                e.currentTarget.nextElementSibling?.classList.remove("hidden")
              }}
            />
            <div className="hidden absolute inset-0 flex items-center justify-center text-foreground-200">
              <span className="font-mono text-sm">photo.jpg</span>
            </div>
          </div>
        </div>
      </div>
    </SlideContainer>
  )
}
