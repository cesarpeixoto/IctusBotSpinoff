"use strict";



// Uso do Module Pattern para criar um encapsulamento.
// https://nandovieira.com.br/design-patterns-no-javascript-module

// Padrão Singleton
// https://nandovieira.com.br/design-patterns-no-javascript-singleton

// Inicializa a variável assegurando que não foi definida.
var IctusBot = IctusBot || { };


//=================================================================================================================================
// Classe gerenciador global de todos os assets do jogo. Não realiza o carregamento assíncrono, apenas registra as requisições e armazena os conteudos.
IctusBot.ResourceManager = (function () 
{
    // Registro dos dados do Asset.
    var MapEntry = function (ResourceName) 
    {
        this.Asset = ResourceName;
        this.RefCount = 1;
    };

    var _ResourceMap = {};
    var _NumOutstandingLoads = 0;    
    var _LoadCompleteCallback = null;

    
    //-----------------------------------------------------------------------------------------------------------------------------
    // Registra uma nova operação assíncrona para carregar um arquivo via XMLHttpRequest.
    var AsyncLoadRequested = function (ResourceName) 
    {
        _ResourceMap[ResourceName] = new MapEntry(ResourceName);
        ++_NumOutstandingLoads;
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Recebe o conteudo do arquivo carregado quando ele se tornar disponível.
    var AsyncLoadCompleted = function (ResourceName, LoadedAsset) 
    {
        if (!IsAssetLoaded(ResourceName)) 
            alert("IctusBot.AsyncLoadCompleted: [" + ResourceName + "] Não ha registro desse Asset!");

        _ResourceMap[ResourceName].Asset = LoadedAsset;
        --_NumOutstandingLoads;
        CheckForAllLoadCompleted();
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Checa se todas as requisições para carregamento de arquivos foram concluidas.
    var CheckForAllLoadCompleted = function () 
    {
        if ((_NumOutstandingLoads === 0) && (_LoadCompleteCallback !== null)) 
        {
            var FunctionToCall = _LoadCompleteCallback;
            _LoadCompleteCallback = null;
            FunctionToCall();
        }
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Estabelece um Callback que retorna quando todas as requisições forem completadas.
    var SetLoadCompleteCallback = function (CallbackFunction) 
    {
        _LoadCompleteCallback = CallbackFunction;
        CheckForAllLoadCompleted();
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Retorna referência de um Asset pelo nome.
    var RetrieveAsset = function (ResourceName) 
    {
        var Resource = null;
        if (ResourceName in _ResourceMap) 
            Resource = _ResourceMap[ResourceName].Asset;
        else 
          alert("IctusBot.RetrieveAsset: [" + ResourceName + "] Não está no Mapa!");
        
        return Resource;
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Checa pelo nome, se um Asset foi carregado.
    var IsAssetLoaded = function (ResourceName) 
    {
        return (ResourceName in _ResourceMap);
    };

    // Incrementa no registro o número de referências.
    var IncreasesAssetRefCount = function (ResourceName) 
    {
        _ResourceMap[ResourceName].RefCount += 1;
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Libera o Asset do Manager, e retorna o número de referências (Um Asset estar referênciado em mais de um objeto)
    var UnloadAsset = function (ResourceName) 
    {
            var Count = 0;
            if (ResourceName in _ResourceMap) 
            {
                _ResourceMap[ResourceName].RefCount -= 1;
                Count = _ResourceMap[ResourceName].RefCount;
                if (Count === 0) 
                    delete _ResourceMap[ResourceName];
            }
            return Count;
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Define o escopo público.
    var PublicScope = 
    {
        AsyncLoadRequested: AsyncLoadRequested,
        AsyncLoadCompleted: AsyncLoadCompleted,
        SetLoadCompleteCallback: SetLoadCompleteCallback,
        RetrieveAsset: RetrieveAsset,
        IncreasesAssetRefCount: IncreasesAssetRefCount,
        UnloadAsset: UnloadAsset,
        IsAssetLoaded: IsAssetLoaded
    };

    return PublicScope;
    
}());


//=================================================================================================================================
// Classe que gerencia os Assets de texto
IctusBot.TextFileLoader = (function () 
{
    //-----------------------------------------------------------------------------------------------------------------------------
    // Enumeração do tipo de arquivo de texto.
    var ETextFileType = Object.freeze({ EXMLFile: 0, ETextFile: 1 });

    //-----------------------------------------------------------------------------------------------------------------------------
    // Carrega um arquivo de texto.
    var LoadTextFile = function (FileName, FileType, CallbackFunction) 
    {
        if (!(IctusBot.ResourceManager.IsAssetLoaded(FileName))) 
        {
            IctusBot.ResourceManager.AsyncLoadRequested(FileName);

            var Request = new XMLHttpRequest();
            Request.onreadystatechange = function () 
            {
                if ((Request.readyState === 4) && (Request.status !== 200)) 
                    alert(FileName + ": Não foi possivel carregar o arquivo de texto!");
            };

            Request.open('GET', FileName, true);
            Request.setRequestHeader('Content-Type', 'text/xml');

            Request.onload = function () 
            {
                var FileContent = null;

                if (FileType === ETextFileType.EXMLFile) 
                {
                    var Parser = new DOMParser();
                    FileContent = Parser.parseFromString(Request.responseText, "text/xml");
                } 
                else 
                {
                    FileContent = Request.responseText;
                }
                
                IctusBot.ResourceManager.AsyncLoadCompleted(FileName, FileContent);

                if ((CallbackFunction !== null) && (CallbackFunction !== undefined)) 
                    CallbackFunction(FileName);
            };

            Request.send();

        } 
        else
        {
            if ((CallbackFunction !== null) && (CallbackFunction !== undefined)) 
                CallbackFunction(FileName);
        }
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Libera um arquivo de texto do Manager.
    var UnloadTextFile = function (FileName) 
    {
        IctusBot.ResourceManager.UnloadAsset(FileName);
    };

    var PublicScope = 
    {
        LoadTextFile: LoadTextFile,
        UnloadTextFile: UnloadTextFile,
        ETextFileType: ETextFileType
    };

    return PublicScope;

}());

//=================================================================================================================================
// Classe que gerencia os Assets de audio
IctusBot.AudioClips = (function () 
{
    var _AudioContext = null;
    var _BackgroundAudioNode = null;

    //-----------------------------------------------------------------------------------------------------------------------------
    // Inicializa um contexto de suporte para audio.
    var InitAudioContext = function () 
    {
        try 
        {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            _AudioContext = new AudioContext();

        } catch (e) 
        {
            alert("Erro na inicialização do sistema de audio."); 
        }
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Carrega um arquivo de audio.
    var LoadAudio = function (ClipName) 
    {
        if (!(IctusBot.ResourceManager.IsAssetLoaded(ClipName))) 
        {
            IctusBot.ResourceManager.AsyncLoadRequested(ClipName);

            var Request = new XMLHttpRequest();
            Request.onreadystatechange = function () 
            {
                if ((Request.readyState === 4) && (Request.status !== 200)) 
                    alert(ClipName + ": Não foi possivel carregar o arquivo de audio!");
            };

            Request.open('GET', ClipName, true);
            Request.responseType = 'arraybuffer';

            Request.onload = function () 
            {
                _AudioContext.decodeAudioData(Request.response, function (buffer) { IctusBot.ResourceManager.AsyncLoadCompleted(ClipName, buffer); });
            };

            Request.send();
        } 
        else 
        {
            IctusBot.ResourceManager.IncreasesAssetRefCount(ClipName);
        }
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Libera o Asset do Manager.
    var UnloadAudio = function (ClipName) 
    {
        IctusBot.ResourceManager.UnloadAsset(ClipName);
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Executa um clipe de audio. (apenas um por vez)
    var PlayCue = function (ClipName) 
    {
        var ClipInfo = IctusBot.ResourceManager.RetrieveAsset(ClipName);
        if (ClipInfo !== null) 
        {
            var sourceNode = _AudioContext.createBufferSource();
            sourceNode.buffer = ClipInfo;
            sourceNode.connect(_AudioContext.destination);
            sourceNode.start(0);
        }
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Inicia a execução de audio de fundo.
    var PlayBackgroundAudio = function (ClipName) 
    {
        var ClipInfo = IctusBot.ResourceManager.RetrieveAsset(ClipName);
        if (ClipInfo !== null) 
        {
            StopBackgroundAudio();
            _BackgroundAudioNode = _AudioContext.createBufferSource();
            _BackgroundAudioNode.buffer = ClipInfo;
            _BackgroundAudioNode.connect(_AudioContext.destination);
            _BackgroundAudioNode.loop = true;
            _BackgroundAudioNode.start(0);
        }
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Interrompe a execução de audio de fundo.
    var StopBackgroundAudio = function () 
    {
        if (_BackgroundAudioNode !== null) 
        {
            _BackgroundAudioNode.stop(0);
            _BackgroundAudioNode = null;
        }
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Retorna se algum audio de fundo está em execução.
    var IsBackgroundAudioPlaying = function () 
    {
        return (_BackgroundAudioNode !== null);
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Define o escopo público.
    var PublicScope = 
    {
        InitAudioContext: InitAudioContext,
        LoadAudio: LoadAudio,
        UnloadAudio: UnloadAudio,
        PlayCue: PlayCue,
        PlayBackgroundAudio: PlayBackgroundAudio,
        StopBackgroundAudio: StopBackgroundAudio,
        IsBackgroundAudioPlaying: IsBackgroundAudioPlaying
    };

    return PublicScope;


}());

//=================================================================================================================================
// Registro dos dados da textura.
function TextureInfo(InName, InWidth, InHeight, ID) 
{
    this.Name = InName;
    this.Width = InWidth;
    this.Height = InHeight;
    this.GLTexID = ID;
}

//=================================================================================================================================
// Classe que gerencia os Assets de Textura

IctusBot.Textures = (function () 
{

    //-----------------------------------------------------------------------------------------------------------------------------
    // Converte a imagem para o formato de textura padrão do WebGL.
    var ProcessLoadedImage = function (TextureName, TextureImage) 
    {
        var glContext = IctusBot.Renderer.GetContext();

        // Gera uma referência de textura para o contexto
        var TextureID = glContext.createTexture();
        // Faz um bind da referência da textura com a funcionalidade no WebGL.
        glContext.bindTexture(glContext.TEXTURE_2D, TextureID);
        // Carrega a textura na estrutura de dados adequada.
        glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, TextureImage);
        // Cria Mipmap para as texturas
        glContext.generateMipmap(glContext.TEXTURE_2D);
        // Encerra o bind da textura 
        glContext.bindTexture(glContext.TEXTURE_2D, null);

        // Armazena as informações da textura na struct apropriada.
        var TexInfo = new TextureInfo(TextureName, TextureImage.naturalWidth, TextureImage.naturalHeight, TextureID);
        IctusBot.ResourceManager.AsyncLoadCompleted(TextureName, TexInfo);
    };


    //-----------------------------------------------------------------------------------------------------------------------------
    // Carrega uma textura que então pode ser renderizada.
    var LoadTexture = function (TextureName) 
    {
        if (!(IctusBot.ResourceManager.IsAssetLoaded(TextureName))) 
        {            
            var TextureImage = new Image();
            IctusBot.ResourceManager.AsyncLoadRequested(TextureName);

            // Quando a textura for carregada, faz a conversão de formato.
            TextureImage.onload = function () { ProcessLoadedImage(TextureName, TextureImage); };
            TextureImage.src = TextureName;
        } 
        else 
        {
            IctusBot.ResourceManager.IncreasesAssetRefCount(TextureName);
        }
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Remove a Textura do manader, e da memoria.
    var UnloadTexture = function (TextureName) 
    {
        var glContext = IctusBot.Renderer.GetContext();
        var TexInfo = IctusBot.ResourceManager.RetrieveAsset(TextureName);
        glContext.deleteTexture(TexInfo.GLTexID);
        IctusBot.ResourceManager.UnloadAsset(TextureName);
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Ativa a textura para renderização.
    var ActivateTexture = function (TextureName) 
    {
        var glContext = IctusBot.Renderer.GetContext();
        var TexInfo = IctusBot.ResourceManager.RetrieveAsset(TextureName);
        glContext.bindTexture(glContext.TEXTURE_2D, TexInfo.GLTexID);
        
        // Para previnir wrappings
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);

        // Configura os filtros de majoração de miniaturização.
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR_MIPMAP_LINEAR);
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Desativa a textura para renderização.
    var DeactivateTexture = function () 
    {
        var glContext = IctusBot.Renderer.GetContext();
        glContext.bindTexture(glContext.TEXTURE_2D, null);
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Retorna os dados da textura
    var GetTextureInfo = function (TextureName) 
    {
        return IctusBot.ResourceManager.RetrieveAsset(TextureName);
    };

    //-----------------------------------------------------------------------------------------------------------------------------
    // Define o escopo público.
    var PublicScope = 
    {
        LoadTexture: LoadTexture,
        UnloadTexture: UnloadTexture,
        ActivateTexture: ActivateTexture,
        DeactivateTexture: DeactivateTexture,
        GetTextureInfo: GetTextureInfo
    };

    return PublicScope;

}());



//=================================================================================================================================
IctusBot.DefaultResources = (function () 
{
    var kSimpleVS = "src/Shaders/SimpleVS.glsl";  
    var kSimpleFS = "src/Shaders/SimpleFS.glsl";  
    var _ConstColorShader = null;

    var kTextureVS = "src/Shaders/TextureVertexShader.glsl";  
    var kTextureFS = "src/Shaders/TextureFragmentShader.glsl";  
    var _TextureShader = null;
    var _SpriteSheetShader = null;

    var _GlobalAmbientColor = [0.3, 0.3, 0.3, 1];
    var _GlobalAmbientIntensity = 1;

    var GetConstColorShader = function () { return _ConstColorShader; };
    var GetTextureShader = function () { return _TextureShader; };
    var GetSpriteSheetShader = function () { return _SpriteSheetShader; };

    var GetGlobalAmbientIntensity = function () { return _GlobalAmbientIntensity; };
    var SetGlobalAmbientIntensity = function (v) { _GlobalAmbientIntensity = v; };
    var GetGlobalAmbientColor = function () { return _GlobalAmbientColor; };
    var SetGlobalAmbientColor = function (v) { _GlobalAmbientColor = vec4.fromValues(v[0], v[1], v[2], v[3]); };


    var CreateShaders = function (CallBackFunction) 
    {        
        IctusBot.ResourceManager.SetLoadCompleteCallback(null);
        _ConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
        _TextureShader = new TextureShader(kTextureVS, kTextureFS);
        _SpriteSheetShader =  new SpriteShader(kTextureVS, kTextureFS);
        CallBackFunction();
    };

    var Initialize = function (CallBackFunction) 
    {    
        IctusBot.TextFileLoader.LoadTextFile(kSimpleVS, IctusBot.TextFileLoader.ETextFileType.ETextFile);
        IctusBot.TextFileLoader.LoadTextFile(kSimpleFS, IctusBot.TextFileLoader.ETextFileType.ETextFile);
        
        IctusBot.TextFileLoader.LoadTextFile(kTextureVS, IctusBot.TextFileLoader.ETextFileType.ETextFile);
        IctusBot.TextFileLoader.LoadTextFile(kTextureFS, IctusBot.TextFileLoader.ETextFileType.ETextFile);
        
        IctusBot.ResourceManager.SetLoadCompleteCallback(function () { CreateShaders(CallBackFunction); });
    };

    var PublicScope = 
    {
        Initialize: Initialize,
        GetConstColorShader: GetConstColorShader,
        GetTextureShader: GetTextureShader,
        GetSpriteSheetShader: GetSpriteSheetShader,
        GetGlobalAmbientColor: GetGlobalAmbientColor,
        SetGlobalAmbientColor: SetGlobalAmbientColor,
        GetGlobalAmbientIntensity: GetGlobalAmbientIntensity,
        SetGlobalAmbientIntensity: SetGlobalAmbientIntensity
    };

    return PublicScope;

}());

