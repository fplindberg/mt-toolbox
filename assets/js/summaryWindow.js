/* Imports to enable Bootstrap javascript-lib and autosize-lib */
window.jQuery = window.$ = require('jquery');
window.Popper = require('popper.js/dist/umd/popper.min.js');
require('bootstrap/dist/js/bootstrap.min.js');
window.autosize = require('autosize/dist/autosize.min.js');

/*****************************************************************************/
/* Initiation of variables, tooltips and helper functions */
// Loading required node.js modules
const electron = require('electron');
const {ipcRenderer} = require('electron');
const {remote} = require('electron');

// Initiation of tooltips
$(function(){
	$('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
	$('[data-toggle="tooltip"]').on('click', function(){
		$(this).tooltip('hide')
	});
});

// Initiation of textarea autosize
var textareas = document.querySelectorAll('textarea');
autosize(textareas);

// Function to create new table row element and insert it to table
function addToTable(table, inventory, status){
	var inventorytr, numberth, commenttd, testtd, actiontd;
	var action1, actioninput1, actionlabel1, label1;
	var action2, actioninput2, actionlabel2, label2;

	if(status === "remark"){
		label1 = "Ignoreras";
		label2 = "Repareras";
	}
	else if(status === "failed"){
		label1 = "Repareras";
		label2 = "Skrotas";
	}

	// Create table row element
	inventorytr = document.createElement('tr');
	
	// Create table column header element for number
	numberth = document.createElement('th');
	numberth.scope = "row";
	numberth.innerHTML = inventory.number;
	
	// Create table column element for comment
	commenttd = document.createElement('td');
	commenttd.innerHTML = inventory.comment;
	
	// Create table column element for test
	testtd = document.createElement('td');
	testtd.innerHTML = inventory.test;
	
	// Create table column element for action radio buttons
	actiontd = document.createElement('td');
	
	// Create radio button element for first alternative
	action1 = document.createElement('div');
	action1.className = "form-check";
	
	actioninput1 = document.createElement('input');
	actioninput1.type = "radio";
	actioninput1.name = (inventory.number + "-inlineRadioOptions");
	actioninput1.id = (inventory.number + "-radio1");
	actioninput1.className = "form-check-input";
	actioninput1.value = "option1";
	
	actionlabel1 = document.createElement('label');
	actionlabel1.className = "form-check-label";
	actionlabel1.htmlfor = actioninput1.id;
	actionlabel1.innerHTML = label1;
	
	// Create radio button element for second alternative
	action2 = document.createElement('div');
	action2.className = "form-check";
	
	actioninput2 = document.createElement('input');
	actioninput2.type = "radio";
	actioninput2.name = (inventory.number + "-inlineRadioOptions");
	actioninput2.id = (inventory.number + "-radio2");
	actioninput2.className = "form-check-input";
	actioninput2.value = "option2";
	
	actionlabel2 = document.createElement('label');
	actionlabel2.className = "form-check-label";
	actionlabel2.htmlfor = actioninput2.id;
	actionlabel2.innerHTML = label2;
	
	// Add radio button input to div element
	action1.appendChild(actioninput1);
	action1.appendChild(actionlabel1);
	
	action2.appendChild(actioninput2);
	action2.appendChild(actionlabel2);
	
	// Add radio buttons to column element
	actiontd.appendChild(action1);
	actiontd.appendChild(action2);
	
	// Add column elements to row element
	inventorytr.appendChild(numberth);
	inventorytr.appendChild(commenttd);
	inventorytr.appendChild(testtd);
	inventorytr.appendChild(actiontd);
	
	// Add row element to table
	table.appendChild(inventorytr);
}

// Function to create new list-group-item element and insert it to list
function addToList(list, inventory){
	var li, itemText;
	// Create new list-group-item for inventory number and append to list
	li = document.createElement('li');
	li.className = 'list-group-item';
	itemText = document.createTextNode(inventory.number + " - " + inventory.name);
	li.id = (inventory.number + "-listItem");
	li.appendChild(itemText);
	list.appendChild(li);
}

// Create local variable for storing selected site object
var summarydata = {};
var siteindex;

// Function to print summary data for inventory to HTML
function printSummaryData(){
	// Print site data
	document.getElementById("site-field").innerHTML = summarydata.site;
	document.getElementById("date-field").innerHTML = summarydata.date;
	
	// Clear all radio button selections
	$('input[type=radio]:checked').each(function(){$(this).prop('checked', false)});
	
	// Reset fields
	document.getElementById("cast-field").value = '';
	document.getElementById("investments-field").value = '';
	document.getElementById("future-field").value = '';
	document.getElementById("other-field").value = '';
}
	
/*****************************************************************************/
/* Functions for communication with main process */
// Save report and update user data when save button is clicked
function sendResult(){
	// Remove buttons from page to not include them in pdf report
	document.getElementById("buttons").innerHTML = '';
	
	// Update site status in global user object when done
	remote.getGlobal('globaluser').responsibilities[siteindex].status = 'finished';
	
	// Issue update:site command to parent window for visual update
	ipcRenderer.send('update:site', siteindex);
	
	// Issue store:report command to save pdf-report, this closes the window
	const pdfpath = ('./reports/preventive_maintenance_reports/' + summarydata.site + ' - ' + summarydata.date + '.pdf');
	ipcRenderer.send('store:report', pdfpath);
}

// Function to close window when back button is clicked
function closeWindow(){
	ipcRenderer.send('close:window');
}

/*****************************************************************************/
/* Functions to define IPC-messages to listen for */
// Listen for summary:data to fetch site data from global user object to tables
ipcRenderer.on('summary:data', function(event, siteIndex){
	// Store index locally for later use
	siteindex = siteIndex;
	
	// Get selected site from global user object
	summarydata = remote.getGlobal('globaluser').responsibilities[siteIndex];
	
	// Get HTML-tables and list to variables
	const failedtable = document.getElementById("failed-table");
	const remarktable = document.getElementById("remark-table");
	const missinglist = document.getElementById("missing-list");
	
	// If data have failed or remarked entrys, add it to its table
	for(i = 0,  len = summarydata.inventories.length; i < len; ++i){
		const inventory = summarydata.inventories[i];
		if(inventory.status === 'remark'){
			addToTable(remarktable, inventory, inventory.status);
		}
		else if(summarydata.inventories[i].status === 'failed'){
			addToTable(failedtable, inventory, inventory.status);
		}
		// If data have entries without status, add it to its list
		else if(summarydata.inventories[i].status === ''){
			addToList(missinglist, inventory);
		}
	}
	
	// Print user data to screen
	printSummaryData();
});
