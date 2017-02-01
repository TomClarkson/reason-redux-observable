import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/operator/timeoutWith';
import { Observable } from 'rxjs';

export default function({preventDefault = true} = {}) {    
    var mouseUp$ = Observable.fromEvent(document, 'mouseup');
    var touchEnd$ = Observable.fromEvent(document, 'touchend');

    var handlePreventDefault = e => {
        if(preventDefault) {
            e.preventDefault();
        }
    };

    var mouseMoves$ = Observable.fromEvent(document, 'mousemove')
        .do(handlePreventDefault)

    // https://medium.com/@devlucky/about-passive-event-listeners-224ff620e68c#.47pxnrbb4
    // var touchMoves$ = Observable.fromEvent(document, 'touchmove', e => e, {passive: false})
    var touchMoves$ = Observable.fromEvent(document, 'touchmove')
        .do(handlePreventDefault)
        .map(tm => {
            return tm.targetTouches[0];
        })

    var releaseEvents$ = Observable.merge(mouseUp$, touchEnd$);

    var moves$ = Observable.merge(mouseMoves$, touchMoves$)
        .takeUntil(releaseEvents$)

    var release$ = releaseEvents$
        .take(1);

    return {
        release$,
        moves$
    };
}