import "@fontsource-variable/lexend";
import { getImageUrl } from "../utils/imageUtils";
import { IconShoppingCart } from "@tabler/icons-react";
import { useWishlist } from "../context/WishlistContext";

function AdCard({ id, image, title, description, badge, buttonText, onButtonClick, price, location }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(id);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    const product = {
      id,
      image,
      title,
      description,
      badge,
      buttonText,
      price,
      location,
    };
    
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl 
      transition-all duration-300 font-[Lexend] border border-transparent 
      hover:border-[#97C040] hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative group">
        <img
          src={getImageUrl(image)}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Subtle overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D19]/40 via-transparent to-transparent opacity-70 rounded-t-2xl"></div>

        {/* Badge */}
        <div className="absolute top-3 left-3 bg-[#F8C810] text-[#0C0D19] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {badge}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col justify-between min-h-[150px]">
        <div>
          <h3 className="text-[#0C0D19] font-semibold text-lg mb-1 line-clamp-1">
            {title}
          </h3>
          <p className="text-[#6B7280] text-sm mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <button
            onClick={onButtonClick}
            className="text-sm font-medium bg-[#177529] hover:bg-[#97C040] text-white 
            px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {buttonText}
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full transition-all ${
              inWishlist
                ? "bg-[#97C040] text-white"
                : "bg-white text-[#177529] hover:bg-[#f0f9f4]"
            }`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <IconShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdCard;
