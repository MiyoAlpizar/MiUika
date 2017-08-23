import { UPLOADING_FILE, UPLOADING_FILE_SUCCESS, UPLOADING_FILE_FAILURE, UPLOADING_FILE_PROGRESS } from '../constants'

const initialState = {
    isUploading: false,
    error: false,
    message: '',
    url: '',
    progress: 0
}

export default UploadFile = (state = initialState, action) => {
    switch (action.type) {
        case UPLOADING_FILE:
            return {
                ...state,
                isUploading: true,
                error: false,
                message: '',
                progress: 0,
                url: ''
            }
        case UPLOADING_FILE_SUCCESS:
            return {
                ...state,
                isUploading: false,
                error: false,
                message: '',
                progress: 0,
                url: action.url
            }
        case UPLOADING_FILE_FAILURE:
            return {
                ...state,
                isUploading: false,
                error: true,
                message: action.message,
                progress: 0,
                url: ''
            }
        case UPLOADING_FILE_PROGRESS:
            return {
                ...state,
                progress: action.progress
            }
        default:
            return state
    }
}

