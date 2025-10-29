export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 pt-24 md:pt-28 bg-center bg-cover relative"
      style={{ backgroundImage: "url('/avatar/hero-bg.gif')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg animate-bounce">
          ExhibitPro
        </h1>
        <br />
        <span className="text-sm bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-medium">
          Enrich your choice, Enrich your life
        </span>
      </div>
    </div>


  );
}
