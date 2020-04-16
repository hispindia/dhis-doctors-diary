Doctors Diary

Steps to Build

 to install nodejs files
 
 - npm install // to install nodejs files
 
 to build dist folders with bundle.js file
 
 - webpack or webpack --watch 
 
 - workbox generateSW 
 
 for mobile console
 
 -webpack --mode=development
 
 For debugging
 
./node_modules/workbox-cli/build/bin.js generateSW // go to ./node_modules/workbox-cli/build/bin.js
 
 Place your doctor diary folder in tomcat/webapp/ folder
 
 - cp dist/* to tomcat/webapp/{NAME}

User For

 - Offline Data Entry
 - Sync with Server
 - Multi User Login
 - PWA
