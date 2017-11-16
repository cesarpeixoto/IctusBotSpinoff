"use strict";

function LightObject() 
{
    this.Color = vec4.fromValues(0.1, 0.1, 0.1, 1);  
    this.Position = vec3.fromValues(0, 0, 5);
    this.Near = 5;  
    this.Far = 10;  
    this.mIntensity = 1 
    //this.Radius = 10;  
    this.IsOn = true;
}


LightObject.prototype.SetColor = function (NewColor) { this.Color = vec4.clone(NewColor); };
LightObject.prototype.GetColor = function () { return this.Color; };

LightObject.prototype.Set2DPosition = function (NewPosition) { this.Position = vec3.fromValues(NewPosition[0], NewPosition[1], this.Position[2]); };
LightObject.prototype.SetXPosition = function (x) { this.Position[0] = x; };
LightObject.prototype.SetYPosition = function (y) { this.Position[1] = y; };
LightObject.prototype.SetZPosition = function (z) { this.Position[2] = z; };
LightObject.prototype.GetPosition = function () { return this.Position; };
LightObject.prototype.SetNear = function (NewNear) { this.Near = NewNear; };
LightObject.prototype.GetNear = function () { return this.Near; };
LightObject.prototype.SetFar = function (NewFar) { this.Far = NewFar; };
LightObject.prototype.GetFar = function () { return this.Far; };
LightObject.prototype.SetIntensity = function (NewIntensity) { this.Intensity = NewIntensity; };
LightObject.prototype.GetIntensity = function () { return this.Intensity; };
//LightObject.prototype.SetRadius = function (NewRadius) { this.Radius = NewRadius; };
//LightObject.prototype.GetRadius = function () { return this.Radius; };
LightObject.prototype.SetLightTo = function (InIsOn) { this.IsOn = InIsOn; };
LightObject.prototype.IsLightOn = function () { return this.IsOn; };


function LightSet() 
{
    this.Set = [];
}

LightSet.prototype.NumLights = function () { return this.Set.length; };
LightSet.prototype.GetLightAt = function (InIndex) { return this.Set[InIndex]; };
LightSet.prototype.AddToSet = function (NewLight) { this.Set.push(NewLight); };