import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./design/tokens.css";
import "./design/design.css";
import "./popup.css";

const container = document.getElementById("app");

if (container) createRoot(container).render(<App />);
