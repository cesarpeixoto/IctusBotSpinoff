
// Vertex Shader que recebe textura


attribute vec3 aSquareVertexPosition;   // Vertex shader posição do vertice
attribute vec2 aTextureCoordinate;      // This UV da textura
varying vec2 vTexCoord; 				// Cordenadas para mapear a imagem na geometria (Quad)

uniform mat4 uModelTransform;			// Suporte para o compornente Transform
uniform mat4 uViewProjTransform;		// Suporte para projeção na Viewport 

void main(void) 
{ 
    gl_Position = uViewProjTransform * uModelTransform * vec4(aSquareVertexPosition, 1.0); 
    vTexCoord = aTextureCoordinate;
}
