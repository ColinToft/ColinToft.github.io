"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import ProjectCard from "./ProjectCard";
import { motion, AnimatePresence } from "framer-motion";

const projectsData = [
    {
        title: "UW Blueprint - Sistema Toronto",
        description:
            "Created a platform for registered charity Sistema Toronto, which provides music lessons for students in underserved communities. Built a calendar system for volunteer music teachers and an admin dashboard for managing lessons and absences.",
        tags: ["React", "Python", "Flask", "Full Stack", "TypeScript"],
        githubLink: undefined,
        liveLink: undefined,
        date: "January 2025 - April 2025",
    },
    {
        title: "Social and Intelligent Robotics Research (SIRRL)",
        description:
            "Built games in Python and Flask to assist in speech therapy for children, incorporating a small humanoid robot to help with engagement. Designed and implemented idle motion gestures to enhance human-robot interaction.",
        tags: ["Python", "Flask", "Robotics", "HRI", "Research", "ROS"],
        githubLink: undefined,
        liveLink: undefined,
        date: "January 2025 - April 2025",
    },
    {
        title: "UW Blueprint - Feeding Canadian Kids",
        description:
            "Created a full-stack platform for Feeding Canadian Kids charity, connecting food providers with after-school programs. Built with React frontend and Python (Flask) backend using GraphQL and MongoDB.",
        tags: ["React", "Python", "Flask", "GraphQL", "MongoDB"],
        githubLink: undefined,
        liveLink: undefined,
        date: "April 2023 - September 2024",
    },
    {
        title: "Spotify Music Timer",
        description:
            "A website that creates playlists of a specific length, based on the music in your Spotify account. Programmed using HTML (Bootstrap 4), CSS, Javascript and Spotify's Web API.",
        tags: ["HTML", "CSS", "JavaScript", "Bootstrap", "Spotify API"],
        githubLink: undefined,
        liveLink: "https://colintoft.com/musictimer",
        date: "2023",
    },
    {
        title: "JogRoute",
        description:
            "A website allowing users to create running routes with a specified length and location.",
        tags: ["Web Development"],
        githubLink: undefined,
        liveLink: "https://jogroute.netlify.app",
        date: "2022",
    },
    {
        title: "Remember",
        description:
            "A program that allows for the viewing and creation of events in a single-page view. The list layout allows you to see all upcoming events at a glance, and the sidebar allows you to create new events by simply tapping on the date. Created in Python with Pythonista for iOS.",
        tags: ["Python", "Pythonista", "iOS"],
        githubLink: "https://github.com/ColinToft/remember",
        liveLink: undefined,
        embedUrl: "https://www.youtube.com/embed/W2Ua6q78pWw",
        date: "2021",
    },
    {
        title: "ZIR Compiler (Work in Progress)",
        description:
            "A custom compiler for a C-like programming language, inspired by the LLVM project.",
        tags: ["Compiler", "C-like", "LLVM"],
        githubLink: "https://github.com/ColinToft/ZIR-Compiler",
        liveLink: undefined,
        date: "2021 - Present",
    },
    {
        title: "Shape Sprint",
        description:
            "A Geometry Dash clone created in Java and Swing.",
        tags: ["Java", "Swing", "Game Development"],
        githubLink: "https://github.com/ColinToft/shapesprint",
        liveLink:
            "https://www.dropbox.com/s/79bq4utsyhm7ocf/ShapeSprint.jar?dl=0",
        embedUrl: "https://www.youtube.com/embed/aXmeX1_r5tk",
        date: "2020",
    },
    {
        title: "Middle C",
        description:
            "Acoustic and electronic music. My most recent project is an electronic album called Continuum, now released on streaming services.",
        tags: ["Music Production", "Electronic Music"],
        githubLink: undefined,
        liveLink: "https://www.youtube.com/channel/UCBGu6kMfz043zo7lzN4oUzQ",
        embedUrl:
            "https://www.youtube.com/embed/videoseries?list=PLZ6QsGiOiHMui2urao_Uk0zVsF6CyJEtc",
        date: "2019 - Present",
    },
];

// Define the structure for position data
interface Position {
    x: number;
    y: number;
}

const Projects = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    // Ref for the grid container
    const containerRef = useRef<HTMLDivElement>(null);
    // Refs for individual card elements (or wrappers)
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    // State to store calculated center positions of grid cells
    const [cardPositions, setCardPositions] = useState<Position[]>([]);
    // State for grid columns and dimensions
    const [gridInfo, setGridInfo] = useState({ cols: 3, width: 0, height: 0 });
    // State for dynamic offsets
    const [cardOffsets, setCardOffsets] = useState<Position[]>([]);

    // Ensure cardRefs array has the correct size
    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, projectsData.length);
    }, []);

    const selectedProject =
        selectedId !== null ? projectsData[selectedId] : null;

    // --- Function to calculate grid cell positions (to be implemented) ---
    const calculatePositions = useCallback(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const containerWidth = container.offsetWidth;

        // Determine columns based on Tailwind breakpoints (approximate)
        let cols = 1;
        if (containerWidth >= 1024) {
            // lg
            cols = 2; // Change from 3 to 2 for lg breakpoint
        } else if (containerWidth >= 768) {
            // md
            cols = 2;
        }
        setGridInfo({
            cols,
            width: containerWidth,
            height: container.offsetHeight,
        });

        const minMargin = 50; // Minimum margin between cards in pixels
        const offsetXPercentage = 0.5; // Allows +/- 50% of cell width
        const offsetYPercentage = 0.2; // Allows +/- 20% of cell width

        // Helper function to check if a position maintains minimum margin with existing cards
        const isValidPosition = (
            basePos: Position,
            newOffset: Position,
            existingPositions: { basePos: Position; offset: Position }[],
            cardRect: DOMRect
        ): boolean => {
            // Calculate the boundaries of the new card using actual dimensions
            const newLeft = basePos.x + newOffset.x - cardRect.width / 2;
            const newRight = basePos.x + newOffset.x + cardRect.width / 2;
            const newTop = basePos.y + newOffset.y - cardRect.height / 2;
            const newBottom = basePos.y + newOffset.y + cardRect.height / 2;

            // Check against all existing card positions
            return existingPositions.every(
                ({ basePos: existingBase, offset: existingOffset }) => {
                    // Calculate the boundaries of the existing card
                    const existingLeft =
                        existingBase.x + existingOffset.x - cardRect.width / 2;
                    const existingRight =
                        existingBase.x + existingOffset.x + cardRect.width / 2;
                    const existingTop =
                        existingBase.y + existingOffset.y - cardRect.height / 2;
                    const existingBottom =
                        existingBase.y + existingOffset.y + cardRect.height / 2;

                    // Check if the cards are too close horizontally or vertically
                    const horizontalOverlap = !(
                        newRight + minMargin < existingLeft ||
                        newLeft > existingRight + minMargin
                    );
                    const verticalOverlap = !(
                        newBottom + minMargin < existingTop ||
                        newTop > existingBottom + minMargin
                    );

                    // Return true if there's enough margin (no overlap considering minMargin)
                    return !(horizontalOverlap && verticalOverlap);
                }
            );
        };

        // Generate new offsets with collision avoidance
        const newOffsets: Position[] = [];
        const cardElements = cardRefs.current.filter(
            (ref) => ref !== null
        ) as HTMLDivElement[];

        if (
            cardElements.length === 0 ||
            cardElements.length !== projectsData.length
        ) {
            // If we don't have refs yet, wait for next render
            setCardOffsets([]);
            setCardPositions([]);
            return;
        }

        // Get the first card's dimensions to use as reference
        const cardRect = cardElements[0].getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate base positions from actual card positions
        const basePositions: Position[] = cardElements.map((card) => {
            const rect = card.getBoundingClientRect();
            return {
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top + rect.height / 2,
            };
        });

        // Generate offsets with collision avoidance
        for (let i = 0; i < projectsData.length; i++) {
            const basePos = basePositions[i];
            let validOffsetFound = false;
            let attempts = 0;
            const maxAttempts = 50;

            while (!validOffsetFound && attempts < maxAttempts) {
                const candidateOffset = {
                    x:
                        (((Math.random() - 0.5) * containerWidth) / cols) *
                        offsetXPercentage,
                    y:
                        (((Math.random() - 0.5) * containerWidth) / cols) *
                        offsetYPercentage,
                };

                if (
                    isValidPosition(
                        basePos,
                        candidateOffset,
                        basePositions.slice(0, i).map((pos, idx) => ({
                            basePos: pos,
                            offset: newOffsets[idx],
                        })),
                        cardRect
                    )
                ) {
                    newOffsets.push(candidateOffset);
                    validOffsetFound = true;
                }

                attempts++;
            }

            // If no valid position found after max attempts, use minimal offset
            if (!validOffsetFound) {
                newOffsets.push({ x: 0, y: 0 });
            }
        }

        setCardOffsets(newOffsets);
        setCardPositions(basePositions);
    }, [projectsData.length]); // Dependency: length of projects

    // Set mounted state after initial render on client
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Run position calculation on mount and resize
    useEffect(() => {
        calculatePositions(); // Initial calculation

        const resizeObserver = new ResizeObserver(() => {
            calculatePositions(); // Recalculate on resize
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect(); // Cleanup observer
        };
    }, [calculatePositions]);

    // --- Component for rendering lines ---
    interface LineProps {
        start: Position;
        end: Position;
    }
    const Line: React.FC<LineProps> = ({ start, end }) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI); // angle in degrees

        // Style for the line div
        const lineStyle: React.CSSProperties = {
            position: "absolute",
            left: `${start.x}px`, // Start the line at the start point
            top: `${start.y}px`,
            width: `${distance}px`, // Length of the line
            height: "1px", // Thickness of the line
            backgroundColor: "rgba(165, 243, 252, 0.4)", // Light cyan, semi-transparent
            transformOrigin: "left center", // Rotate around the starting point
            transform: `rotate(${angle}deg)`,
            zIndex: -1, // Ensure lines are behind cards if needed (though container is separate)
            filter: "drop-shadow(0 0 3px rgba(165, 243, 252, 0.6))", // Glow effect
        };

        return <div style={lineStyle} />;
    };

    // --- Logic to determine which lines to draw ---
    const linesToDraw = useMemo(() => {
        const lines: LineProps[] = [];
        // Ensure both positions and offsets are calculated
        if (
            cardPositions.length === 0 ||
            cardOffsets.length === 0 ||
            gridInfo.cols === 0
        )
            return lines;
        if (
            cardPositions.length !== cardOffsets.length ||
            cardPositions.length !== projectsData.length
        )
            return lines;

        const { cols } = gridInfo;

        for (let i = 0; i < projectsData.length; i++) {
            const currentPos = cardPositions[i];
            // Apply offset unless this is the selected card
            const currentOffset =
                selectedId === i ? { x: 0, y: 0 } : cardOffsets[i];
            if (!currentPos || !currentOffset) continue;

            const startPos: Position = {
                x: currentPos.x + currentOffset.x,
                y: currentPos.y + currentOffset.y,
            };

            const currentRow = Math.floor(i / cols);
            const currentCol = i % cols;

            // Connect horizontally (if not last in row)
            const rightNeighborIndex = i + 1;
            if (
                currentCol < cols - 1 &&
                rightNeighborIndex < projectsData.length
            ) {
                const rightPos = cardPositions[rightNeighborIndex];
                // Apply offset unless this is the selected card
                const rightOffset =
                    selectedId === rightNeighborIndex
                        ? { x: 0, y: 0 }
                        : cardOffsets[rightNeighborIndex];
                if (rightPos && rightOffset) {
                    const endPos: Position = {
                        x: rightPos.x + rightOffset.x,
                        y: rightPos.y + rightOffset.y,
                    };
                    lines.push({ start: startPos, end: endPos });
                }
            }

            // Connect vertically (if not last row)
            const belowNeighborIndex = i + cols;
            if (belowNeighborIndex < projectsData.length) {
                const belowPos = cardPositions[belowNeighborIndex];
                // Apply offset unless this is the selected card
                const belowOffset =
                    selectedId === belowNeighborIndex
                        ? { x: 0, y: 0 }
                        : cardOffsets[belowNeighborIndex];
                if (belowPos && belowOffset) {
                    const endPos: Position = {
                        x: belowPos.x + belowOffset.x,
                        y: belowPos.y + belowOffset.y,
                    };
                    lines.push({ start: startPos, end: endPos });
                }
            }
        }
        return lines;
    }, [
        cardPositions,
        cardOffsets,
        gridInfo.cols,
        projectsData.length,
        selectedId,
    ]); // Add selectedId to dependencies

    return (
        <>
            <section
                className='relative w-full min-h-screen mx-auto flex flex-col items-center justify-center py-16 px-8 md:px-16'
                aria-hidden={selectedId !== null}
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    className='text-center mb-12'
                >
                    <h2 className='font-serif text-5xl md:text-6xl font-bold text-white mb-4'>
                        Projects
                    </h2>
                </motion.div>

                {/* Grid Container - Add ref and relative positioning */}
                <div
                    ref={containerRef}
                    className='relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-24 max-w-6xl w-full'
                >
                    {/* Absolute container for lines - behind cards */}
                    <div className='absolute inset-0 pointer-events-none overflow-hidden z-0'>
                        {/* Render lines here */}
                        {linesToDraw.map(({ start, end }) => (
                            <Line
                                key={`${start.x}-${start.y}-${end.x}-${end.y}`}
                                start={start}
                                end={end}
                            />
                        ))}
                    </div>

                    {projectsData.map((project, index) => (
                        // Wrapper div to attach ref for position calculation
                        <div
                            key={`card-wrapper-${index}`}
                            ref={(el) => {
                                cardRefs.current[index] = el;
                            }}
                            className='max-w-sm mx-auto'
                            style={{
                                // Keep offset on non-selected cards, remove it only from the selected card
                                transform:
                                    isMounted &&
                                    (selectedId === null ||
                                        selectedId !== index)
                                        ? `translate(${cardOffsets[index]?.x}px, ${cardOffsets[index]?.y}px)`
                                        : "none",
                                transition: "transform 0.3s ease-out", // Smooth transition for offset
                            }}
                        >
                            <ProjectCard
                                {...project}
                                index={index}
                                layoutId={`card-container-${index}`}
                                onClick={() => setSelectedId(index)}
                                // No direct style prop needed on ProjectCard itself now
                            />
                        </div>
                    ))}
                </div>
            </section>

            <AnimatePresence>
                {selectedId !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className='fixed inset-0 w-full h-full bg-black/50 backdrop-blur-sm pointer-events-none z-40'
                        aria-hidden='true'
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedProject && selectedId !== null && (
                    <motion.div
                        className='fixed inset-0 flex items-center justify-center z-50 p-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedId(null)}
                    >
                        <ProjectCard
                            {...selectedProject}
                            index={selectedId}
                            layoutId={`card-container-${selectedId}`}
                            isExpanded={true}
                            onClose={() => setSelectedId(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Projects;
