class ProjectileHandler 
{
    
    constructor(context)
    {
        this.context = context;
        
        this.numSaltBullets = 5;
        this.saltBulletSize = 15;
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
        else {
            var projectile = this.context.physics.add.sprite(this.context.player.myContainer.x, this.context.player.myContainer.y, 'projectile');
            projectile.rotation = this.context.player.sprite.rotation - (Math.PI / 2);
            projectile.element = this.context.player.element;
            this.context.projectiles.add(projectile);
        }
        
    }
    
    initSaltProjectiles()
    {
        var i;
        for (i = 0; i < 5; i++) 
        {
            var projectile = this.context.physics.add.sprite(this.context.player.myContainer.x, this.context.player.myContainer.y, 'projectile');
            projectile.rotation = this.context.player.sprite.rotation - ( (Math.PI / 3) + (i*(Math.PI / 12)) );
            projectile.element = this.context.player.element;
            projectile.salt = true;
            projectile.setDisplaySize(this.saltBulletSize, this.saltBulletSize);
            this.context.projectiles.add(projectile);
            
        }
        
    }
    
    
    
    moveProjectiles()
    {
        this.context.projectiles.children.iterate(function(child) {
             child.x += Math.cos(child.rotation) * 10;
            child.y += Math.sin(child.rotation) * 10;  
           
        });
    }
    
    /*moveProjectile(projectile)
    {
        projectile.x += Math.cos(projectile.rotation) * 10;
        projectile.y += Math.sin(projectile.rotation) * 10;  
    }*/
    
    
}