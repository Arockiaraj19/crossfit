import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import { Image } from 'react-native-compressor';
export default uploadImageToStorage=async(path)=>{
try{
    const result = await Image.compress(path);
    console.log("what is the compress image path");
    console.log(result);
   

    console.log("what is the path");
   
    const ref=`images/${uuid.v4()}.png`;
   
    
    const reference = storage().ref(ref);
    const task= reference.putFile(result);
    await task;
    
    const url = await reference.getDownloadURL();
    console.log("what is the url");
    console.log(url.split("&")[0]);
    return url.split("&")[0];
}catch(e){
    console.log("what is the error");
    console.log(e);
    throw e;
}
}