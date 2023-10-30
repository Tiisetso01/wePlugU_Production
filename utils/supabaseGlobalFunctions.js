import { Alert } from "react-native";
import { supabase } from "../supabase/supabase"
import { showToast } from "./globalFunctions";
import { get_random_string } from "./globalFunctions";



export const fecthInfo = async ()=>{
    return ((await supabase.auth.getUser())?.data.user);
}


export const getFullName = async(user_id)=>{
  const{data, error}= await supabase.from("Users")
  .select("firstName, lastName")
  .eq('user_id', user_id)
  .single()
  if(!error) return `${data.firstName} ${data.lastName}`
}


export const getUserPersonalInfo = async(user_id) =>{
    const {data, error} = await supabase.from("Users")
    .select("*")
    .eq("user_id", `${user_id}`)
    .limit(1)
    .single()
    if(!error) return data
}


export const realTimeData = (fecthFunction, tableName)=>{
    const subscribe = supabase.channel('table-db-changes')
    .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload) => {
           
          fecthFunction();  
        }
    )
    .subscribe()
  
    return ()=>{ supabase.removeChannel(subscribe) }
}

/**
 * /////cebtral brain for uploading images\\\\\\
 * 
 * This function is a helper function that upload array of images to given bucket
 * @param {*} images store array of images to be uploads to specific bucket
 * @param {*} bucketName name of the bucket to upload the images
 * @param {*} imgsFolder (string e.g. --> user_id/uuid/image.png) is the folder where the current images are stored
 * @returns array of paths where each image in the array is stored
 */
export const uploadImages = async(images, bucketName, imgsFolder)=>{
  

    /**
     * Upload  images one at the time
     * imagesData is stored in images[]
     * */
    let image_path =[]
    
    images.map(async (imageObj) => {
      const uri = imageObj.uri;
      const fileName = uri.split("/").pop()
      const fileExt = uri.split('.').pop()
      const photo = { uri: uri, type: `image/${fileExt}`, name: fileName}
     
      const formData = new FormData()
      formData.append('file', photo)
     
      let filePathStorage = imgsFolder + fileName; //image path in store
      image_path.push(filePathStorage)
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePathStorage,formData );
  
        if (error) {
          return Alert.alert("Error Message", "An error occurred while uploading your Your Images.");
        }
    });
  
    return image_path
}

/**
 * This fuction upload Single pdf, (helper method)
 * @param {*} pdfUri uri of the pdf to be uploaded
 * @returns 
 */
export const uploadSingleDocument = async(pdfUri)=>{

    const fileName = pdfUri.split("/").pop()
    const pdf = {
      uri: pdfUri,
      type: "application/pdf",
      name: fileName,
    }
    
    let user_id = (await fecthInfo())?.id
    let filePathStorage = `${user_id}/${get_random_string(32)}/${fileName}`
    const formData = new FormData()
    formData.append('file', pdf)
  
    const { error } = await supabase.storage
    .from("pdfs")
    .upload(filePathStorage, formData );
    if(!error) return filePathStorage
    
    return Alert.alert("Error Message", "An error occurred while uploading your Your PDF.");
        
  }

export const fecthDepartments = async()=>{
    const {data, error} = await supabase.from('Departments')
    .select("department")
    if(!error){
        let tempArr = data.map((item, index)=>{return{key:`${index}`, value: item.department} })
        return tempArr
    }
}
export const fecthCoursesCodes = async()=>{
    const {data, error} = await supabase.from('Courses')
    .select("course_code")
    if(!error){
        let tempArr = data.map((item, index)=>{return{key:`${index}`, value: item.course_code} })
        return tempArr
    }
    
}
export const deletePost = async(postObj)=>{
    
    const { error } = await supabase
    .storage
    .from('posts_images')
    .remove(postObj.image_path)
    if(error){
      return Alert.alert("Error Message", "An error occurred while deleting your post.")
    }

    const {error:err} = await supabase
    .from('Posts')
    .delete()
    .eq("post_id", postObj.post_id)
    
    if(!err){
        
        showToast('✅ Post was deleted successfully!', 'green');
        return await getPosts(postObj.type)
    }
 
    Alert.alert("Error Message", "An error occurred while deleting your post.");
    
}


export const getPosts = async (type)=>{
    let user_id = (await fecthInfo()).id
    const { data, error} = await supabase
    .from('Posts')
    .select("*")
    .match({user_id, type})
    .order("created_at", {ascending:false})
    
    if(!error){  
      return data
    }
      Alert.alert("Error Message", "An error occurred while fecthing your posts.")
    return []
}
export const checkChat= async(receiver_id, currentUserId)=>{
    
    const {data, error} = await supabase.from("ChatsList")
    .select("chatlist_id, receiver_id, sender_id")
    .or(`and(sender_id.eq.${currentUserId}, receiver_id.eq.${receiver_id}), and(receiver_id.eq.${currentUserId}, sender_id.eq.${receiver_id})`)
    //.or(`and(receiverDeletedChat.neq.${user_id}, senderDeletedChat.neq.${user_id})`,{foreignTable : "Messages"})
    .limit(1)
    

    const otherUserIdInfo = await getUserPersonalInfo(receiver_id)
    const fullName = otherUserIdInfo?.firstName + " " + otherUserIdInfo?.lastName;
    const profile_image = otherUserIdInfo?.profile_image
    if(error) return Alert.alert("Error Message", "Internal error occurred while fecthing data.")
    
    // if there is a chat between the other user and the current user set chatlist_id
    // else set chatlist_id to null
    let dataObj = data[0]
    const chat = { 
        currentUserId,
        otherUserId: receiver_id, 
        fullName,
        profile_image,
        chatlist_id: dataObj ? dataObj.chatlist_id : null
    }
    return chat
  
}

export const deleteDocumentPost = async(postObj)=>{
   
    const { error } = await supabase
    .storage
    .from('posts_images') 
    .remove(postObj.image_path)
    if(error){
      return Alert.alert("Error Message", "An error occurred while deleting your post.")
    }
    const { error:pdfError } = await supabase
    .storage
    .from('pdfs') 
    .remove([...postObj.solutionsFilePath, postObj.questionsFilePath])
    if(pdfError){

      return Alert.alert("Error Message", "An error occurred while deleting your post.")
    }

    const {error:err} = await supabase
    .from('Documents')
    .delete()
    .eq("file_id",postObj.file_id)
    if(!err){

      return showToast('✅ Post was deleted successfully!', 'green');
    }

    return Alert.alert("Error Message", "An error occurred while deleting your post.");
  }

  export const updatePurchased = async()=>{
    let user_id = (await fecthInfo()).id;
    await supabase.from("Referrals")
    .update({purchased: true})
    .match({registered_user: user_id, isRedemed:false})
  }