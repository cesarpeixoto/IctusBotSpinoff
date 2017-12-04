
"use strict";

//=================================================================================================================================
// Componente de matriz de transformação do shader.

function TransformComponent() 
{
    this.Position = vec2.fromValues(0, 0);  
    this.RotationInRad = 0.0;               
    this.Scale = vec2.fromValues(1, 1); 
    this.Z = 0.0;     
}

TransformComponent.prototype =
{
    //-----------------------------------------------------------------------------------------------------------------------------
    // Funções relativas a posição.

    SetPosition: function (XPosition, YPosistion) { this.SetXPosition(XPosition); this.SetYPosition(YPosistion); },
    SetVectorPosition: function (NewPosition) { this.Position =  NewPosition},
    GetPosition: function () { return this.Position; },

    SetXPosition: function (XPosition) { this.Position[0] = XPosition; },
    GetXPosition: function () { return this.Position[0]; },
    SetYPosition: function (YPosistion) { this.Position[1] = YPosistion; },
    GetYPosition: function () { return this.Position[1]; },

    AddToXPosition: function (Value) { this.Position[0] += Value; },
    AddToYPosition: function (Value) { this.Position[1] += Value; },

    SetZPosition: function (d) { this.Z = d; },
    GetZPosition: function () { return this.Z; },
    IncZPosBy: function (delta) { this.Z += delta; },
    Get3DPosition: function () { return vec3.fromValues(this.GetXPosition(), this.GetYPosition(), this.GetZPosition()); },

    
    //-----------------------------------------------------------------------------------------------------------------------------
    // Funções relativas a escala.

    SetScale: function (width, height) { this.SetWidth(width); this.SetHeight(height);},
    SetVectorScale: function (NewScale) { this.Scale =  NewScale},
    GetScale: function () { return this.Scale; },
    IncScale: function (delta) { this.IncWidth(delta); this.IncHeight(delta); },

    GetWidth: function () { return this.Scale[0]; },
    SetWidth: function (width) { this.Scale[0] = width; },
    IncWidth: function (delta) { this.Scale[0] += delta; },
    GetHeight: function () { return this.Scale[1]; },
    SetHeight: function (height) { this.Scale[1] = height; },
    IncHeight: function (delta) { this.Scale[1] += delta; },

    //-----------------------------------------------------------------------------------------------------------------------------
    // Funções relativas a rotação. Objetos 2D rotacionamos apenas no eixo Y.

    SetRotationInRad: function (rotationInRadians) 
    {
        this.RotationInRad = rotationInRadians;
        while (this.RotationInRad > (2 * Math.PI)) 
            this.RotationInRad -= (2 * Math.PI);
    },

    SetRotationInDegree: function (rotationInDegree) { this.SetRotationInRad(rotationInDegree * Math.PI / 180.0); },
    IncRotationByDegree: function (deltaDegree) { this.IncRotationByRad(deltaDegree * Math.PI / 180.0); },
    IncRotationByRad: function (deltaRad) { this.SetRotationInRad(this.RotationInRad + deltaRad); },
    GetRotationInRad: function () {  return this.RotationInRad; },
    GetRotationInDegree: function () { return this.RotationInRad * 180.0 / Math.PI; },

    CloneTo: function (InTransform) 
    {
        InTransform.Position = vec2.clone(this.Position);
        InTransform.Scale = vec2.clone(this.Scale);
        InTransform.Z = this.Z;
        InTransform.RotationInRad = this.RotationInRad;
    },

    //-----------------------------------------------------------------------------------------------------------------------------
    // Retorna a matriz de transformação.
    GetTransform: function () 
    {
        var matrix = mat4.create();
        //mat4.translate(matrix, matrix, vec3.fromValues(this.GetXPosition(), this.GetYPosition(), 0.0));
        mat4.translate(matrix, matrix, this.Get3DPosition());
        mat4.rotateZ(matrix, matrix, this.GetRotationInRad());
        mat4.scale(matrix, matrix, vec3.fromValues(this.GetWidth(), this.GetHeight(), 1.0));

        return matrix;
    }
}
