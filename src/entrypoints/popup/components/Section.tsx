import { cn } from "../cn";

export const Section = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <div className={cn("ml-4 flex flex-col gap-2", className)} {...props} />
);
