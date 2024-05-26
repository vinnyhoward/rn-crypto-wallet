export const truncateBalance = (balance: string | number) => {
  const balanceStr = balance.toString();
  const [wholePart, decimalPart] = balanceStr.split(".");

  if (!decimalPart) return wholePart;

  const truncatedDecimal = decimalPart.slice(0, 6);

  return wholePart + "." + truncatedDecimal;
};
