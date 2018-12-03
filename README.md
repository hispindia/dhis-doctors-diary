Doctors diary.

1. npm install
2. npm start


#####

New changes post-India:

* Added function to log in with "ENTER"-key on password input in LOGIN.
* Changing screen to "Logging into Doctors Diary" instantly when clicking login, in stead of waiting for fetch-return before doing anything. Meaning users will get instant feedback.
* "Log out" button no longer promts warning message if no reports are pending.
* Due to bug duplicating many reports on same date I've currently disabled callback for handleSubmit on the interval. Meaning no more changes will be pushed to the server untill submit-function is fixed. 
						<ReactInterval timeout={5000} enabled={true}
							//callback={() => this.handleSubmit()} 
						/>
						currently @ line 666-668
						
* Splittet components into seperate files.
* Made some changes to UI.
