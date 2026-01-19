// ==UserScript==
// @name         perplexity-clicker
// @namespace    https://github.com/frostius/perplexity-clicker
// @version      1.2
// @author       Matt Frost
// @description  Auto-close perplexity requests to login or subscribe
// @match        *://*.perplexity.ai/*
// @grant        none
// @run-at       document-idle
// @source       https://github.com/frostius/perplexity-clicker
// @updateURL    https://raw.githubusercontent.com/frostius/perplexity-clicker/refs/heads/main/auto-clicker.js
// @downloadURL  https://raw.githubusercontent.com/frostius/perplexity-clicker/refs/heads/main/auto-clicker.js
// ==/UserScript==

(function () {
  'use strict';
  const LOG_LOAD   = false;
  const LOG_CLICK  = false;
  const LOG_TEXT   = false;
  const SHOW_TOAST = true;
  const NAME = 'chillPlex';

  /** add buttons here to be matched
   * @type {Button[]} */
  const BUTTONS = [
    {name:'Sign in', match:'div>button[type="button"]', action:'delete',
      delete:{up:3,match:'div'},
      texts:[{up:2,match:'div',text:'Sign in or create an account'}]},
    {name:'SSO', match:'div[data-testid="login-modal"] button[type="button"]',
      texts:[
        {match:':scope>div',text:'Close'},
        {up:4,match:'div',text:'Sign up below to unlock the full potential of Perplexity'}
      ]},
    {name:'Save Interests', match:'div.relative>div>button[type="button"]',
      texts:[
        {up:1,match:':scope>div>div',text:'Make it yours'},
        {up:2,match:':scope>div>button>div>div',text:'Save Interests'},
      ]},
    {name:'Comet', match:'div>button[type="button"]',
      texts:[{up:2,match:':scope>div>div>button>div>div',text:'Download Comet'}]},
    {name:'App', match:'div>button[type="button"]',
      texts:[{up:2,match:'div',text:'Download now'}]},
    {name:'New button', match:'div>button[type="button"]',action:'escape',
      texts:[{up:2,match:'h1',text:'Lose your answer?'}]},
    {name:'Comet overlay', match:'div>button[type="button"]',action:'escape',
      texts:[{match:':scope>div>div',text:'Download Comet'}]},
    {name:'Open App', match:'div>button[type="button"]',action:'escape',
      texts:[
        {match:':scope>div>div',text:'Open Perplexity app'},
        {up:1,match:'h1',text:'One verified answer to any question'}]},
    // {name:'Google sign in', match:'div#close[role="button"]', text:{up:1,tagName:'div',text:'Sign in with Google'}},
  ];

//--- pattern matching

  /** if node matches button text pattern, return matching node
   * @param {HTMLElement} node
   * @param {Button} button */
  function hasText(node,button) {
    if( !button.texts ) return;
    let match;
    for(const ptn of button.texts) {
      if( match = matchPattern(node,button,ptn) )
        return match;
    }
  }

  /** if node matches pattern, return element that matched
   * @param {HTMLElement} node root node
   * @param {Button} button source button
   * @param {Pattern} ptn match pattern */
  function matchPattern(node,button,ptn) {

    //ascend 'up' levels
    const up = Number.isFinite(ptn?.up) ?Math.abs(ptn?.up) :0;
    let nText = node;
    for(let i=0;i<up && nText;i++)
      nText = nText?.parentElement;
    if( !nText ) return;

    //limit match to children
    let match;
    for(const e of nText.querySelectorAll(ptn.match)) {
      if( !ptn.text ) return e;
      if( match = matchChildText(e,button,ptn) )
        return match;
    }
  }

  /** if node matches button text test, return node that matched
   * @param {Element} node
   * @param {Button} button
   * @param {Pattern} bText */
  function matchChildText(node,button,bText) {
    if( normalizeText(node?.textContent) == bText.text) {
      if( LOG_TEXT) console.log(`found ${button.name} text:${bText.text}`);
      return node;
    }
  }

  /** @param {string} text */
  function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

//--- button matching

  // Click all matching buttons
  function clickButtons() {
    for(const b of BUTTONS)
      for(const node of document.querySelectorAll(b.match) )
        clickIfButton(/** @type {HTMLElement}*/(node),b);
  }

  /** click node that matched button
   * @param {HTMLElement} node
   * @param {Button} btn */
  function clickIfButton(node,btn) {
    if( !isVisible(node) ) return;
    if( findButton(node) !== btn ) return;
    if( btn.action==='escape' )
      sendEscape(node,btn);
    else if( btn.action==='delete')
      deleteButton(node,btn);
    else if(node?.click)
      clickButton(node,btn);
  }

  /** find button that meets all criteria for `node`
   * @param {HTMLElement} node */
  function findButton(node) {
    for(const b of BUTTONS) {
      if( !node?.matches(b.match) ) continue;
      if( !hasText(node,b) ) continue;
      return b;
    }
  }

  /** @param {HTMLElement} node */
  function isVisible(node) {
    if( node.checkVisibility )
      return node.checkVisibility({ opacityProperty: true, visibilityProperty:true, contentVisibilityAuto:true})
    return node.offsetParent && node.offsetHeight>0;
  }

//--- actions

  /** Send escape key to button
   * @param {HTMLElement} node
   * @param {Button} button */
  function sendEscape(node,button) {
    if( !button ) return;
    if(LOG_CLICK) console.log(`auto-clicked button:${button?.name}`);
    if(SHOW_TOAST) showToast(`escaped ${button?.name}`);
    const ESCAPE_EVENT = new KeyboardEvent('keydown', {
      key: 'Escape',
      keyCode: 27,
      code: 'Escape',
      which: 27,
      bubbles: true });
    node.dispatchEvent(ESCAPE_EVENT);
  }

  /**
   * Delete button and wrapper
   * @param {HTMLElement} node
   * @param {Button} button */
  function deleteButton(node,button) {
    if( !button ) return;
    const match = matchPattern(node,button,button.delete);
    if(LOG_CLICK) console.log(`deleted button:${button?.name}`);
    if(SHOW_TOAST) showToast(`deleted ${button?.name}`);
    match.remove();
  }

  /**
   * @param {HTMLElement} node
   * @param {Button} button */
  function clickButton(node,button) {
    if( !node?.click ) return;
    if( !button ) return;
    if(LOG_CLICK) console.log(`auto-clicked button:${button?.name}`);
    if(SHOW_TOAST) showToast(`clicked ${button?.name}`);
    node.click();
  }

//--- toast
  const TOAST_TIME = 2000;
  const TOAST_FADE = 0.3;

  /** Show message as toast
   * @param {string} msg */
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px', right: '20px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '1rem',
      zIndex: 99999,
      opacity: '0',
      transition: `opacity ${TOAST_FADE}s ease`,
      pointerEvents: 'none',
    });
    document.body.appendChild(toast);

    // Fade in
    requestAnimationFrame(() => { toast.style.opacity = '1'; });

    // Fade out and remove after `TOAST_TIME`
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, TOAST_TIME);
  }

//--- mutation watcher

  // Debounce timer for mutation
  let mutationTimeout = null;
  const MUTATION_DEBOUNCE_MS = 250;

  // DOM mutation handler
  function mutationCallback() {
    if (mutationTimeout) clearTimeout(mutationTimeout); //abort auto-click
    mutationTimeout = setTimeout(() => {
      clickButtons();
    }, MUTATION_DEBOUNCE_MS);
  }

  // Setup MutationObserver on document.body to watch for added nodes/subtree changes
  const observer = new MutationObserver(mutationCallback);
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial run in case buttons already exist
  clickButtons();

  //test on schedule in case mutation observer fails
  setInterval(()=>{ clickButtons(); }, 1500)
  if( LOG_LOAD  ) console.log(`${NAME} loaded`);

})();

/** Button match
 * @typedef Pattern
 * @property {number} [up] number of parents to ascend before matching
 * @property {string} [match] CSS match to get text node (after `up`)
 * @property {string} [text] exact `textContent` of matching node
 */

/**
 * @typedef Button
 * @property {string} name button unique description
 * @property {string} match CSS match to find button.  Does not have to be unique
 * @property {'escape'|'click'|'delete'} [action] action on matching button
 * @property {Pattern =} delete match for `delete` action
 * @property {Pattern[] =} texts text matches relative to button
 */
