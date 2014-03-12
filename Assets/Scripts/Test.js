#pragma strict

private var firstPosition : Vector2; 
private var lastPosition : Vector2;
var up : GUITexture;
var down : GUITexture;
var left : GUITexture;
var right : GUITexture;

function Update()
{
	for (var touch : Touch in Input.touches) {
	
		if (touch.phase == TouchPhase.Began) {
			firstPosition = touch.position;
			lastPosition = touch.position;
		}
		if (touch.phase == TouchPhase.Moved ) {
			lastPosition = touch.position;
		}
		
		if(touch.phase == TouchPhase.Ended) { 
		
			if((firstPosition.x - lastPosition.x) > 80) { // left
				changeDirection(left);
			}
			
			else if((firstPosition.x - lastPosition.x) < -80) { // right
				changeDirection(right);
			}
			
			else if((firstPosition.y - lastPosition.y) < -80 ) { // up
				changeDirection(up);
			}
			
			else if((firstPosition.y - lastPosition.y) > 80) { // down
				changeDirection(down);
			}
		}
 	}
}

function changeDirection (direction : GUITexture) {
 	up.gameObject.SetActive(false);
	down.gameObject.SetActive(false);
	left.gameObject.SetActive(false);
 	right.gameObject.SetActive(false);
 	direction.gameObject.SetActive(true);
 }