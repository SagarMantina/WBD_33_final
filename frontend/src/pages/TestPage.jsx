"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

export default function TestPage() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsVisible(false), 2000);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Intro Animation */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 flex items-center justify-center bg-black text-white text-5xl font-extrabold"
        >
          My Awesome Website
        </motion.div>
      )}

      {/* Content */}
      <div className="container mx-auto p-10 space-y-32">
        {/* Typing Animation */}
        <div className="flex justify-center mt-20">
          <TypeAnimation
            sequence={["Welcome to My Website", 1000, "Enjoy the Experience", 1000]}
            speed={50}
            repeat={Infinity}
            className="text-4xl font-bold text-center"
          />
        </div>

        {/* Stroke Text Animation */}
        <motion.h1
          initial={{ strokeDasharray: "0 100%" }}
          animate={{ strokeDasharray: "100% 0%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="text-5xl font-bold stroke-text text-center"
        >
          Fancy Reveal
        </motion.h1>

        {/* Scroll Reveal Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="p-10 bg-gray-800 rounded-lg shadow-lg text-center"
        >
          <h2 className="text-3xl font-bold">Scroll Reveal Section</h2>
          <p className="mt-2 text-gray-400">This section appears smoothly on scroll.</p>
        </motion.div>

        {/* Another Scroll Reveal Section */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="p-10 bg-gray-700 rounded-lg shadow-lg text-center"
        >
          <h2 className="text-3xl font-bold">Left Slide Reveal</h2>
          <p className="mt-2 text-gray-400">This section slides in from the left.</p>
        </motion.div>
      </div>
    </div>
  );
}

