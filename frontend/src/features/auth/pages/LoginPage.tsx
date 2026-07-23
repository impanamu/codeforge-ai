import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import AuthBackground from "../components/AuthBackground";
import AuthCard from "../components/AuthCard";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const taglines = [
    "AI-Powered Software Engineering Platform",
    "Build Smarter.",
    "Analyze Faster.",
    "Deploy with Confidence.",
    "Powered by AI.",
  ];

  const [currentTagline, setCurrentTagline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}

        <div className="mb-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold tracking-tight text-white"
          >
            CodeForge AI
          </motion.h1>

          <div className="mt-4 h-7 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTagline}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="text-lg text-slate-400"
              >
                {taglines[currentTagline]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Login Card */}

        <AuthCard
          title="Welcome Back"
          subtitle="Sign in to continue"
        >
          <LoginForm />
        </AuthCard>
      </div>
    </div>
  );
}