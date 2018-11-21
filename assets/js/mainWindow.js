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

// Variable to store timestamp for SQL-sync
var timestamp = new Date();

// Initiation of tooltips
$(function(){
	$('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
	$('[data-toggle="tooltip"]').on('click', function(){
		$(this).tooltip('hide')
	});
});

// Load correct status to sync status indicator
function printSyncStatus(syncMessage){
	// Get SQL sync status
	const syncstatus = remote.getGlobal('syncstatus');
	
	// Get HTML-elements
	var statuselem = $("#status-indicator");
	
	// Status string
	var statusstring = ('Senaste synk: ' + timestamp.toLocaleString() + ' - ' + syncMessage);
	
	// Evaluate sync status to update HTML
	if(syncstatus === 'succeeded'){
		// Update button to match succeeded status
		statuselem.tooltip().attr('data-original-title', statusstring);
		
		// Update status indicator to match succeeded status
		statuselem.css("background-color", "#81c784");
	}
	else if(syncstatus === 'failed'){
		// Update button to match error status
		statuselem.tooltip().attr('data-original-title', statusstring);
		
		// Update status indicator to match error status
		statuselem.css("background-color", "#e57373");
	}
	else if(syncstatus === 'outdated'){
		// Update button to match outdated status
		statuselem.tooltip().attr('data-original-title', statusstring);
		
		// Update status indicator to match outdated status
		statuselem.css("background-color", "#ffd54f");
	}
}

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
/* Navbar buttons */
// Try to sync SQL server data when sync button is clicked
function sqlSync(){
	// Update timestamp variable
	timestamp = new Date();
	ipcRenderer.send('sql:sync');
}

// Open Scheduler window when schedule button is clicked
function openScheduler(){
	ipcRenderer.send('open:scheduler');
}

// Open Profile window when profile button is clicked
function openProfile(){
	ipcRenderer.send('open:profile');
}

// Function to close window when back button is clicked
function closeWindow(){
	ipcRenderer.send('close:window');
}

/* Cards */
// Open Arrival control window when AC card is clicked
function openACForm(){
	ipcRenderer.send('open:ac');
}
// Open Preventive maintenance window when PM card is clicked
function openPMPlan(){
	ipcRenderer.send('open:pm');
}

// Open Test importer window when Test importer card is clicked
function openTestImporter(){
	
}

/*****************************************************************************/
/* Functions to define IPC-messages to listen for */
// Catch profile:update message to update profile HTML-elements
ipcRenderer.on('profile:update', function(event){
	// Update HTML profile data
	printProfile();
});

// Catch sync:update message to update profile HTML-elements
ipcRenderer.on('sync:update', function(event, message){
	// Update sync status indicator
	printSyncStatus(message);
	console.log(message);
});
