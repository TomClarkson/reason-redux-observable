import uuid from 'uuid';

var initialById = {};
var initialListedIds = [];

function listedIds(state = initialListedIds, action, {byId}) {
	switch (action.type) {
		case 'ADD_VERTICAL_EVENT':
			return [...state, action.id];
		default:
			return state;
	}
}

function event(state, action) {	
	switch (action.type) {
		case 'ADD_VERTICAL_EVENT':
			return {
				id: action.id,
				height: 50,
				width: 100,
				isDragging: false,
				left: action.left,
				top: action.top,
				name: action.name,
				editModalOpen: false,
			};
		case 'MOVE_VERTICAL_EVENT_FINISHED':
			return {
				...state,
				isDragging: false
			};
		case 'MOVE_VERTICAL_EVENT':
			return {
				...state,
				isDragging: true,
				top: action.top,
				left: action.left
			};
		case 'OPEN_EDIT_VERTICAL_EVENT_MODAL':
			return {
				...state,
				editModalOpen: true
			};
		case 'CLOSE_EDIT_VERTICAL_EVENT_MODAL':
			return {
				...state,
				editModalOpen: false
			}
		default:
			return state;
	}
}

function byId(state = initialById, action, {listedIds}) {
	switch (action.type) {
		case 'MOVE_VERTICAL_EVENT':
		case 'MOVE_VERTICAL_EVENT_FINISHED':
		case 'ADD_VERTICAL_EVENT':
		case 'OPEN_EDIT_VERTICAL_EVENT_MODAL':
		case 'CLOSE_EDIT_VERTICAL_EVENT_MODAL':
			return {
				...state,
				[action.id]: event(state[action.id], action)
			}
		default:
			return state;
	}
}

export default function(state = {}, action) {
	return {
		byId: byId(state.byId, action, state),
		listedIds: listedIds(state.listedIds, action, state)
	};
}

export function addVerticalEvent({top, left, name}) {
	return {
		type: 'ADD_VERTICAL_EVENT',
		id: uuid.v4(),
		top,
		left,
		name
	};
}