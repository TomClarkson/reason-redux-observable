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

class App extends Component {
	state = {
		loading: false,
		users: [],
		error: false
	};
	componentDidMount() {
		const searchInput = document.querySelector('#searchInput');
		// Listen to keypresses on input
		Observable.fromEvent(searchInput, 'keyup')
			// Get the value of the input
			.map(event => event.target.value)
			// Only pass through values with 3 or more characters
			.filter(value => value.length > 2)
			// Could have pressed up or down
			// Therefore, only emit when the value has changed
			.distinctUntilChanged()
			// Only emit when there has been 500ms of silence
			.debounceTime(500)
			// switch unsubscribes from all but latest emitted item
			// switchMap only emits inner observable's emitted items (Which we need because we return an observable)
			.switchMap(value => {
				this.setState({error: false, loading: true});
				return Observable
					.ajax(`https://api.github.com/search/users?q=${value}`)
					.retry(2)
					.catch(() => {
						this.setState({error: true, loading: false});
						return Observable.of({
							response: {
								items: []
							}
						});
					})
					.do(() => this.setState({loading: false}))
					.map(({response}) => response.items.slice(0, 5))
			})
			.subscribe(users => {
				console.log('users', users);
				this.setState({users});
			})
	}
	render() {
		var { loading, users, error } = this.state;
		return (
			<div>
				<h1>Github autocomplete</h1>
				<input id="searchInput" defaultValue="" />
				{loading &&
					<h4>Loading...</h4>
				}
				{error &&
					<h6 style={{color: 'red'}}>Search Failed</h6>
				}
				<div>
					{users.map(u =>
						<div key={u.login}>
							<h3>{u.login}</h3>
							<img style={{height: 200, width: 200}} src={u.avatar_url} alt="Profile Pic" />
							<a href={u.url}>View Profile</a>
						</div>
					)}
				</div>

			</div>
		);
	}
}

render(<App />, document.querySelector('#root'));




