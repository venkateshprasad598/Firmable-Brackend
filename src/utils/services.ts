import dayjs from "dayjs";

export const convertToUnix = (date: string) => {
  const jsDate = dayjs(date, "YYYYMMDD").valueOf();
  return jsDate;
};

export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
