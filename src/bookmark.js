import $ from 'jquery';
import STORE from './store';
import api from './api';

function generateInitialView(){
  return `<section class="initial-view">
      <div class="book-controls">
          <button id="add-button">Add Boomark</button>
          <select name="filter" id="filter">
              <option value="0">Minimum Rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Star</option>
              <option value="3">3 Star</option>
              <option value="4">4 Star</option>
              <option value="5">5 Star</option>
          </select>
      </div>
      <ul id="bookmark-list">
  
      </ul>
  </section>`;
}

function generateAddBookmarkView(){
  return `<form id="add-bookmark-form">
  <label for="url-input">Add new Bookmark Url:</label>
  <input type="url" id="url-input" name="url-input">
  <div class="bookmark-info">
      <label for="title-input">Bookmark Title</label>
      <input type="text" name="title-input" id="title-input" placeholder="Bookmark Title" required>
      <label for="rating-input">Rate Bookmark(1-5)</label>
      <input type="number" name="rating-input" id="ratinginput" min="1" max="5" required> 
      <input type="text" id="description-input" placeholder="Add a description (optional)">
      <div id="form-buttons">
      <button id="cancel-button">Cancel</button>
      <button type="submit" id="create-button">Create</button>
      </div>
  </div>
</form>`;
}

const generateBookmarkElement = function(bookmark){
  let expandedView = '';

  if(bookmark.expanded){
    expandedView = `<div class="expanded-view">
        <p class="description">${bookmark.description}</p>
        <a href="${bookmark.url}">Visit Site</a>
    </div>`;
  }
    
  return `<li class="bookmark" data-item-id="${bookmark.id}">
    <p class="title">${bookmark.title}</p>

    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>

    <button id="delete-button">Delete Bookmark</button>
    ${expandedView}
    </li>`;
};

const generateBookmarkListString = function (bookmarkList){
  const bookmarks = bookmarkList.map(bookmark => generateBookmarkElement(bookmark));
  return bookmarks.join('');
};



function render(){
  if(STORE.adding === false){
    let bookmarks = [...STORE.bookmarks];
    const bookmarkListString = generateBookmarkListString(bookmarks);
    const initialView = generateInitialView();
    $('main').html(initialView);
    $('#bookmark-list').html(bookmarkListString);
  } else if (STORE.adding === true){
    const addBookmarkView = generateAddBookmarkView();
    $('main').html(addBookmarkView);
  }
}

function handleAddBookmarkButton(){
  //When #add-button is clicked, render Add Bookmark Form View
  $('main').on('click','#add-button', () => {
    STORE.adding = true;
    render();
  });
}

function handleCreateBookmarkButton(){
  $('body').on('submit', '#add-bookmark-form', (e) => {
    e.preventDefault();

    let title = $('#title-input').val();
    let url = $('#url-input').val();
    let description = $('#description-input').val();
    let rating = $('#rating-input').val();

    api.postBoomark(title, description, url, rating)
      .then(newBookmark => {
        STORE.addBookmark(newBookmark);
        STORE.adding = false;
        render();
      });
  });
}

function handleExpandView(){
  //When bookmark is clicked, render the expanded view of the selected bookmark
  $('main').on('click', '.bookmark', event => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleExpandForBookmark(id);
    render();
  });
}

function handleDeleteButton(){
  //When #delete-button is clicked, remove the selected bookmark
  $('main').on('click', '#delete-button', event => {
    const id = getItemIdFromElement(event.currentTarget);
    deleteListItem(id);
    render();
  });
}

function handleCancelButton(){
  //When #cancel-button is clicked, go back to initial view
  $('main').on('click','#cancel-button', event => {
    event.preventDefault();
        
    STORE.adding = false;
    render();
  });
}

const toggleExpandForBookmark = function (id) {
  const foundBookmark = STORE.bookmarks.find(bookmark => bookmark.id === id);
  foundBookmark.expanded = !foundBookmark.expanded;
};

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.bookmark')
    .data('item-id');
};

const deleteListItem = function (id){
  const index = STORE.bookmarks.findIndex(item => item.id === id);
  STORE.bookmarks.splice(index,1);
};

function minimumRatingFilter(){
  //When option is selected, only display bookmarks with that rating or higher
}

const bindEventListeners = function() {
  handleAddBookmarkButton();
  handleExpandView();
  handleDeleteButton();
  handleCancelButton();
  handleCreateBookmarkButton();
  minimumRatingFilter();
};

export default {
  render,
  bindEventListeners
};