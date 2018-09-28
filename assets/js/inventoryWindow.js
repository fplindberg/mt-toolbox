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

// Create local variable for storing selected inventory object
var inventorydata = {};
var siteindex, inventoryindex;
	
/*****************************************************************************/
/* Functions for communication with main process */
// Update global user object when a submit button is clicked
function submitInventoryStatus(submitStatus){
	// Read input fields
	inventorydata.status = submitStatus;
	inventorydata.comment = document.getElementById("comment-field").value;
	inventorydata.test = document.getElementById("test-field").value;
	inventorydata.testequipment = document.getElementById("test-equipment-field").value;
	
	// Update global user object
	remote.getGlobal('globaluser').responsibilities[siteindex].inventories[inventoryindex] = inventorydata;
	
	// Issue update:inventory command to parent window for visual update
	ipcRenderer.send('update:inventory', siteindex, inventoryindex);
	
	// Close window after data is submitted
	closeWindow();
}

// Function to close window when back button is clicked
function closeWindow(){
	ipcRenderer.send('close:window');
}

/*****************************************************************************/
/* Functions to define IPC-messages to listen for */
// Listen for inventory:data to fetch it from global user object
ipcRenderer.on('inventory:data', function(event, siteIndex, inventoryIndex){
	// Store indexes locally for later use
	siteindex = siteIndex;
	inventoryindex = inventoryIndex;
	
	// Get selected inventory from global user object
	inventorydata = remote.getGlobal('globaluser').responsibilities[siteIndex].inventories[inventoryIndex];
	
	// Print inventory data to screen
	document.getElementById("inventory-number").innerHTML = inventorydata.number;
	document.getElementById("inventory-name").innerHTML = inventorydata.name;
	document.getElementById("inventory-manufacturer").innerHTML = inventorydata.manufacturer;
	document.getElementById("inventory-model").innerHTML = inventorydata.model;
	document.getElementById("inventory-serial").innerHTML = inventorydata.serial;
});
