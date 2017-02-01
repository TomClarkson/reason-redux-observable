import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

@connect(
	state => ({
		hourRowHeight: state.verticalCalendar.hourRowHeight,
		visibleUnassignedJobIds: state.verticalUnassignedJobs.listedIds
	})
)
export default class UnAssignedJobsAside extends Component {
	render() {
		var { hoursRange, hourRowHeight, visibleUnassignedJobIds } = this.props;

		var todoJobsContainerStyle = {
		    width: 300,
		    position: 'absolute',
		    top: 0,
		    left: 0,
		    bottom: 0,
		    background: '#fff',
		    zIndex: 165,
		    display: 'flex'
		};	

		return (
			<div id="jobs-todo-container" style={todoJobsContainerStyle}>
				<div style={{flex: 1}}>
					<h1>Unassigned Jobs</h1>	
					<div>
						{visibleUnassignedJobIds.map(id => 
							<UnassignedJob id={id} key={id} />
						)}
					</div>
				</div>
				<TimeYLabels hoursRange={hoursRange} rowHeight={hourRowHeight} />		
			</div>
		);
	}
}

function DraggedTodoPreview({event}) {
	var { height, width, left, top } = event.draggingCoordinates;
	var style = {
		background: 'yellow',
		position: 'absolute',
		height, 
		width, 
		left, 
		top,
		zIndex: 9999 // show above global top navbar
	}

	return (
		<div  
			style={style}>
			{event.name}
		</div>	
	);
}

// maybe manually animate the component away if they drop it outside scheduling area
class DraggedTodoPreviewPortal extends Component {
	state = {

	}
	componentDidMount() {
		var div = document.createElement('div');
		div.className = 'draggedTodoEventPortal';
		document.body.appendChild(div);

		this.mountNode = div;
		this.renderPreview(this.props);
	}
	componentWillUnmount() {
		ReactDOM.unmountComponentAtNode(this.mountNode);
	}
	componentWillReceiveProps(nextProps) {
		this.renderPreview(this.props);	
	}
	renderPreview({event}) {
		ReactDOM.render(<DraggedTodoPreview event={event} />, this.mountNode);		
	}
	render() {
		return null;
	}
}

var makeMapStateToProps = (initialState, initialProps) => {
	var { id } = initialProps;

	return state => {
		var unassignedJob = state.verticalUnassignedJobs.byId[id];
		return {unassignedJob};
	}
}

@connect(
	makeMapStateToProps,
	{
		pointerDownOnUnassignedJob: (e, id) => ({
			type: 'POINTER_DOWN_ON_UNASSIGNED_JOB',
			pointerDownEvent: e,
			id
		})
	}
)
class UnassignedJob extends Component {
	onMouseDown = e => {
		if(e.button === 0) {
			this.props.pointerDownOnUnassignedJob(e, this.props.unassignedJob.id);
		}
	}
	onTouchStart = e => {
		// touch first, https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
		e.preventDefault();

		this.props.pointerDownOnUnassignedJob(e.touches[0], this.props.unassignedJob.id);
	}
	render() {
		var { unassignedJob } = this.props;

		var baseStyle = {border: '1px solid #333', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'};

		return (
			<div>
				{unassignedJob.isDragging &&
					<DraggedTodoPreviewPortal event={unassignedJob} />
				}
				<div  
					onMouseDown={this.onMouseDown} 
					onTouchStart={this.onTouchStart}
					style={baseStyle}>
					{unassignedJob.name}
				</div>	
			</div>
		);
	}
}

export function TimeYLabels({hoursRange, rowHeight}) {
	var height = hoursRange.length * rowHeight;

	var halfSpacer = (
		<div style={{height: rowHeight / 2}}></div>
	);

	return (
		<div style={{width: 50, background: '#fff', height, borderRight: '1px solid #eee'}}>
			{halfSpacer}
			{hoursRange.map((hour, i) => 
				<div key={hour} style={{height: rowHeight, justifyContent: 'flex-end', paddingRight: 10, display: 'flex', alignItems: 'center'}}>
					{hour < 12 ? `${hour}am` : `${hour}pm`}
				</div>
			)}
		</div>
	);
}