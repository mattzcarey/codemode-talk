import { cn } from "@/utils"

interface CornerSquaresProps {
  className?: string
  size?: "sm" | "md"
}

export function CornerSquares({ className, size = "sm" }: CornerSquaresProps) {
  const sizeClass = size === "sm" ? "size-2" : "size-3.5"

  return (
    <>
      <div className={cn("absolute -top-px -left-px bg-border-100", sizeClass, className)} />
      <div className={cn("absolute -top-px -right-px bg-border-100", sizeClass, className)} />
      <div className={cn("absolute -bottom-px -left-px bg-border-100", sizeClass, className)} />
      <div className={cn("absolute -bottom-px -right-px bg-border-100", sizeClass, className)} />
    </>
  )
}
