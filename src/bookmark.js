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
  <label for="url-input">Bookmark Url</label>
  <input type="url" id="url-input" name="url-input">
  <label for="title-input">Bookmark Title</label>
  <input type="text" name="title-input" id="title-input" required>
  <label for="rating-input">Rate Bookmark(1-5)</label>
  <input type="number" name="rating-input" id="rating-input" min="1" max="5" required> 
  <label for="description-input">Add a description</label>
  <input type="text" name="description-input" id="description-input" placeholder="(optional)">
  <div id="form-buttons">
  <button id="cancel-button">Cancel</button>
  <button type="submit" id="create-button">Create</button>
  </div>
</form>`;
}

function generateStarRating(rateNumber) {
  if (rateNumber === 5) {
    return '★ ★ ★ ★ ★';
  } else if (rateNumber === 4) {
    return '★ ★ ★ ★ ☆';
  } else if (rateNumber === 3) {
    return '★ ★ ★ ☆ ☆';
  } else if (rateNumber === 2) {
    return '★ ★ ☆ ☆ ☆';
  } else if (rateNumber === 1) {
    return '★ ☆ ☆ ☆ ☆';
  } else {
    return '';
  }
}

const generateBookmarkElement = function(bookmark){
  let expandedView = '';
  let starRating = generateStarRating(bookmark.rating)

  if(bookmark.expanded){
    expandedView = `<div class="expanded-view">
        <p class="description">${bookmark.desc}</p>
        <a href="${bookmark.url}" target="_blank">Visit Site</a>
    </div>`;
  }
    
  return `<li class="bookmark" data-item-id="${bookmark.id}">
    <p class="title">${bookmark.title}</p>

    <span class="star-rating">${starRating}</span>

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

    if(STORE.filter > 0){
      bookmarks = bookmarks.filter(bookmark => bookmark.rating >= STORE.filter)
    }

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
    
    api.deleteBookmark(id)
      .then(() => {
        STORE.deleteBookmark(id)
        render()
      })
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

function handleFilter(){
  $('body').on('change', '#filter', e => {
    e.preventDefault()
    
    let rating = $(e.target).val()
    STORE.filter = rating;
    render();
  })
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

const bindEventListeners = function() {
  handleAddBookmarkButton();
  handleExpandView();
  handleDeleteButton();
  handleCancelButton();
  handleCreateBookmarkButton();
  handleFilter();
};

export default {
  render,
  bindEventListeners
};