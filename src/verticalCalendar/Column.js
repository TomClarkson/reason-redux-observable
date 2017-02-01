import React, { Component } from 'react';
import { connect } from 'react-redux';

var columnStyle = {
	borderRight: '1px solid #ddd',
	height: '100%',
	display: 'flex', // just needed for time labels
	justifyContent: 'center',
	alignItems: 'center',
	position: 'absolute',
	zIndex: 2
};

@connect(state => ({}))
export default class Column extends Component {
	onMouseDown = e => {
		if(e.button === 0) {
			this.props.dispatch({
				type: 'POINTER_DOWN_ON_COLUMN', 
				pointerEvent: e
			})
		}
	}
	onTouchStart = e => {
		// touch first, https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
		e.preventDefault();

		this.props.dispatch({
			type: 'POINTER_DOWN_ON_COLUMN', 
			pointerEvent: e.touches[0]
		})
	}
	render() {
		var { column, showTitle = false } = this.props;
		return (
			<div 
				className="column" 
				onMouseDown={this.onMouseDown}
				onTouchStart={this.onTouchStart}
				style={{
					...columnStyle, 
					left: column.left,
					width: column.width,
			}}>
				<div style={{position: 'fixed'}}>
					{showTitle &&
						<span>{column.columnNumber}</span>
					}
				</div>					
			</div>
		);
	}
}