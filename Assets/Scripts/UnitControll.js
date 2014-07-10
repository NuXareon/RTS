#pragma strict

private var destinationPos : Vector3;
private var anim : Animator;
var unitSpeed : float;

function Start () {
	destinationPos = transform.position;
	anim = GetComponent(Animator);
}

function Update () {	
	var movement : Vector3 = destinationPos-transform.position;
	//if (movement.x > 1.5f || movement.x < -1.5f || movement.z > 1.5f || movement.z < -1.5f) {
		//Vector3.Normalize(movement);
	if (movement.magnitude > 4.0f) { 
		movement = movement.normalized;
		transform.Translate(movement*unitSpeed*Time.deltaTime,Space.World);
		transform.rotation = Quaternion.LookRotation(movement);
		var mag : float = movement.magnitude*unitSpeed*Time.deltaTime;
		anim.SetFloat("Speed",mag);
	} else {
		anim.SetFloat("Speed",0);
	}
	//}
}

function Move (pos : Vector3){
	destinationPos = pos;
}