import { supabase } from "../supabase/supabase"
import { fecthInfo, getUserPersonalInfo, uploadImages, uploadSingleDocument } from "./supabaseGlobalFunctions";
import { get_random_string } from "./globalFunctions";
import { Alert } from "react-native";



const createNotification = async (messageDataObj,images = null, pdfObj = null)=>{
    //let user_id = (await fecthInfo());
    let user_id = messageDataObj.sender_id
    let imgsFolder = `${user_id}/${get_random_string(32)}/`;

    var image =  ""
    let file = ""
    let fileName = ""
    if(images != null){
        let image_path = await uploadImages(images, "posts_images", imgsFolder)
        image = image_path[0]
    }
    if(pdfObj != null){
        file = await uploadSingleDocument(pdfObj.pdfUri)
        fileName = pdfObj.pdfName
    }

    let finalValues = {...messageDataObj, image, file, fileName}
    
    //TODO: Insert where senderid and receiver id
    // to prevent double / multiple chats creation
    const {error} = await supabase
    .from('Messages')
    .insert(finalValues)
    if(error){
        return Alert.alert('Error', "Internal error occurred")
    }

    const { data: notification, error:err } = await supabase
    .from('Notifications')
    .select("token")
    .match({user_id: messageDataObj.receiver_id, receiveNotification: true})
    .order("created_at",{ascending: false})
    .limit(1)
    
   
    if(!err){
        if(notification.length > 0){
            let userData = await getUserPersonalInfo(user_id)
            let currentUserFullName = `${userData.firstName} ${userData.lastName}` 
            const message = {
                to: notification[0].token,
                sound: 'default',
                title: userData ? currentUserFullName : "wePlugU User",
                body: messageDataObj.message,
                
            };
            await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
        }
    }
    
}
export default createNotification;