export const getRates = async () => {
	const response = await fetch('https://api.frankfurter.dev/v2/rates?base=usd')
	const data = await response.json()

	return data.reduce((acc, item) => {
		acc[item.quote] = item.rate
		return acc
	}, {})
}
