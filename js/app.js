// The speed of the enemies, starting at 100 and incrementing as the levels go on
let enemySpeed = 100;
//added default places for player and enemy to move
const boardPlaces = {
    line : {
        1: 55,
        2: 140,
        3: 220,
        4: 310,
        5: 400
    },
    column: {
        1: 0,
        2: 100,
        3: 200,
        4: 303,
        5: 405
    }
};
//array containing previous occupied cells by an obstacle or collectible
let occupiedPositions = [];
//array to hold all enemies present on the board
let allEnemies = [];
//array to hold all obstacles on the board
let obstacles = [];
//level variable
let currentLevel = 1;
//gameover status to end the game or restart it
let gameOverStatus = false;
//variable to to know when the user chosed the sprite and the game is ready to start
let gameReady = false;
//function to check if a cell is available to not have a collectible overlap an obstacle
const checkBoard = function() {
    const target = this;
    occupiedPositions.forEach(function checkElements(el) {
        while(target.line == el.line && target.col == el.col){
            target.line = getRandomLine();
            target.col = getRandomCol();
            checkElements(el);
        }
    });
    occupiedPositions.push({line: this.line, col: this.col});
};
//get a random col in the action area(stone blocks)
function getRandomCol() {
    return Math.floor(Math.random() * 5) + 1;
}
//get a rondom line in the action area(stone blocks)
function getRandomLine() {
    return Math.floor(Math.random() * 3) + 1;
}
// create an obsatcle
function createObstacle() {
    return new Obstacle();
}
// create an enemy
function createEnemy() {
    randomStartingPoint = -Math.floor(Math.random() * 3 ) * 50;
    randomLine = Math.floor(Math.random() * 3 ) +1;
    return new Enemy(randomStartingPoint, boardPlaces.line[randomLine]);
}
// Enemies our player must avoid
var Enemy = function(x = 0,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    let speed = Math.floor(Math.random() * 3) * enemySpeed;
    this.speed = speed === 0 ? enemySpeed : speed;
    this.y = y;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.speed === 0){
        this.speed = enemySpeed;
    }
    this.x += dt * this.speed;
    if (this.x > 550){
        this.x = -150;
        this.speed = Math.floor(Math.random() * 3) * enemySpeed;
    }
    //Detect collisions with the player
    if(this.y == player.y && (this.x >= player.x-70 && this.x <= player.x+80)){
        //Reset player position
        player.reset();
        player.lives -= 1;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.col = 3;
    this.line = 5;
    this.score = 0;
    this.lives = 3;
};

Player.prototype.update = function() {
    this.x = boardPlaces.column[this.col];
    this.y = boardPlaces.line[this.line];
    // Action for when the gem is collected
    if(this.line == gem.line && this.col == gem.col){
        gem.line = -1;
        gem.col = -1;
        this.score += gem.sprite == 'images/Gem Blue.png' ? 50 : gem.sprite == 'images/Gem Green.png' ? 60 : gem.sprite == 'images/Gem Orange.png' ? 70 : gem.sprite == 'images/Heart.png' && this.lives == 3 ? 30 : 0;
        this.lives += gem.sprite == 'images/Heart.png' && this.lives < 3 ? 1 : 0;
    }
};
// Reset the player position
Player.prototype.reset = function() {
    this.col = 3;
    this.line = 5;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(dir) {
    let target = this;
    //get the movement direction and no to get out of bounds
    if(dir == "left" && this.col > 1) {
        this.col --;
        obstacles.forEach(function(el) {
            if(el.col == target.col && el.line == target.line){
                target.col ++;
            }
        });
    }else if(dir == "right" && this.col < 5) {
        this.col ++;
        obstacles.forEach(function(el) {
            if(el.col == target.col && el.line == target.line){
                target.col --;
            }
        });
    }else if(dir == "up" && this.line >= 1) {
        this.line --;
        obstacles.forEach(function(el) {
            if(el.col == target.col && el.line == target.line){
                target.line ++;
            }
        });
    }else if(dir == "down" && this.line < 5) {
        this.line ++;
        obstacles.forEach(function(el) {
            if(el.col == target.col && el.line == target.line){
                target.line --;
            }
        });
    }
    if(this.line === 0) {
        this.win();
        obstacles.forEach(function(r) {
            r.change();
        });
        gem.change();
    }
};

//method that is run when the player reaches the goal and the level goes on
Player.prototype.win = function() {
    this.score += 100;
    currentLevel ++;
    //add an extra enemy and increase the speed by 25 every 20 levels
    if(currentLevel % 20 === 0 && allEnemies.length < 10){
        if(enemySpeed <= 200){
            enemySpeed += 25;
            allEnemies.push(createEnemy());
        }
    }
    //add a new obstacle every 15 levels
    if(currentLevel % 15 === 0){
        if(obstacles.length < 3 ){
            obstacles.push(createObstacle());
        }
    }
    this.reset();
};

//class for collectibles, gems and hearts
var Collectible = function() {
    this.change();
};

//when the level is passed the collectibles are regenerated
Collectible.prototype.change = function() {
    let randomColor = Math.floor(Math.random() * 6);
    let gemColor = ['images/Gem Orange.png', 'images/Gem Blue.png', 'images/Gem Green.png', 'images/Heart.png'];
    this.line = getRandomLine();
    this.col = getRandomCol();
    checkBoard.call(this);
    if(randomColor > 3){
        this.line = -1;
        this.col = -1;
        this.sprite = gemColor[0];
    }else {
        this.sprite = gemColor[randomColor];
    }
};

//update method like the one from Player and Enemy classes required for the engine
Collectible.prototype.update = function() {
    this.x = boardPlaces.column[this.col] + 20;
    this.y = boardPlaces.line[this.line] + 40;
};

//method to render the collectible
Collectible.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 60,110);
};

//separate class fro obstacles
var Obstacle = function() {
    this.sprite = 'images/Rock.png';
    this.change();
};

//method to update the position of the obstacle
Obstacle.prototype.update = function() {
    this.x = boardPlaces.column[this.col];
    this.y = boardPlaces.line[this.line] - 10;
};

//renders the obstacle
Obstacle.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//regenerates the obstacles when the level is passed
Obstacle.prototype.change = function() {
    this.line = getRandomLine();
    this.col = getRandomCol();
    checkBoard.call(this);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

//declase the player, initial enemies and one collectible that will change its status each level
const player = new Player();
const enemy1 = new Enemy(-180,boardPlaces.line[1]);
const enemy2 = new Enemy(-250,boardPlaces.line[2]);
const enemy3 = new Enemy(-120,boardPlaces.line[3]);
allEnemies.push(enemy1, enemy2, enemy3);
const gem = new Collectible();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'left',
        87: 'up',
        68: 'right',
        83: 'down'
    };
    //prevent the user to click the direction buttons when the game is over
    if(!gameOverStatus){
        player.handleInput(allowedKeys[e.keyCode]);
    }else{
        //when the enter key is pressed the game will restart
        if(e.keyCode == 13){
            player.score = 0;
            player.reset();
            player.lives = 3;
            currentLevel = 1;
            gem.change();
            enemy1 = new Enemy(-180,boardPlaces.line[1]);
            enemy2 = new Enemy(-250,boardPlaces.line[2]);
            enemy3 = new Enemy(-120,boardPlaces.line[3]);
            allEnemies.push(enemy1, enemy2, enemy3);
            gameOverStatus = false;
        }
    }
});