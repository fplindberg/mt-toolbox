/* Imports to enable Bootstrap javascript-lib and autosize-lib */
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

// Local variable for user profile from global user object
var userprofile;

// Function to load user profile data to HTML
function printProfile(){
	userprofile = remote.getGlobal('globaluser').profile;
	document.getElementById("user-name").innerHTML = userprofile.name;
	document.getElementById("user-title").innerHTML = userprofile.title;
}
	
/*****************************************************************************/
/* Functions to open other windows by sending IPC-messages */
// Open Arrival control window when AC card is clicked
function openACForm(){
	ipcRenderer.send('open:ac');
}
// Open Preventive maintenance window when PM card is clicked
function openPMPlan(){
	ipcRenderer.send('open:pm');
}

// Open Profile window when profile button is clicked
function openProfile(){
	ipcRenderer.send('open:profile');
}

// Open Scheduler window when schedule button is clicked
function openScheduler(){
	ipcRenderer.send('open:scheduler');
}

// Function to close window when back button is clicked
function closeWindow(){
	ipcRenderer.send('close:window');
}

/*****************************************************************************/
/* Functions to define IPC-messages to listen for */
// Catch profile:update message to update profile HTML-elements
ipcRenderer.on('profile:update', function(event){
	// Update HTML profile data
	printProfile();
});
