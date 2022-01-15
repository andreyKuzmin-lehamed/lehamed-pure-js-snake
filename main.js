'use strict'

const DEFAULT_CELL_COLOR = "rgb(10, 202, 129)"
const SNAKE_CELL_COLOR = "rgb(16, 70, 207)"
const EAT_CELL_COLOR = "rgb(255 62 217 / 82%)"
const FIELD_CONTAINER = document.getElementById("field")
const FIELD = []
const WIDTH = 25
const HEIGHT = 25
const DIFFICULT = 20

let GameCycleInterval

let Scores = 0
let SnakeBodyCells = []
let Current_cell
let Eat_X
let Eat_Y
let X = 0
let Y = 0
let Direction = "right"
let SnakeLength = 1

Init()

function Init() {
    document.addEventListener("keydown", changeDirection)
    createField(WIDTH,HEIGHT) 
    Current_cell = FIELD[0][0]
    Current_cell.style.backgroundColor = SNAKE_CELL_COLOR
    SnakeBodyCells.push(Current_cell)
    randomSpawnEat()

    play()

}

function randomSpawnEat() {
    let isSnakeCell = true
    while (isSnakeCell) {
        Eat_X = Math.floor(Math.random() * HEIGHT);
        Eat_Y = Math.floor(Math.random() * WIDTH);
        if (FIELD[Eat_Y][Eat_X].style.backgroundColor !== DEFAULT_CELL_COLOR) {
            console.log("NEED NEW EAT PLACE!")
            continue
        }
        FIELD[Eat_Y][Eat_X].style.backgroundColor = EAT_CELL_COLOR
        return
    }
}

function changeDirection(e) {
    switch (e.code) {
        case "KeyD": 
            Direction = Direction === "left" ? "left" : "right"
            break;
        case "KeyA": 
            Direction = Direction === "right" ? "right" : "left"
            break;
        case "KeyW": 
            Direction = Direction === "down" ? "down" : "up"
            break;
        case "KeyS": 
            Direction = Direction === "up" ? "up" : "down"
            break;
    }
}

function createField(width, height) {
    FIELD_CONTAINER.style.width = width * 20 + "px"
    FIELD_CONTAINER.style.height = height * 20 + "px"
    for (let h = 0; h < height; h++) {
        const row = []
        for (let w = 0; w < width; w++) {
            const cell = document.createElement("div")
            cell.classList.add("cell")
            cell.style.backgroundColor = DEFAULT_CELL_COLOR
            FIELD_CONTAINER.appendChild(cell)
            row.push(cell)
        }
        FIELD.push(row)
    }
}

function snakeMove() {
    let nextCell

    if (!Current_cell) {
        nextCell = FIELD[X][Y]
    } else {
        nextCell
        switch (Direction) {
            case "left":
                X--
                break;
            case "right":
                X++
            break;
            case "up":
                Y--
            break;
            case "down":
                Y++
            break
        }
    }


    if (Y === HEIGHT) Y = 0
    if (Y === -1) Y = HEIGHT - 1
    if (X === WIDTH) X = 0
    if (X === -1) X = WIDTH - 1


    if (Y === Eat_Y && X === Eat_X) {
        SnakeLength++
        Scores++
        setScore(Scores)
        randomSpawnEat()
    }

    console.log(FIELD[Y][X].style.backgroundColor)
    console.log(SNAKE_CELL_COLOR)
    if (FIELD[Y][X].style.backgroundColor === SNAKE_CELL_COLOR) {
        gameOver()
    }

    nextCell = FIELD[Y][X]
    nextCell.style.backgroundColor = SNAKE_CELL_COLOR

    const cells_for_decoloration = SnakeBodyCells.slice(SnakeLength)
    for (let i = 0; i < cells_for_decoloration.length; i++) {
        cells_for_decoloration[i].style.backgroundColor = DEFAULT_CELL_COLOR
    }
    SnakeBodyCells = SnakeBodyCells.slice(0,SnakeLength)

    SnakeBodyCells.unshift(nextCell)
    Current_cell = nextCell
}

function gameOver() {
    Scores = 0
    setScore(0)
    clearInterval(GameCycleInterval)
    X = 0
    Y = 0
    Direction = "right"
    SnakeLength = 1
    SnakeBodyCells = []
    FIELD_CONTAINER.innerHTML = ""
    FIELD.length = 0
    Init()
}

function setScore(score) {
    document.getElementById("scores").innerText = score
}

function pause() {
    if (GameCycleInterval) clearInterval(GameCycleInterval)
}

function play() {
    clearInterval(GameCycleInterval)
    GameCycleInterval = setInterval(()=>{
        try {
            snakeMove()
        } catch {
            gameOver()
        }
    },1000 / DIFFICULT)
}

function restart() {
    gameOver()
}