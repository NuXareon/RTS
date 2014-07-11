#pragma strict

var maxHP : int;
var AttackRange : float;
var AttackDamage : int;
var AttackSpeed : float;
private var AttackMove : boolean;
var SightRange : float;
var HealthBarStyle : GUIStyle;
var HealthBarStyleHP : GUIStyle;
var HealthBarStyleBG : GUIStyle;
var ExplosionParticles : Transform;

private var HP : int;
private var AttackCD : float;
private var Attacking : boolean;
private var Target : GameObject;
private var Selected : boolean;
private var isTargeted : boolean;
private var SelectRenderer : Renderer;
private var RangeRenderer : Renderer;
private var TargetedRenderer : Renderer;

function OnGUI() {
	var targetScreenPos = Camera.main.WorldToScreenPoint (transform.position);
	var targetScreenPosUp = Camera.main.WorldToScreenPoint (transform.position+Vector3(0,15,0));
	GUI.Box(Rect(targetScreenPos.x-20,Screen.height-targetScreenPosUp.y,40,0),"",HealthBarStyleBG);
	GUI.Box(Rect(targetScreenPos.x-20,Screen.height-targetScreenPosUp.y,40,0),"",HealthBarStyle);
	GUI.Box(Rect(targetScreenPos.x-20,Screen.height-targetScreenPosUp.y,40*HP/maxHP,0),"",HealthBarStyleHP);
}

function Start () {
	HP = maxHP;
	Attacking = false;
	AttackCD = 0.0f;
	Selected = false;
	isTargeted = false;
	AttackMove = false;
	SelectRenderer = transform.Find("Selected").GetComponent(Renderer);
	RangeRenderer = transform.Find("Range").GetComponent(Renderer);
	TargetedRenderer = transform.Find("Target").GetComponent(Renderer);
}

function Update () {
	if (AttackCD > 0.0f) AttackCD -= Time.deltaTime;
	if (Attacking && Target) {
		var enemydistance : float = Mathf.Abs((transform.position-Target.transform.position).magnitude);
		if (AttackCD <= 0.0f && enemydistance <= AttackRange) {
			Target.SendMessage("DecreaseHP",AttackDamage);
			if (Target.GetComponent(IA)) {
				Target.SendMessage("Attacked", gameObject);
			}
			if(Target.GetComponent(UnitStats).HP <= 0) {
				Instantiate(ExplosionParticles,Target.transform.position+Vector3(0,3,0),Target.transform.rotation);
				Target.SendMessage("StopAttack");
				Destroy(Target);
				StopAttack();
			}
		AttackCD = AttackSpeed;
		}
	}
	if (AttackMove) SeekTarget();
	SelectRenderer.enabled = Selected;
	RangeRenderer.enabled = Selected;
	TargetedRenderer.enabled = isTargeted;
}

function DecreaseHP(amount : int) {
	HP -= amount;
}

function BeginAttack(enemy : GameObject) {
	if (Target) Target.SendMessage("Targeted", false);
	Target = enemy;
	Target.SendMessage("Targeted", true);
	Attacking = true;
}

function StopAttack() {
	if (Target) {
		Target.SendMessage("Targeted", false);
		Target = null;
	}
	Attacking = false;
}

function SeekTarget() {
	if (!hasTarget()) {
		var units : GameObject[] = GameObject.FindGameObjectsWithTag("Enemy");
		for (unit in units) {
			if ((unit.transform.position-transform.position).magnitude <= AttackRange) {
				BeginAttack(unit);
			}
		}
	}
}

function SetSelected(b : boolean) {
	Selected = b;
}

function Targeted(b : boolean) {
	isTargeted = b;
}

function hasTarget() : boolean {
	return Target!=null;
}

function getTarget() : GameObject {
	return Target;
}

function setTarget(t : GameObject) {
	Target = t;
}

function setAttackMove(b : boolean) {
	AttackMove = b;
}