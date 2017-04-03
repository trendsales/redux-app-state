import { expect } from 'chai';
import { spy } from 'sinon';
import enhancer from '../lib/enhancer';
import nil from '../lib/apis/nil';

describe('enhancer', () => {
  describe('simple', () => {
    let state = null;
    let history = null;
    let afterNavigate = { a: null };
    let resolve = null;
    let asyncWait = null;

    before(() => {
      state = {};
      history = enhancer({
        api: nil,
        afterNavigate: (...args) => {
          resolve(args);
          return args;
        },
      })(() => {});
    });

    beforeEach(() => {
      asyncWait = new Promise((presolve) => {
        resolve = presolve;
      });
    });

    it('should not be initialized with any commits', () => {
      expect(history.getCommits()).to.have.length(0);
    });

    it('should only add commit internally on begin navigate', () => {
      state = history(state, {
        type: '@@history/BEFORE_NAVIGATE',
        url: 'test1',
      });
      expect(history.getCommits()).to.have.length(1);
      expect(state.history.pages).to.have.length(0);
    });

    it('should add waiting commit when navigate request is send', () => {
      state = history(state, {
        type: '@@history/NAVIGATE',
        url: 'test1',
      });
      expect(history.getCommits()).to.have.length(1);
      expect(state.history.pages).to.have.length(1);
      expect(state.history.pages[0]).to.be.eql({
        id: 0,
        meta: {},
        url: 'test1',
      });
    });

    it('should be able to handle multible pages', () => {
      state = history(state, {
        type: '@@history/BEFORE_NAVIGATE',
        url: 'test2',
      });
      state = history(state, {
        type: '@@history/NAVIGATE',
        url: 'test2',
      });
      expect(state.history.pages).to.have.length(2);
      expect(state.history.pages[0]).to.be.eql({
        id: 0,
        meta: {},
        url: 'test1',
      });
      expect(state.history.pages[1]).to.be.eql({
        id: 1,
        meta: {},
        url: 'test2',
      });
    });

    it('should remove to top page on back', () => {
      state = history(state, {
        type: '@@history/TRAVEL',
      });
      expect(state.history.pages).to.have.length(1);
      expect(state.history.pages[0]).to.be.eql({
        id: 0,
        meta: {},
        url: 'test1',
      });
    });

    it('should not return ', () => {
      state = history(state, {
        type: '@@history/TRAVEL',
      });
      expect(state.history.pages).to.have.length(0);
    });

    it('should call after navigate', () => {
      state = history(state, {
        type: '@@history/BEFORE_NAVIGATE',
        url: 'test2',
      });
      state = history(state, {
        type: '@@history/NAVIGATE',
        url: 'test2',
      });

      return asyncWait.then((args) => {
        expect(args).to.have.length(1);
      });
    });
  });
});
