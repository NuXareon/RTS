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
			ray = cam.ScreenPointToRay (Input.mousePosition);
			isHit = Physics.Raycast(ray,hit,1000,1<<9);
			if (isHit) selected.SendMessage("Move", hit.point);
		}
	}
}