var appVars = {
    title: "Das ist mein Titel",
    content: "Das ist mein Content",
    animals: [
        { text: "Hund", quantity: 1 },
        { text: "Katze", quantity: 2 },
        { text: "Maus", quantity: 3 },
    ],
    currItem: ""
};
document.addEventListener("DOMContentLoaded", () => {
    new Vue({
        el: "#app",
        data: appVars,
        methods: {
            addItem() {
                if (appVars.currItem != "") {
                    appVars.animals.push({
                        text: appVars.currItem,
                        quantity: 1
                    });
                    appVars.currItem = "";
                }
            },
            removeItem(index) {
                appVars.animals.splice(index, 1);
            },
            incItem(index) {
                appVars.animals[index].quantity++;
            },
            decItem(index) {
                if (!(appVars.animals[index].quantity <= 1)) {
                    appVars.animals[index].quantity--;
                }
            }
        },
        computed: {
            amountAnimals() {
                var sumAnimals = 0;
                appVars.animals.forEach(element => {
                    sumAnimals += element.quantity;
                });
                return sumAnimals;
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
