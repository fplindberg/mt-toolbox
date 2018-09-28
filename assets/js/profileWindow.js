/* Imports to enable Bootstrap javascript-lib */
window.jQuery = window.$ = require('jquery');
window.Popper = require('popper.js/dist/umd/popper.min.js');
require('bootstrap/dist/js/bootstrap.min.js');

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

// Fill local profile variable with profile from global user object
var profiledata = remote.getGlobal('globaluser').profile;
loadUserData();

// Function to print saved user data to input fields, used by dismiss button
function loadUserData(){
	document.getElementById("name-field").value = profiledata.name;
	document.getElementById("title-field").value = profiledata.title;
	document.getElementById("place-field").value = profiledata.place;
	document.getElementById("signature-field").value = profiledata.signature;
}
	
/*****************************************************************************/
/* Functions for communication with main process */
// Update global user object when save button is clicked
function submitProfile(){
	// Read input fields
	profiledata.name = document.getElementById("name-field").value;
	profiledata.title = document.getElementById("title-field").value;
	profiledata.place = document.getElementById("place-field").value;
	profiledata.signature = document.getElementById("signature-field").value;
	// Update global user object
	remote.getGlobal('globaluser').profile = profiledata;
	
	// Issue update:profile command to parent window for visual update
	ipcRenderer.send('update:profile');
	
	// Close window after data is submitted
	closeWindow();
}

// Function to issue a close command to main process to close this window
function closeWindow(){
	ipcRenderer.send('close:window');
}
