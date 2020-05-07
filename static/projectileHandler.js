class ProjectileHandler 
{
    
    constructor(context)
    {
        this.context = context;
    }
    
    initProjectiles()
    {
        this.context.projectiles = this.context.physics.add.group();
    }
    
    createProjectile()
    {
        this.initProjectile();
       // var projectile = this.context.projectiles.create(this.context.player.myContainer.x, this.context.player.myContainer.y, 'projectile');
     //   projectile.setCollideWorldBounds(false);
     //   projectile.body.setAllowGravity(false); 
     //   projectile.rotation = this.context.player.sprite.rotation - (Math.PI / 2);
     //   projectile.element = this.context.player.element;
       
    }
    
    initProjectile()
    {
        
        var projectile = this.context.physics.add.sprite(this.context.player.myContainer.x, this.context.player.myContainer.y, 'projectile');
        projectile.rotation = this.context.player.sprite.rotation - (Math.PI / 2);
        projectile.element = this.context.player.element;
        this.context.projectiles.add(projectile);
        
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