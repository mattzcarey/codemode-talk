import { motion } from "framer-motion"
import { cn } from "@/utils"
import { CornerSquares } from "./CornerSquares"
import { Dots } from "./Dots"

interface SlideContainerProps {
  children: React.ReactNode
  className?: string
  showDots?: boolean
  showCorners?: boolean
}

export function SlideContainer({
  children,
  className,
  showDots = true,
  showCorners = true,
}: SlideContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden border border-border-100 bg-background-100",
        className,
      )}
    >
      {showDots && <Dots className="opacity-50" />}
      {showCorners && <CornerSquares size="md" />}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-8 md:p-16">
        {children}
      </div>
    </motion.div>
  )
}
