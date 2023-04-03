
const buttonPlayFictionary = d.querySelector('#buttonPlayFictionary')
const divFictionary = d.querySelector('#divFictionary')

buttonPlayFictionary.addEventListener('click', () => {
    console.log("fictionary")
    playFictionary()
})

function playFictionary() {
    wsSend({
        ctx: {
            roomCode: RoomCode
        },
        req: 'fictionary'
    }, (res) => {
        divFictionary.hidden = false
    })
}