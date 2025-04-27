"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import { motion, AnimatePresence } from "framer-motion";

const projectsData = [
    {
        title: "UW Blueprint - Sistema Toronto",
        description:
            "Creating a platform for registered charity Sistema Toronto, which provides music lessons for students in underserved communities. Built a calendar system for volunteer music teachers and an admin dashboard for managing lessons and absences.",
        tags: ["React", "Python", "Flask", "Full Stack", "TypeScript"],
        githubLink: undefined,
        liveLink: undefined,
        date: "January 2025 - April 2025",
    },
    {
        title: "Social and Intelligent Robotics Research (SIRRL)",
        description:
            "Building games in Python and Flask to assist in speech therapy for children, incorporating a small humanoid robot to help with engagement. Designed and implemented idle motion gestures to enhance human-robot interaction.",
        tags: ["Python", "Flask", "Robotics", "HRI", "Research"],
        githubLink: undefined,
        liveLink: undefined,
        date: "January 2025 - March 2025",
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
            "A simplistic program that allows for the viewing and creation of events in a single-page view. The list layout allows you to see all upcoming events at a glance, and the sidebar allows you to create new events by simply tapping on the date. Created in Python with Pythonista for iOS.",
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
            "A Geometry Dash clone created in Java and Swing as the final project for my grade 11 computer science course.",
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
            "Acoustic and electronic music created during free time. My most recent project is an electronic album called Continuum, now released on streaming services.",
        tags: ["Music Production", "Electronic Music"],
        githubLink: undefined,
        liveLink: "https://www.youtube.com/channel/UCBGu6kMfz043zo7lzN4oUzQ",
        embedUrl:
            "https://www.youtube.com/embed/videoseries?list=PLZ6QsGiOiHMui2urao_Uk0zVsF6CyJEtc",
        date: "2019 - Present",
    },
];

const Projects = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const selectedProject =
        selectedId !== null ? projectsData[selectedId] : null;

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

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full'>
                    {projectsData.map((project, index) => (
                        <ProjectCard
                            key={index}
                            {...project}
                            index={index}
                            layoutId={`card-container-${index}`}
                            onClick={() => setSelectedId(index)}
                        />
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
