import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mapTo';

import configureStore from 'redux-mock-store';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import expect from 'expect';
import sinon from 'sinon';
import { Observable } from 'rxjs';
import epics from '../epics';

var createTestStore = function({epics, deps = {}, initialState = {}}) {
    var rootEpicWithDeps = (action$, store) => 
        combineEpics(...epics)(action$, { ...deps, ...store })

    var epicMiddleware = createEpicMiddleware(rootEpicWithDeps);
    var mockStore = configureStore([epicMiddleware]);
    var store = mockStore(initialState);

    return store;   
}

var defaultGetCalendarCoordinates = () => {
    return {
        containerElementBoundingRect: {
            top: 0,
            left: 0,
            right: 300,
            width: 300,
            bottom: 200,
            height: 200
        },
        jobsTodoContainerBoundingRect: {
            top: 0,
            left: 0,
            right: 100,
            width: 100,
            bottom: 200,
            height: 200
        }
    }    
}


describe('Mouse down on calendar event interactions', () => {
    var clock;
    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it('creates event moves based on mouse events', () => {
        var movesUntilRelease = () => {
            return {
                moves$: Observable.of({
                    pageX: 120,
                    pageY: 110
                }),
                release$: Observable.timer(20)
            }    
        }

        var store = createTestStore({
            epics,
            mad: 'reka',
            deps: {
                movesUntilRelease,
                getCalendarCoordinates: defaultGetCalendarCoordinates
            }
        })

        var mouseDownAction = {
            type: 'MOUSEDOWN_ON_VERTICAL_EVENT',
            calendarEvent: {
                left: 100,
                top: 100,
                width: 100,
                height: 50
            },
            mouseDown: {
                pageX: 110,
                pageY: 100
            }
        }

        store.dispatch(mouseDownAction);

        clock.tick(20);

        var actions = store.getActions();

        expect(actions[0]).toEqual(mouseDownAction);

        // assert left, top coordinates
        expect(actions[1].type).toEqual('MOVE_EVENT');

        expect(actions[2].type).toEqual('MOVE_EVENT_FINISHED');
    });

    it('creates open modal action if mousedown and mouseup has same coordinates', () => {
        var mouseDownAction = {
            type: 'MOUSEDOWN_ON_VERTICAL_EVENT',
            calendarEvent: {
                left: 100,
                top: 100,
                width: 100,
                height: 50
            },
            mouseDown: {
                pageX: 110,
                pageY: 100
            }
        }

        var movesUntilRelease = () => {
            return {
                moves$: Observable.of(),
                release$: Observable.of({
                    pageX: 110,
                    pageY: 100                    
                })
            }    
        }

        var store = createTestStore({
            epics,
            mad: 'reka',
            deps: {
                movesUntilRelease,
                getCalendarCoordinates: defaultGetCalendarCoordinates
            }
        })

        store.dispatch(mouseDownAction);

        expect(store.getActions().map(e => e.type))
            .toEqual(['MOUSEDOWN_ON_VERTICAL_EVENT', 'OPEN_EDIT_EVENT_MODAL']);        
    });

    it('creates end drag action if mousedown and mouseup has different coordinates', () => {
        var mouseDownAction = {
            type: 'MOUSEDOWN_ON_VERTICAL_EVENT',
            calendarEvent: {
                left: 100,
                top: 100,
                width: 100,
                height: 50
            },
            mouseDown: {
                pageX: 110,
                pageY: 100
            }
        }

        var movesUntilRelease = () => {
            return {
                moves$: Observable.of(),
                release$: Observable.of({
                    pageX: 120,
                    pageY: 100                    
                })
            }    
        }

        var store = createTestStore({
            epics,
            mad: 'reka',
            deps: {
                movesUntilRelease,
                getCalendarCoordinates: defaultGetCalendarCoordinates
            }
        })

        store.dispatch(mouseDownAction);

        expect(store.getActions().map(e => e.type))
            .toEqual(['MOUSEDOWN_ON_VERTICAL_EVENT', 'MOVE_EVENT_FINISHED']);        
    });

    
    it('it tracks calendar coordinates on ', () => {
        // trackCalendarCoordinates    
    });
});