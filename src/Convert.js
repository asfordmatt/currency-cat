import { useCallback, useEffect, useState } from 'react'
import { Button, ButtonSet } from '@carbon/react'
import { Add, ChartLine, Reset } from '@carbon/react/icons'

import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { CapacitorShake } from '@capgo/capacitor-shake'

import { AddCurrencyModal } from './AddCurrencyModal.js'
import { CurrencyRow } from './CurrencyRow.js'
import { CurrentCountry } from './CurrentCountry.js'
import { countryToCurrency } from './location.js'
import { convertAmount } from './rates.js'
import { useClearingFlash } from './useClearingFlash.js'
import { useExchangeRates } from './useExchangeRates.js'

import './Convert.scss'

const DEFAULT_COUNTRIES = ['gb', 'eu', 'us']

export const Convert = ({ country, countryCode }) => {
	const [fieldValues, setFieldValues] = useState({})
	const [showAddDialog, setShowAddDialog] = useState(false)
	const [extraCurrency, setExtraCurrency] = useState()
	const { exchangeRates, lastUpdated, refresh } = useExchangeRates()
	const [isClearing, flash] = useClearingFlash()

	const fetchRates = () => flash(refresh)

	const clearValues = useCallback(
		() => flash(() => setFieldValues({})),
		[flash]
	)

	useEffect(() => {
		const listener = CapacitorShake.addListener('shake', clearValues)
		return () => {
			listener.then((handle) => handle.remove())
		}
	}, [clearValues])

	const handlePreset = (presetValue, currency) => {
		Haptics.impact({ style: ImpactStyle.Light })
		setFieldValues({ [currency]: presetValue })
	}

	const getCurrentValue = (currency) => {
		// the field being edited shows exactly what was typed, including ''
		if (currency in fieldValues) {
			return fieldValues[currency]
		}
		const [refCurrency] = Object.keys(fieldValues)
		if (refCurrency) {
			const converted = convertAmount(
				exchangeRates,
				fieldValues[refCurrency],
				refCurrency,
				currency
			)
			if (converted !== undefined) {
				return converted.toFixed(2)
			}
		}
		return 0
	}

	const formatGbpTo = (currency) =>
		convertAmount(exchangeRates, 1, 'GBP', currency)?.toFixed(2)

	const renderRow = (rowCountry) => {
		const currency = countryToCurrency(rowCountry)
		return (
			<CurrencyRow
				country={rowCountry}
				currency={currency}
				value={getCurrentValue(currency)}
				onChange={(value) => setFieldValues({ [currency]: value })}
				onPreset={(preset) => handlePreset(preset, currency)}
			/>
		)
	}

	const otherCountries = DEFAULT_COUNTRIES.filter((c) => c !== countryCode)
	if (extraCurrency) {
		otherCountries.push(extraCurrency)
	}
	console.log('otherCountries', otherCountries)

	return (
		<div className={`Convert ${isClearing ? 'isClearing' : ''}`}>
			<h4 className="rate-line">
				{Object.keys(exchangeRates).length > 0 && (
					<>
						£1 &nbsp;→&nbsp; €{formatGbpTo('EUR')} &nbsp;→&nbsp; $
						{formatGbpTo('USD')}
					</>
				)}
			</h4>
			{countryCode && (
				<CurrentCountry country={country} countryCode={countryCode}>
					{renderRow(countryCode)}
				</CurrentCountry>
			)}
			{otherCountries.map((c) => (
				<CurrentCountry key={c}>{renderRow(c)}</CurrentCountry>
			))}
			<br />
			<Button
				className="convert-button"
				kind="secondary"
				renderIcon={Add}
				onClick={() => setShowAddDialog(true)}
			>
				Add Currency
			</Button>
			<br />
			<ButtonSet className="button-set">
				<Button
					className="convert-button"
					kind="secondary"
					renderIcon={Reset}
					onClick={clearValues}
				>
					Clear
				</Button>
				<Button
					className="convert-button"
					kind="secondary"
					renderIcon={ChartLine}
					onClick={fetchRates}
				>
					Get Rates
				</Button>
			</ButtonSet>

			<p className="last-updated">
				Rates last updated: {lastUpdated?.toLocaleString()}
			</p>
			{showAddDialog && (
				<AddCurrencyModal
					showModal={showAddDialog}
					handleClose={(selected) => {
						setShowAddDialog(false)
						console.log('add curr', selected)
						if (selected) {
							setExtraCurrency(selected)
						}
					}}
				></AddCurrencyModal>
			)}
		</div>
	)
}
