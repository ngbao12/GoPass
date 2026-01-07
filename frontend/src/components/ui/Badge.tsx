import React from "react";

export type BadgeVariant =
  | "contest"
  | "public"
  | "upcoming"
  | "active"
  | "completed"
  | "default"
  | "success"
  | "info"
  | "warning"
  | "danger";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    contest: "bg-purple-100 text-purple-700 border-purple-200",
    public: "bg-teal-100 text-teal-700 border-teal-200",
    upcoming: "bg-orange-100 text-orange-700 border-orange-200",
    active: "bg-green-100 text-green-700 border-green-200",
    completed: "bg-gray-100 text-gray-700 border-gray-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
    success: "bg-green-100 text-green-700 border-green-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    danger: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
