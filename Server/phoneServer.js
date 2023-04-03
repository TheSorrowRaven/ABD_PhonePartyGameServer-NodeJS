
var rooms

function phoneServer(app, room) {
    rooms = room

    app.ws('/phoneServer', (ws, r) => {
        console.log('PS: Phone Server connection opened');
    
        ws.on('message', (msg) => {
            console.log(`PS: Received request: ${msg}`);
            let req = JSON.parse(msg)

            let res = {
                ctx: req.ctx
            }
            switch (req.req) {
                case 'hello':
                    res.hello = 'Hello from server!'
                    break
                case 'join':
                    joinRoom(req, res, ws)
                    break
                case 'relay':
                    relay(req, res)
                    break
                case 'relayAll':
                    relayAll(req, res)
                    break
                default:
                    res.error = 'Unknown request'
                    break
            }
            let resStr = JSON.stringify(res)
            console.log(`PS: Sending response: ${resStr}`);
            ws.send(resStr)
        });
    
        ws.on('close', () => {
            console.log('PS: WebSocket connection closed');
        });
    })

}

function joinRoom(req, res, pc) {
    if (req.join.code in rooms) {
        res.join = req.join
        let room = rooms[req.join.code]
        room.pc.push(pc)
        return
    }
    res.join = {
        error: 'Room Code Not Found'
    }
}

// Relay to GC
function relay(req, res) {
    let roomCode = req.ctx.roomCode

    let room = rooms[roomCode]
    let gcRes = {
        ctx: {
            roomCode: roomCode  
        },
        req: 'relay',
        data: req.data
    }
    let resStr = JSON.stringify(gcRes)
    room.gc.send(resStr)

    res.relay = {
        success: true
    }
}
// Relay to GC + all PC
function relayAll(req, res) {
    let roomCode = req.ctx.roomCode

    let room = rooms[roomCode]

    console.log(roomCode)
    console.log(room)
    let gcRes = {
        ctx: {
            roomCode: roomCode
        },
        req: 'relayAll',
        data: req.data
    }
    let resStr = JSON.stringify(gcRes)
    room.gc.send(resStr)

    room.pc.forEach((pc) => {
        let pcRes = {
            ctx: {
                roomCode: roomCode  
            },
            req: 'relay',
            data: req.data
        }
        let resStr = JSON.stringify(pcRes)
        pc.send(resStr)
    })

    res.relayAll = {
        success: true
    }
}

module.exports = {
    phoneServer
}
