

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
    this.ToRemove = false;
    this.NewOne = null;
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

GameObjectMap.prototype.RemoveObjectById = function (IdIndex) 
{
    if(this.ToRemove)
    {
        for (var i = 0; i < this.NewOne.length; i++) 
        {
            if(this.NewOne[i].ID == IdIndex)
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
        for (var i = 0; i < this.ObjectArray.length; i++) 
        {
            if(this.ObjectArray[i].ID == IdIndex)
            {
                this.NewOne = this.ObjectArray.filter(e => e !== this.ObjectArray[i]);
                this.ToRemove = true;
                break;
            }                
        }
    }
    
};

GameObjectMap.prototype.Add = function (InGameObject, InId) 
{
    this.ObjectArray.push(new GameObjectEntry(InGameObject, InId));
};

GameObjectMap.prototype.Length = function () 
{
    return this.ObjectArray.length;
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
    if(this.ToRemove)
    {
        this.ObjectArray = this.NewOne;
        this.NewOne = null;
        this.ToRemove = false;
    }

    for (var i = 0; i < this.ObjectArray.length; i++) 
    {
        this.ObjectArray[i].Asset.Render(RenderCamera);
    }
};


function GameObjectEntry (InGameObjectRef, InId) 
{
    this.Asset = InGameObjectRef;
    this.ID = InId;
}