import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  IconSearch,
  IconUser,
  IconShoppingCart,
  IconBell,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Group,
  Transition,
  Badge,
} from "@mantine/core";
import "@fontsource-variable/lexend";
import logo from "../assets/CampusKatale.png";
import { getImageUrl } from "../utils/imageUtils";
import { useWishlist } from "../context/WishlistContext";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { wishlistItems } = useWishlist();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update search value from URL params when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    setSearchValue(query);
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Navigate to home with search query
      navigate(`/?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      // If search is empty, navigate to home without query
      navigate("/");
    }
  };

  return (
    <>
      <Transition
        mounted
        transition="fade"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <header
            style={styles}
            className={`fixed top-0 left-0 w-full z-50 border-b transition-all font-[Lexend] bg-white border-[#E5E7EB] ${scrolled ? "shadow-sm py-2" : "py-3"}`}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 gap-4">
              {/* Logo Section */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => navigate("/")}
              >
                <img
                  src={getImageUrl(logo)}
                  alt="Campus Katale Logo"
                  className="w-[130px] md:w-[150px] h-auto"
                />
              </div>

              {/* Search Input */}
              <form
                onSubmit={handleSearch}
                className="hidden md:flex flex-1 max-w-2xl"
              >
                <div className="relative w-full flex items-center">
                  <IconSearch size={20} color="#177529" className="absolute left-4" />
                  <input
                    type="text"
                    placeholder="Search essentials, supplies and more..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#177529] bg-white text-[#0C0D19] font-[Lexend]"
                  />
                </div>
              </form>

              {/* Right Section */}
              <Group gap="md">
                {/* Shopping Cart / Wishlist */}
                <ActionIcon
                  variant="transparent"
                  size="lg"
                  className="text-[#177529] cursor-pointer relative"
                  onClick={() => navigate("/wishlist")}
                >
                  <IconShoppingCart size={24} color="#177529" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#97C040] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </ActionIcon>

                {/* Notification Bell */}
                <ActionIcon
                  variant="transparent"
                  size="lg"
                  className="text-[#177529] cursor-pointer relative"
                  onClick={() => navigate("/notifications")}
                >
                  <IconBell size={24} color="#177529" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#97C040] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </ActionIcon>

                {/* User Profile */}
                <ActionIcon
                  variant="transparent"
                  size="lg"
                  className="text-[#177529]"
                  onClick={() => {
                    if (user?.id) {
                      navigate(`/profile/${user.id}`);
                    } else {
                      navigate("/auth");
                    }
                  }}
                >
                  <IconUser size={24} color="#177529" />
                </ActionIcon>
              </Group>
            </div>
          </header>
        )}
      </Transition>
    </>
  );
}
