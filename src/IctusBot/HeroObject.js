
"use strict";  


function HeroObject(InSpriteTexture) 
{
    this.HeroRender = new LightRenderComponent(InSpriteTexture);
    this.HeroRender.SetColor([1, 1, 1, 0.1]);
    this.HeroRender.GetTransform().SetPosition(0, 0);
    this.HeroRender.GetTransform().SetScale(5.8, 8);
    
    this.HeroRender.SetSpriteSequence(3072, 0, 512, 512, 6, 0);
    this.HeroRender.SetAnimationType(AnimatedSpriteRenderComponent.EAnimationType.EAnimateStoped);
    this.HeroRender.SetFrameRate(15);

    GameObject.call(this, this.HeroRender);
    
    this.HeroMovement = new HeroMovementControl(this);
    this.Facing = HeroObject.EFaceing.ETop;
    this.Speed = 10.0;

    
}

IctusBot.Core.InheritPrototype(HeroObject, GameObject);

HeroObject.EFaceing = Object.freeze({ ELeft: 0, ERight: 1, ETop: 2, EBottom: 3 });


HeroObject.prototype.SetFacing = function (Facing) 
{
    this.Facing = Facing;

    switch (Facing) 
    {
        case UnityObject.EFaceing.ELeft:
            this.HeroRender.SetSpriteSequence(1024, 0, 341, 341, 6, 0);
            break;
        case UnityObject.EFaceing.ERight:
            this.HeroRender.SetSpriteSequence(683, 0, 341, 341, 6, 0);
            break;
        case UnityObject.EFaceing.ETop:
            this.HeroRender.SetSpriteSequence(341, 0, 341, 341, 6, 0);
            break;
        case UnityObject.EFaceing.EBottom:
            this.HeroRender.SetSpriteSequence(1365, 0, 341, 341, 6, 0); 
            break;
    }
}

// case UnityObject.EFaceing.ELeft:
// this.HeroRender.SetSpriteSequence(768, 0, 341, 256, 6, 0);
// break;
// case UnityObject.EFaceing.ERight:
// this.HeroRender.SetSpriteSequence(512, 0, 341, 256, 6, 0);
// break;
// case UnityObject.EFaceing.ETop:
// this.HeroRender.SetSpriteSequence(256, 0, 341, 256, 6, 0);
// break;
// case UnityObject.EFaceing.EBottom:
// this.HeroRender.SetSpriteSequence(1024, 0, 341, 256, 6, 0); 
// break;

// case UnityObject.EFaceing.ELeft:
// this.HeroRender.SetSpriteSequence(1536, 0, 341, 512, 6, 0);
// break;
// case UnityObject.EFaceing.ERight:
// this.HeroRender.SetSpriteSequence(1024, 0, 341, 512, 6, 0);
// break;
// case UnityObject.EFaceing.ETop:
// this.HeroRender.SetSpriteSequence(512, 0, 341, 512, 6, 0);
// break;
// case UnityObject.EFaceing.EBottom:
// this.HeroRender.SetSpriteSequence(2048, 0, 341, 512, 6, 0); 
// break;

// case UnityObject.EFaceing.ELeft:
// this.HeroRender.SetSpriteSequence(1536, 0, 512, 512, 6, 0);
// break;
// case UnityObject.EFaceing.ERight:
// this.HeroRender.SetSpriteSequence(1024, 0, 512, 512, 6, 0);
// break;
// case UnityObject.EFaceing.ETop:
// this.HeroRender.SetSpriteSequence(512, 0, 512, 512, 6, 0);
// break;
// case UnityObject.EFaceing.EBottom:
// this.HeroRender.SetSpriteSequence(2048, 0, 512, 512, 6, 0); 
// break;


HeroObject.prototype.SetBoardPosition = function (PositionX, PositionY, Face) 
{
    var RenderPosition = FMath.Parse.ToIsometric(PositionX, PositionY);    
    this.GetTransform().SetPosition(RenderPosition[0], RenderPosition[1]);   
    this.SetFacing(Face);
    this.UpdateState();
}

HeroObject.prototype.UpdateState = function () 
{
    var PositionX = this.GetTransform().GetXPosition();
    var PositionY = this.GetTransform().GetYPosition();
    this.GridPosition = FMath.Parse.ToGrid(PositionX, PositionY);
}

HeroObject.prototype.SetTargetLocation = function (x, y) 
{    
    this.HeroMovement.GoTo(x, y);
}

HeroObject.prototype.Update = function (DeltaTime) 
{
    this.UpdateState();
    this.HeroMovement.ProcessMovement(DeltaTime);
}

HeroObject.prototype.UpdateState = function () 
{
    var PositionX = this.GetTransform().GetXPosition();
    var PositionY = this.GetTransform().GetYPosition();
    this.GridPosition = FMath.Parse.ToGrid(PositionX, PositionY);
}





function HeroMovementControl(InGameObject) 
{
    this.OwnerObject = InGameObject;

    this.ElapsedTime = 0.0;
    this.TargetTime = 0.0;
    this.TargetPosition = vec2.fromValues(0, 0);    
    this.TargetGridPosition = vec2.fromValues(0, 0);
    
    this.CurrentTile = vec2.fromValues(0, 0);

    this.bNeedHorizontal = false;
    this.bNeedVertical = false;
    
    this.ParcialTargetPosition = vec2.fromValues(0, 0);    
    this.StartPosition;
    this.Run = false;

    this.PreviousTime = new Date().getTime();
    
}

HeroMovementControl.prototype.GoTo = function (TargetX, TargetY)
{
    this.TargetGridPosition[0] = TargetX;
    this.TargetGridPosition[1] = TargetY;

    this.TargetPosition = FMath.Parse.ToIsometric(TargetX, TargetY);    
    this.CurrentTile = FMath.Parse.ToGrid(this.OwnerObject.GetTransform().GetXPosition(), this.OwnerObject.GetTransform().GetYPosition());

    this.bNeedVertical = (this.CurrentTile[1] != TargetY) ? true : false;
    this.bNeedHorizontal = (this.CurrentTile[0] != TargetX) ? true : false;
    this.StartMove();
}

HeroMovementControl.prototype.StartMove = function ()
{    
    var LocalPosition = this.OwnerObject.GetTransform().GetPosition();
    this.StartPosition = vec2.clone(this.OwnerObject.GetTransform().GetPosition());    
    this.CurrentTile = FMath.Parse.ToGrid(LocalPosition[0], LocalPosition[1]);
    
    if(this.bNeedHorizontal)
    {       
        if(this.CurrentTile[0] < this.TargetGridPosition[0])
        {
            this.OwnerObject.SetFacing(UnityObject.EFaceing.EBottom);
        }
        else
        {
            this.OwnerObject.SetFacing(UnityObject.EFaceing.ETop);                         
        }

        this.ParcialTargetPosition = FMath.Parse.ToIsometric(this.TargetGridPosition[0], this.CurrentTile[1]);     
        this.bNeedHorizontal = false;
        this.Run = true;
    }
    else if(this.bNeedVertical)
    {   
        if(this.CurrentTile[1] < this.TargetGridPosition[1])
        {
            this.OwnerObject.SetFacing(UnityObject.EFaceing.ELeft);
        }
        else
        {
            this.OwnerObject.SetFacing(UnityObject.EFaceing.ERight);            
        }

        this.ParcialTargetPosition = FMath.Parse.ToIsometric(this.CurrentTile[0], this.TargetGridPosition[1]);
        this.bNeedVertical = false;
        this.Run = true;
    }
    else
    {
        this.Run = false;        
    }

    if(this.Run)
    {
        var DeltaDistance = vec2.distance(LocalPosition, this.ParcialTargetPosition);
        this.TargetTime = DeltaDistance / this.OwnerObject.Speed;
        this.ElapsedTime = 0.0;
        OwnerObject.SetAnimationType(AnimatedSpriteRenderComponent.EAnimationType.EAnimateSwing);
    }
    else
    {
        this.OwnerObject.GetTransform().SetPosition(this.TargetPosition[0], this.TargetPosition[1]);
        OwnerObject.SetAnimationType(AnimatedSpriteRenderComponent.EAnimationType.EAnimateStoped);        
        // Chamar o Callback!!!
    }

    
}

HeroMovementControl.prototype.ProcessMovement = function (DeltaTime) 
{
   if(this.Run)
   {
        this.ElapsedTime += DeltaTime / 1000;

        vec2.lerp(this.OwnerObject.GetTransform().GetPosition(), this.StartPosition, 
                  this.ParcialTargetPosition, this.ElapsedTime / this.TargetTime);

        if(this.ElapsedTime >= this.TargetTime)
        {
            this.Run = false;
            this.OwnerObject.GetTransform().SetPosition(this.ParcialTargetPosition[0], this.ParcialTargetPosition[1]);
            this.StartMove();            
        }
   }
};