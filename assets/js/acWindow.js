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

// Function to clear all filled text-fields
function clearData(){
	// Clear all radio button selections
	$('input[type=radio]:checked').each(function(){$(this).prop('checked', false)});
	
	// Clear all checkbox selections
	$('input[type=checkbox]:checked').each(function(){$(this).prop('checked', false)});
	
	// Clear all number fields
	$('input[type=number]').each(function(){$(this).val('')});
	
	// Clear all text fields
	$('input[type=text]').each(function(){$(this).val('')});
	
	// Clear all date fields
	$('input[type=date]').each(function(){$(this).val('')});
	
	// Clear all textareas
	$('textarea').each(function(){$(this).val('')});
	autosize.update(textareas);
	
	$('input[type=date]').val('');
}

// Function to close window when back button is clicked
function closeWindow(){
	ipcRenderer.send('close:window');
}
	
/*****************************************************************************/
/* Function to send IPC-message with edited data to mainWindow and save pdf */
// Save report and update user data when save button is clicked
function sendResult(){
	// Remove buttons from page to not include them in pdf report
	document.getElementById("buttons").innerHTML = '';
	
	// Remove placeholders from input to not include them in pdf report
	$(":input").attr('placeholder', '');
	$("input[type=date]").each(function(){
		if(!$(this).val()){
			$(this).addClass('dateremover');
		}
	});
	
	// Get MTA-nr, date and signature from form for creation for pdf-file
	var number = document.getElementById("number-field").value;
	var date = document.getElementById("date-field").value;
	var signature = document.getElementById("signature-field").value;
	
	// Catch empty form, for testing purpose only
	if(number === ''){
		number = '12345';
	}
	if(date === ''){
		date = '2018-09-11';
	}
	if(signature === ''){
		signature = 'fp';
	}
	
	// Issue store:report command to save pdf-report, this closes the window
	const pdfpath = ('./reports/arrival_control_reports/' + number + '_' + signature + '_' + date + '.pdf');
	ipcRenderer.send('store:report', pdfpath);
}
