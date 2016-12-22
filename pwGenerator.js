"use strict";
console.log('in renderer');
const toastr = require('toastr');
const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberChars = '0123456789';
const _ = require("lodash");
if (typeof jQuery == "undefined") {
    alert("jQuery is not installed");
}
else {
    console.log('jQuery is installed');
}
var appVars = {
    pw: {
        length: 8,
        numeric: true,
        symbolic: false,
        upperCase: true,
        allowedSymbols: ['!', '$', '%', '&', '/', '(', ')', '=', '?', '{', '[', ']', '}', '+', '*', '#', '-', '_', '.', ':', ',', ';', '<', '>'],
        selectedSymbols: ['!', '$', '%', '&', '/', '(', ')', '=', '?', '{', '[', ']', '}', '+', '*', '#', '-', '_', '.', ':', ',', ';', '<', '>']
    }
};
document.addEventListener("DOMContentLoaded", () => {
    console.log("ready!");
    new Vue({
        el: '#wrapper',
        data: appVars,
        methods: {
            GeneratePW() {
                var pw = [];
                var pwReqString;
                var allowedMissingChars = lowerCaseChars;
                //first make sure that all required chars are used 
                pw.push(ReturnRnd(lowerCaseChars, 2));
                if (appVars.pw.upperCase) {
                    pw.push(ReturnRnd(upperCaseChars, 2));
                    allowedMissingChars += upperCaseChars;
                }
                if (appVars.pw.numeric) {
                    pw.push(ReturnRnd(numberChars, 2));
                    allowedMissingChars += numberChars;
                }
                if (appVars.pw.symbolic) {
                    pw.push(ReturnRnd(appVars.pw.selectedSymbols.join(""), 2));
                    allowedMissingChars += appVars.pw.selectedSymbols.join("");
                }
                pw = _.shuffle(pw);
                pwReqString = pw.join("");
                //add missing chars
                var missingChars = appVars.pw.length - pwReqString.length;
                pwReqString += ReturnRnd(allowedMissingChars, missingChars);
                pwReqString = ShuffleStr(pwReqString);
                /*console.log(`allowed additional chars: ${allowedMissingChars}`)*/
                console.log(pwReqString);
            },
            OnSymbolChange() {
                if (appVars.pw.selectedSymbols.length == 0) {
                    appVars.pw.symbolic = false;
                    appVars.pw.selectedSymbols = appVars.pw.allowedSymbols;
                }
            },
        },
        computed: {}
    });
    document.ondragover = document.ondrop = (ev) => {
        ev.preventDefault();
    };
    document.body.ondrop = (ev) => {
        ev.preventDefault();
    };
});
function Randomsort(a, b) {
    return Math.random() > .5 ? -1 : 1;
}
function ShuffleStr(text) {
    return text.split('').sort(Randomsort).join('');
}
function ReturnRnd(possibleChars, amount) {
    var letters = "";
    var possible = possibleChars;
    for (var i = 0; i < amount; i++) {
        letters += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return letters;
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
    toastr["error"](err.message, `An error has ocured.`);
}
process.on('uncaughtException', function (err) {
    PresentErrorNicely(err);
    console.log(err);
});
