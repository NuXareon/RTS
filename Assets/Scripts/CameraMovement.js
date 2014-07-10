#pragma strict

var CameraSensibility : float;
var ZoomSensibility : float;

private var cam : Camera;

function Start () {
	cam = GetComponent(Camera);
}

function Update () {
	// ficar max/min
	transform.Translate(Quaternion.AngleAxis(25,Vector3.up)*Vector3(Input.GetAxis("Horizontal"),0,Input.GetAxis("Vertical"))*CameraSensibility*Time.deltaTime,Space.World);
	cam.orthographicSize-= Input.GetAxis("Mouse ScrollWheel")*ZoomSensibility*Time.deltaTime;
}