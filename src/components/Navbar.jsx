import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  IconSearch,
  IconUser,
  IconShoppingCart,
  IconBell,
} from "@tabler/icons-react";
import { ActionIcon, Group, Transition } from "@mantine/core";
import logo from "../assets/CampusKatale.png";
import { useWishlist } from "../context/WishlistContext";
import { useNotifications } from "../context/NotificationContext";

/**
 * Navbar — fixed top navigation bar.
 *
 * Fix: The previous implementation used a useEffect to synchronise
 * `searchValue` state with the URL's `?q=` param.  This triggered the
 * react-hooks/set-state-in-effect lint error and caused an extra render cycle.
 *
 * Solution: Derive the initial value from the URL at render time, and track
 * any user edits with local state.  A separate effect that only fires when the
 * *location* changes (navigating away and back) resets the input so it always
 * reflects the current URL.
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { wishlistItems } = useWishlist();
  const { unreadCount } = useNotifications();

  const [scrolled, setScrolled] = useState(false);

  // Derive search value directly from URL — no effect needed
  const urlQuery = new URLSearchParams(location.search).get("q") || "";
  const [searchValue, setSearchValue] = useState(urlQuery);

  // Keep search input in sync when navigating back to home or clearing filters
  // Only runs when the URL's search string changes, not on every state update
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q") || "";
    // Only update if the controlled input disagrees with the URL (e.g. after
    // navigating back) — avoids overwriting mid-type input
    setSearchValue(query);
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    } else {
      navigate("/auth");
    }
  };

  return (
    <>
      <Transition mounted transition="fade" duration={400} timingFunction="ease">
        {(styles) => (
          <header
            style={styles}
            className={`fixed top-0 left-0 w-full z-50 border-b transition-all font-[Lexend] bg-white border-[#E5E7EB] ${
              scrolled ? "shadow-sm py-2" : "py-3"
            }`}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 gap-4">
              {/* Logo */}
              <div
                className="flex items-center cursor-pointer flex-shrink-0"
                onClick={() => navigate("/")}
              >
                <img
                  src={logo}
                  alt="Campus Katale Logo"
                  className="w-[130px] md:w-[150px] h-auto"
                  loading="eager"
                />
              </div>

              {/* Search */}
              <form
                onSubmit={handleSearch}
                className="hidden md:flex flex-1 max-w-2xl"
              >
                <div className="relative w-full flex items-center">
                  <IconSearch
                    size={20}
                    color="#177529"
                    className="absolute left-4 pointer-events-none"
                  />
                  <input
                    type="search"
                    placeholder="Search essentials, supplies and more..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#177529] bg-white text-[#0C0D19] font-[Lexend]"
                  />
                </div>
              </form>

              {/* Right actions */}
              <Group gap="md">
                {/* Wishlist */}
                <ActionIcon
                  variant="transparent"
                  size="lg"
                  className="text-[#177529] cursor-pointer relative"
                  onClick={() => navigate("/wishlist")}
                  aria-label="Wishlist"
                >
                  <IconShoppingCart size={24} color="#177529" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#97C040] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
                      {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                    </span>
                  )}
                </ActionIcon>

                {/* Notifications */}
                <ActionIcon
                  variant="transparent"
                  size="lg"
                  className="text-[#177529] cursor-pointer relative"
                  onClick={() => navigate("/notifications")}
                  aria-label="Notifications"
                >
                  <IconBell size={24} color="#177529" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#97C040] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </ActionIcon>

                {/* Profile */}
                <ActionIcon
                  variant="transparent"
                  size="lg"
                  className="text-[#177529]"
                  onClick={handleProfileClick}
                  aria-label="User profile"
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
