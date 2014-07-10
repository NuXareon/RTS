#pragma strict

private var destinationPos : Vector3;
var unitSpeed : float;

function Start () {
	destinationPos = transform.position;
}

function Update () {	
	var movement : Vector3 = destinationPos-transform.position;
	//if (movement.x > 1.5f || movement.x < -1.5f || movement.z > 1.5f || movement.z < -1.5f) {
		//Vector3.Normalize(movement);
	if (movement.magnitude > 4.0f) { 
		print(movement.magnitude);
		movement = movement.normalized;
		transform.Translate(movement*unitSpeed*Time.deltaTime,Space.World);
		transform.rotation = Quaternion.LookRotation(movement);
	}
	//}
}

function Move (pos : Vector3){
	destinationPos = pos;
}