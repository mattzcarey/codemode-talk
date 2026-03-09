import { SlideContainer } from "@/components"

export function ThankYouSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-foreground-100">Thank you!</h1>

        <div className="flex flex-col gap-4 mt-4">
          {/* Try it */}
          <div className="rounded-lg border border-compute-100 bg-compute-100/10 px-8 py-4">
            <p className="text-foreground-100">
              <span className="font-mono text-compute-100">Try it:</span>{" "}
              <span className="font-mono text-sm">mcp.cloudflare.com/mcp</span>
            </p>
          </div>

          {/* Code Mode */}
          <div className="rounded-lg border border-accent-100 bg-accent-100/10 px-8 py-4">
            <p className="text-foreground-100">
              <span className="font-mono text-accent-100">SDK:</span>{" "}
              <span className="font-mono text-sm">@cloudflare/codemode</span>
              <span className="text-foreground-200 text-sm"> (beta)</span>
            </p>
          </div>

          {/* Hiring */}
          <div className="rounded-lg border border-ai-100 bg-ai-100/10 px-8 py-4">
            <p className="text-foreground-100">
              <span className="font-mono text-ai-100">PS:</span>{" "}
              we're hiring <span className="text-ai-100 font-medium">!!</span>
            </p>
          </div>
        </div>

        {/* Handle */}
        <a
          href="https://twitter.com/mattzcarey"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-lg text-accent-100 transition-opacity hover:opacity-70"
        >
          @mattzcarey
        </a>

        {/* Cloudflare logo */}
        <div className="mt-2 flex items-center gap-3 text-accent-100">
          <svg
            width="66"
            height="30"
            viewBox="0 0 66 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M52.688 13.028c-.22 0-.437.008-.654.015a.3.3 0 0 0-.102.024.37.37 0 0 0-.236.255l-.93 3.249c-.401 1.397-.252 2.687.422 3.634.618.876 1.646 1.39 2.894 1.45l5.045.306a.45.45 0 0 1 .435.41.5.5 0 0 1-.025.223.64.64 0 0 1-.547.426l-5.242.306c-2.848.132-5.912 2.456-6.987 5.29l-.378 1a.28.28 0 0 0 .248.382h18.054a.48.48 0 0 0 .464-.35c.32-1.153.482-2.344.48-3.54 0-7.22-5.79-13.072-12.933-13.072M44.807 29.578l.334-1.175c.402-1.397.253-2.687-.42-3.634-.62-.876-1.647-1.39-2.896-1.45l-23.665-.306a.47.47 0 0 1-.374-.199.5.5 0 0 1-.052-.434.64.64 0 0 1 .552-.426l23.886-.306c2.836-.131 5.9-2.456 6.975-5.29l1.362-3.6a.9.9 0 0 0 .04-.477C48.997 5.259 42.789 0 35.367 0c-6.842 0-12.647 4.462-14.73 10.665a6.92 6.92 0 0 0-4.911-1.374c-3.28.33-5.92 3.002-6.246 6.318a7.2 7.2 0 0 0 .18 2.472C4.3 18.241 0 22.679 0 28.133q0 .74.106 1.453a.46.46 0 0 0 .457.402h43.704a.57.57 0 0 0 .54-.418"
            />
          </svg>
        </div>
      </div>
    </SlideContainer>
  )
}
