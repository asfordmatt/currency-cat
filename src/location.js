import { Geolocation } from '@capacitor/geolocation'

// set these to override location info for testing purposes only
const FAKE_COUNTRY = ''
const FAKE_COUNTRY_CODE = ''

const NORTH_AMERICA = ['us', 'ca', 'mx']

const SOUTH_AMERICA = [
	'ar',
	'bo',
	'br',
	'cl',
	'co',
	'ec',
	'fk',
	'gf',
	'gy',
	'py',
	'pe',
	'sr',
	'uy',
	've'
]

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
	// 'el',
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
	// North America
	us: 'USD',
	ca: 'CAD',
	mx: 'MXN',
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
	gs: 'FKP',
	sr: 'SRD',
	uy: 'UYU',
	ve: 'VES'
}

// map 2-letter country code to name (in English)
const COUNTRY_NAMES = {
	// North America
	us: 'United States',
	ca: 'Canada',
	mx: 'Mexico',
	// South America
	ar: 'Argentina',
	bo: 'Bolivia',
	br: 'Brazil',
	cl: 'Chile',
	co: 'Colombia',
	ec: 'Ecuador',
	fk: 'Falkland Islands',
	gf: 'French Guiana',
	gy: 'Guyana',
	py: 'Paraguay',
	pe: 'Peru',
	gs: 'South Georgia and the South Sandwich Islands',
	sr: 'Suriname',
	uy: 'Uruguay',
	ve: 'Venezuela',
	// Europe - Eurozone
	eu: 'European Union',
	ad: 'Andorra',
	at: 'Austria',
	be: 'Belgium',
	bg: 'Bulgaria',
	hr: 'Croatia',
	cy: 'Cyprus',
	ee: 'Estonia',
	fi: 'Finland',
	fr: 'France',
	de: 'Germany',
	gr: 'Greece',
	el: 'Greece',
	ie: 'Ireland',
	it: 'Italy',
	lv: 'Latvia',
	lt: 'Lithuania',
	lu: 'Luxembourg',
	me: 'Montenegro',
	mt: 'Malta',
	nl: 'Netherlands',
	pt: 'Portugal',
	sk: 'Slovakia',
	si: 'Slovenia',
	es: 'Spain',
	mc: 'Monaco',
	va: 'Vatican City',
	sm: 'San Marino',
	// Europe - non-Eurozone
	al: 'Albania',
	ba: 'Bosnia and Herzegovina',
	cz: 'Czech Republic / Czechia',
	dk: 'Denmark',
	fo: 'Faroe Islands',
	gi: 'Gibraltar',
	hu: 'Hungary',
	is: 'Iceland',
	li: 'Liechtenstein',
	md: 'Moldova',
	mk: 'North Macedonia',
	no: 'Norway',
	pl: 'Poland',
	ro: 'Romania',
	ru: 'Russia',
	rs: 'Serbia',
	se: 'Sweden',
	ch: 'Switzerland',
	tr: 'Turkey / Türkiye',
	ua: 'Ukraine'
}

export const getLocation = async () => {
	const position = await Geolocation.getCurrentPosition({
		enableHighAccuracy: false,
		timeout: 30000
	})

	const locInfo = {}
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

export const getListByRegion = (region) => {
	const objForCountry = (country) => {
		return {
			countryCode: country,
			countryName: COUNTRY_NAMES[country],
			currency: countryToCurrency(country)
		}
	}

	const list = []
	if (region === 'europe') {
		EUROZONE.forEach((country) => {
			list.push(objForCountry(country))
		})
		NON_EURO_EX_UK.forEach((country) => {
			list.push(objForCountry(country))
		})
	} else if (region === 'na') {
		NORTH_AMERICA.forEach((country) => {
			list.push(objForCountry(country))
		})
	} else if (region === 'sa') {
		SOUTH_AMERICA.forEach((country) => {
			list.push(objForCountry(country))
		})
	}
	// console.log('list', list)
	return list
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
	} catch (_e) {
		return {}
	}
}
