import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Footer, AdCard } from "../components";
import { useWishlist } from "../context/WishlistContext";
import "@fontsource-variable/lexend";
import { IconShoppingCart } from "@tabler/icons-react";

function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-20 bg-white flex-grow">
        <main className="font-[Lexend] bg-white py-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                 <h1 className="text-2xl md:text-3xl font-bold text-[#0C0D19]">
                  My Wishlist
                </h1>
                {wishlistItems.length > 0 && (
                  <span className="bg-[#177529] text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </div>
              {wishlistItems.length > 0 && (
                <button
                  onClick={clearWishlist}
                  className="text-[#177529] font-medium hover:text-[#97C040] transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {wishlistItems.map((product) => (
                  <AdCard
                    key={product.id}
                    {...product}
                    onButtonClick={() => navigate(`/product/${product.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <IconShoppingCart size={64} color="#E5E7EB" className="mx-auto mb-4" />
                <p className="text-[#6B7280] text-lg mb-2">Your wishlist is empty</p>
                <p className="text-[#6B7280] text-sm mb-6">
                  Start adding items to your wishlist to see them here
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-[#177529] text-white rounded-lg hover:bg-[#135c21] transition-colors font-medium"
                >
                  Browse Products
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Wishlist;
