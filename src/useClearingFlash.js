import { useCallback, useEffect, useRef, useState } from 'react'
import { Haptics } from '@capacitor/haptics'

// Vibrates and flags `isClearing` while `task` runs, then for `duration` ms after
export const useClearingFlash = (duration = 500) => {
	const [isClearing, setIsClearing] = useState(false)
	const timer = useRef()

	useEffect(() => () => clearTimeout(timer.current), [])

	const flash = useCallback(
		async (task) => {
			Haptics.vibrate()
			clearTimeout(timer.current)
			setIsClearing(true)
			try {
				await task?.()
			} finally {
				timer.current = setTimeout(() => setIsClearing(false), duration)
			}
		},
		[duration]
	)

	return [isClearing, flash]
}
