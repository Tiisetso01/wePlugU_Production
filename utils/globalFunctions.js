import { supabase } from "../supabase/supabase"
import Toast from 'react-native-root-toast';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions,Alert,Share } from "react-native";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import { tvetColleges, universities } from "./Constants";
import * as Linking from 'expo-linking';

export const CDNURL_PDF = "https://jdgkeetcqnqbxkioxprn.supabase.co/storage/v1/object/public/pdfs/"
export const CDNURL_IMAGES = "https://jdgkeetcqnqbxkioxprn.supabase.co/storage/v1/object/public/posts_images/"

export const fecthInfo = async ()=>{
  return ((await supabase.auth.getUser())?.data.user);
  
}
export const showToast =(message, color)=>{
  let toast = Toast.show(message, {
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    containerStyle:{
      borderRadius:5,
      borderWidth:1,
      backgroundColor:'grey',
      //width: Dimensions.get("window").width * 0.8
    },
    textStyle:{
      color:color,
      fontSize: 15
    }
    
  });
  
  // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
  setTimeout(()=>{
    Toast.hide(toast);
  }, 60000);
}

/** Fecth universities */
export const getUniversities= async()=> {
  try {
    let response = await fetch('http://universities.hipolabs.com/search?country=South Africa');
    let responseJson = await response.json();

    //remove all duplicated from array
    let uniqueArr = responseJson.filter((obj, index, self) =>
      index === self.findIndex((t) => ( t.name === obj.name))
    )

    // duplicated array objects
    let universitiesArrObj = uniqueArr.map((uni) => {
      return {key: uni.name, value: uni.name}
    })
      console.log(universitiesArrObj)
    // pure universities array
    let  universitiesArr = uniqueArr.map((uni) => {return uni.name})
    return {universitiesArrObj, universitiesArr};
  } catch (error) {
    Alert.alert("Error Message","Failed to universities data.")
    return [];
  }
}

/** Combine universities and College */
export const fetchInstitutions = ()=>{
  //const universities = (await getUniversities()).universitiesArrObj
  const colleges = tvetColleges
  return [...universities, ...colleges]
}

/** Subscribe to a specific table to get real time data */
export const realTimeData = (fecthFunction, tableName)=>{
  const subscribe = supabase.channel('custom-all-channel')
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

/*** Get structured time */
export function getTime(date){
        
  var hours = new Date(date).getHours()
  var minutes = new Date(date).getMinutes();
  var minutes = minutes < 10? "0"+ minutes: minutes;
  var ampm = hours < 12 ? "AM" : "PM"
  var strTime = hours + ':' + minutes +` ${ampm}`;
  return strTime
}

//
function max_random_number(max) {
    return Math.floor(Math.random() * max);
  }
export function get_random_string(length) {
    let random_string = '';
    while(random_string.length < length) {
     random_string += max_random_number(Number.MAX_SAFE_INTEGER).toString(36);
    }
    return random_string.substring(0, length);
  }



/** IMAGE PICKER */
export const pickImages = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      selectionLimit:10,
      allowsMultipleSelection:true,
      aspect: [4, 3],
      quality: 1.0, 
    });
    if (!result.canceled) {
      const returnedImages = result.assets;
      return returnedImages.reverse()
    }
    return []
};


/*** DOCUMENT PICKER */
export const pickDocuments = async()=>{
  try {
    let resultObj = await DocumentPicker.getDocumentAsync({type:"application/pdf"})
    if (resultObj != null && !resultObj.canceled) {
      let result = resultObj.assets[0]
      return {pdfUri: result.uri, pdfName: result.name}
    }
    return showToast("canceled!", 'red')
  } catch (error) {
    Alert.alert("Internal Error", "Internal Error occurred try closing the App and open it again later.")
    //showToast("Internal Error occurred try again later.", 'red')
  }
  
}


/**
 * This fuction upload pdfs, (helper method)
 * @param {*} pdfUri uri of the pdf to be uploaded to specific table
 * @returns 
 */
export const uploadDocuments = async(pdfUri)=>{

  const fileName = pdfUri.split("/").pop()
  const pdf = {
    uri: pdfUri,
    type: "application/pdf",
    name: fileName,
  }
  
  let user_id = (await fecthInfo())?.id
  let filePathStorage = [`${user_id}/${get_random_string(32)}/${fileName}`]
  const formData = new FormData()
  formData.append('file', pdf)

  const { error } = await supabase.storage
  .from("pdfs")
  .upload(filePathStorage, formData );

  if (error) {
    return Alert.alert("Error Message", "An error occurred while uploading your Your PDF.");
  }
      
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
 * //////Cental brain for Posts\\\\\\\\
 * This fucntion upload posts in a specified table (tableName) for specific screen,
 * its a global function that is flexible it can upload any given data given to it (values).
 * it depends on other functions to perform its operations, (uploadImages)
 * 
 * @param {*} values any value you want to upload to specific table
 * @param {*} resetForm reset the form inputs in specific screen
 * @param {*} images array of images[] to be uploaded
 * @param {*} tableName  the name of the table we want to upload load the data for
 * @returns 
 */
export const handleUploadPostsData = async (values, resetForm, images, tableName) => {

  /**
   * Upload  images one at the time
   * imagesData is stored in images[]
   * */
  let user_id = (await fecthInfo()).id;
  let imgsFolder = `${user_id}/${get_random_string(32)}/`;
  let image_path = await uploadImages(images, "posts_images", imgsFolder)
  
  const {error}= await supabase.from(tableName)
    .insert({ user_id,...values, image_path })
    if(!error){
      showToast('✅ Data was saved successfully!', 'green')
      resetForm()
    }else{

      return Alert.alert("Error Message", "An error occurred while uploading your Data.")
    } 

};

/**
 * This function upload Documents data to *Documents Table* 
 * it upload documents posts (images, pdfs and values such as document title, description and ect)
 * 
 * @param {*} values any value you want to upload
 * @param {*} resetForm reset the form inputs in specific screen
 * @param {*} images array of images[] to be uploaded
 * @param {*} pdfsFilePath paths of pdfs to be uploaded
 * @param {*} pdfsFileData pdfs form data
 */
export const handleSubmitDocuments = async (values, resetForm, images, pdfsFilePath , pdfsFileData) => {
  

  //Uploading one pdf at the time
    pdfsFileData.map(async(pdf, index)=>{
     
      const formData = new FormData()
      formData.append('file', pdf)
      const {  error} = await supabase.storage
        .from('pdfs')
        .upload(pdfsFilePath[index],formData ); // 

        if(error){
          return  Alert.alert ("Error Message", "An error occurred while uploading your Data.")
        }
    })
    
    // Uploading to post to Documents table
   await handleUploadPostsData(values, resetForm, images, "Documents") 

};


/**
 * This function downloads pdfs 
 * 
 * @param {*} pdfPath in the bucket
 * @param {*} fileName originale pdf file name
 * @returns 
 */
export const downloadFiles = async(pdfPath, fileName)=>{
    
  //setIsDownloading(true)

  const callback = downloadProgress => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    //setDownloadProgress(progress * 100);
  };
  
  const downloadResumable = FileSystem.createDownloadResumable(
    CDNURL_PDF + pdfPath,
    FileSystem.documentDirectory + fileName,
    {},
    callback
  );
  
  try {
    
    const { uri } = await downloadResumable.downloadAsync();
    
    if (uri) {

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') { return }
      
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync('downloads');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('downloads', asset, false);
        
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      //setIsDownloading(false)
      return showToast("Downloading is complete ✅.", "green")
    
    }
  } catch (e) {

    return showToast("Failed to download ❌.", "red")
  }
 
}


/** STRUCTURED PDF NAME */
export const getPdfName = (fileName)=>{

  if(fileName?.length > 26){ return fileName?.slice(0, 25) + "...pdf"}
  return fileName
}

/** OPEN PDF */
export const openPdfFile = async(filePath, navigation)=>{
  navigation.navigate("PdfViewer",{pdf: filePath})
}