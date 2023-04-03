const serverUrl = "localhost:6969/gameServer"

const ws = new WebSocket(`ws://${serverUrl}`)
var wsActive = false
let requests = {}
let requestId = 0

ws.addEventListener('open', (event) => {
    console.log('GC: WebSocket connection opened');
    wsActive = true

    wsSend({
        req: 'hello'
    }, (msg) => {
        
    });
});

ws.addEventListener('message', (event) => {
    const res = event.data
    r = JSON.parse(res)
    console.log(r);

    if (res.error) {
        console.error(`On Message Failed: ${res.error}`)
        delete requests[r.ctx.id]

        return
    }
    
    if (r.ctx.id) {
        const fn = requests[r.ctx.id].fn
        delete requests[r.ctx.id]
        fn(r)
    }
    else if (r.ctx.roomCode) {
        switch (r.req) {
            case 'relay':
                writeRelay(r)
                break
            case 'relayAll':
                writeRelay(r)
                break
        }
    }

});

ws.addEventListener('close', (event) => {
    console.log('GC: sWebSocket connection closed');
    wsActive = false
});

function wsSend(req, callback) {
    if (!wsActive) {
        throw 'ws not Active!'
    }
    const id = requestId++
    if (!req.ctx) {
        req.ctx = {
            id: id
        }
    }
    else {
        req.ctx.id = id
    }
    requests[id] = { fn: callback }
    ws.send(JSON.stringify(req))
}