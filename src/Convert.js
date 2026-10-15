import { useEffect, useState } from 'react'
import { Button, ButtonSet, TextInput } from '@carbon/react'

import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { CapacitorShake } from '@capgo/capacitor-shake'

import { getRates } from './rates.js'
import { Presets } from './Presets.js'

import './Convert.scss'

export const Convert = ({ region }) => {
	const [rateLastUpdate, setRateLastUpdate] = useState()
	const [gbpUsdRate, setGbpUsdRate] = useState(1.34)
	const [gbpEurRate, setGbpEurRate] = useState(1.17)

	const convertGbpToUsd = (gbp) => (gbp * gbpUsdRate).toFixed(2)
	const convertUsdToGbp = (usd) => (usd / gbpUsdRate).toFixed(2)
	const convertGbpToEur = (gbp) => (gbp * gbpEurRate).toFixed(2)
	const convertEurToGbp = (eur) => (eur / gbpEurRate).toFixed(2)
	const convertEurToUsd = (eur) => ((eur / gbpEurRate) * gbpUsdRate).toFixed(2)
	const convertUsdToEur = (usd) => ((usd / gbpUsdRate) * gbpEurRate).toFixed(2)

	const [gbpValue, setGbpValue] = useState(0)
	const [eurValue, setEurValue] = useState(0)
	const [usdValue, setUsdValue] = useState(0)

	const [isClearing, setIsClearing] = useState(false)

	const fetchRates = async () => {
		Haptics.vibrate()
		setIsClearing(true)
		const rates = await getRates()
		console.log('rates', rates)
		setRateLastUpdate(new Date())
		if (rates?.USD) {
			setGbpUsdRate(rates.USD)
		}
		if (rates?.EUR) {
			setGbpEurRate(rates.EUR)
		}
		setTimeout(() => {
			setIsClearing(false)
		}, 500)
	}

	const clearValues = () => {
		Haptics.vibrate()
		setIsClearing(true)
		setGbpValue(0)
		setUsdValue(0)
		setEurValue(0)
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

	const setGbp = (gbp) => {
		setGbpValue(gbp)
		setUsdValue(0)
		setEurValue(0)
	}

	const setUsd = (usd) => {
		setUsdValue(usd)
		setGbpValue(0)
		setEurValue(0)
	}

	const setEur = (eur) => {
		setEurValue(eur)
		setGbpValue(0)
		setUsdValue(0)
	}

	const handleSelectAll = (evt) => evt.target.select()

	const handlePreset = (preset, currFn) => {
		Haptics.impact({ style: ImpactStyle.Light })
		currFn(preset)
	}

	const CURR1 = (
		<div className="curr-group">
			<span class="fi fi-gb"></span>
			<TextInput
				labelText="GBP £"
				name="GBP"
				type="number"
				size="sm"
				value={
					gbpValue === 0
						? eurValue === 0
							? convertUsdToGbp(usdValue)
							: convertEurToGbp(eurValue)
						: gbpValue
				}
				onClick={handleSelectAll}
				onChange={(evt) => setGbp(evt.target.value)}
			/>
			<Presets callbackFn={(preset) => handlePreset(preset, setGbp)} />
		</div>
	)

	const CURR2 = (
		<div className="curr-group">
			<span class="fi fi-us"></span>
			<TextInput
				labelText="USD $"
				type="number"
				size="sm"
				value={
					usdValue === 0
						? eurValue === 0
							? convertGbpToUsd(gbpValue)
							: convertEurToUsd(eurValue)
						: usdValue
				}
				onClick={handleSelectAll}
				onChange={(evt) => setUsd(evt.target.value)}
			/>
			<Presets callbackFn={(preset) => handlePreset(preset, setUsd)} />
		</div>
	)

	const CURR3 = (
		<div className="curr-group">
			<span class="fi fi-eu"></span>
			<TextInput
				labelText="EUR €"
				type="number"
				size="sm"
				value={
					eurValue === 0
						? gbpValue === 0
							? convertUsdToEur(usdValue)
							: convertGbpToEur(gbpValue)
						: eurValue
				}
				onClick={handleSelectAll}
				onChange={(evt) => setEur(evt.target.value)}
			/>
			<Presets callbackFn={(preset) => handlePreset(preset, setEur)} />
		</div>
	)

	return (
		<div className={`Convert ${isClearing ? 'isClearing' : ''}`}>
			<h4 className="rate-line">
				£1 &nbsp;→&nbsp; €{convertGbpToEur(1)} &nbsp;→&nbsp; $
				{convertGbpToUsd(1)}
			</h4>
			{region === 'UK' && (
				<>
					{CURR1}
					{CURR3}
					{CURR2}
				</>
			)}
			{region === 'Europe' && (
				<>
					{CURR3}
					{CURR2}
					{CURR1}
				</>
			)}
			{region !== 'UK' && region !== 'Europe' && (
				<>
					{CURR2}
					{CURR3}
					{CURR1}
				</>
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
