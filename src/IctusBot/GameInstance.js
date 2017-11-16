
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
    this.kAncientHero = "Assets/AncientHeroV3.png"
    this.kModernHero = "Assets/ModernHeroV3.png"       

    this.kDot = "Assets/Dot.png";


    this.UnitysMap = new GameObjectMap();
    this.Board = null;
    this.Cursor = null;
    this.GlobalLightSet = null;
    
    //this.MainLight = null;

    // Para testes... retirar depois...
    this.Dot = null;
    this.LightIndex = 0;
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
    IctusBot.Textures.LoadTexture(this.kAncientHero);
    IctusBot.Textures.LoadTexture(this.kModernHero);


    //IctusBot.Textures.LoadTexture(this.kDot);    
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
    IctusBot.Textures.UnloadTexture(this.kAncientHero);
    IctusBot.Textures.UnloadTexture(this.kModernHero);
};

GameInstance.prototype.Initialize = function () 
{
    // Cria a Camera.
    this.MainCamera = new CameraObject(vec2.fromValues(-10, -15), 100, [0, 0, 1920, 1080]);
    this.MainCamera.SetBackgroundColor([0.8, 0.8, 0.8, 1]);

    // var GlobalAmbientColor = IctusBot.DefaultResources.GetGlobalAmbientColor();
    // GlobalAmbientColor[0] -= 0.02;
    //IctusBot.DefaultResources.SetGlobalAmbientIntensity(IctusBot.DefaultResources.GetGlobalAmbientIntensity() + 1.7);

    // this.MainLight = new LightObject();
    // this.MainLight.SetRadius(8);
    // this.MainLight.SetZPosition(2);
    // this.MainLight.SetXPosition(30);
    // this.MainLight.SetYPosition(30);  
    // this.MainLight.SetColor([0.9, 0.9, 0.2, 1]);

    this.Board = new BoardObject(this.kGroundSheet);
    this.Cursor = new CursorObject(this.kCursorSprite, this.Board, this.UnitysMap);
    this.InitializeLights();
    
    this.InitializeUnitys();

    var test = 0;
    //var DotRender = new SpriteSheetRenderComponent(this.kDot);
    //DotRender.SetElementPixelPositions(0, 4, 0, 4);      
    //DotRender.GetTransform().SetScale(1, 1);         
    //DotRender.GetTransform().SetPosition(0, 0); 
    //this.Dot = new GameObject(DotRender);   
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
        UnityRender = bIsAncient ? new HeroObject(this.kAncientHero) : new HeroObject(this.kModernHero);

    if(UnityRender != null)
    {
        //UnityRender.GetRenderComponent().AddLight(this.MainLight);
        UnityRender.SetBoardPosition(x, y, Face);
        for (var i = 0; i < 4; ++i) 
        {
            UnityRender.GetRenderComponent().AddLight(this.GlobalLightSet.GetLightAt(i));   
        }
        
    }
    else
        alert("Unidade não reconhecida");
        
    this.UnitysMap.Add(UnityRender, StrId);
};


GameInstance.prototype.Render = function () 
{
    // Limpa a tela
    IctusBot.Renderer.Clear([0.9, 0.9, 0.9, 1.0]); 

    // Prepara a Camera
    this.MainCamera.SetupViewProjection();

    this.Board.Render(this.MainCamera);
    this.Cursor.Render(this.MainCamera);

    this.UnitysMap.Render(this.MainCamera);


    //this.Dot.Render(this.MainCamera);

};

GameInstance.prototype.Update = function (DeltaTime) 
{
    var deltaAmbient = 0.01;
    this.MainCamera.Update();
    this.Board.Update(this.MainCamera);
    this.Cursor.Update(this.MainCamera);

    this.UnitysMap.Update(DeltaTime);

    this.LightControl();
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



GameInstance.prototype.CreateALight = function (InPosition, Color, Near, Far, Intensity, Radius) 
{
    var Light = new LightObject();
    Light.SetColor(Color);
    Light.SetXPosition(InPosition[0]);
    Light.SetYPosition(InPosition[1]);
    Light.SetZPosition(InPosition[2]);
    Light.SetNear(Near);
    Light.SetFar(Far);
    Light.SetRadius(Radius);
    Light.SetIntensity(Intensity);

    return Light;
};

GameInstance.prototype.InitializeLights = function () 
{
    this.GlobalLightSet = new LightSet();

    var Light = this.CreateALight([21, 58, 5], [0.2, 0.2, 0.8, 1], 20, 50, 5.5, 5);
    this.GlobalLightSet.AddToSet(Light);
    Light = this.CreateALight([24, 24, 8], [0.4, 0.7, 0.4, 1], 20, 45, 2.8, 5);
    this.GlobalLightSet.AddToSet(Light);
    Light = this.CreateALight([66, 23, 10], [0.7, 0.7, 0.7, 1], 10, 35, 3,5);
    this.GlobalLightSet.AddToSet(Light);
    Light = this.CreateALight([0, 0, 2], [0.8, 0.8, 0.8, 1], 15, 40, 10, 10);
    this.GlobalLightSet.AddToSet(Light);
};


GameInstance.prototype.LightControl = function () 
{
    var delta = 0.2;    
    this.SelectLight();
    
    var lgt = this.GlobalLightSet.GetLightAt(this.LightIndex);

    // testes de posição
    var p = lgt.GetPosition();
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Left)) 
    {
        lgt.SetXPosition(p[0] - delta);
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Right)) 
    {
        lgt.SetXPosition(p[0] + delta);
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Up)) 
    {
        lgt.SetYPosition(p[1] + delta);
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Down)) 
    {
        lgt.SetYPosition(p[1] - delta);
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Z)) 
    {
        lgt.SetZPosition(p[2] + delta);
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.X)) 
    {
        lgt.SetZPosition(p[2] - delta);
    }

    // teste do raio
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.C)) 
    {
        lgt.SetNear(lgt.getNear() + delta);
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.V)) 
    {
        lgt.SetNear(lgt.getNear() - delta);
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.B)) 
    {
        lgt.SetFar(lgt.getFar() + delta);
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.N)) 
    {
        lgt.SetFar(lgt.getFar() - delta);
    }

    // teste de intencidade
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.K)) 
    {
        lgt.SetIntensity(lgt.getIntensity() + delta);
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.L)) 
    {
        lgt.SetIntensity(lgt.getIntensity() - delta);
    }

    // Ligar/desligar
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.H)) 
    {
        lgt.SetLightTo(!lgt.IsLightOn());
    }

};

GameInstance.prototype.SelectLight = function () 
{
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Zero)) 
    {
        this.LightIndex = 0;
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.One)) 
    {
        this.LightIndex = 1;
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Two)) 
    {
        this.LightIndex = 2;
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Three)) 
    {
        this.LightIndex = 3;
    }
};

