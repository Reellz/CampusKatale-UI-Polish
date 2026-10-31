import { getImageUrl } from "../utils/imageUtils";

/**
 * ProductCard — link-based product card variant.
 *
 * Used as an alternative to AdCard when a plain anchor link is needed
 * instead of an onClick handler.  Less commonly used than AdCard.
 *
 * Fix: Removed unused `id` prop destructuring (was causing no-unused-vars error).
 */
function ProductCard({
  image,
  title,
  price,
  location,
  badge,
  buttonText = "View Details",
  href,
  showDiscount = false,
}) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl 
      transition-all duration-300 font-[Lexend] border border-transparent 
      hover:border-[#97C040] hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative group">
        <img
          src={getImageUrl(image)}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {showDiscount && (
          <div className="absolute top-3 right-3 bg-[#97C040] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            20% OFF
          </div>
        )}
        {badge && !showDiscount && (
          <div className="absolute top-3 left-3 bg-[#F8C810] text-[#0C0D19] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col">
        <h3 className="text-[#0C0D19] font-semibold text-base md:text-lg mb-2 line-clamp-1">
          {title}
        </h3>
        {price && (
          <p className="text-[#177529] font-bold text-lg mb-1">{price}</p>
        )}
        {location && (
          <p className="text-[#6B7280] text-sm mb-3">{location}</p>
        )}
        <a
          href={href || "#"}
          className="text-sm font-medium bg-[#177529] hover:bg-[#97C040] text-white 
          px-4 py-2 rounded-xl shadow-sm transition-all text-center"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
}

export default ProductCard;
