"use strict"; 

function Material() 
{
    this.Ka = vec4.fromValues(0.0, 0.0, 0.0, 0);
    this.Ks = vec4.fromValues(0.2, 0.2, 0.2, 1);
    this.Kd = vec4.fromValues(1.0, 1.0, 1.0, 1);
    this.Shininess = 20;
}

Material.prototype.SetAmbient = function (Ambient) { this.Ka = vec4.clone(Ambient); };
Material.prototype.GetAmbient = function () { return this.Ka; };
Material.prototype.SetDiffuse = function (Diffuse) { this.Kd = vec4.clone(Diffuse); };
Material.prototype.GetDiffuse = function () { return this.Kd; };
Material.prototype.SetSpecular = function (Specular) { this.Ks = vec4.clone(Specular); };
Material.prototype.GetSpecular = function () { return this.Ks; };
Material.prototype.SetShininess = function (Shininess) { this.Shininess = Shininess; };
Material.prototype.GetShininess = function () { return this.Shininess; };