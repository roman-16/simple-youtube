import classNames from "classnames";

const Section = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <div
    className={classNames("ml-4 flex flex-col gap-2", className)}
    {...props}
  />
);

export default Section;
