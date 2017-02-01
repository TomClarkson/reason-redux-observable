import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducer';
import makeEpicMiddleware from './makeEpicMiddleware';

export default function makeStore(initialData = {}, epicDependencies = {}) {

    const epicMiddleware = makeEpicMiddleware(epicDependencies);

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    var store = createStore(
        reducer, 
        initialData,
        composeEnhancers(
            applyMiddleware(epicMiddleware)
        )
    );

    if (module.hot) {
        module.hot.accept('./reducer', () => {
            const nextRootReducer = require('./reducer').default;

            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}

