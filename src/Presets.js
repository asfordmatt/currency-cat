import { IconButton } from '@carbon/react'

import './Presets.scss'

export const Presets = ({ callbackFn }) => {
	return (
		<div className="presets-group">
			<IconButton
				className="preset-button"
				kind="secondary"
				size="sm"
				onClick={() => callbackFn(1)}
			>
				1
			</IconButton>
			<IconButton
				className="preset-button"
				kind="secondary"
				size="sm"
				onClick={() => callbackFn(5)}
			>
				5
			</IconButton>
			<IconButton
				className="preset-button"
				kind="secondary"
				size="sm"
				onClick={() => callbackFn(10)}
			>
				10
			</IconButton>
			<IconButton
				className="preset-button"
				kind="secondary"
				size="sm"
				onClick={() => callbackFn(50)}
			>
				50
			</IconButton>
		</div>
	)
}
