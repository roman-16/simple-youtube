import { Options, optionsStorage } from "@/shared";
import { useCallback, useEffect } from "react";
import { createGlobalState } from "react-use";

const useGlobalState = createGlobalState<Options | undefined>(undefined);

const useOptionsStorage = () => {
  const [options, setStateOptions] = useGlobalState();
  const setOptions = useCallback(
    async (newOptions: Parameters<typeof optionsStorage.set>[0]) => {
      await optionsStorage.set(newOptions);

      setStateOptions(await optionsStorage.getAll());
    },
    [setStateOptions],
  );

  useEffect(() => {
    optionsStorage.getAll().then(setStateOptions);
  }, [setStateOptions]);

  const result: [typeof options, typeof setOptions] = [options, setOptions];

  return result;
};

export default useOptionsStorage;
