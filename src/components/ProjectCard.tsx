"use client";

import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { SVGProps } from "react";

interface CloseIconProps extends SVGProps<SVGSVGElement> {}

const CloseIcon: React.FC<CloseIconProps> = (props) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-5 w-5'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        {...props}
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
        />
    </svg>
);

interface ProjectCardProps {
    title: string;
    description: string;
    tags: string[];
    date?: string;
    githubLink?: string;
    liveLink?: string;
    embedUrl?: string;
    index: number;
    layoutId: string;
    onClick?: () => void;
    isExpanded?: boolean;
    onClose?: () => void;
}

// Helper function to get first sentence
const getFirstSentence = (text: string): string => {
    const match = text.match(/^[^.!?]+[.!?]/);
    return match ? match[0].trim() : text;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
    title,
    description,
    tags,
    date,
    githubLink,
    liveLink,
    embedUrl,
    index,
    layoutId,
    onClick,
    isExpanded = false,
    onClose,
}) => {
    const cardContent = (
        <>
            {isExpanded && onClose && (
                <motion.button
                    className='absolute top-2 right-2 text-slate-400 hover:text-white z-10 p-1 rounded-full bg-slate-700/50 hover:bg-slate-600/80 transition-colors'
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    aria-label='Close project details'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                >
                    <CloseIcon />
                </motion.button>
            )}

            <motion.div layout='position' className='flex-grow'>
                <h3 className='font-serif text-2xl font-semibold text-white mb-3'>
                    {title}
                </h3>
                <p className='text-slate-400 mb-4 text-sm leading-relaxed'>
                    {isExpanded ? description : getFirstSentence(description)}
                </p>
                <div className='flex flex-wrap gap-2 mb-4'>
                    {tags.map((tag, i) => (
                        <span
                            key={i}
                            className='text-xs text-sky-300 bg-sky-900/30 px-2 py-1 rounded'
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </motion.div>

            {isExpanded && embedUrl && (
                <motion.div layout='position' className='my-4'>
                    {embedUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                        <img
                            src={embedUrl}
                            alt={`${title} preview`}
                            className='w-full h-auto rounded object-contain max-h-96'
                        />
                    ) : (
                        <div className='aspect-video'>
                            <iframe
                                src={embedUrl}
                                title={`${title} embed`}
                                className='w-full h-full rounded'
                                frameBorder='0'
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                </motion.div>
            )}

            <motion.div
                layout='position'
                transition={{ delay: isExpanded ? 0.1 : 0.05 }}
                className='flex justify-between items-center mt-auto pt-4 border-t border-slate-700/50'
            >
                <span className='text-xs text-slate-500'>{date}</span>
                <div className='flex space-x-4'>
                    {githubLink && githubLink !== "#" && (
                        <a
                            href={githubLink}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-slate-400 hover:text-sky-300 transition-colors'
                            aria-label='GitHub Repository'
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FiGithub size={20} />
                        </a>
                    )}
                    {liveLink && liveLink !== "#" && (
                        <a
                            href={liveLink}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-slate-400 hover:text-sky-300 transition-colors'
                            aria-label='Live Demo'
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FiExternalLink size={20} />
                        </a>
                    )}
                </div>
            </motion.div>
        </>
    );

    const baseClasses = "p-6 rounded-lg flex flex-col relative";
    const gridCardClasses =
        "bg-slate-800/40 backdrop-blur-sm shadow-lg border border-slate-700/50";
    const expandedCardClasses =
        "bg-slate-800/60 backdrop-blur-md shadow-xl border border-slate-700/50 max-w-2xl w-full h-full";

    if (isExpanded) {
        return (
            <motion.div
                layoutId={layoutId}
                className={`${baseClasses} ${expandedCardClasses}`}
                onClick={(e) => e.stopPropagation()}
            >
                {cardContent}
            </motion.div>
        );
    }

    return (
        <div onClick={onClick} className='cursor-pointer'>
            <motion.div
                layoutId={layoutId}
                className={`${baseClasses} ${gridCardClasses}`}
            >
                {cardContent}
            </motion.div>
        </div>
    );
};

export default ProjectCard;
