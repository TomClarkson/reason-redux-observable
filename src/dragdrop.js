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

// show subscription declarative/imperative unsubscribe

export default class DragDrop extends Component {
	state = {
		top: 100,
		left: 100
	};
	componentDidMount() {
		const dragBox = document.querySelector('#dragBox');
		const mouseDown$ = Observable.fromEvent(dragBox, 'mousedown');
		const mouseMove$ = Observable.fromEvent(document, 'mousemove');
		const mouseUp$ = Observable.fromEvent(document, 'mouseup');

		// drag == start at mouseDown, stop and mouse up, and map all mouse movements in between to left and top positions
		
		mouseDown$
			.mergeMap(mouseDown => {
				// Need to take off the offset from mouse to top & left of box
				var { offsetX, offsetY } = mouseDown;
				
				return mouseMove$.map(mouseMove => ({
					left: mouseMove.clientX - offsetX,
					top: mouseMove.clientY - offsetY
				}))
				.takeUntil(mouseUp$);
			})
			.subscribe(({left, top}) => {
				this.setState({
					left,
					top
				});
			})
	}
	render() {
		const { left, top } = this.state;
		const style = {
			position: 'absolute',
			left,
			top,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			border: '1px solid pink',
			userSelect: 'none',
			height: 200,
			width: 200
		};

		return (
			<div>
				<div id="dragBox" style={style}>
					Drag me			
				</div>
			</div>
		);
	}
}




