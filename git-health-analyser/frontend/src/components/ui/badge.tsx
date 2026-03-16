import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "critical" | "warning" | "info" | "success";
}

const variants: Record<string, string> = {
  default: "bg-muted text-muted-foreground",
  critical: "bg-red-500/15 text-red-400",
  warning: "bg-yellow-500/15 text-yellow-400",
  info: "bg-blue-500/15 text-blue-400",
  success: "bg-green-500/15 text-green-400",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
