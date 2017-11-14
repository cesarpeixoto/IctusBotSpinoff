"use strict";  



function UnityObject(InSpriteTexture) 
{
    this.UnityRender = new SpriteSheetRenderComponent(InSpriteTexture);
    this.UnityRender.SetColor([1, 1, 1, 0.1]);
    this.UnityRender.GetTransform().SetPosition(0, 0);
    this.UnityRender.GetTransform().SetScale(5.8, 7);
    this.UnityRender.SetElementPixelPositions(350, 742, 350, 700);

    GameObject.call(this, this.UnityRender);
    
    this.UnityMovement = new MovementControl(this);
    this.Facing = UnityObject.EFaceing.ETop;
    this.Speed = 10.0;

    
}

IctusBot.Core.InheritPrototype(UnityObject, GameObject);

UnityObject.EFaceing = Object.freeze({ ELeft: 0, ERight: 1, ETop: 2, EBottom: 3 });

UnityObject.prototype.SetBoardPosition = function (PositionX, PositionY, Face) 
{
    //var RenderXPosition = (PositionX - PositionY) * this.IsoOffsetX;
    //var RenderYPosition = (PositionX + PositionY) * this.IsoOffsetY;
    var RenderPosition = FMath.Parse.ToIsometric(PositionX, PositionY);
    this.GetTransform().SetPosition(RenderPosition[0], RenderPosition[1]);
    
    this.SetFacing(Face);
    this.UpdateState();
}

UnityObject.prototype.SetFacing = function (Facing) 
{
    this.Facing = Facing;

    switch (Facing) 
    {
    case UnityObject.EFaceing.ELeft:
        this.UnityRender.SetElementPixelPositions(0, 280, 350, 700);
        break;
    case UnityObject.EFaceing.ERight:
        this.UnityRender.SetElementPixelPositions(390, 742, 0, 350);
        break;
    case UnityObject.EFaceing.ETop:
    this.UnityRender.SetElementPixelPositions(0, 280, 0, 350);
        break;
    case UnityObject.EFaceing.EBottom:
    this.UnityRender.SetElementPixelPositions(350, 742, 350, 700); 
        break;
    }
}

UnityObject.prototype.SetTargetLocation = function (x, y) 
{
    // var TargetPositionX = (x - y) * this.IsoOffsetX;
    // var TargetPositionY = (x + y) * this.IsoOffsetY;
    var TargetPosition = FMath.Parse.ToIsometric(x, y);
    this.UnityMovement.GoTo(TargetPosition[0], TargetPosition[1]);
}

UnityObject.prototype.Update = function (DeltaTime) 
{
    this.UpdateState();

    this.UnityMovement.ProcessMovement(DeltaTime);
}

UnityObject.prototype.UpdateState = function () 
{
    var PositionX = this.GetTransform().GetXPosition();
    var PositionY = this.GetTransform().GetYPosition();
    this.GridPosition = FMath.Parse.ToGrid(PositionX, PositionY);
}


function MovementControl(InGameObject) 
{
    this.OwnerObject = InGameObject;

    this.ElapsedTime = 0.0;
    this.TargetTime = 0.0;
    this.TargetPosition = vec2.fromValues(0, 0);    

    this.bNeedHorizontal = false;
    this.bNeedVertical = false;
    this.ParcialTargetPosition = vec2.fromValues(0, 0);
    this.StartPosition;
    this.Run = false;

    this.PreviousTime = new Date().getTime();
    
}

MovementControl.prototype.GoTo = function (TargetX, TargetY)
{
    this.TargetPosition[0] = TargetX;
    this.TargetPosition[1] = TargetY;

    this.bNeedVertical = (this.OwnerObject.GetTransform().GetYPosition() != TargetY) ? true : false;
    this.bNeedHorizontal = (this.OwnerObject.GetTransform().GetXPosition() != TargetX) ? true : false;
    this.StartMove();
}

MovementControl.prototype.StartMove = function ()
{
    var LocalPosition = this.OwnerObject.GetTransform().GetPosition();
    this.StartPosition = vec2.clone(this.OwnerObject.GetTransform().GetPosition());
    if(this.bNeedVertical)
    {   
        if(LocalPosition[1] > this.TargetPosition[1])
        {
            this.OwnerObject.SetFacing(UnityObject.EFaceing.EBottom);
        }
        else
        {
            this.OwnerObject.SetFacing(UnityObject.EFaceing.ETop);
        }

        this.ParcialTargetPosition[0] = LocalPosition[0];
        this.ParcialTargetPosition[1] = this.TargetPosition[1];
        this.bNeedVertical = false;
        this.Run = true;
    }
    else if(this.bNeedHorizontal)
    {       
        if(LocalPosition[0] > this.TargetPosition[0])
        {
            this.OwnerObject.SetFacing(UnityObject.EFaceing.ERight);
        }
        else
        {
            this.OwnerObject.SetFacing(UnityObject.EFaceing.ELeft);
        }

        this.ParcialTargetPosition[0] = this.TargetPosition[0];
        this.ParcialTargetPosition[1] = LocalPosition[1];       
        this.bNeedHorizontal = false;
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
    }
    else
    {
        this.OwnerObject.GetTransform().SetPosition(this.TargetPosition[0], this.TargetPosition[1]);
        // Chamar o Callback!!!
    }

    
}

MovementControl.prototype.ProcessMovement = function (DeltaTime) 
{
   if(this.Run)
   {
        // var CurrentTime = new Date().getTime();
        // var DeltaTime = CurrentTime - this.PreviousTime;
        // this.PreviousTime = CurrentTime;

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