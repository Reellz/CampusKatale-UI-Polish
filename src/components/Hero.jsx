import { Carousel } from "@mantine/carousel";
import { Button } from "@mantine/core";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import "@fontsource-variable/lexend";
import bannerImage from "../assets/banner.png";
import { getImageUrl } from "../utils/imageUtils";

function Hero() {
  const autoplay = useRef(Autoplay({ delay: 3000 }));

  const slides = [
    {
      title: "Best Deal of Ssalongo's Lusaniya",
      subtitle: "More Chicken. Less Cabbages.",
      description: "Upto 15% OFF when you buy 2 Lusaniyas",
      buttonText: "Shop Now",
    },
    {
      title: "Best Deal of Ssalongo's Lusaniya",
      subtitle: "More Chicken. Less Cabbages.",
      description: "Upto 15% OFF when you buy 2 Lusaniyas",
      buttonText: "Shop Now",
    },
    {
      title: "Best Deal of Ssalongo's Lusaniya",
      subtitle: "More Chicken. Less Cabbages.",
      description: "Upto 15% OFF when you buy 2 Lusaniyas",
      buttonText: "Shop Now",
    },
  ];

  return (
    <section className="font-[Lexend] bg-[#F9FAFB] py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <Carousel
          withIndicators
          loop
          slideGap="md"
          align="center"
          height="auto"
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          classNames={{
            indicator:
              "w-2.5 h-2.5 transition-all duration-300 bg-[#E5E7EB] data-[active]:bg-[#177529] rounded-full mx-1",
            control:
              "bg-white/90 text-[#177529] hover:bg-[#177529] hover:text-white transition border-0 shadow-lg",
          }}
        >
          {slides.map((slide, index) => (
            <Carousel.Slide key={index}>
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                style={{
                  backgroundImage: `url(${getImageUrl(bannerImage)})`,
                  backgroundSize: "contain",
                  backgroundPosition: "right center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="flex flex-col md:flex-row items-end min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
                  {/* Left Content */}
                  <div className="flex-1 flex items-end justify-start px-6 md:px-12 pb-8 md:pb-12">
                    <div className="text-left max-w-lg">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-3">
                        {slide.title}
                      </h2>
                      <p className="text-lg sm:text-xl md:text-2xl text-[#F8C810] font-medium mb-2">
                        {slide.subtitle}
                      </p>
                      <p className="text-base sm:text-lg md:text-xl text-white mb-6">
                        {slide.description}
                      </p>
                      <Button
                        size="md"
                        radius="xl"
                        className="bg-white text-[#177529] hover:bg-[#F8C810] hover:text-[#0C0D19] font-medium px-6 py-3 transition-all shadow-lg"
                      >
                        {slide.buttonText}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export default Hero;
