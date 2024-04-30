/**
 * Converts a number to a formatted dollar amount string.
 * @param amount The number to be formatted.
 * @returns A string representing the formatted dollar amount.
 */
export function formatDollar(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
