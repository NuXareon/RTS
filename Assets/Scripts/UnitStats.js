#pragma strict

var HP : int;
var AttackRange : float;
var AttackDamage : int;
var AttackSpeed : float;

private var AttackCD : float;
private var Attacking : boolean;
private var Target : GameObject;

function OnGUI() {
	// Print HP bar;
}

function Start () {
	Attacking = false;
	AttackCD = 0.0f;
}

function Update () {
	if (AttackCD > 0.0f) AttackCD -= AttackSpeed*Time.deltaTime;
	if (Attacking && Target) {
		if (AttackCD <= 0.0f) {
			Target.SendMessage("DecreaseHP",AttackDamage);
			if(Target.GetComponent(UnitStats).HP <= 0) {
				Attacking = false;
				Destroy(Target);
				Target = null;
			}
		AttackCD = AttackSpeed;
		}
	}
}

function DecreaseHP(amount : int) {
	HP -= amount;
	print(HP);
}

function BeginAttack(enemy : GameObject) {
	Target = enemy;
	Attacking = true;
}