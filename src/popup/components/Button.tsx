const Button = ({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className="p-1 border border-black rounded transition-all hover:bg-gray-100"
    {...props}
  />
);

export default Button;
