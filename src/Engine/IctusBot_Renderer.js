


"use strict";



// Uso do Module Pattern para criar um encapsulamento.
// https://nandovieira.com.br/design-patterns-no-javascript-module

// Padrão Singleton
// https://nandovieira.com.br/design-patterns-no-javascript-singleton

// Inicializa a variável assegurando que não foi definida.
var IctusBot = IctusBot || { };


IctusBot.Renderer = (function () 
{
    // Membros privados:
    var gContext = null;        // Referência do Contexto WebGL.

    // Métodos públicos:

    var GetContext = function() { return gContext;}

    // Inicializa o WebGL.
    var InitializeWebGL = function (htmlCanvasID) 
    {
        var Canvas = document.getElementById(htmlCanvasID);    
        
        // Recebe referência do contexto WebGl
        gContext = Canvas.getContext("webgl", { alpha: false }) || Canvas.getContext("experimental-webgl", { alpha: false });

        // Permite transparência nas texturas
        gContext.blendFunc(gContext.SRC_ALPHA, gContext.ONE_MINUS_SRC_ALPHA);
        gContext.enable(gContext.BLEND);

        // Define que imagens podem flipar no eixo Y para casar com as coordenadas de textura no espaço.
        gContext.pixelStorei(gContext.UNPACK_FLIP_Y_WEBGL, true);

        // Checa erros
        if (gContext === null)
        {
            document.write("<br><b>Erro na inicialização do WebGL!</b>");
            return;
        }
    };

    // Limpa o context.
    var Clear = function (Color) 
    {
        // Matrix RGBA        
        gContext.clearColor(Color[0], Color[1], Color[2], Color[3]);  
        gContext.clear(gContext.COLOR_BUFFER_BIT);      
    };

    var PublicScope = 
    {
        GetContext: GetContext,
        InitializeWebGL: InitializeWebGL,
        Clear: Clear
    };

    return PublicScope;

}());



//=================================================================================================================================
// Classe responsável pelos buffers dos shaders no contexto WebGL 
// (nossas geometrias são sempre quadrados, para sprites de um jogo 2D)

IctusBot.VertexBuffer = (function () 
{
    // Referêncai para as posições dos vertices para um quadrado no contexto do WebGL
    var _SquareVertexBuffer = null;
    // referência para as posições da textura para o quadrado no contexto do WebGL
    var _TextureCoordBuffer = null;

    // Vertices do quadrado 
    var VerticesOfSquare = 
    [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    // Coordenadas da UV
    var TextureCoordinates = 
    [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ];

    //-----------------------------------------------------------------------------------------------------------------------------
    // Inicializa os buffers de vertices
    var Initialize = function () 
    {
        var glContext = IctusBot.Renderer.GetContext();

        // Cria um buder no contexto para as posições dos vertices
        _SquareVertexBuffer = glContext.createBuffer();
        // Ativa o VertexBuffer
        glContext.bindBuffer(glContext.ARRAY_BUFFER, _SquareVertexBuffer);
        // Carrega os vertices do quadrado no vertexBuffer
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(VerticesOfSquare), glContext.STATIC_DRAW);

        // Cria um buder no contexto para as posições dos vertices
        _TextureCoordBuffer = glContext.createBuffer();
        // Ativa o VertexBuffer
        glContext.bindBuffer(glContext.ARRAY_BUFFER, _TextureCoordBuffer);
        // Carrega os vertices do quadrado no vertexBuffer
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(TextureCoordinates), glContext.STATIC_DRAW);
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Retorna referência do buffer de vertices das posições no mundo;
    var GetVertexBufferRef = function () { return _SquareVertexBuffer; };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Retorna referência do buffer de vertices das da textura na geometria.
    var GetTextureCoordBufferRef = function () { return _TextureCoordBuffer; };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Define o escopo público.
    var PublicScope = 
    {
        Initialize: Initialize,
        GetVertexBufferRef: GetVertexBufferRef,
        GetTextureCoordBufferRef: GetTextureCoordBufferRef
    };

    return PublicScope;

}());



//=================================================================================================================================
// Classe pela criação dos shaders simples (Quad) e pelas referências dos atributos, e Classe base para os demais objetos de shader.

function SimpleShader(VertexShaderPath, FragmentShaderPath) 
{
    this.CompiledShader = null;                 // Referência do shader compilado no contexto
    this.ShaderVertexPositionAttribute = null;  // Referência do atributo SquareVertexPosition do shader    
    this.PixelColor = null;                     // Referência do atributo pixelColor do fragment shader
    this.ModelTransform = null;                 // Referência da matriz de transformação do fragment shader
    this.ViewProjTransform = null;              // Referência para matriz View/Projection no vertex shader
    this.GlobalAmbientColor = null;
    this.GlobalAmbientIntensity = null;

    var glContext = IctusBot.Renderer.GetContext();

    // Carrega e compila o vertex shader e fragment shader.
    var VertexShader = this.CompileShader(VertexShaderPath, glContext.VERTEX_SHADER);
    var FragmentShader = this.CompileShader(FragmentShaderPath, glContext.FRAGMENT_SHADER);

    // Faz a compilação e a linkedição do shader
    this.CompiledShader = glContext.createProgram();
    glContext.attachShader(this.CompiledShader, VertexShader);
    glContext.attachShader(this.CompiledShader, FragmentShader);
    glContext.linkProgram(this.CompiledShader);

    // Verifica erro de compilação ou linkedição
    if (!glContext.getProgramParameter(this.CompiledShader, glContext.LINK_STATUS)) 
    {
        alert("Erro de linker no shader");
        return null;
    }

    // Recebe a referência do atributo aSquareVertexPosition do shader.
    this.ShaderVertexPositionAttribute = glContext.getAttribLocation(this.CompiledShader, "aSquareVertexPosition");

    // Ativa o vertex buffer carregado na classe IctusBot.VertexBuffer
    glContext.bindBuffer(glContext.ARRAY_BUFFER, IctusBot.VertexBuffer.GetVertexBufferRef());

    // Recebe a referência do atributo com a posição do vertice
    glContext.vertexAttribPointer(this.ShaderVertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

    // Recebe as referências dos atributos uPixelColor, uModelTransform e uViewProjTransform
    this.PixelColor = glContext.getUniformLocation(this.CompiledShader, "uPixelColor");
    this.ModelTransform = glContext.getUniformLocation(this.CompiledShader, "uModelTransform");
    this.ViewProjTransform = glContext.getUniformLocation(this.CompiledShader, "uViewProjTransform");
    this.GlobalAmbientColor = glContext.getUniformLocation(this.CompiledShader, "uGlobalAmbientColor");
    this.GlobalAmbientIntensity = glContext.getUniformLocation(this.CompiledShader, "uGlobalAmbientIntensity");
}


SimpleShader.prototype = 
{
    //-----------------------------------------------------------------------------------------------------------------------------
    // Retorna o compilador de shader
    GetShader: function () { return this.CompiledShader; },

    //-----------------------------------------------------------------------------------------------------------------------------    
    // Ativa o shader para renderização
    ActivateShader: function (InPixelColor, RenderCamera) 
    {
        var glContext = IctusBot.Renderer.GetContext();
        glContext.useProgram(this.CompiledShader);
        glContext.uniformMatrix4fv(this.ViewProjTransform, false, RenderCamera.GetViewProjectionMatrix());
        glContext.enableVertexAttribArray(this.ShaderVertexPositionAttribute);
        glContext.uniform4fv(this.PixelColor, InPixelColor);

        glContext.uniform4fv(this.GlobalAmbientColor, IctusBot.DefaultResources.GetGlobalAmbientColor());
        glContext.uniform1f(this.GlobalAmbientIntensity, IctusBot.DefaultResources.GetGlobalAmbientIntensity());
    },

    //-----------------------------------------------------------------------------------------------------------------------------
    // Carrega o compoenente Transfom para o vertex shader.
    LoadObjectTransform: function (InModelTransform) 
    {
        var glContext = IctusBot.Renderer.GetContext();
        glContext.uniformMatrix4fv(this.ModelTransform, false, InModelTransform);
    },

    //-----------------------------------------------------------------------------------------------------------------------------
    // Método para carregar, compilar e linkeditar os shaders.
    CompileShader: function (FilePath, ShaderType) 
    {
        var glContext = IctusBot.Renderer.GetContext();
        var ShaderSource = null; 
        var CompiledShader = null;
        
        // Carrega o arquivo com o código do shader.
        ShaderSource = IctusBot.ResourceManager.RetrieveAsset(FilePath);
        // Checa erro de leitura no arquivo
        if (ShaderSource === null) 
        {
            alert("WARNING: Falha ao tentar carregar o arquivo:" + FilePath);
            return null;
        }
    
        // Cria a base do shader de acordo com o tipo (vertex or fragment)
        CompiledShader = glContext.createShader(ShaderType);
    
        // Compila e cria o shader
        glContext.shaderSource(CompiledShader, ShaderSource);
        glContext.compileShader(CompiledShader);
    
        // Checa se existem erros
        if (!glContext.getShaderParameter(CompiledShader, glContext.COMPILE_STATUS)) 
        {
            alert("Erro de compilação: " + glContext.getShaderInfoLog(CompiledShader));
        }
    
        return CompiledShader;
    }
}

//=================================================================================================================================
// Classe para criação e pelas referências dos atributos do shader de textura.

function TextureShader(VertexShaderPath, FragmentShaderPath) 
{
    // Chama o construtor da classe pai
    SimpleShader.call(this, VertexShaderPath, FragmentShaderPath);  // call SimpleShader constructor

    // Referência do atributo aTextureCoordinate do shader
    this.ShaderTextureCoordAttribute = null;
    var glContext = IctusBot.Renderer.GetContext();

    // Recebe referência do atributo aTextureCoordinate do shader    
    this.ShaderTextureCoordAttribute = glContext.getAttribLocation(this.CompiledShader, "aTextureCoordinate");
}

//-----------------------------------------------------------------------------------------------------------------------------
// Gambiarra para herança
IctusBot.Core.InheritPrototype(TextureShader, SimpleShader);

//-----------------------------------------------------------------------------------------------------------------------------
// Overriding do método Activation para a renderização do shader com textura
TextureShader.prototype.ActivateShader = function (PixelColor, RenderCamera) 
{
    // Chama o construtor da classe base    
    SimpleShader.prototype.ActivateShader.call(this, PixelColor, RenderCamera);

    // Recebe ativa o buffer e recebe a referência da coordenadas (UV) da textura na geometria
    var glContext = IctusBot.Renderer.GetContext();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, IctusBot.VertexBuffer.GetTextureCoordBufferRef());
    glContext.enableVertexAttribArray(this.ShaderTextureCoordAttribute);
    glContext.vertexAttribPointer(this.ShaderTextureCoordAttribute, 2, glContext.FLOAT, false, 0, 0);
};


//=================================================================================================================================
// Classe para criação e pelas referências dos atributos do shader que utilizam sprite sheets.
function SpriteShader(VertexShaderPath, FragmentShaderPath) 
{
    TextureShader.call(this, VertexShaderPath, FragmentShaderPath);

    this.TexCoordBuffer = null; 

    var InitTexCoord = 
    [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ];

    var glContext = IctusBot.Renderer.GetContext();
    this.TexCoordBuffer = glContext.createBuffer();

    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.TexCoordBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(InitTexCoord), glContext.DYNAMIC_DRAW);            
}
IctusBot.Core.InheritPrototype(SpriteShader, TextureShader);

//-----------------------------------------------------------------------------------------------------------------------------
// Overriding do método Activation para a renderização do shader com textura
SpriteShader.prototype.ActivateShader = function (PixelColor, RenderCamera) 
{
    SimpleShader.prototype.ActivateShader.call(this, PixelColor, RenderCamera);

    var glContext = IctusBot.Renderer.GetContext();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.TexCoordBuffer);
    glContext.vertexAttribPointer(this.ShaderTextureCoordAttribute, 2, glContext.FLOAT, false, 0, 0);
    glContext.enableVertexAttribArray(this.ShaderTextureCoordAttribute);
};

//-----------------------------------------------------------------------------------------------------------------------------
// Determina a as coordenadas de textura na UV para mapear o sheet
SpriteShader.prototype.SetTextureCoordinate = function (TexCoord) 
{
    var glContext = IctusBot.Renderer.GetContext();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.TexCoordBuffer);
    glContext.bufferSubData(glContext.ARRAY_BUFFER, 0, new Float32Array(TexCoord));
};