#pragma strict

private var selected : GameObject;

var cam : Camera;

function OnGUI () {
	GUI.Label(Rect(10,10,100,20), selected.name);
 } 

function Start () {
	selected = gameObject;
}

function Update () {
	var ray : Ray;
	var hit : RaycastHit;
	var isHit : boolean;
	if (Input.GetButtonDown("Fire1")) {
		ray = cam.ScreenPointToRay (Input.mousePosition);
		isHit = Physics.Raycast(ray,hit,1000,1<<8);
		if (isHit) {
			selected = hit.collider.gameObject;
		}
	}
	if (Input.GetButton("Fire2")) {
		if (selected.layer == 8) {
			var mask = 1<<9|1<<10;
			ray = cam.ScreenPointToRay (Input.mousePosition);
			isHit = Physics.Raycast(ray,hit,1000,mask);
			if (isHit) {
				if (hit.collider.gameObject.layer == 9) selected.SendMessage("Move", hit.point);
				else if (hit.collider.gameObject.layer == 10) {
					selected.SendMessage("BeginAttack", hit.collider.gameObject);
					//var damage = selected.GetComponent(UnitStats).AttackDamage;
					//hit.collider.gameObject.SendMessage("DecreaseHP", damage);
				}
			}
		}
	}
}