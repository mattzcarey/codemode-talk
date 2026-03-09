import { SlideContainer } from "@/components"

export function FindOutMoreSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-foreground-100">Find out more</h2>

        <a
          href="https://blog.cloudflare.com/code-mode-mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-border-100 overflow-hidden shadow-lg hover:shadow-xl transition-shadow max-w-2xl"
        >
          <img
            src="/blog-post.jpeg"
            alt="Code Mode: give agents an entire API in 1,000 tokens — The Cloudflare Blog"
            className="w-full"
          />
        </a>

        <p className="font-mono text-sm text-foreground-200">
          blog.cloudflare.com/code-mode-mcp
        </p>
      </div>
    </SlideContainer>
  )
}
