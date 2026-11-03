export const getRates = async () => {
	const response = await fetch('https://api.frankfurter.dev/v2/rates?base=usd')
	const data = await response.json()

	return data.reduce((acc, item) => {
		acc[item.quote] = item.rate
		return acc
	}, {})
}
// Rates are quoted against USD, so USD itself is always 1
const rateOf = (rates, currency) => (currency === 'USD' ? 1 : rates[currency])

// Convert an amount between currencies; undefined if a rate is unavailable
export const convertAmount = (rates, amount, from, to) => {
	const fromRate = rateOf(rates, from)
	const toRate = rateOf(rates, to)
	if (!fromRate || !toRate) {
		return undefined
	}
	return (amount / fromRate) * toRate
}
