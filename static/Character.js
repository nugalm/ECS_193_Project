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
        this.weapon;
        this.gun = "bottle";
        
        this.sprite;
        this.myContainer;
        this.DISPLAY = 150;
        this.HITBOX = 50;
        this.startPositionX = 200;
        this.startPositionY = 450;
        
        this.isMeleeing = false;
        this.isDashing = false;
        this.hitCount = 1;
        
        
        this.username;
        this.healthBar = new HealthBar();
       
        this.canFire = true;
        this.canMelee = true;
        
        this.cooldown;
        this.meleeCooldown;
        
        this.pepperEvent;
        this.pepperTime = 10000;
        
        this.dashMultiplier = 5;

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
        this.sprite.body.setAllowGravity(false);
        this.healthBar.initHealthBar(context);
        this.initContainer(context);
        this.initCooldown();
    }
    
    initContainer(context)
    {
        this.myContainer = context.add.container(this.startPositionX, this.startPositionY, [this.username, this.sprite, this.healthBar.healthBar]);
       // var x = Phaser.Math.Between(0, 2560);
       // var y = Phaser.Math.Between(0, 2560);
        
       // this.myContainer = context.add.container(x,y, [this.username, this.sprite, this.healthBar.healthBar]);
       
        this.myContainer.setSize(this.HITBOX, this.HITBOX);
        
        
        context.physics.world.enable(this.myContainer);
        this.myContainer.body.setAllowGravity(false);
        
    }
    
    initCooldown()
    {
        if (this.gun == "bottle") 
        {
            this.cooldown = 500;    
        }
        else if (this.gun == "salt_shaker") 
        {
            this.cooldown = 1500;
        }
        else if (this.gun == "frosting_bag")
        {
            this.cooldown = 2000;
        }
        
        if (this.weapon == "fork") 
        {
            this.meleeCooldown = 500;
        }
        else if (this.weapon == "knife")
        {
            this.meleeCooldown = 1000;   
        }
        else if (this.weapon == "whisk")
        {
            this.meleeCooldown = 1500;
        }
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
        this.healthBar.update(this.health);
    }
    
    updateMelee(context)
    {
        this.isMeleeing = true;
        this.hitCount = 1;
     
        if (this.weapon == "whisk") {
            this.sprite.anims.play('whisk_twirl');
        }
        else if (this.weapon == "fork") {
            this.sprite.anims.play('fork_stab');
        }
        else if (this.weapon == "knife") {
            this.sprite.anims.play('knife_swipe');
        }
        
    } 
    
    fire()
    { 
       
        if (this.gun == "bottle") {
            this.sprite.anims.play('bottle_squeeze');
        }    
        else if (this.gun == "frosting_bag") {
            this.sprite.anims.play('frosting_bag_squeeze');
        }
        else if (this.gun == "salt_shaker") {
            this.sprite.anims.play('salt_shaker_shake')
        }
    }
    
    updateWhileDashing(context)
    {
        var newX = this.myContainer.x + (Math.cos(this.sprite.rotation - Math.PI/2) * this.dashMultiplier);
        var newY = this.myContainer.y + (Math.sin(this.sprite.rotation - Math.PI/2) * this.dashMultiplier);
        
        if (!context.drawer.isViableSpawnPoint(newX, newY)) 
        {
            return;
        }
        
        this.myContainer.x = newX;
        this.myContainer.y = newY; 
        
      
    }
        
    /**
    checks to see which quadrant of the unit circle the sprite rotation is in.
    returns @quadrant
    **/
                
    spriteRotationQuadrant()
    {
        
    }
    
    
    dash()
    {
        this.myContainer.body.setVelocity(0,0);
        this.isDashing = true;
        this.sprite.anims.play('mouse_dash');
    }
    
    updateRotation(context)
    {
        // lock rotation if player is shooting,meleeing, or dashing
        if (this.isSpecialAnimating()) 
        {
            return;
        }
        
        var temp = this.sprite.getWorldTransformMatrix();
        
        var targetAngle =  Phaser.Math.Angle.Between(
        this.myContainer.x, this.myContainer.y,
        context.game.input.activePointer.worldX, context.game.input.activePointer.worldY);
          
        this.sprite.setRotation(targetAngle + Math.PI / 2);
    }
    
    updateMovement(context)
    {
        
        if (this.isDashing == true)
        {
            
            this.updateWhileDashing(context);  
            return;
            
        }
        else
        {
            
         
            if (context.cursors.left.isDown)
            {
               
               
                this.myContainer.body.setVelocityX(-160);

                if (!this.isSpecialAnimating()) 
                {
                    this.sprite.anims.play('left', true);
                }
            }

            //right  
            else if (context.cursors.right.isDown)
            {
             
                this.myContainer.body.setVelocityX(160);
                if (!this.isSpecialAnimating())  
                {
                    this.sprite.anims.play('left', true);
                }
            }

            // down  
            if (context.cursors.down.isDown)
            {
               
                this.myContainer.body.setVelocityY(160);
                if (!this.isSpecialAnimating()) 
                {
                    this.sprite.anims.play('left', true);
                }
            }

            // up  
            else if (context.cursors.up.isDown)
            {
                
                this.myContainer.body.setVelocityY(-160);
                if (!this.isSpecialAnimating()) 
                {
                    this.sprite.anims.play('left', true);
                }
            }

            // none  
            if (context.cursors.up.isUp && context.cursors.down.isUp && context.cursors.left.isUp && context.cursors.right.isUp) 
            {
              
                this.myContainer.body.setVelocityX(0);
                this.myContainer.body.setVelocityY(0);

                if (!this.isSpecialAnimating())  
                {
                    if (this.sprite.anims.currentAnim != null && this.sprite.anims.currentAnim.key != 'turn')
                        this.sprite.anims.play('turn');
                }
            }
            
    } //end else
        
        var myPosition = {x: this.sprite.x , y: this.sprite.y};
        var myVelocity = {x: this.sprite.body.velocity.x , y: this.sprite.body.velocity.y };
        var info = {position: myPosition, velocity: myVelocity, r: this.sprite.rotation};
       
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
                          (this.sprite.anims.currentAnim.key === 'knife_swipe') ||
                          (this.sprite.anims.currentAnim.key === 'frosting_bag_squeeze') ||
                          (this.sprite.anims.currentAnim.key === 'salt_shaker_shake') ||
                          (this.sprite.anims.currentAnim.key === 'mouse_dash')));
        
        
        return animating;
    }
    
    takeDamage(damageAmount) 
    {
      
        this.health = this.health - damageAmount;
        if (this.health <= 0) 
        {
            this.health = 0;
            this.myContainer.destroy();
            
            //this.sprite.disableBody(true, true);
        }
    }
    
    /*
    *  function to set a person's weapon when picking up
        called by collider object in gameScene as callbackfunction
    */
    pickUpWeapon(weapon, context) 
    {
        if (weapon instanceof Knife)
        {
            this.weapon = "knife";
        }
        else if (weapon == context.randomDropsHandler.fork)
        {
            this.weapon = "fork";
        }
        else if (weapon == context.randomDropsHandler.whisk) 
        {
            this.weapon = "whisk";
        }
        else if (weapon == context.randomDropsHandler.salt_shaker)
        {
            this.gun = "salt_shaker";
        }
        else if (weapon == context.randomDropsHandler.bottle)
        {    
            this.gun = "bottle";
        }
        else if (weapon == context.randomDropsHandler.frosting_bag)
        {
            this.gun = "frosting_bag";
        }
        
    }
    
    pepper_time(context)
    {
        this.pepperEvent = context.time.addEvent 
        ({
            delay: this.pepperTime,
            callback: this.noMorePepper,
            callbackScope: this,
            loop: false
            
        });
    }
         
    noMorePepper()
    {
        this.power = this.power - 100;
        //alert("power after pepper subtraction: "+ this.power)
    }
    
    destroyCharacter()
    {
        
    }
    
}
