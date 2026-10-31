/**
 * EmptyState — shared zero-results / empty-list display.
 *
 * Props:
 *   icon     - React node (icon/emoji)
 *   title    - heading text
 *   message  - supporting text
 *   action   - optional { label: string, onClick: fn } for a CTA button
 */
function EmptyState({ icon, title, message, action }) {
  return (
    <div className="text-center py-16">
      {icon && (
        <div className="flex justify-center mb-4 text-gray-200">
          {icon}
        </div>
      )}
      {title && (
        <p className="text-[#6B7280] text-lg mb-2 font-medium">{title}</p>
      )}
      {message && (
        <p className="text-[#6B7280] text-sm mb-6">{message}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-[#177529] text-white rounded-lg hover:bg-[#135c21] transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
