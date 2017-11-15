

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



function GameObjectMap() 
{
    this.ObjectArray = [];
}

GameObjectMap.prototype.Size = function () { return this.ObjectArray.length; };

GameObjectMap.prototype.GetObjectAt = function (ObjIndex) 
{
    return this.ObjectArray[ObjIndex].Asset;
};

GameObjectMap.prototype.GetObjectById = function (IdIndex) 
{
    for (var i = 0; i < this.ObjectArray.length; i++) 
    {
        if(this.ObjectArray[i].ID == IdIndex)
            return this.ObjectArray[i].Asset;
    }
    alert("Id Inexistente");
};

GameObjectMap.prototype.Add = function (InGameObject, InId) 
{
    this.ObjectArray.push(new GameObjectEntry(InGameObject, InId));
};

GameObjectMap.prototype.Update = function (DeltaTime) 
{
    for (var i = 0; i < this.ObjectArray.length; i++) 
    {
        this.ObjectArray[i].Asset.Update(DeltaTime);
    }
};

GameObjectMap.prototype.Render = function (RenderCamera) 
{
    for (var i = 0; i < this.ObjectArray.length; i++) 
    {
        this.ObjectArray[i].Asset.Render(RenderCamera);
    }
};


class GameObjectEntry {
    constructor(InGameObjectRef, InId) {
        this.Asset = InGameObjectRef;
        this.ID = InId;
    }
}
