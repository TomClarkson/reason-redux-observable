import { createEpicMiddleware } from 'redux-observable';
import configureEpics from './configureEpics';

export default function(deps) {
	var epicMiddleware = createEpicMiddleware(configureEpics(deps));

	module.hot.accept('./configureEpics', () => {
	  const configureEpics = require('./configureEpics').default;

	  epicMiddleware.replaceEpic(configureEpics(deps));
	});
	
	return epicMiddleware;
}
