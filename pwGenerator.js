"use strict";
console.log('in renderer');
const toastr = require('toastr');
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
        symbolic: true,
        mixedCase: true,
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
                var pwString;
                pw.push(ReturnRnd('abcdefghijklmnopqrstuvwxyz', 2));
                if (appVars.pw.mixedCase) {
                    pw.push(ReturnRnd('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 2));
                }
                if (appVars.pw.numeric) {
                    pw.push(ReturnRnd('0123456789', 2));
                }
                if (appVars.pw.symbolic) {
                    pw.push(ReturnRnd(appVars.pw.selectedSymbols.join(""), 2));
                }
                pw = _.shuffle(pw);
                pwString = pw.join("");
                /*console.log(pwString)*/
                pwString = ShuffleStr(pwString);
                console.log(pwString);
            }
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
