import { getRates } from './rates'

describe('getRates', () => {
	afterEach(() => {
		jest.restoreAllMocks()
	})

	test('calls Frankfurter API and filters rates for USD and EUR', async () => {
		const mockApiResponse = [
			{ date: '2026-09-21', base: 'GBP', quote: 'AUD', rate: 1.95 },
			{ date: '2026-09-21', base: 'GBP', quote: 'USD', rate: 1.3389 },
			{ date: '2026-09-21', base: 'GBP', quote: 'CAD', rate: 1.78 },
			{ date: '2026-09-21', base: 'GBP', quote: 'EUR', rate: 1.1654 }
		]

		global.fetch = jest.fn().mockResolvedValue({
			json: jest.fn().mockResolvedValue(mockApiResponse)
		})

		const rates = await getRates()

		expect(global.fetch).toHaveBeenCalledWith(
			'https://api.frankfurter.dev/v2/rates?base=gbp'
		)
		expect(rates).toEqual({
			USD: 1.3389,
			EUR: 1.1654
		})
	})
})
