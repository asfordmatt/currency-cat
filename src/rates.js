export const getRates = async () => {
	const response = await fetch('https://api.frankfurter.dev/v2/rates?base=gbp')
	const data = await response.json()

	return data
		.filter((item) => item.quote === 'USD' || item.quote === 'EUR')
		.reduce((acc, item) => {
			acc[item.quote] = item.rate
			return acc
		}, {})
}
