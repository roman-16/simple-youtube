type SnackbarProps = {
  action: string;
  children: React.ReactNode;
  onAction: () => void;
};

export const Snackbar = ({ action, children, onAction }: SnackbarProps) => (
  <div className="snackbar">
    <span>{children}</span>
    <button type="button" className="button small quiet" onClick={onAction}>
      {action}
    </button>
  </div>
);
