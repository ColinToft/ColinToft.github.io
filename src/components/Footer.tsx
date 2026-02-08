import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className='relative w-full py-12 px-8'>
            <div className='max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4'>
                <span className='text-white/70 text-sm'>
                    &copy; {new Date().getFullYear()} Colin Toft
                </span>
                <div className='flex space-x-6'>
                    <a
                        href='https://www.linkedin.com/in/colintoft'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-white/70 hover:text-white transition-colors'
                        aria-label='LinkedIn'
                    >
                        <FaLinkedin size={20} />
                    </a>
                    <a
                        href='https://github.com/colintoft'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-white/70 hover:text-white transition-colors'
                        aria-label='GitHub'
                    >
                        <FaGithub size={20} />
                    </a>
                    <a
                        href='mailto:cwt1078@gmail.com'
                        className='text-white/70 hover:text-white transition-colors'
                        aria-label='Email'
                    >
                        <FaEnvelope size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
