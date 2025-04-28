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
        title: "Idle Motion in Human-Robot Interaction",
        description:
            "Undergraduate research assistantship at the Social and Intelligent Robotics Research Lab (SIRRL). Built games in Python and Flask to assist in speech therapy for children, incorporating a small humanoid robot to help with engagement. Designed and implemented idle motion gestures to enhance human-robot interaction.",
        tags: ["Python", "Flask", "Robotics", "HRI", "Research", "ROS"],
        githubLink: undefined,
        liveLink: undefined,
        date: "January 2025 - April 2025",
    },
    {
        title: "UW Blueprint - Feeding Canadian Kids",
        description:
            "Created a full-stack platform for Feeding Canadian Kids charity, connecting food providers with after-school programs.",
        tags: ["React", "Python", "Flask", "Full Stack", "GraphQL", "MongoDB"],
        githubLink: undefined,
        liveLink: undefined,
        date: "April 2023 - September 2024",
    },
    {
        title: "JogRoute",
        description:
            "A website allowing users to create running routes with a specified length and location.",
        tags: ["Full Stack", "Go", "OpenStreetMap API", "React", "TypeScript"],
        githubLink: "https://github.com/ColinToft/JogRoute",
        liveLink: "https://jogroute.netlify.app",
        date: "2023",
    },
    {
        title: "ZIR Compiler (Work in Progress)",
        description:
            "A custom compiler for a C-like programming language, inspired by the LLVM project.",
        tags: ["Compilers", "C++", "LLVM"],
        githubLink: "https://github.com/ColinToft/ZIR-Compiler",
        liveLink: undefined,
        date: "2023 - Present",
    },
    {
        title: "Spotify Music Timer",
        description:
            "A website that creates playlists of a specific length, based on the music in your Spotify account.",
        tags: ["HTML", "CSS", "JavaScript", "Bootstrap", "Spotify API"],
        githubLink: undefined,
        liveLink: "https://colintoft.com/musictimer",
        date: "2022",
    },
    {
        title: "Remember",
        description:
            "A to-do list app that allows for the viewing and creation of events in a single-page view. The list layout allows you to see all upcoming events at a glance, and the sidebar allows you to create new events by simply tapping on the date.",
        tags: ["Python", "Pythonista", "iOS"],
        githubLink: "https://github.com/ColinToft/remember",
        liveLink: undefined,
        embedUrl: "https://www.youtube.com/embed/W2Ua6q78pWw",
        date: "2021",
    },
    {
        title: "Shape Sprint",
        description: "A Geometry Dash clone.",
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
            "Original acoustic and electronic music. My most recent project is an electronic album called Continuum, now released on streaming services.",
        tags: ["Music Production", "Electronic Music"],
        githubLink: undefined,
        liveLink: "https://www.youtube.com/channel/UCBGu6kMfz043zo7lzN4oUzQ",
        embedUrl:
            "https://www.youtube.com/embed/videoseries?list=PLZ6QsGiOiHMui2urao_Uk0zVsF6CyJEtc",
        date: "2019 - Present",
    },
];

// Stores the x,y coordinates for card positioning
interface Position {
    x: number;
    y: number;
}

// Stores card center position and dimensions
interface CardInfo extends Position {
    width: number;
    height: number;
}

const Projects = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    // Ref for the grid container
    const containerRef = useRef<HTMLDivElement>(null);
    // Refs for individual card elements (or wrappers)
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    // State to store calculated center positions and dimensions of cards
    const [cardPositions, setCardPositions] = useState<CardInfo[]>([]);
    // State for grid columns and dimensions (removed cardWidth, cardHeight)
    const [gridInfo, setGridInfo] = useState({
        cols: 3,
        width: 0,
        height: 0,
        // cardWidth: 0, // Removed
        // cardHeight: 0, // Removed
    });
    // State for dynamic offsets
    const [cardOffsets, setCardOffsets] = useState<Position[]>([]);

    // Ensure cardRefs array has the correct size
    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, projectsData.length);
    }, []);

    const selectedProject =
        selectedId !== null ? projectsData[selectedId] : null;

    // Calculates grid cell positions and offsets for the card layout
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
            // cardWidth: 0, // Removed
            // cardHeight: 0, // Removed
        });

        const minMargin = 50; // Minimum margin between cards in pixels
        const offsetXPercentage = 0.5; // Allows +/- 50% of cell width
        const offsetYPercentage = 0.2; // Allows +/- 20% of cell width

        // Determines if a card position maintains minimum margin with existing cards
        const isValidPosition = (
            basePos: CardInfo, // Changed from Position to CardInfo
            newOffset: Position,
            existingPositions: { basePos: CardInfo; offset: Position }[] // Changed from Position to CardInfo
            // cardRect: DOMRect // Removed - use individual dimensions
        ): boolean => {
            // Calculate the boundaries of the new card using its specific dimensions
            const newLeft = basePos.x + newOffset.x - basePos.width / 2;
            const newRight = basePos.x + newOffset.x + basePos.width / 2;
            const newTop = basePos.y + newOffset.y - basePos.height / 2;
            const newBottom = basePos.y + newOffset.y + basePos.height / 2;

            // Check against all existing card positions
            return existingPositions.every(
                ({ basePos: existingBase, offset: existingOffset }) => {
                    // Calculate the boundaries of the existing card using its specific dimensions
                    const existingLeft =
                        existingBase.x +
                        existingOffset.x -
                        existingBase.width / 2;
                    const existingRight =
                        existingBase.x +
                        existingOffset.x +
                        existingBase.width / 2;
                    const existingTop =
                        existingBase.y +
                        existingOffset.y -
                        existingBase.height / 2;
                    const existingBottom =
                        existingBase.y +
                        existingOffset.y +
                        existingBase.height / 2;

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
        // const cardRect = cardElements[0].getBoundingClientRect(); // Removed - calculate per card
        const containerRect = container.getBoundingClientRect();

        // Calculate base positions AND dimensions from actual card elements
        const basePositions: CardInfo[] = cardElements.map((card) => {
            // Changed to CardInfo[]
            const rect = card.getBoundingClientRect();
            return {
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top + rect.height / 2,
                width: rect.width, // Store width
                height: rect.height, // Store height
            };
        });

        // Update grid info with card dimensions
        // setGridInfo((prev) => ({ // Removed - dimensions stored in cardPositions now
        //     ...prev,
        //     cardWidth: cardRect.width,
        //     cardHeight: cardRect.height,
        // }));

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
                        }))
                        // cardRect // Removed
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
    }, []);

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

    // Renders a connecting line between two cards
    interface LineProps {
        start: Position;
        end: Position;
    }
    const Line: React.FC<LineProps> = ({ start, end }) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Style for the line div
        const lineStyle: React.CSSProperties = {
            position: "absolute",
            left: `${start.x}px`,
            top: `${start.y}px`,
            width: `${distance}px`,
            height: "1px",
            backgroundColor: "rgba(165, 243, 252, 0.4)",
            transformOrigin: "left center",
            transform: `rotate(${angle}deg) translateY(-50%)`, // Added translateY to center the line
            zIndex: -1,
            filter: "drop-shadow(0 0 3px rgba(165, 243, 252, 0.6))",
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
            // gridInfo.cardWidth === 0 || // Removed checks
            // gridInfo.cardHeight === 0
        )
            return lines;

        // const { cols, cardWidth, cardHeight } = gridInfo; // Removed cardWidth, cardHeight
        const { cols } = gridInfo;

        for (let i = 0; i < projectsData.length; i++) {
            const currentCardInfo = cardPositions[i]; // Now contains dimensions
            // ALWAYS use the calculated offset, regardless of selection
            const currentOffset = cardOffsets[i];
            if (!currentCardInfo || !currentOffset) continue;

            const startPosCenter: Position = {
                x: currentCardInfo.x + currentOffset.x,
                y: currentCardInfo.y + currentOffset.y,
            };

            const currentCol = i % cols;

            // Connect horizontally (if not last in row)
            const rightNeighborIndex = i + 1;
            if (
                currentCol < cols - 1 &&
                rightNeighborIndex < projectsData.length
            ) {
                const rightCardInfo = cardPositions[rightNeighborIndex]; // Now contains dimensions
                // ALWAYS use the calculated offset for the neighbor
                const rightOffset = cardOffsets[rightNeighborIndex];
                if (rightCardInfo && rightOffset) {
                    const endPosCenter: Position = {
                        x: rightCardInfo.x + rightOffset.x,
                        y: rightCardInfo.y + rightOffset.y,
                    };

                    // Calculate intersection points for horizontal connection
                    const dxH = endPosCenter.x - startPosCenter.x;
                    const dyH = endPosCenter.y - startPosCenter.y;

                    let startEdge: Position;
                    let endEdge: Position;

                    // Avoid division by zero if centers are vertically aligned
                    if (dxH === 0) {
                        startEdge = {
                            x: startPosCenter.x + currentCardInfo.width / 2,
                            y: startPosCenter.y,
                        };
                        endEdge = {
                            x: endPosCenter.x - rightCardInfo.width / 2,
                            y: endPosCenter.y,
                        };
                    } else {
                        // Calculate t for intersection with start card's right edge
                        const tStart = currentCardInfo.width / 2 / dxH;
                        startEdge = {
                            x: startPosCenter.x + currentCardInfo.width / 2,
                            y: startPosCenter.y + tStart * dyH,
                        };

                        // Calculate t for intersection with end card's left edge
                        const tEnd = (dxH - rightCardInfo.width / 2) / dxH;
                        endEdge = {
                            x: endPosCenter.x - rightCardInfo.width / 2,
                            y: startPosCenter.y + tEnd * dyH, // Use startPosCenter.y as reference
                        };
                    }
                    // Clamp y-coordinates to card boundaries to prevent lines going outside
                    startEdge.y = Math.max(
                        startPosCenter.y - currentCardInfo.height / 2,
                        Math.min(
                            startPosCenter.y + currentCardInfo.height / 2,
                            startEdge.y
                        )
                    );
                    endEdge.y = Math.max(
                        endPosCenter.y - rightCardInfo.height / 2,
                        Math.min(
                            endPosCenter.y + rightCardInfo.height / 2,
                            endEdge.y
                        )
                    );

                    lines.push({ start: startEdge, end: endEdge });
                }
            }

            // Connect vertically (if not last row)
            const belowNeighborIndex = i + cols;
            if (belowNeighborIndex < projectsData.length) {
                const belowCardInfo = cardPositions[belowNeighborIndex]; // Now contains dimensions
                // ALWAYS use the calculated offset for the neighbor
                const belowOffset = cardOffsets[belowNeighborIndex];
                if (belowCardInfo && belowOffset) {
                    const endPosCenter: Position = {
                        x: belowCardInfo.x + belowOffset.x,
                        y: belowCardInfo.y + belowOffset.y,
                    };

                    // Calculate intersection points for vertical connection
                    const dxV = endPosCenter.x - startPosCenter.x;
                    const dyV = endPosCenter.y - startPosCenter.y;

                    let startEdge: Position;
                    let endEdge: Position;

                    // Avoid division by zero if centers are horizontally aligned
                    if (dyV === 0) {
                        startEdge = {
                            x: startPosCenter.x,
                            y: startPosCenter.y + currentCardInfo.height / 2,
                        };
                        endEdge = {
                            x: endPosCenter.x,
                            y: endPosCenter.y - belowCardInfo.height / 2,
                        };
                    } else {
                        // Calculate t for intersection with start card's bottom edge
                        const tStart = currentCardInfo.height / 2 / dyV;
                        startEdge = {
                            x: startPosCenter.x + tStart * dxV,
                            y: startPosCenter.y + currentCardInfo.height / 2,
                        };

                        // Calculate t for intersection with end card's top edge
                        const tEnd = (dyV - belowCardInfo.height / 2) / dyV;
                        endEdge = {
                            x: startPosCenter.x + tEnd * dxV, // Use startPosCenter.x as reference
                            y: endPosCenter.y - belowCardInfo.height / 2,
                        };
                    }

                    // Clamp x-coordinates to card boundaries
                    startEdge.x = Math.max(
                        startPosCenter.x - currentCardInfo.width / 2,
                        Math.min(
                            startPosCenter.x + currentCardInfo.width / 2,
                            startEdge.x
                        )
                    );
                    endEdge.x = Math.max(
                        endPosCenter.x - belowCardInfo.width / 2,
                        Math.min(
                            endPosCenter.x + belowCardInfo.width / 2,
                            endEdge.x
                        )
                    );

                    lines.push({ start: startEdge, end: endEdge });
                }
            }
        }
        return lines;
    }, [cardPositions, cardOffsets, gridInfo.cols]); // Updated dependency array

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
                    className='relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-24 max-w-6xl w-full grid-flow-row-dense items-start'
                >
                    {/* Absolute container for lines - behind cards */}
                    <div className='absolute inset-0 pointer-events-none overflow-hidden z-0'>
                        {linesToDraw.map(({ start, end }) => (
                            <Line
                                key={`${start.x}-${start.y}-${end.x}-${end.y}`}
                                start={start}
                                end={end}
                            />
                        ))}
                    </div>

                    {projectsData.map((project, index) => (
                        // Wrapper div ONLY applies the offset via transform
                        <div
                            key={`project-wrapper-${index}`}
                            style={{
                                transform: `translate(${
                                    // Re-enable transform
                                    cardOffsets[index]?.x || 0
                                }px, ${cardOffsets[index]?.y || 0}px)`,
                                height: "100%",
                                width: "100%",
                            }}
                        >
                            <ProjectCard
                                {...project}
                                ref={(el) => {
                                    cardRefs.current[index] = el;
                                }}
                                index={index}
                                layoutId={`card-container-${index}`}
                                onClick={() => setSelectedId(index)}
                                className='max-w-sm mx-auto h-full'
                                isMounted={isMounted}
                                isSelected={selectedId === index}
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
