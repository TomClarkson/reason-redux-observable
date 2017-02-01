import React from 'react';
import { render } from 'react-dom';
import PrototypeVerticalCalendar from './PrototypeVerticalCalendar';
import { Provider } from 'react-redux';
import makeStore from './redux/create';
import movesUntilRelease from './movesUntilRelease';
import getCalendarCoordinates from './getCalendarCoordinates';

var store = makeStore({}, { movesUntilRelease, getCalendarCoordinates });

const app = (
	<Provider store={store}>
		<div className="calendar-container">
			<PrototypeVerticalCalendar />
		</div>
	</Provider>
);

render(app, document.querySelector('#root'));
