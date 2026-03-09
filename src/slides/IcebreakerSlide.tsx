import { SlideContainer } from "@/components"

export function IcebreakerSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-6">
        <div className="relative max-h-[70vh] max-w-4xl overflow-hidden rounded-lg border-2 border-border-100 bg-background-200">
          <img
            src="/meme.png"
            alt="If a dog wore pants, would he wear them like this or like this?"
            className="h-full w-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none"
              e.currentTarget.nextElementSibling?.classList.remove("hidden")
            }}
          />
          <div className="hidden flex h-64 w-[500px] items-center justify-center p-8 text-center">
            <div className="flex flex-col gap-2">
              <p className="text-foreground-200">
                If a dog wore pants...
              </p>
              <p className="font-mono text-sm text-foreground-200/60">
                /public/meme.png
              </p>
            </div>
          </div>
        </div>
      </div>
    </SlideContainer>
  )
}
