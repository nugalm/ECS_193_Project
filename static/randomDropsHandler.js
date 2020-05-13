class RandomDropsHandler 
{
    constructor(_context)
    {
        this.context = _context;
        // Group to add and remove weapon and fruit drops
        this.group;
        this.weapon_group;
        
        this.avocado;
        this.pepper;
        this.blueberry;
        
        this.knife;
        this.whisk;
        this.fork;
        
        this.frosting_bag;
        this.bottle;
        this.salt_shaker;
        
        this.respawn_timer;
        
        this.pepperPositionX = 1344;
        this.pepperPositionY = 1504;
        
        this.blueberryPositionX = 2336;
        this.blueberryPositionY = 2048;
        
        this.avocadoPositionX = 2176; 
        this.avocadoPositionY = 672;
        
        this.salt_shakerX = 416;
        this.salt_shakerY = 1536;
        
        this.frosting_bagX = 1088; 
        this.frosting_bagY = 2208;
        
        this.bottleX = 384;
        this.bottleY = 2240;
        
        this.forkX = 2272;
        this.forkY = 1600;
        
        this.whiskX = 1312;
        this.whiskY = 640;
        
        this.knifeX = 1824;
        this.knifeY = 2336;
        
        
    }
    
    init(_context)
    {
        this.initGroup();
        this.initWeaponGroup();
    }
    
    initGroup()
    {
        this.group = this.context.physics.add.group();
        this.initDropSprites();
        this.addDropsToGroup();
        
    }
    
    initDropSprites()
    {

        this.initAvocado();
        this.initPepper();
        this.initBlueberry();

    }
    
    addDropsToGroup()
    {
        this.group.add(this.avocado);
        this.group.add(this.pepper);
        this.group.add(this.blueberry);
    }
    
    initPepper()
    {
        this.pepper = new Drop({scene: this.context, x:this.pepperPositionX, y:this.pepperPositionY, key: "pepper_drop_image"})
    }
    
    initBlueberry()
    {
        this.blueberry = new Drop({scene: this.context, x:this.blueberryPositionX, y:this.blueberryPositionY, key: "blueberry_drop_image"})
    }
    
    initAvocado()
    {
        this.avocado = new Drop({scene: this.context, x:this.avocadoPositionX, y:this.avocadoPositionY, key: "avocado_drop_image"})
        
    }

    respawn(_child) 
    {
        if (_child == this.avocado) 
        {
            this.avocado.enableBody(true, this.avocadoPositionX, this.avocadoPositionY, true, true);
        }
        
        else if (_child == this.pepper) 
        {
            this.pepper.enableBody(true, this.pepperPositionX, this.pepperPositionY, true, true);
        }
        
        else if(_child == this.blueberry) 
        {
            this.blueberry.enableBody(true, this.blueberryPositionX, this.blueberryPositionY, true, true);
        }
    }
    
    
     initWeaponGroup()
    {
        this.weapon_group = this.context.physics.add.group();
        this.initWeaponDropSprites();
        this.addWeaponDropsToGroup();
        
    }
    
    initWeaponDropSprites()
    {

        this.initSaltShaker();
        this.initFrostingBag();
        this.initBottle();
        this.initFork();
        this.initWhisk();
        this.initKnife();

    }
    
    addWeaponDropsToGroup()
    {
        this.weapon_group.add(this.salt_shaker);
        this.weapon_group.add(this.frosting_bag);
        this.weapon_group.add(this.bottle);
        this.weapon_group.add(this.whisk);
        this.weapon_group.add(this.fork);
        this.weapon_group.add(this.knife);
    }
    
    initSaltShaker()
    {
        this.salt_shaker = new Drop({scene: this.context, x:this.salt_shakerX, y:this.salt_shakerY, key: "salt_shaker_drop_image"})
    }
    
    initFrostingBag()
    {
        this.frosting_bag = new Drop({scene: this.context, x:this.frosting_bagX, y:this.frosting_bagY, key: "frosting_bag_drop_image"})
    }
    
    initBottle()
    {
        this.bottle = new Drop({scene: this.context, x:this.bottleX, y:this.bottleY, key: "squirter_drop_image"})
        
    }
 
    initFork()
    {
        this.fork = new Weapon({scene: this.context, x:this.forkX, y:this.forkY, key:"fork_drop_image"}); 
    }
    initWhisk()
    {
        this.whisk = new Weapon({scene: this.context, x:this.whiskX, y:this.whiskY, key:"whisk_drop_image"});
    }
    initKnife()
    {
        this.knife = new Knife({scene: this.context, x:this.knifeX, y:this.knifeY, key:"knife_drop_image"});
    }

    respawnWeapon(_child) 
    {
        if (_child == this.salt_shaker) 
        {
            this.salt_shaker.enableBody(true, this.salt_shakerX, this.salt_shakerY, true, true);
        }
        
        else if (_child == this.frosting_bag) 
        {
            this.frosting_bag.enableBody(true, this.frosting_bagX, this.frosting_bagY, true, true);
        }
        
        else if(_child == this.bottle) 
        {
            this.bottle.enableBody(true, this.bottleX, this.bottleY, true, true);
        }
        
        else if (_child == this.knife) 
        {
            this.knife.enableBody(true, this.knifeX, this.knifeY, true, true);
        }
        else if(_child == this.fork)
        {
            this.fork.enableBody(true, this.forkX, this.forkY, true, true);
        }
        else if (_child == this.whisk)
        {
            this.whisk.enableBody(true, this.whiskX, this.whiskY, true, true);
        }
    }
}