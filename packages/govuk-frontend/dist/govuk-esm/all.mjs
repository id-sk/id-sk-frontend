export { version } from './common/govuk-frontend-version.mjs';
import Accordion from './components/accordion/accordion.mjs';
import Button from './components/button/button.mjs';
import CharacterCount from './components/character-count/character-count.mjs';
import Checkboxes from './components/checkboxes/checkboxes.mjs';
import Details from './components/details/details.mjs';
import ErrorSummary from './components/error-summary/error-summary.mjs';
import Header from './components/header/header.mjs';
import IdskAccordion from './components/idsk-accordion/idsk-accordion.mjs';
import IdskButton from './components/idsk-button/idsk-button.mjs';
import IdskCrossroad from './components/idsk-crossroad/idsk-crossroad.mjs';
import IdskCustomerSurveys from './components/idsk-customer-surveys/idsk-customer-surveys.mjs';
import IdskFeedback from './components/idsk-feedback/idsk-feedback.mjs';
import IdskFooterExtended from './components/idsk-footer-extended/idsk-footer-extended.mjs';
import IdskHeader from './components/idsk-header/idsk-header.mjs';
import IdskHeaderExtended from './components/idsk-header-extended/idsk-header-extended.mjs';
import IdskHeaderWeb from './components/idsk-header-web/idsk-header-web.mjs';
import IdskInPageNavigation from './components/idsk-in-page-navigation/idsk-in-page-navigation.mjs';
import IdskInteractiveMap from './components/idsk-interactive-map/idsk-interactive-map.mjs';
import IdskRegistrationForEvent from './components/idsk-registration-for-event/idsk-registration-for-event.mjs';
import IdskSearchComponent from './components/idsk-search-component/idsk-search-component.mjs';
import IdskSearchResults from './components/idsk-search-results/idsk-search-results.mjs';
import IdskSearchResultsFilter from './components/idsk-search-results-filter/idsk-search-results-filter.mjs';
import IdskStepper from './components/idsk-stepper/idsk-stepper.mjs';
import IdskSubscriptionForm from './components/idsk-subscription-form/idsk-subscription-form.mjs';
import IdskTable from './components/idsk-table/idsk-table.mjs';
import IdskTableFilter from './components/idsk-table-filter/idsk-table-filter.mjs';
import IdskTabs from './components/idsk-tabs/idsk-tabs.mjs';
import NotificationBanner from './components/notification-banner/notification-banner.mjs';
import Radios from './components/radios/radios.mjs';
import SkipLink from './components/skip-link/skip-link.mjs';
import Tabs from './components/tabs/tabs.mjs';

/**
 * Initialise all components
 *
 * Use the `data-module` attributes to find, instantiate and init all of the
 * components provided as part of GOV.UK Frontend.
 *
 * @param {Config} [config] - Config for all components
 */
function initAll (config) {
  config = typeof config !== 'undefined' ? config : {};

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var $scope = config.scope instanceof HTMLElement ? config.scope : document;

  var $accordions = $scope.querySelectorAll('[data-module="govuk-accordion"]');
  $accordions.forEach(function ($accordion) {
    new Accordion($accordion, config.accordion).init();
  });

  var $buttons = $scope.querySelectorAll('[data-module="govuk-button"]');
  $buttons.forEach(function ($button) {
    new Button($button, config.button).init();
  });

  var $characterCounts = $scope.querySelectorAll('[data-module="govuk-character-count"]');
  $characterCounts.forEach(function ($characterCount) {
    new CharacterCount($characterCount, config.characterCount).init();
  });

  var $checkboxes = $scope.querySelectorAll('[data-module="govuk-checkboxes"]');
  $checkboxes.forEach(function ($checkbox) {
    new Checkboxes($checkbox).init();
  });

  var $details = $scope.querySelectorAll('[data-module="govuk-details"]');
  $details.forEach(function ($detail) {
    new Details($detail).init();
  });

  // Find first error summary module to enhance.
  var $errorSummary = $scope.querySelector('[data-module="govuk-error-summary"]');
  if ($errorSummary) {
    new ErrorSummary($errorSummary, config.errorSummary).init();
  }

  // Find first header module to enhance.
  var $header = $scope.querySelector('[data-module="govuk-header"]');
  if ($header) {
    new Header($header).init();
  }

  var $notificationBanners = $scope.querySelectorAll('[data-module="govuk-notification-banner"]');
  $notificationBanners.forEach(function ($notificationBanner) {
    new NotificationBanner($notificationBanner, config.notificationBanner).init();
  });

  var $radios = $scope.querySelectorAll('[data-module="govuk-radios"]');
  $radios.forEach(function ($radio) {
    new Radios($radio).init();
  });

  // Find first skip link module to enhance.
  var $skipLink = $scope.querySelector('[data-module="govuk-skip-link"]');
  if ($skipLink) {
    new SkipLink($skipLink).init();
  }

  var $tabs = $scope.querySelectorAll('[data-module="govuk-tabs"]');
  $tabs.forEach(function ($tabs) {
    new Tabs($tabs).init();
  });

  var $idskAccordions = $scope.querySelectorAll('[data-module="idsk-accordion"]');
  $idskAccordions.forEach(function ($idskAccordions) {
    new IdskAccordion($idskAccordions).init();
  });

  var $idskButtons = $scope.querySelectorAll('[data-module="idsk-button"]');
  $idskButtons.forEach(function ($idskButtons) {
    new IdskButton($idskButtons).init();
  });

  var $idskCrossroad = $scope.querySelectorAll('[data-module="idsk-crossroad"]');
  $idskCrossroad.forEach(function ($idskCrossroad) {
    new IdskCrossroad($idskCrossroad).init();
  });

  var $idskCustomerSurveys = $scope.querySelectorAll('[data-module="idsk-customer-surveys"]');
  $idskCustomerSurveys.forEach(function ($idskCustomerSurveys) {
    new IdskCustomerSurveys($idskCustomerSurveys).init();
  });

  var $idskFeedback = $scope.querySelectorAll('[data-module="idsk-feedback"]');
  $idskFeedback.forEach(function ($idskFeedback) {
    new IdskFeedback($idskFeedback).init();
  });

  var $idskFooterExtended = $scope.querySelectorAll('[data-module="idsk-footer-extended"]');
  $idskFooterExtended.forEach(function ($idskFooterExtended) {
    new IdskFooterExtended($idskFooterExtended).init();
  });

  var $idskHeader = $scope.querySelectorAll('[data-module="idsk-header"]');
  $idskHeader.forEach(function ($idskHeader) {
    new IdskHeader($idskHeader).init();
  });

  var $idskHeaderExtended = $scope.querySelectorAll('[data-module="idsk-header-extended"]');
  $idskHeaderExtended.forEach(function ($idskHeaderExtended) {
    new IdskHeaderExtended($idskHeaderExtended).init();
  });

  var $idskHeaderWeb = $scope.querySelectorAll('[data-module="idsk-header-web"]');
  $idskHeaderWeb.forEach(function ($idskHeaderWeb) {
    new IdskHeaderWeb($idskHeaderWeb).init();
  });

  var $idskInPageNavigation = $scope.querySelectorAll('[data-module="idsk-in-page-navigation"]');
  $idskInPageNavigation.forEach(function ($idskInPageNavigation) {
    new IdskInPageNavigation($idskInPageNavigation).init();
  });

  var idskInteractiveMap = $scope.querySelectorAll('[data-module="idsk-interactive-map"]');
  idskInteractiveMap.forEach(function (idskInteractiveMap) {
    new IdskInteractiveMap(idskInteractiveMap).init();
  });

  var $idskRegistrationForEvent = $scope.querySelectorAll('[data-module="idsk-registration-for-event"]');
  $idskRegistrationForEvent.forEach(function ($idskRegistrationForEvent) {
    new IdskRegistrationForEvent($idskRegistrationForEvent).init();
  });

  var $idskSearchComponent = $scope.querySelectorAll('[data-module="idsk-search-component"]');
  $idskSearchComponent.forEach(function ($idskSearchComponent) {
    new IdskSearchComponent($idskSearchComponent).init();
  });

  var $idskSearchResults = $scope.querySelectorAll('[data-module="idsk-search-results"]');
  $idskSearchResults.forEach(function ($idskSearchResults) {
    new IdskSearchResults($idskSearchResults).init();
  });

  var $idskSearchResultsFilter = $scope.querySelectorAll('[data-module="idsk-search-results-filter"]');
  $idskSearchResultsFilter.forEach(function ($idskSearchResultsFilter) {
    new IdskSearchResultsFilter($idskSearchResultsFilter).init();
  });

  var $idskStepper = $scope.querySelectorAll('[data-module="idsk-stepper"]');
  $idskStepper.forEach(function ($idskStepper) {
    new IdskStepper($idskStepper).init();
  });

  var $idskSubscriptionForm = $scope.querySelectorAll('[data-module="idsk-stepper"]');
  $idskSubscriptionForm.forEach(function ($idskSubscriptionForm) {
    new IdskSubscriptionForm($idskSubscriptionForm).init();
  });

  var $idskTable = $scope.querySelectorAll('[data-module="idsk-table"]');
  $idskTable.forEach(function ($idskTable) {
    new IdskTable($idskTable).init();
  });

  var $idskTableFilter = $scope.querySelectorAll('[data-module="idsk-table-filter"]');
  $idskTableFilter.forEach(function ($idskTableFilter) {
    new IdskTableFilter($idskTableFilter).init();
  });

  var $idskTabs = $scope.querySelectorAll('[data-module="idsk-tabs"]');
  $idskTabs.forEach(function ($idskTabs) {
    new IdskTabs($idskTabs).init();
  });
}

/**
 * Config for all components via `initAll()`
 *
 * @typedef {object} Config
 * @property {Element} [scope=document] - Scope to query for components
 * @property {AccordionConfig} [accordion] - Accordion config
 * @property {ButtonConfig} [button] - Button config
 * @property {CharacterCountConfig} [characterCount] - Character Count config
 * @property {ErrorSummaryConfig} [errorSummary] - Error Summary config
 * @property {NotificationBannerConfig} [notificationBanner] - Notification Banner config
 */

/**
 * Config for individual components
 *
 * @typedef {import('./components/accordion/accordion.mjs').AccordionConfig} AccordionConfig
 * @typedef {import('./components/accordion/accordion.mjs').AccordionTranslations} AccordionTranslations
 * @typedef {import('./components/button/button.mjs').ButtonConfig} ButtonConfig
 * @typedef {import('./components/character-count/character-count.mjs').CharacterCountConfig} CharacterCountConfig
 * @typedef {import('./components/character-count/character-count.mjs').CharacterCountConfigWithMaxLength} CharacterCountConfigWithMaxLength
 * @typedef {import('./components/character-count/character-count.mjs').CharacterCountConfigWithMaxWords} CharacterCountConfigWithMaxWords
 * @typedef {import('./components/character-count/character-count.mjs').CharacterCountTranslations} CharacterCountTranslations
 * @typedef {import('./components/error-summary/error-summary.mjs').ErrorSummaryConfig} ErrorSummaryConfig
 * @typedef {import('./components/notification-banner/notification-banner.mjs').NotificationBannerConfig} NotificationBannerConfig
 */

export { Accordion, Button, CharacterCount, Checkboxes, Details, ErrorSummary, Header, IdskAccordion, IdskButton, IdskCrossroad, IdskCustomerSurveys, IdskFeedback, IdskFooterExtended, IdskHeader, IdskHeaderExtended, IdskHeaderWeb, IdskInPageNavigation, IdskInteractiveMap, IdskRegistrationForEvent, IdskSearchComponent, IdskSearchResults, IdskSearchResultsFilter, IdskStepper, IdskSubscriptionForm, IdskTable, IdskTableFilter, IdskTabs, NotificationBanner, Radios, SkipLink, Tabs, initAll };
//# sourceMappingURL=all.mjs.map
