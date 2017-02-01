import uuid from 'uuid';

// var initialById = {};
// var initialListedIds = [];

var initialJob = {
	id: uuid.v4(),
	name: 'Job 43',
	isDragging: false,
	draggingCoordinates: null
}

var initialById = {
	[initialJob.id]: initialJob
};
var initialListedIds = [initialJob.id];

function listedIds(state = initialListedIds, action) {
	return state;
}

function unassignedJob(state, action) {
	switch (action.type) {
		case 'MOVE_VERTICAL_UNASSIGNED_JOB':
			return {
				...state,
				isDragging: true,
				draggingCoordinates: action.draggingCoordinates
			};
		case 'MOVE_VERTICAL_UNASSIGNED_JOB_FINISHED':
			return {
				...state,
				isDragging: false,
				draggingCoordinates: null
			};
		default:
			return state;
	}
}

function byId(state = initialById, action, {listedIds}) {
	switch (action.type) {
		case 'MOVE_VERTICAL_UNASSIGNED_JOB':
		case 'MOVE_VERTICAL_UNASSIGNED_JOB_FINISHED':
			return {
				...state,
				[action.id]: unassignedJob(state[action.id], action)
			};
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