"use strict";  



function UnityObject(InSpriteTexture) 
{
    this.UnityRender = new SpriteSheetRenderComponent(InSpriteTexture);
    this.UnityRender.SetColor([1, 1, 1, 0.1]);
    this.UnityRender.GetTransform().SetPosition(0, 0);
    this.UnityRender.GetTransform().SetScale(10, 6);
    this.UnityRender.SetElementPixelPositions(0, 128, 0, 64);
    
    GameObject.call(this, this.UnityObject);


    this.TargetPositionX = 0;
    this.TargetPositionY = 0;

    this.IsoOffsetX = 6.4;
    this.IsoOffsetY = -3.2;

}

IctusBot.Core.InheritPrototype(UnityObject, GameObject);

UnityObject.EFaceing = Object.freeze({ ELeft: 0, ERight: 1, ETop: 2, EBottom: 3 });

UnityObject.prototype.SetBoardPosition = function (PositionX, PositionY) 
{
    var RenderXPosition = (PositionX - PositionY) * this.IsoOffsetX;
    var RenderYPosition = (PositionX + PositionY) * this.IsoOffsetY;
    RenderYPosition += this.IsoOffsetY;

    var Transform = this.GetTransform();
    Transform.SetPosition(RenderXPosition, RenderYPosition);
}

UnityObject.prototype.SetFacing = function (Facing) 
{
    switch (Facing) 
    {
    case UnityObject.EFaceing.ELeft:
        this.UnityRender.SetElementPixelPositions(0, 128, 0, 64);
        break;
    case UnityObject.EFaceing.ERight:
        this.UnityRender.SetElementPixelPositions(0, 128, 0, 64);
        break;
    case UnityObject.EFaceing.ETop:
        this.UnityRender.SetElementPixelPositions(0, 128, 0, 64);
        break;
    case UnityObject.EFaceing.EBottom:
        this.UnityRender.SetElementPixelPositions(0, 128, 0, 64); 
        break;
    }
}


UnityObject.prototype.Update = function () 
{

}




