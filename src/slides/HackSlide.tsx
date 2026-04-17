import { SlideContainer } from "@/components"
import { motion } from "framer-motion"

export function HackSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-10">
        <motion.h2
          className="text-foreground-100 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Where Are We <span className="text-accent-100">Going</span>?
        </motion.h2>

        <motion.p
          className="text-foreground-200 text-center italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          "let agents write code"
        </motion.p>
      </div>
    </SlideContainer>
  )
}
