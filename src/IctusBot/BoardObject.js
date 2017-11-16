"use strict";  



function BoardObject(InSpriteTexture, InWorld) 
{    
    this.kSpriteTextures = InSpriteTexture;
    this.BoardSprites = [];
    this.WorldRef = InWorld;
    this.IsoOffsetX = 6.4;
    this.IsoOffsetY = -3.2;

    this.PositionGridClicked = vec2.fromValues(-1, -1);

    this.InitializeGroundTiles();


}

BoardObject.prototype =
{
    CreateRandomRender: function()
    {
        var RandomX = Math.floor(Math.random() * 3);
        var RandomY = Math.floor(Math.random() * 3);

        var RandomRender = new LightRenderComponent(this.kSpriteTextures);
        RandomRender.SetColor([1, 1, 1, 0]);
        RandomRender.GetTransform().SetScale(12.8, 6.4);
        RandomRender.GetTransform().SetPosition(0, 0);
        RandomRender.SetElementPixelPositions((RandomX * 616),  (RandomX + 1) * 616, (RandomY * 309) + 97, ((RandomY +1)* 309) +97);

        for (var i = 0; i < this.WorldRef.GlobalLightSet.NumLights(); ++i) 
        {
            RandomRender.AddLight(this.WorldRef.GlobalLightSet.GetLightAt(i));   
        }

        return RandomRender;
    },

    InitializeGroundTiles: function()
    {
        var index = 0;
        for(var y = 0; y < 7; ++y)
        {
            for(var x = 0; x < 5; ++x)
            {
                this.BoardSprites[index] = new GameObject(this.CreateRandomRender());
                var Xposition = (x - y) * this.IsoOffsetX;
                var Yposition = (x + y) * this.IsoOffsetY;
                Yposition += this.IsoOffsetY;

                this.BoardSprites[index].GetTransform().SetPosition(Xposition, Yposition);
                ++index;
            }
        }
    },

    Render: function(InCamera)
    {
         var ResourcesLenght = 7 * 5;
         for(var i = 0; i < ResourcesLenght; ++i)
         {                 
             this.BoardSprites[i].Render(InCamera);
         }
         //this.BoardSprites[1].Render(InCamera);
         this.SetGridPosition(InCamera);
    },    

    Update: function(InCamera)
    {
        if (IctusBot.Input.IsButtonPressed(IctusBot.Input.MouseButton.Left))
        {
            //alert("X: = " + this.MainCamera.MouseWCX() + " Y: = " + this.MainCamera.MouseWCY());

            //var ClickX = Math.floor(((this.MainCamera.MouseWCX() / this.IsoOffsetX) + (this.MainCamera.MouseWCY() / this.IsoOffsetY)) / 2) + 1;
            //var ClickY = Math.floor(((this.MainCamera.MouseWCY() / this.IsoOffsetY) - (this.MainCamera.MouseWCX() / this.IsoOffsetX)) / 2) + 1;
            
            // var MousePositionX = InCamera.MouseWCX();
            // var MousePositionY = InCamera.MouseWCY();
            // alert("X no mouse: = " + MousePositionX + " Y no mouse: = " + MousePositionY);

        }
    },

    SetGridPosition: function(InCamera)
    {
        var MousePositionX = InCamera.MouseWCX();
        var MousePositionY = InCamera.MouseWCY();
        // MousePositionY += this.IsoOffsetY;
        

        var ClickX = Math.trunc(((MousePositionX / this.IsoOffsetX) + (MousePositionY / this.IsoOffsetY)) / 2);
        var ClickY = Math.trunc(((MousePositionY / this.IsoOffsetY) - (MousePositionX / this.IsoOffsetX)) / 2);

        if(ClickX < 0 || ClickX > 4)
            ClickX = -1;

        if(ClickY < 0 || ClickY > 6)
            ClickY = -1;

        this.PositionGridClicked = vec2.fromValues(ClickX, ClickY);
    },

    GetLastClickPosition: function() { return this.PositionGridClicked; },
    GetLastClickPositionX: function() { return this.PositionGridClicked[0]; },
    GetLastClickPositionY: function() { return this.PositionGridClicked[1]; },

    GetCurrentPosition: function(InCamera)
    {
        var MousePositionX = InCamera.MouseWCX();
        var MousePositionY = InCamera.MouseWCY();
        MousePositionY += this.IsoOffsetY;

        var PositionX = Math.trunc(((MousePositionX / this.IsoOffsetX) + (MousePositionY / this.IsoOffsetY)) / 2);
        var PositionY = Math.trunc(((MousePositionY / this.IsoOffsetY) - (MousePositionX / this.IsoOffsetX)) / 2);

        if(PositionX < 0 || PositionX > 4)
            PositionX = -1;

        if(PositionY < 0 || PositionY > 6)
            PositionY = -1;

        return vec2.fromValues(PositionX, PositionY);
    },

    GetCurrentXPosition: function(InCamera)
    {
        var MousePositionX = InCamera.MouseWCX();
        var MousePositionY = InCamera.MouseWCY();
        MousePositionY += this.IsoOffsetY;
        var PositionX = Math.trunc(((MousePositionX / this.IsoOffsetX) + (MousePositionY / this.IsoOffsetY)) / 2);
        
        if(PositionX < 0 || PositionX > 4)
            PositionX = -1;

        return PositionX;
    },

    GetCurrentYPosition: function(InCamera)
    {
        var MousePositionX = InCamera.MouseWCX();
        var MousePositionY = InCamera.MouseWCY();
        MousePositionY += this.IsoOffsetY;

        var PositionY = Math.trunc(((MousePositionY / this.IsoOffsetY) - (MousePositionX / this.IsoOffsetX)) / 2);
        if(PositionY < 0 || PositionY > 6)
            PositionY = -1;

        return PositionY;
    },

    IsCurrentValidPosition: function(InCamera)
    {
        return GetCurrentXPosition(InCamera) > 0 && GetCurrentYPosition(InCamera) > 0;
    },

    GetRenderPosition: function(InCamera)
    {
        var MousePositionX = InCamera.MouseWCX();
        var MousePositionY = InCamera.MouseWCY();                

        // MousePositionY += this.IsoOffsetY;

        // var PositionX = Math.trunc(((MousePositionX / this.IsoOffsetX) + (MousePositionY / this.IsoOffsetY)) / 2);
        // var PositionY = Math.trunc(((MousePositionY / this.IsoOffsetY) - (MousePositionX / this.IsoOffsetX)) / 2);

        // var RenderXPosition = (PositionX - PositionY) * this.IsoOffsetX;
        // var RenderYPosition = (PositionX + PositionY) * this.IsoOffsetY;
        // RenderYPosition += this.IsoOffsetY;
        // return vec2.fromValues(RenderXPosition, RenderYPosition);

         //MousePositionY += FMath.Parse.IsoOffset.Y;
         //var RenderPosition = FMath.Parse.PositionToGrid(MousePositionX, MousePositionY);
         //RenderPosition[1] += FMath.Parse.IsoOffset.Y;

        return FMath.Parse.MousePositionToGridRender(MousePositionX, MousePositionY);

    },

    GetRenderXPosition: function(InCamera)
    {
        var MousePositionX = InCamera.MouseWCX();
        var MousePositionY = InCamera.MouseWCY();
        MousePositionY += this.IsoOffsetY;

        var PositionX = Math.trunc(((MousePositionX / this.IsoOffsetX) + (MousePositionY / this.IsoOffsetY)) / 2);
        var PositionY = Math.trunc(((MousePositionY / this.IsoOffsetY) - (MousePositionX / this.IsoOffsetX)) / 2);
        var RenderXPosition = (PositionX - PositionY) * this.IsoOffsetX;

        return RenderXPosition;
    },

    GetRenderYPosition: function(InCamera)
    {
        var MousePositionX = InCamera.MouseWCX();
        var MousePositionY = InCamera.MouseWCY();
        MousePositionY += this.IsoOffsetY;

        var PositionX = Math.trunc(((MousePositionX / this.IsoOffsetX) + (MousePositionY / this.IsoOffsetY)) / 2);
        var PositionY = Math.trunc(((MousePositionY / this.IsoOffsetY) - (MousePositionX / this.IsoOffsetX)) / 2);

        var RenderYPosition = (PositionX + PositionY) * this.IsoOffsetY;

        return RenderYPosition;
    },

    


};




