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

export default {
  bookmarks,
  adding,
  error,
  filter,
  findById,
  addBookmark,
};