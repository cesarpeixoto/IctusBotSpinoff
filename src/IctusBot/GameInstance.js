
"use strict";  

function GameInstance() 
{    
    this.MainCamera = null;    
    
    this.kGroundSheet = "Assets/GrassSpriteSheet.png";
    this.kCursorSprite = "Assets/Cursor.png";

    this.kAncientSniper = "Assets/AncientSniper.png"
    this.kModernSniper = "Assets/ModernSniper.png"
    this.kAncientTank = "Assets/AncientTank.png"
    this.kModernTank = "Assets/ModernTank.png"
    this.kAncientBomber = "Assets/AncientBomber.png"
    this.kModernBomber = "Assets/ModernBomber.png"

    this.kAncientHero = "Assets/AncientSniper.png"
    this.kModernHero = "Assets/ModernSniper.png"
    

    this.kDot = "Assets/Dot.png";


    this.UnitysMap = new GameObjectMap();
    this.Board = null;
    this.Cursor = null;

    

    this.ModernSniper = null;

    this.Dot = null;
}

IctusBot.Core.InheritPrototype(GameInstance, MapInterface);

GameInstance.prototype.LoadMap = function () 
{
    //IctusBot.AudioClips.LoadAudio(musica);
    IctusBot.Textures.LoadTexture(this.kGroundSheet);
    IctusBot.Textures.LoadTexture(this.kCursorSprite);
    
    IctusBot.Textures.LoadTexture(this.kAncientSniper);
    IctusBot.Textures.LoadTexture(this.kModernSniper);
    IctusBot.Textures.LoadTexture(this.kAncientTank);
    IctusBot.Textures.LoadTexture(this.kModernTank);
    IctusBot.Textures.LoadTexture(this.kAncientBomber);
    IctusBot.Textures.LoadTexture(this.kModernBomber);


    IctusBot.Textures.LoadTexture(this.kDot);    
};

GameInstance.prototype.UnloadMap = function () 
{
    IctusBot.Textures.UnloadTexture(this.kGroundSheet);
    IctusBot.Textures.UnloadTexture(this.kCursorSprite);
    IctusBot.Textures.UnloadTexture(this.kAncientSniper);
    IctusBot.Textures.UnloadTexture(this.kModernSniper);
    IctusBot.Textures.UnloadTexture(this.kAncientTank);
    IctusBot.Textures.UnloadTexture(this.kModernTank);
    IctusBot.Textures.UnloadTexture(this.kAncientBomber);
    IctusBot.Textures.UnloadTexture(this.kModernBomber);
};

GameInstance.prototype.Initialize = function () 
{
    // Cria a Camera.
    this.MainCamera = new CameraObject(
        vec2.fromValues(-10, -15),   
        100,                       
        [0, 0, 1920, 1080]           
    );

    this.MainCamera.SetBackgroundColor([0.8, 0.8, 0.8, 1]);

    // var GlobalAmbientColor = IctusBot.DefaultResources.GetGlobalAmbientColor();
    // GlobalAmbientColor[0] -= 0.02;
    IctusBot.DefaultResources.SetGlobalAmbientIntensity(IctusBot.DefaultResources.GetGlobalAmbientIntensity() + 1.7);

    this.Board = new BoardObject(this.kGroundSheet);
    this.Cursor = new CursorObject(this.kCursorSprite, this.Board, this.UnitysMap);

    

    this.InitializeUnitys();

    // this.ModernSniper = new UnityObject(this.kModernSniper);
    // this.ModernSniper.SetBoardPosition(0, 0, UnityObject.EFaceing.ELeft);
    // this.ModernSniper.SetTargetLocation(3, 2);

    var DotRender = new SpriteSheetRenderComponent(this.kDot);
    DotRender.SetElementPixelPositions(0, 4, 0, 4);      
    DotRender.GetTransform().SetScale(1, 1);         
    DotRender.GetTransform().SetPosition(0, 0); 
    this.Dot = new GameObject(DotRender);

    
};

GameInstance.prototype.InitializeUnitys = function () 
{
    for(var y = 0; y < board[0].length; y++)
    {
        for(var x = 0; x < board.length; x++) 
        {
          if(board[x][y] != "nil")
            this.CreateUnityByID(board[x][y], x, y);
        }
      }    
};

GameInstance.prototype.CreateUnityByID = function (StrId, x, y) 
{
    var bIsAncient = StrId.startsWith("1");
    var Face = (y > 2) ? UnityObject.EFaceing.ERight : UnityObject.EFaceing.ELeft;
    var UnityRender = null;

    if(StrId.search("sniper") > 0)
        UnityRender = bIsAncient ? new UnityObject(this.kAncientSniper) : new UnityObject(this.kModernSniper);

    if(StrId.search("tank") > 0)
        UnityRender = bIsAncient ? new UnityObject(this.kAncientTank) : new UnityObject(this.kModernTank);

    if(StrId.search("bomb") > 0)
        UnityRender = bIsAncient ? new UnityObject(this.kAncientBomber) : new UnityObject(this.kModernBomber);

    if(StrId.search("hero") > 0)
        UnityRender = bIsAncient ? new UnityObject(this.kAncientHero) : new UnityObject(this.kModernHero);

    if(UnityRender != null)
        UnityRender.SetBoardPosition(x, y, Face);
    else
        alert("Unidade não reconhecida");
        
    this.UnitysMap.Add(UnityRender, StrId);
};


GameInstance.prototype.Render = function () 
{
    // Limpa a tela
    IctusBot.Renderer.Clear([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Prepara a Camera
    this.MainCamera.SetupViewProjection();

    this.Board.Render(this.MainCamera);
    this.Cursor.Render(this.MainCamera);

    this.UnitysMap.Render(this.MainCamera);


    this.Dot.Render(this.MainCamera);

};

GameInstance.prototype.Update = function (DeltaTime) 
{
    var deltaAmbient = 0.01;
    this.MainCamera.Update();
    this.Board.Update(this.MainCamera);
    this.Cursor.Update(this.MainCamera);

    this.UnitysMap.Update(DeltaTime);


    // var v = IctusBot.DefaultResources.GetGlobalAmbientColor();
    // if (IctusBot.Input.IsButtonPressed(IctusBot.Input.MouseButton.Left)) 
    // {
    //     v[0] += deltaAmbient;
    // }

    // if (IctusBot.Input.IsButtonPressed(IctusBot.Input.MouseButton.Middle)) 
    // {
    //     v[0] -= deltaAmbient;
    // }

    // if (IctusBot.Input.IsKeyPressed(IctusBot.Input.keys.Left)) 
    // {
    //     IctusBot.DefaultResources.SetGlobalAmbientIntensity(IctusBot.DefaultResources.GetGlobalAmbientIntensity() - deltaAmbient);
    // }

    // if (IctusBot.Input.IsKeyPressed(IctusBot.Input.keys.Right)) 
    // {
    //     IctusBot.DefaultResources.SetGlobalAmbientIntensity(IctusBot.DefaultResources.GetGlobalAmbientIntensity() + deltaAmbient);
    // }


};