/**
 * BarChart — lightweight SVG-free bar chart for dashboard analytics.
 *
 * Replaces duplicate implementations previously in VendorDashboard.jsx
 * and Profile.jsx.  Both had identical logic but slightly different styling;
 * this single component accepts props for both use cases.
 *
 * Props:
 *   data  - Array of { label: string, value: number }
 *   color - CSS colour string (default: "#177529")
 *   height - bar area height in px (default: 60)
 */
function BarChart({ data = [], color = "#177529", height = 60 }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-1 w-full" style={{ height: height + 24 }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[9px] text-gray-400 font-medium">
            {d.value > 0 ? d.value : ""}
          </span>
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{
              height: `${Math.max((d.value / max) * height, 3)}px`,
              backgroundColor: color,
              opacity: 0.6 + (i / data.length) * 0.4,
            }}
          />
          <span className="text-[9px] text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default BarChart;
