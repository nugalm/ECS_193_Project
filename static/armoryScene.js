class armoryScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'armoryScene'
		});
		this.player;
	}
	init(data) {
		let username = sessionStorage.getItem('username');
		this.username = username || [];
		this.player = data.player || [];
		this.socket = data.socket || [];
	}
	preload() {
		// loading assets
		this.load.atlas('dice', 'static/images/armoryScene/dice.png', 'static/images/armoryScene/dice.json');
		this.load.image('block_0', 'static/images/armoryScene/block_0.png');
		this.load.image('block_1_1', 'static/images/armoryScene/meleeweapon_fork.jpg');
		this.load.image('block_1_2', 'static/images/armoryScene/meleeweapon_whisk.jpg');
		this.load.image('block_1_3', 'static/images/armoryScene/meleeweapon_knife.jpg');
		this.load.image('block_1_4', 'static/images/armoryScene/rangedweapon_bottlesquirter1.jpg');
		this.load.image('block_1_4_2', 'static/images/armoryScene/rangedweapon_bottlesquirter2.jpg');
		this.load.image('block_1_5', 'static/images/armoryScene/rangedweapon_saltshaker.jpg');
		this.load.image('block_1_6', 'static/images/armoryScene/rangedweapon_frostingbag.jpg');
		this.load.image('block_2_1', 'static/images/armoryScene/healthbooster_avocado.jpg');
		this.load.image('block_2_2', 'static/images/armoryScene/powerbooster_pepper.jpg');
		this.load.image('block_2_3', 'static/images/armoryScene/speedbooster_blueberry.jpg');
		this.load.image('block_18', 'static/images/armoryScene/block_18.png');
		this.load.image('start', 'static/images/armoryScene/start.png');
		this.load.image('role', 'static/images/armoryScene/role.png');
		this.load.image('w', 'static/images/armoryScene/w.png');
		this.load.image('layer1', 'static/images/armoryScene/layer1.png');
		this.load.image('layer2', 'static/images/armoryScene/dialogue_dice.png');

		this.load.image('block_1_1_layer', 'static/images/armoryScene/dialogue_fork.png');
		this.load.image('block_1_2_layer', 'static/images/armoryScene/dialogue_whisk.png');
		this.load.image('block_1_3_layer', 'static/images/armoryScene/dialogue_knife.png');
		this.load.image('block_1_4_layer', 'static/images/armoryScene/dialogue_bottlesquirter1.png');
		this.load.image('block_1_4_2_layer', 'static/images/armoryScene/dialogue_bottlesquirter2.png');
		this.load.image('block_1_5_layer', 'static/images/armoryScene/dialogue_saltshaker.png');
		this.load.image('block_1_6_layer', 'static/images/armoryScene/dialogue_frostingbag.png');

		this.load.image('layer1_btn1', 'static/images/armoryScene/layer1_btn1.png');
		this.load.image('layer1_btn2', 'static/images/armoryScene/layer1_btn2.png');
		this.load.image('layer2_btn1', 'static/images/armoryScene/layer2_btn1.png');
		this.load.image('layer2_btn2', 'static/images/armoryScene/layer2_btn2.png');
		this.load.image('close', 'static/images/armoryScene/close.png');
		this.load.image('enter', 'static/images/armoryScene/enter.png');

		this.load.audio('m', 'static/images/armoryScene/m.mp3');
	}
	create() {
		var width = game.config.width;
		var height = game.config.height;
		var ratio = game.config.width / 1920;
		var mapWidth = 165 * ratio;
		var startX = (width - mapWidth * 5) / 2;
		var mapY = (height - mapWidth * 4) / 2;
		var block1 = this.block1();

		this.music = this.sound.add('m', {loop:1});
		this.music.setVolume(0.1); 
		this.music.play();

		// creat map array
		for (var i = 0; i < 6; i++) {
			mapData[i] = [startX + i * mapWidth, mapY];
		};
		for (var i = 6; i < 7; i++) {
			mapData[i] = [startX + 5 * mapWidth, mapY + mapWidth];
		};
		for (var i = 7; i < 13; i++) {
			mapData[i] = [startX + (6 - (i - 6)) * mapWidth, mapY + mapWidth * 2];
		};
		for (var i = 13; i < 14; i++) {
			mapData[i] = [startX, mapY + mapWidth * 3];
		};
		for (var i = 14; i < 20; i++) {
			mapData[i] = [startX + (i - 14) * mapWidth, mapY + mapWidth * 4];
		};
		mapData.forEach((el, i) => {
			if (i < 17) {
				var block = block1[i];
			} else if (i > 16) {
				var block = 'block_18';
			}
			this.blocks = this.blocks || [];
			this.blocks.push(this.add.image(el[0], el[1], block).setScale(ratio));
			blockData.push(block);
		});
		this.add.image(mapData[0][0] - 160 * ratio, mapData[0][1], 'start').setScale(ratio);
		this.role = this.add.image(mapData[0][0] - 160 * ratio, mapData[0][1], 'role').setScale(ratio);
		this.prop1 = this.add.image(20 * ratio, height - 20 * ratio - 130 * ratio, 'w').setOrigin(0).setScale(ratio);
		this.prop2 = this.add.image(148 * ratio, height - 20 * ratio - 130 * ratio, 'w').setOrigin(0).setScale(ratio);
		this.prop1_close = this.add.image(105 * ratio, height - 20 * ratio - 130 * ratio, 'close').setOrigin(0).setScale(ratio).setInteractive();
		this.prop1_close.visible = false;
		this.prop1_close.on('pointerdown', (pointer) => {
			this.prop1.setTexture('w');
			this.prop1_close.visible = false;
		});
		this.prop2_close = this.add.image(235 * ratio, height - 20 * ratio - 130 * ratio, 'close').setOrigin(0).setScale(ratio).setInteractive();
		this.prop2_close.visible = false;
		this.prop2_close.on('pointerdown', (pointer) => {
			this.prop2.setTexture('w');
			this.prop2_close.visible = false;
		});
		this.dice = this.add.sprite(width - 20 * ratio - 150 * ratio, height - 20 * ratio - 150 * ratio, 'dice').setOrigin(0).setScale(ratio).setInteractive();
		this.dice.on('pointerdown', (pointer) => {
			if (runState || this.layer1Container.visible) {
				return;
			};
			if (playNum <= 0) {
				return;
			};
			playNum--;
			this.diceFun();
		});

		// skip button
		this.skipScene = 
		this.add.image(200, 200, 'layer2_btn2').setScale(ratio).setInteractive();
		this.skipScene.on('pointerdown', (pointer) => {
			//temporary scene start
			this.music.pause();
			this.scene.start('gameScene', 
								{ 
								player: this.player,
								socket: this.socket, 
								username: this.username
							});
		}, this);

		// layer
		this.layer1Container = this.add.container();
		this.layer1Container.visible = 0;
		this.layer1 = this.add.image(width / 2, height / 2, 'layer1').setScale(0.5);

		this.layer1Container.add(this.layer1);
		this.layer2 = this.add.image(width / 2, height / 2, 'layer2').setScale(0.5);
		this.layer2.visible = false;
		this.layer1Container.add(this.layer2);
		this.layer1_btn1_h = this.layer1.y + this.layer1.displayHeight * 0.3;
		this.layer1_btn1 = this.add.image(width / 2 - 180 * ratio, this.layer1_btn1_h, 'layer1_btn1').setScale(ratio).setInteractive();
		this.layer1_btn1.on('pointerdown', (pointer) => {
			console.log(blockData[curIndex]);

			if ( this.overState ) {
				console.log('最后一次');
				this.player.health = this.player.health - 100;
				this.text1.text = 'Health: ' + this.player.health;
				this.layer1Container.visible = false;
				runState = true;
				runTimeID = setInterval(() => {
					var rad = random(0, 5);
					this.dice.setTexture('dice', 'dice_' + (rad + 1) + '.png');
					runIndex++;
					if (runIndex > 1000 / 30) {
						runIndex = 0;
						clearInterval(runTimeID);
						this.runRole2(rad);
					}
				}, 20);
				return;
			}

			if (this.prop1.texture.key == 'w') {
				this.prop1.setTexture(blockData[curIndex]);
				this.prop1_close.visible = true;
				this.blocks[curIndex].setTexture('block_0');
				this.layer1Container.visible = false;
				if (blockData[curIndex] == 'block_1_1') {
					this.player.weapon = 'fork';
					this.player.power = this.player.power - 100;
					this.text3.text = 'Power: ' + this.player.power;
				} else if (blockData[curIndex] == 'block_1_2') {
					this.player.weapon = 'whisk';
					this.player.speed = this.player.speed - 100;
					this.text2.text = 'Speed: ' + this.player.speed;
				} else if (blockData[curIndex] == 'block_1_3') {
					this.player.weapon = 'knife';
					this.player.health = this.player.health - 100;
					this.text1.text = 'Health: ' + this.player.health;
				} else if (blockData[curIndex] == 'block_1_4' || blockData[curIndex] == 'block_1_4_2') {
					this.player.gun = 'bottle';
					if ( blockData[curIndex] == 'block_1_4_2' ) {
						this.player.gun = 'bottle';
					}
					this.player.power = this.player.power - 200;
					this.text3.text = 'Power: ' + this.player.power;
				} else if (blockData[curIndex] == 'block_1_5') {
					this.player.gun = 'salt_shaker';
					this.player.health = this.player.health - 200;
					this.text1.text = 'Health: ' + this.player.health;
				} else if (blockData[curIndex] == 'block_1_6') {
					this.player.gun = 'frosting_bag';
					this.player.speed = this.player.speed - 200;
					this.text2.text = 'Speed: ' + this.player.speed;
				}
			} else if (this.prop2.texture.key == 'w') {
				this.prop2.setTexture(blockData[curIndex]);
				this.prop2_close.visible = true;
				this.blocks[curIndex].setTexture('block_0');
				this.layer1Container.visible = false;
				if (blockData[curIndex] == 'block_1_1') {
					this.player.weapon = 'fork';
					this.player.power = this.player.power - 100;
					this.text3.text = 'Power: ' + this.player.power;
				} else if (blockData[curIndex] == 'block_1_2') {
					this.player.weapon = 'whisk';
					this.player.speed = this.player.speed - 100;
					this.text2.text = 'Speed: ' + this.player.speed;
				} else if (blockData[curIndex] == 'block_1_3') {
					this.player.weapon = 'knife';
					this.player.health = this.player.health - 100;
					this.text1.text = 'Health: ' + this.player.health;
				} else if (blockData[curIndex] == 'block_1_4' || blockData[curIndex] == 'block_1_4_2') {
					this.player.gun = 'bottle';
					if ( blockData[curIndex] == 'block_1_4_2' ) {
						this.player.gun = 'bottle';
					}
					this.player.power = this.player.power - 200;
					this.text3.text = 'Power: ' + this.player.power;
				} else if (blockData[curIndex] == 'block_1_5') {
					this.player.gun = 'salt_shaker';
					this.player.health = this.player.health - 200;
					this.text1.text = 'Health: ' + this.player.health;
				} else if (blockData[curIndex] == 'block_1_6') {
					this.player.gun = 'frosting_bag';
					this.player.speed = this.player.speed - 200;
					this.text2.text = 'Speed: ' + this.player.speed;
				}
			} else {
				return;
			}
			this.over();
		});

		this.layer1Container.add(this.layer1_btn1);
		this.layer1_btn2 = this.add.image(width / 2 + 180 * ratio, this.layer1_btn1_h, 'layer1_btn2').setScale(ratio).setInteractive();
		this.layer1Container.add(this.layer1_btn2);
		this.layer1_btn2.on('pointerdown', (pointer) => {
			this.layer1Container.visible = false;
			this.over();
		});

		this.layer2_btn2 = this.add.image(width / 2 + 180 * ratio, this.layer1_btn1_h, 'layer2_btn2').setScale(ratio).setInteractive();
		this.layer2_btn2.visible = false;
		this.layer1Container.add(this.layer2_btn2);
		this.layer2_btn2.on('pointerdown', (pointer) => {
			this.layer1Container.visible = false;
			console.log('next');
			this.music.pause();
			this.scene.start('gameScene', {
				player: this.player, 
				socket: this.socket,
				username: this.username
			}); 
		});

		// text
		this.text1 = this.add.text(width - 350 * ratio, 15, 'Health: ' + this.player.health, {
			fontSize: '16px',
			fill: 'white'
		});
		this.text2 = this.add.text(width - 350 * ratio, 45, 'Speed: ' + this.player.speed, {
			fontSize: '16px',
			fill: 'white'
		});
		this.text3 = this.add.text(width - 350 * ratio, 75, 'Power: ' + this.player.power, {
			fontSize: '16px',
			fill: 'white'
		});

		// skip button
		this.enter = this.add.image(1680 * ratio, height - 20 * ratio - 310 * ratio, 'enter').setOrigin(0).setScale(ratio).setInteractive();
		this.enter.visible = false;
		this.enter.on('pointerdown', (pointer) => {
			this.music.pause();
			console.log(this.username);
			this.scene.start('gameScene', {
				player: this.player, 
				socket: this.socket,
				username: this.username
			});
		});
	}
	diceFun() {
		runState = true;
		runTimeID = setInterval(() => {
			var rad = random(0, 5);
			this.dice.setTexture('dice', 'dice_' + (rad + 1) + '.png');
			runIndex++;
			if (runIndex > 1000 / 30) {
				runIndex = 0;
				clearInterval(runTimeID);
				if (curIndex == 0) {
					this.runRole(rad);
				} else {
					this.runRole(rad + 1);
				}
			}
		}, 20);
	}
	
	// walk
	runRole(count) {
		var index = 0;
		var self = this;
		function _run() {
			var tempValue = curIndex + index;
			if (tempValue > 19) {
				console.log('over:');
				runState = false;
				return;
			};
			// angle
			if (tempValue == 6 || tempValue == 7 || tempValue == 13 || tempValue == 14) {
				self.role.angle = 90;
			} else if (tempValue == 8 || tempValue == 9 || tempValue == 10 || tempValue == 11 || tempValue == 12) {
				self.role.angle = -180;
			} else {
				self.role.angle = 0;
			};
			self.tweens.add({
				targets: self.role,
				x: mapData[tempValue][0],
				y: mapData[tempValue][1],
				ease: 'Linear',
				duration: 500,
				onComplete: ()=> {
					index++;
					if (index > count) {
						curIndex = tempValue;
						runState = false;
								  
						// Health Booster
						if (blockData[curIndex] == 'block_2_1') {
							self.player.health += random(50,100);
							self.text1.text = 'Health: ' + self.player.health;
							self.blocks[curIndex].setTexture('block_0');
							self.over();

							// Power Booster
						} else if (blockData[curIndex] == 'block_2_2') {
							self.player.power += random(50,100);
							self.text3.text = 'Power: ' + self.player.power;
							self.blocks[curIndex].setTexture('block_0');
							console.log('power');
							self.over();
							// Speed Booster
						} else if (blockData[curIndex] == 'block_2_3') {
							self.player.speed += random(50,100);
							self.text2.text = 'Speed: ' + self.player.speed;
							self.blocks[curIndex].setTexture('block_0');
							console.log('speed');
							self.over();
							// wq
						} else {
							setTimeout(() => {
								self.layer1.setTexture(blockData[curIndex]+'_layer');
								self.layer1Container.visible = true;
							}, 1000);
						}
						return;
					};
					setTimeout(function() {
						_run();
					}, 200);
				}
			});
		};
		_run();
	}


	// walk2
	runRole2(count) {
		var index = 0;
		var index2 = 0;
		var self = this;
		var fh = false;
		function _run() {
			var tempValue = curIndex + index;
			if (tempValue > 19) {
				fh = true;
			};
			if ( fh ) {
				index2 = index2 + 2;
				tempValue = tempValue - index2;
				console.log(tempValue);
			}

			// angle
			if (tempValue == 6 || tempValue == 7 || tempValue == 13 || tempValue == 14) {
				self.role.angle = 90;
			} else if (tempValue == 8 || tempValue == 9 || tempValue == 10 || tempValue == 11 || tempValue == 12) {
				self.role.angle = -180;
			} else {
				self.role.angle = 0;
			};

			if ( fh ) {
				self.role.angle = -180;
			}

			self.tweens.add({
				targets: self.role,
				x: mapData[tempValue][0],
				y: mapData[tempValue][1],
				ease: 'Linear',
				duration: 500,
				onComplete: ()=> {
					index++;
					if (index > count) {

						self.enter.visible = true;

						curIndex = tempValue;
						runState = false;
								  
						// Health Booster
						if (blockData[curIndex] == 'block_2_1') {
							self.player.health += random(50,100);
							self.text1.text = 'Health: ' + self.player.health;
							self.blocks[curIndex].setTexture('block_0');

							// Power Booster
						} else if (blockData[curIndex] == 'block_2_2') {
							self.player.power += random(50,100);
							self.text3.text = 'Power: ' + self.player.power;
							self.blocks[curIndex].setTexture('block_0');
							console.log('power');

							// Speed Booster
						} else if (blockData[curIndex] == 'block_2_3') {
							self.player.speed += random(50,100);
							self.text2.text = 'Speed: ' + self.player.speed;
							self.blocks[curIndex].setTexture('block_0');
							console.log('speed');
						}
						return;
					};
					setTimeout(function() {
						_run();
					}, 200);
				}
			});
		};
		_run();
	}

	// 
	block1() {
		var data1 = ['block_2_1', 'block_2_2', 'block_2_3'];
		data1.sort(function() {
			return Math.random() > 0.5 ? -1 : 1;
		});
		// var data2 = ['block_1_4', 'block_1_4', 'block_1_4', 'block_1_4', 'block_1_4', 'block_1_4', 'block_1_4', 'block_1_4', 'block_1_4', 'block_1_4', 'block_1_4', 'block_1_4', 'block_1_4', 'block_1_4', 'block_1_4', ];
		var data2 = ['block_1_1', 'block_1_2', 'block_1_3', 'block_1_4', 'block_1_5', 'block_1_6', 'block_1_1', 'block_1_2', 'block_1_3', 'block_1_4_2', 'block_1_5', 'block_1_6', 'block_2_1', 'block_2_2', 'block_2_3', ];
		data2.push(data1[0]);
		data2.push(data1[1]);
		data2.sort(function() {
			return Math.random() > 0.5 ? -1 : 1;
		});
		return data2;
	}

	over() {
		if ( playNum == 0 ) {
			this.overState = true;
			this.layer1.visible = false;
			this.layer1_btn2.visible = false;
			this.layer1_btn1.setTexture('layer2_btn1');
			this.layer2.visible = true;
			this.layer2_btn2.visible = true;
			this.layer1Container.visible = true;
		}
	}
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
var blockData = [];