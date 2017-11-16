
"use strict";  



function CursorObject(InSpriteTexture, InWorldRef, InUnitysMap, InExplosion, InHud) 
{
    this.WorldRef = InWorldRef;
    this.UnitysMap = InUnitysMap;
    this.CursorRender = new SpriteSheetRenderComponent(InSpriteTexture);
    this.CursorRender.SetColor([1, 1, 1, 0.1]);
    this.CursorRender.GetTransform().SetPosition(0, 0);
    //this.CursorRender.GetTransform().SetScale(this.kRefWidth / 55, this.kRefHeight / 55);
    this.CursorRender.GetTransform().SetScale(10, 6);
    this.CursorRender.SetElementPixelPositions(0, 128, 0, 64);
    
    this.Explosion = InExplosion;
    this.Hud = InHud;

    this.SelectedUnityId = new SelectedUnity();

    GameObject.call(this, this.CursorRender);
}
var lastFrameMouseState = false;
IctusBot.Core.InheritPrototype(CursorObject, GameObject);


CursorObject.prototype.Update = function (InCamera) 
{
    var Transform = this.GetTransform();
    var CurrentPosition = this.WorldRef.GetRenderPosition(InCamera);
    Transform.SetPosition(CurrentPosition[0], CurrentPosition[1]);

    var X = this.WorldRef.GetCurrentXPosition(InCamera);
    var Y = this.WorldRef.GetCurrentYPosition(InCamera);

    if(this.SelectedUnityId.ID != "nil")
    {
        //console.log(this.SelectedUnityId.ID);
        var Possibilities = GetMovementPossibilities(this.SelectedUnityId.X, this.SelectedUnityId.Y, this.SelectedUnityId.ID);
        var ValidPlay = false;
        for (var i = 0; i < Possibilities.length; i++)
        {
            if((X == Possibilities[i].x) && (Y ==  Possibilities[i].y))
            {
                ValidPlay = true;
                
            }
        }

        if(ValidPlay)
        {
            this.CursorRender.SetColor([0, 0, 1, 0.5]);
        }
        else
        {
            this.CursorRender.SetColor([1, 0, 0, 0.5]);
        }
    }
    else
    {
         this.CursorRender.SetColor([1, 1, 1, 0.1]);
    }
    


    if (IctusBot.Input.IsButtonPressed(IctusBot.Input.MouseButton.Left) == true && lastFrameMouseState == false)
    {
        console.log("MEU PAU NA SUA MÃO");
        var InSet = "nil";
        if(X > -1 && Y > -1)
        {
            InSet = board[X][Y];
        }


        if(this.SelectedUnityId.ID == "nil")
        {            
            if(InSet != "nil")
            {
                // CHECA SE A UNIDADE É DO NOSSO TIME... CONFIRMAR COM LUCAS..
                if(currentTurn == GetTeamFromUnit(InSet))
                {
                    this.SelectedUnityId.ID = board[X][Y];
                    this.SelectedUnityId.X = X;
                    this.SelectedUnityId.Y = Y;
                    this.SelectedUnityId.Asset = this.UnitysMap.GetObjectById(board[X][Y]);
                }
                
            }            
        }
        else
        {

            var Possibilities = GetMovementPossibilities(this.SelectedUnityId.X, this.SelectedUnityId.Y, this.SelectedUnityId.ID);
            for (var i = 0; i < Possibilities.length; i++)
            {
                if((X == Possibilities[i].x) && (Y ==  Possibilities[i].y))
                {
                    if(Possibilities[i].action == "move")
                    {
                        MoveUnitTo(this.SelectedUnityId.X, this.SelectedUnityId.Y, X, Y, this.SelectedUnityId.ID);
                        this.SelectedUnityId.Asset.SetTargetLocation(X, Y);
                        this.CursorRender.SetColor([1, 1, 1, 0.1]);
                        this.SelectedUnityId.ID = "nil";
                        this.SelectedUnityId.Asset = null;
                        this.SelectedUnityId.X = -1;
                        this.SelectedUnityId.Y = -1;
                    }
                    else if(Possibilities[i].action == "kill")
                    {
                        this.UnitysMap.RemoveObjectById(board[X][Y]);
                        board[X][Y] = "nil";
                        this.Explosion.Run(X, Y);
                        MoveUnitTo(this.SelectedUnityId.X, this.SelectedUnityId.Y, X, Y, this.SelectedUnityId.ID);
                        this.SelectedUnityId.Asset.SetTargetLocation(X, Y);
                        this.CursorRender.SetColor([1, 1, 1, 0.1]);                                                
                        this.SelectedUnityId.ID = "nil";
                        this.SelectedUnityId.Asset = null;
                        this.SelectedUnityId.X = -1;
                        this.SelectedUnityId.Y = -1; 
                    }

                    break;
                }
            }            

        }

        var Result = VerifyEndGame();

        if(Result != 0)
        {
            this.Hud.SetState(HudObject.EState.EGameOver);
        }
        else
        {
            if(currentTurn == 1)
            {
                this.Hud.SetState(HudObject.EState.EAncient);
            }
            else
            {
                this.Hud.SetState(HudObject.EState.EModern);
            }
        }

    }

    if (IctusBot.Input.IsButtonPressed(IctusBot.Input.MouseButton.Right))
    {
        this.SelectedUnityId.ID = "nil";
        this.SelectedUnityId.Asset = null;
        this.SelectedUnityId.X = -1;
        this.SelectedUnityId.Y = -1;
    }

    lastFrameMouseState = IctusBot.Input.IsButtonPressed(IctusBot.Input.MouseButton.Left);
}


function SelectedUnity () 
{
    this.Asset = null;
    this.ID = "nil";
    this.X = -1;
    this.Y = -1;
}
