/**
**	The base character of our game.
	Parent class of the different elemental Characters (Ice, Fire, Earth, Wind)
	****the different spells should be in respective subclasses;***
*/

class Character {

    constructor(_context) {
        
        //stats
        this.health = 50;
        this.power = 50;
        this.mana = 50;
        this.speed = 50;
        this.stamina = 50;
        this.element = "none"; 
        
        
        this.sprite;
        this.weapon;
        this.DISPLAY = 150;
        this.HITBOX = 50;
      
       
        this.startPositionX = 200;
        this.startPositionY = 450;
        this.isMeleeing = false;
        this.isDashing = false;
        this.hitCount = 1;
        
        
        this.username;
        this.healthBar = new HealthBar(this.startPositionX, this.startPositionY + 50)
        this.myContainer;
        this.gun = "bottle";

	}

	printStat(){
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
    
    initSprite(context) 
    {

        this.sprite.displayWidth = this.DISPLAY;
        this.sprite.displayHeight = this.DISPLAY;
        this.sprite.setSize(0, 0);
        this.sprite.setOffset(125, 50);
        this.sprite.body.setAllowGravity(false);
        this.healthBar.initHealthBar(context);
        this.initContainer(context);
    }
    
    initContainer(context)
    {
        this.myContainer = context.add.container(this.startPositionX, this.startPositionY, [this.username, this.sprite]);
        
        this.myContainer.setSize(this.HITBOX, this.HITBOX);
        
        
        context.physics.world.enable(this.myContainer);
        this.myContainer.body.setAllowGravity(false);
        
    }
    
    initWeapon()
    {
        
    }
    
    update(context)
    {
        this.updateRotation(context);
        this.updateMovement(context);
        this.updateHealth();
    }
    
    updateHealth()
    {
        this.healthBar.update(this.myContainer.x, this.myContainer.y + 50, this.health)
    }
    
    updateMelee(context)
    {
        this.isMeleeing = true;
        this.hitCount = 1;
      //  alert(this.isMeleeing);
        //this.sprite.anims.play('fork_stab');
        if (this.weapon == "whisk") {
            this.sprite.anims.play('whisk_twirl');
        }
        else if (this.weapon == "fork") {
            this.sprite.anims.play('fork_stab');
        }
        
    } 
    
    fire()
    {
        if (this.gun == "bottle") {
            this.sprite.anims.play('bottle_squeeze')
        }    
    }
    
   // updateWhileDashing()
   // {
    //    this.sprite.x += Math.cos(this.dashTargetRotation) * 10;
   //     this.sprite.y += Math.sin(this.dashTargetRotation) * 10;
   // }
    
    dash()
    {
        this.sprite.anims.play('mouse_dash');
    }
    
    updateRotation(context)
    {
        var temp = this.sprite.getWorldTransformMatrix();
        
        var targetAngle =  Phaser.Math.Angle.Between(
        this.myContainer.x, this.myContainer.y,
        context.game.input.activePointer.worldX, context.game.input.activePointer.worldY);
          
        this.sprite.setRotation(targetAngle + Math.PI / 2);
    }
    
    updateMovement(context)
    {
        
        if (this.isDashing)
        {
            this.updateWhileDashing();    
        }
        else {
            if (context.cursors.left.isDown)
            {
               
                //this.sprite.setVelocityX(-160);
                this.myContainer.body.setVelocityX(-160);

                if (!this.isSpecialAnimating()) 
                {
                    this.sprite.anims.play('left', true);
                }
            }

            //right  
            else if (context.cursors.right.isDown)
            {
                //this.sprite.setVelocityX(160);
                this.myContainer.body.setVelocityX(160);
                if (!this.isSpecialAnimating())  
                {
                    this.sprite.anims.play('left', true);
                }
            }

            // down  
            if (context.cursors.down.isDown)
            {
                //this.sprite.setVelocityY(160);
                this.myContainer.body.setVelocityY(160);
                if (!this.isSpecialAnimating()) 
                {
                    this.sprite.anims.play('left', true);
                }
            }

            // up  
            else if (context.cursors.up.isDown)
            {
                //this.sprite.setVelocityY(-160);
                this.myContainer.body.setVelocityY(-160);
                if (!this.isSpecialAnimating()) 
                {
                    this.sprite.anims.play('left', true);
                }
            }

            // none  
            if (context.cursors.up.isUp && context.cursors.down.isUp && context.cursors.left.isUp && context.cursors.right.isUp) 
            {
               // this.sprite.setVelocityX(0);
               // this.sprite.setVelocityY(0);
                this.myContainer.body.setVelocityX(0);
                this.myContainer.body.setVelocityY(0);

                if (!this.isSpecialAnimating())  
                {
                    this.sprite.anims.play('turn');
                }
            }
            
    } //end else
        
        var myPosition = {x: this.sprite.x , y: this.sprite.y};
        var myVelocity = {x: this.sprite.body.velocity.x , y: this.sprite.body.velocity.y };
        var info = {position: myPosition, velocity: myVelocity, r: this.sprite.rotation};
       // socket.emit('movement', info);
    }

    
    /** 
        Checks if the sprite is animating something other than the movement
    */
    isSpecialAnimating()
    {
        var animating = (this.sprite.anims.isPlaying 
                      && ((this.sprite.anims.currentAnim.key === 'fork_stab') ||
                          (this.sprite.anims.currentAnim.key === 'whisk_twirl') ||
                          (this.sprite.anims.currentAnim.key === 'bottle_squeeze') ||
                          (this.sprite.anims.currentAnim.key === 'mouse_dash')));
        
        
        return animating;
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
           // alert("you died you noob")
        }
    }
    
    
}
