console.log('in renderer')

if (typeof jQuery == "undefined") {
	alert("jQuery is not installed");
}else{
	console.log('jQuery is installed')
}

const fs = require('fs')

$( document ).ready(function() {
	console.log("ready!")

	document.ondragover = document.ondrop = (ev) => {
		ev.preventDefault()
	}
	
	document.body.ondrop = (ev) => {
		var file = ev.dataTransfer.files[0]
		console.log(file.path)		
		//console.log(`Inhalt: ${fs.readFileSync(file.path)}`)
		//$('#droppedContent').text(fs.readFileSync(file.path))
		fs.readFile(file.path, function (err, logData) {
			if (err) {
				if (err.code == 'EISDIR') {
					alert('Drag and drop ist nur für Dateien vorgesehen.')
				} else {
					alert(err.message)
				}
			}else{ 
				// logData is a Buffer, convert to string.
				var text = logData.toString()
				$('#droppedContent').text(text)
			}
		})
		ev.preventDefault()
	}
});




