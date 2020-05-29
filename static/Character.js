/**
**	The base character of our game.
	Parent class of the different elemental Characters (Ice, Fire, Earth, Wind)
	****the different spells should be in respective subclasses;***
*/

class Character {

    constructor(_context) {
        this.context = _context;
        
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
        this.meleeSprite;
        this.myContainer;
        this.DISPLAY = 150;
        this.HITBOX = 50;
        this.startPositionX = 200;
        this.startPositionY = 450;
        
        this.isMeleeing = false;
        this.isDashing = false;
        this.isEquipping = false;
        this.hitCount = 1;
        this.isCollidingWithDrop = false;
        
        
        this.username;
        this.healthBar = new HealthBar();
       

        this.client = new Client();
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.equip = false;
        this.oldRotation = 0;

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
        this.sprite.displayHeight = this.DISPLAY + 50;
        this.sprite.setSize(0, 0);
        this.sprite.body.setAllowGravity(false);
        this.healthBar.initHealthBar(context);
        this.initMeleeSprite(context);
        this.initContainer(context);
        this.initCooldown();
        this.context = context;
    }
    
    initMeleeSprite(context)
    {
        this.meleeSprite = context.physics.add.sprite(0, this.sprite.y, 'knife_layer_static');
        this.meleeSprite.setScale(0.5);
        
    }
    updateMeleeSpriteRotation()
    {
        this.meleeSprite.setRotation(this.sprite.rotation);
        
        for(var id in this.context.otherPlayers){
            var player = this.context.otherPlayers[id]
            
            player.meleeSprite.setRotation(player.sprite.rotation);
        }
    }
    initContainer(context)
    {
        /*
        var x = Phaser.Math.Between(0, 2560);
        var y = Phaser.Math.Between(0, 2560);
        
        this.myContainer = context.add.container(x,y, [this.username, this.sprite, this.healthBar.healthBar]);
        */
        this.myContainer = context.add.container(this.startPositionX, this.startPositionY, [this.username, this.sprite, this.healthBar.healthBar, this.meleeSprite]);
        
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
        if(this.health <= 0){
            return;
        }
        
        this.updateRotation(context);
        this.updateMeleeSpriteRotation();
        this.updateMovement(context);
        this.updateEquip(context);
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
        this.meleeSprite.setVisible(false);
        this.client.socket.emit("seeMeleeSpriteServer", false);
        
        if (this.weapon == "whisk") {
            this.sprite.anims.play('whisk_twirl');
            
            var info = {anims: 'whisk_twirl', melee: true, hitCount: 1};
            
            this.client.socket.emit('doAnim', info);
        }
        else if (this.weapon == "fork") {
            this.sprite.anims.play('fork_stab');
            
            var info = {anims: 'fork_stab', melee: true, hitCount: 1};
            
            this.client.socket.emit('doAnim', info);
        }
        else if (this.weapon == "knife") {
            this.sprite.anims.play('knife_swipe');
            
            var info = {anims: 'knife_swipe', melee: true, hitCount: 1};
            
            this.client.socket.emit('doAnim', info);
        }
        
        this.canMelee = false;
    } 
    
    fire() {
        if(this.health <= 0){
            return;
        }
        

        if (this.gun == "bottle") {
            this.sprite.anims.play('bottle_squeeze');
            this.playMeleeLayerIdle();
            
            var info = {anims: 'bottle_squeeze', melee: false, hitCount: 0};
            
            this.client.socket.emit('doAnim', info);
            
        }    
        else if (this.gun == "frosting_bag") {
            
            this.sprite.anims.play('frosting_bag_squeeze');
            this.playMeleeLayerFrostingBag();
            
            var info = {anims: 'frosting_bag_squeeze', melee: false, hitCount: 0};
            
            this.client.socket.emit('doAnim', info);
        }
        else if (this.gun == "salt_shaker") {
            
            this.sprite.anims.play('salt_shaker_shake');
            this.playMeleeLayerSaltShaker();
            
            var info = {anims: 'salt_shaker_shake', melee: false, hitCount: 0};
            
            this.client.socket.emit('doAnim', info);
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
        
        var myPosition = {x: this.myContainer.x , y: this.myContainer.y};
        var myVelocity = {x: this.myContainer.body.velocity.x , y: this.myContainer.body.velocity.y };
        var info = {position: myPosition, velocity: myVelocity, r: this.sprite.rotation};
        socket.emit('movement', info);
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
        this.playMeleeLayerDash();
        
        
        
        var info = {anims: 'mouse_dash', melee: false, hitCount: 0};
            
        this.client.socket.emit('doAnim', info);
    }
    
    playMeleeLayerDash() 
    {
        if (this.weapon == "knife") 
        {
            this.meleeSprite.anims.play('knife_dash');
            this.client.socket.emit('doMeleeSpriteAnim', 'knife_dash');
        }
        else if(this.weapon == "whisk") 
        {
            this.meleeSprite.anims.play('whisk_dash');
            this.client.socket.emit('doMeleeSpriteAnim', 'whisk_dash');
        }
        else if (this.weapon == "fork") 
        {
            this.meleeSprite.anims.play("fork_dash");
            this.client.socket.emit('doMeleeSpriteAnim', 'fork_dash');
        }
        
    }
    
    // used for walking, idle, and bottle shoot
    playMeleeLayerIdle()
    {
        if (this.weapon == "knife") 
        {
            this.meleeSprite.anims.play('knife_layer_idle');
            this.client.socket.emit('doMeleeSpriteAnim', 'knife_layer_idle');
        }
        else if(this.weapon == "whisk") 
        {
            this.meleeSprite.anims.play('whisk_layer_idle');
            this.client.socket.emit('doMeleeSpriteAnim', 'whisk_layer_idle');
        }
        else if (this.weapon == "fork") 
        {
            this.meleeSprite.anims.play("fork_layer_idle");
            this.client.socket.emit('doMeleeSpriteAnim', 'fork_layer_idle');
        }
    }
    
    playMeleeLayerSaltShaker()
    {
        if (this.weapon == "knife") 
        {
            this.meleeSprite.anims.play('knife_salt_shaker');
            this.client.socket.emit('doMeleeSpriteAnim', 'knife_salt_shaker');
        }
        else if(this.weapon == "whisk") 
        {
            this.meleeSprite.anims.play('whisk_salt_shaker');
            this.client.socket.emit('doMeleeSpriteAnim', 'whisk_salt_shaker');
        }
        else if (this.weapon == "fork") 
        {
            this.meleeSprite.anims.play("fork_salt_shaker");
            this.client.socket.emit('doMeleeSpriteAnim', 'fork_salt_shaker');
        }
    }
    
    playMeleeLayerFrostingBag()
    {
        if (this.weapon == "knife") 
        {
            this.meleeSprite.anims.play('knife_frosting_bag');
            this.client.socket.emit('doMeleeSpriteAnim', 'knife_frosting_bag');
        }
        
        else if(this.weapon == "whisk") 
        {
            this.meleeSprite.anims.play('whisk_frosting_bag');
            this.client.socket.emit('doMeleeSpriteAnim', 'whisk_frosting_bag');
        }
        else if (this.weapon == "fork") 
        {
            this.meleeSprite.anims.play("fork_frosting_bag");
            this.client.socket.emit('doMeleeSpriteAnim', 'fork_frosting_bag');
        }
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
        else {
            if (context.cursors.left.isDown)
            {
                this.myContainer.body.setVelocityX(-160);

                if (!this.isSpecialAnimating()) 
                {
                    this.playMeleeLayerIdle();
                    this.sprite.anims.play('left', true);
                    
                    var info = {anims: 'left', melee: false, hitCount: 0};
            
                    this.client.socket.emit('doAnim', info);
                }
            }

            //right  
            else if (context.cursors.right.isDown)
            {
                this.myContainer.body.setVelocityX(160);
                if (!this.isSpecialAnimating())  
                {
                    this.playMeleeLayerIdle();
                    this.sprite.anims.play('left', true);
                    
                    var info = {anims: 'left', melee: false, hitCount: 0};
                    this.client.socket.emit('doAnim', info);
                }
            }

            // down  
            if (context.cursors.down.isDown)
            {
                this.myContainer.body.setVelocityY(160);
                if (!this.isSpecialAnimating()) 
                {
                    this.playMeleeLayerIdle();
                    this.sprite.anims.play('left', true);
                    
                    var info = {anims: 'left', melee: false, hitCount: 0};
            
                    this.client.socket.emit('doAnim', info);
                }
            }

            // up  
            else if (context.cursors.up.isDown)
            {
                this.myContainer.body.setVelocityY(-160);
                if (!this.isSpecialAnimating()) 
                {
                    this.playMeleeLayerIdle();
                    this.sprite.anims.play('left', true);
                    
                    var info = {anims: 'left', melee: false, hitCount: 0};
            
                    this.client.socket.emit('doAnim', info);
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
                    {
                        this.playMeleeLayerIdle();
                        this.sprite.anims.play('turn');
                        
                        var info = {anims: 'turn', melee: false, hitCount: 0};

                        this.client.socket.emit('doAnim', info);
                    }
                }
            }
            
    } //end else
        
        // Multiplayer
        // Send player movement to server when state changes
        /*
        if ((context.cursors.up.isDown != this.up)
            || (context.cursors.down.isDown != this.down)
            || (context.cursors.left.isDown != this.left)
            || (context.cursors.right.isDown != this.right)
            || (this.sprite.rotation != this.oldRotation)
            ) 
        {
            this.left = context.cursors.left.isDown;
            this.right = context.cursors.right.isDown;
            this.down = context.cursors.down.isDown;
            this.up = context.cursors.up.isDown;
            this.oldRotation = this.sprite.rotation;
                        
            var myPosition = {x: this.myContainer.x , y: this.myContainer.y};
            var myVelocity = {x: this.myContainer.body.velocity.x , y: this.myContainer.body.velocity.y };
            var info = {position: myPosition, velocity: myVelocity, r: this.sprite.rotation};
            socket.emit('movement', info);
        }
        */
        
        var myPosition = {x: this.myContainer.x , y: this.myContainer.y};
        var myVelocity = {x: this.myContainer.body.velocity.x , y: this.myContainer.body.velocity.y };
        var info = {position: myPosition, velocity: myVelocity, r: this.sprite.rotation};
        socket.emit('movement', info);
    }

    updateEquip(context)
     {
         if(context.cursors.equip.isDown)
         {
             this.isEquipping = true;
         }
         else
         {
             this.isEquipping = false;
         }
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
    
    takeDamage(damageAmount, killer, method) 
    {
        
      //  alert("health before hit: " + this.health);
        this.health = this.health - damageAmount;
       // alert("health after hit: " + this.health);
        if (this.health <= 0) 
        {
            this.health = 0;
            if(!(killer == null)){
                //alert(killer._text + " killed you via " + method);
            }
            this.myContainer.destroy();
            this.client.socket.emit("hadDied");
        }
        
    }
    
    pickUpWeapon(weapon, context) 
    {
        if (weapon.type == "knife_drop_image")
        {
            this.weapon = "knife";
        }
        else if (weapon.type == "fork_drop_image")
        {
            this.weapon = "fork";
        }
        else if (weapon.type == "whisk_drop_image") 
        {
            this.weapon = "whisk";
        }
        else if (weapon.type == "salt_shaker_drop_image")
        {
            this.gun = "salt_shaker";
        }
        else if (weapon.type == "squirter_drop_image")
        {    
            this.gun = "bottle";
        }
        else if (weapon.type == "frosting_bag_drop_image")
        {
            this.gun = "frosting_bag";
        }
        
    }
    
    pickUpFood(drop, context) 
    {
        if (drop.type == "avocado_drop_image")
        {
            this.health += 100;
        }
        else if (drop.type == "blueberry_drop_image") 
        {
            this.speed += 50;
        }
        else if (drop.type == "pepper_drop_image") 
        {
            this.power += 100;
            this.pepper_time(context);
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
      //  alert("power after pepper subtraction: "+ this.power)	
    }
    
    
}
