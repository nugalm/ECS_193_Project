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
                          (this.sprite.anims.currentAnim.key === 'knife_swipe') ||
                          (this.sprite.anims.currentAnim.key === 'frosting_bag_squeeze') ||
                          (this.sprite.anims.currentAnim.key === 'salt_shaker_shake') ||
                          (this.sprite.anims.currentAnim.key === 'mouse_dash')));
        
        
        return animating;
    }
    
    takeDamage(damageAmount) 
    {
      //  alert("health before hit: " + this.health);
        this.health = this.health - damageAmount;
       // alert("health after hit: " + this.health);
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
        alert("power after pepper subtraction: "+ this.power)
    }
    
}
