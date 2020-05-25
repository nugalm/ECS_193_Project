class RandomDropsHandler 
{
    constructor(_context)
    {
        this.context = _context;
        // Group to add and remove weapon and fruit drops
        this.group;
        
        // the initial drops to be added to group. afterwards, these should NOT be accessed
        this.avocado;
        this.pepper;
        this.blueberry;
        
        this.knife;
        this.whisk;
        this.fork;
        
        this.frosting_bag;
        this.bottle;
        this.salt_shaker;
        
        //hard-coded spawn locations
        this.positionX1 = 1344;
        this.positionY1 = 1504;
        this.isAvailable1 = false;
        
        this.positionX2 = 2336;
        this.positionY2 = 2048;
        this.isAvailable2 = false;
        
        this.positionX3 = 2176; 
        this.positionY3 = 672;
        this.isAvailable3 = false;
        
        this.positionX4 = 416;
        this.positionY4 = 1536;
        this.isAvailable4 = false;
        
        this.positionX5 = 1088; 
        this.positionY5 = 2208;
        this.isAvailable5 = false;
        
        this.positionX6 = 384;
        this.positionY6 = 2240;
        this.isAvailable6 = false;
        
        this.positionX7 = 2272;
        this.positionY7 = 1600;
        this.isAvailable7 = false;
        
        this.positionX8 = 1312;
        this.positionY8 = 640;
        this.isAvailable8 = false;
        
        this.positionX9 = 1824;
        this.positionY9 = 2336;
        this.isAvailable9 = false;
        
        
        
        
    }
    
    init(_context)
    {
        this.initGroup();
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
        this.initSaltShaker();
        this.initFrostingBag();
        this.initBottle();
        this.initFork();
        this.initWhisk();
        this.initKnife();

    }
    
    addDropsToGroup()
    {
        this.group.add(this.avocado);
        this.group.add(this.pepper);
        this.group.add(this.blueberry);
        this.group.add(this.salt_shaker);
        this.group.add(this.frosting_bag);
        this.group.add(this.bottle);
        this.group.add(this.whisk);
        this.group.add(this.fork);
        this.group.add(this.knife);
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
    
    initSaltShaker()
    {
        this.salt_shaker = new Weapon({scene: this.context, x:this.salt_shakerX, y:this.salt_shakerY, key: "salt_shaker_drop_image"})
    }
    
    initFrostingBag()
    {
        this.frosting_bag = new Weapon({scene: this.context, x:this.frosting_bagX, y:this.frosting_bagY, key: "frosting_bag_drop_image"})
    }
    
    initBottle()
    {
        this.bottle = new Weapon({scene: this.context, x:this.bottleX, y:this.bottleY, key: "squirter_drop_image"})
        
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
        this.knife = new Weapon({scene: this.context, x:this.knifeX, y:this.knifeY, key:"knife_drop_image"});
    }

    respawn() 
    {
        var random = Phaser.Math.RND;
        var position = random.between(1, 9);
        while (true)
        {
          
            if (this.isPositionAvailable(position)) 
            {
                break;
            }
            position = random.between(1, 9);
        }
        console.log("position found: ", position)
        switch (position) 
        {
                case 1:
                    this.addRandomDrop(this.positionX1, this.positionY1);
                    this.isAvailable1 = false;
                    break;
                case 2:
                    this.addRandomDrop(this.positionX2, this.positionY2);
                    this.isAvailable2 = false;
                    break;
                case 3:
                    this.addRandomDrop(this.positionX3, this.positionY3);
                    this.isAvailable3 = false;
                    break;
                case 4:
                    this.addRandomDrop(this.positionX4, this.positionY4);
                    this.isAvailable4 = false;
                    break;
                case 5:
                    this.addRandomDrop(this.positionX5, this.positionY5);
                    this.isAvailable5 = false;
                    break;
                case 6:
                    this.addRandomDrop(this.positionX6, this.positionY6);
                    this.isAvailable6 = false;
                    break;
                case 7:
                    this.addRandomDrop(this.positionX7, this.positionY7);
                    this.isAvailable7 = false;
                    break;
                case 8:
                    this.addRandomDrop(this.positionX8, this.positionY8);
                    this.isAvailable8 = false;
                    break;
                case 9:
                    this.addRandomDrop(this.positionX9, this.positionY9);
                    this.isAvailable9 = false;
                    break;
                
        }
    }
    
    /**
        takes in a number @n between 1 and 9 and checks if the numbered position does not currently have an item spawned on it.
        returns @n back;
    **/
    
    isPositionAvailable(n)
    {
        
        switch (n)
        {
            case 1:
                if (this.isAvailable1) 
                {
                    return true;
                }
                break;
            case 2:
                if (this.isAvailable2) 
                {
                    return true;
                }
                break;
            case 3:
                if (this.isAvailable3) 
                {
                    return true;
                }
                break;
            case 4:
                if (this.isAvailable4) 
                {
                    return true;
                }
                break;
            case 5:
                if (this.isAvailable5) 
                {
                    return true;
                }
                break;
            case 6:
                if (this.isAvailable6) 
                {
                    return true;
                }
                break;
            case 7:
                if (this.isAvailable7) 
                {
                    return true;
                }
                break;
            case 8:
                if (this.isAvailable8) 
                {
                    return true;
                }
                break;
            case 9:
                if (this.isAvailable9) 
                {
                    return true;
                }
                break;
            default: 
                console.log("position given is not between 1 and 9");
                break;
        }
        return false;
    }
    
    /** 
        function that creates a random drop (ranged, melee, or fruit)
        and puts it into the respective group 
        takes in given @x and @y respawn coordinates
    **/
    addRandomDrop(x, y)
    {
        var random = Phaser.Math.RND;
        var n = random.between(1, 9);
        var drop;
        switch (n) 
        {
                case 1:
                    drop = new Drop({scene: this.context, x: x, y: y, key: "pepper_drop_image"}); 
                    this.group.add(drop);
                    break;
                case 2:
                    drop = new Drop({scene: this.context, x: x, y: y, key: "avocado_drop_image"});
                    this.group.add(drop);
                    break;
                case 3:
                    drop = new Drop({scene: this.context, x: x, y: y, key: "blueberry_drop_image"});
                    this.group.add(drop);
                    break;
                case 4:
                    drop = new Weapon({scene: this.context, x: x, y: y, key: "fork_drop_image"});  
                    this.group.add(drop);
                    break;
                case 5:
                    drop = new Weapon({scene: this.context, x: x, y: y, key: "whisk_drop_image"});  
                    this.group.add(drop);
                    break;
                case 6:
                    drop = new Weapon({scene: this.context, x: x, y: y, key: "knife_drop_image"});
                    this.group.add(drop);
                    break;
                case 7:
                    drop = new Weapon({scene: this.context, x: x, y: y, key: "salt_shaker_drop_image"});
                    this.group.add(drop);
                    break;
                case 8:
                    drop = new Weapon({scene: this.context, x: x, y: y, key: "frosting_bag_drop_image"});
                    this.group.add(drop);
                    break;
                case 9:
                    drop = new Weapon({scene: this.context, x: x, y: y, key: "squirter_drop_image"}); 
                    this.group.add(drop);
                    break;
                default: 
                    break;
                
        }// end switch    
    }
    
    /**
        function to be called when a drop is picked up. Checks what position the drop was in and makes the position available for respawn.
    **/
    updateAvailablePositions(x, y) 
    {
        // only need to switch x since none of our hard coded x positions are the same 
        switch (x) 
        {
            case this.positionX1:
                this.isAvailable1 = true;
                break;
            case this.positionX2:
                this.isAvailable2 = true;
                break;
            case this.positionX3:
                this.isAvailable3 = true;
                break;
            case this.positionX4:
                this.isAvailable4 = true;
                break;
            case this.positionX5:
                this.isAvailable5 = true;
                break;
            case this.positionX6:
                this.isAvailable6 = true;
                break;
            case this.positionX7:
                this.isAvailable7 = true;
                break;
            case this.positionX8:
                this.isAvailable8 = true;
                break;
            case this.positionX9:
                this.isAvailable9 = true;
                break;
        }
        
        
    }
}