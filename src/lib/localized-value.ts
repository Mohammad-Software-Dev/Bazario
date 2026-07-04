export type LocalizedValue =
  | string
  | null
  | undefined
  | {
      en?: string | null;
      ar?: string | null;
    };

export function getLocalizedValue(value: LocalizedValue) {
  if (typeof value === "string") {
    return value;
  }

  if (!value) {
    return "";
  }

  return value.en ?? value.ar ?? "";
}
