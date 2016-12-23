var appVars = {
    title: "Das ist mein Titel",
    content: "Das ist mein Content",
    items: ["Hund", "Katze", "Maus"],
    currItem: ""
};
document.addEventListener("DOMContentLoaded", () => {
    new Vue({
        el: "#app",
        data: appVars,
        methods: {
            addItem() {
                if (appVars.currItem != "") {
                    appVars.items.push(appVars.currItem);
                    appVars.currItem = "";
                }
            },
            removeItem(index) {
                appVars.items.splice(index, 1);
            }
        },
        filters: {
            capitalize(value) {
                return value.charAt(0).toUpperCase() + value.slice(1);
            },
            undercase(value) {
                return value.toLowerCase();
            }
        }
    });
});
