precision mediump float;

uniform sampler2D uSampler;
uniform vec4 uPixelColor;

varying vec2 vTexCoord;

#define kSufficientlyOpaque 0.1

void main(void)
{
    vec4 texFragColor = texture2D(uSampler, vTexCoord);
    if (texFragColor.a < kSufficientlyOpaque)
        discard;
    else
       gl_FragColor = vec4(1, 1, 1, 1);
    
}