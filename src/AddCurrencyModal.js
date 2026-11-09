import { useState } from 'react'
import {
	Accordion,
	AccordionItem,
	Modal,
	RadioTile,
	TileGroup
} from '@carbon/react'

import { getListByRegion } from './location.js'

import './AddCurrencyModal.scss'

export const AddCurrencyModal = ({ showModal, handleClose }) => {
	const [selectedCurrency, setSelectedCurrency] = useState('')

	const getTile = (item) => (
		<RadioTile
			className="radioTile"
			id={item.countryCode}
			value={item.countryCode}
		>
			<div className="tile">
				<span className={`fi fi-${item.countryCode}`}></span>
				<div className="description">
					<span className="name">{item.countryName}</span>
					<span>{item.currency}</span>
				</div>
			</div>
		</RadioTile>
	)

	return (
		<Modal
			className="AddCurrencyModal"
			aria-label="add currency"
			open={showModal}
			size="lg"
			primaryButtonText="Add"
			secondaryButtonText="Cancel"
			primaryButtonDisabled={!selectedCurrency}
			onRequestClose={() => handleClose()}
			onRequestSubmit={() => handleClose(selectedCurrency)}
		>
			<h3>Add Country / Currency</h3>
			<br />
			<TileGroup
				onChange={(curr) => {
					setSelectedCurrency(curr)
				}}
			>
				<Accordion>
					<AccordionItem title="Europe">
						<div className="country-grid">
							{getListByRegion('europe').map((item) => getTile(item))}
						</div>
					</AccordionItem>
					<AccordionItem title="North America">
						<div className="country-grid">
							{getListByRegion('na').map((item) => getTile(item))}
						</div>
					</AccordionItem>
					<AccordionItem title="South America">
						<div className="country-grid">
							{getListByRegion('sa').map((item) => getTile(item))}
						</div>
					</AccordionItem>
				</Accordion>
			</TileGroup>
		</Modal>
	)
}
