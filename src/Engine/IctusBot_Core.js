
"use strict";

// Uso do Module Pattern para criar um encapsulamento.
// https://nandovieira.com.br/design-patterns-no-javascript-module

// Padrão Singleton
// https://nandovieira.com.br/design-patterns-no-javascript-singleton

var IctusBot = IctusBot || { };


IctusBot.Core = (function () 
{

    var kFPS = 60;          
    var kMPF = 1000 / kFPS; 
    
    var PreviousTime;
    var LagTime;
    var CurrentTime;
    var ElapsedTime;
    var DeltaTime;

    var bIsRunning = false;
    var GameInstance = null;

    var GameLoop = function()
    {
        if(bIsRunning)
        {
            requestAnimationFrame(function() { GameLoop.call(GameInstance); });

            CurrentTime = Date.now();
            ElapsedTime = CurrentTime - PreviousTime;
            PreviousTime = CurrentTime;
            LagTime += ElapsedTime;

            while ((LagTime >= kMPF) && bIsRunning) 
            {
                IctusBot.Input.Update();
                this.Update();      
                LagTime -= kMPF;
            }

            this.Render();
        }
        else
        {
            GameInstance.UnloadMap();
        }
    }

    var StartGame = function () 
    {
        PreviousTime = Date.now();
        LagTime = 0.0;
        bIsRunning = true;
        
        requestAnimationFrame(function () { GameLoop.call(GameInstance); });
    };

    var StopGame = function()
    {
        bIsRunning = false;
    }

    var LoadMap = function(InGameInstance)
    {       
        GameInstance = InGameInstance;
        GameInstance.LoadMap.call(InGameInstance);
        IctusBot.ResourceManager.SetLoadCompleteCallback(function() { GameInstance.Initialize(); StartGame(); });        
    }

    var InitializeSystems = function (WebGLCanvasID, InGameInstance) 
    {        
        IctusBot.Renderer.InitializeWebGL(WebGLCanvasID);
        IctusBot.VertexBuffer.Initialize();
        IctusBot.Input.Initialize(WebGLCanvasID);
        IctusBot.AudioClips.InitAudioContext();
        IctusBot.DefaultResources.Initialize(function() { LoadMap(InGameInstance); });
    };

    var InheritPrototype = function (SubClass, SuperClass) 
    {
        var Prototype = Object.create(SuperClass.prototype);
        Prototype.constructor = SubClass;
        SubClass.prototype = Prototype;
    };

    var PublicScope = 
    {
        StartGame: StartGame, // Será que precisa deixar público mesmo?
        StopGame: StopGame,
        LoadMap, LoadMap,
        InheritPrototype: InheritPrototype,
        InitializeSystems: InitializeSystems
    };

    return PublicScope;

}());