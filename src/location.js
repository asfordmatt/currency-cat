export const __getRegion = (latitude, longitude) => {
	if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
		return 'Unknown'
	}
	if (
		latitude > 49.8 &&
		latitude < 59.5 &&
		longitude > -6.2 &&
		longitude < 1.96
	) {
		return 'UK'
	}
	if (
		latitude > 35.4 &&
		latitude < 70.8 &&
		longitude > -25.8 &&
		longitude < 32.1
	) {
		return 'Europe'
	}
	return 'Rest of World'
}

const EUROZONE = [
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
	'ad',
	'ba',
	'bg',
	'cz',
	'dk',
	'fo',
	'gi',
	'hu',
	'is',
	'li',
	'md',
	'me',
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
export const getLocationInfo = async (latitude, longitude) => {
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
