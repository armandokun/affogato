import { EU_COUNTRIES } from "@/constants/pricing";

export const getCurrencyFromCountry = (countryCode: string | undefined) => {
  if (!countryCode) return "usd";

  const isEU = EU_COUNTRIES.includes(countryCode);

  switch (countryCode) {
    case "US":
      return "usd";
    default:
      return isEU ? "eur" : "usd";
  }
};
