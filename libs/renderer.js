"use strict";
console.log('in renderer');
const toastr = require('toastr');
const fs = require('fs');
if (typeof jQuery == "undefined") {
    alert("jQuery is not installed");
}
else {
    console.log('jQuery is installed');
}
$(document).ready(() => {
    console.log("ready!");
    document.ondragover = document.ondrop = (ev) => {
        ev.preventDefault();
    };
    document.body.ondrop = (ev) => {
        ReadFileOffsetFromDrop(ev);
    };
    $('#reloadButton').on('click', () => {
        PopulateContentFromFile($('#infoFilePath').text());
    });
});
function ReadFileOffsetFromDrop(ev) {
    toastr.clear();
    var file = ev.dataTransfer.files[0];
    $('#infoFileName').text(file.name);
    $('#infoFilePath').text(file.path);
    $('#infoFileLength').text(file.size);
    PopulateContentFromFile(file.path);
}
function PopulateContentFromFile(filePath) {
    var bytesFrom = $('#bytesFrom').val();
    var bytesTil = $('#bytesTil').val();
    var regOnlyNumbers = /^[0-9]+$/g;
    if (!!bytesFrom.match(regOnlyNumbers) == false) {
        alert(`Bitte nur Zahlen für die Byteanzahl "von" verwenden. ${bytesFrom} ist nicht gültig. Danke.`);
        return;
    }
    if (!!bytesTil.match(regOnlyNumbers) == false) {
        alert(`Bitte nur Zahlen für die Byteanzahl "bis" verwenden. ${bytesTil} ist nicht gültig. Danke.`);
        return;
    }
    var start = parseInt(bytesFrom);
    var end = parseInt(bytesTil);
    console.log(`${start} - ${end}`);
    //Test if range is too high and if it even makes sense to read content
    if (end - start > 100000) {
        alert('Die Range ist zu groß und würde zu lange dauern.');
        return;
    }
    var filePartOfContent = fs.createReadStream(filePath, { start: start, end: end });
    var data = '';
    filePartOfContent.on('data', (chunk) => {
        data += chunk;
    });
    filePartOfContent.on('end', () => {
        $('#droppedContent').text(data);
        $("#reloadButton").notify('Done', {
            elementPosition: "right",
            className: "success",
            autoHideDelay: 1000,
            hideDuration: 0,
            showDuration: 0
        });
    });
    filePartOfContent.on('error', (err) => {
        if (err.code == 'EISDIR') {
            alert('Drag and Drop wird für Ordner nicht unterstützt.');
            return;
        }
        PresentErrorNicely(err);
    });
}
function PresentErrorNicely(err) {
    toastr.options = {
        "newestOnTop": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "999999",
        "hideDuration": "999999",
        "timeOut": "0",
        "extendedTimeOut": "0",
        "closeButton": true,
        "tapToDismiss": false,
        "progressBar": false
    };
    toastr["error"](err.message, 'An error has ocured');
}
process.on('uncaughtException', function (err) {
    PresentErrorNicely(err);
    console.log(err);
});
