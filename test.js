function tester(){
    chrome.storage.sync.get("position", ({position})=>{
        alert(position);
    })
}
tester();
