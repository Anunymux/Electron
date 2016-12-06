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
	
	document.ondragover = document.ondrop = (ev) => {
		ev.preventDefault()
	}
	
	document.body.ondrop = (ev) => {
		ReadFileOffsetFromDrop(ev)
	}

	$('#reloadButton').on('click', () => {
		PopulateContentFromFile($('#infoFilePath').text())
	})

	$('#selByteRange').on('change', () => {
		PopulateRangeInputs()
	})
});

function PopulateRangeInputs(){
	var selElement:string = $('#selByteRange').val()
	
	if ($('#infoFileLength').text() == '') {
		alert('Please drop a file first and then click refresh.')
		return
	}

	var length:number = parseInt($('#infoFileLength').text())
	var fromRange:number = 0
	var tilRange:number = 0

	console.log(selElement)
	console.log(length)

	if (selElement == 'first') {	
		fromRange=0
		tilRange=10000
	}

	if (selElement == 'middle') {	

		fromRange=Math.round(length / 2)
		tilRange=fromRange + 10000
	}

	if (selElement == 'end') {	
		fromRange=length - 10000
		tilRange=length
	}

	$('#bytesFrom').val(fromRange)
	$('#bytesTil').val(tilRange)

}

function ReadFileOffsetFromDrop(ev:DragEvent){
	toastr.clear()
	var file:File = ev.dataTransfer.files[0]

	$('#infoFileName').text(file.name)
	$('#infoFilePath').text(file.path)
	$('#infoFileLength').text(file.size)

	PopulateContentFromFile(file.path)
}

function PopulateContentFromFile(filePath:string){
	
	var bytesFrom:string = $('#bytesFrom').val()
	var bytesTil:string = $('#bytesTil').val()
	var regOnlyNumbers:RegExp = /^[0-9]+$/g;

	if (!!bytesFrom.match(regOnlyNumbers) == false) { //Wenn Input nicht nur Zahlen ist...
		alert(`Please only use numbers. ${bytesFrom} is not valid. Thank you.`)
		return
	}

	if (!!bytesTil.match(regOnlyNumbers) == false) { //Wenn Input nicht nur Zahlen ist...
		alert(`Please only use numbers. ${bytesTil} is not valid. Thank you.`)
		return
	}

	var start = parseInt(bytesFrom)
	var end = parseInt(bytesTil)

	console.log(`${start} - ${end}`)

	//Test if range is too high and if it even makes sense to read content

	if (end - start > 100000) {
		alert('The selected range is too high and would take too long to process.')
		return
	}

	var filePartOfContent:fs.ReadStream = fs.createReadStream(filePath, {start: start, end: end})
	var data:string = ''

	filePartOfContent.on('data', (chunk) => {
		data += chunk
	})
	
	filePartOfContent.on('end', () => {
		$('#droppedContent').text(data)
		$("#reloadButton").notify('Done', {
			elementPosition:"right",
			className:"success",
			autoHideDelay: 1000,
			hideDuration:0,
			showDuration:0
		})
	})

	filePartOfContent.on('error', (err: NodeJS.ErrnoException) => {		
		if (err.code == 'EISDIR') {
			alert('Drag and Drop is not supported for folders.')
			return
		}
		if (err.code == 'ENOENT') {
			alert('Please select a file first using drag and drop.')
			return
		}
		
		PresentErrorNicely(err)
	})
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