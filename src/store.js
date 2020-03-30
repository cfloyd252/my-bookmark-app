const bookmarks = [];
const adding = false;
const error = null;
const filter = 0;

function findById(id) {
  return this.bookmarks.find(bookmark => bookmark.id === id);
}

function addBookmark(bookmark) {
  this.bookmarks.push(bookmark);
}

function deleteBookmark(id) {
  const index = this.bookmarks.findIndex(item => item.id === id);
  this.bookmarks.splice(index,1);
}

function setError(error) {
  this.error = error;
}

export default {
  bookmarks,
  adding,
  error,
  filter,
  findById,
  addBookmark,
  deleteBookmark,
  setError,
};