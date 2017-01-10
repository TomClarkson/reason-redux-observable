import { Subject } from 'rxjs';

export default function tomCreateEpicMiddleware(epic) {
	const action$ = new Subject();

	const epicMiddlware = store => next => {
		const output$ = epic(action$, store);

		output$
			.subscribe(store.dispatch);

		return action => {
			const result = next(action);
			action$.next(action);
			return result;
		};
	};

	return epicMiddlware;
}