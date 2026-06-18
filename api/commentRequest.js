import { getServerUrl } from '../utils/function.js';
import { requestJson } from '../utils/request.js';

export const deleteComment = (postId, CommentId) => {
    const result = requestJson(
        `${getServerUrl()}/posts/${postId}/${CommentId}`,
        {
            method: 'DELETE',
            credentials: 'include',
        },
    );
    return result;
};

export const updateComment = (postId, CommentId, commentContent) => {
    const result = requestJson(
        `${getServerUrl()}/posts/${postId}/${CommentId}`,
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
