import {
    GET_FechInfoWithoutToken,
    GET_FechInfo,
    POST_FechInfo,
    FileUpload_ProfileImageUpload,
    FileUpload_VideoUpload,
    FileUpload_PDFUpload,
    ImageUploadToSertver,
    UploadChatFiles,
    videoUploadWithFormData,
  } from '../../utils';
  

  export async function getFetchActionWithoutToken(userId, urlString, token) {
    var responses;
    try {
      let response = await GET_FechInfoWithoutToken(userId, urlString, token)
        .then(res => {
          // if (res.status) {
            responses = res
          // }
        })
        .catch(err => {
        });
    } catch (error) {
    }
    return responses;
  };
  export async function getFetchAction(userId, urlString) {
    var responses;
    try {
      let response = await GET_FechInfo(userId, urlString)
        .then(res => {
          // if (res.status) {
            responses = res
          // }
        })
        .catch(err => {
        });
    } catch (error) {
    }
    return responses;
  };
  
  export async function postFetchAction(params, urlString) {
    var responses;
    try {
      let response = await POST_FechInfo(params, urlString)
        .then(res => {
          // if (res.status) {
            responses = res
          // }
        })
        .catch(err => {
        });
    } catch (error) {
    }
    return responses;
  };
  
  export async function uploadImageToServerAction(imageUrl, urlString) {
    var responses;
    try {
      let response = await ImageUploadToSertver(imageUrl, urlString)
        .then(res => {
          // if (res.status) {
            responses = res
          // }
        })
        .catch(err => {
        });
    } catch (error) {
    }
    return responses;
  };

  export async function uploadFileAction(imageUrl, urlString, params, fieldName) {
    var responses;
    try {
      let response = await FileUpload_ProfileImageUpload(imageUrl, urlString, params, fieldName)
        .then(res => {
          // if (res.status) {
            responses = res
          // }
        })
        .catch(err => {
        });
    } catch (error) {
    }
    return responses;
  };

  export async function uploadVideoFileAction(videoUrl, urlString) {
    var responses;
    try {
      let response = await FileUpload_VideoUpload(videoUrl, urlString)
        .then(res => {
          // if (res.status) {
            responses = res
          // }
        })
        .catch(err => {
        });
    } catch (error) {
    }
    return responses;
  };

  export async function uploadVideoWithFormdtaAction(formdata,videoUrl, urlString) {
    var responses;
    try {
      let response = await videoUploadWithFormData(formdata, videoUrl, urlString)
        .then(res => {
          // if (res.status) {
            responses = res
          // }
        })
        .catch(err => {
        });
    } catch (error) {
    }
    return responses;
  };

  export async function uploadPDFFileAction(formData, urlString) {
    var responses;
    try {
      let response = await FileUpload_PDFUpload(formData, urlString)
        .then(res => {
          // if (res.status) {
            responses = res
          // }
        })
        .catch(err => {
        });
    } catch (error) {
    }
    return responses;
  };
  export async function UploadChatFilesAction(formData, urlString) {
    var responses;
    try {
      let response = await UploadChatFiles(formData, urlString)
        .then(res => {
          // if (res.status) {
            responses = res
          // }
        })
        .catch(err => {
        });
    } catch (error) {
    }
    return responses;
  };

  //