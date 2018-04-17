//Default Enemy speed
let defaultEnemySpeed = 150;
// level of difficulty will increase with progression of the game
let levelOfDifficulty = 3;
//added default places for player and enemy to move
let boardPlaces = {
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
}
//Player has 3 lives, colliding with enemies they are decremented, when zero, the game is reset
let lives = 3;
// Enemies our player must avoid
var Enemy = function(x = 0,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    let speed = Math.floor(Math.random() * levelOfDifficulty) * defaultEnemySpeed;
    this.speed = speed == 0 ? defaultEnemySpeed : speed;
    this.y = y;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.speed == 0){
        this.speed = defaultEnemySpeed;
    }
    this.x += dt * this.speed;
    if (this.x > 550){
        this.x = -150;
        this.speed = Math.floor(Math.random() * levelOfDifficulty) * defaultEnemySpeed;
    }
    //Detect collisions
    if(this.y == player.y && (this.x >= player.x-60 && this.x <= player.x+80)){
        //Reset player position
        player.col = 3;
        player.line = 5;
        lives -= 1;
    }
    if(lives == 0){
        alert("Game Over");
        location.reload();
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
    this.x = boardPlaces.column[3];
    this.col = 3;
    this.y = boardPlaces.line[5];
    this.line = 5;
}

Player.prototype.update = function() {
    this.x = boardPlaces.column[this.col];
    this.y = boardPlaces.line[this.line];
    
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(dir) {
    if(dir == "left" && this.col > 1) {
        this.col -= 1;
    }else if(dir == "right" && this.col < 5) {
        this.col += 1;
    }else if(dir == "up" && this.line > 1) {
        this.line -= 1;
    }else if(dir == "down" && this.line < 5) {
        this.line += 1;
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player();
let allEnemies = [];
let enemy1 = new Enemy(-180,boardPlaces.line[1]);
let enemy2 = new Enemy(-250,boardPlaces.line[2]);
let enemy3 = new Enemy(-120,boardPlaces.line[3]);
allEnemies.push(enemy1, enemy2, enemy3);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});