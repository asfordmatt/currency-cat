import { Geolocation } from '@capacitor/geolocation'

// set these to override location info for testing purposes only
const FAKE_COUNTRY = ''
const FAKE_COUNTRY_CODE = ''

// Countries using Euros as their primary currency
const EUROZONE = [
	'eu', // not a country, but included as a special case for the "EU" preset
	'ad',
	'at',
	'be',
	'bg',
	'hr',
	'cy',
	'ee',
	'fi',
	'fr',
	'de',
	'gr',
	'el',
	'ie',
	'it',
	'lv',
	'lt',
	'lu',
	'me',
	'mt',
	'nl',
	'pt',
	'sk',
	'si',
	'es',
	'mc',
	'va',
	'sm'
]

const NON_EURO_EX_UK = [
	'al',
	'ba',
	'cz',
	'dk',
	'fo',
	'gi',
	'hu',
	'is',
	'li',
	'md',
	'mk',
	'no',
	'pl',
	'ro',
	'ru',
	'rs',
	'se',
	'ch',
	'tr',
	'ua'
]

// map 2-letter country code to currency
const CURR_MAP = {
	// Europe excluding Eurozone
	gb: 'GBP',
	al: 'ALL',
	ba: 'BAM',
	cz: 'CZK',
	dk: 'DKK',
	fo: 'DKK',
	gi: 'GIP',
	hu: 'HUF',
	is: 'ISK',
	li: 'CHF',
	md: 'MDL',
	mk: 'MKD',
	no: 'NOK',
	pl: 'PLN',
	ro: 'RON',
	ru: 'RUB',
	rs: 'RSD',
	se: 'SEK',
	ch: 'CHF',
	tr: 'TRY',
	ua: 'UAH',
	// South America
	ar: 'ARS',
	bo: 'BOB',
	br: 'BRL',
	cl: 'CLP',
	co: 'COP',
	ec: 'USD',
	fk: 'FKP',
	gf: 'EUR',
	gy: 'GYD',
	py: 'PYG',
	pe: 'PEN',
	gs: 'GBP',
	sr: 'SRD',
	uy: 'UYU',
	ve: 'VES'
}

export const getLocation = async () => {
	const position = await Geolocation.getCurrentPosition({
		enableHighAccuracy: false,
		timeout: 30000
	})

	let locInfo = {}
	if (position?.coords) {
		locInfo.coords = position.coords
		const loc = await lookupAddress(
			position.coords.latitude,
			position.coords.longitude
		)
		console.log('getLocationInfo', loc)
		locInfo.full = loc.full
		locInfo.country = FAKE_COUNTRY || loc.country
		locInfo.code = FAKE_COUNTRY_CODE || loc.code
		return locInfo
	}
}

export const countryToCurrency = (country_code) => {
	if (EUROZONE.includes(country_code)) {
		return 'EUR'
	} else if (CURR_MAP[country_code]) {
		return CURR_MAP[country_code]
	}
	return 'USD' // default
}

export const getRegion = (country_code) => {
	if (country_code === 'gb') {
		return 'UK'
	} else if (EUROZONE.includes(country_code)) {
		return 'Europe'
	} else if (NON_EURO_EX_UK.includes(country_code)) {
		return 'Europe'
	}
	return 'Rest of World'
}

const lookupAddress = async (latitude, longitude) => {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
		)
		const data = await response.json()
		console.log('data', data)
		return {
			full: data.display_name,
			country: data.address?.country,
			code: data.address?.country_code
		}
	} catch (e) {
		return {}
	}
}
