import axios from "axios";

export const fetchCryptoPrices = async (ids = ["solana", "ethereum"]) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: ids.join(","),
          vs_currencies: "usd",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching cryptocurrency prices:", error);
    return null;
  }
};
