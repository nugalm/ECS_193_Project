class ProjectileHandler 
{
    
    constructor(context)
    {
        this.context = context;
        
        this.numSaltBullets = 5;
        this.saltBulletSize = 15;
        
        // time it takes for projectile to disappear (in milliseconds)
        this.saltTime = 500;
        this.bottleTime = 2000;
        this.frostingTime = 3000;
        
        
    }
    
    initProjectiles()
    {
        this.context.projectiles = this.context.physics.add.group();
    }
    
    createProjectile()
    {
        this.initProjectile();
    }
    
    initProjectile()
    {
        if (this.context.player.gun == "salt_shaker") 
        {
            this.initSaltProjectiles();
                      
        }
        
        else if (this.context.player.gun == "bottle")	
        {	
            this.initBottleProjectiles();	
        }
        
        else if (this.context.player.gun == "frosting_bag")	
        {	
            this.initFrostingProjectiles();	
        }
        
        else {
            var projectile = this.context.physics.add.sprite(this.context.player.myContainer.x, this.context.player.myContainer.y, 'projectile');
            projectile.rotation = this.context.player.sprite.rotation - (Math.PI / 2);
            projectile.element = this.context.player.element;
            this.context.projectiles.add(projectile);
            
            var info = {x: projectile.body.x, y: projectile.body.y, rotation: projectile.rotation};
            socket.emit('addProjectileServer', info);
        }
        
    }
    
    initSaltProjectiles()
    {
        var i;
        for (i = 0; i < 5; i++) 
        {
            //var projectile = this.context.physics.add.sprite(this.context.player.myContainer.x, this.context.player.myContainer.y, 'projectile');
            var projectile = new Projectile({scene: this.context, x: this.context.player.myContainer.x, y: this.context.player.myContainer.y, key: this.randomSaltProjectileImage()}, "salt")	
            projectile.rotation = this.context.player.sprite.rotation - this.randomSaltProjectileRotation();
            projectile.element = this.context.player.element;
            //projectile.salt = true;
            //projectile.lifespan = 250;
            projectile.setDisplaySize(this.saltBulletSize, this.saltBulletSize);
            this.context.projectiles.add(projectile);
            
            projectile.salt = true;	
            this.setDeletionTimer(projectile);	
            
            //this.context.physics.world.enable(projectile);
            
            var info = {x: projectile.body.x, y: projectile.body.y, rotation: projectile.rotation, element: this.context.player.element};
            socket.emit('addSaltProjectileServer', info);
        }
        
    }
    
    randomSaltProjectileRotation()
    {
        var rnd = Phaser.Math.RND;
        return rnd.realInRange(Math.PI/3, (2*Math.PI)/ 3);
    }
    
    randomSaltProjectileImage()
    {
        var randomInt = Phaser.Math.RND.between(1, 5);
        var key;
        
        switch (randomInt) 
        {
            case 1:
                key = "salt_projectile_1";
                break;
            case 2:
                key = "salt_projectile_2";
                break;
            case 3:
                key = "salt_projectile_3";
                break;
            case 4:
                key = "salt_projectile_4";
                break;
            case 5: 
                key = "salt_projectile_5";
                break;
            default:
                break;
        }
        
        return key;
        
    }
    
    initBottleProjectiles()
    {
        
        
            //var projectile = this.context.physics.add.sprite(this.context.player.myContainer.x, this.context.player.myContainer.y, 'projectile');
            var projectile = new Projectile({scene: this.context, x: this.context.player.myContainer.x, y: this.context.player.myContainer.y, key: "bottle_projectile"}, "bottle");
            projectile.rotation = this.context.player.sprite.rotation - (Math.PI / 2);
            projectile.element = this.context.player.element;
            this.context.projectiles.add(projectile);
            projectile.bottle = true;
            this.setDeletionTimer(projectile);
            //this.context.physics.world.enable(projectile);
        
            var info = {x: projectile.body.x, y: projectile.body.y, rotation: projectile.rotation, element: this.context.player.element};
            socket.emit('addBottleProjectileServer', info);
    }
    
    initFrostingProjectiles()
    {
        
        
            //var projectile = this.context.physics.add.sprite(this.context.player.myContainer.x, this.context.player.myContainer.y, 'projectile');
            var projectile = new Projectile({scene: this.context, x: this.context.player.myContainer.x, y: this.context.player.myContainer.y, key: "frosting_bag_projectile"}, "frosting");
            projectile.rotation = this.context.player.sprite.rotation - (Math.PI / 2);
            projectile.element = this.context.player.element;
            this.context.projectiles.add(projectile);
            projectile.frosting = true;
            this.setDeletionTimer(projectile);
            //this.context.physics.world.enable(projectile);
        
            var info = {x: projectile.body.x, y: projectile.body.y, rotation: projectile.rotation, element: this.context.player.element};
            socket.emit('addFrostingProjectileServer', info);
    }
    
    setDeletionTimer(projectile)
    {
        if (projectile.salt == true)
        {
            this.context.time.addEvent 
            ({
                delay: this.saltTime,
                args: [projectile],
                callback: this.callbackFunction,
                callbackScope: this,
                loop: false
            });
        }
        else if (projectile.bottle == true)
        {
            this.context.time.addEvent 
            ({
                delay: this.bottleTime,
                args: [projectile],
                callback: this.callbackFunction,
                callbackScope: this,
                loop: false
            });
        }
        else if(projectile.frosting == true)
        {
            this.context.time.addEvent 
            ({
                delay: this.frostingTime,
                args: [projectile],
                callback: this.callbackFunction,
                callbackScope: this,
                loop: false
            });
        }
    }
    
    callbackFunction(projectile)
    {
        //alert("destroying projectile");
        projectile.destroy();
    }
    
    moveProjectiles()
    {
        this.context.projectiles.children.iterate(function(child) {
            if (child == undefined) 
            {
                
            }
            else {
                var x = child.x;
                var y = child.y;
                if ( (this.context.drawer.tileCollidesAtPosition(x, y) == true)) 
                {
                    child.destroy(); 
                    
                }
                else
                {
                    this.moveProjectile(child);
                }
            }
           
        }, this);
        
        for(var id in this.context.otherPlayers){
            if(!(id in this.context.otherProjectiles)){
                continue;
            }
            
            this.context.otherProjectiles[id].children.iterate(function(child) {
                    child.x += Math.cos(child.rotation) * 10;
                    child.y += Math.sin(child.rotation) * 10;  
            });
            
        }
    }
    
    moveProjectile(projectile)
    {
        projectile.x += Math.cos(projectile.rotation) * 10;
        projectile.y += Math.sin(projectile.rotation) * 10;
    }
    
    
    
}