import classNames from "classnames";

const Divider = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <div
    className={classNames("h-px flex-1 bg-gray-400", className)}
    {...props}
  />
);

export default Divider;
