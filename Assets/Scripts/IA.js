#pragma strict

private var Stats : UnitStats;
private var Controll : UnitControll;
private var isAttacked : boolean;

function Start () {
	Stats = GetComponent(UnitStats);
	Controll = GetComponent(UnitControll);
	isAttacked = false;
}

function Update () {
	if (!Stats.hasTarget()) {
		var units : GameObject[] = GameObject.FindGameObjectsWithTag("Unit");
		for (unit in units) {
			if ((unit.transform.position-transform.position).magnitude <= Stats.SightRange) {
				Controll.Move(unit.transform.position);
				Stats.BeginAttack(unit);
			}
		}
	} else {
		var mult : int = isAttacked ? 2 : 1;
		if ((Stats.getTarget().transform.position-transform.position).magnitude > Stats.SightRange*mult) {
			Stats.StopAttack();
			Controll.Move(transform.position);
			isAttacked = false;
		} else {
			Controll.Move(Stats.getTarget().transform.position);
		}
	}
}

function Attacked(g : GameObject) {
	if (!Stats.hasTarget()) {
		Controll.Move(g.transform.position);
		Stats.BeginAttack(g);
		isAttacked = true;
	}
}