import { useEffect, useState } from 'react'
import { Accordion, AccordionItem, Theme } from '@carbon/react'
import { Capacitor } from '@capacitor/core'
import { Geolocation } from '@capacitor/geolocation'

import { getRegion, getLocationInfo } from './location.js'
import { Convert } from './Convert.js'
import logo from './currencycat.svg'
import './App.scss'

function App() {
	const [currentLocation, setCurrentLocation] = useState()
	const [fullLocation, setFullLocation] = useState()
	const [country, setCountry] = useState()
	const [countryCode, setCountryCode] = useState()

	useEffect(() => {
		Geolocation.getCurrentPosition({
			enableHighAccuracy: false,
			timeout: 30000
		}).then((position) => {
			if (position?.coords) {
				setCurrentLocation(position.coords)
				getLocationInfo(
					position.coords.latitude,
					position.coords.longitude
				).then((loc) => {
					console.log('getLocationInfo', loc)
					if (loc.full) {
						setFullLocation(loc.full)
						setCountry(loc.country)
						setCountryCode(loc.code)
					}
				})
			}
		})
	}, [])

	return (
		<Theme theme="g10">
			<div className="App">
				<header className="App-header">
					<div className="logo-row">
						<img className="App-logo" src={logo} alt="" />
						<h2 className="App-title">Currency Cat</h2>
						<img className="App-logo" src={logo} alt="" />
					</div>

					<br />
					<Convert region={getRegion(countryCode)} />
					<br />
					<Accordion className="app-info">
						<AccordionItem title="App Info">
							<ul>
								<li>Platform: {Capacitor.getPlatform()}</li>
								<li>
									Location: ({currentLocation?.latitude.toFixed(3)},
									{currentLocation?.longitude.toFixed(3)})
								</li>
								<li>Address: {fullLocation}</li>
								<li>Country: {country}</li>
								<li>Region: {getRegion(countryCode)}</li>
							</ul>
						</AccordionItem>
					</Accordion>
				</header>
			</div>
		</Theme>
	)
}

export default App
