import { useEffect, useState } from 'react'
import { Button, ButtonSet, TextInput } from '@carbon/react'

import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { CapacitorShake } from '@capgo/capacitor-shake'

import { CurrentCountry } from './CurrentCountry.js'
import { countryToCurrency } from './location.js'
import { getRates } from './rates.js'
import { Presets } from './Presets.js'

import './Convert.scss'

export const Convert = ({ country, countryCode }) => {
	const [rateLastUpdate, setRateLastUpdate] = useState()
	const [fieldValues, setFieldValues] = useState({})
	const [exchangeRates, setExchangeRates] = useState({})

	const convertGbpToUsd = (gbp) => (gbp / exchangeRates['GBP']).toFixed(2)
	const convertGbpToEur = (gbp) =>
		((exchangeRates['EUR'] * gbp) / exchangeRates['GBP']).toFixed(2)

	const [isClearing, setIsClearing] = useState(false)

	const fetchRates = async () => {
		Haptics.vibrate()
		setIsClearing(true)
		const rates = await getRates()
		console.log('rates', rates)
		setExchangeRates(rates)
		setRateLastUpdate(new Date())
		setTimeout(() => {
			setIsClearing(false)
		}, 500)
	}

	const clearValues = () => {
		Haptics.vibrate()
		setIsClearing(true)
		setFieldValues({})
		setTimeout(() => {
			setIsClearing(false)
		}, 500)
	}

	useEffect(() => {
		fetchRates()
		CapacitorShake.addListener('shake', () => {
			console.log('Shake detected!')
			clearValues()
		})
	}, [])

	const handleSelectAll = (evt) => evt.target.select()

	const handlePreset = (presetValue, currency) => {
		Haptics.impact({ style: ImpactStyle.Light })
		setFieldValues({ [currency]: presetValue })
	}

	const getCurrentValue = (currency) => {
		if (fieldValues[currency] > 0) {
			return fieldValues[currency]
		} else {
			const ref = Object.keys(fieldValues)
			if (ref.length > 0) {
				const refCurr = ref[0]
				const refValue = fieldValues[refCurr]
				const dollars = refValue / exchangeRates[refCurr]
				const targetValue = exchangeRates[currency] * dollars
				console.log(
					`converting ${refValue} ${refCurr} to ${currency} = ${targetValue}`
				)
				return targetValue.toFixed(2)
			}
			return 0
		}
	}

	const getCurrencyRow = (country) => {
		const currency = countryToCurrency(country)
		return (
			<div className="curr-group">
				<span class={`fi fi-${country}`}></span>
				<TextInput
					labelText={currency}
					name={currency}
					type="number"
					size="sm"
					value={getCurrentValue(currency)}
					onClick={handleSelectAll}
					onChange={(evt) => setFieldValues({ [currency]: evt.target.value })}
				/>
				<Presets callbackFn={(preset) => handlePreset(preset, currency)} />
			</div>
		)
	}

	return (
		<div className={`Convert ${isClearing ? 'isClearing' : ''}`}>
			<h4 className="rate-line">
				{Object.keys(exchangeRates).length > 0 && (
					<>
						£1 &nbsp;→&nbsp; €{convertGbpToEur(1)} &nbsp;→&nbsp; $
						{convertGbpToUsd(1)}
					</>
				)}
			</h4>
			{countryCode && (
				<CurrentCountry country={country} countryCode={countryCode}>
					{getCurrencyRow(countryCode)}
				</CurrentCountry>
			)}
			{countryCode !== 'gb' && (
				<CurrentCountry>{getCurrencyRow('gb')}</CurrentCountry>
			)}
			{countryCode !== 'eu' && (
				<CurrentCountry>{getCurrencyRow('eu')}</CurrentCountry>
			)}
			{countryCode !== 'us' && (
				<CurrentCountry>{getCurrencyRow('us')}</CurrentCountry>
			)}
			<ButtonSet>
				<Button
					className="convert-button"
					kind="secondary"
					onClick={() => {
						clearValues()
					}}
				>
					Clear
				</Button>
				<Button
					className="convert-button"
					kind="secondary"
					onClick={() => {
						fetchRates()
					}}
				>
					Get Rates
				</Button>
			</ButtonSet>
			<p className="last-updated">
				Rates last updated: {rateLastUpdate?.toLocaleString()}
			</p>
		</div>
	)
}
