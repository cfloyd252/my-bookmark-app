import $ from 'jquery';
import api from './api';
import app from './bookmark';
import STORE from './store';

function main() {
  api.getBookmarks()
    .then(bookmarks => {
      bookmarks.forEach(bookmark => STORE.addBookmark(bookmark));
      app.render();
      app.bindEventListeners();
    })
    .catch(error => {
      STORE.setError(error.message);
      app.render();
      app.bindEventListeners();
    });
}

$(main);