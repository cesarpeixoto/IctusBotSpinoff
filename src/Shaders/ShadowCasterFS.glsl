precision mediump float;

uniform sampler2D uSampler;
uniform vec4 uPixelColor;

#define kMaxShadowOpacity 0.7  
#define kLightStrengthCutOff 0.05 

#define ePointLight       0
#define eDirectionalLight 1
#define eSpotLight        2

struct Light  
{
    vec3 Position;  
    vec3 Direction; 
    vec4 Color;
    float Near;
    float Far;
    float CosInner; 
    float CosOuter; 
    float Intensity;
    float DropOff;  
    bool  IsOn;
    int LightType;  
};
uniform Light uLights[1]; 

varying vec2 vTexCoord;

float AngularDropOff(vec3 lgtDir, vec3 L) 
{
    float atten = 0.0;
    float cosL = dot(lgtDir, L);
    float num = cosL - uLights[0].CosOuter;
    if (num > 0.0) {
        if (cosL > uLights[0].CosInner) 
		{
            atten = 1.0;
		}
        else 
		{
            float denom = uLights[0].CosInner - uLights[0].CosOuter;
            atten = smoothstep(0.0, 1.0, pow(num/denom, uLights[0].DropOff));
        }
    }
    return atten;
}

float DistanceDropOff(float dist) 
{
    float atten = 0.0;
    if (dist <= uLights[0].Far) 
	{
        if (dist <= uLights[0].Near)
		{
            atten = 1.0;
		}
        else 
		{
            float n = dist - uLights[0].Near;
            float d = uLights[0].Far - uLights[0].Near;
            atten = smoothstep(0.0, 1.0, 1.0-(n*n)/(d*d));
        }   
    }
    return atten;
}

float LightStrength() 
{
    float aAtten = 1.0, dAtten = 1.0;
    vec3 lgtDir = -normalize(uLights[0].Direction.xyz);
    vec3 L; 
    float dist; 
    if (uLights[0].LightType == eDirectionalLight) 
	{
        L = lgtDir;
    } else 
	{
        L = uLights[0].Position.xyz - gl_FragCoord.xyz;
        dist = length(L);
        L = L / dist;
    }
    if (uLights[0].LightType == eSpotLight) 
	{
        aAtten = AngularDropOff(lgtDir, L);
    }
    if (uLights[0].LightType != eDirectionalLight) 
	{
        dAtten = DistanceDropOff(dist);
    }
    float result = aAtten * dAtten;
    return result;
}

void main(void)
{
    vec4 texFragColor = texture2D(uSampler, vTexCoord);
    float lgtStrength = LightStrength();
    if (lgtStrength < kLightStrengthCutOff)
        discard;
    vec3 shadowColor = lgtStrength * uPixelColor.rgb;
    shadowColor *= uPixelColor.a * texFragColor.a;
    gl_FragColor = vec4(shadowColor,  kMaxShadowOpacity * lgtStrength * texFragColor.a);
}