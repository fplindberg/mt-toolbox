/* Imports to enable Bootstrap javascript-lib */
window.jQuery = window.$ = require('jquery');
window.Popper = require('popper.js/dist/umd/popper.min.js');
require('bootstrap/dist/js/bootstrap.min.js');

/*****************************************************************************/
/* Initiation of variables and tooltips */
// Loading required node.js modules
const electron = require('electron');
const {ipcRenderer} = require('electron');
const {remote} = require('electron');
const fs = require('fs');

// Initiation of tooltips
$(function(){
	$('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
	$('[data-toggle="tooltip"]').on('click', function(){
		$(this).tooltip('hide')
	});
});
	
// JSON-files for importing and exporting user data to server
const importfilepath = './config/datatransmitold.json'; // SHOULD BE './datareceive.json'
const exportfilepath = './config/datatransmitold.json';

// Counter variables for counting inventories
var approvedsummary = 0;
var remarksummary = 0;
var failedsummary = 0;
var remainingsummary = 0;

// Fill local user object with global user object
var user = remote.getGlobal('globaluser');

// Print sites to HTML-list
const sitelist = document.querySelector('#site-list');
const usersites = user.responsibilities;
loadItemsToList(sitelist, usersites, 'site');

// Update initial status for sites in list
var currentsite, currentsiteicon;
for(i = 0,  len = usersites.length; i < len; ++i){
	// Get initial site status and set class accordingly
	currentsite = document.getElementById(usersites[i].site);
	currentsiteicon = document.getElementById(usersites[i].site + "-icon");
	if(usersites[i].status === 'finished'){
		$(currentsite).removeClass('unfinished').addClass('finished');
		currentsiteicon.innerHTML = '<i class="material-icons">check</i>';
	}
	else if(usersites[i].status === 'unfinished'){
		currentsiteicon.innerHTML = '<i class="material-icons">chevron_right</i>';
	}
}
// Make site items clickable
sitelist.addEventListener('click', loadSite);

// Making inventorylist items clickable
const inventorylist = document.querySelector('#inventory-list');
inventorylist.addEventListener('click', openInventory);

/*// Initial loading of user profile
document.getElementById("user-name").innerHTML = user.profile.name;
document.getElementById("user-title").innerHTML = user.profile.title;*/

/*****************************************************************************/
/* Initiation of helper functions */
// Function to load counter values to HTML
function printCounters(){
	document.getElementById("approved-summary").innerHTML = approvedsummary;
	document.getElementById("remark-summary").innerHTML = remarksummary;
	document.getElementById("failed-summary").innerHTML = failedsummary;
	document.getElementById("remaining-summary").innerHTML = remainingsummary;
}

// Function to load data for inventory to HTML
function printInventory(inventory){
	// Get HTML-element from inventory number
	const currentinventory = document.getElementById(inventory.number);
	const currentinventoryicon = document.getElementById(inventory.number + "-icon");
	
	// Add or remove class from element depending on inventory status
	switch (inventory.status) {
		case 'approved':
			if($(currentinventory).hasClass('remark')){
				$(currentinventory).removeClass('remark');
				remainingsummary++;
				remarksummary--;
			}
			else if($(currentinventory).hasClass('failed')){
				$(currentinventory).removeClass('failed');
				remainingsummary++;
				failedsummary--;
			}
			if(!$(currentinventory).hasClass('approved')){
				$(currentinventory).addClass('approved');
				currentinventoryicon.innerHTML = '<i class="material-icons">check</i>';
				approvedsummary++;
				remainingsummary--;
			}
			break;
		case 'remark':
			if($(currentinventory).hasClass('approved')){
				$(currentinventory).removeClass('approved');
				remainingsummary++;
				approvedsummary--;
			}
			else if($(currentinventory).hasClass('failed')){
				$(currentinventory).removeClass('failed');
				remainingsummary++;
				failedsummary--;
			}
			if(!$(currentinventory).hasClass('remark')){
				$(currentinventory).addClass('remark');
				currentinventoryicon.innerHTML = '<i class="material-icons">priority_high</i>';
				remarksummary++;
				remainingsummary--;
			}
			break;
		case 'failed':
			if($(currentinventory).hasClass('approved')){
				$(currentinventory).removeClass('approved');
				remainingsummary++;
				approvedsummary--;
			}
			else if($(currentinventory).hasClass('remark')){
				$(currentinventory).removeClass('remark');
				remainingsummary++;
				remarksummary--;
			}
			if(!$(currentinventory).hasClass('failed')){
				$(currentinventory).addClass('failed');
				currentinventoryicon.innerHTML = '<i class="material-icons">close</i>';
				failedsummary++;
				remainingsummary--;
			}			
			break;
		default:
			currentinventoryicon.innerHTML = '<i class="material-icons">cached</i>';
			break;
	}
	// Update counters
	printCounters();
}

// Function to load site schedule data to HTML
function printSiteInventories(){
	// Get active site
	const activesite = $('#site-list .active').attr('id');
	const usersites = user.responsibilities;
	
	// Find site in user.responsibilities to load its inventories
	for(i = 0,  ilen = usersites.length; i < ilen; ++i){
		if(usersites[i].site === activesite){
			const siteinventories = usersites[i].inventories;
			approvedsummary = 0;
			remarksummary = 0;
			failedsummary = 0;
			remainingsummary = $('#inventory-list li').length;
			// Print each inventory found in site
			for(j = 0,  jlen = siteinventories.length; j < jlen; ++j){
				printInventory(siteinventories[j]);
			}
			break;
		}
	}
}

// Function to load site schedule data to HTML
function printSites(){
	// Get active site
	const activesite = $('#site-list .active').attr('id');
	const usersites = user.responsibilities;
	var currentsite, currentsiteicon;
	// Find site in user.responsibilities to load its data
	for(i = 0,  ilen = usersites.length; i < ilen; ++i){
		// Check site status and change if finished 
		currentsite = document.getElementById(usersites[i].site);
		currentsiteicon = document.getElementById(usersites[i].site + "-icon");
		if(usersites[i].status === 'finished'){
			$(currentsite).removeClass('unfinished').addClass('finished');
			currentsiteicon.innerHTML = '<i class="material-icons">check</i>';
		}
		else if(usersites[i].status === 'unfinished'){
			currentsiteicon.innerHTML = '<i class="material-icons">chevron_right</i>';
		}
		
		if(usersites[i].site === activesite){
			// Print site name and scheduled date on page
			document.getElementById("site-name").innerHTML = activesite;
			document.getElementById("date-scheduled").innerHTML = usersites[i].date;
			// Disable report-button if site is finished
			if(usersites[i].status === 'finished'){
				$('#report-button').addClass('disabled').prop('disabled', true);
			}
			// And enable it again if site is unfinished
			else if(usersites[i].status === 'unfinished'){
				$('#report-button').removeClass('disabled').prop('disabled', false);
			}
		}
	}
}

// Function to load a list of items to a HTML-list
function loadItemsToList(list, itemlist, item){
	var li, itemText, icon;
	// Clear old list
	list.innerHTML = '';
	list.className = 'list-group';
	// Append item from itemlist to list
	for(i = 0,  len = itemlist.length; i < len; ++i){
		li = document.createElement('li');
		li.className = 'list-group-item list-group-item-action';
		itemText = document.createTextNode(itemlist[i][item]);
		li.id = itemlist[i][item];
		icon = document.createElement('span');
		icon.id = (itemlist[i][item] + "-icon");
		icon.className = "float-right";
		icon.innerHTML = '<i class="material-icons">chevron_right</i>';
		li.appendChild(itemText);
		li.appendChild(icon);
		list.appendChild(li);
	}
}

/*****************************************************************************/
/* Function to load clicked site data to this window */
// Print inventory-list for selected site
function loadSite(event){
	var element = event.target;
	
	// Set active element in list
	$(element).closest('li').addClass('active').siblings().removeClass('active');
	
	const site = element.id;
	const inventorylist = document.querySelector('#inventory-list');

	for(i = 0,  len = user.responsibilities.length; i < len; ++i){
		// Look for selected site in user.responsibilities
		if(user.responsibilities[i].site === site){
			// Load inventories from site to inventory-list
			loadItemsToList(inventorylist, user.responsibilities[i].inventories, 'number');
			
			// If site already has class: finished, disable further editing
			if($(element).hasClass('finished')){
				$(inventorylist).children().addClass('disabled');
				$('.disabled').click(function(event){event.preventDefault()});
			}
			printSites();
			printSiteInventories();
			break;
		}
	}
}	

/*****************************************************************************/
/* Functions to open other windows by sending IPC-messages */
// Open inventory for clicked item
function openInventory(event){
	// Do nothing if inventory is locked
	if(event.defaultPrevented) return;
	
	const inventory = event.target.id;
	const site = document.querySelector('#site-name').innerText;
	
	// Search for clicked inventory to send object
	for(i = 0, ilen = user.responsibilities.length; i < ilen; ++i){
		if(user.responsibilities[i].site === site){
			var inventoryitem;
			for(j = 0, jlen = user.responsibilities[i].inventories.length; j < jlen; ++j){
				inventoryitem = user.responsibilities[i].inventories[j];
				if(inventoryitem.number === inventory){
					// Found inventory in list, now send it with IPC
					ipcRenderer.send('open:inventory', i, j);
					break;
				}
			}
		}
	}
}

// Open summary of result from site when send-result-button is clicked
function openSummary(event){
	// Loading inventory information for opened site
	const loadedsite = document.getElementById("site-name").innerText;
	var summarysite;
	// If string is not empty, search for site in user.responsibilities
	if(loadedsite){
		const usersites = user.responsibilities;
		// Find site to send its data as summary
		for(i = 0,  len = usersites.length; i < len; ++i){
			// Send site data as summary if found
			if(usersites[i].site === loadedsite){
				summarysite = usersites[i];
				//ipcRenderer.send('open:summary', summarysite);
				ipcRenderer.send('open:summary', i);
				break;
			}
		}
	}
}

// Function to close window when back button is clicked
function closeWindow(){
	ipcRenderer.send('close:window');
}

/*****************************************************************************/
/* Functions to define IPC-messages to listen for */
// Catch inventory:update to update HTML for inventory
ipcRenderer.on('inventory:update', function(event, siteIndex, inventoryIndex){
	// Get inventory from global user object
	const inventory = remote.getGlobal('globaluser').responsibilities[siteIndex].inventories[inventoryIndex];
	// Reload inventory
	printInventory(inventory);
});

// Catch inventory:update to update HTML for inventory
ipcRenderer.on('site:update', function(event, siteIndex, inventoryIndex){
	// Make sites inventory items disabled for further clicking
	$('#inventory-list').children().addClass('disabled');
	$('.disabled').click(function(event){event.preventDefault()});
	
	// Reload site
	printSites();
	
	/*// Converting Javascript-object to JSON-data update site data to file
	const exportdata = JSON.stringify(user, null, '\t');
	
	// Update export JSON-file with updated user data
	fs.writeFile(exportfilepath, exportdata, (error) => {
		if(error) throw error;
	});*/
});
