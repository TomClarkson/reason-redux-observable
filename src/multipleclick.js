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

export default class MultipleClick extends Component {
	state = {
		numberOfClicks: 0
	};
	componentDidMount() {
		const click$ = Observable.fromEvent(document, 'click');
		click$.buffer(click$.debounceTime(250))
			.map(e => e.length)
			.subscribe(numberOfClicks =>
				this.setState({numberOfClicks})
			);
	}
	render() {
		return (
			<div>
				<h1>Last number of clicks {this.state.numberOfClicks}</h1>
			</div>
		);
	}
}




