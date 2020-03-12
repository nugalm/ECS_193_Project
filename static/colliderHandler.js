class ColliderHandler 
{
    constructor(context)
    {
        this.context = context;
    }
    
    initColliders()
    {
        this.context.physics.add.collider(this.context.player.sprite, this.context.collidableLayer);

        this.context.physics.add.collider(this.context.projectiles, this.context.collidableLayer, this.lmao, null, this);
    }
    
    lmao()
    {
        alert("projectile colliding with collidable layer");
        
    }
    // stops the game and turns player Red
    hitBomb()
    {
        this.context.physics.pause();

        this.context.player.sprite.setTint(0xff0000);
        this.context.player.sprite.setTint(0xff0000);

        this.context.player.sprite.anims.play('turn');

        this.context.gameOver = true;
          
          
    }
    
    initProjectileColliders()
    {
        //this.context.add.collider(this.context.projectiles, this.context.)    
    }
    
        // physics body disabled and parent Game Object is made inactive and invisible 
        // removing it from display
      collectStar(player, star)
        {
            
            star.disableBody(true, true);      
            
            // increment player score when he gets a star
            this.context.score += 10;
            this.context.scoreText.setText('Score: ' + this.context.score);
            
            // use Group method countActive to see how many stars are left alive
            // if player collects them all, re-enable all the stars and reset their y position
            //to 0 => make stars drop from the top of the screen again
            if (this.context.stars.countActive(true) === 0)
            {
                //  A new batch of stars to collect
                this.context.stars.children.iterate(function (child) {
                    child.enableBody(true, child.x, 0, true, true);
                });

                /// create bombs, with x coordinate opposite side of the player to give them a chance lmao
                var x = (this.context.player.sprite.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

                var bomb = this.context.bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bomb.allowGravity = false;
            } //end if
    }
    
    
    /**
        function to calculate damage from a projectile hit
    */
    projectileHit(target, projectile) 
    {
        //if salty & salty
        
        //if salty 
            
    }
    
    /**
        function to calculate damage from a melee hit
        @attacker is the person meleeing 
        @defender is the person who was hit
    */
    meleeHit(attacker, defender)
    {
        defender.takeDamage(attacker.weapon.damage);
        
      /*          if (attacker.weapon.taste == "salty")
        {
            switch(defender.element) 
            {
                case "salty":
                    defender.takeDamage(attacker.weapon.damage);
                    break;
                case "spicy":
                    defender.takeDamage(attacker.weapon.damage)
                    break;
                case "sour":
                    break;
                case "sweet":
                    break;
                default:
                    alert("defender.element not found")             
            }
        }
        
        else if (attacker.weapon.taste == "spicy")
        {
            switch(defender.element) 
            {
                case "salty":
                    break;
                case "spicy":
                    break;
                case "sour":
                    break;
                case "sweet":
                    break;
                default:
                    alert("defender.element not found")             
            }
        }
        
        else if (attacker.weapon.taste == "sour")
        {
            switch(defender.element) 
            {
                case "salty":
                    break;
                case "spicy":
                    break;
                case "sour":
                    break;
                case "sweet":
                    break;
                default:
                    alert("defender.element not found")             
            }
        }
        
        else if (attacker.weapon.taste == "sweet")
        {
            switch(defender.element) 
            {
                case "salty":
                    break;
                case "spicy":
                    break;
                case "sour":
                    break;
                case "sweet":
                    break;
                default:
                    alert("defender.element not found")             
            }
        }
        
        else 
        {
            alert("attacker.weapon not found")    
        }*/
    } // end meleeHit
    
    
    
    
}