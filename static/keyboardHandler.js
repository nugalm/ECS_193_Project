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
            
            if (p.leftButtonDown())
            {
                context.player.fire();
                context.projectileHandler.createProjectile();
            }
            
            else if (p.rightButtonDown())
            {
                context.player.updateMelee();
            }
            
        }, context);
    }
    
    initDashEvent(context)
    {
        context.input.keyboard.on('keydown-SPACE', function(p) 
        {
            context.player.dash();
        }, context);
    }
    
}