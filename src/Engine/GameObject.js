

"use strict";  

function GameObject(RenderComponentObject) 
{
    this.DefaultRenderComponent = RenderComponentObject;
}

GameObject.prototype.GetTransform = function () { return this.DefaultRenderComponent.GetTransform(); };

GameObject.prototype.Update = function () {};

GameObject.prototype.GetRenderComponent = function () { return this.DefaultRenderComponent; };

GameObject.prototype.Render = function (RenderCamera) 
{
    this.DefaultRenderComponent.Render(RenderCamera);
};





function GameObjectArray() 
{
    this.ObjectArray = [];
}

GameObjectArray.prototype.Size = function () { return this.ObjectArray.length; };

GameObjectArray.prototype.GetObjectAt = function (ObjIndex) 
{
    return this.ObjectArray[ObjIndex];
};

GameObjectArray.prototype.Add = function (Obj) 
{
    this.ObjectArray.push(Obj);
};

GameObjectArray.prototype.Update = function () 
{
    for (var i = 0; i < this.ObjectArray.length; i++) 
    {
        this.ObjectArray[i].Update();
    }
};

GameObjectArray.prototype.Render = function (RenderCamera) 
{
    for (var i = 0; i < this.ObjectArray.length; i++) 
    {
        this.ObjectArray[i].Render(RenderCamera);
    }
};