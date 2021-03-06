class ProjectileHandler 
{
    
    constructor(context)
    {
        this.context = context;
        
        this.numSaltBullets = 5;
        this.saltBulletSize = 75;
        
        // time it takes for projectile to disappear (in milliseconds)
        this.saltTime = 350;
        this.bottleTime = 1000;
        this.frostingTime = 2000;
        
        
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
            return
        }
        
    }
    
    initSaltProjectiles()
    {
        var i;
        for (i = 0; i < 5; i++) 
        {
            var projectile = new Projectile({scene: this.context, x: this.context.player.myContainer.x, y: this.context.player.myContainer.y, key: "salt_projectile_1"}, "salt")	
            projectile.rotation = this.context.player.sprite.rotation - this.randomSaltProjectileRotation();
            projectile.element = this.context.player.element;
            projectile.setDisplaySize(this.saltBulletSize, this.saltBulletSize);
            this.context.projectiles.add(projectile);
            
            projectile.salt = true;	
            projectile.id = this.context.client.socket.id;
            this.setDeletionTimer(projectile);	
            projectile.anims.play("salt_shaker_projectile_anim");
            projectile.setSize(50,50);
            projectile.setOffset(160, 100);
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
            projectile.id = this.context.client.socket.id;
            this.setDeletionTimer(projectile);
            //this.context.physics.world.enable(projectile);
            projectile.anims.play("bottle_projectile_anim");
            projectile.setSize(50,50);
            var info = {x: projectile.body.x, y: projectile.body.y, rotation: projectile.rotation, element: this.context.player.element};
            socket.emit('addBottleProjectileServer', info);
    }
    
    initFrostingProjectiles()
    {
            var projectile = new Projectile({scene: this.context, x: this.context.player.myContainer.x, y: this.context.player.myContainer.y, key: "frosting_bag_projectile"}, "frosting");
            projectile.rotation = this.context.player.sprite.rotation - (Math.PI / 2);
            projectile.element = this.context.player.element;
            this.context.projectiles.add(projectile);
            projectile.frosting = true;
            projectile.id = this.context.client.socket.id;
            this.setDeletionTimer(projectile);
            projectile.anims.play("frosting_bag_projectile_anim");
            projectile.setSize(50,50);
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
            
            if(this.context.otherProjectiles[id].children == null){
                return;
            }
            
            this.context.otherProjectiles[id].children.iterate(function(child) {
                    if(child == undefined){
                        return;
                    }
                    
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
            }, this);
            
        }
    }
    
    moveProjectile(projectile)
    {
        if (projectile.salt == true) 
        {
            projectile.x += Math.cos(projectile.rotation) * 15;
            projectile.y += Math.sin(projectile.rotation) * 15;
        }
        else 
        {
            projectile.x += Math.cos(projectile.rotation) * 10;
            projectile.y += Math.sin(projectile.rotation) * 10;
        }
    }
    
    
    
}