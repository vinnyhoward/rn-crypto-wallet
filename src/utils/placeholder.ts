export const placeholderArr = (amount: number) =>
  Array.from({ length: amount }, (_, index) => ({ uniqueId: index }));
