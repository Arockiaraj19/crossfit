import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';

export default uploadImageToStorage=async(path)=>{
try{
    console.log("what is the path");
    console.log(path);
    const ref=`images/${uuid.v4()}.png`;
    console.log("ref",ref);
    
    const reference = storage().ref(ref);
    const task= reference.putFile(path);
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