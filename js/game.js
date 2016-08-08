var game = new Phaser.Game(1200, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
})

var background
var platforms
var player
var cursors
var sprite
var weapon
var fireButton
var cat
var bullet
var ledgeGroup
var hitCount = 0

function preload() {
  game.load.image('background', 'assets/forest.png')
  game.load.image('ground', 'assets/platform.png')
  game.load.image('rocks', 'assets/rocks.png')
  game.load.image('bullet', 'assets/yarn.png')
  game.load.spritesheet('player', 'assets/abbey.png', 21.27, 36)
  game.load.spritesheet('cat', 'assets/cat.png', 62, 50, 6)
}

function addLedge (x, y, asset) {
	ledge = game.add.sprite(x, y, asset)
	game.physics.enable(ledge, Phaser.Physics.ARCADE)
	ledge.body.immovable = true
  ledge.body.allowGravity = false
	ledgeGroup.add(ledge)
}

function create() {
    //basic additions to get the game ready
    game.physics.startSystem(Phaser.Physics.ARCADE)
    cursors = this.input.keyboard.createCursorKeys()
    game.add.sprite(0, 0, 'background')
    platforms = game.add.group()
    platforms.enableBody = true

    //creating the ground
    var ground = platforms.create(0, game.world.height - 64, 'rocks')
    ground.body.immovable = true
    ground.scale.setTo(4, 2)

    //creating the floating ledges
    ledgeGroup = game.add.group()
    addLedge(400, 400, 'ground')
    addLedge(0, 250, 'ground')
    addLedge(600, 100, 'ground')

    //player properties
    player = game.add.sprite(48, 500, 'player')
    game.physics.arcade.enable(player)
    player.body.bounce.y = 0.1
    player.body.gravity.y = 350
    player.body.collideWorldBounds = true
    player.animations.add('left', [4, 3, 2, 1, 0], 5, true)
    player.animations.add('right', [6, 7, 8, 9, 10], 5, true)

    //yarn firing mechanics
    weapon = game.add.weapon(1, 'bullet')
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    weapon.bulletSpeed = 600
    weapon.trackSprite(player, 14, 20)
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)

    cat = game.add.sprite(300, 200, 'cat')
    var walkLeft = cat.animations.add('left', [0, 1, 2])
    var walkRight = cat.animations.add('right', [3, 4, 5])
    game.physics.arcade.enable(cat)
    cat.body.gravity.y = 400
    cat.body.collideWorldBounds = true
}

var catwalk = function () {
  if (cat.x < player.x) {
    cat.animations.play('right', 5, true)
    cat.x += 1
  }
  else if (cat.x > player.x ) {
      cat.animations.play('left', 5, true)
      cat.x -= 1
  }
}

function update() {
    if (fireButton.isDown && cursors.left.isDown)
    {
        weapon.fireAngle = 180
        weapon.fire()
    }
    else if (fireButton.isDown && cursors.right.isDown)
    {
        weapon.fireAngle = 0
        weapon.fire()
    }
    else if (fireButton.isDown)
    {
      weapon.fireAngle = 270
      weapon.fire()
    }

    game.physics.arcade.collide(player, platforms)
    game.physics.arcade.collide(player, ledgeGroup)
    game.physics.arcade.collide(cat, platforms)
    game.physics.arcade.collide(cat, ledgeGroup)
    game.physics.arcade.collide(weapon.bullets, cat, killCat, null, this)
    game.physics.arcade.overlap(player, cat, killPlayer, null, this)

    player.body.velocity.x = 0

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150
        player.animations.play('left')
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150
        player.animations.play('right')
    }
    else
    {
        player.animations.stop()
        player.frame = 5
    }
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350
    }
    catwalk()
}


function killCat () {
    hitCount++
    weapon.killAll()
    if (hitCount === 3) {
      cat.kill()
      var style = {font: "32px Arial", fill: "#15ed45", align: "center"}
      var dieText = this.game.add.text(game.camera.width/2, game.camera.height/2, 'YOU WIN', style)
      dieText.anchor.set(0.5)
      setTimeout(function(){
        game.state.restart();
      }, 3000)
    }
}

function killPlayer () {
    player.kill()
    var style = {font: "32px Arial", fill: "#ed1515", align: "center"}
    var dieText = this.game.add.text(game.camera.width/2, game.camera.height/2, 'YOU DIED', style)
    dieText.anchor.set(0.5)
    setTimeout(function(){
      game.state.restart();
    }, 3000)
}
