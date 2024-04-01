if('serviceWorker' in navigator){
    window.addEventListener('load', () => {
        navigator.serviceWorker.register("cached.js").then(reg => console.log(reg)).catch(err => console.log(`Error: ${err}`));
    })
}