import Image from 'next/image';

export default function AboutMePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
        
        {/* Left Side: Title and First Text Block */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2">
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <p className="text-lg max-w-xl">
            Hi, I'm David, a soon-to-be Saint Mary's College of California alumnus with a passion for software development and creating innovative solutions.
          </p>
        </div>

        {/* Image (Positioned between text on small screens, right on larger screens) */}
        <div className="order-2 md:order-none">
          <Image
            src="/Profile-photo.jpg"
            alt="Profile Picture"
            width={180} 
            height={180}
            className="rounded-full"
          />
        </div>

        
        
      </div>
    </div>
  );
}
