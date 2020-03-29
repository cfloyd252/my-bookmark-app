const BASE_URL = 'https://thinkful-list-api.herokuapp.com/chris/bookmarks';

const getBookmarks = function () {
  return apiFetch(`${BASE_URL}`);
};

const postBoomark = function(title, desc, url, rating) {
  let newBookmark = JSON.stringify({
    title,
    desc,
    url,
    rating
  });

  return apiFetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: newBookmark
  });
};

const deleteBookmark = function(id) {
  return apiFetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
};

const apiFetch = function(...args) {
  let error;
  return fetch(...args)
    .then(res => {
      if(!res.ok) {
        error = { code: res.status };
      }
  
      return res.json();
    })
    .then(data => {
      if(error) {
        error.message = data.message;
        return Promise.reject(error);
      }
  
      return data;
    });
};

export default {
  getBookmarks,
  postBoomark,
  deleteBookmark
};