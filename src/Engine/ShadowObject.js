"use strict";

// Aqui temos bastante código de fora... organizar e descrever as fontes depois..

function ShadowCaster (InShadowCaster, InShadowReceiver) 
{
    this.ShadowCaster = InShadowCaster;  
    this.ShadowReceiver = InShadowReceiver;
    this.CasterShader = IctusBot.DefaultResources.GetShadowCasterShader();
    this.ShadowColor = [0, 0, 0, 0.2];
    this.SaveTransform = new TransformComponent();
    
    this.kCasterMaxScale = 3;   
    this.kVerySmall = 0.001;    
    this.kDistanceFudge = 0.01; 
    this.kReceiverDistanceFudge = 0.6; 
}

ShadowCaster.prototype.SetShadowColor = function (Color) 
{
    this.ShadowColor = Color;
};

ShadowCaster.prototype.ComputeShadowGeometry = function(InLight) 
{    
    var cxf = this.ShadowCaster.GetTransform();
    var rxf = this.ShadowReceiver.GetTransform();

    var lgtToCaster = vec3.create();
    var lgtToReceiverZ;
    var receiverToCasterZ;
    var distToCaster, distToReceiver;  
    var scale;
    var offset = vec3.fromValues(0, 0, 0);
    
    receiverToCasterZ = rxf.GetZPosition() - cxf.GetZPosition();

    if (InLight.GetLightType() === LightObject.ELightType.EDirectionalLight) 
    {    
        if (((Math.abs(InLight.GetDirection())[2]) < this.kVerySmall) || ((receiverToCasterZ * (InLight.GetDirection())[2]) < 0)) 
        {
            return false;                               
        }
        vec3.copy(lgtToCaster, InLight.GetDirection());
        vec3.normalize(lgtToCaster, lgtToCaster);
        
        distToReceiver = Math.abs(receiverToCasterZ / lgtToCaster[2]);  
        scale = Math.abs(1/lgtToCaster[2]);
    } 
    else 
    {    
        vec3.sub(lgtToCaster, cxf.Get3DPosition(), InLight.GetPosition());
        lgtToReceiverZ = rxf.GetZPosition() - (InLight.GetPosition())[2];
        
        if ((lgtToReceiverZ * lgtToCaster[2]) < 0) 
        {
            return false;  
        }

        if ((Math.abs(lgtToReceiverZ) < this.kVerySmall) || ((Math.abs(lgtToCaster[2]) < this.kVerySmall))) 
        {
            return false;
        }

        distToCaster = vec3.length(lgtToCaster);
        vec3.scale(lgtToCaster, lgtToCaster, 1/distToCaster);
        
        distToReceiver = Math.abs(receiverToCasterZ / lgtToCaster[2]);  
        scale = (distToCaster + (distToReceiver * this.kReceiverDistanceFudge)) / distToCaster;
    }

    vec3.scaleAndAdd(offset, cxf.Get3DPosition(), lgtToCaster, distToReceiver + this.kDistanceFudge);
    
    cxf.SetRotationInRad( cxf.GetRotationInRad());
    cxf.SetPosition(offset[0], offset[1]);
    cxf.SetZPosition(offset[2]);
    cxf.SetWidth(cxf.GetWidth() * scale);
    cxf.SetHeight(cxf.GetHeight() * scale);
    
    return true;
};

ShadowCaster.prototype.Render = function(InCamera) 
{
    var CasterRenderComp = this.ShadowCaster.GetRenderComponent();
   
    this.ShadowCaster.GetTransform().CloneTo(this.SaveTransform);
    var s = CasterRenderComp.SwapShader(this.CasterShader);
    var c = CasterRenderComp.GetColor();
    CasterRenderComp.SetColor(this.ShadowColor);
    var Light = null;
    for (var l = 0; l < CasterRenderComp.NumLights(); l++) 
    {
        Light = CasterRenderComp.GetLightAt(l);
        if (Light.IsLightOn() && Light.IsLightCastShadow()) 
        {
            this.SaveTransform.CloneTo(this.ShadowCaster.GetTransform());
            if (this.ComputeShadowGeometry(Light)) 
            {
                this.CasterShader.SetLight(Light);
                SpriteSheetRenderComponent.prototype.Render.call(CasterRenderComp, InCamera);
            }
        }
    }
    this.SaveTransform.CloneTo(this.ShadowCaster.GetTransform());
    CasterRenderComp.SwapShader(s);
    CasterRenderComp.SetColor(c);
};


function ShadowReceiver (theReceiverObject) 
{
    this.kShadowStencilBit = 0x01;              
    this.kShadowStencilMask = 0xFF;             
    this.ReceiverShader = IctusBot.DefaultResources.GetShadowReceiverShader();
    
    this.Receiver = theReceiverObject;
    
    this.ShadowCaster = [];

    this.ToRemove = false;
    this.NewOne = null;
}
    
ShadowReceiver.prototype.AddShadowCaster = function (lgtRenderable) 
{
    var c = new ShadowCaster(lgtRenderable, this.Receiver);
    this.ShadowCaster.push(c);
};

ShadowReceiver.prototype.RemoveShadowCaster = function (ShadowCasterObject) 
{
    if(this.ToRemove)
    {
        for (var i = 0; i < this.NewOne.length; i++) 
        {
            if(this.NewOne[i].ShadowCaster == ShadowCasterObject)
            {
                var temp = null;
                temp = this.NewOne.filter(e => e !== this.NewOne[i]);
                this.NewOne = temp;
                this.ToRemove = true;
                break;
            }
        }
    }
    else
    {
        for (var i = 0; i < this.ShadowCaster.length; i++) 
        {
            if(this.ShadowCaster[i].ShadowCaster == ShadowCasterObject)
            {
                this.NewOne = this.ShadowCaster.filter(e => e !== this.ShadowCaster[i]);
                this.ToRemove = true;
                break;
            }                
        }
    }
    
};

ShadowReceiver.prototype.Render = function (InCamera) 
{
    if(this.ToRemove)
    {
        this.ShadowCaster = this.NewOne;
        this.NewOne = null;
        this.ToRemove = false;
    }

    this.Receiver.Render(InCamera);
    
    this.ShadowRecieverStencilOn();
    var s = this.Receiver.GetRenderComponent().SwapShader(this.ReceiverShader);
    this.Receiver.Render(InCamera);
    this.Receiver.GetRenderComponent().SwapShader(s);
    this.ShadowRecieverStencilOff();
    
    for (var c = 0; c < this.ShadowCaster.length; c++) 
    {
        this.ShadowCaster[c].Render(InCamera);
    }
    
    this.ShadowRecieverStencilDisable();
};

ShadowReceiver.prototype.ShadowRecieverStencilOn = function () 
{
    var glContext = IctusBot.Renderer.GetContext();
    glContext.clear(glContext.STENCIL_BUFFER_BIT);
    glContext.enable(glContext.STENCIL_TEST);
    glContext.colorMask(false, false, false, false);
    glContext.depthMask(false);
    glContext.stencilFunc(glContext.NEVER, this.kShadowStencilBit, this.kShadowStencilMask);
    glContext.stencilOp(glContext.REPLACE,glContext.KEEP, glContext.KEEP);
    glContext.stencilMask(this.kShadowStencilMask);
};

ShadowReceiver.prototype.ShadowRecieverStencilOff = function () 
{
    var glContext = IctusBot.Renderer.GetContext();
    glContext.depthMask(glContext.TRUE);
    glContext.stencilOp(glContext.KEEP, glContext.KEEP, glContext.KEEP);
    glContext.stencilFunc(glContext.EQUAL, this.kShadowStencilBit, this.kShadowStencilMask);
    glContext.colorMask( true, true, true, true );
};

ShadowReceiver.prototype.ShadowRecieverStencilDisable = function () 
{
    var glContext = IctusBot.Renderer.GetContext();
    glContext.disable(glContext.STENCIL_TEST); 
};
