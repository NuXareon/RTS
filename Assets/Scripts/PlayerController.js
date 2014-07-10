#pragma strict

private var selected : GameObject;
private var selectionMode : boolean;
private var iniSelection : Vector3;
private var finalSelection : Vector3;
private var selectedArr : GameObject[];

var cam : Camera;

function OnGUI () {
	GUI.Label(Rect(10,10,100,20), selected.name);
 } 

function Start () {
	selected = gameObject;
	selectionMode = false;
	var units : GameObject[] = GameObject.FindGameObjectsWithTag("Unit");
	selectedArr = new GameObject[units.Length];
}

function Update () {
	var ray : Ray;
	var hit : RaycastHit;
	var isHit : boolean;
	var i : int;
	if (Input.GetButtonDown("Fire1")) {
		for (i = 0; i < selectedArr.Length;++i) selectedArr[i] = null;
		ray = cam.ScreenPointToRay (Input.mousePosition);
		isHit = Physics.Raycast(ray,hit,1000,1<<8|1<<9);
		if (isHit) {
			if (hit.collider.gameObject.layer == 8) {
				selected = hit.collider.gameObject;
				selectionMode = false;
			} else {
				iniSelection = hit.point;
				selectionMode = true;
			}
		}
	}
	if (Input.GetButtonUp("Fire1") && selectionMode) {
		selectionMode = false;
		var units : GameObject[] = GameObject.FindGameObjectsWithTag("Unit");
		var selectionCase : int;
		if (iniSelection.x < finalSelection.x){
			if (iniSelection.z < finalSelection.z) selectionCase = 0;
			if (iniSelection.z >= finalSelection.z) selectionCase = 1;
		} else if (iniSelection.x >= finalSelection.x) {
			if (iniSelection.z < finalSelection.z) selectionCase = 2;
			if (iniSelection.z >= finalSelection.z) selectionCase = 3;
		}
		var pos : int = 0;
		for (var unit : GameObject in units) {
			var unitPos : Vector3 = unit.transform.position;
			if (selectionCase == 0) {
				if (unitPos.x >= iniSelection.x && unitPos.x <= finalSelection.x &&
					unitPos.z >= iniSelection.z && unitPos.z <= finalSelection.z) {
						selectedArr[pos] = unit;
						pos++;
					}
			}
			if (selectionCase == 1) {
				if (unitPos.x >= iniSelection.x && unitPos.x <= finalSelection.x &&
					unitPos.z <= iniSelection.z && unitPos.z >= finalSelection.z) {
						selectedArr[pos] = unit;
						pos++;
					}
			}
			if (selectionCase == 2) {
				if (unitPos.x <= iniSelection.x && unitPos.x >= finalSelection.x &&
					unitPos.z >= iniSelection.z && unitPos.z <= finalSelection.z) {
						selectedArr[pos] = unit;
						pos++;
					}
			}
			if (selectionCase == 3) {
				if (unitPos.x <= iniSelection.x && unitPos.x >= finalSelection.x &&
					unitPos.z <= iniSelection.z && unitPos.z >= finalSelection.z) {
						selectedArr[pos] = unit;
						pos++;
					}
			}
		}
		for (i = 0; i < selectedArr.Length;++i) {
			print(selectedArr[i]);
		}
	}
	if (Input.GetButton("Fire1") && selectionMode) {
		ray = cam.ScreenPointToRay (Input.mousePosition);
		Physics.Raycast(ray,hit,1000,1<<9);
		finalSelection = hit.point;
	}
	else if (Input.GetButton("Fire2")) {
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