
var rooms

function gameServer(app, room) {
    rooms = room

    app.ws('/gameServer', (ws, r) => {
        console.log('GS: Game Server connection opened');

        ws.on('message', (msg) => {
            console.log(`GS: Received request: ${msg}`);
            let req = JSON.parse(msg)

            let res = {
                ctx: req.ctx
            }
            switch (req.req) {
                case 'hello':
                    res.hello = 'Hello from server!'
                    break
                case 'hostRoom':
                    createHostRoom(req, res, ws)
                    break
                case 'startGame':
                    startGame(req, res)
                    break
                case 'fictionary':
                    startFictionary(req, res)
                    break
                case 'relayAll':
                    relayAll(req, res)
                    break
                default:
                    res.error = 'Unknown request'
                    break
            }
            let resStr = JSON.stringify(res)
            console.log(`GS: Sending response: ${resStr}`);
            ws.send(resStr)
        });

        ws.on('close', () => {
            console.log('GS: WebSocket connection closed');
        });
    });

}

// relay to all pc
function relayAll(req, res) {
    let roomCode = req.ctx.roomCode

    let room = rooms[roomCode]
    room.pc.forEach((pc) => {
        let pcRes = {
            ctx: {
                roomCode: roomCode  
            },
            req: 'relayAll',
            data: req.data
        }
        let resStr = JSON.stringify(pcRes)
        pc.send(resStr)
    })

    res.relayAll = {
        success: true
    }
}

function createHostRoom(req, res, gc) {
    let code = generateRandomString();
    rooms[code] = {
        active: true,
        code: code,
        gc: gc,
        pc: []
    }

    res.hostRoom = {
        code: code
    }
}

function generateRandomString() {
    let result = '';
    const length = 4;
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        const randomChar = charSet.charAt(randomIndex);
        result += randomChar;
    }

    return result;
}

function startGame(req, res) {
    let roomCode = req.ctx.roomCode

    let room = rooms[roomCode]
    room.pc.forEach((pc) => {
        let pcRes = {
            ctx: {
                roomCode: roomCode  
            },
            req: 'startGame'
        }
        let resStr = JSON.stringify(pcRes)
        pc.send(resStr)
    })

    res.startGame = {
        success: true
    }

}

function startFictionary(req, res) {
    let roomCode = req.ctx.roomCode

    let room = rooms[roomCode]
    room.pc.forEach((pc) => {
        let pcRes = {
            ctx: {
                roomCode: roomCode
            },
            req: 'fictionary'
        }
        let resStr = JSON.stringify(pcRes)
        pc.send(resStr)
    })

    res.fictionary = {
        success: true
    }
}

module.exports = {
    gameServer
}