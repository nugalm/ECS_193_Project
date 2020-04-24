class armoryScene extends Phaser.Scene
{
	constructor()
	{
		super( {key: 'armoryScene'} );
		this.player;
	}
	
	init(data)
	{   
		let username = sessionStorage.getItem('username');
		this.username = username;
		this.player = data.player;
	}
	
	preload()
	{
		// loading assets
		this.load.atlas('dice','static/images/armoryScene/dice.png','static/images/armoryScene/dice.json');
		this.load.image('block_0','static/images/armoryScene/block_0.png');
		this.load.image('start','static/images/armoryScene/start.png');
		this.load.image('role','static/images/armoryScene/role.png');
		this.load.image('w','static/images/armoryScene/w.png');
		this.load.image('layer1','static/images/armoryScene/layer1.png');
		this.load.image('layer2','static/images/armoryScene/layer2.png');
		this.load.image('layer1_btn1','static/images/armoryScene/layer1_btn1.png');
		this.load.image('layer1_btn2','static/images/armoryScene/layer1_btn2.png');
		this.load.image('layer2_btn2','static/images/armoryScene/layer2_btn2.png');
	}
	create() {
		var width = game.config.width;
		var height = game.config.height;
		var ratio = game.config.width / 1920;
		var mapWidth = 165 * ratio;
		var startX = (width - mapWidth * 5 ) / 2;
		var mapY = ( height - mapWidth * 4 ) / 2;

		// creat map array
		for ( var i = 0; i < 6; i++ ) {
			mapData[i] = [startX + i * mapWidth, mapY];
		};

		for ( var i = 6; i < 7; i++ ) {
			mapData[i] = [startX + 5 * mapWidth, mapY + mapWidth];
		};

		for ( var i = 7; i < 13; i++ ) {
			mapData[i] = [startX + (6-(i-6)) * mapWidth, mapY + mapWidth * 2 ];
		};

		for ( var i = 13; i < 14; i++ ) {
			mapData[i] = [startX, mapY + mapWidth * 3];
		};

		for ( var i = 14; i < 20; i++ ) {
			mapData[i] = [startX + (i-14) * mapWidth, mapY + mapWidth * 4];
		};

		mapData.forEach((el,i) => {
			this.add.image(el[0],el[1],'block_0').setScale(ratio);
		});

		this.add.image(mapData[0][0]-160*ratio,mapData[0][1],'start').setScale(ratio);
		this.role = this.add.image(mapData[0][0]-160*ratio,mapData[0][1],'role').setScale(ratio);

		this.add.image(20*ratio,height-20*ratio-130*ratio, 'w').setOrigin(0).setScale(ratio);
		this.add.image(148*ratio,height-20*ratio-130*ratio,'w').setOrigin(0).setScale(ratio);

		this.dice = this.add.sprite(width-20*ratio-150*ratio,height-20*ratio-150*ratio,'dice').setOrigin(0).setScale(ratio).setInteractive();
		this.dice.on('pointerdown', (pointer) => {
			if ( runState || this.layer1Container.visible ) {
				return;
			};
			if ( playNum <= 0 ) {
				return;
			};
			playNum--;
			this.player.health = this.player.health - 20;
			this.text1.text = 'Health: '+this.player.health;
			// $('.tips4').html('Time rethising: x'+playNum);
			if ( playNum <= 1 ) {
				// $('.tips4').css({'color':'#FF0000'});
			};
			this.diceFun();
		});

		// layer
		this.layer1Container = this.add.container();
		this.layer1Container.visible = 0;

		this.layer1 = this.add.image(width/2,height/2,'layer1').setScale(0.5);
		this.layer1Container.add(this.layer1);

		this.layer2 = this.add.image(width/2,height/2,'layer2').setScale(0.5);
		this.layer2.visible = false;
		this.layer1Container.add(this.layer2);

		this.layer1_btn1_h = this.layer1.y + this.layer1.displayHeight*0.3;

		this.layer1_btn1 = this.add.image(width/2-180*ratio,this.layer1_btn1_h,'layer1_btn1').setScale(ratio).setInteractive();
		this.layer1_btn1.on('pointerdown', (pointer) => {
			
		});
		this.layer1Container.add(this.layer1_btn1);

		this.layer1_btn2 = this.add.image(width/2+180*ratio,this.layer1_btn1_h,'layer1_btn2').setScale(ratio).setInteractive();
		this.layer1Container.add(this.layer1_btn2);
		this.layer1_btn2.on('pointerdown', (pointer) => {
			this.layer1Container.visible = false;
		});

		this.layer2_btn2 = this.add.image(width/2+180*ratio,width/2+180*ratio,'layer2_btn2').setScale(ratio).setInteractive();
		this.layer2_btn2.visible = false;
		this.layer1Container.add(this.layer2_btn2);
		this.layer2_btn2.on('pointerdown', (pointer) => {
			this.layer1Container.visible = false;
		});

        this.skipScene = 
        this.add.image(200, 200, 'layer2_btn2').setScale(ratio).setInteractive();
        this.skipScene.on('pointerdown', (pointer) => {
            //temporary scene start
            this.scene.start('gameScene', 
                             { 
                                player: this.player,
                                socket: this.socket, 
                                username: this.username
                            });
		}, this);
        
		// text
		this.text1 = this.add.text(width-350*ratio, 15, 'Health: '+this.player.health, { fontSize: '16px', fill: 'white' });
		this.text2 = this.add.text(width-350*ratio, 45, 'Speed: '+this.player.speed, { fontSize: '16px', fill: 'white' });
		this.text3 = this.add.text(width-350*ratio, 75, 'Power: '+this.player.power, { fontSize: '16px', fill: 'white' });

	}

	diceFun() {
		runState = true;
		runTimeID = setInterval(()=> {
			var rad = random(0,5);
			this.dice.setTexture('dice','dice_'+(rad+1)+'.png');
			runIndex++;
			if ( runIndex > 1000 / 30) {
				runIndex = 0;
				clearInterval(runTimeID);
				if ( curIndex == 0 ) {
					this.runRole(rad);
				}else{
					this.runRole(rad+1);
				}
			}
		}, 20);
	}

	runRole(count) {
		var index = 0;
		var self = this;
		function _run () {
			var tempValue = curIndex + index;
			if ( tempValue > 19 ) {
				console.log('over:');
				runState = false;
				return;
			};

			// 角度
			if ( tempValue == 6 || tempValue == 7 || tempValue == 13 || tempValue == 14 ) {
				self.role.angle = 90;
			}else if ( tempValue == 8 || tempValue == 9 || tempValue == 10 ||  tempValue == 11 || tempValue == 12 ) {
				self.role.angle = -180;
			}else{
				self.role.angle = 0;
			};

			self.tweens.add({targets: self.role, x: mapData[tempValue][0], y:mapData[tempValue][1], ease:'Linear', duration: 500, onComplete:function(){
				index++;
				if ( index > count ) {
					curIndex = tempValue;
					runState = false;
					if ( playNum == 0 ) {
						setTimeout(() => {
							self.layer1.visible = false;
							self.layer1_btn2.visible = false;
							self.layer2.visible = true;
							self.layer2_btn2.visible = true;
						}, 3000);
					};
					setTimeout(() => {
						self.layer1Container.visible = true;
					}, 1000);
					return;
				};
				setTimeout(function() {
					_run();
				}, 200);
			}});
		};
		_run();
	};
}

function random(lower, upper) {
	return Math.floor(Math.random() * (upper - lower)) + lower;
};

var playNum = 3;
var runIndex = 0;
var curIndex = 0;
var runState = false;
var runTimeID = null;
var mapData = [];