import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs';

var mouseMovedEnough = ({currentX, startX, currentY, startY}) => {
    return Math.abs(currentX - startX) > 3 ||
      Math.abs(currentY - startY) > 3;
}

var scrollSlider = (action$, {movesUntilRelease, getState}) => {
    return action$.ofType('POINTER_DOWN_ON_COLUMN')
        .switchMap(action => {
            var { pointerEvent } = action;
            var startPageX = pointerEvent.pageX;
            var sliderPositionX = getState().verticalCalendar.sliderPositionX;

            return movesUntilRelease().moves$
                .map(e => ({
                    type: 'SCROLL_VERTICAL_CALENDAR',
                    sliderPositionX: sliderPositionX + (e.pageX - startPageX)
                }))
        })
}

var dragUnassignedEvent = (action$, {movesUntilRelease, getCalendarCoordinates, getState}) => {
    return action$.ofType('POINTER_DOWN_ON_UNASSIGNED_JOB')
        .switchMap(action => {
            var { id, pointerDownEvent } = action;

            var movesTilRelease = movesUntilRelease();

            var startPageX = pointerDownEvent.pageX;
            var startPageY = pointerDownEvent.pageY;

            var moveFinishedActions$ = movesTilRelease.release$
                .map(e => {
                    return {
                        id,
                        type: 'MOVE_VERTICAL_UNASSIGNED_JOB_FINISHED'
                    }
                })

            var releaseActions$ = moveFinishedActions$;

            // already in store, could get from getState, do what's easier for testing
            var todoEventBoundingRect = pointerDownEvent.target.getBoundingClientRect();
            var { left, top } = todoEventBoundingRect;

            var moveActions$ = movesTilRelease.moves$
                .do(e => ({
                    left,
                    epageX: e.pageX,
                    startPageX
                }))
                .map(e => ({
                    left: left + (e.pageX - startPageX),
                    top: top + (e.pageY - startPageY),               
                }))
                .map(({left, top}) => ({
                    type: 'MOVE_VERTICAL_UNASSIGNED_JOB',
                    draggingCoordinates: {
                        left,
                        top,
                        height: 50,
                        width: 100
                    },
                    id
                }))

            return Observable.merge(releaseActions$, moveActions$);
        });
}

var closeEditEventModalEpic = actions$ =>
    actions$.ofType('OPEN_EDIT_VERTICAL_EVENT_MODAL')
        .mergeMap(action =>
            Observable.fromEvent(document, 'keydown')
                .takeUntil(actions$.ofType('CLOSE_EDIT_EVENT_MODAL'))
                .filter(e => e.key === "Escape")
                .mapTo({
                    id: action.id,
                    type: 'CLOSE_EDIT_VERTICAL_EVENT_MODAL'
                })
        )


var clickCalendarEventEpic = (action$, {movesUntilRelease}) => {
    var click$ = action$.ofType('NON_DRAG_VERTICAL_EVENT_MOUSE_UP');

    var singleClicks$ = click$
        .buffer(click$.debounceTime(250))
        .filter(clicks => clicks.length === 1)
        .map(bufferedActions => {
            var id = bufferedActions[0].id;

            return {
                type: 'OPEN_EDIT_VERTICAL_EVENT_OVERLAY',
                id
            }
        })
        .do((action) => console.log('should emit this single click action', action))

    var doubleClicks$ = click$
        .buffer(click$.debounceTime(250))
        .filter(clicks => clicks.length === 2)
        .map(bufferedActions => {
            var id = bufferedActions[0].id;

            return {
                type: 'OPEN_EDIT_VERTICAL_EVENT_MODAL',
                id
            }
        })

    return Observable.merge(singleClicks$, doubleClicks$);
}
    
    


// call the action POINTER_DOWN_ON_VERTICAL_EVENT

var dragEpic = (action$, {movesUntilRelease, getCalendarCoordinates}) => {
    return action$.ofType('POINTER_DOWN_ON_VERTICAL_EVENT')
        .switchMap(action => {
            var { calendarEvent, pointerDown } = action;

            var movesTilRelease = movesUntilRelease();

            var startPageX = pointerDown.pageX;
            var startPageY = pointerDown.pageY;

            // if single click desktop show popover
            // if double click show modal
            // if mobile just show event form

            var releaseActions$ = movesTilRelease.release$
                .map(e => {
                    var hasMoved = mouseMovedEnough({
                        currentX: e.pageX, 
                        startX: startPageX, 
                        currentY: e.pageY,
                        startY: startPageY
                    })

                    return hasMoved ? {
                        type: 'MOVE_VERTICAL_EVENT_FINISHED',
                        id: calendarEvent.id
                    } : {
                        type: 'NON_DRAG_VERTICAL_EVENT_MOUSE_UP',
                        id: calendarEvent.id
                    };
                })


            var { left, top, height, width } = calendarEvent;

            var calendarCoordinates = getCalendarCoordinates();
            var { jobsTodoContainerBoundingRect, containerElementBoundingRect } = calendarCoordinates;

            var moveActions$ = movesTilRelease.moves$
                .map(e => ({
                    left: left + (e.pageX - startPageX),
                    top: top + (e.pageY - startPageY),               
                }))
                .map(({left, top}) => {

                    var passedLeftBound = jobsTodoContainerBoundingRect.right > left;
                    if(passedLeftBound) {
                        left = jobsTodoContainerBoundingRect.right;
                    }

                    var passedRightBound = (left + width) > containerElementBoundingRect.right;
                    if(passedRightBound) {
                        left = containerElementBoundingRect.right - width;
                    }

                    var passedTopBound = 0 > top;
                    if(passedTopBound) {
                        top = 0;
                    }

                    var passedBottomBound = (top + height) > containerElementBoundingRect.height;
                    if(passedBottomBound) {
                        top = containerElementBoundingRect.height - height;
                    }

                    return {
                        type: 'MOVE_VERTICAL_EVENT',
                        id: calendarEvent.id,
                        left,
                        top
                    };
                })
            
            return Observable.merge(
                moveActions$, 
                releaseActions$
            );
        })
};

export default [
    closeEditEventModalEpic,
    dragEpic,
    dragUnassignedEvent,
    scrollSlider,
    clickCalendarEventEpic
];