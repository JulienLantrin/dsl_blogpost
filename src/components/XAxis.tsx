import * as React from 'react'

type XAxisProps = {
    key: string,
	thickness: number,
	color: string,
	label: string
}

export const XAxis = (props:XAxisProps): null => {
	return null
}

export const isXAxis = (component: React.ReactComponentElement<any>)
: component is React.ReactComponentElement<typeof XAxis> => {
return component.type.name === 'XAxis'
}