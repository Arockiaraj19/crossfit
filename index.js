/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from "./App"
 import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

// import { store } from './src/redux/store'
// import { Provider } from 'react-redux'

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

 
LogBox.ignoreAllLogs();
const MainComponent=()=><Provider store={store}>
<App /> </Provider>
// AppRegistry.registerComponent(appName, () =>  );
AppRegistry.registerComponent(appName, () => App);