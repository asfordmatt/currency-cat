import { useEffect, useState } from 'react'
import { Accordion, AccordionItem, Theme } from '@carbon/react'
import { Capacitor } from '@capacitor/core'

import { getLocation } from './location.js'
import { Convert } from './Convert.js'
import logo from './currencycat.svg'
import './App.scss'

function App() {
	const [currentLocation, setCurrentLocation] = useState()
	const [fullLocation, setFullLocation] = useState()
	const [country, setCountry] = useState()
	const [countryCode, setCountryCode] = useState()

	useEffect(() => {
		getLocation().then((locInfo) => {
			console.log('locInfo', locInfo)
			setFullLocation(locInfo.full)
			setCountry(locInfo.country)
			setCountryCode(locInfo.code)
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
					<Convert country={country} countryCode={countryCode} />
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
								<li>
									Country: {country} ({countryCode})
								</li>
							</ul>
						</AccordionItem>
					</Accordion>
				</header>
			</div>
		</Theme>
	)
}

export default App
