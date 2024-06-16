export const formatNumbers = (currency, value) => {
  if (value === "") return "";
  const customNumber = new Intl.NumberFormat(currency).format(value);
  return customNumber?.split(".")?.slice(1, customNumber.split(".").length)
    .length >= 2
    ? `${customNumber?.split(".")?.slice(0, 1)}M`
    : `${customNumber?.split(".")?.slice(0, 1)}K`;
};
