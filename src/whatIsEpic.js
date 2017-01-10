import { Subject } from 'rxjs';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/delay';

const action$ = new Subject();

const epic = (action$) =>
	action$
		.filter(a => a.type === 'PING')
		.mapTo({
			type: 'PONG'
		});

const result = epic(action$);

result
	.subscribe(e =>
		console.log('result', e)
	);

action$.next({type: 'PING'});
// action$.next({type: 'PING'});