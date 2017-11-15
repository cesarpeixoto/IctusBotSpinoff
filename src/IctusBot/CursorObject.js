
"use strict";  



function CursorObject(InSpriteTexture, InWorldRef) 
{
    this.WorldRef = InWorldRef;

    this.CursorRender = new SpriteSheetRenderComponent(InSpriteTexture);
    this.CursorRender.SetColor([1, 1, 1, 0.1]);
    this.CursorRender.GetTransform().SetPosition(0, 0);
    //this.CursorRender.GetTransform().SetScale(this.kRefWidth / 55, this.kRefHeight / 55);
    this.CursorRender.GetTransform().SetScale(10, 6);
    this.CursorRender.SetElementPixelPositions(0, 128, 0, 64);
        
    this.SelectedUnityId = "nil";

    GameObject.call(this, this.CursorRender);
}

IctusBot.Core.InheritPrototype(CursorObject, GameObject);


CursorObject.prototype.Update = function (InCamera) 
{
    var Transform = this.GetTransform();
    var CurrentPosition = this.WorldRef.GetRenderPosition(InCamera);
    Transform.SetPosition(CurrentPosition[0], CurrentPosition[1]);

    var X = this.WorldRef.GetCurrentXPosition(InCamera);
    var Y = this.WorldRef.GetCurrentYPosition(InCamera);

    if(this.SelectedUnityId != "nil")
    {
        this.CursorRender.SetColor([1, 0, 0, 1]);
        // Renderizar as possibilidades de jogadas...
        var Possibilities = GetMovementPossibilities(X, Y, this.SelectedUnityId);
        for (var i = 0; i < Possibilities.length; i++)
        {
            if((X == Possibilities[i].x) && (Y ==  Possibilities[i].y))
            {
                this.CursorRender.SetColor([0, 0, 1, 0.5]);
            }
            //alert("X: " + Possibilities[i].x + "Y: " + Possibilities[i].y + "acao: " + Possibilities[i].action);
        }

    }
    else
    {
        this.CursorRender.SetColor([1, 1, 1, 0.1]);
    }


    if (IctusBot.Input.IsButtonPressed(IctusBot.Input.MouseButton.Left))
    {
        var InSet = "nil";
        if(X > -1 && Y > -1)
        {
            InSet = board[X][Y];
        }


        if(this.SelectedUnityId == "nil")
        {            
            if(InSet != "nil")
            {
                // CHECA SE A UNIDADE É DO NOSSO TIME... CONFIRMAR COM LUCAS..
                //if(currentTurn == GetTeamFromUnit(InSet))
                {
                    //this.SelectedUnity = this.WorldRef.UnitysMap.GetObjectById(InSet);
                    this.SelectedUnityId = board[X][Y];
                }
                
            }
            

        }
        else
        {
            //alert("Vai fazer acao!!!");
            // var Possibilities = GetMovementPossibilities(X, Y, this.SelectedUnityId);


            // //alert("X: = " + this.MainCamera.MouseWCX() + " Y: = " + this.MainCamera.MouseWCY());

            // //var ClickX = Math.floor(((this.MainCamera.MouseWCX() / this.IsoOffsetX) + (this.MainCamera.MouseWCY() / this.IsoOffsetY)) / 2) + 1;
            // //var ClickY = Math.floor(((this.MainCamera.MouseWCY() / this.IsoOffsetY) - (this.MainCamera.MouseWCX() / this.IsoOffsetX)) / 2) + 1;
            // var x = this.WorldRef.GetCurrentXPosition(InCamera);
            // var y = this.WorldRef.GetCurrentYPosition(InCamera);
            // //alert("Posicao X no Array: = " + x + " Posicao Y no Array: = " + y);
            // var movPossibilities = GetMovementPossibilities(x, y, board[x][y]);
            // //alert(movPossibilities.length);
            // for (var i = 0; i < movPossibilities.length; i++)
            // {
            //     alert("X: " + movPossibilities[i].x + "Y: " + movPossibilities[i].y + "acao: " + movPossibilities[i].action);
            // }
        }
    }

    if (IctusBot.Input.IsButtonPressed(IctusBot.Input.MouseButton.Right))
    {
        this.SelectedUnityId = "nil";
    }


}
