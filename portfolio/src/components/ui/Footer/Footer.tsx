import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="sticky bottom-0 left-0 right-0 px-4 md:px-6 lg:px-8 backdrop-blur-lg">
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full max-w-[1200px] py-4 px-4 mx-auto">
        {/* Logo / Initials */}
        <p className="tracking-tight font-extrabold text-sm">DC</p>

        {/* Social Icons - Centered */}
        <div className="flex justify-center items-center gap-4">
          <a href="https://github.com/DLC-17" target="_blank" rel="noopener noreferrer">
            <FaGithub className="w-7 h-7 md:w-8 md:h-8 hover:scale-110 transition-transform" />
          </a>
          <a href="https://www.linkedin.com/in/david-coleman17/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="w-7 h-7 md:w-8 md:h-8 hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
