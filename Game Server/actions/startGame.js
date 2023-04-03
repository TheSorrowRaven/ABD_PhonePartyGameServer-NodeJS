
const buttonStartGame = d.querySelector('#buttonStartGame')
const divGameList = d.querySelector('#divGameList')

buttonStartGame.addEventListener('click', () => {
    wsSend({
        ctx: {
            roomCode: RoomCode
        },
        req: 'startGame'
    }, (res) => {
        if (res.error) {
            console.error('Failed to start game')
            return
        }
        console.log('Game started')
        divGameList.hidden = false
    })
})
