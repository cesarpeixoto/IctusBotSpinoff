"use strict";

function LightObject() 
{
    this.Color = vec4.fromValues(0.1, 0.1, 0.1, 1);  
    this.Position = vec3.fromValues(0, 0, 5);
    this.Direction = vec3.fromValues(0, 0, -1);
    this.Near = 5;  
    this.Far = 10;  
    this.Intensity = 1 
    this.Inner = 0.1;
    this.Outer = 0.3;
    this.DropOff = 1;  
    this.LightType = LightObject.ELightType.EPointLight;
    this.IsOn = true;
    this.CastShadow = false;
}

LightObject.ELightType = Object.freeze({ EPointLight: 0, EDirectionalLight: 1, ESpotLight: 2 });

LightObject.prototype.SetColor = function (NewColor) { this.Color = vec4.clone(NewColor); };
LightObject.prototype.GetColor = function () { return this.Color; };

LightObject.prototype.Set2DPosition = function (NewPosition) { this.Position = vec3.fromValues(NewPosition[0], NewPosition[1], this.Position[2]); };
LightObject.prototype.SetXPosition = function (x) { this.Position[0] = x; };
LightObject.prototype.SetYPosition = function (y) { this.Position[1] = y; };
LightObject.prototype.SetZPosition = function (z) { this.Position[2] = z; };
LightObject.prototype.GetPosition = function () { return this.Position; };
LightObject.prototype.SetDirection = function (NewDirection) { this.Direction = vec3.clone(NewDirection); };
LightObject.prototype.GetDirection = function () { return this.Direction; };
LightObject.prototype.SetNear = function (NewNear) { this.Near = NewNear; };
LightObject.prototype.GetNear = function () { return this.Near; };
LightObject.prototype.SetFar = function (NewFar) { this.Far = NewFar; };
LightObject.prototype.GetFar = function () { return this.Far; };
LightObject.prototype.SetIntensity = function (NewIntensity) { this.Intensity = NewIntensity; };
LightObject.prototype.GetIntensity = function () { return this.Intensity; };
//LightObject.prototype.SetRadius = function (NewRadius) { this.Radius = NewRadius; };
//LightObject.prototype.GetRadius = function () { return this.Radius; };
LightObject.prototype.SetLightTo = function (InIsOn) { this.IsOn = InIsOn; };

LightObject.prototype.SetInner = function (NewInner) { this.Inner = NewInner; };
LightObject.prototype.GetInner = function () { return this.Inner; };
LightObject.prototype.SetOuter = function (NewOuter) { this.Outer = NewOuter; };
LightObject.prototype.GetOuter = function () { return this.Outer; };
LightObject.prototype.SetDropOff = function (NewDropOff) { this.DropOff = NewDropOff; };
LightObject.prototype.GetDropOff = function () { return this.DropOff; };

LightObject.prototype.SetLightType = function (NewLightType) { this.LightType = NewLightType; };
LightObject.prototype.GetLightType = function () { return this.LightType; };

LightObject.prototype.IsLightOn = function () { return this.IsOn; };

LightObject.prototype.IsLightCastShadow = function () { return this.CastShadow; };
LightObject.prototype.SetLightCastShadowTo = function (InOn) { this.CastShadow = InOn; };





function LightSet() 
{
    this.Set = [];
}

LightSet.prototype.NumLights = function () { return this.Set.length; };
LightSet.prototype.GetLightAt = function (InIndex) { return this.Set[InIndex]; };
LightSet.prototype.AddToSet = function (NewLight) { this.Set.push(NewLight); };


