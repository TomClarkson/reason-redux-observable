import React, { Component } from 'react';
import ReactDOM from 'react-dom';

function ModalInner({closeEditModal, event}) {
	return (
		<div style={{position: 'absolute', left: 300, right: 300, top: 200, bottom: 200, border: '1px solid #333', zIndex: 99999, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<h4 onClick={e => closeEditModal(event.id)} style={{cursor: 'pointer', color: '#999', position: 'absolute', right: 40, top: 10}}>Close (x)</h4>
				<h1>Event Modal for {event.name}</h1>			
		</div>
	);
}

export default class EditEventModal extends Component {
	componentDidMount() {
		var div = document.createElement('div');
		div.className = 'eventModal';
		document.body.appendChild(div);

		this.mountNode = div;

		console.log('t', this.props);

		ReactDOM.render(<ModalInner event={this.props.event} closeEditModal={this.props.closeEditModal} />, div);
	}
	componentWillUnmount() {
		ReactDOM.unmountComponentAtNode(this.mountNode);
	}
	render() {
		return null;
	}
}
