"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ReactNode, useState } from "react";

interface MotionTooltipProps {
  label: string;
  children: ReactNode;
}

export function MotionTooltip({ label, children }: MotionTooltipProps) {
  const [open, setOpen] = useState(false);

  const x = useMotionValue(0);
  const springConfig = { stiffness: 120, damping: 10 };

  const rotate = useSpring(
    useTransform(x, [-50, 50], [-10, 10]),
    springConfig
  );

  const translateX = useSpring(
    useTransform(x, [-50, 50], [-10, 10]),
    springConfig
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
  };

  return (
    <div
      className="relative flex justify-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.8 }}
            style={{
              translateX,
              rotate,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
            }}
            className="absolute left-14 z-50 whitespace-nowrap rounded-md border bg-white px-3 py-1.5 text-xs font-medium text-gray-800 shadow-lg"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  );
}
