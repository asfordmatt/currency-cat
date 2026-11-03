import { useState } from 'react'
import useSWR from 'swr'

import { getRates } from './rates.js'

export const useExchangeRates = () => {
	const [lastUpdated, setLastUpdated] = useState()

	const { data: exchangeRates = {}, mutate } = useSWR('rates', getRates, {
		onSuccess: () => setLastUpdated(new Date())
	})

	return { exchangeRates, lastUpdated, refresh: mutate }
}
