import * as React from 'react'

type BarProps = {
	key: string,
	color: string,
	height: number
}

export const Bar = ({ key, color, height }: BarProps): null => {
	return null
}

export const isBar = (component: React.ReactComponentElement<any>)
: component is React.ReactComponentElement<typeof Bar> => {
return component.type.name === 'Bar'
}