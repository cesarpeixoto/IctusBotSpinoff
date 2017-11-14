// Vertex Fragment que recebe textura

precision mediump float; 			// Seta precisão do float
uniform sampler2D uSampler;			// Amostra da textura
uniform vec4 uPixelColor;  			// Cor do pixel
varying vec2 vTexCoord;				// Para interpolação da UV

uniform vec4 uGlobalAmbientColor; 
uniform float uGlobalAmbientIntensity;

void main(void)  
{
    vec4 c = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    c = c * uGlobalAmbientIntensity * uGlobalAmbientColor;    
    vec3 r = vec3(c) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(r, c.a);

    gl_FragColor = result;	
}