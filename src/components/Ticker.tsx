import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import { motion } from "framer-motion";

interface TickerProps {
    words: string[];
    className?: string;
    framesToChange?: number;
    framesPaused?: number;
    framesPerLetter?: number;
    intervalMilliseconds?: number;
    isScrolled?: boolean;
}

const Ticker: React.FC<TickerProps> = ({
    words,
    className = "",
    framesToChange = 120,
    framesPaused = 25,
    framesPerLetter = 5,
    intervalMilliseconds = 33,
    isScrolled = false,
}) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isPaused, setIsPaused] = useState(true);
    const frame = useRef(0);
    const [matrixLength, setMatrixLength] = useState(0);
    const [preprocessedWords, setPreprocessedWords] = useState<string[]>([]);
    const animationFrameId = useRef<number | null>(null);
    const lastFrameTime = useRef<number>(0);
    const isInitialized = useRef(false);

    const smooth = useMemo(() => {
        return (value: number): number => {
            if (value <= 0) return 0;
            if (value >= 1) return 1;
            return value - 0.05 * Math.sin(2 * Math.PI * value);
        };
    }, []);

    const calculateTransitionChar = useCallback(
        (prevChar: string, goalChar: string, progress: number): string => {
            if (prevChar === " " && goalChar === " ") return " ";

            let goalCharCode = goalChar.charCodeAt(0) - 32;
            const prevCharCode = prevChar.charCodeAt(0) - 32;

            while (goalCharCode - 20 < prevCharCode) {
                goalCharCode += 126 - 32;
            }

            const curCharCode = Math.ceil(
                (((goalCharCode - prevCharCode) * progress + prevCharCode) %
                    (126 - 32)) +
                    32
            );
            return String.fromCharCode(curCharCode);
        },
        []
    );

    const updateText = useCallback(() => {
        if (!preprocessedWords.length) return;

        if (isPaused) {
            if (frame.current < framesPaused) {
                setDisplayedText(preprocessedWords[currentWordIndex]);
                frame.current++;
            } else {
                const nextWordIndex =
                    (currentWordIndex + 1) % preprocessedWords.length;
                setCurrentWordIndex(nextWordIndex);
                frame.current = 0;
                setIsPaused(false);
            }
        } else {
            if (frame.current < framesToChange) {
                const goalString = preprocessedWords[currentWordIndex];
                const prevString =
                    currentWordIndex === 0
                        ? preprocessedWords[preprocessedWords.length - 1]
                        : preprocessedWords[currentWordIndex - 1];

                let s = "";
                for (let charIndex = 0; charIndex < matrixLength; charIndex++) {
                    const progress = smooth(
                        (frame.current - charIndex * framesPerLetter) /
                            Math.max(
                                1,
                                framesToChange - matrixLength * framesPerLetter
                            )
                    );

                    s += calculateTransitionChar(
                        prevString[charIndex],
                        goalString[charIndex],
                        progress
                    );
                }
                setDisplayedText(s);
                frame.current++;
            } else {
                setIsPaused(true);
                frame.current = 0;
            }
        }
    }, [
        preprocessedWords,
        isPaused,
        framesPaused,
        currentWordIndex,
        framesToChange,
        matrixLength,
        framesPerLetter,
        smooth,
        calculateTransitionChar,
    ]);

    useEffect(() => {
        if (!isInitialized.current || !preprocessedWords.length) return;

        const animate = (timestamp: number) => {
            if (timestamp - lastFrameTime.current >= intervalMilliseconds) {
                updateText();
                lastFrameTime.current = timestamp;
            }
            animationFrameId.current = requestAnimationFrame(animate);
        };

        lastFrameTime.current = performance.now();
        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
            }
        };
    }, [updateText, intervalMilliseconds, preprocessedWords]);

    useEffect(() => {
        if (!words || words.length === 0) return;

        const overallMaxLength = Math.max(...words.map((w) => w.length));
        setMatrixLength(overallMaxLength);

        const centered = words.map((word) => {
            const totalPadding = overallMaxLength - word.length;
            const leftPadding = Math.floor(totalPadding / 2);
            const rightPadding = totalPadding - leftPadding;
            return " ".repeat(leftPadding) + word + " ".repeat(rightPadding);
        });
        setPreprocessedWords(centered);
        setDisplayedText(centered[0]);
        setCurrentWordIndex(0);
        frame.current = 0;
        setIsPaused(true);
        isInitialized.current = true;
    }, [words]);

    return (
        <motion.p
            initial={{ opacity: 0 }}
            animate={{
                opacity: isScrolled ? 0 : 1,
            }}
            transition={{
                duration: 0.3,
            }}
            className={`font-mono text-lg md:text-2xl text-slate-100 max-w-2xl whitespace-pre ${className}`}
        >
            {displayedText}
        </motion.p>
    );
};

export default Ticker;
