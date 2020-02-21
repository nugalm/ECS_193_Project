// Scene where user picks his type of character / enters username
class menuScene extends Phaser.Scene
{
    
    constructor()
    {   
        super( {key: 'menuScene'} );
    }
    
    // loadScene should have loaded everything we need.
    preload()
    {
        
        
    }
    
    create()
    {
        this.add.text(100, 100, 'Choose your taste!', { fontSize: '24px', fill: 'white' });
        
    }
}