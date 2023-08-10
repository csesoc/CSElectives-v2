import Image from "next/image";
import LandingPageContent from "@/components/LandingPageContent/LandingPageContent";

export default async function Home() {
  return (
    <div className="mb-20">
      {/* Navbar */}
      <div className="flex">
        <Image
          src="navbar.svg"
          width={1000}
          height={500}
          alt="landing page graphic"
          layout="responsive"
          priority
        />
      </div>
      {/* Hero Section */}
      <div className="flex flex-row w-full justify-center items-center mt-10">
        <div className="flex flex-row w-5/6 space-y-0 justify-between items-left md:space-y-4 md:flex-col md:items-center">
          <div className="flex flex-col w-full gap-3">
            <p className="drop-shadow-md text-base sm:text-xs">
              CSESoc presents
            </p>
            <p className="justify-center font-bold text-unilectives-blue text-7xl sm:text-4xl">
              uni-lectives
            </p>
            <p className="justify-center font-semibold text-base sm:text-xs">
              Your one-stop shop for UNSW course and elective reviews.
            </p>
          </div>
          <div className="flex items-center">
            <button className="px-5 py-3 rounded-lg bg-unilectives-button items-center drop-shadow justify-center text-white text-xs sm:text-xs">
              Add a Review
            </button>
          </div>
        </div>
      </div>
      {/* Course Section */}
      <div className="flex flex-col justify-center items-center mt-10">
        <LandingPageContent />
      </div>
    </div> 
  );
}
