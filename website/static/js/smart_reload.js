//Auto reload Script by Atomtech v1.0
// - A seme react like way to hot reload a focused or top element page.

let AUTO_RELOAD = localStorage.getItem("watchDogStart");

async function connectSR() {
	if(!AUTO_RELOAD){
		return;
	}

	
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${location.host}/ws`);
	
	await sleep(500); //Wait for few moments before reloading
	
    ws.onmessage = function(event) {
        if (event.data === "reload") {
			if(isIframeCovered()){
				console.log("Skiped hot reload for "+ location.pathname);
				return false;
			}		
			console.log(event.data +" event to "+ location.pathname);
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


// Detect if the Current Element is Covered
function isIframeCovered() {
  try {
    const parentDoc = window.parent.document;
    
    // Find this iframe element in the parent
    const iframes = parentDoc.querySelectorAll('iframe');
    const thisIframe = Array.from(iframes).find(
      (iframe) => iframe.contentWindow === window
    );

    if (!thisIframe) return false;
    const rect = thisIframe.getBoundingClientRect();

    const points = [
      { x: rect.left + rect.width * 0.5,  y: rect.top + rect.height * 0.5  },
      { x: rect.left + rect.width * 0.25, y: rect.top + rect.height * 0.25 },
      { x: rect.left + rect.width * 0.75, y: rect.top + rect.height * 0.25 },
      { x: rect.left + rect.width * 0.25, y: rect.top + rect.height * 0.75 },
      { x: rect.left + rect.width * 0.75, y: rect.top + rect.height * 0.75 },
    ];

    for (const point of points) {
      const topElement = parentDoc.elementFromPoint(point.x, point.y);
      if (topElement && topElement !== thisIframe) {
        return true; // something is covering this iframe
      }
    }

    return false;
  } catch (e) {
    console.warn('Cross-origin parent, cannot detect overlay:', e);
    return null;
  }
}