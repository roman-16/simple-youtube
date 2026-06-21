import { cn } from "../cn";

export const Divider = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <div className={cn("h-px flex-1 bg-gray-400", className)} {...props} />
);
