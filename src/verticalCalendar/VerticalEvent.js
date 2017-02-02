import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditEventModal from './EditEventModal';
import visualizeRender from 'react-render-visualizer-decorator';

var makeMapStateToProps = (initialState, initialProps) => {
	var { id } = initialProps;

	return state => {
		var event = state.verticalEvents.byId[id]
		return {event};
	}
}

@connect(
	makeMapStateToProps,
	{
		dragHeadStart: () => ({
			type: 'DRAG_HEAD_START'
		}),
		dragTailStart: () => ({
			type: 'DRAG_TAIL_START'
		}),
		mousedownOnEvent: (pointerDown, calendarEvent) => ({
			type: 'POINTER_DOWN_ON_VERTICAL_EVENT',
			pointerDown, 
			calendarEvent
		}),
		closeEditModal: (id) => ({
			type: 'CLOSE_EDIT_VERTICAL_EVENT_MODAL',
			id
		})
	}
)
export default class VerticalEvent extends Component {
	onMouseDown = e => {
		var isHandle = e.target.className.includes('left-handle') ||
			e.target.className.includes('right-handle');

		if(! isHandle && e.button === 0) {
			this.props.mousedownOnEvent(e, this.props.event);
		}
	}
	dragHeadStart = e => {
		this.props.dragHeadStart();
	}
	dragTailStart = e => {
		this.props.dragTailStart();
	}
	onTouchStart = e => {
		// touch first, https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
		e.preventDefault();

		this.props.mousedownOnEvent(e.touches[0], this.props.event);
	}
	render() {
		var { id, name, top, left, width, height, isDragging, editModalOpen } = this.props.event;

		var zIndexStyle = isDragging ? {zIndex: 12} : {zIndex: 11};

		var eventStyle = {
			position: 'absolute', 
			top, 
			left, 
			width, 
			height, 
			background: isDragging ? 'yellow' : 'pink',
			...zIndexStyle,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		};
		
		var dragHandle = {
			height: 10,
			width: '100%',
			background: 'green',
			// cursor: 'ew-resize',
			position: 'absolute',
		};

		return (
			<div>
				{editModalOpen &&
					<EditEventModal closeEditModal={this.props.closeEditModal} event={this.props.event} />
				}
				<div data-eventid={id} className="cal-event" style={eventStyle} onMouseDown={this.onMouseDown} onTouchStart={this.onTouchStart}>
					<div onClick={this.dragHeadStart} className="left-handle" style={{...dragHandle, top: 0}}></div>
						<EventBody name={name} />
					<div onClick={this.dragTailStart} className="right-handle" style={{...dragHandle, positon: 'absolute', bottom: 0}}></div>
				</div>
			</div>
		);
	}
}

@visualizeRender
class EventBody extends Component {
	render() {
		var style = {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			display: 'flex'
		};
		return (
			<div className="event-body" style={style}>
				{<span>{this.props.name}</span>}
			</div>
		);
	}
}