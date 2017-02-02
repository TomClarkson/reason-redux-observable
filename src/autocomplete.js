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

var initialSearch = 'seapike';

export default class Autocomplete extends Component {
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
			// for demo lets start with intial search value
			// start with just immediately emits the items you give it downstream
			.startWith(initialSearch)
			// Could have pressed up or down
			// Therefore, only emit when the value has changed
			.distinctUntilChanged()
			// Only emit when there has been 500ms of silence
			.debounceTime(500)
			// switch unsubscribes from all but latest emitted item
			// switchMap only emits inner observable's emitted items (Which we need because we return an observable)
			.switchMap(query => {
				this.setState({error: false, loading: true});
				return Observable
					.ajax.getJSON(`https://api.github.com/search/users?q=${query}`)
					.retry(2)
					.catch((e) => {
						this.setState({error: true, loading: false});
						return Observable.of({items: []});
					})
					.do(() => this.setState({loading: false}))
					.map(res => res.items)
			})
			.subscribe(users =>
				this.setState({users})
			)
	}
	render() {
		var { loading, users, error } = this.state;
		return (
			<div>
				<h1 style={{fontFamily: 'cursive', textAlign: 'center'}}>Github autocomplete</h1>
				<div style={{display: 'flex', alignItems: 'center'}}>
					
					<input style={{marginLeft: 30, padding: 8, marginRight: 15}} id="searchInput" defaultValue={initialSearch} />
					{loading &&
						<span>Loading...</span>
					}
					{error &&
						<span style={{color: 'red'}}>Search Failed</span>
					}	
				</div>
				<div style={{display: 'flex', flexWrap: 'wrap'}}>
					{users.map(u =>
						<div key={u.login} style={{marginLeft: 30, height: 300, width: 200, marginTop: 30, display: 'flex', border: '1px solid #ccc', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
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




