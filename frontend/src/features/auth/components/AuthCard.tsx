import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({
  title,
  subtitle,
  children,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
      }}
    >
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          relative
          w-full
          max-w-md
          rounded-3xl
          border
          border-cyan-500/10
          bg-slate-900/65
          p-10
          backdrop-blur-2xl
          shadow-[0_0_70px_rgba(34,211,238,0.08)]
        "
      >
        {/* Glow */}

        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 to-indigo-500/5" />

        <div className="relative">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              {title}
            </h1>

            <p className="mt-2 text-slate-400">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}