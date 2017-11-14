



"use strict";

function Interpolate(InValue, InCycles, InRate) 
{
    this.CurrentValue = InValue;    
    this.FinalValue = InValue;      
    this.Cycles = InCycles;
    this.Rate = InRate;

    this.CyclesLeft = 0;
}

Interpolate.prototype.GetValue = function () { return this.CurrentValue; };
Interpolate.prototype.SetFinalValue = function (Value) 
{
    this.FinalValue = Value;
    this.CyclesLeft = this.Cycles;     
};

Interpolate.prototype.UpdateInterpolation = function () 
{
    if (this.CyclesLeft <= 0) 
        return;
    
    this.CyclesLeft--;
    if (this.CyclesLeft === 0) 
    {
        this.CurrentValue = this.FinalValue;
    }
    else 
    {
        this.InterpolateValue();
    }    
};

Interpolate.prototype.ConfigInterpolation = function (Stiffness, Duration) 
{
    this.Rate = Stiffness;
    this.Cycles = Duration;
};

Interpolate.prototype.InterpolateValue = function () 
{
    this.CurrentValue = this.CurrentValue + this.Rate * (this.FinalValue - this.CurrentValue);
};



function InterpolateVec2(InValue, InCycles, InRate)  
{
    Interpolate.call(this, InValue, InCycles, InRate);
}
IctusBot.Core.InheritPrototype(InterpolateVec2, Interpolate);

InterpolateVec2.prototype.InterpolateValue = function () 
{
    vec2.lerp(this.CurrentValue, this.CurrentValue, this.FinalValue, this.Rate);
};