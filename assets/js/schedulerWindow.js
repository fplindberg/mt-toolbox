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

// Fill local schedule variable with schedule from global user object
const responsibilities = remote.getGlobal('globaluser').responsibilities;
var scheduledata = [];
for(i = 0,  len = responsibilities.length; i < len; ++i){
	const scheduleobject = {
		site: responsibilities[i].site,
		date: responsibilities[i].date
	};
	scheduledata.push(scheduleobject);
}
loadSchedulerData();

// Function to fill schedule-list with user schedule
function loadSchedulerData(){
	var scheduleinputgroup, scheduleprepend, scheduleaddon, scheduleinput;
	const schedulelist = document.getElementById("schedule-list");
	// Clear old list
	schedulelist.innerHTML = '';
	// Append user schedule to schedule-form
	for(i = 0,  len = scheduledata.length; i < len; ++i){
		// Create parent div to add to schedule-list
		scheduleinputgroup = document.createElement('div');
		scheduleinputgroup.className = "input-group mb-2";
		
		// Create prepend div for inputgroup
		scheduleprepend = document.createElement('div');
		scheduleprepend.className = "input-group-prepend";
		
		// Create addon span for prepend div
		scheduleaddon = document.createElement('span');
		scheduleaddon.id = (scheduledata[i].site + "-addon");
		scheduleaddon.className = "input-group-text";
		scheduleaddon.innerHTML = scheduledata[i].site;
		
		// Create input field for inputgroup
		scheduleinput = document.createElement('input');
		scheduleinput.type = "date";
		scheduleinput.id = (scheduledata[i].site + "-field");
		scheduleinput.className = "form-control";
		scheduleinput.value = scheduledata[i].date;
		
		// Add addon span to prepend div
		scheduleprepend.appendChild(scheduleaddon);
		
		// Add prepend div and input field to input group
		scheduleinputgroup.appendChild(scheduleprepend);
		scheduleinputgroup.appendChild(scheduleinput);
		
		// Add input group to schedule-list
		schedulelist.appendChild(scheduleinputgroup);
	}
}
	
/*****************************************************************************/
/* Functions for communication with main process */
// Update global user object when save button is clicked
function submitSchedule(){
	// Fill scheduledata with entered dates from form
	for(i = 0,  len = scheduledata.length; i < len; ++i){
		// Read input fields
		scheduledata[i].date = document.getElementById(scheduledata[i].site + "-field").value;
		// Update global user object
		responsibilities[i].date = scheduledata[i].date;
	}
	// Close window after data is submitted
	closeWindow();
}

// Function to issue a close command to main process to close this window
function closeWindow(){
	ipcRenderer.send('close:window');
}
