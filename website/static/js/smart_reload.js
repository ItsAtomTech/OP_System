//Auto reload Script by Atomtech v1.0

let AUTO_RELOAD = localStorage.getItem("watchDogStart");

async function connectSR() {
	if(!AUTO_RELOAD){
		return;
	}
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${location.host}/ws`);
	
	await sleep(500); //Wait for few moments before reloading
	
    ws.onmessage = function(event) {
		
			console.log(event.data +" event to "+ location.pathname);
		
        if (event.data === "reload") {
            location.reload();		
        }
    };
    ws.onclose = function() {
        setTimeout(connectSR, 2000);
    };
}
connectSR();

function hotReload(en=true){
	if(en){
		AUTO_RELOAD = 'true';
		connectSR();
		console.log("Auto Hot-Reload enabled!");
		localStorage.setItem("watchDogStart","true");
	}else{
		localStorage.removeItem("watchDogStart");
		AUTO_RELOAD = false;
	}
}
