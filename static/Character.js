/**
**	The base character of our game.
	Parent class of the different elemental Characters (Ice, Fire, Earth, Wind)
	****the different spells should be in respective subclasses;***
*/

class Character {
    
    var origin = window.location.origin;
    var socket = io.connect(origin);
    var socket_id;
    socket.on('connect', function() {
        socket_id = socket.id;
        socket.emit('newPlayer');
    });

    var otherPlayers = {};

    constructor() {
        this.health = 50;
        this.power = 50;
        this.mana = 50;
        this.speed = 50;
        this.stamina = 50;
        this.element = "none"; 
        this.sprite;
        this.weapon;
        this.DISPLAY = 150;
        this.HITBOX = 110;
        this.positionX;
        this.positionY;
        this.startPositionX = 100;
        this.startPositionY = 450;

        var self = this;
        socket.on('updatePlayers', function(server){
            for (var id in server){
                if(socket_id === id){
                    continue;
                }
                   
                if(!(id in otherPlayers)){
                        otherPlayers[id] = self.physics.add.sprite(100, 450, 'kitchenScene', 'mouse_walk/mouse_walk-2.png');
                        otherPlayers[id].displayWidth = DISPLAY;
                        otherPlayers[id].displayHeight = DISPLAY; 
                        otherPlayers[id].setSize(HITBOX, HITBOX);
                        otherPlayers[id].setOffset(125, 50);
                        otherPlayers[id].setCollideWorldBounds(true);
                        otherPlayers[id].body.setAllowGravity(false);
                        
                        self.physics.add.collider(otherPlayers, platforms);
                        self.physics.add.collider(otherPlayers, stars);
                        otherPlayers[id].x = server[id].position.x;
                        otherPlayers[id].y = server[id].position.y;
                        otherPlayers[id].rotation = server[id].rotation;
                        //otherPlayers[id] = otherPlayer;
                    }
               }
           });
	}

	printStat(){
        //alert("Creating " + this.element + " character!");
		alert("health: " + this.health + "\n"     
				+ "power: " + this.power + "\n"
				+ "mana: " + this.mana + "\n"
				+ "speed: " + this.speed + "\n"
				+ "element: " + this.element + "\n"
                + "stamina: " + this.stamina
				);
    }
    
    setWeapon(_weapon, context)
    {
        //TODO: this.weapon = _weapon;
            
    }
    
    initSprite() 
    {
        this.sprite.displayWidth = this.DISPLAY;
        this.sprite.displayHeight = this.DISPLAY;
        this.sprite.setSize(this.HITBOX, this.HITBOX);
        this.sprite.setOffset(125, 50);
        // when sprite lands after jumping it will bounce slightly
        //   player.setBounce(0.2);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setAllowGravity(false);
    }
    
    initWeapon()
    {
        
    }
    
    update(context)
    {
        this.updateRotation(context);
        this.updateMovement(context);
    }
    
    updateRotation(context)
    {
        var temp = this.sprite.getWorldTransformMatrix();
        
        var targetAngle =  Phaser.Math.Angle.Between(
        this.sprite.x, this.sprite.y,
        context.game.input.activePointer.worldX, context.game.input.activePointer.worldY);
          
        this.sprite.setRotation(targetAngle + Math.PI / 2);
    }
    
    updateMovement(context)
    {
          
        //left  
        if (context.cursors.left.isDown)
        {
           // player.setVelocityY(0);
            this.sprite.setVelocityX(-160);

            this.sprite.anims.play('left', true);
        }
        
        //right  
        else if (context.cursors.right.isDown)
        {
            this.sprite.setVelocityX(160);

            this.sprite.anims.play('left', true);
        }
        
        // down  
        if (context.cursors.down.isDown)
        {

            this.sprite.setVelocityY(160);

            this.sprite.anims.play('left', true);
        }

        // up  
        else if (context.cursors.up.isDown)
        {
            this.sprite.setVelocityY(-160);
            
            this.sprite.anims.play('left', true);
        }
          
        // none  
        if (context.cursors.up.isUp && context.cursors.down.isUp && context.cursors.left.isUp && context.cursors.right.isUp) 
        {
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(0);
            this.sprite.anims.play('turn');
        }
        
        var myPosition = {x: this.x , y: this.y};
        var myVelocity = {x: this.body.velocity.x , y: this.body.velocity.y };
        var info = {position: myPosition, velocity: myVelocity, r: this.rotation};
        socket.emit('movement', info);
        
        socket.on('moveUpdates', function(object){ 
            //if(object.id in otherPlayers){
            otherPlayers[object.id].setVelocityX(object.player.velocity.x);
            otherPlayers[object.id].setVelocityY(object.player.velocity.y);
            otherPlayers[object.id].rotation = object.player.rotation;
            // Leave animations on constantly for now
            otherPlayers[object.id].anims.play('left', true);
            //}
        });
    }

}
