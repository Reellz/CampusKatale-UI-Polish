import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fontsource-variable/lexend";
import foodImage from "../assets/food.png";
import { getImageUrl } from "../utils/imageUtils";

const categories = [
  {
    name: "Food",
    image: foodImage,
  },
  {
    name: "Cosmetics",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
  },
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop",
  },
  {
    name: "Furniture",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
  },
  {
    name: "Software",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=200&fit=crop",
  },
  {
    name: "Decor",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
  },
  {
    name: "More",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  },
];

// All categories to display when "View All" is clicked
const allCategories = [
  "Food",
  "Cosmetics",
  "Electronics",
  "Furniture",
  "Software",
  "Decor",
  "Accessories",
  "Groceries",
  "Clothing",
  "Home Essentials",
  "Toys & Games",
  "Sports",
  "Books",
  "Stationery",
  "Health & Beauty",
  "Sports & Outdoors",
];

// Map category names to API category names (dummyjson API categories)
const categoryMap = {
  "Food": "groceries",
  "Cosmetics": "skincare",
  "Electronics": "smartphones",
  "Furniture": "furniture",
  "Software": "laptops",
  "Decor": "home-decoration",
  "Accessories": "womens-jewellery",
  "Groceries": "groceries",
  "Clothing": "mens-shirts",
  "Home Essentials": "home-decoration",
  "Toys & Games": "lighting", // Using lighting as fallback
  "Sports": "automotive", // Using automotive as fallback
  "Books": "lighting", // Using lighting as fallback
  "Stationery": "lighting", // Using lighting as fallback
  "Health & Beauty": "skincare",
  "Sports & Outdoors": "automotive",
  "More": "groceries", // Default fallback
};

function TopCategories() {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const navigate = useNavigate();

  const handleViewAll = (e) => {
    e.preventDefault();
    setShowAllCategories(!showAllCategories);
  };

  const handleCategoryClick = (categoryName) => {
    const apiCategory = categoryMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/?category=${encodeURIComponent(apiCategory)}`);
  };

  return (
    <section className="font-[Lexend] bg-white py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-[#0C0D19]">
            Top Categories
          </h2>
          <button
            onClick={handleViewAll}
            className="text-[#177529] font-medium hover:text-[#97C040] transition-colors"
          >
            {showAllCategories ? "Show Less" : "View All"} &gt;
          </button>
        </div>
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className="flex flex-col items-center gap-2 min-w-[80px] md:min-w-[100px] cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#97C040] transition-colors">
                <img
                  src={getImageUrl(category.image)}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs md:text-sm text-[#0C0D19] font-medium text-center">
                {category.name}
              </span>
            </div>
          ))}
        </div>

        {/* All Categories Grid - shown when "View All" is clicked */}
        {showAllCategories && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg md:text-xl font-semibold text-[#0C0D19] mb-6">
              All Categories
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(category)}
                  className="px-4 py-3 rounded-full bg-white border-2 border-gray-200 hover:border-[#177529] hover:bg-[#f0f9f4] text-[#0C0D19] font-medium text-sm md:text-base transition-all duration-200 hover:scale-105"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TopCategories;

