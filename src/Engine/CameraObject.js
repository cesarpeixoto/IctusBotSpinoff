
"use strict";


function CameraObject(InWCCenter, InWCWidth, ViewportArray, Bound) 
{    
    this.CameraState = new CameraState(InWCCenter, InWCWidth);
    this.CameraShake = null;
    
    this.Viewport = ViewportArray;
    this.NearPlane = 0;
    this.FarPlane = 1000;

    // matrizes de transformação
    this.ViewMatrix = mat4.create();
    this.ProjMatrix = mat4.create();
    this.VPMatrix = mat4.create();

    this.BackgroundColor = [0.8, 0.8, 0.8, 1]; 

    this.RenderCache = new PerRenderCache();
}

CameraObject.EViewport = Object.freeze({ EOrgX: 0, EOrgY: 1, EWidth: 2,EHeight: 3 });

CameraObject.prototype =
{
    //-----------------------------------------------------------------------------------------------------------------------------
    // Define posição da Camera nas coordenadas do mundo (WC).
    SetWCCenter: function (PostionX, PositionY) 
    {
        var VectorPosition = vec2.fromValues(PostionX, PositionY);
        this.CameraState.SetCenter(VectorPosition);
    },

    //-----------------------------------------------------------------------------------------------------------------------------
    // Retorna a posição da Camera nas coordenadas do mundo.
    GetWCCenter: function () { return this.CameraState.GetCenter(); },
    SetWCWidth: function (InWidth) { this.CameraState.SetWidth(InWidth); },
    GetWCWidth: function () { return this.CameraState.GetWidth(); },
    GetWCHeight: function () { return this.CameraState.GetWidth() * this.Viewport[CameraObject.EViewport.EHeight] / this.Viewport[CameraObject.EViewport.EWidth]; },

    SetViewport: function (ViewportArray) { this.Viewport = ViewportArray; },
    GetViewport: function () { return this.Viewport; },

    SetBackgroundColor: function (NewColor) { this.BackgroundColor = NewColor; },
    GetBackgroundColor: function () { return this.BackgroundColor; },

    //-----------------------------------------------------------------------------------------------------------------------------
    // Retorna a matrição de projeção da camera.
    GetViewProjectionMatrix: function () { return this.VPMatrix; },

    //-----------------------------------------------------------------------------------------------------------------------------
    // Inicializa a Camera fazendo o setup da projeção.
    SetupViewProjection: function () 
    {
        var glContext = IctusBot.Renderer.GetContext();
        glContext.viewport(this.Viewport[0],  
                           this.Viewport[1],  
                           this.Viewport[2],  
                           this.Viewport[3]); 

        glContext.scissor(this.Viewport[0], 
                          this.Viewport[1], 
                          this.Viewport[2], 
                          this.Viewport[3]);

        glContext.clearColor(this.BackgroundColor[0], this.BackgroundColor[1], this.BackgroundColor[2], this.BackgroundColor[3]);
        
        glContext.enable(glContext.SCISSOR_TEST);
        glContext.clear(glContext.COLOR_BUFFER_BIT);
        glContext.disable(glContext.SCISSOR_TEST);

        var Center = [];
        if (this.CameraShake !== null) 
            Center = this.CameraShake.GetCenter();
        else
            Center = this.GetWCCenter();


        mat4.lookAt(this.ViewMatrix,
                   [Center[0], Center[1], 10],   
                   [Center[0], Center[1], 0],     
                   [0, 1, 0]);    

        var halfWCWidth = 0.5 * this.GetWCWidth();
        var halfWCHeight = 0.5 * this.GetWCHeight();
        mat4.ortho(this.ProjMatrix, -halfWCWidth, halfWCWidth, -halfWCHeight, halfWCHeight, this.NearPlane, this.FarPlane);

        mat4.multiply(this.VPMatrix, this.ProjMatrix, this.ViewMatrix);

        this.RenderCache.WCToPixelRatio = this.Viewport[CameraObject.EViewport.EWidth] / this.GetWCWidth();
        this.RenderCache.CameraOrgX = Center[0] - (this.GetWCWidth() / 2);
        this.RenderCache.CameraOrgY = Center[1] - (this.GetWCHeight() / 2);
    },

    FakeZInPixelSpace: function (InZ) 
    {
        return InZ * this.RenderCache.WCToPixelRatio;
    },
    
    WCPosToPixel: function (InPixel) 
    {         
        var x = this.Viewport[CameraObject.EViewport.EOrgX] + ((InPixel[0] - this.RenderCache.CameraOrgX) * this.RenderCache.WCToPixelRatio) + 0.5;
        var y = this.Viewport[CameraObject.EViewport.EOrgY] + ((InPixel[1] - this.RenderCache.CameraOrgY) * this.RenderCache.WCToPixelRatio) + 0.5;
        var z = this.FakeZInPixelSpace(InPixel[2]);
        return vec3.fromValues(x, y, z);
    },
    
    WCSizeToPixel: function (NewSize) 
    {   
        return (NewSize * this.RenderCache.WCToPixelRatio) + 0.5;
    },

    MouseDCX: function () 
    {
        return IctusBot.Input.GetMousePositionX() - this.Viewport[CameraObject.EViewport.EOrgX];
    },

    MouseDCY: function () 
    {
        return IctusBot.Input.GetMousePositionY() - this.Viewport[CameraObject.EViewport.EOrgY];
    },
    
    IsMouseInViewport: function () 
    {
        var dcX = this.MouseDCX();
        var dcY = this.MouseDCY();
        return ((dcX >= 0) && (dcX < this.Viewport[CameraObject.EViewport.EWidth]) &&
                (dcY >= 0) && (dcY < this.Viewport[CameraObject.EViewport.EHeight]));
    },
    
    MouseWCX: function () 
    {
        var minWCX = this.GetWCCenter()[0] - this.GetWCWidth() / 2;
        return minWCX + (this.MouseDCX() * (this.GetWCWidth() / this.Viewport[CameraObject.EViewport.EWidth]));
    },
    
    MouseWCY: function () 
    {
        var minWCY = this.GetWCCenter()[1] - this.GetWCHeight() / 2;
        return minWCY + (this.MouseDCY() * (this.GetWCHeight() / this.Viewport[CameraObject.EViewport.EHeight]));
    },

    PanBy: function (DirectionX, DirectionY) 
    {
        var NewCenter = vec2.clone(this.GetWCCenter());
        NewCenter[0] += dx;
        NewCenter[1] += dy;
        this.CameraState.SetCenter(NewCenter);
    },

    PanTo: function (CenterX, CenterY) 
    {
        this.SetWCCenter(CenterX, CenterY);
    },
    
    ZoomBy: function (Zoom) 
    {
        if (Zoom > 0) 
        this.SetWCWidth(this.GetWCWidth() * Zoom);       
    },
    
    ZoomTowards: function (InPosition, Zoom) 
    {
        var Delta = [];
        var NewCenter = [];
        vec2.sub(Delta, InPosition, this.GetWCCenter());
        vec2.scale(Delta, Delta, Zoom - 1);
        vec2.sub(NewCenter, this.GetWCCenter(), Delta);
        this.ZoomBy(Zoom);
        this.CameraState.SetCenter(NewCenter);
    },

    Update: function () 
    {
        if (this.CameraShake !== null) 
        {
            if (this.CameraShake.ShakeDone()) 
            {
                this.CameraShake = null;
            } 
            else 
            {
                this.CameraShake.SetRefCenter(this.GetWCCenter());
                this.CameraShake.UpdateShakeState();
            }
        }
        this.CameraState.UpdateCameraState();
    },

    ConfigInterpolation: function (Stiffness, Duration) 
    {
        this.CameraState.ConfigInterpolation(Stiffness, Duration);
    },

    Shake: function (xDelta, yDelta, ShakeFrequency, Duration) 
    {
        this.CameraShake = new CameraShake(this.CameraState, xDelta, yDelta, ShakeFrequency, Duration);
    }

}

function PerRenderCache() 
{
    this.WCToPixelRatio = 1;  
    this.CameraOrgX = 1; 
    this.CameraOrgY = 1;
}


function CameraState(InCenter, InWidth) 
{
    this.kCycles = 300;  
    this.kRate = 0.1;    
    this.Center = new InterpolateVec2(InCenter, this.kCycles, this.kRate);
    this.Width = new Interpolate(InWidth, this.kCycles, this.kRate);
}

CameraState.prototype.GetCenter = function () { return this.Center.GetValue(); };
CameraState.prototype.GetWidth = function () { return this.Width.GetValue(); };

CameraState.prototype.SetCenter = function (InCenter) { this.Center.SetFinalValue(InCenter); };
CameraState.prototype.SetWidth = function (InWidth) { this.Width.SetFinalValue(InWidth); };

CameraState.prototype.UpdateCameraState = function () 
{
    this.Center.UpdateInterpolation();
    this.Width.UpdateInterpolation();
};

CameraState.prototype.ConfigInterpolation = function (Stiffness, Duration)
{
    this.Center.ConfigInterpolation(Stiffness, Duration);
    this.Width.ConfigInterpolation(Stiffness, Duration);
};



function CameraShake(State, xDelta, yDelta, ShakeFrequency, ShakeDuration) 
{
    this.OrgCenter = vec2.clone(State.GetCenter());
    this.ShakeCenter = vec2.clone(this.OrgCenter);
    this.Shake = new ShakePosition(xDelta, yDelta, ShakeFrequency, ShakeDuration);
}

CameraShake.prototype.UpdateShakeState = function () 
{
    var ShakeResult = this.Shake.GetShakeResults();
    vec2.add(this.ShakeCenter, this.OrgCenter, ShakeResult);
};

CameraShake.prototype.ShakeDone = function () 
{
    return this.Shake.ShakeDone();
};

CameraShake.prototype.GetCenter = function () { return this.ShakeCenter; };
CameraShake.prototype.SetRefCenter = function (CenterRef) 
{
    this.OrgCenter[0] = CenterRef[0];
    this.OrgCenter[1] = CenterRef[1];
};






function ShakePosition(xDelta, yDelta, ShakeFrequency, ShakeDuration) 
{
    this.XMag = xDelta;
    this.YMag = yDelta;

    this.Cycles = ShakeDuration; 
    this.Omega = ShakeFrequency * 2 * Math.PI; 

    this.NumCyclesLeft = ShakeDuration;
}

ShakePosition.prototype.ShakeDone = function () 
{
    return (this.NumCyclesLeft <= 0);
};

ShakePosition.prototype.GetShakeResults = function () 
{
    this.NumCyclesLeft--;
    var c = [];
    var fx = 0;
    var fy = 0;
    if (!this.ShakeDone()) 
    {
        var v = this.NextDampedHarmonic();
        fx = (Math.random() > 0.5) ? -v : v;
        fy = (Math.random() > 0.5) ? -v : v;
    }
    c[0] = this.XMag * fx;
    c[1] = this.YMag * fy;
    return c;
};

ShakePosition.prototype.NextDampedHarmonic = function () 
{
    var frac = this.NumCyclesLeft / this.Cycles;
    return frac * frac * Math.cos((1 - frac) * this.Omega);
};