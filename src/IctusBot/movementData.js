
//Struct para definir possiveis movimentos.
//x e y são as cordenadas, e action é o que é possível fazer nesssa coordenada
//sendo os valores: move ou kill
function MovementData(x, y, action)
{
  this.x = x;
  this.y = y;
  this.action = action;
}
