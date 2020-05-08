class SocketFunc {
    
    constructor() {

	}
    
    updatePlayers(self, server){
        for (var id in server){
                
                if(self.client.socket.id === id){
                    continue;
                }
                
                if(!server[id].render){
                    continue;
                }
                   
                if(!(id in self.otherPlayers)){
                    console.log("Adding new player");
                    
                    if(server[id].element === "salty"){
                        self.otherPlayers[id] = new SaltyCharacter();
                    }
                    
                    else if(server[id].element === "sour"){
                        self.otherPlayers[id] = new SourCharacter();  
                    }
                    
                    else if(server[id].element === "spicy"){
                        self.otherPlayers[id] = new SpicyCharacter();  
                    }
                    
                    else {
                        self.otherPlayers[id] = new SweetCharacter();  
                    }
                    
                    if(!(typeof self.otherPlayers[id] == 'undefined')) {
                        //Add in other player characte
                        console.log("x: " + server[id].position.x + " y: " + server[id].position.y);
                        self.otherPlayers[id].startPositionY = server[id].position.y;
                        self.otherPlayers[id].startPositionX = server[id].position.x;
                        
                        self.otherPlayers[id].username = self.add.text(-20, -70, (server[id].name), { fontSize: '24px', fill: 'white' });
                        self.otherPlayers[id].sprite = self.physics.add.sprite(0,
                            0,
                            'kitchenScene', 'mouse_walk/mouse_walk-2.png');
                        
                        self.otherPlayers[id].initSprite(self);
                        
                        
                                            
                        self.otherPlayersGroup.add(self.otherPlayers[id].myContainer);
                        
                        self.physics.add.collider(self.otherPlayers[id].myContainer, self.collidableLayer);
                        
                        self.physics.add.overlap(self.dummiesGroup, self.otherPlayers[id].myContainer, self.otherMeleeHitDummy, null, self);
                        
                        //self.physics.add.overlap(self.dummiesGroup, self.otherPlayers[id].sprite, self.meleeHit, null, self);
                        
                        //self.physics.add.collider(self.projectiles, self.otherPlayersGroup, self.bulletHitOther, null, self);
                    }      
                }
            }
    }
    
    moveUpdates(self, object) {
         self.otherPlayers[object.id].myContainer.body.setVelocityX(object.player.velocity.x);
            self.otherPlayers[object.id].myContainer.body.setVelocityY(object.player.velocity.y);
            self.otherPlayers[object.id].sprite.setRotation(object.player.rotation);
            
            var id = object.id;
            var pos = object.player.position;
            
            function truncate(value)
            {
                if (value < 0) {
                   return Math.ceil(value);
                }

                return Math.floor(value);
            }
            
            if(object.player.oldPosition.x === pos.x && object.player.oldPosition.y === pos.y){
                return;
            }
            
            // If player still moving don't correct using abosolute position
            if(self.otherPlayers[id].myContainer.body.velocity.x !== 0 && self.otherPlayers[id].myContainer.body.velocity.y !== 0){
                return;
            }
            
            // pos is absolute position of the other players
            if(truncate(self.otherPlayers[id].myContainer.x) !== truncate(pos.x)){                
                if(truncate(self.otherPlayers[id].myContainer.x) === truncate(pos.x)){
                    self.otherPlayers[id].myContainer.body.setVelocityX(0);
                }
                
                else if(truncate(self.otherPlayers[id].myContainer.x) > truncate(pos.x)) { 
                    self.otherPlayers[id].myContainer.body.setVelocityX(-160);
                }
                
                else if(truncate(self.otherPlayers[id].myContainer.x) < truncate(pos.x)) { 
                    self.otherPlayers[id].myContainer.body.setVelocityX(160);
                }
                        
            }
            
            if(truncate(self.otherPlayers[id].myContainer.y) !== truncate(pos.y)){
                if(truncate(self.otherPlayers[id].myContainer.y) ===  truncate(pos.y)){
                    self.otherPlayers[id].myContainer.body.setVelocityY(0);
                }
                
                else if(truncate(self.otherPlayers[id].myContainer.y) >  truncate(pos.y)) { 
                    self.otherPlayers[id].myContainer.body.setVelocityY(-160);
                }
                
                 else if(truncate(self.otherPlayers[id].myContainer.y) <  truncate(pos.y)) { 
                    self.otherPlayers[id].myContainer.body.setVelocityY(160);
                }      
            }
            
            
            //self.physics.arcade.moveToXY(self.otherPlayers[id].myContainer.body,pos.x, pos.y, 160 , );
    }
    
    addProjectile(self, projs) {
    
        if(!(projs.id in self.otherProjectiles)){
                self.otherProjectiles[projs.id] = self.physics.add.group();
                
                self.physics.add.collider(self.otherProjectiles[projs.id], self.dummiesGroup, self.bulletHitDummy, null, self);
                self.physics.add.collider(self.otherProjectiles[projs.id], self.playerGroup, self.bulletHitPlayer, null, self);
            }
            
            /*
            var projectile = self.otherProjectiles[projs.id].create(projs.obj.x, projs.obj.y, 'projectile');
            projectile.setCollideWorldBounds(false);
            projectile.body.setAllowGravity(false); 
            projectile.rotation =  projs.obj.rotation;//this.context.player.sprite.rotation - (Math.PI / 2);
            projectile.element = self.otherPlayers[projs.id].element;
            */
        
        var projectile = self.otherProjectiles[projs.id].create(projs.obj.x, projs.obj.y, 'projectile');
        projectile.setCollideWorldBounds(false);
        projectile.body.setAllowGravity(false); 
        projectile.rotation =  projs.obj.rotation;//this.context.player.sprite.rotation - (Math.PI / 2);
        projectile.element = self.otherPlayers[projs.id].element;
    }
    
    updateAnim(self, player) {
        self.otherPlayers[player.id].isMeleeing = player.info.melee;
        self.otherPlayers[player.id].hitCount = player.info.hitCount;
            
        if(player.info.anims === 'left'){
            self.otherPlayers[player.id].sprite.anims.play(player.info.anims, true);
        }
        else {
            self.otherPlayers[player.id].sprite.anims.play(player.info.anims);
        }
           
    }
    
    
}