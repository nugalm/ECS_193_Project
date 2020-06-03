class UIScene extends Phaser.Scene 
{
    constructor() 
    {
        super({key: 'UIScene'});
        this.score = 0;
        this.scoreText;
        this.name = "";
        
        this.kills = 0;
        this.killsText;
        // For multiplayer scoreboard
        this.client = new Client();
        this.players = {};
        this.places = [];
        this.placesText = [];
    }
    
    init(data)
    {
        this.name = data.name;
    }
    
    preload()
    {
        
    }
    
    create()
    {
        this.scoreText = this.add.text(0, 0, 'Score: 0', {fontSize: '32px', fill: '#ffffff'});
        this.killsText = this.add.text(300, 0, 'Kills: 0', {fontSize: '32px', fill: '#ffffff'});
     
        var gameScene = this.scene.get('gameScene');
        
        gameScene.events.on('addScore', function() 
        {
            this.score += 10;
            
            this.scoreText.setText('Score: ' + this.score);
            
            this.client.socket.emit("scoreBoardUpdateServer", this.score);
            
            this.players['myself'] = {score: this.score, name: this.name};
            
            this.putIntoPlaces();
            this.sortPlaces();
            this.setPlaces();
        }, this);
        
        gameScene.events.on('addKills', function() 
        {
            this.kills += 1;
            this.score += 100;
            
            this.scoreText.setText('Score: ' + this.score);
            this.killsText.setText('Kills: ' + this.kills);
            
            this.client.socket.emit("scoreBoardUpdateServer", this.score);
            
            this.players['myself'] = {score: this.score, name: this.name};
             
            this.putIntoPlaces();
            this.sortPlaces();
            this.setPlaces();
        }, this);
        
        gameScene.events.on("reset", function()
        {
            this.kills = 0;
            this.score = 0;
            
            this.scoreText.setText('Score: ' + this.score);
            this.killsText.setText('Kills: ' + this.kills);
            
            this.players['myself'] = {score: this.score, name: this.name};
            
            this.putIntoPlaces();
            this.sortPlaces();
            this.setPlaces();
        }, this);
        
        
        var self = this;
        this.client.socket.on("scoreBoardUpdateClient", function(info){
            self.players['myself'] = {score: self.score, name: self.name};
            self.players[info.id] = {score: info.score, name: info.name};
            
            self.putIntoPlaces();
            self.sortPlaces();
            self.setPlaces();
        });
    }
    
    update()
    {
        this.putIntoPlaces();
        this.sortPlaces();
        this.setPlaces();
    }
    
    putIntoPlaces()
    {
        var i = 0;
        this.places.length = Object.keys(this.players).length
        for(var id in this.players){
            if(this.players[id] == null){
                continue;
            }
            this.places[i] = this.players[id];
            i++;
        }
    }
    
    sortPlaces()
    {
        var len = this.places.length;
        var i = 0;
        
        while (i < (len - 1))
        {
            if(this.places[i].score < this.places[i + 1].score)
            {
                var temp = this.places[i];
                this.places[i] = this.places[i + 1];
                this.places[i + 1] = temp;
                i -= 1;
            }
            i += 1;
        }
    }
    
    setPlaces()
    {
        var i = 0;
        for(i = 0; i < this.places.length; i++)
        {
            if(i >= 5)
            {
                return;
            }
            
            if(this.placesText[i] == null)
            {
                this.placesText[i] = this.add.text(600, (i * 30), this.places[i].name + " : " + this.places[i].score, {fontSize: '32px', fill: '#ffffff'});
            }
            else
            {
                this.placesText[i].setText(this.places[i].name + " : " + this.places[i].score);
            }
        }
    }
}