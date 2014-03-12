using UnityEngine;
using System.Collections;
using System.Runtime.InteropServices;
using UnityEngine.SocialPlatforms;

public class socialControl : MonoBehaviour {

	public GameObject leaderboardScreen;

	// Use this for initialization
	void Start () {
		Social.Active = new UnityEngine.SocialPlatforms.GPGSocial();
		Social.localUser.Authenticate(OnAuthCB);
	}

	void checkForAuth () {
		if (Social.localUser.authenticated) {
			leaderboardScreen.SetActive(true);
		}
	}

	public void OnAuthCB(bool result)
	{
		Debug.Log("GPGUI: Got Login Response: " + result);
		checkForAuth();
	}
	
	public void submitScore (long score) {
		Social.ReportScore(score, "CgkI3vq6t4QIEAIQAQ", OnSubmitScore);
	}
	
	public void OnSubmitScore(bool result)
	{
		Debug.Log("GPGUI: OnSubmitScore: " + result);
	}

	public void showLeaderboard () {
		NerdGPG.Instance ().showLeaderBoards ("CgkI3vq6t4QIEAIQAQ");
	}

	public void unlockAchievement (int number) {
		if (number == 1)
			Social.ReportProgress("CgkI3vq6t4QIEAIQAg", 100.0, OnUnlockAC);
		else if (number == 2)
			Social.ReportProgress("CgkI3vq6t4QIEAIQAw", 100.0, OnUnlockAC);
		else if (number == 3)
			Social.ReportProgress("CgkI3vq6t4QIEAIQBA", 100.0, OnUnlockAC);
		else if (number == 4)
			Social.ReportProgress("CgkI3vq6t4QIEAIQBQ", 100.0, OnUnlockAC);
		else if (number == 5)
			Social.ReportProgress("CgkI3vq6t4QIEAIQBg", 100.0, OnUnlockAC);
	}

	public void OnUnlockAC(bool result)
	{
		Debug.Log("GPGUI: OnUnlockAC " + result);
		Social.LoadAchievements(OnLoadAC);
	}

	public void OnLoadAC(IAchievement[] achievements)
	{
		Debug.Log("GPGUI: Loaded Achievements: " + achievements.Length);
	}
}

