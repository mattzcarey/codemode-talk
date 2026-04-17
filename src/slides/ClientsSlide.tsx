import { SlideContainer } from "@/components"
import { motion } from "framer-motion"

export function ClientsSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-10">
        <motion.h2
          className="text-foreground-100 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          But Clients Didn't <span className="text-accent-100">Implement</span><br /><span className="text-accent-100">Code Mode</span> Quickly
        </motion.h2>

        <motion.div
          className="flex flex-col items-center gap-6 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-foreground-200 text-center">
            People still couldn't use our API.
          </p>
        </motion.div>

        <motion.div
          className="rounded-lg border border-accent-100 bg-accent-100/10 px-8 py-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.8, ease: "easeOut" }}
        >
          <p className="text-accent-100 font-medium text-center">
            Why not?
          </p>
        </motion.div>
      </div>
    </SlideContainer>
  )
}
