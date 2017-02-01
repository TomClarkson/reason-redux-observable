var columnWidth = 100;

var columns = Array(100).fill().map((_, i) => i + 1).map(columnNumber => ({
	left: (columnNumber * columnWidth) - columnWidth,
	columnNumber,
	width: columnWidth
}));

var hourRowHeight = 50;

var hoursRange = Array(14).fill().map((_, i) => i + 7);

var initialState = {
	sliderPositionX: 0,
	dateHeaderHeight: 30,
	height: 1400,
	columns,
	hoursRange,
	hourRowHeight
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'SCROLL_VERTICAL_CALENDAR':
			return {
				...state,
				sliderPositionX: action.sliderPositionX
			};
		default:
			return state;
	}
}