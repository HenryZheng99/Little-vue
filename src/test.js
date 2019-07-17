window.vm = new Vue({
    el: '#app',
    data: {
        text:'Vue',
        time: new Date(),
        title: {
            greeting: ['h', 'e', 'l', 'l', 'o', '!'],
        }
    }
});

setInterval(() => {
    vm.$data.time = new Date();
}, 1000);