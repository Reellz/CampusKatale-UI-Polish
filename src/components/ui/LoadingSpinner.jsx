/**
 * LoadingSpinner — shared full-page and inline loading indicator.
 *
 * Props:
 *   size  - "sm" | "md" | "lg" (default: "md")
 *   label - optional text shown below the spinner
 *   fullPage - if true, centres in the full viewport height
 */
function LoadingSpinner({ size = "md", label, fullPage = false }) {
  const sizeMap = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-4",
    lg: "w-16 h-16 border-4",
  };

  const spinner = (
    <div className="text-center">
      <div
        className={`${sizeMap[size]} border-t-transparent border-[#177529] rounded-full animate-spin mx-auto`}
      />
      {label && (
        <p className="mt-4 text-[#177529] font-medium text-sm">{label}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB] font-[Lexend]">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex justify-center py-12">
      {spinner}
    </div>
  );
}

export default LoadingSpinner;
