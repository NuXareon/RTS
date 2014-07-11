#pragma strict

private var selected : GameObject;
private var selectionMode : boolean;
private var iniSelection : Vector3;
private var finalSelection : Vector3;
private var selectedArr : GameObject[];
private var iniSelectionScreen : Vector3;
private var finalSelectionScreen : Vector3;
private var renderSelectBox : boolean;

var cam : Camera;

function OnGUI () {
	GUI.Label(Rect(10,10,100,20), selected.name);
	if (selectionMode && renderSelectBox) {
		var boxWidth : float = finalSelectionScreen.x-iniSelectionScreen.x;
		var boxHeight : float = iniSelectionScreen.y-finalSelectionScreen.y;
		GUI.Box(Rect(iniSelectionScreen.x,Screen.height-iniSelectionScreen.y,boxWidth,boxHeight),"");
	}
 } 

function Start () {
	selected = gameObject;
	selectionMode = false;
	var units : GameObject[] = GameObject.FindGameObjectsWithTag("Unit");
	selectedArr = new GameObject[units.Length];
	renderSelectBox = false;
}

function Update () {
	var ray : Ray;
	var hit : RaycastHit;
	var isHit : boolean;
	var i : int;
	var units : GameObject[] = GameObject.FindGameObjectsWithTag("Unit");
	if (units.Length == 0) Application.LoadLevel(Application.loadedLevel);
	if (Input.GetButtonDown("Fire1")) {
		for (i = 0; i < selectedArr.Length;++i) { 
			if (selectedArr[i]) selectedArr[i].SendMessage("SetSelected", false);
			selectedArr[i] = null;
		}
		iniSelectionScreen = Input.mousePosition;
		ray = cam.ScreenPointToRay (Input.mousePosition);
		isHit = Physics.Raycast(ray,hit,1000,1<<8|1<<9);
		if (isHit) {
			if (hit.collider.gameObject.layer == 8) {
				selectedArr[0] = hit.collider.gameObject;
				hit.collider.gameObject.SendMessage("SetSelected", true);
				selectionMode = false;
			} else {
				iniSelection = hit.point;
				selectionMode = true;
			}
		}
	}
	if (Input.GetButtonUp("Fire1") && selectionMode) {
		selectionMode = false;
		renderSelectBox = false;
	}
	if (Input.GetButton("Fire1") && selectionMode) {
		finalSelectionScreen = Input.mousePosition;
		ray = cam.ScreenPointToRay (Input.mousePosition);
		Physics.Raycast(ray,hit,Mathf.Infinity,1<<9);
		finalSelection = hit.point;
		if (Mathf.Abs((iniSelection-finalSelection).magnitude) > 3.0f) {
			for (i = 0; i < selectedArr.Length;++i) { 
				if (selectedArr[i]) selectedArr[i].SendMessage("SetSelected", false);
				selectedArr[i] = null;
			}
			renderSelectBox = true;
			ray = cam.ScreenPointToRay (Vector3(iniSelectionScreen.x,finalSelectionScreen.y,0));
			var corner1 : RaycastHit; 
			Physics.Raycast(ray,corner1,Mathf.Infinity,1<<9);
			ray = cam.ScreenPointToRay (Vector3(finalSelectionScreen.x,iniSelectionScreen.y,0));
			var corner2 : RaycastHit;
		 	Physics.Raycast(ray,corner2,Mathf.Infinity,1<<9);
			var pos : int = 0;
			for (var unit : GameObject in units) {
				var unitPos : Vector3 = unit.transform.position;
				//(0<AM⋅AB<AB⋅AB)∧(0<AM⋅AD<AD⋅AD)
				var AM : Vector3 = unitPos-iniSelection;
				var AB : Vector3 = corner1.point-iniSelection;
				var AD : Vector3 = corner2.point-iniSelection;
				if (0 < Vector3.Dot(AM,AB) && Vector3.Dot(AM,AB) < Vector3.Dot(AB,AB) && 0 < Vector3.Dot(AM,AD) && Vector3.Dot(AM,AD) < Vector3.Dot(AD,AD)) {
					selectedArr[pos] = unit;
					unit.SendMessage("SetSelected", true);
					pos++;						
				}					
				
			}
		}
	}
	else if (Input.GetButton("Fire2")) {
		for (var unit : GameObject in selectedArr) {
			if (unit && unit.layer == 8) {
				var mask = 1<<9|1<<10;
				ray = cam.ScreenPointToRay (Input.mousePosition);
				isHit = Physics.Raycast(ray,hit,Mathf.Infinity,mask);
				if (isHit) {
					if (hit.collider.gameObject.layer == 9) {
						unit.SendMessage("Move", hit.point);
						if (Input.GetKey(KeyCode.LeftShift)) unit.SendMessage("setAttackMove", true);
						else unit.SendMessage("setAttackMove", false);
						}
					else if (hit.collider.gameObject.layer == 10) {
						unit.SendMessage("BeginAttack", hit.collider.gameObject);
					}
				}
			}
		}
	}
}