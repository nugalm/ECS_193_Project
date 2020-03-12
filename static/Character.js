/**
**	The base character of our game.
	Parent class of the different elemental Characters (Ice, Fire, Earth, Wind)
	****the different spells should be in respective subclasses;***
*/

class Character {

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
        this.startPositionX = 200;
        this.startPositionY = 450;
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
        //this.sprite.setCollideWorldBounds(true);
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
    
    updateMelee(context)
    {
        alert("playing fork stab");
        this.sprite.anims.play('fork_stab', false);
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
        
        var myPosition = {x: this.sprite.x , y: this.sprite.y};
        var myVelocity = {x: this.sprite.body.velocity.x , y: this.sprite.body.velocity.y };
        var info = {position: myPosition, velocity: myVelocity, r: this.sprite.rotation};
       // socket.emit('movement', info);
    }

    takeDamage(damageAmount) 
    {
       // alert("youre taking damage: " + damageAmount)
        this.health = this.health - damageAmount;
      //  alert("health after taking damage: " + this.health);
        if (this.health < 0) 
        {
            
            this.health = 0;
            this.sprite.disableBody(true, true);
            alert("you died you noob")
        }
    }
    
    
}
