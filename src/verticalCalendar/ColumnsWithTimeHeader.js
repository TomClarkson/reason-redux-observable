import React, { Component } from 'react';
import { connect } from 'react-redux';
import Column from './Column';

var columnsSliderStyle = {
  width: 2000,
  display: 'flex',
}

@connect(
	state => ({
		columns: state.verticalCalendar.columns,
	})
)
export default class ColumnsWithTimeHeader extends Component {
	render() {
	    var { sliderPosition, columns } = this.props;
	    var finalStyle = {
	    	...columnsSliderStyle,
	    	transform: `translate3d(${sliderPosition}px, 0px, 0px)`
	    };

	    return (
	    	<div className="slider" style={finalStyle}>
	    		{columns.map(c => 
	    			<Column 
	    				key={c.columnNumber} 
	    				showTitle={true}
	    				column={c} />
	    			)
	    		}
	    	</div>
	    );
	}
}