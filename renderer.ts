console.log('in renderer')

const toastr = require('toastr')

import fs = require('fs')
import * as fsa from 'async-file';

if (typeof jQuery == "undefined") {
	alert("jQuery is not installed")
}else{
	console.log('jQuery is installed')
}

$( document ).ready(function() {
	console.log("ready!")
	toastr.info('Hi!')

	document.ondragover = document.ondrop = (ev) => {
		ev.preventDefault()
	}
	
	document.body.ondrop = (ev) => {
		ReadFileFromDrop(ev)
	}
});

async function ReadFileFromDrop(ev:DragEvent) {
	var file:File = ev.dataTransfer.files[0]
	toastr.info(`ReadFileFromDrop:${file.name}`)
	console.log(file.path)	
		
	var fileContent:string = await fsa.readFile(file.path).catch( (reason:NodeJS.ErrnoException) => {
		if(reason.code == 'EISDIR'){
			alert('Drag and drop ist nur für Dateien vorgesehen.')
		} else {
			alert(reason.message)
		}
	})
	$('#droppedContent').text(fileContent)

	ev.preventDefault()
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