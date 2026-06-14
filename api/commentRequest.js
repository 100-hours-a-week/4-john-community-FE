import { getServerUrl } from '../utils/function.js';
import { requestJson } from '../utils/request.js';

export const deleteComment = (postId, replyId) => {
    const result = requestJson(
        `${getServerUrl()}/posts/${postId}/${replyId}`,
        {
            method: 'DELETE',
            credentials: 'include',
        },
    );
    return result;
};

export const updateComment = (postId, replyId, commentContent) => {
    const result = requestJson(
        `${getServerUrl()}/posts/${postId}/${replyId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(commentContent),
        },
    );
    return result;
};
