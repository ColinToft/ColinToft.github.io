"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope, FaFileAlt } from "react-icons/fa";
import Image from "next/image";

const About = () => {
    return (
        <section className='relative w-full min-h-screen mx-auto flex items-center justify-center py-16 px-8 md:px-16'>
            <div className='max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-12 items-center'>
                {/* Profile Image */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1.0, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    className='relative w-full h-64 md:h-80 md:col-span-1'
                >
                    <Image
                        src='/images/cover.webp'
                        alt='Profile picture'
                        fill
                        className='object-cover rounded-lg shadow-lg'
                        sizes='(max-width: 768px) 100vw, 33vw'
                        priority
                    />
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    className='md:col-span-2 text-left'
                >
                    <h2 className='font-serif text-4xl md:text-5xl font-bold text-white mb-6'>
                        About Me
                    </h2>
                    <p className='text-slate-100 text-lg mb-4 leading-relaxed font-semibold'>
                        Hi, I'm Colin, a fourth-year computer science student at
                        the University of Waterloo, passionate about building
                        technology for social impact.
                    </p>
                    <p className='text-slate-100 text-lg mb-4 leading-relaxed'>
                        Since I was young, I've loved uncovering how things
                        work. That curiosity led me to software, where I could
                        explore systems and build my own. It also sparked a
                        fascination with compilers, the systems behind software
                        that translate it into machine instructions.
                    </p>
                    <p className='text-slate-100 text-lg mb-6 leading-relaxed'>
                        Recently, I've been diving into AI interpretability and
                        alignment, reading about how models operate and ways to
                        ensure they act for humanity's benefit. This field
                        connects my love of understanding complex systems with
                        the ability to make a real-world difference.
                    </p>
                    <p className='text-slate-100 text-lg mb-6 leading-relaxed'>
                        Outside of school and internships, you can find me
                        developing software for nonprofits at{" "}
                        <a
                            href='https://uwblueprint.org'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-white underline hover:text-slate-300'
                        >
                            UW Blueprint
                        </a>
                        , working on creative projects at{" "}
                        <a
                            href='https://socratica.info'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-white underline hover:text-slate-300'
                        >
                            Socratica
                        </a>
                        ,{" "}
                        <a
                            href='https://www.instagram.com/60minutesofmusic'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-white underline hover:text-slate-300'
                        >
                            writing and producing music
                        </a>
                        , and staying active through running and rock climbing.
                    </p>

                    {/* Social Links */}
                    <div className='flex space-x-6'>
                        <a
                            href='https://www.linkedin.com/in/colintoft'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-slate-400 hover:text-white transition-colors'
                        >
                            <FaLinkedin size={28} />
                        </a>
                        <a
                            href='https://github.com/colintoft'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-slate-400 hover:text-white transition-colors'
                        >
                            <FaGithub size={28} />
                        </a>
                        <a
                            href='mailto:cwt1078@gmail.com'
                            className='text-slate-400 hover:text-white transition-colors'
                        >
                            <FaEnvelope size={28} />
                        </a>
                        <a
                            href='/resume.pdf'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='relative text-slate-400 hover:text-white transition-colors group'
                        >
                            <FaFileAlt size={28} />
                            <span className='absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity'>
                                Resume
                            </span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
