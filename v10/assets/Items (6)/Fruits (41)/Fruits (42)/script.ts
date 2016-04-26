
class FruitsBehavior extends Sup.Behavior {
  // Position of the fruit
  public position: Sup.Math.Vector2;
  // Flag check if fruit have spawned or not
  private spawn: boolean;
  // Timer before to spawn
  private spawnCooldown: number;
  // Fruit number and name
  private name: string;
  // Previous fruit number and name
  private previousFruit: number;

  awake() {
    // Add this fruit to the fruits list
    Global.fruits.push(this);
    // Set this fruit as not spawned
    this.spawn = false;
    // Store the name of this fruit (a number)
    this.name = this.actor.getName();
    // Get the name of the previous fruit before this one (integral number - 1)
    this.previousFruit = parseInt(this.name) - 1;
    // Get the position of the actor
    this.position = this.actor.getPosition().toVector2();
  }

  startSpawn(){
    // Set spawn flag as true
    this.spawn = true;
    // Set timer before spawn
    this.spawnCooldown = 500;
  }
  
  setPosition(){
    // Get a random position from available positions
    this.position = Sup.Math.Random.sample(Global.fruitsAvailablePositions);
    // Set the position to the actor
    this.actor.setPosition(this.position);
  }

  eaten(){
    // Add points to the player
    Global.game.updateScore(Global.points.fruit);
    // Display the point to the current position
    Global.game.displayNewScore(this.actor.getPosition(), Global.points.fruit);
    // Set true, as the fruit eaten status
    Global.fruitsEatenByIndex[parseInt(this.name)] = true;
    // Add 1 to total fruits eaten
    Global.fruitsEaten++;
    // Destroy this actor
    this.actor.destroy();
  }

  update() {
    // if this fruits have not spawn and if there is an available positions
    if (this.spawn === false && Global.fruitsAvailablePositions.length > 0 ){
      // If there is no previous fruit before this one
      if (this.previousFruit === -1){
        // Call the method to start to spawn
        this.startSpawn();
      }
      // Else, check if the previous fruit have already been eaten
      else if(Global.fruitsEatenByIndex[this.previousFruit] === true){
        // If yes, call the method to start to spawn
        this.startSpawn();
      }
    }
    
    // If the spawn flag is true
    if (this.spawn === true){
      // Decrease spawn cooldown by one
      this.spawnCooldown--
      if(this.spawnCooldown === 1){
      // when timer is 1, spawn actor to an available position in the maze
      this.setPosition();
      }
    }
  }
}
Sup.registerBehavior(FruitsBehavior);