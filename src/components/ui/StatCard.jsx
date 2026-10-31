/**
 * StatCard — shared metric summary card for Profile and VendorDashboard.
 *
 * Replaces duplicate StatCard implementations in both pages.
 *
 * Props:
 *   icon  - React node (emoji string or icon component)
 *   label - metric name
 *   value - metric value (string or number)
 *   sub   - optional secondary line
 *   color - accent colour (default: "#177529")
 */
function StatCard({ icon, label, value, sub, color = "#177529" }) {
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
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default StatCard;
