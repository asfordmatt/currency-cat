import './CurrentCountry.scss'

export const CurrentCountry = ({ children, country, countryCode }) => {
	return (
		<fieldset className={`CurrentCountry ${country && 'border'}`}>
			<legend className="legend">
				<span class={`fi fi-${countryCode} ${country && 'border'}`}></span>
				<span class="name">{country}</span>
			</legend>
			{children}
		</fieldset>
	)
}
