import React from 'react';
import { render } from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mapTo';

const pingEpic = action$ =>
	action$.ofType('PING')
		.delay(1000) // Asynchronously wait 1000ms then continue
		.mapTo({ type: 'PONG' });

const pingReducer = (state = { isPinging: false }, action) => {
	switch (action.type) {
		case 'PING':
			return { isPinging: true };

		case 'PONG':
			return { isPinging: false };

		default:
			return state;
	}
};

const epicMiddleware = createEpicMiddleware(pingEpic);

const store = createStore(pingReducer,
	applyMiddleware(epicMiddleware)
);

const renderApp = () => {
	const { isPinging } = store.getState();

	const app = (
		<div>
			<h1>is pinging: {String(isPinging)}</h1>
			<button onClick={() => store.dispatch({type: 'PING'})}>Start Ping</button>
		</div>
	);

	render(app, document.querySelector('#root'));
};

store.subscribe(renderApp);
renderApp();

