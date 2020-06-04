class KeyboardHandler 
{
    
    constructor(_context )
    {
        this.context = _context;
    }
    
    initCursors ()
    {
        this.context.cursors = this.context.input.keyboard.addKeys
        ({
            //WASD movement
            'up': Phaser.Input.Keyboard.KeyCodes.W, 
            'down': Phaser.Input.Keyboard.KeyCodes.S,                 
            'left': Phaser.Input.Keyboard.KeyCodes.A,     
            'right': Phaser.Input.Keyboard.KeyCodes.D,
            
            //dash
            'space': Phaser.Input.Keyboard.KeyCodes.space,

            //equip
            'equip': Phaser.Input.Keyboard.KeyCodes.F

        });
    }
    
    initEvents(context)
    {
        this.initProjectileEvent(context);
        this.initDashEvent(context);
        
    }
    
    initProjectileEvent(context)
    {
        context.input.on('pointerdown', function(p)
        {   
            if(context.player.health <= 0){
                return;
            }
            
            if (p.leftButtonDown() && context.player.canFire == true)
            {
                context.player.fire();
                context.projectileHandler.createProjectile();
                context.player.canFire = false;
                //console.log("num projectiles: ",context.projectiles.getLength());
            }
            
            else if (p.rightButtonDown() && context.player.canMelee == true)
            {
                context.player.updateMelee(context);
                context.player.canMelee = false;
            }
            
        }, context);
    }
    
    initDashEvent(context)
    {
        context.input.keyboard.on('keydown-SPACE', function(p) 
        {
            if (context.player.isDashing == false) { 
                context.player.dash();
            }
        }, context);
    }
    
}