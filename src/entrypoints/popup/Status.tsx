import { useEffect, useState } from "react";
import type { Options } from "@/options/storage";
import { requestStatus, type Status as Value } from "@/status";

const message = (answer: Value | null) => {
  if (!answer) return "Open YouTube to see what is hidden";
  if (!answer.filtered) return "Short videos are not filtered on this page";

  return `On this page: ${answer.hidden} of ${answer.videos} videos hidden`;
};

export const Status = ({ options }: { options: Options }) => {
  const [answer, setAnswer] = useState<Value | null>();

  useEffect(() => {
    let current = true;
    requestStatus(options).then((next) => {
      if (current) setAnswer(next ?? null);
    });

    return () => {
      current = false;
    };
  }, [options]);

  const waiting = answer === undefined;

  return (
    <div className="text-sm text-gray-500">
      {waiting ? "" : message(answer)}
    </div>
  );
};
