// Fragment Shader simples... 

precision mediump float; 

uniform vec4 uPixelColor;  
uniform vec4 uGlobalAmbientColor;  
uniform float uGlobalAmbientIntensity;  

void main(void)  
{
    gl_FragColor = uPixelColor * uGlobalAmbientIntensity * uGlobalAmbientColor;
}