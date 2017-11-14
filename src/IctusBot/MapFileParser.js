


// Leitura de arquivos XML - https://www.w3schools.com/js/js_ajax_xmlfile.asp

"use strict";  


//=================================================================================================================================
// Construtor. Carrega o arquivo de mapa.
function MapFileParser(MapFilePath) 
{
    this.MapXml = IctusBot.ResourceManager.RetrieveAsset(MapFilePath);
}


MapFileParser.prototype = 
{
    //-----------------------------------------------------------------------------------------------------------------------------
    // Retorna um elemento do arquivo XML pela Tag.
    GetElement: function (TagElement) 
    {
        var MapElement = this.MapXml.getElementsByTagName(TagElement);
        if (MapElement.length === 0) 
        {
            console.error("Warning: Elemento do Mapa:[" + TagElement + "]: não encontrado!");
        }
        return MapElement;
    },

    //-----------------------------------------------------------------------------------------------------------------------------
    // Faz o parseamento do arquivo XML e retornar um CameraObject com as propriedades definidas.
    ParseCamera: function () 
    {
        var CameraElement = this.GetElement("Camera");
        var CenterX = Number(CameraElement[0].getAttribute("CenterX"));
        var CenterY = Number(CameraElement[0].getAttribute("CenterY"));
        var Width = Number(CameraElement[0].getAttribute("Width"));
        var Viewport = CameraElement[0].getAttribute("Viewport").split(" ");
        var BackgroundColor = CameraElement[0].getAttribute("BackgroundColor").split(" ");
        
        for (var i = 0; i < 4; i++) 
        {
            BackgroundColor[i] = Number(BackgroundColor[i]);
            Viewport[i] = Number(Viewport[i]);
        }

        var Camera = new CameraObject(vec2.fromValues(CenterX, CenterY), Width, Viewport);
        Camera.setBackgroundColor(BackgroundColor);
        
        return Camera;
        
    },

    //-----------------------------------------------------------------------------------------------------------------------------
    // Faz o parseamento do arquivo XML e retornar um Quads com as propriedades definidas.
    ParseSquares: function (sqSet) 
    {
        var SquareElement = this.GetElement("Square");
        var PositionX, PositionY, Width, Height, Rotation, Color, Square;
        for (var i = 0; i < SquareElement.length; i++) 
        {
            PositionX = Number(SquareElement.item(i).attributes.getNamedItem("PositionX").value);
            PositionY = Number(SquareElement.item(i).attributes.getNamedItem("PositionY").value);
            Width = Number(SquareElement.item(i).attributes.getNamedItem("Width").value);
            Height = Number(SquareElement.item(i).attributes.getNamedItem("Height").value);
            Rotation = Number(SquareElement.item(i).attributes.getNamedItem("Rotation").value);
            Color = SquareElement.item(i).attributes.getNamedItem("Color").value.split(" ");
            Square = new RenderComponent(IctusBot.DefaultResources.GetConstColorShader());
            
            for (var j = 0; j < 3; j++) 
                Color[j] = Number(Color[j]);
 
            Square.SetColor(Color);
            Square.GetTransform().SetPosition(PositionX, PositionY);
            Square.GetTransform().SetRotationInDegree(Rotation);
            Square.GetTransform().SetSize(Width, Height);
            sqSet.push(Square);
        }
    },

    ParseTextureSquares: function (sqSet) 
    {
        var TextureSquareElement = this.GetElement("TextureSquare");
        var PositionX, PositionY, Width, Height, Rotation, Color, Texture, Square;
        for (var i = 0; i < TextureSquareElement.length; i++) 
        {
            PositionX = Number(TextureSquareElement.item(i).attributes.getNamedItem("PositionX").value);
            PositionY = Number(TextureSquareElement.item(i).attributes.getNamedItem("PositionY").value);
            Width = Number(TextureSquareElement.item(i).attributes.getNamedItem("Width").value);
            Height = Number(TextureSquareElement.item(i).attributes.getNamedItem("Height").value);
            Rotation = Number(TextureSquareElement.item(i).attributes.getNamedItem("Rotation").value);
            Color = TextureSquareElement.item(i).attributes.getNamedItem("Color").value.split(" ");
            Texture = TextureSquareElement.item(i).attributes.getNamedItem("Texture").value;
            Square = new TextureRenderComponent(Texture);

            for (var j = 0; j < 4; j++)
                Color[j] = Number(Color[j]);
 
            Square.SetColor(Color);
            Square.GetTransform().SetPosition(PositionX, PositionY);
            Square.GetTransform().SetRotationInDegree(Rotation);
            Square.GetTransform().SetSize(Width, Height);
            sqSet.push(Square);
        }
    }
}