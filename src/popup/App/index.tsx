import { Divider } from "@/popup/components";
import Configuration from "./Configuration";
import Presets from "./Presets";

const App = () => (
  <div className="min-w-80 m-4 text-base">
    <Presets />
    <Divider className="my-4" />
    <Configuration />
  </div>
);

export default App;
