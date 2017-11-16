

"use strict"; 

//=================================================================================================================================
// Componente de renderização do shader simples.
function RenderComponent()
{
    this.Shader = IctusBot.DefaultResources.GetConstColorShader();
    this.Transform = new TransformComponent();
    this.Color = [1, 1, 1, 1];
}

RenderComponent.prototype =
{
    //-----------------------------------------------------------------------------------------------------------------------------
    // Executa renderização do shader
    Render: function(RenderCamera)
    {
        var glContext = IctusBot.Renderer.GetContext();
        this.Shader.ActivateShader(this.Color, RenderCamera);  // always activate the shader first!
        this.Shader.LoadObjectTransform(this.Transform.GetTransform());
        glContext.drawArrays(glContext.TRIANGLE_STRIP, 0, 4);
    },

    //-----------------------------------------------------------------------------------------------------------------------------
    // Retorna o componente Transform
    GetTransform: function () { return this.Transform; },

    //-----------------------------------------------------------------------------------------------------------------------------
    // Determina a cor do shader
    SetColor: function (Color) { this.Color = Color; },

    //-----------------------------------------------------------------------------------------------------------------------------
    // Retorna a cor do shader
    GetColor: function () { return this.Color; },
    
    //-----------------------------------------------------------------------------------------------------------------------------
    // Determina o shader
    SetShader: function (InShader) { this.Shader = InShader; }
}


//=================================================================================================================================
// Componente de renderização do shader com textura.
function TextureRenderComponent(InTexture) 
{
    RenderComponent.call(this);
    RenderComponent.prototype.SetColor.call(this, [1, 1, 1, 0]); 
    RenderComponent.prototype.SetShader.call(this, IctusBot.DefaultResources.GetTextureShader());
    this.Texture = InTexture;          
}

//-----------------------------------------------------------------------------------------------------------------------------
// Gambiarra para herança
IctusBot.Core.InheritPrototype(TextureRenderComponent, RenderComponent);

//-----------------------------------------------------------------------------------------------------------------------------
// Executa renderização do shader
TextureRenderComponent.prototype.Render = function (RenderCamera) 
{
    IctusBot.Textures.ActivateTexture(this.Texture);
    RenderComponent.prototype.Render.call(this, RenderCamera);
};

//-----------------------------------------------------------------------------------------------------------------------------
// Renorana a textura
TextureRenderComponent.prototype.GetTexture = function () { return this.Texture; };

//-----------------------------------------------------------------------------------------------------------------------------
// Determina a textura
TextureRenderComponent.prototype.SetTexture = function (InTexture) { this.Texture = InTexture; };


//=================================================================================================================================
// Componente de renderização dos shaders que utilizam sprite sheets.
function SpriteSheetRenderComponent(InTexture) 
{
    TextureRenderComponent.call(this, InTexture);
    RenderComponent.prototype.SetShader.call(this, IctusBot.DefaultResources.GetSpriteSheetShader());
    this.TexLeft = 0.0;   
    this.TexRight = 1.0;   
    this.TexTop = 1.0;    
    this.TexBottom = 0.0;  
}

//-----------------------------------------------------------------------------------------------------------------------------
// Gambiarra para herança
IctusBot.Core.InheritPrototype(SpriteSheetRenderComponent, TextureRenderComponent);

//-----------------------------------------------------------------------------------------------------------------------------
// Enumeração para auxiliar
SpriteSheetRenderComponent.ETexCoordArray = Object.freeze({ ELeft: 2, ERight: 0, ETop: 1, EBottom: 5 });

//-----------------------------------------------------------------------------------------------------------------------------
// Determina o mapeamento da UV
SpriteSheetRenderComponent.prototype.SetElementUVCoordinate = function (Left, Right, Bottom, Top) 
{
    this.TexLeft = Left;
    this.TexRight = Right;
    this.TexBottom = Bottom;
    this.TexTop = Top;
};

//-----------------------------------------------------------------------------------------------------------------------------
// Determina o elemento por posição de pixel na imagem
SpriteSheetRenderComponent.prototype.SetElementPixelPositions = function (Left, Right, Bottom, Top) 
{
    var TexInfo = IctusBot.ResourceManager.RetrieveAsset(this.Texture);
    var ImageW = TexInfo.Width;
    var ImageH = TexInfo.Height;

    this.TexLeft = Left / ImageW;
    this.TexRight = Right / ImageW;
    this.TexBottom = Bottom / ImageH;
    this.TexTop = Top / ImageH;
};

//-----------------------------------------------------------------------------------------------------------------------------
// Retorna as coordenadas da UV
SpriteSheetRenderComponent.prototype.GetElementUVCoordinateArray = function () 
{
    return [ // Putz... 2 horas para descobrir que no javascript não pode por isso na linha de baixo para alinhar...
            this.TexRight,  this.TexTop,          
            this.TexLeft,   this.TexTop,
            this.TexRight,  this.TexBottom,
            this.TexLeft,   this.TexBottom
           ];
};

//-----------------------------------------------------------------------------------------------------------------------------
// Executa renderização do shader
SpriteSheetRenderComponent.prototype.Render = function (PixelColor, RenderCamera) 
{
    this.Shader.SetTextureCoordinate(this.GetElementUVCoordinateArray());
    TextureRenderComponent.prototype.Render.call(this, PixelColor, RenderCamera);
};






function AnimatedSpriteRenderComponent(InTexture) 
{
    SpriteSheetRenderComponent.call(this, InTexture);
    RenderComponent.prototype.SetShader.call(this, IctusBot.DefaultResources.GetSpriteSheetShader());

    this.FrameLeft = 0.0; 
    this.FrameTop = 1.0;  
    this.FrameWidth = 1.0;     
    this.FrameHeight = 1.0;
    this.FrameWidthPadding = 0.0;
    this.TotalFrames = 1;   

    this.UpdateFramesInterval = 1; // fames rate
    this.AnimationType = AnimatedSpriteRenderComponent.EAnimationType.EAnimateRight;

    this.CurrentAnimAdvance = -1;
    this.CurrentFrame = 0;
    //this.InitAnimation();
}

IctusBot.Core.InheritPrototype(AnimatedSpriteRenderComponent, SpriteSheetRenderComponent);


AnimatedSpriteRenderComponent.EAnimationType = Object.freeze(
{
    EAnimateRight: 0,     
    EAnimateLeft: 1,      
    EAnimateSwing: 2,
    EAnimateStoped: 3
});


AnimatedSpriteRenderComponent.prototype.InitAnimation = function () 
{
    this.CurrentTick = 0;

    switch (this.AnimationType) 
    {
    case AnimatedSpriteRenderComponent.EAnimationType.EAnimateRight:
        this.CurrentFrame = 0;
        this.CurrentAnimAdvance = 1; 
        break;
    case AnimatedSpriteRenderComponent.EAnimationType.EAnimateSwing:
        this.CurrentAnimAdvance = -1 * this.CurrentAnimAdvance; 
        this.CurrentFrame += 2 * this.CurrentAnimAdvance;
        break;
    case AnimatedSpriteRenderComponent.EAnimationType.EAnimateLeft:
        this.CurrentFrame = this.NumberFrames - 1;
        this.CurrentAnimAdvance = -1; 
        break;
    case AnimatedSpriteRenderComponent.EAnimationType.EAnimateStoped:
        this.CurrentFrame = 0;
        this.CurrentAnimAdvance = 0; 
        break;
    }
    this.SetSpriteFrame();
};

AnimatedSpriteRenderComponent.prototype.SetSpriteFrame = function () 
{
    var Left = this.FrameLeft + (this.CurrentFrame * (this.FrameWidth + this.FrameWidthPadding));    
    SpriteSheetRenderComponent.prototype.SetElementUVCoordinate.call(this, Left, Left + this.FrameWidth, this.FrameTop - this.FrameHeight, this.FrameTop);
};

AnimatedSpriteRenderComponent.prototype.SetSpriteSequence = function (TopPixel, LeftPixel, FrameWidthInPixel, FrameHeightInPixel, NumOfFrames, WidthPaddingInPixel) 
{
    var TexInfo = IctusBot.ResourceManager.RetrieveAsset(this.Texture);
    var ImageWidth = TexInfo.Width;
    var ImageHeight = TexInfo.Height;

    this.TotalFrames = NumOfFrames;   
    this.FrameLeft = LeftPixel / ImageWidth;
    this.FrameTop = TopPixel / ImageHeight;
    this.FrameWidth = FrameWidthInPixel / ImageWidth;
    this.FrameHeight = FrameHeightInPixel / ImageHeight;
    this.FrameWidthPadding = WidthPaddingInPixel / ImageWidth;
    this.InitAnimation();
};

AnimatedSpriteRenderComponent.prototype.SetFrameRate = function (NewFrameRate) 
{
    this.UpdateFramesInterval = NewFrameRate;   
};

AnimatedSpriteRenderComponent.prototype.IncAnimationSpeed = function (DeltaInterval) 
{
    this.mUpdateInterval += DeltaInterval;   
};

AnimatedSpriteRenderComponent.prototype.SetAnimationType = function (InAnimationType) 
{
    this.AnimationType = InAnimationType;
    this.CurrentAnimAdvance = -1;
    this.CurrentFrame = 0;
    this.InitAnimation();
};


AnimatedSpriteRenderComponent.prototype.UpdateAnimation = function () 
{
    this.CurrentTick++;
    if (this.CurrentTick >= this.UpdateFramesInterval) 
    {
        this.CurrentTick = 0;
        this.CurrentFrame += this.CurrentAnimAdvance;

        if ((this.CurrentFrame >= 0) && (this.CurrentFrame < this.TotalFrames)) 
        {
            this.SetSpriteFrame();
        } 
        else 
        {
            this.InitAnimation();
        }
    }
};



function LightRenderComponent(InTexture) 
{
    AnimatedSpriteRenderComponent.call(this, InTexture);
    RenderComponent.prototype.SetShader.call(this, IctusBot.DefaultResources.GetLightShader());

    this.Lights = [];
}

IctusBot.Core.InheritPrototype(LightRenderComponent, AnimatedSpriteRenderComponent);

LightRenderComponent.prototype.Render = function (InCamera) 
{
    this.Shader.SetLight(this.Light);
    AnimatedSpriteRenderComponent.prototype.Render.call(this, InCamera);
};

LightRenderComponent.prototype.GetLightAt = function (InIndex) 
{
    return this.Lights[InIndex];
};

LightRenderComponent.prototype.AddLight = function (InLight) 
{
    this.Lights.push(InLight);
};

