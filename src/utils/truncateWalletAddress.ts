export const truncateWalletAddress = (
  address: string,
  end: number = 5,
  offset: number = 5
): string => {
  if (!address) return "";
  if (address.length <= end + offset) return address;

  return `${address.slice(0, end)}...${address.slice(-offset)}`;
};
