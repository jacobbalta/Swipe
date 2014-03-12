private var firstPosition : Vector2; 
private var lastPosition : Vector2;
var up : GUITexture;
var down : GUITexture;
var left : GUITexture;
var right : GUITexture;
var upIsActive : boolean;
var downIsActive : boolean;
var leftIsActive : boolean;
var rightIsActive : boolean;
var notInReset : boolean;
var moved : boolean;
var start : float;
var finish : float;
var self : GameObject;
var scoreInt : int;
var reset : GameObject;
var bestInt : int;
var scoreText : TextMesh;
var bestText : TextMesh;
var blackTexture : GameObject;
var timer : float = 1;
var timerEnabled : boolean;
var topText : TextMesh;
var bottomText : TextMesh;
var scoreEnabled : boolean;
var hitSound : AudioSource;
var deadSound : AudioSource;
var timerCount : float;
var bestIntLong : long;

function Start() {
	down.gameObject.SetActive(true);
	topText.text = "Swipe";
	bottomText.text = "Swipe down to start.";
	bestInt = PlayerPrefs.GetInt("Player Score");
	timerCount = 0.8;
	AdMobUnityPlugin.StartAds();
}

function Update()
{	
	if(up.gameObject.activeInHierarchy == true)
			upIsActive = true;
	else
		upIsActive = false;
	if(down.gameObject.activeInHierarchy == true)
		downIsActive = true;
	else
		downIsActive = false;
	if(left.gameObject.activeInHierarchy == true)
		leftIsActive = true;
	else
		leftIsActive = false;
	if(right.gameObject.activeInHierarchy == true)
		rightIsActive = true;
	else 
		rightIsActive = false;
	
	if(scoreInt == 10) {
		//SendMessage("unlockAchievement", 1);
		timerCount = 0.7;
	}
	else if (scoreInt == 20) {
		//SendMessage("unlockAchievement", 2);
		timerCount = 0.6;
	}
	else if (scoreInt == 30) {
		//SendMessage("unlockAchievement", 3);
		timerCount = 0.5;
	}
	else if (scoreInt == 40) {
		//SendMessage("unlockAchievement", 4);
		timerCount = 0.4;
	}
	else if (scoreInt == 50) {
		//SendMessage("unlockAchievement", 1);
		timerCount = 0.3;
	}
	
	for (var touch : Touch in Input.touches) {
		if (touch.phase == TouchPhase.Began) {
			firstPosition = touch.position;
			lastPosition = touch.position;
		}
		if (touch.phase == TouchPhase.Moved ) {
			lastPosition = touch.position;
		}
		
		
		if(touch.phase == TouchPhase.Ended && notInReset) { 
		
			if((firstPosition.x - lastPosition.x) > 80 && leftIsActive) { // left
				moveArrow(left, left.transform.position, Vector3(-0.5,0.5,-9), 0.5);
				scoreInt += 1;
				hitSound.Play();
				timerEnabled = true;
				scoreEnabled = true;
				timer = timerCount;
			}
			
			else if((firstPosition.x - lastPosition.x) < -80 && rightIsActive) { // right
				moveArrow(right, right.transform.position, Vector3(1.5,0.5,-9), 0.5);
				scoreInt += 1;
				hitSound.Play();
				timerEnabled = true;
				scoreEnabled = true;
				timer = timerCount;
			}
			
			else if((firstPosition.y - lastPosition.y) < -80 && upIsActive) { // up
				moveArrow(up, up.transform.position, Vector3(0.5,1.5,-9), 0.5);
				scoreInt += 1;
				hitSound.Play();
				timerEnabled = true;
				scoreEnabled = true;
				timer = timerCount;
			}
			
			else if((firstPosition.y - lastPosition.y) > 80 && downIsActive) { // down
				moveArrow(down, down.transform.position, Vector3(0.5,-0.5,-9), 0.5);
				scoreInt += 1;
				hitSound.Play();
				timerEnabled = true;
				scoreEnabled = true;
				timer = timerCount;
				;
			}
			else {
				killPlayer();
			}
		}
 	}
 	
 	for (var i = 0; i < Input.touchCount; ++i) {
 		if (Input.GetTouch(i).phase == TouchPhase.Began) {
 			var ray = Camera.main.ScreenPointToRay (Input.GetTouch(i).position);
			var hit : RaycastHit;
			if (Physics.Raycast (ray, hit)) {
				if (hit.transform.name == "container") {
					down.gameObject.SetActive(true);
					reset.SetActive(false);
					backToGame();
				}
				if (hit.transform.name == "leaderboard") {
					var cs = GameObject.Find("arrows");
					var SocialControl = cs.GetComponent("socialControl");
					SendMessage ("showLeaderboard");
				}
			}
 		}
 	}
 	
 	if(Input.GetKeyDown(KeyCode.DownArrow) && downIsActive)
 		moveArrow(down, down.transform.position, Vector3(0.5,-0.5,-9), 0.5);
 	else if(Input.GetKeyDown(KeyCode.UpArrow) && upIsActive)
 		moveArrow(up, up.transform.position, Vector3(0.5,1.5,-9), 0.5);
 	else if(Input.GetKeyDown(KeyCode.LeftArrow) && leftIsActive)
 		moveArrow(left, left.transform.position, Vector3(-0.5,0.5,-9), 0.5);
 	else if(Input.GetKeyDown(KeyCode.RightArrow) && rightIsActive)
 		moveArrow(right, right.transform.position, Vector3(1.5,0.5,-9), 0.5);
 	
 	if (timerEnabled) {
 	timer -= Time.deltaTime;
 	bottomText.text = "" + timer; }
 	
	if(scoreEnabled)
	topText.text = "" + scoreInt;
 	
	if(timer <= 0) {
	killPlayer();
	}
}
 
function killPlayer () {
	notInReset = false;
	up.gameObject.SetActive(false);
	down.gameObject.SetActive(false);
	left.gameObject.SetActive(false);
	right.gameObject.SetActive(false);
	deadSound.Play();
	if(scoreInt > bestInt) {
		bestInt = scoreInt;
		PlayerPrefs.SetInt("Player Score", bestInt);
		bestIntLong = bestInt;
		SendMessage ("submitScore", bestIntLong);
	}
	scoreText.text = "Score: " + scoreInt;
	bestText.text = "Best: " + bestInt;
	scoreInt = 0;
	topText.text = "";
	bottomText.text = "";
	Flash(0.1);
	timerCount = 0.8;
	timerEnabled = false;
	scoreEnabled = false;
	timer = timerCount;
	reset.SetActive(true);
}

function backToGame () {
	yield WaitForSeconds(.3);
	notInReset = true;
}

function moveArrow (thisTransform : GUITexture, startPos : Vector3, endPos : Vector3, time : float) {
    var i = 0.0;
    var rate = 0.1;
    while (i < 1.0) {
    	if((i + rate) < 1.0){
    		i += rate;
    	} else {
    		i = 1.0;
    	}
        thisTransform.transform.position = Vector3.Lerp(startPos, endPos, i);
        yield(WaitForSeconds(.001)); 
    }
    if(thisTransform.transform.position == endPos) {
    	thisTransform.gameObject.SetActive(false);
    	thisTransform.transform.position = startPos;
    	generateArrow();
    }
}


function generateArrow () {
	var choice = Random.Range(1, 5);
	if (choice == 1)
		up.gameObject.SetActive(true);
	else if (choice == 2)
		down.gameObject.SetActive(true);
	else if (choice == 3)
		left.gameObject.SetActive(true);
	else if (choice == 4)
		right.gameObject.SetActive(true);
}

function Flash (duration : float) {
     blackTexture.SetActive(true);
     Invoke("Cancel", duration);
}
 
function Cancel () {
    blackTexture.SetActive(false);
}
