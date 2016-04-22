class PacmanBehavior extends Sup.Behavior {
  public spawnPosition: Sup.Math.Vector2;
  public position: Sup.Math.Vector2;

  awake() {
    // Set this actor a global access 
    Global.pacman = this;
  }

  update() {
    
  }
}
Sup.registerBehavior(PacmanBehavior);
