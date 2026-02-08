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
        title: "ZIR Compiler (Work in Progress)",
        description:
            "A custom compiler for a C-like programming language, inspired by the LLVM project.",
        tags: ["Compilers", "C++", "LLVM"],
        githubLink: "https://github.com/ColinToft/ZIR-Compiler",
        liveLink: undefined,
        date: "2023 - Present",
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
    {
        title: "Spotify Music Timer",
        description:
            "A website that creates playlists of a specific length, based on the music in your Spotify account.",
        tags: ["HTML", "CSS", "JavaScript", "Bootstrap", "Spotify API"],
        githubLink: undefined,
        liveLink: "https://colintoft.com/musictimer",
        date: "2022",
    },
];

// --- Define Decorative Stars ---
const numStars = Math.round(projectsData.length * 0.9);
const starsData = Array.from({ length: numStars }, (_, i) => ({
    id: projectsData.length + i,
    type: "star" as const,
}));

const constellationData = [
    ...projectsData.map((p, index) => ({
        ...p,
        type: "project" as const,
        id: index,
    })),
    ...starsData,
];

interface Position {
    x: number;
    y: number;
}

interface CardInfo extends Position {
    width: number;
    height: number;
    id: number;
    type: "project";
}

interface StarInfo extends Position {
    id: number;
    type: "star";
    width: number;
    height: number;
}

type ConstellationItemBase = { id: number; type: "project" | "star" };
type ConstellationItem = (CardInfo | StarInfo) & ConstellationItemBase;

const MOBILE_BREAKPOINT = 768;
// Scale canvas height with project count so we don't hardcode a magic number
const BASE_CANVAS_HEIGHT = Math.max(projectsData.length * 130, 400);

const Projects = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [itemPositions, setItemPositions] = useState<ConstellationItem[]>([]);
    const [containerMinHeight, setContainerMinHeight] = useState(`${BASE_CANVAS_HEIGHT}px`);
    const [positionsReady, setPositionsReady] = useState(false);

    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, projectsData.length);
    }, []);

    const selectedProject =
        selectedId !== null ? projectsData[selectedId] : null;

    const calculatePositions = useCallback(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const containerWidth = container.offsetWidth;
        let currentTargetHeight = Math.max(container.offsetHeight, BASE_CANVAS_HEIGHT);

        const cardElements = cardRefs.current.filter(
            (ref) => ref !== null
        ) as HTMLDivElement[];

        if (
            cardElements.length === 0 ||
            cardElements.length !== projectsData.length
        ) {
            return;
        }

        // Measure actual dimensions for each item
        const actualDimensions = constellationData.map((item, index) => {
            if (item.type === "project") {
                const cardElement = cardElements[item.id];
                if (!cardElement) {
                    console.error(`Missing ref for project ID ${item.id}`);
                    return {
                        id: item.id,
                        type: item.type,
                        width: 0,
                        height: 0,
                    };
                }
                const rect = cardElement.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) {
                    console.warn(
                        `Card ${index} has zero dimensions initially.`
                    );
                }
                return {
                    id: item.id,
                    type: item.type,
                    width: rect.width,
                    height: rect.height,
                };
            } else {
                const starSize = 20;
                return {
                    id: item.id,
                    type: item.type,
                    width: starSize,
                    height: starSize,
                };
            }
        });

        // Use uniform max height for all project cards during placement
        // so we can safely sort/swap positions afterward
        const maxProjectHeight = Math.max(
            ...actualDimensions
                .filter((d) => d.type === "project" && d.height > 0)
                .map((d) => d.height)
        );

        const itemDimensions = actualDimensions.map((d) => ({
            ...d,
            height:
                d.type === "project" && d.height > 0
                    ? maxProjectHeight
                    : d.height,
        }));

        const minMargin = 100;
        const maxAttemptsPerCard = 1500;
        const maxExpansionAttempts = 5;
        const edgePadding = 50;

        const isValidPosition = (
            newItem: ConstellationItem,
            existingItems: ConstellationItem[],
            currentWidth: number,
            currentHeight: number
        ): boolean => {
            const newHalfWidth = newItem.width / 2;
            const newHalfHeight = newItem.height / 2;
            if (
                newItem.x - newHalfWidth < edgePadding ||
                newItem.x + newHalfWidth > currentWidth - edgePadding ||
                newItem.y - newHalfHeight < edgePadding ||
                newItem.y + newHalfHeight > currentHeight - edgePadding
            ) {
                return false;
            }

            const margin = minMargin / 2;
            const newLeft = newItem.x - newHalfWidth - margin;
            const newRight = newItem.x + newHalfWidth + margin;
            const newTop = newItem.y - newHalfHeight - margin;
            const newBottom = newItem.y + newHalfHeight + margin;

            return existingItems.every((existingItem) => {
                const existingHalfWidth = existingItem.width / 2;
                const existingHalfHeight = existingItem.height / 2;
                const existingLeft = existingItem.x - existingHalfWidth;
                const existingRight = existingItem.x + existingHalfWidth;
                const existingTop = existingItem.y - existingHalfHeight;
                const existingBottom = existingItem.y + existingHalfHeight;

                const noOverlap =
                    newLeft >= existingRight ||
                    newRight <= existingLeft ||
                    newTop >= existingBottom ||
                    newBottom <= existingTop;

                return noOverlap;
            });
        };

        const finalPositions: ConstellationItem[] = [];
        let overallPlacementAttempts = 0;
        const maxOverallPlacementAttempts =
            constellationData.length *
            maxAttemptsPerCard *
            maxExpansionAttempts;

        for (let i = 0; i < constellationData.length; i++) {
            const dimensions = itemDimensions[i];
            if (
                !dimensions ||
                (dimensions.type === "project" &&
                    (dimensions.width === 0 || dimensions.height === 0))
            ) {
                continue;
            }

            let validPositionFound = false;
            let cardPlacementAttempts = 0;
            let expansionAttempts = 0;

            while (
                !validPositionFound &&
                expansionAttempts < maxExpansionAttempts &&
                overallPlacementAttempts < maxOverallPlacementAttempts
            ) {
                cardPlacementAttempts = 0;
                while (
                    !validPositionFound &&
                    cardPlacementAttempts < maxAttemptsPerCard
                ) {
                    overallPlacementAttempts++;
                    const candidatePos: ConstellationItem = {
                        x:
                            edgePadding +
                            dimensions.width / 2 +
                            Math.random() *
                                (containerWidth -
                                    2 * edgePadding -
                                    dimensions.width),
                        y:
                            edgePadding +
                            dimensions.height / 2 +
                            Math.random() *
                                Math.max(
                                    0,
                                    currentTargetHeight -
                                        2 * edgePadding -
                                        dimensions.height
                                ),
                        width: dimensions.width,
                        height: dimensions.height,
                        id: dimensions.id,
                        type: dimensions.type,
                    };

                    if (
                        isValidPosition(
                            candidatePos,
                            finalPositions,
                            containerWidth,
                            currentTargetHeight
                        )
                    ) {
                        finalPositions.push(candidatePos);
                        validPositionFound = true;
                        currentTargetHeight = Math.max(
                            currentTargetHeight,
                            candidatePos.y +
                                candidatePos.height / 2 +
                                edgePadding
                        );
                    }
                    cardPlacementAttempts++;
                }

                if (
                    !validPositionFound &&
                    expansionAttempts < maxExpansionAttempts
                ) {
                    expansionAttempts++;
                    const heightIncrease = dimensions.height + minMargin;
                    currentTargetHeight += heightIncrease;
                }
            }

            if (!validPositionFound) {
                const fallbackPos: ConstellationItem = {
                    x: containerWidth / 2 + (Math.random() - 0.5) * 50,
                    y:
                        currentTargetHeight -
                        dimensions.height / 2 -
                        edgePadding,
                    width: dimensions.width,
                    height: dimensions.height,
                    id: dimensions.id,
                    type: dimensions.type,
                };
                if (
                    isValidPosition(
                        fallbackPos,
                        finalPositions,
                        containerWidth,
                        currentTargetHeight
                    )
                ) {
                    finalPositions.push(fallbackPos);
                    currentTargetHeight = Math.max(
                        currentTargetHeight,
                        fallbackPos.y + fallbackPos.height / 2 + edgePadding
                    );
                } else {
                    finalPositions.push(fallbackPos);
                    currentTargetHeight = Math.max(
                        currentTargetHeight,
                        fallbackPos.y + fallbackPos.height / 2 + edgePadding
                    );
                }
            }
        }

        // Sort project positions by y-coordinate and reassign IDs
        // so earlier projects in the data array appear higher visually
        const projectPositions = finalPositions
            .filter((p) => p.type === "project")
            .sort((a, b) => a.y - b.y);

        projectPositions.forEach((pos, sortedIndex) => {
            const actual = actualDimensions.find(
                (d) => d.type === "project" && d.id === sortedIndex
            );
            pos.id = sortedIndex;
            if (actual) {
                pos.width = actual.width;
                pos.height = actual.height;
            }
        });

        let yOffset = 0;
        if (finalPositions.length > 0) {
            const minY = Math.min(
                ...finalPositions.map((p) => p.y - p.height / 2)
            );
            yOffset = Math.max(0, minY - edgePadding);

            if (yOffset > 0) {
                finalPositions.forEach((p) => {
                    p.y -= yOffset;
                });
            }
        }

        let finalCalculatedMinHeight = BASE_CANVAS_HEIGHT;
        if (finalPositions.length > 0) {
            const maxY = Math.max(
                ...finalPositions.map((p) => p.y + p.height / 2)
            );
            finalCalculatedMinHeight = maxY + edgePadding;
        }

        setContainerMinHeight(`${finalCalculatedMinHeight}px`);
        setItemPositions(finalPositions);
        setPositionsReady(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [constellationData.length]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Effect for initial calculation after mount + delay
    useEffect(() => {
        if (!isMounted) return; // Wait until mounted

        // Schedule the first calculation after a delay
        const initialTimer = setTimeout(() => {
            setPositionsReady(false); // Ensure false before starting
            calculatePositions();
        }, 300); // Increased delay (e.g., 300ms)

        return () => {
            clearTimeout(initialTimer);
        }; // Cleanup timer
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]); // Rerun only if isMounted changes (effectively runs once after mount)

    // Effect for handling resize — only react to width changes
    // (height changes are self-inflicted by setContainerMinHeight)
    useEffect(() => {
        if (!containerRef.current) return;

        let lastWidth = containerRef.current.offsetWidth;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            const newWidth = entries[0]?.contentRect.width ?? lastWidth;
            if (Math.abs(newWidth - lastWidth) < 1) return; // Ignore height-only changes
            lastWidth = newWidth;

            setPositionsReady(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            clearTimeout((window as any).__resizeTimeout);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).__resizeTimeout = setTimeout(() => {
                calculatePositions();
            }, 200);
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(containerRef.current);

        return () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            clearTimeout((window as any).__resizeTimeout);
            resizeObserver.disconnect();
        };
    }, [calculatePositions]);

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () =>
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Keyboard accessibility: Escape to close modal + focus management
    useEffect(() => {
        if (selectedId === null) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedId(null);
        };
        document.addEventListener("keydown", handleKeyDown);
        modalRef.current?.focus();
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [selectedId]);

    interface LineProps {
        start: Position;
        end: Position;
    }

    const Line: React.FC<LineProps> = ({ start, end }) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        const lineStyle: React.CSSProperties = {
            position: "absolute",
            left: `${start.x}px`,
            top: `${start.y}px`,
            width: `${distance}px`,
            height: "1px",
            backgroundColor: "rgba(165, 243, 252, 0.3)",
            filter: "drop-shadow(0 0 3px rgba(165, 243, 252, 0.6))",
            transformOrigin: "left center",
            transform: `rotate(${angle}deg)`,
            zIndex: -1,
        };

        return <div style={lineStyle} />;
    };

    const StarNode: React.FC<{
        position: Position;
        size: number;
        isReady: boolean;
    }> = ({ position, size, isReady }) => {
        const starStyle: React.CSSProperties = {
            position: "absolute",
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.7)",
            transform: "translate(-50%, -50%)",
            opacity: isReady ? 1 : 0,
            transition: "opacity 0.6s ease-out",
            zIndex: 0,
        };
        return <div style={starStyle} />;
    };

    const linesToDraw = useMemo(() => {
        const lines: {
            start: Position;
            end: Position;
            connectionKey: string;
        }[] = [];
        if (itemPositions.length < 2) return lines;

        const numNeighbors = 1;
        const drawnConnections = new Set<string>();

        for (let i = 0; i < itemPositions.length; i++) {
            const currentItem = itemPositions[i];

            const neighbors = [];
            for (let j = 0; j < itemPositions.length; j++) {
                if (i === j) continue;
                const otherItem = itemPositions[j];
                neighbors.push({
                    index: j,
                    distance: Math.sqrt(
                        (otherItem.x - currentItem.x) ** 2 +
                            (otherItem.y - currentItem.y) ** 2
                    ),
                });
            }

            neighbors.sort((a, b) => a.distance - b.distance);

            for (let k = 0; k < numNeighbors && k < neighbors.length; k++) {
                const neighborIndex = neighbors[k].index;
                const neighborItem = itemPositions[neighborIndex];

                const connectionKey = [currentItem.id, neighborItem.id]
                    .sort()
                    .join("-");
                if (drawnConnections.has(connectionKey)) continue;

                const startPosCenter: Position = {
                    x: currentItem.x,
                    y: currentItem.y,
                };
                const endPosCenter: Position = {
                    x: neighborItem.x,
                    y: neighborItem.y,
                };

                let startEdge = startPosCenter;
                let endEdge = endPosCenter;

                const dxL = endPosCenter.x - startPosCenter.x;
                const dyL = endPosCenter.y - startPosCenter.y;
                const angleL = Math.atan2(dyL, dxL);

                const intersectPoint = (
                    center: Position,
                    width: number,
                    height: number,
                    angle: number
                ): Position => {
                    const a = width / 2;
                    const b = height / 2;
                    const tanAngle = Math.tan(angle);

                    if (Math.abs(angleL) === Math.PI / 2) {
                        return {
                            x: center.x,
                            y: center.y + Math.sign(dyL) * b,
                        };
                    }

                    const x =
                        (a * b) /
                        Math.sqrt(b * b + a * a * tanAngle * tanAngle);
                    let finalX = x * Math.sign(Math.cos(angle));
                    let finalY = x * tanAngle * Math.sign(Math.cos(angle));

                    finalX = Math.max(-a, Math.min(a, finalX));
                    finalY = Math.max(-b, Math.min(b, finalY));

                    return { x: center.x + finalX, y: center.y + finalY };
                };

                startEdge = intersectPoint(
                    startPosCenter,
                    currentItem.width,
                    currentItem.height,
                    angleL
                );
                endEdge = intersectPoint(
                    endPosCenter,
                    neighborItem.width,
                    neighborItem.height,
                    angleL + Math.PI
                );

                let finalStartEdge = startEdge;
                let finalEndEdge = endEdge;

                if (currentItem.type === "star") {
                    finalStartEdge = startPosCenter;
                }

                if (neighborItem.type === "star") {
                    finalEndEdge = endPosCenter;
                }

                lines.push({
                    start: finalStartEdge,
                    end: finalEndEdge,
                    connectionKey: connectionKey,
                });
                drawnConnections.add(connectionKey);
            }
        }
        return lines;
    }, [itemPositions]);

    return (
        <>
            <section
                className='relative w-full min-h-screen mx-auto flex flex-col items-center justify-start py-16 px-8 md:px-16'
                aria-hidden={selectedId !== null}
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    className='text-center'
                >
                    <h2 className='font-serif text-5xl md:text-6xl font-bold text-white mb-4'>
                        Projects
                    </h2>
                </motion.div>

                {isMobile ? (
                    <div className='flex flex-col gap-6 max-w-xs mx-auto w-full'>
                        {projectsData.map((project, index) => (
                            <motion.div
                                key={`mobile-project-${index}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.05,
                                }}
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <ProjectCard
                                    {...project}
                                    index={index}
                                    layoutId={`card-container-${index}`}
                                    onClick={() => setSelectedId(index)}
                                    isMounted={isMounted}
                                    isSelected={selectedId === index}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div
                        ref={containerRef}
                        className='relative max-w-6xl w-full'
                        style={{ minHeight: containerMinHeight }}
                    >
                        <div
                            className='absolute inset-0 pointer-events-none overflow-hidden z-0'
                            style={{
                                opacity: positionsReady ? 1 : 0,
                                transition: "opacity 0.6s ease-out",
                            }}
                        >
                            {linesToDraw.map(
                                ({ start, end, connectionKey }) => (
                                    <Line
                                        key={connectionKey}
                                        start={start}
                                        end={end}
                                    />
                                )
                            )}
                        </div>

                        {constellationData.map((item) => {
                            const positionInfo = itemPositions.find(
                                (p) => p.id === item.id
                            ) as ConstellationItem | undefined;

                            if (item.type === "star") {
                                if (positionsReady && positionInfo) {
                                    const starPosition = {
                                        x: positionInfo.x,
                                        y: positionInfo.y,
                                    };
                                    const starRenderSize = 8;
                                    return (
                                        <StarNode
                                            key={`item-wrapper-${item.id}`}
                                            position={starPosition}
                                            size={starRenderSize}
                                            isReady={true}
                                        />
                                    );
                                } else {
                                    return null;
                                }
                            } else {
                                const wrapperStyle: React.CSSProperties = {
                                    position: "absolute",
                                    left: positionInfo
                                        ? `${
                                              positionInfo.x -
                                              positionInfo.width / 2
                                          }px`
                                        : "50%",
                                    top: positionInfo
                                        ? `${
                                              positionInfo.y -
                                              positionInfo.height / 2
                                          }px`
                                        : "50%",
                                    width: positionInfo
                                        ? `${positionInfo.width}px`
                                        : "auto",
                                    height: positionInfo
                                        ? `${positionInfo.height}px`
                                        : "auto",
                                    opacity:
                                        positionsReady && positionInfo ? 1 : 0,
                                    transform: !positionInfo
                                        ? "translate(-50%, -50%)"
                                        : "translate(0, 0)",
                                    transition: "opacity 0.6s ease-out",
                                    zIndex: 1,
                                };

                                return (
                                    <div
                                        key={`item-wrapper-${item.id}`}
                                        ref={(el) => {
                                            cardRefs.current[item.id] = el;
                                        }}
                                        style={wrapperStyle}
                                    >
                                        <ProjectCard
                                            {...item}
                                            index={item.id}
                                            layoutId={`card-container-${item.id}`}
                                            onClick={() =>
                                                setSelectedId(item.id)
                                            }
                                            className='w-full h-full max-w-xs'
                                            isMounted={isMounted}
                                            isSelected={
                                                selectedId === item.id
                                            }
                                        />
                                    </div>
                                );
                            }
                        })}
                    </div>
                )}
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
                        ref={modalRef}
                        tabIndex={-1}
                        className='fixed inset-0 flex items-center justify-center z-50 p-4 outline-none'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedId(null)}
                        role='dialog'
                        aria-modal='true'
                        aria-label={selectedProject.title}
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
