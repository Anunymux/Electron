console.log('in renderer')

const toastr = require('toastr')

import fs = require('fs')
import * as fsa from 'async-file';

if (typeof jQuery == "undefined") {
	alert("jQuery is not installed")
}else{
	console.log('jQuery is installed')
}

$( document ).ready( () => {
	console.log("ready!")
	toastr.info('Hi!')

	document.ondragover = document.ondrop = (ev) => {
		ev.preventDefault()
	}
	
	document.body.ondrop = (ev) => {
		//ReadFileFromDrop(ev)
		ReadFileOffsetFromDrop(ev)
	}
});

function ReadFileOffsetFromDrop(ev:DragEvent){
	toastr.clear()
	var file:File = ev.dataTransfer.files[0]
	toastr.info(`ReadFileFromDrop:${file.name}`)


	var bytesFrom:string = $('#bytesFrom').val()
	var bytesTil:string = $('#bytesTil').val()
	var regOnlyNumbers:RegExp = /^[0-9]+$/g;

	if (!!bytesFrom.match(regOnlyNumbers) == false) { //Wenn Input nicht nur Zahlen ist...
		alert(`Bitte nur Zahlen für die Byteanzahl "von" verwenden. ${bytesFrom} ist nicht gültig. Danke.`)
		return
	}

	if (!!bytesTil.match(regOnlyNumbers) == false) { //Wenn Input nicht nur Zahlen ist...
		alert(`Bitte nur Zahlen für die Byteanzahl "bis" verwenden. ${bytesTil} ist nicht gültig. Danke.`)
		return
	}

	var start = parseInt(bytesFrom)
	var end = parseInt(bytesTil)

	console.log(`${start} - ${end}`)

	var filePartOfContent:fs.ReadStream = fs.createReadStream(file.path, {start: start, end: end});
	var data:string = ''

	filePartOfContent.on('data', (chunk) => {
		data += chunk
	})
	
	filePartOfContent.on('end', () => {
		$('#droppedContent').text(data)
		toastr['success']('DONE')
	})

	filePartOfContent.on('error', (err: NodeJS.ErrnoException) => {
		if (err.code == 'EISDIR') {
			alert('Drag and Drop wird für Ordner nicht unterstützt.')
			return
		}
		PresentErrorNicely(err)
	})
}

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

function PresentErrorNicely(err:NodeJS.ErrnoException){
	
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

	toastr["error"](err.message, 'An error has ocured')
}

process.on('uncaughtException', function (err:NodeJS.ErrnoException) { 
    PresentErrorNicely(err)
	console.log(err)
})