export default function() {
	var containerElement = document.querySelector('.calendar-container');
	var containerElementBoundingRect = containerElement.getBoundingClientRect();

	var jobsTodoContainer = document.querySelector('#jobs-todo-container');
	var jobsTodoContainerBoundingRect = jobsTodoContainer.getBoundingClientRect();

	return {
		containerElementBoundingRect,
		jobsTodoContainerBoundingRect
	}
}