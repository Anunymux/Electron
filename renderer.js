"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
console.log('in renderer');
const toastr = require('toastr');
const fsa = require('async-file');
if (typeof jQuery == "undefined") {
    alert("jQuery is not installed");
}
else {
    console.log('jQuery is installed');
}
$(document).ready(function () {
    console.log("ready!");
    toastr.info('Hi!');
    document.ondragover = document.ondrop = (ev) => {
        ev.preventDefault();
    };
    document.body.ondrop = (ev) => {
        ReadFileFromDrop(ev);
    };
});
function ReadFileFromDrop(ev) {
    return __awaiter(this, void 0, void 0, function* () {
        var file = ev.dataTransfer.files[0];
        toastr.info(`ReadFileFromDrop:${file.name}`);
        console.log(file.path);
        var fileContent = yield fsa.readFile(file.path).catch((reason) => {
            if (reason.code == 'EISDIR') {
                alert('Drag and drop ist nur für Dateien vorgesehen.');
            }
            else {
                alert(reason.message);
            }
        });
        $('#droppedContent').text(fileContent);
        ev.preventDefault();
    });
}
function PresentErrorNicely(errMessage) {
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
    toastr["error"](errMessage, 'An error has ocured');
}
process.on('uncaughtException', function (err) {
    PresentErrorNicely(err);
});
