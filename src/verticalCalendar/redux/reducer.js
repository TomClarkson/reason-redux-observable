import { combineReducers } from 'redux';
import verticalCalendar from '../reducers/calendar';
import verticalEvents from '../reducers/events';
import verticalUnassignedJobs from '../reducers/unassignedJobs';

export default combineReducers({
	verticalCalendar,
	verticalEvents,
	verticalUnassignedJobs
});