var board = [
  ["1bomb0", "nil", "nil", "nil", "nil", "nil", "2bomb0"],
  ["1sniper0", "1tank0", "nil", "nil", "nil", "2tank0", "2sniper0"],
  ["1hero", "1tank1", "nil", "nil", "nil", "2tank1", "2hero"],
  ["1sniper1", "1tank2", "nil", "nil", "nil", "2tank2", "2sniper1"],
  ["1bomb1", "nil", "nil", "nil", "nil", "nil", "2bomb1"]
];
currentTurn = 1;

function GameSetup() {
  board = [
    ["1bomb0", "nil", "nil", "nil", "nil", "nil", "2bomb0"],
    ["1sniper0", "1tank0", "nil", "nil", "nil", "2tank0", "2sniper0"],
    ["1hero", "1tank1", "nil", "nil", "nil", "2tank1", "2hero"],
    ["1sniper1", "1tank2", "nil", "nil", "nil", "2tank2", "2sniper1"],
    ["1bomb1", "nil", "nil", "nil", "nil", "nil", "2bomb1"]
  ];
  currentTurn = 1;

  //Fazer as coisas pra dar o estado inicial do jogo
}

//Passe x e y como coordenadas, e unit sendo o valor da célula da matriz board
//Retorna um array de MovementData
function GetMovementPossibilities(x, y, unit) {
  switch(unit) {
    case "1bomb0":
    case "1bomb1":
        var data = MovementPossibilitiesForBomber(x, y, 1);
        return data;
    case "1tank0":
    case "1tank1":
    case "1tank2":
        var data = MovementPossibilitiesForTank(x, y, 1);
        return data;
    case "1sniper0":
    case "1sniper1":
        var data = MovementPossibilitiesForSniper(x, y, 1);
        return data;
    case "1hero":
        var data = MovementPossibilitiesForHero(x, y, 1);
        return data;
    case "2bomb0":
    case "2bomb1":
        var data = MovementPossibilitiesForBomber(x, y, 2);
        return data;
    case "2tank0":
    case "2tank1":
    case "2tank2":
        var data = MovementPossibilitiesForTank(x, y, 2);
        return data;
    case "2sniper0":
    case "2sniper1":
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

  currentTurn = currentTurn == 1 ? 2 : 1;
  VerifyEndGame();
}

//Verifica se acabou o jogo
//retorna 0 para não, 1 para vitória do time 1, e 2 para vitória do time 2
//chame depois de toda jogada
function VerifyEndGame(){
  var hero1 = false;
  var hero2 = false;

  for(var i = 0; i < board.length; i++){
    for(var j = 0; j < board[0].length; j++) {
      if(this.board[i][j] == "1hero"){
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
  if(x+1 < board.length){
    un = board[x+1][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x+1, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x+1, y, "kill"));
    }
  }

  //ff
  if(x+2 < board.length){
    un = board[x+2][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x+2, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x+2, y, "kill"));
    }
  }

  //fff
  if(x+3 < board.length){
    un = board[x+3][y];
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
    un = board[x-2][y];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x-2, y, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x-2, y, "kill"));
    }
  }

  //bbb
  if(x-3 >= 0){
    un = board[x-3][y];
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
  if(y+1 < board[0].length){
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
  if(x+1 < board.length){
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
  if(y-2 >= 0){
    un = board[x][y-2];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y-2, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y-2, "kill"));
    }
  }

  //uuu
  if(y-3 >= 0){
    un = board[x][y-3];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y-3, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y-3, "kill"));
    }
  }

  //d
  if(y+1 < board[0].length){
    un = board[x][y+1];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y+1, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y+1, "kill"));
    }
  }

  //dd
  if(y+2 < board[0].length){
    un = board[x][y+2];
    if(un == "nil"){
      possibilitiesArray.push(new MovementData(x, y+2, "move"));
    }
    else if (GetTeamFromUnit(un) != player){
      possibilitiesArray.push(new MovementData(x, y+2, "kill"));
    }
  }

  //ddd
  if(y+3 < board[0].length){
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
  if(x+1 < board.length){
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
  if(y+1 < board[0].length){
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
  if(x+1 < board.length){
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
  if(y+1 < board[0].length){
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
