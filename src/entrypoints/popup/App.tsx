import { Divider } from "./components";
import { Form } from "./Form";
import { Presets } from "./Presets";
import { Status } from "./Status";
import { useOptions } from "./useOptions";

export const App = () => {
  const [options, update] = useOptions();

  if (!options) return null;

  return (
    <div className="min-w-80 m-4 text-base">
      <Status options={options} />
      <Divider className="my-4" />
      <Presets update={update} />
      <Divider className="my-4" />
      <Form options={options} update={update} />
    </div>
  );
};
