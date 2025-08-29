const player = function (name, symbol, score) {
    return {name, symbol, score}
}

const gameBoard = (() => {

    const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [0, 4, 8],]

    const board = ["", "", "", "", "", "", "", "", "",]

    const getBoard = () => board;

    const setBoard = (index, symbol) => {
        if (board[index] === "") {
            board[index] = symbol;
        }
    };

    let turn = '1'
    const getTurn = () => turn
    const setTurn = (newTurn) => {
        turn = newTurn
    }

    let rounds = 1;
    let roundsPlayed = 1;
    const getRounds = () => rounds
    const setRounds = (newRounds) => {
        rounds = newRounds
    }
    const getPlayerRounds = () => roundsPlayed
    const addRound = () => {
        ++roundsPlayed
    }
    const restPlayedRounds = () => {
        roundsPlayed = 1
    }

    const restBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    const checkFull = () => {
        return board.every((element) => element !== "")
    }

    const checkWinner = () => {
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
                return board[a];
            }
        }
        return null;
    }

    return {
        getBoard,
        setBoard,
        restBoard,
        checkWinner,
        checkFull,
        getTurn,
        setTurn,
        getRounds,
        setRounds,
        addRound,
        getPlayerRounds,
        restPlayedRounds
    };
})()


const markIcon = {
    "x": `<i class="fa-solid fa-xmark"></i>`, "o": `<i class="fa-regular fa-o"></i>`
}

const color = {
    "x": `14bff3`, "o": `f3a514`
}

let player1
let player2

function setTurnBar(symbol) {
    const turnBar = document.querySelector(`.turn-bar`)
    if (symbol === "x") {
        turnBar.style.borderColor = '#14bff3'
        turnBar.innerHTML = `${markIcon["x"]}<p>Turn</p>`
        turnBar.children[0].style.color = '#14bff3'
        turnBar.children[0].style.textShadow = 'rgb(20, 191, 243) 1px 1px 20px'
    } else if (symbol === "o") {
        turnBar.style.borderColor = '#f3a514'
        turnBar.innerHTML = `${markIcon["o"]}<p>Turn</p>`
        turnBar.children[0].style.color = '#f3a514'
        turnBar.children[0].style.textShadow = 'rgb(243, 165, 20) 1px 1px 20px'
    }

}

async function showModal(type, winner) {
    const tieDialog = document.querySelector('.modal')
    const round = gameBoard.getRounds() + 1 >= gameBoard.getPlayerRounds()
    if (type === 'tie' && round) {
        tieDialog.innerText = 'It\'s A Tie, Let\'s Play Again'
        tieDialog.style.color = '#ffffff'
        tieDialog.style.textShadow = '#ffffff 1px 1px 10px'
        tieDialog.classList.add('show');
        await sleep(1500)
        tieDialog.classList.remove('show');
        await sleep(1000)
        tieDialog.innerText = ''
    } else if (type === 'win' && round) {
        if (winner === 'x') {
            tieDialog.innerText = 'X WIN!'
            tieDialog.style.color = '#14bff3'
            tieDialog.style.textShadow = '#14bff3 1px 1px 20px'
        } else if (winner === 'o') {
            tieDialog.innerText = 'O WIN!'
            tieDialog.style.color = '#f3a514'
            tieDialog.style.textShadow = '#f3a514 1px 1px 20px'
        }
        tieDialog.classList.add('show');
        await sleep(1500)
        tieDialog.classList.remove('show');
        await sleep(1000)
        tieDialog.innerText = ''
    } else if (type === 'final') {
        if (player1.score === player2.score) {
            tieDialog.innerText = 'FINAL ROUND: No One Win, Play Again'
            tieDialog.style.color = '#ffffff'
            tieDialog.style.textShadow = '#ffffff 1px 1px 10px'
            tieDialog.classList.add('show');
            await sleep(2000)
            tieDialog.classList.remove('show');
            await sleep(1000)
        } else if (player1.score > player2.score) {
            tieDialog.innerHTML = `<p>Player 1(${player1.symbol}) Win</p><p>${player1.symbol}: ${player1.score} VS ${player2.symbol}: ${player2.score}</p>`
            tieDialog.style.color = `#${color[player1.symbol]}`
            tieDialog.style.textShadow = `#${color[player1.symbol]} 1px 1px 20px`
            tieDialog.style.fontSize = '32px'
            tieDialog.classList.add('show');
            await sleep(2000)
            tieDialog.classList.remove('show');
            await sleep(1000)
        } else if (player2.score > player1.score) {
            tieDialog.innerHTML = `<p>Player 1(${player2.symbol}) Win</p><p>${player2.symbol}: ${player2.score} VS ${player1.symbol}: ${player1.score}</p>`
            tieDialog.style.color = `#${color[player2.symbol]}`
            tieDialog.style.textShadow = `#${color[player2.symbol]} 1px 1px 20px`
            tieDialog.style.fontSize = '32px'
            tieDialog.classList.add('show');
            await sleep(2000)
            tieDialog.classList.remove('show');
            await sleep(1000)
        }
    }
}

function updateRoundDisplay() {
    const rounds = gameBoard.getRounds()
    const roundsPlayed = gameBoard.getPlayerRounds()
    const roundDisplay = document.querySelector(`.round-p`)
    roundDisplay.textContent = `Round ${roundsPlayed} / (${rounds})`
}

function updateUserScore() {
    const userScore = document.querySelectorAll(`.user.score`)
    userScore[0].innerText = `${player1.score}`
    userScore[1].innerText = `${player2.score}`
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const buttonSigns = document.querySelectorAll(".btn.sign")
const turnBar = document.querySelector(`.turn-bar`)
buttonSigns.forEach(buttonSign => {
    buttonSign.addEventListener("click", async () => {
        let html = '';
        let symbol = '';
        let winnerTurn;
        const turn = gameBoard.getTurn()
        let index = Number(buttonSign.className.split(' ')[2])
        const board = gameBoard.getBoard()
        if (board[index] !== "") {
            return;
        }
        if (turn === '1') {
            html = markIcon[player1.symbol];
            symbol = player1.symbol
            gameBoard.setTurn('2')
            setTurnBar(player2.symbol)
        } else if (turn === '2') {
            html = markIcon[player2.symbol];
            symbol = player2.symbol
            gameBoard.setTurn('1')
            setTurnBar(player1.symbol)
        }
        gameBoard.setBoard(index, symbol)
        const winner = gameBoard.checkWinner()
        const isFull = gameBoard.checkFull()
        buttonSign.innerHTML = html;
        buttonSign.classList.add("clicked")
        buttonSign.classList.add(symbol)
        if (isFull && winner == null) {
            await showModal('tie')
            restBoard()
        } else if (winner != null) {
            if (player1.symbol === winner) {
                winnerTurn = 1
                ++player1.score
                setTurnBar(player1.symbol)
            } else if (player2.symbol === winner) {
                winnerTurn = 2
                ++player2.score
                setTurnBar(player2.symbol)
            }
            gameBoard.addRound()
            if (gameBoard.getRounds() >= gameBoard.getPlayerRounds()) {
                updateRoundDisplay()
            }
            updateUserScore()
            setTurnBar(winner)
            gameBoard.setTurn(`${winnerTurn}`)
            await showModal('win', winner)
            restBoard()
        } else {

        }

        const playedRounds = gameBoard.getPlayerRounds()
        const rounds = gameBoard.getRounds()


        if (rounds < playedRounds) {
            await showModal('final')

            fullRestart()
        }
    })
})

const symbolButtons = document.querySelectorAll(".player")
const xMark = document.querySelector(`.player.x.symbol`)
const oMark = document.querySelector(`.player.o.symbol`)
const h3 = document.querySelector(`h3`)

symbolButtons.forEach(button => {
    button.addEventListener("click", (e) => {

        const children = e.currentTarget.children[0]

        children.classList.add("clicked")
        if (children.className.includes("xmark")) {
            children.style.color = '#14bff3'
            e.currentTarget.style.backgroundColor = '#031022'
            oMark.style.backgroundColor = 'transparent'
            oMark.children[0].style.color = 'white'
            h3.innerHTML = `Player 1: X &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;Player 2: O`
            player1 = player('Player 1', 'x', 0)
            player2 = player('Player 2', 'o', 0)
        } else {
            children.style.color = '#f3a514'
            e.currentTarget.style.backgroundColor = '#031022'
            xMark.style.backgroundColor = 'transparent'
            xMark.children[0].style.color = 'white'
            h3.innerHTML = `Player 1: O &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;Player 2: X`
            player1 = player('Player 1', 'o', 0)
            player2 = player('Player 2', 'x', 0)
        }
        setTurnBar(player1.symbol)

    })
})
const dialog = document.querySelector('.start-menu')
const startButton = document.querySelector('.start-btn')

startButton.addEventListener('click', () => {
    const roundsInput = document.querySelector('.round-input')
    if (player1 === undefined || roundsInput.value === "") {
        alert('Please fill all forms')
        return;
    } else {
        gameBoard.setRounds(roundsInput.value)
        dialog.style.display = 'none'
    }
    updateRoundDisplay()
    const displayUsers = document.querySelectorAll('.display.user')

    displayUsers[0].innerHTML = `<p>Player</p><p class="user number">(1)</p>${markIcon[player1.symbol]}<div><p class="user score">0</p><p class="score-sub">score</p></div>`;
    displayUsers[1].innerHTML = `<p>Player</p><p class="user number">(2)</p>${markIcon[player2.symbol]}<div><p class="user score">0</p><p class="score-sub">score</p></div>`;

    for (const user of displayUsers) {
        user.children[2].style.fontSize = '36px'
    }
    displayUsers[0].children[2].style.color = `#${color[player1.symbol]}`
    displayUsers[1].children[2].style.color = `#${color[player2.symbol]}`
})

const restartButton = document.querySelector('.restart')
restartButton.addEventListener('click', () => {
    fullRestart()
})

function fullRestart() {
    const roundsInput = document.querySelector('.round-input')
    const symbolButtons = document.querySelectorAll(".player")
    for (const symbol of symbolButtons) {
        symbol.removeAttribute("style")
        symbol.children[0].removeAttribute("style")
    }
    restBoard()

    h3.innerText = 'Please Choose Your Symbol'
    gameBoard.restPlayedRounds()
    roundsInput.value = ''
    dialog.style.display = 'flex'
    turnBar.innerHTML = `<p>Turn</p>`
    turnBar.removeAttribute("style")
    setTurnBar(player1.symbol)
    gameBoard.setTurn('1')
    player1 = undefined
    player2 = undefined
}


function restBoard() {
    const buttonSigns = document.querySelectorAll(".btn.sign")
    buttonSigns.forEach((buttonSign) => {
        buttonSign.removeAttribute("style")
        buttonSign.classList.remove("o")
        buttonSign.classList.remove("x")
        buttonSign.classList.remove("clicked")
        buttonSign.innerHTML = ''
    })

    gameBoard.restBoard()
}