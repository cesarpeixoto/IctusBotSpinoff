
"use strict";

// Uso do Module Pattern para criar um encapsulamento.
// https://nandovieira.com.br/design-patterns-no-javascript-module

// Padrão Singleton
// https://nandovieira.com.br/design-patterns-no-javascript-singleton

// Inicializa a variável assegurando que não foi definida.
var IctusBot = IctusBot || { };


IctusBot.Input = (function () 
{

    var kKeysCode = {
        
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40,
        
        Space: 32,

        Zero: 48,
        One: 49,
        Two: 50,
        Three: 51,
        Four: 52,
        Five: 53,
        Six: 54,
        Seven: 55,
        Eight: 56,
        Nine: 57,
        
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        Apostrophe: 192,

        LastKeyCode: 222
    };

    var kMouseButton = 
    {
        Left: 0,
        Middle: 1,
        Right: 2
    };

    var _Canvas = null;
    var ButtonPreviousState = [];
    var IsButtonPressed = [];
    var IsButtonClicked = [];
    var MousePositionX = -1;
    var MousePositionY = -1;

    var KeyPreviousState = [];     
    var IsKeyPressed = [];    
    var IsKeyClicked = [];

    var LastKey = null;

    var _Callback = null; // Este callback é para quem precisa de um comportamento de teclado comum!!

    var RegisterCallback = function (InCallBack) { _Callback = InCallBack; };

    var OnKeyDown = function (event) 
    { 
        IsKeyPressed[event.keyCode] = true; 

        if(_Callback !== null) 
            _Callback(event); 
    };
    var OnKeyUp = function (event) { IsKeyPressed[event.keyCode] = false; };

    var Initialize = function (WebGLCanvasID) 
    {
        var i;
        for (i = 0; i < kKeysCode.LastKeyCode; i++) 
        {
            IsKeyPressed[i] = false;
            KeyPreviousState[i] = false;
            IsKeyClicked[i] = false;
        }
        
        window.addEventListener('keyup', OnKeyUp);
        window.addEventListener('keydown', OnKeyDown);

        for (i = 0; i < 3; i++) 
        {
            ButtonPreviousState[i] = false;
            IsButtonPressed[i] = false;
            IsButtonClicked[i] = false;
        }
        
        window.addEventListener('mousedown', OnMouseDown);
        window.addEventListener('mouseup', OnMouseUp);
        window.addEventListener('mousemove', OnMouseMove);
        
        _Canvas = document.getElementById(WebGLCanvasID);
    };

    var OnMouseMove = function (event) 
    {
        var inside = false;
        var bBox = _Canvas.getBoundingClientRect();
        var x = Math.round((event.clientX - bBox.left) * (_Canvas.width / bBox.width));
        var y = Math.round((event.clientY - bBox.top) * (_Canvas.width / bBox.width));

        if ((x >= 0) && (x < _Canvas.width) && (y >= 0) && (y < _Canvas.height)) 
        {
            MousePositionX = x;
            MousePositionY = _Canvas.height - 1 - y;
            inside = true;
        }
        return inside;
    };

    var OnMouseDown = function (event) 
    {
        if (OnMouseMove(event))
            IsButtonPressed[event.button] = true;        
    };

    var OnMouseUp = function (event) 
    {
        OnMouseMove(event);
        IsButtonPressed[event.button] = false;
    };

    var Update = function () 
    {
        var i;
        for (i = 0; i < kKeysCode.LastKeyCode; i++) 
        {
            IsKeyClicked[i] = (!KeyPreviousState[i]) && IsKeyPressed[i];
            KeyPreviousState[i] = IsKeyPressed[i];
        }

        for (i = 0; i < 3; i++) 
        {
            IsButtonClicked[i] = (!ButtonPreviousState[i]) && IsButtonPressed[i];
            ButtonPreviousState[i] = IsButtonPressed[i];
        }
    };

    var IsKeyPressed = function (keyCode) { return IsKeyPressed[keyCode]; };
    var IsKeyClicked = function (keyCode) { return (IsKeyClicked[keyCode]); };

    var IsKeyClicked = function (keyCode) { return (IsKeyClicked[keyCode]); };
    var IsButtonPressed = function (button) { return IsButtonPressed[button]; };
    var IsButtonClicked = function (button) { return IsButtonClicked[button]; };
    var GetMousePositionX = function () { return MousePositionX; };
    var GetMousePositionY = function () { return MousePositionY; };

    var PublicScope = 
    {
        Initialize: Initialize,
        Update: Update,
        IsKeyPressed: IsKeyPressed,
        IsKeyClicked: IsKeyClicked,
        keys: kKeysCode,
        RegisterCallback: RegisterCallback,

        IsButtonPressed: IsButtonPressed,
        IsButtonClicked: IsButtonClicked,
        GetMousePositionX: GetMousePositionX,       
        GetMousePositionY: GetMousePositionY,
        MouseButton: kMouseButton
    };


    return PublicScope;


}());