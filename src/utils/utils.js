export function transformFirebaseData(data) {
  return data
    ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
    : [];
}

export function formatNumber(
  number,
  decimals = 2,
  includeCurrencySign = false
) {
  if (isNaN(number)) {
    return "Invalid Number";
  }
  const formattedNumber = number
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return includeCurrencySign ? `₱${formattedNumber}` : formattedNumber;
}
