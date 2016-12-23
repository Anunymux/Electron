var appVars = {
    title:"Das ist mein Titel",
    content:"Das ist mein Content",
    items:[
        {text:"Hund"},
        {text:"Katze"},
        {text:"Maus"}
    ]
}

document.addEventListener("DOMContentLoaded", () => {
    new Vue({
        el:"#app",
        data:appVars,
        methods:{

        }
    })
})

