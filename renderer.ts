console.log('in renderer')

const toastr = require('toastr')

import fs = require('fs')
/*const fs = require('fs')*/


if (typeof jQuery == "undefined") {
	alert("jQuery is not installed")
}else{
	console.log('jQuery is installed')
}


$( document ).ready(function() {
	console.log("ready!")
	toastr.info('ready!')

	document.ondragover = document.ondrop = (ev) => {
		ev.preventDefault()
	}
	
	document.body.ondrop = (ev) => {
		//ReadFileFromDrop(ev)
		ReadFileFromDropAsync(ev)
	}
});

function ReadFileFromDrop(ev:DragEvent) {
	var file:File = ev.dataTransfer.files[0]
	console.log(file.path)	
		
	fs.readFile(file.path, function (err, logData) {
		if (err) {
			if (err.code == 'EISDIR') {
				alert('Drag and drop ist nur für Dateien vorgesehen.')
			} else {
				alert(err.message)
			}
		}else{ 
			var text:string = logData.toString()
			$('#droppedContent').text(text)
		}
	})
	ev.preventDefault()
}

function ReadFileFromDropAsync(ev:DragEvent){
	var file:File = ev.dataTransfer.files[0]
	console.log('ReadFileFromDropAsync')
	toastr.info('ReadFileFromDropAsync')
}

function PresentErrorNicely(errMessage:string){
	
	toastr.options = {
		"newestOnTop": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": false,
		"onclick": null, 
		"showDuration": "999999",
		"hideDuration": "999999",
		"timeOut":"0",
		"extendedTimeOut":"0",
		"closeButton":true,
		"tapToDismiss": false,
		"progressBar":false
	}

	toastr["error"](errMessage, 'An error has ocured')
}

process.on('uncaughtException', function (err:string) { 
    PresentErrorNicely(err)
})