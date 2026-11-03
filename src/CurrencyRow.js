import { TextInput } from '@carbon/react'

import { Presets } from './Presets.js'

const handleSelectAll = (evt) => evt.target.select()

export const CurrencyRow = ({
	country,
	currency,
	value,
	onChange,
	onPreset
}) => (
	<div className="curr-group">
		<span className={`fi fi-${country}`}></span>
		<TextInput
			labelText={currency}
			name={currency}
			type="number"
			size="sm"
			value={value}
			onClick={handleSelectAll}
			onChange={(evt) => onChange(evt.target.value)}
		/>
		<Presets callbackFn={onPreset} />
	</div>
)
