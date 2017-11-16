"use strict";  


function ExplosionObject(InSpriteTexture) 
{
    this.ExplosionRender = new AnimatedSpriteRenderComponent(InSpriteTexture);
    this.ExplosionRender.SetColor([1, 1, 1, 0.1]);
    this.ExplosionRender.GetTransform().SetPosition(500, 500);
    this.ExplosionRender.GetTransform().SetScale(5.8, 8);
    
    this.ExplosionRender.SetSpriteSequence(256, 0, 200, 200, 10, 0);
    this.ExplosionRender.SetAnimationType(AnimatedSpriteRenderComponent.EAnimationType.EAnimateStoped);
    this.ExplosionRender.SetFrameRate(15);

    GameObject.call(this, this.ExplosionRender);
    
    this.kExplosionAudio = "Assets/Sounds/Explosion.mp3";
}

IctusBot.Core.InheritPrototype(ExplosionObject, GameObject);

ExplosionObject.prototype.Update = function (DeltaTime) 
{
    this.ExplosionRender.UpdateAnimation();
    if(this.ExplosionRender.AnimationType == AnimatedSpriteRenderComponent.EAnimationType.EAnimateStoped)
    {
        this.GetTransform().SetPosition(500, 500);
    }
}

ExplosionObject.prototype.Run = function (X, Y) 
{    
    IctusBot.AudioClips.PlayCue(this.kExplosionAudio);
    this.ExplosionRender.SetAnimationType(AnimatedSpriteRenderComponent.EAnimationType.EOneTime);
    var RenderPosition = FMath.Parse.ToIsometricRender(X, Y);    
    this.GetTransform().SetPosition(RenderPosition[0], RenderPosition[1]);
}