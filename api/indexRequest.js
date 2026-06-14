import { getServerUrl } from '../utils/function.js';
import { requestJson } from '../utils/request.js';

export const getPosts = (offset, limit) => {
    
    const queryString = (offset === 0) 
        ? `size=${limit}` 
        : `lastId=${offset}&size=${limit}`;

    const result = requestJson(
        `${getServerUrl()}/posts?${queryString}`,
        {
            credentials: 'include',
        }
    );
    return result;
};

export const searchPosts = (keyword, offset = 0, limit = 5, sort = 'recent') => {
    return getPosts(offset, limit);
};
