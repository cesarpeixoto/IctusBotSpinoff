



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


function FVector2D(x, y)
{
    this.Value = vec2.fromValues(x, y);
}

var FMath = FMath || { };

FMath.Parse = (function () 
{
    var kIsoOffset =
    {
        X : 6.4,
        Y : -3.2
    }

    var ToIsometric = function (x, y) 
    {
        var IsoXPosition = (x - y) * kIsoOffset.X;
        var IsoYPosition = (x + y) * kIsoOffset.Y;
        return vec2.fromValues(IsoXPosition, IsoYPosition);
    }; 

    var ToCartesian = function (x, y) 
    {
        var CartesianXPosition = ((x / kIsoOffset.X) + (y / kIsoOffset.Y) / 2);
        var CartesianYPosition = ((y / kIsoOffset.Y) - (x / kIsoOffset.X) / 2);
        return vec2.fromValues(CartesianXPosition, CartesianYPosition);
    };

    var ToGrid = function (x, y) 
    {
        var GridXPosition = Math.trunc(((x / kIsoOffset.X) + (y / kIsoOffset.Y)) / 2);
        var GridYPosition = Math.trunc(((y / kIsoOffset.Y) - (x / kIsoOffset.X)) / 2);
        return vec2.fromValues(GridXPosition, GridYPosition);
    };

    var PositionToGrid = function (x, y)
    {
        var GridPosition = ToGrid(x, y);
        var RenderPosition = ToIsometric(GridPosition[0], GridPosition[1]);
        return RenderPosition;
    };

    var PositionToGridRender = function (x, y)
    {
        y += kIsoOffset.Y;
        var GridPosition = ToGrid(x, y);
        var RenderPosition = ToIsometric(GridPosition[0], GridPosition[1]);
        RenderPosition[1] += kIsoOffset.Y;
        return RenderPosition;
    };

    var MousePositionToGridRender = function (x, y)
    {
        y += kIsoOffset.Y;
        var CartesianPosition = ToGrid(x, y);
        var RenderXPosition = (CartesianPosition[0] - CartesianPosition[1]) * kIsoOffset.X;
        var RenderYPosition = (CartesianPosition[0] + CartesianPosition[1]) * kIsoOffset.Y;
        RenderYPosition += kIsoOffset.Y;
        
        return vec2.fromValues(RenderXPosition, RenderYPosition);
    };


    // var PositionToIsometric = function (x, y) 
    // {
    //     var IsoXPosition = ((x / kIsoOffset.X) + (y / kIsoOffset.Y) / 2);
    //     var IsoYPosition = ((y / kIsoOffset.Y) - (x / kIsoOffset.X) / 2);
    //     return vec2.fromValues(IsoXPosition, IsoYPosition);
    // };

    // var IsometricToGrid = function (x, y) 
    // {
    //     var GridXPosition = Math.trunc((x - y) * kIsoOffset.X);
    //     var GridYPosition = Math.trunc((x + y) * kIsoOffset.Y);
    //     return vec2.fromValues(GridXPosition, GridYPosition);
    // };

    // var PositionToGrid2 = function (x, y)
    // {
    //     var IsoPosition = PositionToIsometric(x, y);
    //     return IsometricToGrid(IsoPosition[0], IsoPosition[1]);
    // };

    // var GridToIsometric = function (x, y)
    // {
    //     var IsoPosition = PositionToIsometric(x, y);
    //     return IsometricToGrid(IsoPosition[0], IsoPosition[1]);
    // };


    
    var PublicScope = 
    {
        IsoOffset: kIsoOffset,
        ToIsometric: ToIsometric,
        ToCartesian: ToCartesian,
        PositionToGrid: PositionToGrid,   
        PositionToGridRender: PositionToGridRender,
        MousePositionToGridRender: MousePositionToGridRender,     
        ToGrid: ToGrid
    };

    return PublicScope;
}());

