console.log('in renderer')

if (typeof jQuery == "undefined") {
	alert("jQuery is not installed")
}else{
	console.log('jQuery is installed')
}

const fs = require('fs')
const readline = require('readline')

$( document ).ready(function() {
	PresentErrorNicely()
	console.log("ready!")

	document.ondragover = document.ondrop = (ev) => {
		ev.preventDefault()
	}
	
	document.body.ondrop = (ev) => {
		//ReadFileFromDrop(ev)
		ReadFileFromDropAsync(ev)
	}
});

function ReadFileFromDrop(ev) {
	var file = ev.dataTransfer.files[0]
	console.log(file.path)		
	
	fs.readFile(file.path, function (err, logData) {
		if (err) {
			if (err.code == 'EISDIR') {
				alert('Drag and drop ist nur für Dateien vorgesehen.')
			} else {
				alert(err.message)
			}
		}else{ 
			var text = logData.toString()
			$('#droppedContent').text(text)
		}
	})
	ev.preventDefault()
}

function ReadFileFromDropAsync(ev){
	var file = ev.dataTransfer.files[0]
	var lineReader = require('line-reader')

	console.log('ReadFileFromDropAsync')
	
	var lineByLine = require('n-readlines')
	var liner = new lineByLine(file.path)

	var line;
	var lineNumber = 0
	var lineMaxRead = 10

	while (line = liner.next()) {
		lineNumber++
		console.log(lineNumber + ':' + line.toString('ascii'))
		if (lineNumber >= lineMaxRead) {
			console.log(`lineMaxRead(${lineMaxRead}) erreicht.`)
			return
		}
	}
	console.log('end of line reached')
}

function PresentErrorNicely(){
	var toastr = require('toastr')
	toastr.info('Enjoy!')
}

