# website/sockets.py
from . import sock, clients  # import the shared sock instance and clients list

print("[INFO] Sockets module loaded!")

@sock.route('/ws')
def ws_handler(ws):
    clients.append(ws)
    while True:
        msg = ws.receive()
        if msg is None:
            break
    clients.remove(ws)