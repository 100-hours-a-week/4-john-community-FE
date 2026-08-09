import { getServerUrl } from '../utils/function.js';
import { requestJson } from '../utils/request.js';

export const createPost = boardData => {
    const result = requestJson(`${getServerUrl()}/posts`, {
        method: 'POST',
        body: JSON.stringify(boardData),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    return result;
};

export const updatePost = (postId, boardData) => {
    const result = requestJson(`${getServerUrl()}/posts/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify(boardData),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    return result;
};

export const fileUpload = formData => {
    const result = requestJson(getServerUrl() + '/images', {
        method: 'POST',
        body: formData,
        credentials: 'include',
    });

    return result;
};

export const getBoardItem = postId => {
    const result = requestJson(getServerUrl() + `/posts/${postId}`, {
        method: 'GET',
        credentials: 'include',
    });

    return result;
};

export const videoUpload = (formData, onProgress) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', getServerUrl() + '/videos');
        xhr.withCredentials = true;

        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable && onProgress) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress(percent);
            }
        });

        xhr.addEventListener('load', () => {
            try {
                const body = JSON.parse(xhr.responseText);
                resolve({
                    ok: xhr.status >= 200 && xhr.status < 300,
                    status: xhr.status,
                    data: body.data || body,
                    body,
                });
            } catch (e) {
                resolve({
                    ok: xhr.status >= 200 && xhr.status < 300,
                    status: xhr.status,
                    data: null,
                    body: null,
                });
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('영상 업로드 중 네트워크 오류가 발생했습니다.'));
        });

        xhr.send(formData);
    });
};

export const getPresignedVideoUrl = extension => {
    return requestJson(`${getServerUrl()}/videos/presigned-url?extension=${encodeURIComponent(extension)}`, {
        method: 'GET',
        credentials: 'include',
    });
};

export const uploadVideoToS3Presigned = (presignedUrl, file, onProgress) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', presignedUrl);
        if (file.type) {
            xhr.setRequestHeader('Content-Type', file.type);
        }

        xhr.upload.addEventListener('progress', event => {
            if (event.lengthComputable && onProgress) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress(percent);
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve({ ok: true, status: xhr.status });
            } else {
                resolve({ ok: false, status: xhr.status });
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('S3 직통 영상 업로드 중 네트워크 오류가 발생했습니다.'));
        });

        xhr.send(file);
    });
};
