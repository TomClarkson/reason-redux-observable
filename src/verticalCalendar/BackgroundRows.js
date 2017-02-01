import React, { Component } from 'react';

export default class BackgroundRows extends Component {
	render() {
		var backgroundRowsContainerStyle = {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			flex: 1,
			zIndex: 1
		};
		var { hoursRange, rowHeight } = this.props;
		return (
			<div className="background-rows-wrapper" style={backgroundRowsContainerStyle}>
				{hoursRange.map((hour, i) => 
					<BackgroundRow key={hour} i={i} height={rowHeight} />
				)}
			</div>
		);
	}
}

export function BackgroundRow({i, height}) {
	var baseBackgroundRowStyle = {
		height,
		background: i % 2 === 0 ? '#fff' : '#E7F1F9'
	};
	return (
		<div style={baseBackgroundRowStyle}></div>
	);
}