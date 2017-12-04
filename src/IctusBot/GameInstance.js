
"use strict";  


function GameInstance() 
{    
    this.MainCamera = null;    
    
    this.kGroundSheet = "Assets/GrassSpriteSheet.png";
    this.kCursorSprite = "Assets/Cursor.png";

    this.kAncientIcon = "Assets/icon_clas.png";
    this.kModernIcon = "Assets/icon_mod.png";

    this.kAncientSniper = "Assets/AncientSniper.png";
    this.kAncientSniperNormal = "Assets/AncientSniper_NORM.png";
    this.kModernSniper = "Assets/ModernSniper.png";
    this.kModernSniperNormal = "Assets/ModernSniper_NORM.png";
    this.kAncientTank = "Assets/AncientTank.png";
    this.kAncientTankNormal = "Assets/AncientTank_NORM.png";
    this.kModernTank = "Assets/ModernTank.png";
    this.kModernTankNormal = "Assets/ModernTank_NORM.png";
    this.kAncientBomber = "Assets/AncientBomber.png";
    this.kAncientBomberNormal = "Assets/AncientBomber_NORM.png";
    this.kModernBomber = "Assets/ModernBomber.png";
    this.kModernBomberNormal = "Assets/ModernBomber_NORM.png";
    this.kAncientHero = "Assets/AncientHeroV3.png";
    this.kAncientHeroNormal = "Assets/AncientHeroV3_NORM.png";
    this.kModernHero = "Assets/ModernHeroV3.png";  
    this.kModernHeroNormal = "Assets/ModernHeroV3_NORM.png";  

    this.kExplosion = "Assets/ExplosionSheetV3.png";
    this.kHud = "Assets/HudFrame.png";
    this.kDot = "Assets/Dot.png";

    this.kExplosionAudio = "Assets/Sounds/Explosion.mp3";
    this.kMusic = "Assets/Sounds/IctusBotBattleMusicv1.mp3";

 
    this.UnitysMap = new GameObjectMap();
    this.Board = null;
    this.Cursor = null;
    this.GlobalLightSet = null;

    this.Explosion = null;
    this.Hud = null;
    
    // Para testes... retirar depois...
    this.Dot = null;

    this.IsPaused = true;
    this.GameStarted = false;

    this.Debug = null;

    this.AncientPlayerNameStr = "";
    this.ModernPlayerNameStr = "";

}

IctusBot.Core.InheritPrototype(GameInstance, MapInterface);

GameInstance.prototype.LoadMap = function () 
{
    IctusBot.AudioClips.LoadAudio(this.kExplosionAudio);
    IctusBot.AudioClips.LoadAudio(this.kMusic);
    IctusBot.Textures.LoadTexture(this.kGroundSheet);
    IctusBot.Textures.LoadTexture(this.kCursorSprite); 
    IctusBot.Textures.LoadTexture(this.kExplosion);
    IctusBot.Textures.LoadTexture(this.kHud);
    IctusBot.Textures.LoadTexture(this.kAncientIcon);
    IctusBot.Textures.LoadTexture(this.kModernIcon);


    IctusBot.Textures.LoadTexture(this.kAncientSniper);
    IctusBot.Textures.LoadTexture(this.kAncientSniperNormal);
    IctusBot.Textures.LoadTexture(this.kModernSniper);
    IctusBot.Textures.LoadTexture(this.kModernSniperNormal);
    IctusBot.Textures.LoadTexture(this.kAncientTank);
    IctusBot.Textures.LoadTexture(this.kAncientTankNormal);
    IctusBot.Textures.LoadTexture(this.kModernTank);
    IctusBot.Textures.LoadTexture(this.kModernTankNormal);
    IctusBot.Textures.LoadTexture(this.kAncientBomber);
    IctusBot.Textures.LoadTexture(this.kAncientBomberNormal);
    IctusBot.Textures.LoadTexture(this.kModernBomber);
    IctusBot.Textures.LoadTexture(this.kModernBomberNormal);
    IctusBot.Textures.LoadTexture(this.kAncientHero);
    IctusBot.Textures.LoadTexture(this.kAncientHeroNormal);
    IctusBot.Textures.LoadTexture(this.kModernHero);
    IctusBot.Textures.LoadTexture(this.kModernHeroNormal);


    //IctusBot.Textures.LoadTexture(this.kDot);    
};

GameInstance.prototype.UnloadMap = function () 
{
    IctusBot.AudioClips.StopBackgroundAudio();
    IctusBot.Textures.UnloadTexture(this.kGroundSheet);
    IctusBot.Textures.UnloadTexture(this.kCursorSprite);
    IctusBot.Textures.UnloadTexture(this.kAncientIcon);
    IctusBot.Textures.UnloadTexture(this.kModernIcon);
        
    IctusBot.Textures.UnloadTexture(this.kAncientSniper);
    IctusBot.Textures.UnloadTexture(this.kAncientSniperNormal);
    IctusBot.Textures.UnloadTexture(this.kModernSniper);
    IctusBot.Textures.UnloadTexture(this.kModernSniperNormal);
    IctusBot.Textures.UnloadTexture(this.kAncientTank);
    IctusBot.Textures.UnloadTexture(this.kAncientTankNormal);
    IctusBot.Textures.UnloadTexture(this.kModernTank);
    IctusBot.Textures.UnloadTexture(this.kModernTankNormal);
    IctusBot.Textures.UnloadTexture(this.kAncientBomber);
    IctusBot.Textures.UnloadTexture(this.kAncientBomberNormal);
    IctusBot.Textures.UnloadTexture(this.kModernBomber);
    IctusBot.Textures.UnloadTexture(this.kModernBomberNormal);
    IctusBot.Textures.UnloadTexture(this.kAncientHero);
    IctusBot.Textures.UnloadTexture(this.kAncientHeroNormal);
    IctusBot.Textures.UnloadTexture(this.kModernHero);
    IctusBot.Textures.UnloadTexture(this.kModernHeroNormal);

    IctusBot.Textures.UnloadTexture(this.kExplosion);
    IctusBot.Textures.UnloadTexture(this.kHud);
    IctusBot.AudioClips.UnloadAudio(this.kExplosionAudio);
    IctusBot.AudioClips.UnloadAudio(this.kMusic);
};

GameInstance.prototype.Initialize = function () 
{
    this.GameStarted = true;
    // Cria a Camera.
    this.MainCamera = new CameraObject(vec2.fromValues(-10, -15), 100, [0, 0, 1920, 1080]);
    //this.MainCamera.SetBackgroundColor([0.5, 0.5, 0.5, 1]);
    this.MainCamera.SetBackgroundColor([0, 0, 0, 1]);

    // var GlobalAmbientColor = IctusBot.DefaultResources.GetGlobalAmbientColor();
    // GlobalAmbientColor[0] -= 0.02;
    //IctusBot.DefaultResources.SetGlobalAmbientIntensity(IctusBot.DefaultResources.GetGlobalAmbientIntensity() + 1.7);
    IctusBot.DefaultResources.SetGlobalAmbientIntensity(IctusBot.DefaultResources.GetGlobalAmbientIntensity() + 1.1);
    this.InitializeLights();

    this.Debug = new DebugMode(this);
    
    this.Explosion = new ExplosionObject(this.kExplosion);
          
    this.InitializeUnitys();
    this.Board = new BoardObject(this.kGroundSheet, this);
    this.Hud = new HudObject(this.kHud, this);
    this.Cursor = new CursorObject(this.kCursorSprite, this.Board, this.UnitysMap, this.Explosion, this.Hud, this.GlobalLightSet.GetLightAt(0), this.MainCamera);
 
    if(!this.IsPaused)
    {
        if(!IctusBot.AudioClips.IsBackgroundAudioPlaying())
            IctusBot.AudioClips.PlayBackgroundAudio(this.kMusic);
        
        this.Hud.StartMatch();        
    }


    var test = 0;

    // Para Testes
    this.StartMatch("Ancient Player", "Modern Player");    
};

GameInstance.prototype.StartMatch = function(AncientPlayer, ModernPlayer)
{
    this.IsPaused = false;

    this.AncientPlayerNameStr = AncientPlayer;
    this.ModernPlayerNameStr = ModernPlayer;

    if(this.GameStarted && !IctusBot.AudioClips.IsBackgroundAudioPlaying())
    {
        //IctusBot.AudioClips.PlayBackgroundAudio(this.kMusic);
        this.Hud.StartMatch();
    }
}

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
        UnityRender = bIsAncient ? new UnityObject(this.kAncientSniper, this.kAncientSniperNormal) : new UnityObject(this.kModernSniper, this.kModernSniperNormal);

    if(StrId.search("tank") > 0)
        UnityRender = bIsAncient ? new UnityObject(this.kAncientTank, this.kAncientTankNormal) : new UnityObject(this.kModernTank, this.kModernTankNormal);

    if(StrId.search("bomb") > 0)
        UnityRender = bIsAncient ? new UnityObject(this.kAncientBomber, this.kAncientBomberNormal) : new UnityObject(this.kModernBomber, this.kModernBomberNormal);

    if(StrId.search("hero") > 0)
        UnityRender = bIsAncient ? new HeroObject(this.kAncientHero, this.kAncientHeroNormal) : new HeroObject(this.kModernHero, this.kModernHeroNormal);

    if(UnityRender != null)
    {
        //UnityRender.GetRenderComponent().AddLight(this.GlobalLightSet.GetLightAt(1));
        UnityRender.SetBoardPosition(x, y, Face);

        UnityRender.GetRenderComponent().GetMaterial().SetShininess(100);
        UnityRender.GetRenderComponent().GetMaterial().SetSpecular([1, 0, 0, 1]); 

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
    if(!this.IsPaused)   
        this.Cursor.Render(this.MainCamera);

    this.UnitysMap.Render(this.MainCamera);
    this.Explosion.Render(this.MainCamera);


    this.Hud.Render(this.MainCamera);
    this.Debug.Render(this.MainCamera);
    //this.Dot.Render(this.MainCamera);

};

GameInstance.prototype.Update = function (DeltaTime) 
{
    var deltaAmbient = 0.01;
    this.MainCamera.Update();
    
    this.Board.Update(this.MainCamera);
    if(!this.IsPaused)
        this.Cursor.Update(this.MainCamera);

    this.UnitysMap.Update(DeltaTime);    
    this.Explosion.Update(DeltaTime);

    this.Hud.Update(DeltaTime);
    this.Debug.Update(DeltaTime);

};

GameInstance.prototype.InitializeLights = function () 
{
    this.GlobalLightSet = new LightSet();


    // var Light = this.CreateALight(LightObject.ELightType.EPointLight, [-5, -10, 5], [0, 0, -1],          
    //     [1, 1, 1, 1], 3, 8, 0.3, 0.6, 0.6, 0.5);

    
    //var Light = this.CreateALight([21, 58, 5], [0.2, 0.2, 0.8, 1], 20, 50, 5.5);
    var Light = this.CreateALight(LightObject.ELightType.EPointLight, [-10, -10, 5], [0, 0, -1],          
                                  [1, 1, 1, 1], 3, 8, 0.3, 0.6, 0.5, 0.5);
    Light.SetLightCastShadowTo(true);
    this.GlobalLightSet.AddToSet(Light);
    
    //Light = this.CreateALight([24, 24, 8], [0.4, 0.7, 0.4, 1], 20, 45, 2.8);
    Light = this.CreateALight(LightObject.ELightType.EDirectionalLight, [-5, -5, 10], [-0.38, -0.4, -1],      
                              [0.8, 0.6, 0.6, 1], 15, 40, 0.35, 0.25, 0.9, 0.8 );
    Light.SetLightCastShadowTo(true);
                              //[0.8, 0.6, 0.6, 1], 15, 40, 0.1, 0.2, 0.9, 1.0 );
    this.GlobalLightSet.AddToSet(Light);
    //[0.8, 0.6, 0.6, 1], 500, 500, 0.1, 0.2, 1.0, 1.0 );
//[0.6, 0.6, 0.6, 1]
    //Light = this.CreateALight([66, 23, 10], [0.7, 0.7, 0.7, 1], 10, 35, 3);    
    Light = this.CreateALight(LightObject.ELightType.ESpotLight, [50, 18, 15], [-0.07,  0, -1],     
                              [0.5, 0.5, 0.5, 1], 100, 150, 1.65, 1.7, 1.2, 1.2 );
    this.GlobalLightSet.AddToSet(Light);

    //[0.5, 0.5, 0.5, 1], 100, 100, 1.65, 1.7, 5, 1.2 );
    
    Light = this.CreateALight(LightObject.ELightType.ESpotLight, [10, 10, 10], [0.0, 0.03, -1],
                              [0.8, 0.8, 0.2, 1], 100, 100, 1.9, 2.0, 2, 1);
    this.GlobalLightSet.AddToSet(Light);

   
};

GameInstance.prototype.CreateALight = function (Type, InPosition, InDirection, Color, Near, Far, Inner, Outer, Intensity, DropOff) 
{
    var Light = new LightObject();
    Light.SetColor(Color);
    Light.SetXPosition(InPosition[0]);
    Light.SetYPosition(InPosition[1]);
    Light.SetZPosition(InPosition[2]);
    Light.SetNear(Near);
    Light.SetFar(Far);    
    Light.SetIntensity(Intensity);

    Light.SetLightType(Type);
    Light.SetDirection(InDirection);
    Light.SetInner(Inner);
    Light.SetOuter(Outer);
    Light.SetDropOff(DropOff);
    //Light.SetLightCastShadowTo(true);

    return Light;
};











function DebugMode(InGameInstanceRef) 
{ 

    this.GameInstanceRef = InGameInstanceRef;
    this.bIsOn = false;
    this.bAmbientLightMode = false;
    this.bSpotLightMode = false;
    this.bMaterialMode = false;    
    this.bWindowMode = false;

    this.Window = null;    
    this.WindowShadow = null;
    this.WindowCaption = null;
    this.TextBox = null;
    this.ConsoleText = null;
    this.ConsoleTextStr = "";

    this.InstructionsText = null;
    this.StateText = null;

    this.LightIndex = 0;
    
    this.UnityIndex = 0;
    this.SelectedUnity = null;

    this.CurrentSlot = 0;

    this.Initialize();

    var InputInstance = this;
    IctusBot.Input.RegisterCallback(function(event) { InputInstance.InputCallBack(event); });
}

DebugMode.EDebugSlotState = Object.freeze({ ESlot0: 0, ESlot1: 1, ESlot2: 2, ESlot3: 3, ESlot3: 4 });

DebugMode.prototype.Update = function (DeltaTime) 
{
    if(this.bIsOn && this.bAmbientLightMode)
    {
        var msg = "Current Slot (" + this.CurrentSlot + ") - To change press " + "(0)Light Index: " + this.LightIndex + " ";
        msg += this.LightControl();
        this.StateText.SetText(msg);
    }
    if(this.bIsOn && this.bMaterialMode)
    {     
        this.SelectedUnity = this.GameInstanceRef.UnitysMap.ObjectArray[this.UnityIndex].Asset;
        var UnityName = this.GameInstanceRef.UnitysMap.ObjectArray[this.UnityIndex].ID;
        var bIsAncient = UnityName.startsWith("1");
        UnityName = bIsAncient ? UnityName.replace("1", "ancient ") : UnityName.replace("2", "modern ");

        var msg = "Current Slot (" + this.CurrentSlot + ") - To change press " + "(0)Unity " + this.UnityIndex + " - " + UnityName + " ";        
        msg += this.MaterialControl();
        this.StateText.SetText(msg);
    }
}

DebugMode.prototype.Render = function (InCamera) 
{
    this.WindowRender(InCamera);
    this.StateRender(InCamera);
}


DebugMode.prototype. InputCallBack = function (event) 
{
    if(event.keyCode == 192)
    {
        this.bWindowMode = !this.bWindowMode;
        this.ConsoleTextStr = "";
    }
    else if(this.bWindowMode)
    {
        if(event.keyCode == 8)
        {
            if(this.ConsoleTextStr.length > 0)
            {
                if(this.ConsoleTextStr.length == 1)
                    this.ConsoleTextStr = "";
                else
                    this.ConsoleTextStr = this.ConsoleTextStr.slice(0, this.ConsoleTextStr.length -1);

                this.ConsoleText.SetText(this.ConsoleTextStr);                
            }
        }
        else if(event.keyCode == 13)
        {
            this.bAmbientLightMode = false;
            this.bSpotLightMode = false;
            this.bMaterialMode = false;

            if(this.ConsoleTextStr == "light")
            {
                this.bAmbientLightMode = true;
                this.CurrentSlot = 0;
                this.SetInstructionText(this.CurrentSlot);
            }
            else if(this.ConsoleTextStr == "spot")
            {
                this.bSpotLightMode = true;
            }
            else if(this.ConsoleTextStr == "material")
            {
                this.bMaterialMode = true;
                this.CurrentSlot = 0;
                this.SetInstructionText(this.CurrentSlot);
            }
            else if(this.ConsoleTextStr == "off")
            {

            }
            else if("ancient wins")
            {
                for(var i = 0; i < board.length; i++)
                {
                    for(var j = 0; j < board[0].length; j++) 
                    {
                      if(board[i][j] == "2hero")
                      {
                          board[i][j] = "nil";
                          break
                      }
                    }
                }

                this.GameInstanceRef.Hud.SetState(HudObject.EState.EGameOver);
            }
            else if("modern wins")
            {
                for(var i = 0; i < board.length; i++)
                {
                    for(var j = 0; j < board[0].length; j++) 
                    {
                      if(board[i][j] == "1hero")
                      {
                          board[i][j] = "nil";
                          break
                      }
                    }
                }

                this.GameInstanceRef.Hud.SetState(HudObject.EState.EGameOver);
            }

            this.ConsoleTextStr = "";
            this.ConsoleText.SetText(this.ConsoleTextStr);
            this.bWindowMode = false;

            this.bIsOn = !(!this.bAmbientLightMode && !this.bSpotLightMode && !this.bMaterialMode);
        }
        else
        {
            this.ConsoleTextStr += event.key;
            this.ConsoleText.SetText(this.ConsoleTextStr);
        }
    }
    else
    {
        if(this.bIsOn)
        {
            if(event.keyCode == 48 || event.keyCode == 49 || event.keyCode == 50 || event.keyCode == 51|| event.keyCode == 52)
                this.SetInstructionText(event.keyCode);
        }
    }

}


// for(var i = 0; i < board.length; i++){
//     for(var j = 0; j < board[0].length; j++) {
//       if(this.board[i][j] == "1hero"){
//         hero1 = true;
//       }
//       else if(board[i][j] == "2hero"){
//         hero2 = true;
//       }
//     }
//   }

DebugMode.prototype.WindowRender = function (InCamera) 
{
    if(this.bWindowMode)
    {
        this.WindowShadow.Render(InCamera);
        this.Window.Render(InCamera);
        this.WindowCaption.Render(InCamera);
        this.TextBox.Render(InCamera);
        this.ConsoleText.Render(InCamera);        
    }
}

DebugMode.prototype.StateRender = function (InCamera) 
{
    if(this.bIsOn)
    {
        this.StateText.Render(InCamera);
        this.InstructionsText.Render(InCamera);
    }
}

DebugMode.prototype.SetInstructionText = function (InSlot) 
{
    if(event.keyCode == 48)
        this.CurrentSlot = 0;
    else if(event.keyCode == 49)
        this.CurrentSlot = 1;
    else if(event.keyCode == 50)
        this.CurrentSlot = 2;
    else if(event.keyCode == 51)
        this.CurrentSlot = 3;
    else if(event.keyCode == 52)
        this.CurrentSlot = 4;

    var msg = "";

    if(this.CurrentSlot == 0)
    {        
        if(this.bAmbientLightMode)
        {
            msg = "UP Arrow to Next Index, DOWN Arrow to Previous Index";
        }   
        else if(this.bMaterialMode)
        {
            msg = "UP Arrow to Next Unity, DOWN Arrow to Previous Unity";
        }        
    }
    if(this.CurrentSlot == 1)
    {        
        if(this.bAmbientLightMode)
        {
            msg = "UP Arrow to On, DOWN Arrow to Off";
        }     
        else if(this.bMaterialMode)
        {
            msg = "Ambient - Press UP and DOWN Arrows to change X Axis, LEFT and RIGHT Arrows to change Y Axis, Z and X Keys to change Z Axis";
        }       
    }
    if(this.CurrentSlot == 2)
    {        
        if(this.bAmbientLightMode)
        {
            msg = "UP and DOWN Arrows to Move Y Axis, LEFT and RIGHT Arrows to Move Y Axis, Z and X Keys to Move Z Axis";
        }        
        else if(this.bMaterialMode)
        {
            msg = "Diffuse - Press UP and DOWN Arrows to change X Axis, LEFT and RIGHT Arrows to change Y Axis, Z and X Keys to change Z Axis";
        } 
    }
    if(this.CurrentSlot == 3)
    {        
        if(this.bAmbientLightMode)
        {
            msg = "UP Arrow to Increase Near and DOWN Arrows to decrease Near, LEFT Arrow to decrease Far, and RIGHT to Increase Far";
        }
        else if(this.bMaterialMode)
        {
            msg = "Specular - Press UP and DOWN Arrows to change X Axis, LEFT and RIGHT Arrows to change Y Axis, Z and X Keys to change Z Axis";
        }         
    }
    if(this.CurrentSlot == 4)
    {        
        if(this.bAmbientLightMode)
        {
            msg = "UP Arrow to Increase Shininess and DOWN Arrows to decrease Shininess";
        }   
        else if(this.bMaterialMode)
        {
            msg = "UP Arrow to Increase Shininess and DOWN Arrows to decrease Shininess";
        }         
    }

    this.InstructionsText.SetText(msg);
}

DebugMode.prototype.LightControl = function () 
{
    var delta = 0.2;     
    var lgt = this.GameInstanceRef.GlobalLightSet.GetLightAt(this.LightIndex);
    var msg = "";
    var p = lgt.GetPosition();

    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Up)) 
    {
        if(this.CurrentSlot == 0)
        {
            this.LightIndex = (++this.LightIndex % 4);            
        }
        else if(this.CurrentSlot == 1)
        {
            if(!lgt.IsLightOn())
                lgt.SetLightTo(true);
        }
        else if(this.CurrentSlot == 2)
        {
            lgt.SetYPosition(p[1] + delta);
        }
        else if(this.CurrentSlot == 3)
        {
            lgt.SetNear(lgt.GetNear() + delta);
        }
        else if(this.CurrentSlot == 4)
        {
            lgt.SetIntensity(lgt.GetIntensity() + delta);
        }
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Down)) 
    {
        if(this.CurrentSlot == 0)
        {
            this.LightIndex = (this.LightIndex == 0) ? 3 : this.LightIndex - 1;
        }
        else if(this.CurrentSlot == 1)
        {
            if(lgt.IsLightOn())
                lgt.SetLightTo(false);
        }
        else if(this.CurrentSlot == 2)
        {
            lgt.SetYPosition(p[1] - delta);
        }
        else if(this.CurrentSlot == 3)
        {
            lgt.SetNear(lgt.GetNear() - delta);
        }
        else if(this.CurrentSlot == 4)
        {
            lgt.SetIntensity(lgt.GetIntensity() - delta);
        }
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Left)) 
    {
        if(this.CurrentSlot == 2)
        {
            lgt.SetXPosition(p[0] - delta);
        }
        else if(this.CurrentSlot == 3)
        {
            lgt.SetFar(lgt.GetFar() + delta);
        }
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Right)) 
    {
        if(this.CurrentSlot == 2)
        {
            lgt.SetXPosition(p[0] + delta);
        }
        else if(this.CurrentSlot == 3)
        {
            lgt.SetFar(lgt.GetFar() + delta);
        }
    }

    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Z)) 
    {
        if(this.CurrentSlot == 2)
        {
            lgt.SetZPosition(p[2] + delta);
        }
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.X)) 
    {
        if(this.CurrentSlot == 2)
        {
            lgt.SetZPosition(p[2] - delta);
        }
    }

    msg = "(1)On: (" + lgt.IsLightOn() + ") " +
    this.PrintVec3("(2)Position: ", p) +
    "(3)Near/Far: (" + lgt.GetNear().toPrecision(3) + "/" + lgt.GetFar().toPrecision(3) + ") " +
    "(4)Intensity: (" + lgt.GetIntensity().toPrecision(3) + ")";
    return msg;

};

DebugMode.prototype.PrintVec3 = function (msg, p) 
{
    return msg + "(" + p[0].toPrecision(2) + " " + p[1].toPrecision(2) + " " + p[2].toPrecision(2) + ") ";
};


DebugMode.prototype.MaterialControl = function () 
{
    var delta = 0.1;
    var msg = "";

    var MaterialChannel = this.SelectedUnity.GetRenderComponent().GetMaterial();

    if(this.UnityIndex >= this.GameInstanceRef.UnitysMap.Length())
    {
        this.UnityIndex = this.GameInstanceRef.UnitysMap.Length() -1;
    }

    this.SelectedUnity = this.GameInstanceRef.UnitysMap.GetObjectAt(this.UnityIndex);

    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Up)) 
    {
        if(this.CurrentSlot == 0)
        {
            this.UnityIndex = (++this.UnityIndex % this.GameInstanceRef.UnitysMap.Length());     
        }
        else if(this.CurrentSlot == 1)
        {
            var AmbientChannel = MaterialChannel.GetAmbient();
            AmbientChannel[0] += delta;
        }
        else if(this.CurrentSlot == 2)
        {
            var DiffuseChannel = MaterialChannel.GetDiffuse();
            DiffuseChannel[0] += delta;
        }
        else if(this.CurrentSlot == 3)
        {
            var SpecularChannel = MaterialChannel.GetSpecular();
            SpecularChannel[0] += delta;
        }
        else if(this.CurrentSlot == 4)
        {
            MaterialChannel.SetShininess(MaterialChannel.GetShininess() + delta);
        }
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Down)) 
    {
        if(this.CurrentSlot == 0)
        {
            this.UnityIndex = (this.UnityIndex == 0) ? this.GameInstanceRef.UnitysMap.Length() -1 : this.UnityIndex - 1;
        }
        else if(this.CurrentSlot == 1)
        {
            var AmbientChannel = MaterialChannel.GetAmbient();
            AmbientChannel[0] -= delta;
        }
        else if(this.CurrentSlot == 2)
        {
            var AmbientChannel = MaterialChannel.GetDiffuse();
            AmbientChannel[0] -= delta;
        }
        else if(this.CurrentSlot == 3)
        {
            var AmbientChannel = MaterialChannel.GetSpecular();
            AmbientChannel[0] -= delta;
        }
        else if(this.CurrentSlot == 4)
        {
            MaterialChannel.SetShininess(MaterialChannel.GetShininess() - delta);
        }
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Left)) 
    {
        if(this.CurrentSlot == 1)
        {
            var AmbientChannel = MaterialChannel.GetAmbient();
            AmbientChannel[1] -= delta;
        }
        else if(this.CurrentSlot == 2)
        {
            var AmbientChannel = MaterialChannel.GetDiffuse();
            AmbientChannel[1] -= delta;
        }
        else if(this.CurrentSlot == 3)
        {
            var AmbientChannel = MaterialChannel.GetSpecular();
            AmbientChannel[1] -= delta;
        }
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Right)) 
    {
        if(this.CurrentSlot == 1)
        {
            var AmbientChannel = MaterialChannel.GetAmbient();
            AmbientChannel[1] += delta;
        }
        else if(this.CurrentSlot == 2)
        {
            var AmbientChannel = MaterialChannel.GetDiffuse();
            AmbientChannel[1] += delta;
        }
        else if(this.CurrentSlot == 3)
        {
            var AmbientChannel = MaterialChannel.GetSpecular();
            AmbientChannel[1] += delta;
        }
    }

    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.Z)) 
    {
        if(this.CurrentSlot == 1)
        {
            var AmbientChannel = MaterialChannel.GetAmbient();
            AmbientChannel[2] -= delta;
        }
        else if(this.CurrentSlot == 2)
        {
            var AmbientChannel = MaterialChannel.GetDiffuse();
            AmbientChannel[2] -= delta;
        }
        else if(this.CurrentSlot == 3)
        {
            var AmbientChannel = MaterialChannel.GetSpecular();
            AmbientChannel[2] -= delta;
        }
    }
    if (IctusBot.Input.IsKeyClicked(IctusBot.Input.keys.X)) 
    {
        if(this.CurrentSlot == 1)
        {
            var AmbientChannel = MaterialChannel.GetAmbient();
            AmbientChannel[2] += delta;
        }
        else if(this.CurrentSlot == 2)
        {
            var AmbientChannel = MaterialChannel.GetDiffuse();
            AmbientChannel[2] += delta;
        }
        else if(this.CurrentSlot == 3)
        {
            var AmbientChannel = MaterialChannel.GetSpecular();
            AmbientChannel[2] += delta;
        }
    }
    
    msg = this.PrintVec3("(1)Ambient: ", MaterialChannel.GetAmbient()) + " " +
          this.PrintVec3("(2)Diffuse: ", MaterialChannel.GetDiffuse()) + " " +
          this.PrintVec3("(3)Specular: ", MaterialChannel.GetSpecular()) + " " +
          "(4)Shininess: (" + MaterialChannel.GetShininess().toPrecision(2) + ")";

    return msg;


 
};



DebugMode.prototype.Initialize = function () 
{
    this.Window = new RenderComponent();        
    this.Window.SetColor([0.9, 0.9, 0.9, 1.0]);
    this.Window.GetTransform().SetPosition(-10, -10);
    this.Window.GetTransform().SetScale(20, 10);
    
    this.WindowShadow = new RenderComponent();
    this.WindowShadow.SetColor([0, 0, 0, 0.3]);
    this.WindowShadow.GetTransform().SetPosition(-9.5, -10.5);
    this.WindowShadow.GetTransform().SetScale(20, 10);
    
    this.WindowCaption = new FontRenderComponent("CONSOLE");
    this.WindowCaption.SetColor([1, 1, 1, 1]);
    this.WindowCaption.GetTransform().SetPosition(-12.5, -6.5);
    this.WindowCaption.SetTextHeight(1.65);
    
    this.TextBox = new RenderComponent();
    this.TextBox.SetColor([2, 2, 2, 1]);
    this.TextBox.GetTransform().SetPosition(-10, -11);
    this.TextBox.GetTransform().SetScale(16, 3);
    
    this.ConsoleText = new FontRenderComponent("");
    this.ConsoleText.SetColor([0, 0, 0, 1]);
    this.ConsoleText.GetTransform().SetPosition(-17.5, -11);
    this.ConsoleText.SetTextHeight(1);

    this.StateText = new FontRenderComponent("");
    this.StateText.SetColor([1, 1, 1, 1]);
    this.StateText.GetTransform().SetPosition(-59, -42);
    this.StateText.SetTextHeight(1);

    this.InstructionsText = new FontRenderComponent("Teste");
    this.InstructionsText.SetColor([1, 1, 1, 1]);
    this.InstructionsText.GetTransform().SetPosition(-59, -40.5);
    this.InstructionsText.SetTextHeight(1);
}

