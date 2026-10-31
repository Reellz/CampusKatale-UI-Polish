import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdCard, Scroll, Navbar, Footer, Hero, TopCategories } from "../components";
import { strapiGet } from "../lib/api";
import LoadingSpinner from "../components/ui/LoadingSpinner";

/**
 * Home — main product listing page.
 *
 * Handles:
 *   - Product fetching from Strapi (re-fetches when category filter changes)
 *   - Client-side search filtering, price-range filtering, and sorting
 *   - Conditional Hero/TopCategories display (hidden during search/filter)
 *
 * Performance improvements:
 *   - Removed dependency on setProducts in useEffect (was flagged by
 *     react-hooks/set-state-in-effect). Filtering/sorting now runs via useMemo
 *     so it's synchronous and derived from state rather than a side effect.
 *   - STRAPI_URL moved to src/lib/constants.js (single source of truth)
 *   - Images get loading="lazy" attribute
 */
function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL params
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const categoryFilter = params.get("category") || "";
  const searchQuery = params.get("q") || "";
  const hasSearchOrFilter = Boolean(searchQuery || categoryFilter);

  // Fetch products whenever the category filter changes
  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const path = categoryFilter
          ? `/api/products?filters[category][slug][$eq]=${encodeURIComponent(categoryFilter)}&populate=*`
          : "/api/products?populate=*";

        const data = await strapiGet(path);

        if (cancelled) return;

        const formatted = (data.data || []).map((item) => ({
          id: item.id,
          image: item.image?.url || "",
          title: item.title,
          description: item.description || "",
          price: item.price,
          category: item.category?.name || "",
          badge: `UGX ${Number(item.price || 0).toLocaleString()}`,
          buttonText: "View Details",
          productId: item.documentId || item.id,
        }));

        setAllProducts(formatted);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, [categoryFilter]);

  // Derive filtered + sorted products synchronously via useMemo
  // (replaces the useEffect that was calling setProducts — avoiding the
  //  react-hooks/set-state-in-effect lint error and an unnecessary render)
  const products = useMemo(() => {
    let filtered = [...allProducts];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter((p) => {
        const price = p.price || 0;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [allProducts, searchQuery, priceRange, sortBy]);

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleClearFilters = () => {
    setSortBy("relevance");
    setPriceRange({ min: "", max: "" });
    navigate("/");
  };

  if (loading) {
    return <LoadingSpinner fullPage label="Loading products..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F9FAFB] font-[Lexend]">
        <div className="text-center text-[#177529]">
          <p className="text-lg font-semibold mb-2">⚠️ Error</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#177529] text-white rounded-lg hover:bg-[#135c21]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-20 bg-white flex-grow">
        {!hasSearchOrFilter && <Hero />}
        {!hasSearchOrFilter && <TopCategories />}

        <main className="font-[Lexend] bg-white py-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl md:text-2xl font-semibold text-[#0C0D19]">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : categoryFilter
                  ? `Products in ${categoryFilter.replace(/-/g, " ")}`
                  : "Browse Latest Listings"}
              </h1>
              {hasSearchOrFilter ? (
                <button
                  onClick={handleClearFilters}
                  className="text-[#177529] font-medium hover:text-[#97C040] transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <span className="text-[#177529] font-medium">
                  {allProducts.length} listing{allProducts.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Filter bar — shown during search/category mode */}
            {hasSearchOrFilter && (
              <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  {/* Sort */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#0C0D19] mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#177529] bg-white text-[#0C0D19] font-[Lexend]"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>

                  {/* Price range */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#0C0D19] mb-2">
                      Price Range (UGX)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange({ ...priceRange, min: e.target.value })
                        }
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#177529] bg-white text-[#0C0D19] font-[Lexend]"
                        min="0"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange({ ...priceRange, max: e.target.value })
                        }
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#177529] bg-white text-[#0C0D19] font-[Lexend]"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Results count */}
                  <div className="flex items-end">
                    <p className="text-sm text-gray-600">
                      {products.length}{" "}
                      {products.length === 1 ? "product" : "products"} found
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Product grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <AdCard
                    key={product.productId}
                    {...product}
                    onButtonClick={() => handleViewDetails(product.productId)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#6B7280] text-lg mb-2">No products found.</p>
                {searchQuery && (
                  <p className="text-[#6B7280] text-sm">
                    Try a different search term or{" "}
                    <button
                      onClick={handleClearFilters}
                      className="text-[#177529] underline"
                    >
                      clear filters
                    </button>
                    .
                  </p>
                )}
              </div>
            )}
          </div>
        </main>
        <Scroll />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
