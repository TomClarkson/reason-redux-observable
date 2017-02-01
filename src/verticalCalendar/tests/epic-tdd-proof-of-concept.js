import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mapTo';

import configureStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import expect from 'expect';
import sinon from 'sinon';
import { Observable } from 'rxjs';

const pingEpic = (action$, store) => {
    return action$.ofType('PING')
    	.mergeMap(m =>
    		Observable.timer(1000)
    			.mapTo({ type: 'PONG' })
    	)
}

var rootEpicWithDeps = (action$, store) => pingEpic(action$, { mad: 'reka', ...store })

describe('', () => {
    var clock;
    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it('pong epic', () => {
    	var clock = sinon.useFakeTimers();

    	const epicMiddleware = createEpicMiddleware(rootEpicWithDeps);
    	const mockStore = configureStore([epicMiddleware]);
        const store = mockStore()

        store.dispatch({type: 'PING'})        
        clock.tick(1000);

        var expected = [
        	{ type: 'PING' },
        	{ type: 'PONG' }
        ];

        expect(store.getActions()).toEqual(expected);
    });
});