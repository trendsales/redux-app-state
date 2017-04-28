import { findLastIndex } from '../utils/array';

// This is the method for getting the current viewed page
const getCurrentPage = (pages) => {
  // To get the current page we find the last page which isn't dismissed
  const index = findLastIndex(pages, item => !item.meta.dismissed);
  // In order to comply with the default findIndex function in JS we return
  // -1 if there are no pages in the index, otherwise we return the index of
  // the page
  return index >= 0 ? index : -1;
};

// Action to update the page list before navigating to a new page
// Used to store scroll positions for when a user goes back and to remove
// dismissed pages when a user navigates forward
const beforeNavigate = (pages) => {
  // If there are no pages currently, there is nothing really to do
  if (pages.length <= 0) {
    return pages;
  }
  // We get the index of the current page
  const currentPageIndex = getCurrentPage(pages);
  // And the page itself
  const currentPage = pages[currentPageIndex];
  // And its ID
  const currentPageId = currentPage.id;
  // And tries to get that pages element from the dom
  const currentPageDOM = document.querySelector(`div[data-page-id="${currentPageId}"]`);

  // If it is not being displayed we simply exit
  if (!currentPageDOM) return pages;

  // If it is being displayed we grap all elements with the scroll class
  const scrollElements = currentPageDOM.querySelectorAll('.scroll');
  // And find all their scroll positions
  const scrollPositions = [].map.call(scrollElements, elm => elm.scrollTop);
  // And store them as the current pages scroll positions in its extra
  pages[currentPageIndex].extra.scrollpositions = scrollPositions;
  // And then we return a list with all dismissed pages removed
  return pages.filter(p => !p.meta.dismissed);
};

// After we have navigated to the new page we want to update the pages meta
// information (tite, description etc.)
// we also want to restore scroll positions if there are any stored for the page
const afterNavigate = (pages) => {
  // We start by getting the index of the current page
  const currentPageIndex = getCurrentPage(pages);
  // And the page itself
  const currentPage = pages[currentPageIndex];
  // And it's ID
  const currentPageId = currentPage.id;
  // And its element, if it is in the dom
  const currentPageDOM = document.querySelector(`div[data-page-id="${currentPageId}"]`);

  // If not, there is not much we can do.
  if (!currentPageDOM) return;

  // If it is then we get the cached scroll positions
  const scrollPositions = currentPage.extra.scrollpositions || [];
  // And find all the positions on the page which supports scroll
  const scrollElements = currentPageDOM.querySelectorAll('.scroll');

  // To ensure the page has not changed beyond our expectation we ensure that there
  // are the same amount of scroll elements as when the page was cached
  if (scrollElements.length === scrollPositions.length) {
    // We loop through all our scroll containers
    [].forEach.call(scrollElements, (elm, i) => {
      // And create a reusable function for scrolling to the correct position
      const scrollTo = () => {
        // We try to scroll to the correct location
        elm.scrollTop = scrollPositions[i];
        // And returns if it succeded or not (If the element is large enough)
        return elm.scrollTop === scrollPositions[i];
      };
      // We then tries to scroll to the location
      if (!scrollTo()) {
        // If we could not scroll to the correct location, rendering most likely
        // takes more than one pass, so instead we start to listen for DOM
        // manipulations to the container
        const observer = new MutationObserver(() => {
          // And when the DOM is opdated we try again, ind remove our listener
          // if successfull
          if (scrollTo()) observer.disconnect();
        });
        observer.observe(elm, {
          childList: true,
        });
        // We also add a timeout, so if the element never will be able to
        // scroll to the correct location, we does free up the reources
        setTimeout(() => {
          scrollTo();
          observer.disconnect();
        }, 1500);
      }
    });
  }
};

// used when navigation back, so back can close entire modals
const onBack = (pages, meta) => {
  // if the request is to close the model
  if (meta.closeModal) {
    // we get the current page index
    const currentPage = getCurrentPage(pages);
    // and use it to get the modal level of the current page;
    const currentModal = pages[currentPage].meta.modal;
    // and loop through all pages
    return pages.map((page) => {
      // if the current page is the same modal level
      if (page.meta.modal === currentModal) {
        // we set it to dismissed
        page.meta.dismissed = true;
      }
      // and we return the updated list
      return page;
    });
  // if it is not a close modal request
  } else {
    // we find the last page in the list which has not been dismissed
    const index = findLastIndex(pages, item => !item.meta.dismissed);
    // and look if it has a tabKey to it
    const pageKey = pages[index].meta.tabKey;
    // and we dismissed that page
    pages[index].meta.dismissed = true;
    // if the page has a tab key
    if (pageKey) {
      // we find the last inde where this isn't the tab key
      const pageKeyIndex = findLastIndex(pages, item =>
        item.meta.tabKey !== pageKey && !item.meta.dismissed,
      );
      // if there are any
      if (pageKeyIndex > -1) {
        for (let i = pageKeyIndex + 1; i < pages.length; i++) {
          pages[i].meta.dismissed = true;
        }
      }
    }
    return pages;
  }
};

const mapToHistory = (historyState = {}, reduxState) => {
  // We only want the content part of the state to be used in history
  reduxState.content = historyState.content;
  return reduxState;
};

const defaultUrl = (pages, meta = {}) => {
  if (meta.closeModal) {
    return meta.defaultUrl || '/';
  } else {
    return false;
  }
};

export default base => ({
  ...base,
  getCurrentPage,
  beforeNavigate,
  onBack,
  mapToHistory,
  afterNavigate,
  defaultUrl,
});
