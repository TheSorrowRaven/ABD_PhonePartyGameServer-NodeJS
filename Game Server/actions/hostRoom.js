
const d = document

const pRoomCode = d.querySelector('#pRoomCode')
const divMessenger = d.querySelector('#divMessenger')

var RoomCode

d.querySelector('#buttonHostRoom').addEventListener('click', () => {
    wsSend({
        req: 'hostRoom'
    }, (res) => {
        console.log(res.hostRoom.code)
        pRoomCode.textContent = `Room Code: ${res.hostRoom.code}`
        RoomCode = res.hostRoom.code
        buttonStartGame.hidden = false
        divMessenger.hidden = false
    })
})
