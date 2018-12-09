Doctors diary.

1. npm install
2. npm start
3. runs by defualt @ http://localhost:3000/


To deploy build:

1. npm run build
2. initate & host build


#####

New changes post-India:
- Added function to log in with "ENTER"-key on password input in LOGIN.
- Changing screen to "Logging into Doctors Diary" instantly when clicking login, in stead of waiting for fetch-return before doing anything. Meaning users will get instant feedback.
- "Log out" button no longer promts warning message if no reports are pending.						
- Splittet components into seperate files.
- Made some changes to UI.
- Added icons
- Added icons for online/offline.
- Approval/reject status is not shown unless given.
- Reason for rejection is not shown unless given.
- Fixed bug: if report is approved: no change is possible.
- Fixed bug: if going from approved report, new report would not be editable.
- Correct dates should be enabled in the calendar.
- Submitting should be working as expected.
- No duplicating of reports in state.programs.programsStages.events or in state.handleSubmit.
- App should work offline
- PWA score of 100% from Lighthouse audit.
- "Add app to homescreen" works on android, combined with chrome mobile browser
	- Needs testing for other mobile OS + browsers
- +++


To be fixed:
- update events from API if no reports are in the queue.
	- so the reports are up to date.
- Color in calendar (buggy and ugly atm).
- UI fixes. At least regarding the calendar.
- There might be a bug, giving submitted reports a approval status by default. Needs looking into.
- Might not be possible to make changes to rejected reports older than 7 days, this needs to be checked.
