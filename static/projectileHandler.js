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
        
        var projectile = this.context.physics.add.sprite(this.context.player.myContainer.x, this.context.player.myContainer.y, 'projectile');
        projectile.rotation = this.context.player.sprite.rotation - (Math.PI / 2);
        projectile.element = this.context.player.element;
        this.context.projectiles.add(projectile);
        
        var info = {x: projectile.body.x, y: projectile.body.y, rotation: projectile.rotation};
        socket.emit('addProjectileServer', info);
    }
    
    moveProjectiles()
    {
        this.context.projectiles.children.iterate(function(child) {
             child.x += Math.cos(child.rotation) * 10;
            child.y += Math.sin(child.rotation) * 10;  
           
             //socket.emit('updateProjectileServer', socket.id);
        });
        
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
    
    /*moveProjectile(projectile)
    {
        projectile.x += Math.cos(projectile.rotation) * 10;
        projectile.y += Math.sin(projectile.rotation) * 10;  
    }*/
    
    
}