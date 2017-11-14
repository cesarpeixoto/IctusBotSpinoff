var board = [
  ["1bomb", "nil", "nil", "nil", "nil", "nil", "2bomb"],
  ["1sniper", "1tank", "nil", "nil", "nil", "2tank", "2sniper"],
  ["1hero", "1tank", "nil", "nil", "nil", "2tank", "2hero"],
  ["1sniper", "1tank", "nil", "nil", "nil", "2tank", "2sniper"],
  ["1bomb", "nil", "nil", "nil", "nil", "nil", "2bomb"]
];
currentTurn = 1;

function GameSetup() {
  board = [
    ["1bomb", "nil", "nil", "nil", "nil", "nil", "2bomb"],
    ["1sniper", "1tank", "nil", "nil", "nil", "2tank", "2sniper"],
    ["1hero", "1tank", "nil", "nil", "nil", "2tank", "2hero"],
    ["1sniper", "1tank", "nil", "nil", "nil", "2tank", "2sniper"],
    ["1bomb", "nil", "nil", "nil", "nil", "nil", "2bomb"]
  ];
  currentTurn = 1;

  //Fazer as coisas pra dar o estado inicial do jogo
}

//Passe x e y como coordenadas, e unit sendo o valor da célula da matriz board
//Retorna um array de MovementData
function GetMovementPossibilities(x, y, unit){
  switch(unit) {
    case "1bomb":
        var data = MovementPossibilitiesForBomber(x, y, 1);
        return data;
    case "1tank":
        var data = MovementPossibilitiesForTank(x, y, 1);
        return data;
    case "1sniper":
        var data = MovementPossibilitiesForSniper(x, y, 1);
        return data;
    case "1hero":
        var data = MovementPossibilitiesForHero(x, y, 1);
        return data;
    case "2bomb":
        var data = MovementPossibilitiesForBomber(x, y, 2);
        return data;
    case "2tank":
        var data = MovementPossibilitiesForTank(x, y, 2);
        return data;
    case "2sniper":
        var data = MovementPossibilitiesForSniper(x, y, 2);
        return data;
    case "2hero":
        var data = MovementPossibilitiesForHero(x, y, 2);
        return data;
    default:
        return;
  }
}

//fromX,fromY para coordenadas da onde a unidade está; toX, toY para onde vai
//unit a unidade do jeito que tá escrito na matriz
//OBS: passar somente movimentos que vieram do GetMovementPossibilities
//OBS2: ESSA FUNC NAO TRATA MOVIMENTOS INVÁLIDOS
function MoveUnitTo(fromX, fromY, toX, toY, unit){
  board[fromX][fromY] = "nil";
  board[toX][toY] = unit;
}

//Verifica se acabou o jogo
//retorna 0 para não, 1 para vitória do time 1, e 2 para vitória do time 2
//chame depois de toda jogada
function VerifyEndGame(){
  var hero1 = false;
  var hero2 = false;

  for(var i = 0; i < board[0].length; i++){
    for(var j = 0; j < board.length; j++) {
      if(board[i][j] == "1hero"){
        hero1 = true;
      }
      else if(board[i][j] == "2hero"){
        hero2 = true;
      }
    }
  }

  if(hero1 == true && hero2 == true){
    return 0;
  }
  else{
    return hero1 == true ? 2 : 1;
  }
}

//X,y para coordenadas e player 1 ou 2 para saber se pode matar a peça
function MovementPossibilitiesForBomber(x, y, player){
  var possibilitiesArray = [];
  //f
  if(x+1 < board[0].length){
    un = board[x+1][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x+1, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x+1, y, "kill"));
    }
  }

  //ff
  if(x+2 < board[0].length){
    un = board[x+1][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x+2, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x+2, y, "kill"));
    }
  }

  //fff
  if(x+3 < board[0].length){
    un = board[x+1][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x+3, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x+3, y, "kill"));
    }
  }

  //b
  if(x-1 >= 0){
    un = board[x-1][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x-1, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x-1, y, "kill"));
    }
  }

  //bb
  if(x-2 >= 0){
    un = board[x-1][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x-2, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x-2, y, "kill"));
    }
  }

  //bbb
  if(x-1 >= 0){
    un = board[x-1][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x-3, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x-3, y, "kill"));
    }
  }

  //u
  if(y-1 >= 0){
    un = board[x][y-1];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y-1, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y-1, "kill"));
    }
  }



  //d
  if(y+1 < board.length){
    un = board[x][y+1];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y+1, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y+1, "kill"));
    }
  }

  return possibilitiesArray;
}

//X,y para coordenadas e player 1 ou 2 para saber se pode matar a peça
function MovementPossibilitiesForSniper(x, y, player){
  //Movimento único nas 8 direcoes
  //tiro frontal 2,3
  //tiro diagonal 1
  var possibilitiesArray = [];
  //f
  if(x+1 < board[0].length){
    un = board[x+1][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x+1, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x+1, y, "kill"));
    }
  }

  //b
  if(x-1 >= 0){
    un = board[x-1][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x-1, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x-1, y, "kill"));
    }
  }

  //u
  if(y-1 >= 0){
    un = board[x][y-1];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y-1, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y-1, "kill"));
    }
  }

  //uu
  if(y-1 >= 0){
    un = board[x][y-1];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y-2, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y-2, "kill"));
    }
  }

  //uuu
  if(y-1 >= 0){
    un = board[x][y-1];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y-3, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y-3, "kill"));
    }
  }

  //d
  if(y+1 < board.length){
    un = board[x][y+1];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y+1, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y+1, "kill"));
    }
  }

  //dd
  if(y+1 < board.length){
    un = board[x][y+1];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y+1, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y+1, "kill"));
    }
  }

  //ddd
  if(y+3 < board.length){
    un = board[x][y+3];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y+3, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y+3, "kill"));
    }
  }

  return possibilitiesArray;
}

//X,y para coordenadas e player 1 ou 2 para saber se pode matar a peça
function MovementPossibilitiesForTank(x, y, player){
    var possibilitiesArray = new Array();
  //f
  if(x+1 < board[0].length){
    un = board[x+1][y];
    if(un == "nil"){
        possibilitiesArray.push(new MovementData(x + 1, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x+1, y, "kill"));
    }
  }

  //b
  if(x-1 >= 0){
    un = board[x-1][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x-1, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x-1, y, "kill"));
    }
  }

  //u
  if(y-1 >= 0){
    un = board[x][y-1];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y-1, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y-1, "kill"));
    }
  }

  //d
  if(y+1 < board.length){
    un = board[x][y+1];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y+1, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y+1, "kill"));
    }
  }

  return possibilitiesArray;
}

//X,y para coordenadas e player 1 ou 2 para saber se pode matar a peça
function MovementPossibilitiesForHero(x, y, player){
  //Movimento único nas 8 direcoes
  var possibilitiesArray = [];
  //f
  if(x+1 < board[0].length){
    un = board[x+1][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x+1, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x+1, y, "kill"));
    }
  }

  //b
  if(x-1 >= 0){
    un = board[x-1][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x-1, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x-1, y, "kill"));
    }
  }

  //u
  if(y-1 >= 0){
    un = board[x][y-1];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y-1, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y-1, "kill"));
    }
  }

  //d
  if(y+1 < board.length){
    un = board[x][y+1];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y+1, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y+1, "kill"));
    }
  }

  return possibilitiesArray;
}

//Helper para pegar o time da unidade do jeito que ta escrito na matriz (não trato o caso de nao ser nenhum)
function GetTeamFromUnit(unit){
  if(unit.charAt(0) == 1){
    return 1;
  }
  else {
    return 2;
  }

}
