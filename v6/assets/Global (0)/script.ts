// Super Pacman - Game Development Tutorial #5
// Pax Fabrica - Learn creative development while revisiting video game history
// @MichaelSeyne - mseyne.github.io
// Peer Production Licence - Free and open for peers
// Release Version 6 from Tutorial Chapter 6 : Scripting global game behavior

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
}