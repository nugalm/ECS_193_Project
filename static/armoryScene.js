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
		this.playerCache = this.player;
	}
	preload() {
		var element = document.createElement('style');
			document.head.appendChild(element);
		var sheet = element.sheet;
		var styles = '@font-face { font-family: "font"; src: url("static/images/armoryScene/font.ttf") format("opentype"); }\n';
			sheet.insertRule(styles, 0);
	}

	create() {
		gameNode2 = this;
		gameNode2.player2 = {
			power:0,
			health:0,
			speed:0
		};

		var width = game.config.width;
		var height = game.config.height;
		var ratio = game.config.width / 1920;
		var mapWidth = 165 * ratio;
		var startX = (width - mapWidth * 5) / 2;
		var mapY = (height - mapWidth * 4) / 2 - 15;
		var block1 = this.block1();

		this.music = this.sound.add('m', {loop:1});
		this.music.setVolume(0.1); 
		this.music.play();

		this.add.image(0, (height-1080*ratio) / 2, 'background').setOrigin(0).setScale(ratio);

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
			} else if (i == 17) {
				var block = 'question_mark1';
			} else if (i == 18) {
				var block = 'question_mark2';
			} else if (i == 19) {
				var block = 'question_mark3';
			}
			this.blocks = this.blocks || [];
			this.blocks.push(this.add.image(el[0], el[1], block).setScale(ratio));
			blockData.push(block);
		});
		this.add.image(mapData[0][0] - 160 * ratio, mapData[0][1], 'start').setScale(ratio);
		this.role = this.add.image(mapData[0][0] - 160 * ratio, mapData[0][1], 'role').setScale(ratio);
		
					 this.add.image(20 * ratio, height - 20 * ratio - 200 * ratio, 'propbar').setOrigin(0).setScale(ratio*0.92);
		this.prop1 = this.add.image(20 * ratio + 10, height - 20 * ratio - 170 * ratio, 'w').setOrigin(0).setScale(ratio*0.9);
		
					 this.add.image(148 * ratio + 10, height - 20 * ratio - 200 * ratio, 'propbar').setOrigin(0).setScale(ratio*0.92);
		this.prop2 = this.add.image(148 * ratio + 20, height - 20 * ratio - 170 * ratio, 'w').setOrigin(0).setScale(ratio*0.9);

		this.prop1_close = this.add.image(105 * ratio-15, height - 20 * ratio - 185 * ratio, 'close').setOrigin(0).setScale(ratio).setInteractive();
		this.prop1_close.visible = false;
		this.prop1_close.on('pointerdown', (pointer) => {
			this.prop1.setTexture('w');
			this.prop1_close.visible = false;
		});
		this.prop2_close = this.add.image(235 * ratio - 10, height - 20 * ratio - 185 * ratio, 'close').setOrigin(0).setScale(ratio).setInteractive();
		this.prop2_close.visible = false;
		this.prop2_close.on('pointerdown', (pointer) => {
			this.prop2.setTexture('w');
			this.prop2_close.visible = false;
		});
		this.dice = this.add.sprite(width - 80 * ratio - 150 * ratio, height - 180 * ratio - 20 * ratio, 'dice').setOrigin(0).setScale(ratio).setInteractive();
		this.dice.on('pointerdown', (pointer) => {
			if (runState || this.layer1Container.visible) {
				return;
			};
			if (playNum <= 0) {
				return;
			};
			playNum--;
			this.text4.text = 'Times remaining：x'+playNum;
			if ( playNum <= 1 ) {
				this.text4.setStyle({color:'#FF0000'});
			}
			this.diceFun();
		});

		// skip button
		/*this.skipScene = 
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
		}, this);*/

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
			console.log(this.overState, playNum);
			if ( this.overState == 1 ) {
				this.overState++;
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
						this.runRole2(rad+1);
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
					this.player.weapon1 = 'fork';
					this.player.power = this.player.power - 50;
					this.text3.text = 'Power: ' + this.player.power;
				} else if (blockData[curIndex] == 'block_1_2') {
					this.player.weapon1 = 'whisk';
					this.player.speed = this.player.speed - 50;
					this.text2.text = 'Speed: ' + this.player.speed;
				} else if (blockData[curIndex] == 'block_1_3') {
					this.player.weapon1 = 'knife';
					this.player.health = this.player.health - 50;
					this.text1.text = 'Health: ' + this.player.health;
				} else if (blockData[curIndex] == 'block_1_4' || blockData[curIndex] == 'block_1_4_2') {
					this.player.gun = 'bottle';
					if ( blockData[curIndex] == 'block_1_4_2' ) {
						this.player.gun = 'bottle';
					}
					this.player.power = this.player.power - 100;
					this.text3.text = 'Power: ' + this.player.power;
				} else if (blockData[curIndex] == 'block_1_5') {
					this.player.gun = 'salt_shaker';
					this.player.health = this.player.health - 100;
					this.text1.text = 'Health: ' + this.player.health;
				} else if (blockData[curIndex] == 'block_1_6') {
					this.player.gun = 'frosting_bag';
					this.player.speed = this.player.speed - 100;
					this.text2.text = 'Speed: ' + this.player.speed;
				}
			} else if (this.prop2.texture.key == 'w') {
				this.prop2.setTexture(blockData[curIndex]);
				this.prop2_close.visible = true;
				this.blocks[curIndex].setTexture('block_0');
				this.layer1Container.visible = false;
				if (blockData[curIndex] == 'block_1_1') {
					this.player.weapon2 = 'fork';
					this.player.power = this.player.power - 50;
					this.text3.text = 'Power: ' + this.player.power;
				} else if (blockData[curIndex] == 'block_1_2') {
					this.player.weapon2 = 'whisk';
					this.player.speed = this.player.speed - 50;
					this.text2.text = 'Speed: ' + this.player.speed;
				} else if (blockData[curIndex] == 'block_1_3') {
					this.player.weapon2 = 'knife';
					this.player.health = this.player.health - 50;
					this.text1.text = 'Health: ' + this.player.health;
				} else if (blockData[curIndex] == 'block_1_4' || blockData[curIndex] == 'block_1_4_2') {
					this.player.gun = 'bottle';
					if ( blockData[curIndex] == 'block_1_4_2' ) {
						this.player.gun = 'bottle';
					}
					this.player.power = this.player.power - 100;
					this.text3.text = 'Power: ' + this.player.power;
				} else if (blockData[curIndex] == 'block_1_5') {
					this.player.gun = 'salt_shaker';
					this.player.health = this.player.health - 100;
					this.text1.text = 'Health: ' + this.player.health;
				} else if (blockData[curIndex] == 'block_1_6') {
					this.player.gun = 'frosting_bag';
					this.player.speed = this.player.speed - 100;
					this.text2.text = 'Speed: ' + this.player.speed;
				}
			} else {
				return;
			}
			if ( playNum >= 0 ) {
				this.over();
			}
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

		this.add.image(width / 2 + 740 * ratio, 70, 'statsbar').setScale(ratio).setInteractive();

		// text
		this.text1 = this.add.text(width - 300 * ratio, 31, 'Health: ' + this.player.health, {
			fontSize: '16px',
			fontFamily: 'font',
			fill: 'white',
		});
		this.text2 = this.add.text(width - 300 * ratio, 61, 'Speed: ' + this.player.speed, {
			fontSize: '16px',
			fontFamily: 'font',
			fill: 'white',
		});
		this.text3 = this.add.text(width - 300 * ratio, 91, 'Power: ' + this.player.power, {
			fontSize: '16px',
			fontFamily: 'font',
			fill: 'white',
		});

		this.text4 = this.add.text(1680 * ratio - 65, height - 200 * ratio - 50 * ratio, 'Times remaining：x3', {
			fontSize: '16px',
			fontFamily: 'font',
			fill: 'white'
		});

		// skip button
		this.enter = this.add.image(1635 * ratio - 10, height - 20 * ratio - 330 * ratio, 'enter').setOrigin(0).setScale(ratio).setInteractive();
		this.enter.visible = false;
		this.enter.on('pointerdown', (pointer) => {
			this.music.pause();
			this.scene.start('gameScene', {
				player: this.player, 
				socket: this.socket,
				username: this.username
			});
		});
	}

	update(){
		this.text1.setStyle({'font-family':'font',color: '#000'});
		this.text2.setStyle({'font-family':'font',color: '#000'});
		this.text3.setStyle({'font-family':'font',color: '#000'});
		this.text4.setStyle({'font-family':'font'});
	}

	diceFun() {
		runState = true;
		runTimeID = setInterval(() => {
			var rad = random(0, 5);
			this.dice.setTexture('dice', 'dice_' + (rad + 1) + '.png');
			runIndex++;
			if (runIndex > 1000 / 30) {
				if ( firstIndex ) {
					rad = firstIndex;
					console.log('rad',rad);
					firstIndex = null;
					this.dice.setTexture('dice', 'dice_' + (rad + 1) + '.png');
				}
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
		runRoleNode = self;

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
						if (self.blocks[curIndex].texture.key == 'block_0') {
						
						} else if (blockData[curIndex] == 'block_2_1') {
							self.player.health += self.addm('health');
							self.text1.text = 'Health: ' + self.player.health;
							self.blocks[curIndex].setTexture('block_0');
							$('.layer-img').hide();
							$('.layer, .block_2_1').show();

							// Power Booster
						} else if (blockData[curIndex] == 'block_2_2') {
							self.player.power += self.addm('power');
							self.text3.text = 'Power: ' + self.player.power;
							self.blocks[curIndex].setTexture('block_0');
							console.log('power');
							$('.layer-img').hide();
							$('.layer, .block_2_2').show();
							
							// Speed Booster
						} else if (blockData[curIndex] == 'block_2_3') {
							self.player.speed += self.addm('speed');
							self.text2.text = 'Speed: ' + self.player.speed;
							self.blocks[curIndex].setTexture('block_0');
							$('.layer-img').hide();
							$('.layer, .block_2_3').show();

						} else if (blockData[curIndex] == 'question_mark1' || blockData[curIndex] == 'question_mark2' || blockData[curIndex] == 'question_mark3') {
							gameNode2.player.power = gameNode2.playerCache.power + gameNode2.player.power;
							gameNode2.player.health = gameNode2.playerCache.health + gameNode2.player.health;
							gameNode2.player.speed = gameNode2.playerCache.speed + gameNode2.player.speed;
							gameNode2.text1.text = 'Health: ' + gameNode2.player.health;
							gameNode2.text2.text = 'Speed: ' + gameNode2.player.speed;
							gameNode2.text3.text = 'Power: ' + gameNode2.player.power;
							self.blocks[curIndex].setTexture('block_0');
							$('.layer-img').hide();
							$('.layer, .'+blockData[curIndex]).show();

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
					
						if (self.blocks[curIndex].texture.key == 'block_0') {
					
						// Health Booster
						} else if (blockData[curIndex] == 'block_2_1') {
							self.player.health += self.addm('health');
							self.text1.text = 'Health: ' + self.player.health;
							self.blocks[curIndex].setTexture('block_0');
							$('.layer-img').hide();
							$('.layer, .block_2_1').show();

							// Power Booster
						} else if (blockData[curIndex] == 'block_2_2') {
							self.player.power += self.addm('power');
							self.text3.text = 'Power: ' + self.player.power;
							self.blocks[curIndex].setTexture('block_0');
							console.log('power');
							$('.layer-img').hide();
							$('.layer, .block_2_2').show();

							// Speed Booster
						} else if (blockData[curIndex] == 'block_2_3') {
							self.player.speed += self.addm('speed');
							self.text2.text = 'Speed: ' + self.player.speed;
							self.blocks[curIndex].setTexture('block_0');
							console.log('speed');
							$('.layer-img').hide();
							$('.layer, .block_2_3').show();

						} else if (blockData[curIndex] == 'question_mark1' || blockData[curIndex] == 'question_mark2' || blockData[curIndex] == 'question_mark3') {
							gameNode2.player.power = gameNode2.playerCache.power + gameNode2.player.power;
							gameNode2.player.health = gameNode2.playerCache.health + gameNode2.player.health;
							gameNode2.player.speed = gameNode2.playerCache.speed + gameNode2.player.speed;
							gameNode2.text1.text = 'Health: ' + gameNode2.player.health;
							gameNode2.text2.text = 'Speed: ' + gameNode2.player.speed;
							gameNode2.text3.text = 'Power: ' + gameNode2.player.power;
							self.blocks[curIndex].setTexture('block_0');
							$('.layer-img').hide();
							$('.layer, .'+blockData[curIndex]).show();
							
						}else{
							console.log(blockData[curIndex]+'_layer');
							setTimeout(() => {

								self.layer1.visible = true;
								self.layer1_btn2.visible = true;

								self.layer1_btn1.setTexture('layer1_btn1');

								self.layer2.visible = false;
								self.layer2_btn2.visible = false;

								self.layer1.setTexture(blockData[curIndex]+'_layer');
								self.layer1Container.visible = true;
							}, 1000);
						}
						isOverState = true;
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
		var data2 = ['block_1_1', 'block_1_2', 'block_1_3', 'block_1_4', 'block_1_5', 'block_1_6', 'block_1_1', 'block_1_2', 'block_1_3', 'block_1_4_2', 'block_1_5', 'block_1_6', 'block_2_1', 'block_2_2', 'block_2_3', ];
		data2.push(data1[0]);
		data2.push(data1[1]);
		data2.sort(function() {
			return Math.random() > 0.5 ? -1 : 1;
		});

		data2.forEach(function(el,i) {
			if ( el.indexOf('block_1') > -1 && firstIndex == 0 ) {
				firstIndex = i;
			}
		});

		if ( firstIndex > 6 ) {
			var temp = data2[firstIndex];
			data2.splice(firstIndex,1);
			firstIndex = random(0, 5);
			data2.splice(firstIndex,0,temp);
		}

		return data2;
	}

	over() {
		if ( playNum == 0 ) {
			console.log('结束');
			if ( this.player.health < 100 ) {
				$('.layer-over2').show();
				playNum = -1;
				this.overState = 1;
				isOverState = true;
				return;
			}
			this.overState = 1;
			this.layer1.visible = false;
			this.layer1_btn2.visible = false;
			this.layer1_btn1.setTexture('layer2_btn1');
			this.layer2.visible = true;
			this.layer2_btn2.visible = true;
			this.layer1Container.visible = true;
			playNum = -1;
		}
	}

	addm(type) {
		var arr = [50,60,70,80,90,100];
		var i = random(0, 5);

		if ( type == 'health' ) {
			gameNode2.player2.health += arr[i];
		}else if ( type == 'power' ) {
			gameNode2.player2.power += arr[i];
		}else if (type == 'speed' ){
			gameNode2.player2.speed += arr[i];
		}
		return arr[i];
	}

}

var firstIndex = 0;
var isOverState = false;
var playNum = 3;
var runIndex = 0;
var curIndex = 0;
var runState = false;
var runTimeID = null;
var runRoleNode = null;
var gameNode2 = null;
var mapData = [];
var blockData = [];

function random(lower, upper) {
	return Math.floor(Math.random() * (upper - lower)) + lower;
};

$(function(){

	$('.btn4').on('click',function(e){
		e.stopPropagation();
		e.preventDefault();
		$('.layer').hide();
		runRoleNode.over();
	});

	$('.btn4_2_enter').on('click',function(e){
		e.stopPropagation();
		e.preventDefault();
		gameNode2.music.pause();
		gameNode2.scene.start('gameScene', {
			player: gameNode2.player, 
			socket: gameNode2.socket,
			username: gameNode2.username
		});
		$('.layer-mm2, .layer-mm3').hide();
	});

	$('.btn4_2').on('click',function(e){
		e.stopPropagation();
		e.preventDefault();
		$('.layer-mm2, .layer-mm3').hide();
	});

	var isEnabled = true;

	$('.btn5').on('click',function(e){
		e.stopPropagation();
		e.preventDefault();
		var v = $('.game-input').val();
		if ( v == '↑↑↓↓←→←→ba' ) {
			gameNode2.player.power = 500;
			gameNode2.player.health = 500;
			gameNode2.player.speed = 500;
			gameNode2.text1.text = 'Health: 500';
			gameNode2.text2.text = 'Speed: 500';
			gameNode2.text3.text = 'Power: 500';
			$('.layer-mm').hide();
			$('.layer-mm2').show();
		}else{
			$('.layer-mm').hide();
			$('.layer-mm3').show();
		}
	});

	$('.btn6').on('click',function(e){
		e.stopPropagation();
		e.preventDefault();
		$('.layer-mm').hide();
	});

	$('.btn4_3').on('click',function(e){
		e.stopPropagation();
		e.preventDefault();
		$('.layer-over2').hide();
		gameNode2.enter.visible = true;
	});

	$('.game-input').keydown(function(event){
		var v = $('.game-input').val();
		if ( event.keyCode == 38 ) {
			v = v + '↑';
		}else if ( event.keyCode == 40 ) {
			v = v + '↓';
		}else if ( event.keyCode == 37 ) {
			v = v + '←';
		}else if ( event.keyCode == 39 ) {
			v = v + '→';
		};
		$('.game-input').val(v);
	});

	$(document).keydown(function(event){
		if ( event.keyCode == 13 && isEnabled && isOverState ) {
			isEnabled = false;
			$('.layer-mm').show();
		};
	});

});