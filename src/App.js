import { useEffect, useState } from 'react'
import {
	Accordion,
	AccordionItem,
	IconButton,
	Modal,
	Popover,
	PopoverContent,
	Theme
} from '@carbon/react'
import { BrightnessContrast, Information } from '@carbon/react/icons'
import {
	ThemeSwitcher,
	useThemeSetting
} from '@carbon-labs/react-theme-settings'

import { Capacitor } from '@capacitor/core'

import { getLocation } from './location.js'
import { Convert } from './Convert.js'
import CurrencycatLogo from './CurrencycatLogo.js'
import './App.scss'

function App() {
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [aboutOpen, setAboutOpen] = useState(false)
	const [themeSetting, setThemeSetting] = useState(
		window.localStorage.getItem('currency-cat-theme') || 'system'
	)
	const theme = useThemeSetting(themeSetting, 'g10/g90', false)

	const [locationCoords, setLocationCoords] = useState()
	const [fullLocation, setFullLocation] = useState()
	const [country, setCountry] = useState()
	const [countryCode, setCountryCode] = useState()

	useEffect(() => {
		getLocation().then((locInfo) => {
			console.log('locInfo', locInfo)
			setFullLocation(locInfo.full)
			setCountry(locInfo.country)
			setCountryCode(locInfo.code)
			setLocationCoords(locInfo.coords)
		})
	}, [])

	useEffect(() => {
		console.log('themeSetting', themeSetting)
		window.localStorage.setItem('currency-cat-theme', themeSetting)
	}, [themeSetting])

	return (
		<Theme theme={theme}>
			<div className="App">
				<header className="App-header">
					<div className="header-block">
						<div className="button-row">
							<IconButton
								className="settings-button"
								size="sm"
								label="Information"
								kind="ghost"
								onClick={() => setAboutOpen(!aboutOpen)}
							>
								<Information />
							</IconButton>
							<Popover open={settingsOpen} align="bottom-end">
								<IconButton
									className="settings-button"
									size="sm"
									label="Theme"
									kind="ghost"
									onClick={() => setSettingsOpen(!settingsOpen)}
								>
									<BrightnessContrast />
								</IconButton>
								<PopoverContent>
									<ThemeSwitcher
										onChange={setThemeSetting}
										value={themeSetting}
									/>
								</PopoverContent>
							</Popover>
						</div>

						<div className="logo-row">
							<CurrencycatLogo className="App-logo" alt="" />
							<h2 className="App-title">Currency Cat</h2>
							<CurrencycatLogo className="App-logo" alt="" />
						</div>
					</div>

					<br />
					<Convert country={country} countryCode={countryCode} />
					<br />
					<Modal
						aria-label="About"
						open={aboutOpen}
						primaryButtonText="Close"
						onRequestClose={() => setAboutOpen(false)}
						onRequestSubmit={() => setAboutOpen(false)}
					>
						<h3>Currency Cat</h3>
						<h5>version 0.2.0</h5>
						<br />
						<Accordion className="app-info">
							<AccordionItem title="App Info">
								<ul>
									<li>Platform: {Capacitor.getPlatform()}</li>
									<li>
										Location: ({locationCoords?.latitude.toFixed(3)},
										{locationCoords?.longitude.toFixed(3)})
									</li>
									<li>Address: {fullLocation}</li>
									<li>
										Country: {country} ({countryCode})
									</li>
								</ul>
							</AccordionItem>
						</Accordion>
					</Modal>
				</header>
			</div>
		</Theme>
	)
}

export default App
