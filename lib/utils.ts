export function cn(...inputs: (string | boolean | undefined | null | any)[]) {
  return inputs.filter(Boolean).join(" ");
}
