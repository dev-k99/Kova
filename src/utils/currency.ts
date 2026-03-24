const USD_TO_ZAR = parseFloat(import.meta.env.VITE_USD_TO_ZAR_RATE ?? '18.5');

export const formatCurrency = (amount: number, currency: 'USD' | 'ZAR' = 'USD'): string =>
  new Intl.NumberFormat(currency === 'ZAR' ? 'en-ZA' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

/** Convert a USD price to ZAR and format for display */
export const formatPrice = (usdAmount: number): string =>
  formatCurrency(usdAmount * USD_TO_ZAR, 'ZAR');

export const formatNumber = (num: number): string =>
  new Intl.NumberFormat('en-ZA').format(num);
