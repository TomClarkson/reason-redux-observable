import React, { Component } from 'react';
import { connect } from 'react-redux';
import Column from './Column';
import VerticalEvent from './VerticalEvent';

var sliderStyle = {
  width: 2000,
  display: 'flex',
  zIndex: 99
}

@connect(
	state => ({
		visibleEventIds: state.verticalEvents.listedIds // visible per reselect
	})
)
class TestCalendarEvents extends Component {
	render() {
		var { visibleEventIds } = this.props;

		return (
			<div className="vertical-events-wrapper">
				{visibleEventIds.map(id => 
					<VerticalEvent 
						key={id} 
						id={id} />
				)}
			</div>
		);
	}
}

@connect(
	state => ({
		columns: state.verticalCalendar.columns,
	})
)
export default class ColumnsWithEventsSlider extends React.Component {
	render() {
	    var { sliderPosition, columns } = this.props;
	    var finalStyle = {
	    	...sliderStyle,
	    	transform: `translate3d(${sliderPosition}px, 0px, 0px)`
	    };

	    return (
	    	<div className="slider" style={finalStyle}>
	    		<TestCalendarEvents />
	    		{columns.map(c => <Column key={c.columnNumber} column={c} />)}
	    	</div>
	    );
	}
}

