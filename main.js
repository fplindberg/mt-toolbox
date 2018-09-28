/* Electron-app functionality imports and variable initiation */
const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const {app, BrowserWindow, Menu, ipcMain} = electron;

global.globaluser = {
	profile: {},
	responsibilities: []
};

// SET ENV
process.env.NODE_ENV = 'production';

// Window initiation
let loginWindow;
let mainWindow;
let acWindow;
let pmWindow;
let inventoryWindow;
let profileWindow;
let schedulerWindow;
let summaryWindow;

/*****************************************************************************/
/* App starting and initiation */
// Listen for app to be ready, create login window as first window
app.on('ready', function(){
	// Create new window
	loginWindow = new BrowserWindow({
		backgroundColor: '#a1887f',
		width: 500,
		height: 500,
		minWidth: 500,
		minHeight: 500,
		title: 'Inloggning',
		show: false
	});
	
	// Let window load before showing
	loginWindow.once('ready-to-show', () => {
		loginWindow.show();
		loginWindow.focus();
	});
	
	// Load html into window
	loginWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'loginWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	
	// Garbage collection handleEvent
	loginWindow.on('closed', function(){
		loginWindow = null;
	});
	
	// Add toolbar if not in prod
	if(process.env.NODE_ENV !== 'production'){
		// Build menu from template
		const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
		
		// Insert menu
		Menu.setApplicationMenu(mainMenu);
	}
	else{
		Menu.setApplicationMenu(null);
	}
});

function createMainWindow(){
	// Create a new window
	mainWindow = new BrowserWindow({
		backgroundColor: '#a1887f',
		width: 595,
		height: 842,
		minWidth: 595,
		minHeight: 842,
		title: 'MT-Toolbox',
		show: false
	});
	
	// Let window load before showing
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});
	
	// Load html into window
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	
	// Get window close event, return focus to parent
	mainWindow.on('close', function(){
		mainWindow.hide();
	});
	
	// Quit app when closed
	mainWindow.on('closed', function(){
		mainWindow = null;
		app.quit();
	});
}

/*****************************************************************************/
/* Window creation functions associated with Main window (Toolbox) */
// Function to create window for profile editing
function createProfileWindow(){
	// Create a new window
	profileWindow = new BrowserWindow({
		backgroundColor: '#FFFFFF',
		width: 400,
		height: 500,
		minWidth: 400,
		minHeight: 500,
		title: 'Hantera profil',
		show: false,
		parent: mainWindow,
		modal: true
	});
	
	// Let window load before showing
	profileWindow.once('ready-to-show', () => {
		profileWindow.show();
		profileWindow.focus();
	});
	
	// Load html into window
	profileWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'profileWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	
	// Get window close event, return focus to parent
	profileWindow.on('close', function(){
		profileWindow.hide();
		mainWindow.show();
		mainWindow.focus();
	});
	
	// Garbage collection handleEvent
	profileWindow.on('closed', function(){
		inventoryWindow = null;
	});
}

// Function to create window for schedule editing
function createSchedulerWindow(){
	// Create a new window
	schedulerWindow = new BrowserWindow({
		backgroundColor: '#a1887f',
		width: 500,
		height: 500,
		minWidth: 500,
		minHeight: 500,
		title: 'Hantera bokningar',
		show: false,
		parent: mainWindow,
		modal: true
	});
	
	// Let window load before showing
	schedulerWindow.once('ready-to-show', () => {
		schedulerWindow.show();
		schedulerWindow.focus();
	});
	
	// Load html into window
	schedulerWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'schedulerWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	
	// Get window close event, return focus to parent
	schedulerWindow.on('close', function(){
		schedulerWindow.hide();
		mainWindow.show();
		mainWindow.focus();
	});
	
	// Garbage collection handleEvent
	schedulerWindow.on('closed', function(){
		schedulerWindow = null;
	});
}

/*****************************************************************************/
/* Window creation functions associated with Arrival control */
// Function to create window for Arrival control of new inventory
function createACWindow(){
	// Create a new window
	acWindow = new BrowserWindow({
		backgroundColor: '#a1887f',
		width: 1190,
		height: 842,
		minWidth: 1190,
		minHeight: 842,
		title: 'Ankomstkontrollsformulär',
		show: false,
		parent: mainWindow,
		modal: true
	});
	
	// Let window load before showing
	acWindow.once('ready-to-show', () => {
		acWindow.show();
		acWindow.focus();
	});
	
	// Load html into window
	acWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'acWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	
	// Get window close event, return focus to parent
	acWindow.on('close', function(){
		acWindow.hide();
		mainWindow.show();
		mainWindow.focus();
	});
	
	// Garbage collection handleEvent
	acWindow.on('closed', function(){
		acWindow = null;
	});
}

/*****************************************************************************/
/* Window creation functions associated with Preventive maintenance */
// Function to create window for preforming Preventive maintenance on site
function createPMWindow(){
	// Create a new window
	pmWindow = new BrowserWindow({
		backgroundColor: '#a1887f',
		width: 1280,
		height: 720,
		minWidth: 1280,
		minHeight: 720,
		title: 'FU-Planering',
		show: false,
		parent: mainWindow,
		modal: true
	});
	
	// Let window load before showing
	pmWindow.once('ready-to-show', () => {
		pmWindow.show();
		pmWindow.focus();
	});
	
	// Load html into window
	pmWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'pmWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	
	// Get window close event, return focus to parent
	pmWindow.on('close', function(){
		pmWindow.hide();
		mainWindow.show();
		mainWindow.focus();
	});
	
	// Garbage collection handleEvent
	pmWindow.on('closed', function(){
		pmWindow = null;
	});
}

// Function to create window for PM-service inventory status and test reporting
function createInventoryWindow(){
	// Create a new window
	inventoryWindow = new BrowserWindow({
		backgroundColor: '#a1887f',
		width: 600,
		height: 800,
		minWidth: 600,
		minHeight: 800,
		title: 'Inventarieinformation',
		show: false,
		parent: pmWindow,
		modal: true
	});
	
	// Let window load before showing
	inventoryWindow.once('ready-to-show', () => {
		inventoryWindow.show();
		inventoryWindow.focus();
	});
	
	// Load html into window
	inventoryWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'inventoryWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	
	// Get window close event, return focus to parent
	inventoryWindow.on('close', function(){
		inventoryWindow.hide();
		pmWindow.show();
		pmWindow.focus();
	});
	
	// Garbage collection handleEvent
	inventoryWindow.on('closed', function(){
		inventoryWindow = null;
	});
}

// Function to create window for PM-service protocol creation
function createSummaryWindow(){
	// Create a new window
	summaryWindow = new BrowserWindow({
		backgroundColor: '#a1887f',
		width: 595,
		height: 842,
		minWidth: 595,
		minHeight: 842,
		title: 'Resultatsammanfattning',
		show: false,
		parent: pmWindow,
		modal: true
	});
	
	// Let window load before showing
	summaryWindow.once('ready-to-show', () => {
		summaryWindow.show();
		summaryWindow.focus();
	});
	
	// Load html into window
	summaryWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'summaryWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	
	// Get window close event, return focus to parent
	summaryWindow.on('close', function(){
		summaryWindow.hide();
		pmWindow.show();
		pmWindow.focus();
	});
	
	// Garbage collection handleEvent
	summaryWindow.on('closed', function(){
		summaryWindow = null;
	});
}

/*****************************************************************************/
/* Main toolbox IPC-communication section */
// Catch login:successful
ipcMain.on('login:successful', function(event){
	// Fetch user responsibilities and store to global user responsibilities
	fs.readFile('./config/datatransmit.json', 'utf-8', (error, data) => {
		if(error) throw error;
		
		// Converting JSON-data to Javascript-object
		global.globaluser.responsibilities = JSON.parse(data);
		
		//console.log(global.globaluser);
	});
	
	// Open mainWindow
	createMainWindow();
	
	// When opened
	mainWindow.webContents.once('did-finish-load', () => {
		mainWindow.webContents.send('profile:update');
		// Close login window
		const win = BrowserWindow.fromWebContents(event.sender);
		win.close();
	});
});

// Catch open:profile
ipcMain.on('open:profile', function(event){
	createProfileWindow();
});

// Catch open:scheduler
ipcMain.on('open:scheduler', function(event){
	createSchedulerWindow();
});

// Catch update:profile, this doesn't close sender window
ipcMain.on('update:profile', function(event){
	// Send command to callers parent window for visual update of profile
	mainWindow.webContents.send('profile:update');
});

/*****************************************************************************/
/* Arrival control IPC-communication section */
// Catch open:ac
ipcMain.on('open:ac', function(event){
	createACWindow();
});

/*****************************************************************************/
/* Preventive maintenance IPC-communication section */
// Catch open:pm
ipcMain.on('open:pm', function(event){
	createPMWindow();
});

// Catch open:inventory
ipcMain.on('open:inventory', function(event, siteIndex, inventoryIndex){
	createInventoryWindow();
	// Send object indexes to opened window
	inventoryWindow.webContents.once('did-finish-load', () => {
		inventoryWindow.webContents.send('inventory:data', siteIndex, inventoryIndex);
	});
});

// Catch open:summary
ipcMain.on('open:summary', function(event, siteIndex){
	createSummaryWindow();
	// Send object index to opened window
	summaryWindow.webContents.once('did-finish-load', () => {
		summaryWindow.webContents.send('summary:data', siteIndex);
	});
});

// Catch update:inventory, this doesn't close sender window
ipcMain.on('update:inventory', function(event, siteIndex, inventoryIndex){
	// Send command to callers parent window for visual update of inventory
	pmWindow.webContents.send('inventory:update', siteIndex, inventoryIndex);
});

// Catch update:site, this doesn't close sender window
ipcMain.on('update:site', function(event, siteIndex){
	// Send command to callers parent window for visual update of site
	pmWindow.webContents.send('site:update', siteIndex);
});

// Catch store:report, this closes sender window
ipcMain.on('store:report', function(event, pdfPath){
	const win = BrowserWindow.fromWebContents(event.sender);
	
	win.webContents.printToPDF({marginsType: 0, printBackground: true, pageSize: 'A4'}, (error, data) => {
		if(error) throw error;
		fs.writeFile(pdfPath, data, (error) => {
			if(error) throw error;
			win.close();
		});
	});
});

/*****************************************************************************/
/* Common IPC-communication section */
// Catch close:window
ipcMain.on('close:window', function(event){
	const win = BrowserWindow.fromWebContents(event.sender);
	win.close();
});

// Catch save:file, converting js data file to json data file
/*ipcMain.on('save:file', function(event, item){
	const filePath = ('./backup/amena.json');
	const data = JSON.stringify(item, null, '\t');
	fs.writeFile(filePath, data, (error) => {
		if(error) throw error;
		console.log('Write file successfully.');
	});
});*/

/*****************************************************************************/
// Create main menu template
const mainMenuTemplate = [
	{
		label:'File',
		submenu:[
			{
				label:'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	},
	{
		label: 'Developer Tools',
		submenu:[
			{
				label: 'Toggle DevTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	}
];
