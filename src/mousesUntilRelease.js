import { Observable } from 'rxjs';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/distinctUntilChanged';
import React, { Component } from 'react';
import { render } from 'react-dom';
import 'rxjs/add/observable/dom/ajax';

var movesUntilRelease = ({preventDefault = true} = {}) => {    
    var mouseUp$ = Observable.fromEvent(document, 'mouseup');
    var touchEnd$ = Observable.fromEvent(document, 'touchend');
    // touchEnd is getting multiple subscriptions some how
    // might need to use .share()

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

    var dragEnd$ = Observable.merge(mouseUp$, touchEnd$);

    var moves$ = Observable.merge(mouseMoves$, touchMoves$)
    	.takeUntil(dragEnd$)

    var release$ = dragEnd$
    	.take(1);

    return {
    	release$,
        moves$
    };
}

// show subscription declarative/imperative unsubscribe

// make a subject as a hack!

class App extends Component {
	state = {
		top: 100,
		left: 100,
		numberOfClicks: 0
	};
	handleDrag = (pointerDown, { initialTop, initialLeft }) => {

		var movesTilRelease = movesUntilRelease({preventDefault: false});

		var releaseActions$ = movesTilRelease
			.release$
			.do(() => console.log('handle release'))
			
		var startPageX = pointerDown.pageX;
		var startPageY = pointerDown.pageY;

		var movesActions$ = movesTilRelease
			.moves$
			.do(moveEvent => {

				var left = initialLeft + (moveEvent.pageX - startPageX);
				var top = initialTop + (moveEvent.pageY - startPageY);

				this.setState({
					left,
					top
				});
			})

		Observable
			.merge(
				movesActions$,
				releaseActions$
			)
			.subscribe();

	}
	onTouchStart = e => {
	    // touch first, https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
	    e.preventDefault();
	    e.stopPropagation();

	    this.handleDrag(e.touches[0], {
	    	initialLeft: this.state.left,
	    	initialTop: this.state.top
	    });
	}
	onMouseDown = e => {
		this.handleDrag(e, {
			initialLeft: this.state.left,
			initialTop: this.state.top
		});
	};
	render() {
		const { left, top, numberOfClicks } = this.state;
		const style = {
			position: 'absolute',
			left,
			top,
			display: 'flex',
			alignItems: 'center',
			flexDirection: 'column',
			justifyContent: 'center',
			border: '1px solid pink',
			userSelect: 'none',
			height: 200,
			width: 200
		};

		return (
			<div>
				<h1>Moves until release</h1>
				<div onMouseDown={this.onMouseDown} onTouchStart={this.onTouchStart} style={style}>
					<h3>Drag me	</h3>
					<p>Last number of clicks {numberOfClicks}</p>
				</div>
			</div>
		);
	}
}

render(<App />, document.querySelector('#root'));