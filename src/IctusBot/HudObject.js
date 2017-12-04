"use strict";  


function HudObject(InSpriteTexture, InGameInstance) 
{
    this.GameInstanceRef = InGameInstance;

    //this.HudRender = new SpriteSheetRenderComponent(InSpriteTexture);
    this.HudRender = new LightRenderComponent(InSpriteTexture);
    //
    this.HudRender.SetColor([1, 1, 1, 0.5]);
    this.HudRender.GetTransform().SetPosition(-10, 11);
    this.HudRender.GetTransform().SetScale(12, 14);
    this.HudRender.SetElementPixelPositions(0, 341, 0, 350);
    this.HudRender.AddLight(this.GameInstanceRef.GlobalLightSet.GetLightAt(1));

    GameObject.call(this, this.HudRender);

    this.ModerntIcon = new SpriteSheetRenderComponent(this.GameInstanceRef.kModernIcon);
    this.ModerntIcon.SetColor([1, 1, 1, 0.1]);
    this.ModerntIcon.GetTransform().SetPosition(-55.5, 8.5);
    this.ModerntIcon.GetTransform().SetScale(8, 8);
    this.ModerntIcon.SetElementPixelPositions(0, 128, 0, 128);

    this.AncientIcon = new SpriteSheetRenderComponent(this.GameInstanceRef.kAncientIcon);
    this.AncientIcon.SetColor([1, 1, 1, 0.1]);
    this.AncientIcon.GetTransform().SetPosition(35.3, 8.5);
    this.AncientIcon.GetTransform().SetScale(8, 8);
    this.AncientIcon.SetElementPixelPositions(0, 128, 0, 128);

    //IctusBot.Textures.UnloadTexture(this.kAncientIcon);
    //IctusBot.Textures.UnloadTexture(this.kModernIcon);

    this.AncientPlayerName = new FontRenderComponent("");
    this.AncientPlayerName.SetColor([1, 1, 1, 1]);
    this.AncientPlayerName.GetTransform().SetPosition(30, 9);
    this.AncientPlayerName.SetTextHeight(2);

    this.ModernPlayerName = new FontRenderComponent("");
    this.ModernPlayerName.SetColor([1, 1, 1, 1]);
    this.ModernPlayerName.GetTransform().SetPosition(-50, 9);
    this.ModernPlayerName.SetTextHeight(2);

    this.TimeText = new FontRenderComponent("00:00");
    this.TimeText.SetColor([0, 0, 0, 1]);
    this.TimeText.GetTransform().SetPosition(-11.2, 10);
    this.TimeText.SetTextHeight(1.2);

    this.GameTime = 0;
    this.BeginTime = null;
        
}

IctusBot.Core.InheritPrototype(HudObject, GameObject);

HudObject.EState = Object.freeze({ EAncient: 0, EModern: 1, EGameOver: 2 });

HudObject.prototype.Render = function (InCamera)
{
    GameObject.prototype.Render.call(this, InCamera);
    
    this.AncientIcon.Render(InCamera);
    this.ModerntIcon.Render(InCamera);    
    this.ModernPlayerName.Render(InCamera);
    this.AncientPlayerName.Render(InCamera);
    
    this.TimeText.Render(InCamera);
}

HudObject.prototype.Update = function (DeltaTime) 
{
    if(this.GameInstanceRef.GameStarted && !this.GameInstanceRef.IsPaused)
    {
        var CurrentTime = new Date().getTime();
        this.GameTime = CurrentTime - this.BeginTime;
        var Minutes = Math.floor((this.GameTime % (1000 * 60 * 60)) / (1000 * 60));
        var Seconds = Math.floor((this.GameTime % (1000 * 60)) / 1000);
        var TimeStr = ("0" + Minutes).slice(-2) + ":" +("0" + Seconds).slice(-2);
        this.TimeText.SetText(TimeStr);
    }
}

HudObject.prototype.StartMatch = function () 
{
    this.BeginTime = new Date().getTime();
    this.ModernPlayerName.SetText(this.GameInstanceRef.ModernPlayerNameStr);
    this.AncientPlayerName.SetText(this.GameInstanceRef.AncientPlayerNameStr); 
    var len = this.GameInstanceRef.AncientPlayerNameStr.length;
    var x = 31 - this.AncientPlayerName.GetTransform().GetWidth();//((len * 1.8) /2);
    this.AncientPlayerName.GetTransform().SetPosition(x, 9);
}

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
        this.GameInstanceRef.IsPaused = true;
        window.setTimeout(this.GameOver, 100);
        break;
    }
}


HudObject.prototype.GameOver = function () 
{
    var Result = VerifyEndGame();
    var bIsAncientWins = Result == 1;

    this.SendData(this.GameInstanceRef.AncientPlayerNameStr, this.GameInstanceRef.ModernPlayerNameStr, this.GameTime, bIsAncientWins);
}



HudObject.prototype.SendData = function (AncientName, ModernName, TimeOfMatch, IsAncientWins)
{


}



