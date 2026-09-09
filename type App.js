warning: in the working copy of 'App.js', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/App.js b/App.js[m
[1mindex 310cf39..20fa6e2 100644[m
[1m--- a/App.js[m
[1m+++ b/App.js[m
[36m@@ -1,9 +1,13 @@[m
[31m-[m
 import React from 'react';[m
 import AppNavigator from './src/navigation/AppNavigator';[m
[32m+[m[32mimport {AppProvider} from './src/data/AppContext';[m
 [m
[31m-const App = () => {[m
[31m-  return <AppNavigator />;[m
[31m-};[m
[32m+[m[32mfunction App() {[m
[32m+[m[32m  return ([m
[32m+[m[32m    <AppProvider>[m
[32m+[m[32m      <AppNavigator />[m
[32m+[m[32m    </AppProvider>[m
[32m+[m[32m  );[m
[32m+[m[32m}[m
 [m
 export default App;[m
\ No newline at end of file[m
