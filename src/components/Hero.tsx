"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { useState } from "react";
import Ticker from "./Ticker";

const TICKER_WORDS = [
    "Programmer",
    "Mathematician",
    "Musician",
    "Innovator",
    "Problem Solver",
    "Creator",
    "Big Brother",
    "Thinker",
];

const Hero = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 10 && !isScrolled) {
            setIsScrolled(true);
        } else if (latest <= 10 && isScrolled) {
            setIsScrolled(false);
        }
    });

    return (
        <section className='relative w-full h-screen mx-auto flex flex-col items-center justify-center text-center'>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className='font-serif text-6xl md:text-8xl font-bold text-white mb-4'
            >
                Colin Toft
            </motion.h1>
            <Ticker words={TICKER_WORDS} isScrolled={isScrolled} />
            <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{
                    opacity: isScrolled ? 0 : 1,
                    y: 10,
                }}
                transition={{
                    y: {
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    },
                    opacity: {
                        duration: 0.3,
                    },
                }}
                className='absolute bottom-8 cursor-pointer'
                onClick={() =>
                    window.scrollTo({
                        top: window.innerHeight,
                        behavior: "smooth",
                    })
                }
            >
                <FiChevronDown className='w-12 h-12 text-slate-100' />
            </motion.div>
        </section>
    );
};

export default Hero;
