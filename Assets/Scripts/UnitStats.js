#pragma strict

var HP : int;
var AttackRange : float;
var AttackDamage : int;
var AttackSpeed : float;

private var AttackCD : float;
private var Attacking : boolean;
private var Target : GameObject;
private var Selected : boolean;
private var SelectRenderer : Renderer;

function OnGUI() {
	// Print HP bar;
}

function Start () {
	Attacking = false;
	AttackCD = 0.0f;
	Selected = false;
	SelectRenderer = transform.Find("Selected").GetComponent(Renderer);
}

function Update () {
	if (AttackCD > 0.0f) AttackCD -= AttackSpeed*Time.deltaTime;
	if (Attacking && Target) {
		var enemydistance : float = Mathf.Abs((transform.position-Target.transform.position).magnitude);
		if (AttackCD <= 0.0f && enemydistance <= AttackRange) {
			Target.SendMessage("DecreaseHP",AttackDamage);
			if(Target.GetComponent(UnitStats).HP <= 0) {
				Attacking = false;
				Destroy(Target);
				Target = null;
			}
		AttackCD = AttackSpeed;
		}
	}
	SelectRenderer.enabled = Selected;	
}

function DecreaseHP(amount : int) {
	HP -= amount;
	print(HP);
}

function BeginAttack(enemy : GameObject) {
	Target = enemy;
	Attacking = true;
}

function SetSelected(b : boolean) {
	Selected = b;
}