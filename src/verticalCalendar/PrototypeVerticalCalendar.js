import React, { Component } from 'react';
import './verticalCalendar.less';
import { connect } from 'react-redux';
import ColumnsWithEventsSlider from './ColumnsWithEventsSlider';
import BackgroundRows from './BackgroundRows';
import UnAssignedJobsAside from './UnAssignedJobsAside';
import ColumnsWithTimeHeader from './ColumnsWithTimeHeader';
import { addVerticalEvent } from './reducers/events';

@connect(
	state => ({
		sliderPositionX: state.verticalCalendar.sliderPositionX,
		calendarHeight: state.verticalCalendar.height,
		hoursRange: state.verticalCalendar.hoursRange,
		hourRowHeight: state.verticalCalendar.hourRowHeight,
	}),
	{ addVerticalEvent }
)
export default class PrototypeVerticalCalendar extends Component {
	componentDidMount() {
		this.props.addVerticalEvent({top: 100, left: 600, name: 'First'});		
		this.props.addVerticalEvent({top: 400, left: 700, name: 'Second'});		
	}
	addEventDemo = e => {
		var top = e.target.offsetTop;
		var left = e.clientX;

		var name = prompt('Enter event name');

		this.props.addVerticalEvent({top, left, name});
	}
	render() {		
		var topBarHeight = 90;

		var bottomContainerStyle = {
			height: this.props.calendarHeight, 
			background: '#fff', 
			position: 'relative',
			display: 'flex', // needed for columns
			marginTop: topBarHeight
		};

		var { sliderPositionX, hoursRange, hourRowHeight } = this.props;

		return (
			<div style={{overflowX: 'hidden'}}>
				<div style={{height: topBarHeight, position: 'fixed', width: '100%', zIndex: 999, background: '#fff', borderBottom: '1px solid #ddd'}}>
					<div style={{height: 40, borderBottom: '1px solid #ddd'}}>
						<h1 style={{margin: 0}}>Date Ribbon to come</h1>	
					</div>
					<div style={{position: 'relative', height: 50, display: 'flex'}}>
						<ColumnsWithTimeHeader sliderPosition={sliderPositionX} />	
					</div>
					
				</div>
				<div className="vertical-calendar-bottom-wrapper" style={bottomContainerStyle}>
					<UnAssignedJobsAside hoursRange={hoursRange} />
					<BackgroundRows hoursRange={hoursRange} rowHeight={hourRowHeight} />
					<ColumnsWithEventsSlider sliderPosition={sliderPositionX} />						
				</div>	
			</div>
			
		);
	}
}