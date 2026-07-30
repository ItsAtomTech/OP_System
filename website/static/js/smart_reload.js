//Auto reload Script by Atomtech v1.0

async function connectSR() {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${location.host}/ws`);
	
	await sleep(500); //Wait for few moments before reloading
	
    ws.onmessage = function(event) {
        if (event.data === "reload") {
            location.reload();
			
        }
    };
    ws.onclose = function() {
        setTimeout(connectSR, 2000);
    };
}
connectSR();
