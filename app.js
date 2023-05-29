const table = document.getElementById('main-table');
const inputTodoHTML = document.getElementById('todoInput');
const inputButtonHTML = document.getElementById('todoButtonAdd');

const tableContent = [
	{ id: 'EI1685381109418', task: 'Go to shop', isEdit: false },
	{
		id: 'UA1685381128759',
		task: 'Clean house this a longggggggggggggggggggg task. To test if the width of column is limited or not. Would be?',
		isEdit: false,
	},
];
console.log(table.children);
function createNewRow(idx, el) {
	const editButton = document.createElement('button');
	const newTr = document.createElement('tr');
	const newTh = document.createElement('th');
	const newTd = document.createElement('td');
	const newP = document.createElement('p');
	const newInput = document.createElement('textarea');
	const deleteButton = document.createElement('button');

	// newInput.setAttribute('type', 'text');
	editButton.innerText = 'Editar';

	newTh.innerHTML = idx;
	newP.innerHTML = el.task;
	newTd.appendChild(newP);
	newTr.appendChild(newTh);
	newTr.appendChild(newTd);
	newTr.appendChild(editButton);

	newTd.onclick = function (e) {
		if (e.target.localName === 'textarea') {
			return;
		}
		editRow({
			isEdit: el.isEdit,
			input: newInput,
			td: newTd,
			tr: newTr,
			id: el.id,
		});
	};

	editButton.onclick = () =>
		editRow({
			isEdit: el.isEdit,
			input: newInput,
			td: newTd,
			tr: newTr,
			id: el.id,
		});

	deleteButton.innerText = 'Borrar';
	newTr.appendChild(deleteButton);
	deleteButton.onclick = () => removeTodo(idx);

	newTr.setAttribute('draggable', true);

	newTr.idx = idx;

	newTr.ondragstart = function (e) {
		console.dir(e.target);
		if (e.isEdit || e.target.localName === 'textarea') {
			return;
		}
		handleDragStart.apply(this, [e]);
	};
	newTr.ondragend = handleDragEnd;
	return newTr;
}
function renderTable(array) {
	let tableBody = table.children[1];
	tableBody.innerHTML = '';
	array.forEach((el, idx, arr) => {
		el.isEdit = false;
		const newTr = createNewRow(idx, el);
		tableBody.appendChild(newTr);
	});
}

function createId() {
	const vowels = ['A', 'E', 'I', 'O', 'U'];
	const date = Date.now();
	const randomString =
		vowels[Math.floor(Math.random() * vowels.length)] +
		vowels[Math.floor(Math.random() * vowels.length)];
	return randomString + date;
}

function handleDragStart(e) {
	console.log(this);
	this.style.backgroundColor = 'orange';
	const deleteArea = document.createElement('div');
	deleteArea.setAttribute('id', 'deleteArea');
	document.body.appendChild(deleteArea);

	e.dataTransfer.setData('text/plain', e.target.idx);
	console.log('drag start - e', e.dataTransfer);
	deleteArea.ondragleave = function (e) {
		this.style.backgroundColor = 'grey';
		e.stopPropagation(); // stops the browser from redirecting.
	};
	deleteArea.ondragenter = function (e) {
		console.log('End', e.target);
		this.style.backgroundColor = 'red';
		e.preventDefault();
	};
	deleteArea.ondragover = function (e) {
		this.style.backgroundColor = 'red';
		e.preventDefault();
	};
	deleteArea.ondrop = function (e) {
		const idx = e.dataTransfer.getData('text/plain');
		console.log('From drop', idx);
		removeTodo(idx);
	};
}

function handleDragEnd() {
	this.style.backgroundColor = 'white';
	const deleteArea = document.getElementById('deleteArea');
	deleteArea.remove();

	console.log('drag end!');
}

function editRow({ isEdit, input, td, tr, id }) {
	const idx = tableContent.findIndex((el) => el.id === id);
	console.log(idx);
	const removeInput = () => {
		td.innerHTML = input.value;
		tableContent[idx].task = input.value;
		tableContent[idx].isEdit = false;
		tr.setAttribute('draggable', true);
		return;
	};
	if (isEdit) {
		removeInput();
		return;
	}
	tr.setAttribute('draggable', false);

	const tdWidth = td.offsetWidth;
	const tdHeight = td.offsetHeight;
	console.log(tdWidth, tdHeight);
	tableContent[idx].isEdit = true;
	input.value = td.innerText;
	input.focus();
	input.style.width = `${tdWidth}px`;
	// input.style.height = `${tdHeight}px`;
	td.innerHTML = '';
	td.appendChild(input);
	console.log(tableContent);
	// setEditMode();
	input.onkeydown = function (e) {
		if (e.key === 'Enter') {
			removeInput();
		}
	};
}
function addTodo() {
	let value = inputTodoHTML.value;
	const todo = {
		id: createId(),
		task: value,
		isEdit: false,
	};
	tableContent.push(todo);
	// renderTable(tableContent);
	const newRow = createNewRow(tableContent.length, todo);
	// newRow.style.opacity = 0;
	newRow.classList.add('new-row');

	table.children[1].appendChild(newRow);

	inputTodoHTML.value = '';
	console.log(tableContent);
}
function removeTodo(idx) {
	tableContent.splice(idx, 1);
	renderTable(tableContent);
}

inputButtonHTML.onclick = addTodo;

inputTodoHTML.onkeydown = (e) => {
	if (e.key === 'Enter') {
		addTodo();
	}
};

renderTable(tableContent);
