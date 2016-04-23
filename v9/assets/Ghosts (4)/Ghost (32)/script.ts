class GhostBehavior extends Sup.Behavior {
  public spawnPosition: Sup.Math.Vector2;
  public position: Sup.Math.Vector2;

  awake() {
    Global.ghosts.push(this);
  }

  setVulnerabilityOn(){}

  update() {
    
  }
}
Sup.registerBehavior(GhostBehavior);
