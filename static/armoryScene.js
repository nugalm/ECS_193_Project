class armoryScene extends Phaser.Scene
{
    constructor()
    {
        super( {key: 'armoryScene'} );
        this.player;
    }
    
    
    init(data)
    {
        this.player = data.player;
    }
    
    preload()
    {
        
    }
    
    create()
    {
        this.add.text(100, 100, 'Armory Scene, click anywhere to go to game', { fontSize: '24px', fill: 'white' });
        this.input.on('pointerdown', function(p)
        {       
                if (p.leftButtonDown()){
                    this.scene.start('gameScene', {player: this.player}); 
                }
        }, this);
    }
    
    
    
}