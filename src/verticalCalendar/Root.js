import React, { Component } from 'react';
import { render } from 'react-dom';
import PrototypeVerticalCalendar from './PrototypeVerticalCalendar';
import { Provider } from 'react-redux';
import makeStore from './redux/create';
import movesUntilRelease from './movesUntilRelease';
import getCalendarCoordinates from './getCalendarCoordinates';

var store = makeStore({}, { movesUntilRelease, getCalendarCoordinates });

export default class Root extends Component {
	render() {
		return (
			<Provider store={store}>
				<div className="calendar-container">
					<PrototypeVerticalCalendar />
				</div>
			</Provider>
		);
	}
}
