precision mediump float; 
    
uniform sampler2D uSampler;
uniform sampler2D uNormalSampler;
uniform vec4 uPixelColor;  
uniform vec4 uGlobalAmbientColor; 
uniform float uGlobalAmbientIntensity;



uniform vec3 uCameraPosition; 

struct Material {
    vec4 Ka;    // Cor
    vec4 Kd;    // Difuso
    vec4 Ks;    // Specular
    float Shininess; // "n"
};

uniform Material uMaterial;

#define kGLSLuLightArraySize 4   // Precisar ser igual no lightshader do render!

// Precisar ser igual no LightObject!

#define ePointLight       0
#define eDirectionalLight 1
#define eSpotLight        2


struct Light  {
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

uniform Light uLights[kGLSLuLightArraySize];  
varying vec2 vTexCoord;


float AngularDropOff(Light lgt, vec3 lgtDir, vec3 L) 
{
    float atten = 0.0;
    float cosL = dot(lgtDir, L);
    float num = cosL - lgt.CosOuter;
    if (num > 0.0) 
    {
        if (cosL > lgt.CosInner) 
        {
            atten = 1.0;
        }
        else 
        {
            float denom = lgt.CosInner - lgt.CosOuter;
            atten = smoothstep(0.0, 1.0, pow(num/denom, lgt.DropOff));
        }
    }
    return atten;
}

float DistanceDropOff(Light lgt, float dist) 
{
    float atten = 0.0;
    if (dist <= lgt.Far) 
    {
        if (dist <= lgt.Near)
        {
            atten = 1.0;
        }
        else 
        {            
            float n = dist - lgt.Near;
            float d = lgt.Far - lgt.Near;
            atten = smoothstep(0.0, 1.0, 1.0-(n*n)/(d*d));
        }   
    }
    return atten;
}

vec4 SpecularResult(vec3 N, vec3 L) 
{
    vec3 V = normalize(uCameraPosition - gl_FragCoord.xyz);
    vec3 H = (L + V) * 0.5;
    return uMaterial.Ks * pow(max(0.0, dot(N, H)), uMaterial.Shininess);
}

vec4 DiffuseResult(vec3 N, vec3 L, vec4 textureMapColor) 
{
    return uMaterial.Kd * max(0.0, dot(N, L)) * textureMapColor;
}

vec4 ShadedResult(Light lgt, vec3 N, vec4 textureMapColor) 
{
    float aAtten = 1.0, dAtten = 1.0;
    vec3 lgtDir = -normalize(lgt.Direction.xyz);
    vec3 L; // light vector
    float dist; // distant to light
    if (lgt.LightType == eDirectionalLight) 
    {
        L = lgtDir;
    } 
    else 
    {
        L = lgt.Position.xyz - gl_FragCoord.xyz;
        dist = length(L);
        L = L / dist;
    }
    if (lgt.LightType == eSpotLight) 
    {
        aAtten = AngularDropOff(lgt, lgtDir, L);
    }
    if (lgt.LightType != eDirectionalLight) 
    {
        dAtten = DistanceDropOff(lgt, dist);
    }

    vec4  diffuse = DiffuseResult(N, L, textureMapColor);
    vec4  specular = SpecularResult(N, L);
    vec4 result = aAtten * dAtten * lgt.Intensity * lgt.Color * (diffuse + specular);

    return result;
}

void main(void)  
{
    vec4 textureMapColor = texture2D(uSampler, vTexCoord);
    vec4 normal = texture2D(uNormalSampler, vTexCoord);
    vec4 normalMap = (2.0 * normal) - 1.0;
    
    vec3 N = normalize(normalMap.xyz);
   
    vec4 shadedResult = uMaterial.Ka + (textureMapColor  * uGlobalAmbientColor * uGlobalAmbientIntensity);

    if (textureMapColor.a > 0.0) 
    {
        for (int i=0; i<kGLSLuLightArraySize; i++) 
        { 
            if (uLights[i].IsOn) 
            { 
                shadedResult += ShadedResult(uLights[i], N, textureMapColor);
            }
        }
    }

    vec3 tintResult = vec3(shadedResult) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(tintResult, textureMapColor.a);

    gl_FragColor = result;
}