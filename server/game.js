const { GRID_SIZE } = require('./constants')

module.exports = {
    initGame,
    gameLoop,
    getUpdatedVelocity,
}

function initGame() {
    const state = createGameState()
    randomFood(state)
    return state
}

function createGameState() {
    return {
        players: [{
            pos: {
                x: 3,
                y: 10,
            },
            vel: {
                x: 1,
                y: 0,
            },
            snake: [
                {x: 1, y: 10},
                {x: 2, y: 10},
                {x: 3, y: 10},
            ],
        }, {
            pos: {
                x: 18,
                y: 10,
            },
            vel: {
                x: 0,
                y: 0,
            },
            snake: [
                {x: 20, y: 10},
                {x: 19, y: 10},
                {x: 18, y: 10},
            ]

        }],
        food: {},
        gridsize: GRID_SIZE,
    }
}

function gameLoop(state) {
    if (!state) {
        return
    }

    const playerOne = state.players[0]
    const playerTwo = state.players[1]

    playerOne.pos.x += playerOne.vel.x
    playerOne.pos.y += playerOne.vel.y

    playerTwo.pos.x += playerTwo.vel.x
    playerTwo.pos.y += playerTwo.vel.y

    // if playerOne collides with the edge of the map
    if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE ) {
        return 2
    }

    // if playerTwo collides with the edge of the map
    if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRID_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y > GRID_SIZE ) {
        return 1
    }

    // if food is collected by playerOne
    if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
        playerOne.snake.push({...playerOne.pos})
        playerOne.pos.x += playerOne.vel.x
        playerOne.pos.y += playerOne.vel.y
        randomFood(state)
    }

    // if food is collected by playerTwo
    if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
        playerTwo.snake.push({...playerTwo.pos})
        playerTwo.pos.x += playerTwo.vel.x
        playerTwo.pos.y += playerTwo.vel.y
        randomFood(state)
    }

    // if the playerOne is moving
    if (playerOne.vel.x || playerOne.vel.y) {
        for (let cell of playerOne.snake) {
            // if playerOne collides with its own tail
            if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
                return 2
            }
        }

        // move playerOne via push pop
        playerOne.snake.push({ ...playerOne.pos })
        playerOne.snake.shift()
    }
    
    // if the playeTwo is moving
    if (playerTwo.vel.x || playerTwo.vel.y) {
        for (let cell of playerTwo.snake) {
            // if playerTwo collides with its own tail
            if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
                return 1
            }
        }

        // move playerTwo via push pop
        playerTwo.snake.push({ ...playerTwo.pos })
        playerTwo.snake.shift()
    }

    //no winner yet
    return false
}

function randomFood(state) {
    food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
    }

    //prevent food from spawning on top of playerOne
    for (let cell of state.players[0].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state)
        }
    }

    //prevent food from spawning on top of playerOne
    for (let cell of state.players[1].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state)
        }
    }

    state.food = food
}

function getUpdatedVelocity(keyCode) {
    switch (keyCode) {
        case 37: { // left
            return {x: -1, y: 0}
        }
        case 38: { // down
            return {x: 0, y: -1}
        }
        case 39: { // right
            return {x: 1, y: 0}
        }
        case 40: { // up
            return {x: 0, y: 1}
        }
    }
}