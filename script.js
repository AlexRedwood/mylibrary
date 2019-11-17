const themeChanger = document.getElementById('theme-changer');
	themeChanger.addEventListener('click', e => {
  		console.log("Switching theme");
  		if(document.documentElement.hasAttribute('theme')){
    			document.documentElement.removeAttribute('theme');
			e.target.textContent = "Going dark";
  		}
 		 else{
   			 document.documentElement.setAttribute('theme', 'dark');
			 e.target.textContent = "Let there be light";
  		}
	});


  	function appendDeleteButtonTo(element, identificator = "undefined") {
			let btn = document.createElement('input');
			btn.type = "button"; 
			btn.className = "btn";
			btn.setAttribute('id', `btn ${identificator}`);
			btn.value = "X";
			btn.addEventListener('click', deleteMyRow); 
			element.appendChild(btn);
	}

	function appendCompletedButtonTo(element, identificator, value) {
		let btn = document.createElement('input');
		btn.type = "button"; 
		btn.setAttribute('id', `Cbtn ${identificator}`);
		btn.className = "btnCompleted";
		btn.value = value;
		btn.addEventListener('click', changeMyValue); 
		element.appendChild(btn);
	}

	function changeMyValue() {
		let buttonId = this.id;
		let rowId = parseInt(buttonId.slice(4));
		console.log(myLibrary[rowId]);
		console.log(myLibrary[0]);
		if (myLibrary[rowId].completed == "No") {
			myLibrary[rowId].completed = "Yes";
		} else if (myLibrary[rowId].completed == "Yes") {
			myLibrary[rowId].completed = "No";
		} else {
			alert ('Something is wrong in changeMyValue function.');
		}		

		actualiseLibrary();
	}
	
	function getToggleValue() {
		let toggleInput = document.getElementById('toggleInput')
		if (toggleInput.checked == false){
    			return "No";
  		} else {
    			return "Yes";
  		}
	}

	function clearInputDisplay () {
		document.getElementById("form").reset(); 
	}
	

	const tableField = document.getElementById('table-field');

	function createTable () {
	  let table = document.createElement('table'); 	
	  table.setAttribute('id', 'libraryTable');
	  tableField.appendChild(table);
	
	  let libraryTable = document.getElementById('libraryTable');
	  let tableHead = libraryTable.createTHead();
	  let tableHeadRow = tableHead.insertRow(0);

	  keys = ['Name', 'Author', 'Pages', 'Completed?', 'Delete'];
	  for (i = 0; i < keys.length; i++) {
		let cell = tableHeadRow.insertCell(i);
		cell.outerHTML = `<th>${keys[i]}</th>`
	  }

	  let tableBody = document.createElement('tbody');
	  tableBody.setAttribute('id', 'tableBody');
	  libraryTable.appendChild(tableBody);

	
	}
	

	let displayFormsButton = document.querySelector('#displayForms');
	let fieldset = document.getElementById('fieldset');
	
	let myLibrary = [];
	
	function Book ( name = "undefined", author = "undefined", pages = "undefined", completed = "undefined", id = "undefined")  {
		this.name = name
		this.author = author
		this.pages = pages
		this.completed = completed
		this.id = id

	}
	
	displayFormsButton.addEventListener('click', displayForms);


	function displayForms() {
	  fieldsetDisplay = window.getComputedStyle(fieldset).display

	  if (fieldsetDisplay == "none") {
			fieldset.style.display = "block";
			displayFormsButton.textContent = "Hide forms";
    } else if (fieldsetDisplay == "block") {
			fieldset.style.display = "none";
			displayFormsButton.textContent = "Add new book";
	  } else {
			alert('Error in displayForms function.');
	  }
	}


	let newBook = function () {
		let bookValue = document.getElementById("bookInput").value;
		let authorValue = document.getElementById("authorInput").value;
		let pagesValue = document.getElementById("pagesInput").value;
		let stylishPagesValue = parseInt(pagesValue).toLocaleString();
		let toggleValue = getToggleValue();
		let book = new Book(bookValue, authorValue, stylishPagesValue, toggleValue);
		return book;		
	}


	const tableBody = document.getElementById('tableBody');

	function addBookToLibrary() {
		if (userInputIsOK()) {
			myLibrary.push(newBook());
			if (storageAvailable('localStorage')) localStorage.setItem('items', JSON.stringify(myLibrary))
			actualiseLibrary();
			clearInputDisplay();
			console.table(myLibrary);
		} 
	}

	let add = document.getElementById("add");
	add.addEventListener('click', addBookToLibrary);

	function clearTableBody() {
		let tbody = document.getElementById('tableBody');
		while (tbody.firstChild) {
			tbody.removeChild(tbody.firstChild);
		}
	}

	function resetMyLibrary() {
		clearTableBody();
		myLibrary = [];
	}

	function displayMyLibrary() {
		let tbody = document.getElementById('libraryTable').getElementsByTagName('tbody')[0];
	  	
		for (i = 0; i < myLibrary.length; i++) {
			let row = tbody.insertRow();

			let cell1 = row.insertCell(0);
	 		let cell2 = row.insertCell(1);
	 		let cell3 = row.insertCell(2);
	  		let cell4 = row.insertCell(3);
	  		let cell5 = row.insertCell(4);

	  		cell1.textContent = myLibrary[i].name;
	  		cell2.textContent = myLibrary[i].author;
	  		cell3.textContent = myLibrary[i].pages;
	  		appendCompletedButtonTo(cell4, i, myLibrary[i].completed);
	  		appendDeleteButtonTo(cell5, i);
		} 

	}

	function actualiseLibrary() {
		clearTableBody();
		displayMyLibrary();
		console.table(myLibrary);
	}

	function deleteMyRow() {
		let buttonId = this.id;
		let rowId = buttonId.slice(3);
		myLibrary.splice(rowId, 1);
		if (storageAvailable('localStorage')) localStorage.setItem('items', JSON.stringify(myLibrary))
		actualiseLibrary();
	}
	
	function userInputIsOK() {
		let bookValue = document.getElementById("bookInput").value;
		let authorValue = document.getElementById("authorInput").value;
		let pagesValue = document.getElementById("pagesInput").value;

		if (bookValue.trim() === "") {alert ('Please enter book name'); return false}
		if (authorValue.trim() === "") {alert ('Please enter author name'); return false}
		if (pagesValue.trim() === "") {alert ('Please enter number of pages'); return false}
		if (parseInt(pagesValue) < 0) {alert ('Please enter a positive number'); return false}
		if (pagesValue.length > 5) {alert ('Please enter a number between 0 and 99 999'); return false}
		if (bookValue.length > 35) {alert ('Please enter a shorter book name (max 35 characters)'); return false}
		if (authorValue.length > 35) {alert ('Please enter a shorter author name (max 35 characters)'); return false}
		
		return true;		
	} 


	function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

if (storageAvailable('localStorage')) {
	// Yippee! We can use localStorage awesomeness
	getItemsFromLocalStorage()
	
	createTable();
	displayMyLibrary();
}
else {
	// Too bad, no localStorage for us
	myLibrary = [];
	const book1 = new Book("The Hobbit", "J.R.Tolkien", "310", "No");
	myLibrary.push(book1);
	
	createTable();
	displayMyLibrary();
}

function getItemsFromLocalStorage() {
	if (localStorage['items']) {
		myLibrary = JSON.parse(localStorage.getItem('items'));

	} else {
		myLibrary = [];
	  const book1 = new Book("The Hobbit", "J.R.Tolkien", "310", "No");
	  myLibrary.push(book1);
	}
};