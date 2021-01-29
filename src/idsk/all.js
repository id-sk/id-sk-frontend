import { nodeListForEach } from "./common";
import { initAll as initAllGOVUKjs } from "../govuk/all";
import Button from "./components/button/button";
import Feedback from "./components/feedback/feedback";
import FooterExtended from "./components/footer-extended/footer-extended";
import CharacterCount from "./components/character-count/character-count";
import Crossroad from "./components/crossroad/crossroad";
import HeaderExtended from './components/header-extended/header-extended';

function initAll(options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== "undefined" ? options : {};

  // Allow the user to initialise ID-SK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  const scope = typeof options.scope !== 'undefined' ? options.scope : document

  const $buttons = scope.querySelectorAll('[data-module="idsk-button"]')
  nodeListForEach($buttons, function ($button) {
    new Button($button).init()
  })

  const $feedback = scope.querySelectorAll(
    '[data-module="feedback"]'
  );
  nodeListForEach($feedback, function ($feedback) {
    new Feedback($feedback).init();
  });
  // Find first Footer-extended module to enhance.
  const $footerExtended = scope.querySelectorAll(
    '[data-module="idsk-footer-extended"]'
  );
  nodeListForEach($footerExtended, function ($footerExtended) {
    new FooterExtended($footerExtended).init();
  });

  const $characterCounts = scope.querySelectorAll(
    '[data-module="idsk-character-count"]'
  );
  nodeListForEach($characterCounts, function ($characterCount) {
    new CharacterCount($characterCount).init();
  });

  const $crossroad = scope.querySelectorAll('[data-module="idsk-crossroad"]');
  nodeListForEach($crossroad, function ($crossroad) {
    new Crossroad($crossroad).init();
  });

  // Find first Header-extended module to enhance.
  const $headersExtended = scope.querySelectorAll('[data-module="idsk-header-extended"]')
  nodeListForEach($headersExtended, function ($headerExtended) {
    new HeaderExtended($headerExtended).init()
  })

  // Init all GOVUK components js
  initAllGOVUKjs(options);
}

export {
  initAll,
  Button,
  CharacterCount,
  Crossroad,
  Feedback,
  FooterExtended,
  HeaderExtended
}