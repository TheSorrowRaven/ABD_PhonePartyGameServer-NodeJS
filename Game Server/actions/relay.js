
const divRelay = d.querySelector('#divRelay')
const inputMessenger = d.querySelector('#inputMessenger')
const buttonSendMessenger = d.querySelector('#buttonSendMessenger')

function writeRelay(res) {
    let data = res.data
    text = ""
    if (!data.player) {
        text = "Game Host: "
    }
    else {
        text = data.player.name + ": "
    }
    text += data.text

    let p = d.createElement('p')
    p.textContent = text
    divRelay.appendChild(p)
}

buttonSendMessenger.addEventListener('click', () => {
    let text = inputMessenger.value
    wsSend({
        ctx: {
            roomCode: RoomCode
        },
        req: 'relayAll',
        data: {
            text: text
        }
    }, () => {

    })
})
