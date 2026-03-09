import { cn } from "@/utils"

interface DotsProps {
  color?: string
  className?: string
  size?: number
}

export function Dots({ color = "#E9D1BB", className, size = 12 }: DotsProps) {
  const patternId = "dots-pattern"

  return (
    <svg
      className={cn("absolute inset-0 h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={size / 2} cy={size / 2} r="0.75" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}
