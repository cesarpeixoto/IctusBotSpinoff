"use strict";  


function HudObject(InSpriteTexture) 
{
    this.HudRender = new SpriteSheetRenderComponent(InSpriteTexture);
    this.HudRender.SetColor([1, 1, 1, 0.1]);
    this.HudRender.GetTransform().SetPosition(-10, 8);
    this.HudRender.GetTransform().SetScale(8, 10);
    this.HudRender.SetElementPixelPositions(0, 341, 0, 350);

    GameObject.call(this, this.HudRender);
    
    
}

IctusBot.Core.InheritPrototype(HudObject, GameObject);

HudObject.EState = Object.freeze({ EAncient: 0, EModern: 1, EGameOver: 2 });

HudObject.prototype.SetState = function (NewState) 
{
    switch (NewState) 
    {
    case HudObject.EState.EAncient:
        this.HudRender.SetElementPixelPositions(0, 341, 0, 350);
        break;
    case HudObject.EState.EModern:
        this.HudRender.SetElementPixelPositions(341, 682, 0, 350);
        break;
    case HudObject.EState.EGameOver:
        this.HudRender.SetElementPixelPositions(682, 1024, 0, 350);
        break;
    }
}