import type { TimeValue } from "@/options/schema";

const LENGTH = /^(?:(\d{1,3}):([0-5]\d)|(\d{1,3})):([0-5]\d)$/;

const pad = (value: number) => value.toString().padStart(2, "0");

export const formatDuration = ({ hours, minutes, seconds }: TimeValue) =>
  hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;

export const parseDuration = (text: string): TimeValue | null => {
  const match = LENGTH.exec(text.trim());
  if (!match) return null;

  const [, hours, minutesOfHour, minutesAlone, seconds] = match;
  const minutes = Number(minutesOfHour ?? minutesAlone);

  return {
    hours: Number(hours ?? 0) + Math.floor(minutes / 60),
    minutes: minutes % 60,
    seconds: Number(seconds),
  };
};
