import React, { useState, useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  FaEdit, FaSignOutAlt, FaTrash, FaCheckCircle,
  FaCamera, FaBoxOpen, FaChartBar, FaUser, FaTimes, FaSave,
  FaTag, FaEye, FaShoppingBag
} from "react-icons/fa";
import { Navbar } from "../components";

const STRAPI_URL = "https://campuskatale-fwih.onrender.com";

// ─── Mini bar chart (no external lib) ────────────────────────────────────────
function BarChart({ data, color = "#177529" }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-16 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm transition-all duration-500"
            style={{
              height: `${Math.max((d.value / max) * 56, 4)}px`,
              backgroundColor: color,
              opacity: 0.75 + (i / data.length) * 0.25,
            }}
          />
          <span className="text-[9px] text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#0C0D19]">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Listing card ─────────────────────────────────────────────────────────
function ListingCard({ listing, onEdit, onDelete, onMarkSold }) {
  const attr = listing.attributes;
  const isSold = attr.sold || attr.status === "sold";
  const imageUrl =
    attr.images?.data?.[0]?.attributes?.url
      ? `${STRAPI_URL}${attr.images.data[0].attributes.url}`
      : attr.image?.data?.attributes?.url
      ? `${STRAPI_URL}${attr.image.data.attributes.url}`
      : null;

  return (
    <div
      className={`relative bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
        isSold ? "border-green-200 opacity-80" : "border-gray-100"
      }`}
    >
      {isSold && (
        <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
          Sold
        </div>
      )}
      <div className="h-36 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={attr.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <FaBoxOpen size={32} />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#0C0D19] truncate">{attr.title}</h3>
        <p className="text-[#177529] font-bold text-sm mt-0.5">
          UGX {Number(attr.price).toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(attr.createdAt).toLocaleDateString("en-UG", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </p>
        <div className="flex gap-2 mt-3">
          {!isSold && (
            <button
              onClick={() => onMarkSold(listing.id)}
              className="flex-1 text-xs py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium"
            >
              Mark Sold
            </button>
          )}
          <button
            onClick={() => onEdit(listing.id)}
            className="flex-1 text-xs py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(listing.id)}
            className="text-xs px-2.5 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
          >
            <FaTrash size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Edit Modal ───────────────────────────────────────────────────
function EditProfileModal({ currentUser, clerkUser, onClose, onSave }) {
  const [form, setForm] = useState({
    displayName: currentUser.name,
    bio: currentUser.about,
    phone: currentUser.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update Clerk profile (name)
      if (clerkUser) {
        const [firstName, ...rest] = form.displayName.trim().split(" ");
        await clerkUser.update({
          firstName,
          lastName: rest.join(" ") || undefined,
        });
        // Upload avatar if changed
        if (fileRef.current?.files[0]) {
          await clerkUser.setProfileImage({ file: fileRef.current.files[0] });
        }
      }
      onSave({ ...form, avatar: avatarPreview });
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold text-[#0C0D19] mb-6">Edit Profile</h2>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={avatarPreview || currentUser.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#177529]"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 bg-[#97C040] p-2 rounded-full shadow hover:bg-[#177529] transition"
            >
              <FaCamera className="text-white text-xs" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#97C040] focus:outline-none focus:ring-2 focus:ring-[#177529] text-[#0C0D19]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+256 7XX XXX XXX"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#97C040] focus:outline-none focus:ring-2 focus:ring-[#177529] text-[#0C0D19]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              maxLength={200}
              placeholder="Tell buyers a bit about yourself..."
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#97C040] focus:outline-none focus:ring-2 focus:ring-[#177529] text-[#0C0D19] resize-none"
            />
            <p className="text-xs text-gray-400 text-right">{form.bio.length}/200</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-[#177529] text-white rounded-xl hover:bg-[#135c21] transition font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <FaSave size={13} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Profile Component ────────────────────────────────────────────────
function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileOverrides, setProfileOverrides] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Derived profile ──────────────────────────────────────────────────────
  const profile = {
    name: profileOverrides.displayName || user?.fullName || user?.firstName || "CampusKatale User",
    email: user?.primaryEmailAddress?.emailAddress || "user@example.com",
    avatar: profileOverrides.avatar || user?.imageUrl || "https://via.placeholder.com/150",
    phone: profileOverrides.phone || "",
    about: profileOverrides.bio || "Welcome to CampusKatale! Complete your profile to get started.",
  };

  // ── Fetch listings ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setLoadingListings(true);
    fetch(`${STRAPI_URL}/api/products?filters[clerkUserId][$eq]=${user.id}&populate=*`)
      .then((r) => r.json())
      .then((d) => setListings(d.data || []))
      .catch(console.error)
      .finally(() => setLoadingListings(false));
  }, [user]);

  // ── Fetch orders ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setLoadingOrders(true);
    fetch(`${STRAPI_URL}/api/orders?filters[clerkUserId][$eq]=${user.id}&populate=*`)
      .then((r) => r.json())
      .then((d) => setOrders(d.data || []))
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  }, [user]);

  // ── Derived stats ────────────────────────────────────────────────────────
  const soldListings = listings.filter(
    (l) => l.attributes.sold || l.attributes.status === "sold"
  );
  const activeListings = listings.filter(
    (l) => !l.attributes.sold && l.attributes.status !== "sold"
  );
  const totalRevenue = soldListings.reduce(
    (sum, l) => sum + (Number(l.attributes.price) || 0), 0
  );
  const totalSpent = orders.reduce(
    (sum, o) => sum + (Number(o.attributes.total || o.attributes.amount) || 0), 0
  );

  // ── Chart data: listings per month (last 6 months) ───────────────────────
  const listingsChartData = (() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        label: d.toLocaleString("default", { month: "short" }),
        month: d.getMonth(),
        year: d.getFullYear(),
        value: 0,
      });
    }
    listings.forEach((l) => {
      const d = new Date(l.attributes.createdAt);
      const entry = months.find(
        (m) => m.month === d.getMonth() && m.year === d.getFullYear()
      );
      if (entry) entry.value++;
    });
    return months;
  })();

  const ordersChartData = (() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        label: d.toLocaleString("default", { month: "short" }),
        month: d.getMonth(),
        year: d.getFullYear(),
        value: 0,
      });
    }
    orders.forEach((o) => {
      const d = new Date(o.attributes.createdAt);
      const entry = months.find(
        (m) => m.month === d.getMonth() && m.year === d.getFullYear()
      );
      if (entry) entry.value++;
    });
    return months;
  })();

  // ── Listing actions ───────────────────────────────────────────────────────
  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`${STRAPI_URL}/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setListings((prev) => prev.filter((l) => l.id !== id));
      setDeleteConfirm(null);
    } catch {
      alert("Failed to delete listing. Please try again.");
    }
  };

  const handleMarkSold = async (id) => {
    try {
      const res = await fetch(`${STRAPI_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { sold: true, status: "sold" } }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setListings((prev) =>
        prev.map((l) => (l.id === id ? updated.data : l))
      );
    } catch {
      alert("Failed to update listing. Please try again.");
    }
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: <FaChartBar size={13} /> },
    { key: "listings", label: "My Listings", icon: <FaTag size={13} /> },
    { key: "orders", label: "Orders", icon: <FaShoppingBag size={13} /> },
    { key: "profile", label: "Profile", icon: <FaUser size={13} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F3] font-[Lexend]">
      <Navbar />

      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <div className="bg-[#177529] pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute bottom-0 right-0 bg-[#97C040] p-1.5 rounded-full shadow hover:brightness-110 transition"
            >
              <FaCamera className="text-white text-xs" />
            </button>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{profile.name}</h1>
            <p className="text-green-200 text-sm mt-0.5">{profile.email}</p>
            {profile.phone && (
              <p className="text-green-200 text-sm">{profile.phone}</p>
            )}
            <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
              <FaCheckCircle className="text-[#97C040] text-sm" />
              <span className="text-green-100 text-sm">Verified User</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition backdrop-blur-sm"
            >
              <FaEdit size={12} /> Edit Profile
            </button>
            <button
              onClick={() => signOut(() => navigate("/"))}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition backdrop-blur-sm"
            >
              <FaSignOutAlt size={12} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.key
                  ? "border-[#177529] text-[#177529]"
                  : "border-transparent text-gray-500 hover:text-[#177529]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* OVERVIEW ──────────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<FaTag />} label="Active Listings" value={activeListings.length} color="#177529" />
              <StatCard icon={<FaCheckCircle />} label="Items Sold" value={soldListings.length} color="#97C040" />
              <StatCard
                icon={<FaEye />}
                label="Total Revenue"
                value={`UGX ${(totalRevenue / 1000).toFixed(0)}K`}
                color="#F8C810"
                sub="from sold items"
              />
              <StatCard
                icon={<FaShoppingBag />}
                label="Purchases"
                value={orders.length}
                color="#177529"
                sub={`UGX ${(totalSpent / 1000).toFixed(0)}K spent`}
              />
            </div>

            {/* Charts row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm font-semibold text-[#0C0D19] mb-1">Listings Posted</p>
                <p className="text-xs text-gray-400 mb-4">Last 6 months</p>
                <BarChart data={listingsChartData} color="#177529" />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm font-semibold text-[#0C0D19] mb-1">Orders Made</p>
                <p className="text-xs text-gray-400 mb-4">Last 6 months</p>
                <BarChart data={ordersChartData} color="#97C040" />
              </div>
            </div>

            {/* Recent listings preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-[#0C0D19]">Recent Listings</p>
                <button
                  onClick={() => setActiveTab("listings")}
                  className="text-xs text-[#177529] hover:underline font-medium"
                >
                  View all →
                </button>
              </div>
              {loadingListings ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : listings.length === 0 ? (
                <p className="text-sm text-gray-400">No listings yet.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {listings.slice(0, 4).map((l) => (
                    <div key={l.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#0C0D19]">{l.attributes.title}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(l.attributes.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#177529]">
                          UGX {Number(l.attributes.price).toLocaleString()}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            l.attributes.sold || l.attributes.status === "sold"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {l.attributes.sold || l.attributes.status === "sold" ? "Sold" : "Active"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* LISTINGS ──────────────────────────────────────────────────────── */}
        {activeTab === "listings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0C0D19]">My Listings</h2>
                <p className="text-sm text-gray-500">
                  {activeListings.length} active · {soldListings.length} sold
                </p>
              </div>
              <button
                onClick={() => navigate("/add-listing")}
                className="px-4 py-2 bg-[#177529] text-white rounded-xl text-sm font-semibold hover:bg-[#135c21] transition flex items-center gap-2"
              >
                + Post New Ad
              </button>
            </div>

            {loadingListings ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 h-64 animate-pulse" />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <FaBoxOpen size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No listings yet</p>
                <p className="text-gray-400 text-sm mt-1">Post your first ad to start selling.</p>
                <button
                  onClick={() => navigate("/add-listing")}
                  className="mt-4 px-5 py-2 bg-[#177529] text-white rounded-xl text-sm font-semibold hover:bg-[#135c21] transition"
                >
                  Post an Ad
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onEdit={(id) => navigate(`/edit-listing/${id}`)}
                    onDelete={(id) => setDeleteConfirm(id)}
                    onMarkSold={handleMarkSold}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS ─────────────────────────────────────────────────────────── */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0C0D19]">Purchase History</h2>
              <p className="text-sm text-gray-500">{orders.length} orders · UGX {totalSpent.toLocaleString()} spent</p>
            </div>

            {loadingOrders ? (
              <p className="text-sm text-gray-400">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <FaShoppingBag size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No purchases yet</p>
                <p className="text-gray-400 text-sm mt-1">Browse the marketplace to find items.</p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 px-5 py-2 bg-[#177529] text-white rounded-xl text-sm font-semibold hover:bg-[#135c21] transition"
                >
                  Browse Listings
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                {orders.map((order) => {
                  const attr = order.attributes;
                  return (
                    <div key={order.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-[#0C0D19]">
                          Order #{order.id}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(attr.createdAt).toLocaleDateString("en-UG", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#177529]">
                          UGX {Number(attr.total || attr.amount || 0).toLocaleString()}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            attr.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : attr.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {attr.status || "placed"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PROFILE ────────────────────────────────────────────────────────── */}
        {activeTab === "profile" && (
          <div className="max-w-xl space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#0C0D19]">Profile Details</h2>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-3 py-1.5 bg-[#177529] text-white rounded-lg text-xs font-semibold hover:bg-[#135c21] transition flex items-center gap-1.5"
                >
                  <FaEdit size={10} /> Edit
                </button>
              </div>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#97C040]"
                />
                <div>
                  <p className="font-bold text-[#0C0D19]">{profile.name}</p>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Full Name", value: profile.name },
                  { label: "Email Address", value: profile.email },
                  { label: "Phone Number", value: profile.phone || "Not set" },
                  { label: "Bio", value: profile.about },
                  {
                    label: "Member Since",
                    value: user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-UG", {
                          day: "numeric", month: "long", year: "numeric",
                        })
                      : "—",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-sm text-gray-400 flex-shrink-0">{label}</span>
                    <span className="text-sm font-medium text-[#0C0D19] text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-[#0C0D19] mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/")}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-50 text-sm text-gray-700 transition"
                >
                  ← Back to Home
                </button>
                <button
                  onClick={() => signOut(() => navigate("/"))}
                  className="w-full text-left px-4 py-3 rounded-xl border border-red-100 hover:bg-red-50 text-sm text-red-600 transition flex items-center gap-2"
                >
                  <FaSignOutAlt size={12} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete confirmation dialog ───────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-red-500 text-xl" />
            </div>
            <h3 className="text-lg font-bold text-[#0C0D19] mb-2">Delete Listing?</h3>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. The listing will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteListing(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit profile modal ───────────────────────────────────────────── */}
      {showEditModal && (
        <EditProfileModal
          currentUser={profile}
          clerkUser={user}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => {
            setProfileOverrides((prev) => ({ ...prev, ...updated }));
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}

export default Profile;