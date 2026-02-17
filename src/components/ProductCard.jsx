import "@fontsource-variable/lexend";

function ProductCard({ 
  image, 
  title, 
  price,
  location,
  badge, 
  buttonText = "View Details",
  href,
  showDiscount = false,
  id 
}) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl 
      transition-all duration-300 font-[Lexend] border border-transparent 
      hover:border-[#97C040] hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative group">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Discount Badge */}
        {showDiscount && (
          <div className="absolute top-3 right-3 bg-[#97C040] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            20% OFF
          </div>
        )}
        {/* Regular Badge */}
        {badge && !showDiscount && (
          <div className="absolute top-3 left-3 bg-[#F8C810] text-[#0C0D19] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {badge}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col">
        <h3 className="text-[#0C0D19] font-semibold text-base md:text-lg mb-2 line-clamp-1">
          {title}
        </h3>
        
        {/* Price */}
        {price && (
          <p className="text-[#177529] font-bold text-lg mb-1">
            {price}
          </p>
        )}
        
        {/* Location */}
        {location && (
          <p className="text-[#6B7280] text-sm mb-3">
            {location}
          </p>
        )}

        {/* Button */}
        <a
          href={href || `#`}
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