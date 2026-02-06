(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const clearChildren = (element) => {
    if (!element) return;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  const setText = (element, text) => {
    if (!element) return;
    element.textContent = text;
  };

  const createEl = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  window.CRM.utils.dom = { $, $$, clearChildren, setText, createEl };
})();
