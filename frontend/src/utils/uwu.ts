import Uwuifier from "uwuifier";

declare global {
  var uwuifier: Uwuifier;
}

export const uwuifier = global.uwuifier || new Uwuifier();

export function toUwuOrNotUwu(probability: number) {
  return (text: string, successCallback?: () => void) => {
    if (Math.random() < probability) {
      successCallback?.();
      return uwuifier.uwuifySentence(text);
    } else return text;
  };
}
