class Dummies
{
    constructor(_context)
    {
        this.context = _context;
        this.positionY = 700;
    }

    
    
    initAllDummies() 
    {
        this.initSaltDummy();
        this.initSourDummy();
        this.initSweetDummy();
        this.initSpicyDummy();
    }

    initSaltDummy()
    {
            this.context.salt = new SaltyCharacter();
            this.context.salt.startPositionY = this.positionY;
            this.context.salt.username = this.context.add.text(-20, -70, "Salty", { fontSize: '24px', fill: 'white' });
            this.context.salt.sprite = this.context.physics.add.sprite(0, 0, 'kitchenScene', 'mouse_walk/mouse_walk-2.png');
            this.context.salt.meleeSprite = this.context.physics.add.sprite(0, 0, 'knife_layer');
            this.context.salt.initSprite(this.context);
    } 

    initSourDummy()
    {
            this.context.sour = new SourCharacter();
            this.context.sour.startPositionY = this.positionY;
            this.context.sour.startPositionX = 400;
            this.context.sour.username = this.context.add.text(-20, -70, "Sour", { fontSize: '24px', fill: 'white' });
            this.context.sour.sprite = this.context.physics.add.sprite(0, 0, 'kitchenScene', 'mouse_walk/mouse_walk-2.png');
            this.context.sour.meleeSprite = this.context.physics.add.sprite(0, 0, 'knife_layer');
            this.context.sour.initSprite(this.context);
    }

    initSweetDummy()
    {
            this.context.sweet = new SweetCharacter();
            this.context.sweet.startPositionY = this.positionY;
            this.context.sweet.startPositionX = 600;
            this.context.sweet.username = this.context.add.text(-20, -70, "Sweet", { fontSize: '24px', fill: 'white' });
            this.context.sweet.sprite = this.context.physics.add.sprite(0, 0, 'kitchenScene', 'mouse_walk/mouse_walk-2.png');
            this.context.sweet.meleeSprite = this.context.physics.add.sprite(0, 0, 'knife_layer');
            this.context.sweet.initSprite(this.context);
    }

    initSpicyDummy()
    {
            this.context.spicy = new SpicyCharacter();
            this.context.spicy.startPositionY = this.positionY;
            this.context.spicy.startPositionX = 800;
            this.context.spicy.username = this.context.add.text(-20, -70, "Spicy", { fontSize: '24px', fill: 'white' });
            this.context.spicy.sprite = this.context.physics.add.sprite(0, 0, 'kitchenScene', 'mouse_walk/mouse_walk-2.png');
            this.context.spicy.meleeSprite = this.context.physics.add.sprite(0, 0, 'knife_layer');
            this.context.spicy.initSprite(this.context);
    }
    
    updateHealth()
    {
        this.context.sour.updateHealth();
        this.context.sweet.updateHealth();
        this.context.spicy.updateHealth();
        this.context.salt.updateHealth();
    }
    
    initGroup()
    {
        this.context.dummiesGroup = this.context.physics.add.group();
        
        
        this.context.dummiesGroup.add(this.context.salt.myContainer);
        this.context.dummiesGroup.add(this.context.sour.myContainer);
        this.context.dummiesGroup.add(this.context.spicy.myContainer);
        this.context.dummiesGroup.add(this.context.sweet.myContainer);
    }
    
    initColliders()
    {
        
    }
    
    initSaltCollide()
    {
        
    }
    
}