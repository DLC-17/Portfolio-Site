export default function AboutMePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        {/* Title on the Left */}
        <h1 className="text-4xl font-bold text-center md:text-left w-full md:w-1/3">
          About Me
        </h1>

        {/* Image & Text on the Right */}
        <div className="flex flex-col items-center w-full md:w-2/3 text-center">
          <img
            src="Profile-photo.jpg"
            alt="Profile Picture"
            className="w-48 h-48 rounded-full mb-4"
          />
          <p className="text-lg max-w-2xl">
            Hi, I'm David, a soon-to-be Saint Mary's College of California alumn with a passion for software development and creating innovative solutions.  
            In my free time, I like to explore new technologies, lift weights, and practice photography.
          </p>
        </div>
      </div>
    </div>
  );
}

