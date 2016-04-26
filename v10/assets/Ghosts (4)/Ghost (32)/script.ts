class GhostBehavior extends Sup.Behavior {
  // The starting position of the ghost (in jail)
  public spawnPosition: Sup.Math.Vector2;
  // The current position of this ghost
  public position: Sup.Math.Vector2;
  // Timer before being free to leave the jail
  private freedomCoolDown: number;
  // The current moving direction of this ghost
  private moveDirection: string;
  // Flag checking if the jail door is open for this ghost
  private doorOpen: boolean;
  // If the ghost have vulnerability
  private vulnerable: boolean;
  // Timer before the ghost loose vulnerability
  private vulnerabilityCooldown: number;

  awake() {
    // add this behavior to the ghosts list
    Global.ghosts.push(this);
    // close the door of the jail
    this.doorOpen = false;
    // Choose a random time before to be free from jail
    this.freedomCoolDown = Sup.Math.Random.integer(50, 300);
    // We start not vulnerable
    this.vulnerable = false;
  }
  
  start(){
    // Set the current position of this actor
    this.actor.setPosition(this.position);
    // Multiply the current position by 100 to work only with integer an not float number
    this.position.multiplyScalar(100);
  }

  setVulnerabilityOn(){
    this.vulnerable = true;
    // Timer before to loose vulnerability
    this.vulnerabilityCooldown = 500;
    // Set the ghost sprite of vulnerability
    this.actor.spriteRenderer.setSprite("Ghosts/Vulnerable");
  }

  setVulnerabilityOff(){
    this.vulnerable = false;
    // Change back sprite to normal
    this.actor.spriteRenderer.setSprite("Ghosts/Ghost"+this.actor.getName());
  }

  leaveJail(){
      // Check the tile Up and tile Down of the current position
      let tileUp = this.position.y/100 + 1;
      let tileDown = this.position.y/100 - 1;
      // If the tile up or down of the ghost is a door, then go on this tile and get out
      if(Global.game.tileMap.getTileAt(Level.layers.walls, this.position.x / 100, tileUp) === 54) this.moveDirection = "UP";
      else if(Global.game.tileMap.getTileAt(Level.layers.walls, this.position.x / 100, tileDown) === 58) this.moveDirection = "DOWN";
  }

  goToJail(){
    // Set the position of the ghost to the starting position
    this.position = this.spawnPosition.clone();
    // Then set the new position to the ghost actor
    this.actor.setPosition(this.position);
    // Stop the movement direction
    this.moveDirection = "";
    // Close the door of the jail
    this.doorOpen = false;
    // Multiply the new position to 100 to use them anew in the script
    this.position.multiplyScalar(100);
  }

  eaten(){
    // Set the timer before to be free again
    this.freedomCoolDown = 600;
    // Update the score of the player with ghost points
    Global.game.updateScore(Global.points.ghost);
    // Display the new points to the current ghost position
    Global.game.displayNewScore(this.actor.getPosition(), Global.points.ghost);
    // Add statistic, number of ghost eaten in total
    Global.ghostsEaten++;
    // Return this ghost to jail
    this.goToJail();
  }

  canMove(moveX:number, moveY:number){
    // get the tiles x and y for the next tile of the current position and direction
    let tileX = this.position.x/100 + moveX;
    let tileY = this.position.y/100 + moveY;
    // If the next tile is not a wall, return true 
    if(Global.game.tileMap.getTileAt(Level.layers.walls,tileX, tileY) === -1){
      return true;
    }
    // else return false
    return false;
  }

  chooseDirection(){
    // Initialize a new list of possible directions
    let availableDirections:string[] = [];
    
    /*
    - Check if the next tile is free to go in all chooseDirection
    - Return false, if the direction checked is the one from which the ghost come from
    - If it is possible to move on the next tile and the ghost don't come from this direction, add the direction to the list.
    */
    if(this.canMove(1, 0) && this.moveDirection !== "LEFT"){
      availableDirections.push("RIGHT");
    }
    if(this.canMove(-1, 0) && this.moveDirection !== "RIGHT"){
      availableDirections.push("LEFT");
    }
    if(this.canMove(0, 1) && this.moveDirection !== "DOWN"){
      availableDirections.push("UP");
    }
    if(this.canMove(0, -1) && this.moveDirection !== "UP"){
      availableDirections.push("DOWN");
    }
    // then choose randomly a new direction from the list
    this.moveDirection = Sup.Math.Random.sample(availableDirections);
    // Don't change animation if movement is undefined (in the case the ghost is stuck and have to go back)
    if (this.moveDirection === undefined) return;
    // Set the new walk animation now related to the new direction
    this.actor.spriteRenderer.setAnimation("go"+this.moveDirection);
  }

  update() {
    // Skip the loop if the freeze timer is on
    if(Global.freeze > 0){
      return;
    }
    
    // Stay in jail as long as the freedom timer is on
    if(this.freedomCoolDown > 0){
      // When the timer reach 1
      if(this.freedomCoolDown === 1){
        // Open the door and set off vulnerability
        this.doorOpen = true;
        this.setVulnerabilityOff();
      }
      // Decrease by one each frame
      this.freedomCoolDown--
    }
    
    // Keep moving in the current direction
    if(this.moveDirection === "RIGHT"){
      this.position.x += 5;
    }
    if(this.moveDirection === "LEFT"){
      this.position.x -= 5;
    }
    if(this.moveDirection === "UP"){
      this.position.y += 5;
    }
    if(this.moveDirection === "DOWN"){
      this.position.y -= 5;
    }
    
    // Check if the ghost change direction when centered in the grid
    if(this.position.x%100 === 0 && this.position.y%100 === 0){
      this.chooseDirection();
      // If the door is open, leave the jail
      if(this.doorOpen){
        this.leaveJail();
      }
    }
        
    /*
    - check if there is a contact with the pacman    
    - if contact, something different happen according to the ghost vulnerability
    - if the distance between the pacman and the ghost is inferior to half the size of a case
    */
    if (Math.abs(this.position.x/10 - Global.pacman.position.x) < 5 && Math.abs(this.position.y/10 - Global.pacman.position.y) < 5){
      // if the ghost is vulnerable
      if(this.vulnerable){
        // The ghost is eaten
        this.eaten();
        // The game freeze for 20 frames
        Global.freeze = 20;
      }
      // if the ghost is not vulnerable
      if(!this.vulnerable){
        // the pacman die
        Global.pacman.die();
        // All the ghosts return to jail
        // Loop through the ghosts list
        for(let ghost of Global.ghosts){
          // Call the method to send the ghost in jail
          ghost.goToJail();
          // Set a timer before being free from jail
          ghost.freedomCoolDown = Sup.Math.Random.integer(200, 400);
        }
        // The game freeze for 200 frames
        Global.freeze = 200;
      }
    }
    
    // If vulnerable, decrease by one cooldown timer
    if (this.vulnerable){
      this.vulnerabilityCooldown--;
      // If the timer is inferior to 150 frames, start actor blinking
      if (this.vulnerabilityCooldown < 150){
        // blinking magic :)
        if (this.vulnerabilityCooldown % 40 < 8 && this.vulnerabilityCooldown % 40 > -8){
          // Set the sprite animation blink
          this.actor.spriteRenderer.setAnimation("blink");
        }
      }
      // If the timer reach 1, set off the vulnerability
      if (this.vulnerabilityCooldown === 1) {
        this.setVulnerabilityOff();
      }
    }
    
    // Stay in the maze when go out of the screen
    if(this.position.x < 0) {
      this.position.x = (Level.size.width-1) * 100;
    }
    if(this.position.x > (Level.size.width-1) * 100) {
      this.position.x = 0;
    }
    
    // Update ghost actor position
    this.actor.setPosition(this.position.x / 100, this.position.y / 100);
  }
}
Sup.registerBehavior(GhostBehavior);
