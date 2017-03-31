import { findLastIndex } from '../utils/array';

let subscriptions = [];

const getCurrentPage = (pages) => {
  const index = findLastIndex(pages, item => !item.meta.dismissed);
  return index >= 0 ? index : -1;
};

const beforeNavigate = (pages) => {
  if (pages.length <= 0) {
    return pages;
  }
  const currentPageIndex = getCurrentPage(pages);
  const currentPage = pages[currentPageIndex];
  const currentPageId = currentPage.id;
  const currentPageDOM = document.querySelector(`div[data-page-id="${currentPageId}"]`);

  if (!currentPageDOM) return pages;

  const scrollElements = currentPageDOM.querySelectorAll('.scroll');
  const scrollPositions = [].map.call(scrollElements, elm => elm.scrollTop);
  pages[currentPageIndex].extra.scrollpositions = scrollPositions;
  return pages.filter(p => !p.meta.dismissed);
};


const afterNavigate = (pages) => {
  const currentPageIndex = getCurrentPage(pages);
  const currentPage = pages[currentPageIndex];
  const currentPageId = currentPage.id;
  const currentPageDOM = document.querySelector(`div[data-page-id="${currentPageId}"]`);

  if (!currentPageDOM) return;

  const scrollPositions = currentPage.extra.scrollpositions || [];
  const scrollElements = currentPageDOM.querySelectorAll('.scroll');
  if (scrollElements.length === scrollPositions.length) {
    [].forEach.call(scrollElements, (elm, i) => {
      const scrollTo = () => {
        elm.scrollTop = scrollPositions[i];
        return elm.scrollTop === scrollPositions[i];
      };
      if (!scrollTo()) {
        const observer = new MutationObserver(() => {
          if (scrollTo()) observer.disconnect();
        });
        observer.observe(elm, {
          childList: true,
        });
        setTimeout(() => {
          scrollTo();
          observer.disconnect();
        }, 1500);
      }
    });
  }
  if (currentPage.meta) {
    const meta = currentPage.meta;
    const titleDom = document.querySelector('title');
    if (titleDom) {
      titleDom.innerHTML = meta.title;
    }
    const descriptionDom = document.querySelector('meta[name="description"]');
    if (descriptionDom) {
      descriptionDom.innerHTML = meta.description || '';
    }
  }
};

const onBack = (pages, meta) => {
  for (let i = 0; i < subscriptions.length; i++) {
    clearTimeout(subscriptions[i]);
  }
  subscriptions = [];
  if (meta.closeModal) {
    const currentPage = getCurrentPage(pages);
    const currentModal = pages[currentPage].meta.modal;
    return pages.map((page) => {
      if (page.meta.modal === currentModal) {
        page.meta.dismissed = true;
      }
      return page;
    });
  } else {
    const index = findLastIndex(pages, item => !item.meta.dismissed);
    const pageKey = pages[index].meta.tabKey;
    pages[index].meta.dismissed = true;
    if (pageKey) {
      const pageKeyIndex = findLastIndex(pages, item =>
        item.meta.tabKey !== pageKey && !item.meta.dismissed,
      );
      if (pageKeyIndex > -1) {
        for (let i = pageKeyIndex + 1; i < pages.size; i++) {
          pages[i].meta.dismissed = true;
        }
      }
    }
    return pages;
  }
};

const mapToHistory = (historyState = {}, reduxState) => {
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
