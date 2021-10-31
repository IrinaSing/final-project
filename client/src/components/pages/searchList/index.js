import classes from './index.module.css';
import {
  fetchBooks,
  fetchSpecificBook,
  performBookSearchPost,
} from '../../../data-access/api-calls/calls.js';
import { setBook } from '../../../handlers/set-book.js';
import { state } from '../../../init/state.js';
import { reloadPage } from '../../layout/page.js';
import { bookPreview } from '../../shared/bookPreview.js';
import { bookDetail } from './book';

/**
 * The Books search result page.
 *
 * @returns {HTMLDivElement} A rendered search result page.
 */
export const searchList = () => {
  const container = document.createElement('section');
  container.classList.add(classes.list);

  console.log('here');

  if (state.currentBookId) {
    console.log('specific');
    fetchSpecificBook(state.currentBookId).then((book) => {
      const element = bookDetail(
        book.id,
        book.title,
        book.description,
        book.isbn_10,
        book.isbn_13,
        book.authors,
        book.thumbnail
      );

      container.appendChild(element);
    });
    return container;
  }

  console.log(state.searchFilter);
  console.log(state.searchFilter !== undefined && state.searchFilter !== '');
  console.log(Object.keys(state.searchFilter).length !== 0);

  if (
    state.searchFilter !== undefined &&
    state.searchFilter !== '' &&
    Object.keys(state.searchFilter).length !== 0
  ) {
    //TODO post
    console.log('if');
    performBookSearchPost(state.searchFilter).then((books) => {
      const previews = books.map((book) => {
        return bookPreview(
          book.id,
          book.title,
          book.description,
          book.isbn_10,
          book.isbn_13,
          book.thumbnail,
          (id) => {
            setBook(id);
            reloadPage(searchList);
          }
        );
      });

      previews.forEach((element) => {
        container.appendChild(element);
      });
    });

    return container;
  } else {
    console.log('else');
    fetchBooks().then((books) => {
      const previews = books.map((book) => {
        return bookPreview(
          book.id,
          book.title,
          book.description,
          book.isbn_10,
          book.isbn_13,
          book.thumbnail,
          (id) => {
            setBook(id);
            reloadPage(searchList);
          }
        );
      });

      previews.forEach((element) => {
        container.appendChild(element);
      });
    });

    return container;
  }
};
