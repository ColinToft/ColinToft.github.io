"use client";

import { useRef, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import { useBackgroundStore } from "@/store/backgroundStore";

export default function Home() {
    const aboutRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: aboutRef,
        offset: ["start end", "end start"], // Track from when top enters bottom viewport to when bottom leaves top viewport
    });

    const { setBrightness, setStarVisibility } = useBackgroundStore();

    // Map scroll progress (0 to 1) to brightness (0 -> 1 -> 0)
    const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

    // Map scroll progress (0 to 1) to star visibility
    const starVisibility = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [1, 0.1, 1]
    );

    useEffect(() => {
        // Subscribe to changes in the motion values and update the store
        const unsubscribeBrightness = brightness.onChange((value) => {
            setBrightness(value);
        });
        const unsubscribeStars = starVisibility.onChange((value) => {
            setStarVisibility(value);
        });

        return () => {
            // Cleanup subscriptions on unmount
            unsubscribeBrightness();
            unsubscribeStars();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brightness, starVisibility]); // Rerun effect if motion values change

    return (
        <main className='flex min-h-screen flex-col items-center justify-between relative z-10'>
            <Hero />
            {/* Wrap About section to provide a target ref */}
            <div ref={aboutRef} className='w-full'>
                <About />
            </div>
            <Projects />
            {/* Add other sections as needed */}
        </main>
    );
}
