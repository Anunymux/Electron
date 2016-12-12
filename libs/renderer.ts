console.log('in renderer')

const toastr = require('toastr')

import fs = require('fs')
import * as fsa from 'async-file'

var appVars = {
	testArray:['blub', 'bla', 'bam'],
	testArraySize:0,
	myName:'Johannes',
	newName:'',
	droppedFile:{
		name:'nothing dropped yet',
		length:0,
		path:'nothing dropped yet',
		range:{
			bytesFrom:0,
			bytesTil:10000
		},
		content:''
	},
	selected:"first 10k"
}

document.addEventListener("DOMContentLoaded", () => {
	
	console.log("ready!")
	
	new Vue({
		el: '#wrapper',
		data: appVars,
		methods:{
			addName(){
				appVars.testArray.push(appVars.newName)
				appVars.newName=''
				appVars.testArraySize = appVars.testArray.length
			},
			reloadFile(){
				PopulateContentFromFile(appVars.droppedFile.path)
			}
		},
		computed:{
			
		}
	})

	document.ondragover = document.ondrop = (ev) => {
		ev.preventDefault()
	}
	
	document.body.ondrop = (ev) => {
		ReadFileOffsetFromDrop(ev)
	}

	//Todo change to vue
	$('#selected').on('change', () => {
		PopulateRangeInputs()
	})
	//Todo change to vue
	$('#selected').on('click', () => {
		CheckForValidInput()
	})

})

if (typeof jQuery == "undefined") {
	alert("jQuery is not installed")
}else{
	console.log('jQuery is installed')
}

function CheckForValidInput(){
	if(appVars.droppedFile.length == 0){
		alert('Please drop a file first and then click refresh.')
		appVars.selected == 'first'
		return
	}
}

function ClearFields(){
	appVars.droppedFile.range.bytesFrom = 0
	appVars.droppedFile.range.bytesTil = 10000
	appVars.selected = 'first 10k'
	appVars.droppedFile.content = ''
}

function PopulateRangeInputs(){

	var minRange:number = 0

	if (appVars.droppedFile.length > 10000) {
		minRange = 10000
	} else if (appVars.droppedFile.length > 1000) {
		minRange = 1000
	}else if (appVars.droppedFile.length > 100){
		minRange = 100
	}else if (appVars.droppedFile.length > 10){
		minRange = 10
	}else if (appVars.droppedFile.length > 1){
		minRange = 1
	}else{
		minRange = 0
	}

	if (appVars.selected == 'first 10k') {	
		appVars.droppedFile.range.bytesFrom = 0
		appVars.droppedFile.range.bytesTil = 10000
	}

	if (appVars.selected == 'middle') {	
		appVars.droppedFile.range.bytesFrom = Math.round(appVars.droppedFile.length / 2) - minRange
		appVars.droppedFile.range.bytesTil = Math.round(appVars.droppedFile.length / 2)
	}

	if (appVars.selected == 'end') {	
		appVars.droppedFile.range.bytesFrom = appVars.droppedFile.length - minRange
		appVars.droppedFile.range.bytesTil = appVars.droppedFile.length
	}
}

function ReadFileOffsetFromDrop(ev:DragEvent){
	toastr.clear()

	ClearFields()

	var file:File = ev.dataTransfer.files[0]

	appVars.droppedFile.name = file.name
	appVars.droppedFile.length = file.size
	appVars.droppedFile.path = file.path

	PopulateContentFromFile(file.path)
}

function PopulateContentFromFile(filePath:string){
	
	var regOnlyNumbers:RegExp = /^[0-9]+$/g;

	if (!!appVars.droppedFile.range.bytesFrom.toString().match(regOnlyNumbers) == false) { //Wenn Input nicht nur Zahlen ist...
		alert(`Please only use numbers, ${appVars.myName}. ${appVars.droppedFile.range.bytesFrom} is not valid. Thank you.`)
		return
	}

	if (!!appVars.droppedFile.range.bytesTil.toString().match(regOnlyNumbers) == false) { //Wenn Input nicht nur Zahlen ist...
		alert(`Please only use numbers, ${appVars.myName}. ${appVars.droppedFile.range.bytesTil} is not valid. Thank you.`)
		return
	}

	console.log(`${appVars.droppedFile.range.bytesFrom} - ${appVars.droppedFile.range.bytesTil}`)

	//Test if range is too high and if it even makes sense to read content

	if (appVars.droppedFile.range.bytesTil - appVars.droppedFile.range.bytesFrom > 100000) {
		alert('The selected range is too high and would take too long to process.')
		return
	}

	var filePartOfContent:fs.ReadStream = fs.createReadStream(filePath, {start: appVars.droppedFile.range.bytesFrom, end: appVars.droppedFile.range.bytesTil})
	var data:string = ''

	filePartOfContent.on('data', (chunk) => {
		data += chunk
	})
	
	filePartOfContent.on('end', () => {

		appVars.droppedFile.content = data
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
			alert(`Drag and Drop is not supported for folders, ${appVars.myName}.`)
			return
		}
		if (err.code == 'ENOENT') {
			alert(`Please select a file first using drag and drop, ${appVars.myName}.`)
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

	toastr["error"](err.message, `An error has ocured, ${appVars.myName}.`)
}

process.on('uncaughtException', function (err:NodeJS.ErrnoException) { 
    PresentErrorNicely(err)
	console.log(err)
})