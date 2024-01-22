import { render } from "react-dom";

render(
  <div className="h-64 w-64 m-4">
    <label
      htmlFor="AcceptConditions"
      className="relative block h-4 w-7 cursor-pointer"
    >
      <input id="AcceptConditions" type="checkbox" className="peer sr-only" />

      <span className="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-green-500" />

      <span className="absolute inset-y-0 start-0 m-0.5 h-3 w-3 rounded-full bg-white transition-all peer-checked:start-3" />
    </label>
  </div>,
  document.getElementById("app"),
);
