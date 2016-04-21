class GameBehavior extends Sup.Behavior {
  // We initialize the tile map
  public tileMap: Sup.TileMap;
  // We initialize locally the timer variable
  private time: number; private second: number; private minute: number;

  start() {
    // We set the game behavior globally
    Global.game = this;
    //  We reset the game timer globally and locally
    Global.time = "0"; this.time = 0; this.second = 0; this.minute = 0;
    // We set the tilemap to the current game level
    this.tileMap = Sup.getActor("Level").tileMapRenderer.getTileMap();
    // We prepare the level with the function Level.set()
    Level.set();
  }

  updateScore(points:number){
        // Add the points to the game score
        Global.score += points;
        // Update the HUD score display
        Global.HUD.getChild("Score").textRenderer.setText("SCORE:"+Global.score.toString());
  }

  displayNewScore(position:Sup.Math.Vector3, points:number){
      // Create a new actor score
      let score = new Sup.Actor("score");
      // Add a new component text renderer to the actor with the points as text
      new Sup.TextRenderer(score, points.toString());
      // Add the font Font to the component text renderer
      score.textRenderer.setFont("Font");
      // Give the current position to the score (+0.5 to adapt to the centered origin)
      score.setPosition(position.x+0.5, position.y+0.5, position.z);
      // Destroy the actor score after 1 second
      Sup.setTimeout(1000, function(){score.destroy();});
    }

  updateLife(){
      // Loop the number of maximum lifes the pacman got (3 times) and give the current value to index
      for (let index = 0; index < Global.lifesMax; index++){
        // Get the sprite Renderer component from HUD/Lifes/index actor
        let sprite = Global.HUD.getChild("Lifes").getChild(index.toString()).spriteRenderer;
        // Check the boolean flag from the lifesOrder pattern of the pacman current lifes and current index
        if(Global.lifesOrder[Global.pacmanLifes][index] === true){
          // If the flag is true, set the sprite animation to full
          sprite.setAnimation("full", false);
        }
        else{
          // If the flag is false, set the sprite animation to empty
          sprite.setAnimation("empty", false);
        }
      }
    }

  updateTimer(){
    // convert minute and second to string and set them to variables
    let minute = this.minute.toString(); let second = this.second.toString();
    // If the minutes or seconds are inferior to 10, then add a 0 to the string to keep display consistency 
    if (this.minute < 10){
      minute = "0"+minute;
    }
    if (this.second < 10){
      second = "0"+second;
    }
    // Build the complete string for the current time
    Global.time = minute+':'+second;
    // Display it with the HUD/Timer text renderer
    Global.HUD.getChild('Timer').textRenderer.setText("TIME : "+Global.time);
  }  

  update() {
    // If the freeze counter is on, decrease it from 1 and return to pass the block and repeat 
    if(Global.freeze > 0){
      Global.freeze--
      return;
    }
    
    // Check if the game is won or not (when the Global.won is not undefined anymore)
    if(Global.won === false || Global.won === true){
      // Load the menu scene and destroy the game scene
      Sup.loadScene("Menu/Scene");
      // Call the function that will load the victory or gameover end screen
      Sup.getActor("Menu").getBehavior(MenuBehavior).setEndscreen();
    }
    
    // Increase the game timer by one
    this.time++;
    // When the time got 60 frames add 1 second (the game is default set as 60 frames = 1 second)
    if(this.time%60 === 0){
      this.second++;
      // When the second is 60, add 1 minute and reset second to 0 
      if(this.second%60 === 0){
        this.minute++; this.second = 0;
      }
      // Call the updateTimer method every second
      this.updateTimer();
    }
    
    // Check if the exit key is pressed
    if(Sup.Input.wasKeyJustPressed(Global.keys.exit)){
      // If yes, load the menu scene and destroy the game scene
      Sup.loadScene("Menu/Scene");
    }
    
    // Check if there is still coins left, if not, the game is won
    if(Global.coins.small === 0 && Global.coins.big === 0){
      // Set the won flag to true
      Global.won = true;
      // Set frames number freeze counter
      Global.freeze = 100;
    }
    
    // Check if there is still lifes for pacman, if not, the game is lost
    if (Global.pacmanLifes === 0){
      // Set the won flag to false
      Global.won = false;
    }
  }
}
Sup.registerBehavior(GameBehavior);
