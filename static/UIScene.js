class UIScene extends Phaser.Scene 
{
    constructor() 
    {
        super({key: 'UIScene'});
        this.score = 0;
        this.scoreText;
        
        this.kills = 0;
        this.killsText;
        
    }
    
    preload()
    {
        
    }
    
    create()
    {
        this.scoreText = this.add.text(0, 0, 'Score: 0', {fontSize: '32px', fill: '#ffffff'});
     
        var gameScene = this.scene.get('gameScene');
        
        gameScene.events.on('addScore', function() 
        {
            this.score += 10;
            
            this.scoreText.setText('Score: ' + this.score);
            
        }, this);
        
        
        this.scoreText = this.add.text(300, 0, 'Kills: 0', {fontSize: '32px', fill: '#ffffff'});
        gameScene.events.on('addKills', function() 
        {
            this.kills += 1;
            
            this.killsText.setText('Kills: ' + this.score);
            
        }, this);
    }
}