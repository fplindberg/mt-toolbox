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
const fs = require('fs');

// Import users data from JSON-file of received server data
const usersfilepath = './config/users.json';
var users = [];
fs.readFile(usersfilepath, 'utf-8', (error, data) => {
	if(error) throw error;
	
	// Converting JSON-data to Javascript-object
	users = JSON.parse(data);
});

// Local variable to store user data for successful logged on user
var userdata;

// Initiation of tooltips
$(function(){
	$('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
	$('[data-toggle="tooltip"]').on('click', function(){
		$(this).tooltip('hide')
	});
});

// Bind the Enter-key to login button
$(document).keypress(function(e){
    if (e.which == 13){
        $("#login-button").click();
    }
});

/*****************************************************************************/
/* Functions for communication with main process */
// Try to login with entered authentication credentials when login button is clicked
function tryLogin(){
	// Get entered username and password
	const username = document.getElementById("username-field").value;
	const password = document.getElementById("password-field").value;
	
	// Creating alert message
	var alertmessage;
	const alertmessagebox = document.getElementById("message-box");
	alertmessage = document.createElement('div');
	alertmessage.className = "alert alert-danger fade show";
	alertmessage.role = "alert";
	alertmessage.innerHTML = "A simple danger alert—check it out!";
	
	// Try authentication credentials against server
	for(i = 0,  len = users.length; i < len; ++i){
		if(users[i].username === username){
			if(users[i].password === password){
				// If successful, fetch profile data from user
				alertmessagebox.innerHTML = '';
				userdata = users[i].profile;
				
				// Add profile data to global user object
				remote.getGlobal('globaluser').profile = userdata;
				
				// Signal successful login with IPC, this closes the window
				ipcRenderer.send('login:successful');
			}
			else{
				// If password is wrong, notify user
				alertmessage.innerHTML = "Ogiltigt lösenord - Försök igen";
				alertmessagebox.innerHTML = '';
				alertmessagebox.appendChild(alertmessage);
			}
			break;
		}
		else if(i === (len-1)){
			// If username is wrong, notify user
			alertmessage.innerHTML = "Ogiltigt användarnamn - Försök igen";
			alertmessagebox.innerHTML = '';
			alertmessagebox.appendChild(alertmessage);
		}
	}
}

// Function to close window when back button is clicked
function closeWindow(){
	ipcRenderer.send('close:window');
}
