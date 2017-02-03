require("electron-connect").client.create();
console.log('in renderer');
var toastr = require('toastr');
if (typeof jQuery == "undefined") {
    alert("jQuery is not installed");
}
else {
    console.log('jQuery is installed');
}
var appVars = {
    status: "not implemented yet",
    player: {
        health: 100,
        armor: 100,
        stamina: 100,
        hunger: 0,
        thirst: 0
    },
    hacks: {
        unlimitedRes: false
    }
};
var appMethods = {
    testButtonClass: () => {
        appVars.hacks.unlimitedRes = !appVars.hacks.unlimitedRes;
    },
    showError: () => {
        throw DOMException;
    }
};
var appComputedProperties = {};
document.addEventListener("DOMContentLoaded", () => {
    console.log("ready");
    new Vue({
        el: "#app",
        data: appVars,
        methods: appMethods,
        computed: appComputedProperties
    });
});
function PresentErrorNicely(err) {
    toastr.options = {
        "newestOnTop": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "closeButton": true,
        "tapToDismiss": false,
        "progressBar": false
    };
    toastr["error"](err.message, `An error has occured. Check console for more info.`);
}
process.on('uncaughtException', function (err) {
    PresentErrorNicely(err);
    console.log(`Uncaught exception:`);
    console.log(err);
});
