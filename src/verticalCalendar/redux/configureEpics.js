import { combineEpics } from 'redux-observable';
import calendarEpics from '../epics';

export default function(deps) {
    return (action$, store) => 
        combineEpics(...calendarEpics)(action$, {...deps, ...store })
}