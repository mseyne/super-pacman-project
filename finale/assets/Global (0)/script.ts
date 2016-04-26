// Super Pacman - Game Development Tutorial #5
// Pax Fabrica - Learn creative development while revisiting video game history
// @MichaelSeyne - mseyne.github.io
// Peer Production Licence - Free and open for peers
// Release Version Finale

// This variable will be used to open a web url in a new window, it is not directly related to the game logic
declare var window;

// A global module
namespace Global {
  
  // points for each objects the pacman can eat
  export enum points {
        coin = 10,
        bigcoin = 50,
        fruit = 100,
        ghost = 200
       }
  
  // keyboard's keys the player will use in the game
  export const keys = {
        left: "LEFT",
        right: "RIGHT",
        up: "UP",
        down: "DOWN",
        space: "SPACE",
        exit: "ESCAPE"
       }
  
  // name of the menu screens
  export const menuScreens = {
    start: "Start",
    levels: "Levels",
    end: "End"
  }
  
  // number of coins small and big
  export let coins = {
        small: 0,
        big: 0
       }
  
  // list of all the coins in game, small and big
  export let coinsList = {
        small: [],
        big: []
       }
  
  // starting life
  export const lifesMax:number = 3;
  // life order indicator for HUD
  export const lifesOrder:boolean[][] = [[false, false, false], [true, false, false], [true, true, false]]
  
  // the game behavior
  export let game:GameBehavior;
  // the game HUD (game information displayed)
  export let HUD:Sup.Actor;
  // the pacman behavior
  export let pacman:PacmanBehavior;
  // the ghosts behavior in a list
  export let ghosts:GhostBehavior[];
  // the fruits behavior in a list
  export let fruits:FruitsBehavior[];
  // the game time
  export let time:string;
  // the game score
  export let score: number;
  // level chosen to play
  export let currentLevel:string;
  // boolean flag if the game is won or not
  export let won:boolean;
  // number of frame the game stay blocked before continue
  export let freeze: number;
  
  // the current pacman lifes
  export let pacmanLifes: number;
  // number of coins eaten
  export let coinsEatens: number;
  // number of ghosts eaten
  export let ghostsEaten:number;
  // number of fruits eaten
  export let fruitsEaten:number;
  // fruits status, each position in list is a fruit, if false the fruit is not eaten
  export let fruitsEatenByIndex: boolean[] = [false, false, false, false, false];
  
  
  // fruits positions in the level
  export let fruitsRandomPositions:Sup.Math.Vector2[];
  // current available fruits positions in the level
  export let fruitsAvailablePositions:Sup.Math.Vector2[];
  
  export function startNewGame(){
    // Set datas to default    
    won = undefined;
    ghosts = [];
    coins.small = 0;
    coins.big = 0;
    coinsList.small = [];
    coinsList.big = [];
    fruits = [];
    fruitsRandomPositions = [];
    fruitsAvailablePositions = [];
    fruitsEatenByIndex = [false, false, false, false, false];
    score = 0;
    fruitsEaten = 0;
    ghostsEaten = 0;
    coinsEatens = 0;
    // Start life
    pacmanLifes = lifesMax;
    
    // Freeze the game for 300 frames before to start
    freeze = 300;
    
    Sup.Audio.playSound("Sounds/Music");
    
    // Load the game scene (leave the menu scene)
    Sup.loadScene("Game/Scene");
    // Get the HUD actor for global access
    HUD = Sup.getActor("HUD");
    // Set the current level Tile Map
    Sup.getActor("Level").tileMapRenderer.setTileMap("Levels/"+currentLevel+"/Tile Map");
  }
}


namespace Level {
  // All the different level names  
  export const levels = {
               1:"Level1",
               2:"Level2",
               3:"Level3",
               4:"Level4",
               5:"Level5",
               6:"Level6"
              }
  
  // The differents layers of the tile map for each level
  export enum layers {
        positions = 0,
        backgroung = 1,
        walls = 2
       }
  
  // Size of level per unit of 16 pixels
  export enum size {
        width = 26,
        height = 32 
       }
  
  // Tile set references of the game objects
  export enum tiles {
        smallcoin = 63,
        bigcoin = 64,
        fruits = 65,
        ghost = 66,
        pacman = 67
       }
  
  // End statistics of the game
  export const endStats = ["Score", "Time", "Ghosts", "Coins", "Fruits", "Lifes"];
  
  export function set(){
    // Call all the Level functions once 
    setPacman();
    setGhosts();
    setCoins();
    getFruitsRandomPositions();
  }
  
  // function that check all the tile from the tile map and return the position of the searched tile
  function checkMap(layer:number, tile:number){
    // Loop the number of unit there is on width size
    for(let x = 0; x < size.width; x++){
      // Loop the number of unit there is on height size
      for(let y = 0; y < size.height; y++){
        // Check if the tile in x and y is the tiled looked for
        if(Global.game.tileMap.getTileAt(layer, x, y) === tile){
          // if yes, return the position as a new Vector2
          return new Sup.Math.Vector2(x, y);
        }
      }
    }
  }
  
  // function that get the start position of pacman on the map
  function setPacman(){
    // Call the checkMap function and set the returned position to the variable
    let spawnPosition = checkMap(layers.positions, tiles.pacman);
    // Give to the pacman actor the spawnposition of this level (constant)
    Global.pacman.spawnPosition = spawnPosition;
    // Copy this position for the current position (variable)
    Global.pacman.position = spawnPosition.clone();
  }
  
  // function that get the start ghost positions on the map
  function setGhosts(){
    // Index of ghosts, start with the first
    let ghostIndex: number = 0;
    // Loop through all the tile set
    for(let x = 0; x < size.width; x++){
      for(let y = 0; y < size.height; y++){
        // If the current tile x, y is a ghost start position tile
        if(Global.game.tileMap.getTileAt(layers.positions, x, y) === tiles.ghost){
            // If yes, create a new Vector 2 with the position of the tile
            let spawnPosition = new Sup.Math.Vector2(x, y)
            // Give the position to the current ghost Actor as the spawnPosition and the current position
            Global.ghosts[ghostIndex].spawnPosition = spawnPosition;
            Global.ghosts[ghostIndex].position = spawnPosition.clone();
            // Change ghost index to prepare the next one
            ghostIndex++
        }
      }
    }
  }
  
  function setCoins(){
    // Loop to check all the tile positions from the Tile Map
    for(let x = 0; x < size.width; x++){
      for(let y = 0; y < size.height; y++){
        // If the tile is a fruit or a small coin, add a small coin actor
        if(Global.game.tileMap.getTileAt(layers.positions, x, y) === tiles.smallcoin ||
        Global.game.tileMap.getTileAt(layers.positions, x, y) === tiles.fruits){
          // Add a coin to the total count
          Global.coins.small++
          // Create a new actor
          let coin = new Sup.Actor("smallCoin");
          // Set X and Y position to the actor and a Z position to 10
          coin.setPosition(x, y, 10);
          // Set a new component Sprite renderer to the actor with the smallCoin sprite
          new Sup.SpriteRenderer(coin, "Items/Coins/Small");
          // Add the actor to the list of small coins
          Global.coinsList.small.push(coin);
        }
        // If the tile is a big coin, add a big coin actor
        else if(Global.game.tileMap.getTileAt(layers.positions, x, y) === tiles.bigcoin){
          // Add a coin to the total count
          Global.coins.big++
          // Create a new actor
          let coin = new Sup.Actor("bigCoin");
          // Set X and Y position to the actor and a Z position to 10
          coin.setPosition(x, y, 10);
          // Set a new component Sprite renderer to the actor with the bigCoin sprite
          new Sup.SpriteRenderer(coin, "Items/Coins/Big");
          // Add the actor to the list of big coins
          Global.coinsList.big.push(coin);
        }
      }
    }
  }
  

  function getFruitsRandomPositions(){
    // Check all the tile positions from the tile map
    for(let x = 0; x < size.width; x++){
      for(let y = 0; y < size.height; y++){
       // if the tile checked is a fruit tile, add it to the fruitsRandomPositions list
       if(Global.game.tileMap.getTileAt(layers.positions, x, y) === tiles.fruits){
         Global.fruitsRandomPositions.push(new Sup.Math.Vector2(x, y));
       }
      }
    }
  }
}
