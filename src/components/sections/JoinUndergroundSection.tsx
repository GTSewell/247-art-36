
const JoinUndergroundSection = () => {
  // The image provided is 1461x768 (aspect ratio 1461/768 = 1.903)
  return (
    <section className="relative w-full flex justify-center items-center bg-transparent">
      <div className="w-full max-w-7xl mx-auto">
        <img
          src="/lovable-uploads/4ee54cf3-40c1-4def-8aa6-f65d3d8a231e.png"
          alt="EXHIBIT YOUR ARTWORK promo"
          className="w-full h-auto"
          style={{ aspectRatio: "1461/768", display: "block" }}
          draggable={false}
        />
      </div>
    </section>
  );
};

export default JoinUndergroundSection;
