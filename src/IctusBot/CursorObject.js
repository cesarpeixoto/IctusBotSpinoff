
"use strict";  



function CursorObject(InSpriteTexture, InWorldRef) 
{
    //this.kRefWidth = 128;
    //this.kRefHeight = 64;
    this.WorldRef = InWorldRef;

    this.CursorRender = new SpriteSheetRenderComponent(InSpriteTexture);
    this.CursorRender.SetColor([1, 1, 1, 0.1]);
    this.CursorRender.GetTransform().SetPosition(0, 0);
    //this.CursorRender.GetTransform().SetScale(this.kRefWidth / 55, this.kRefHeight / 55);
    this.CursorRender.GetTransform().SetScale(10, 6);
    this.CursorRender.SetElementPixelPositions(0, 128, 0, 64);
    

    GameObject.call(this, this.CursorRender);
}

IctusBot.Core.InheritPrototype(CursorObject, GameObject);

CursorObject.prototype.Update = function (InCamera) 
{
    var Transform = this.GetTransform();
    var CurrentPosition = this.WorldRef.GetRenderPosition(InCamera);
    Transform.SetPosition(CurrentPosition[0], CurrentPosition[1]);


    if (IctusBot.Input.IsButtonPressed(IctusBot.Input.MouseButton.Left))
    {
        //alert("X: = " + this.MainCamera.MouseWCX() + " Y: = " + this.MainCamera.MouseWCY());

        //var ClickX = Math.floor(((this.MainCamera.MouseWCX() / this.IsoOffsetX) + (this.MainCamera.MouseWCY() / this.IsoOffsetY)) / 2) + 1;
        //var ClickY = Math.floor(((this.MainCamera.MouseWCY() / this.IsoOffsetY) - (this.MainCamera.MouseWCX() / this.IsoOffsetX)) / 2) + 1;
        var x = this.WorldRef.GetCurrentXPosition(InCamera);
        var y = this.WorldRef.GetCurrentYPosition(InCamera);
        //alert("Posicao X no Array: = " + x + " Posicao Y no Array: = " + y);
        var movPossibilities = GetMovementPossibilities(x, y, board[x][y]);
        //alert(movPossibilities.length);
        for (var i = 0; i < movPossibilities.length; i++)
        {
            alert("X: " + movPossibilities[i].x + "Y: " + movPossibilities[i].y + "acao: " + movPossibilities[i].action);
        }
    }


}



// CursorObject.prototype =
// {
//     Render: function(InCamera)
//     {        
//         GameObject.prototype.Render.call(this, InCamera);
        
        
//     },


//     Update: function(InCamera)
//     {

        
//     },
// }