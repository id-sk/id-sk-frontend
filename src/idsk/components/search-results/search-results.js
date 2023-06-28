import '../../../govuk/vendor/polyfills/Function/prototype/bind'
import '../../../govuk/vendor/polyfills/Event' // addEventListener and event.target normalization
import { toggleClass } from "../../common";

function SearchResults($module) {
    this.$module = $module
}

SearchResults.prototype.init = function () {
    // Check for module
    if (!this.$module) {
        return
    }
    var $module = this.$module
    $module.resultCards = new Array();
    $module.countOfCardsPerPage = new Number();
    $module.currentPageNumber = new Number();
    $module.subTopicButton = $module.querySelector('.idsk-search-results__subtopic')

    if ($module.subTopicButton) {
        $module.subTopicButton.disabled = true
    }

    // Check for button
    var $links = $module.querySelectorAll('.idsk-search-results__link')
    if (!$links) {
        return
    }

    var $resultsPerPageDropdown = $module.querySelector('.idsk-search-results__content .govuk-select')
    if (!$resultsPerPageDropdown) {
        return
    }

    var $backButton = $module.querySelector('.idsk-search-results__button--back')
    if (!$backButton) {
        return
    }

    var $forwardButton = $module.querySelector('.idsk-search-results__button--forward')
    if (!$forwardButton) {
        return
    }

    var $backButtonMobile = $module.querySelector('.idsk-search-results__button--back__mobile')
    if (!$backButton) {
        return
    }

    var $forwardButtonMobile = $module.querySelector('.idsk-search-results__button--forward__mobile')
    if (!$forwardButton) {
        return
    }

    $module.resultCards = $module.querySelectorAll('.idsk-search-results__card')
    if (!$module.resultCards) {
        return
    }

    var $linkPanelButtons = $module.querySelectorAll('.idsk-search-results__link-panel-button')
    if (!$linkPanelButtons) {
        return
    }

    var $filtersButtonMobile = $module.querySelector('.idsk-search-results__filters__button')
    if (!$filtersButtonMobile) {
        return
    }

    var $turnFiltersOffButtonMobile = $module.querySelector('.idsk-search-results__button--turn-filters-off')
    if (!$turnFiltersOffButtonMobile) {
        return
    }

    var $showResultsButtonMobile = $module.querySelector('.idsk-search-results__button-show-results')
    if (!$showResultsButtonMobile) {
        return
    }

    var $backToResultsButtonMobile = $module.querySelector('.idsk-search-results__button--back-to-results')
    if (!$backToResultsButtonMobile) {
        return
    }

    var $radioButtonsInput = $module.querySelectorAll('.idsk-search-results__filter .govuk-radios__input ')
    if (!$radioButtonsInput) {
        return
    }

    var $contentTypeCheckBoxes = $module.querySelectorAll('.idsk-search-results__filter .govuk-checkboxes__input ')
    if (!$contentTypeCheckBoxes) {
        return
    }

    var $dateFrom = $module.querySelector('#datum-od')
    var $dateTo = $module.querySelector('#datum-do')


    var $topicSearchInput = $module.querySelector('#idsk-search-input__topic')
    if ($topicSearchInput) {
        $topicSearchInput.addEventListener('keyup', this.handleSearchItemsFromInput.bind(this, 'radios'))
    }

    var $subtopicSearchInput = $module.querySelector('#idsk-search-input__subtopic')
    if ($subtopicSearchInput) {
        $subtopicSearchInput.addEventListener('keyup', this.handleSearchItemsFromInput.bind(this, 'radios'))
    }

    var $contentTypeSearchInput = $module.querySelector('#idsk-search-input__content-type')
    if ($contentTypeSearchInput) {
        $contentTypeSearchInput.addEventListener('keyup', this.handleSearchItemsFromInput.bind(this, 'checkboxes'))
    }

    if ($dateFrom) {
        $dateFrom.addEventListener('focusout', this.handleFillDate.bind(this, 'from'))
        if ($dateFrom.value != '') {
            this.handleFillDate.call(this, 'from', $dateFrom)
        }
        $dateTo.addEventListener('focusout', this.handleFillDate.bind(this, 'to'))
        if ($dateTo.value != '') {
            this.handleFillDate.call(this, 'to', $dateTo)
        }
    }

    $backButton.addEventListener('click', this.handleClickPreviousPage.bind(this))
    $forwardButton.addEventListener('click', this.handleClickNextPage.bind(this))
    $backButtonMobile.addEventListener('click', this.handleClickPreviousPage.bind(this))
    $forwardButtonMobile.addEventListener('click', this.handleClickNextPage.bind(this))
    $filtersButtonMobile.addEventListener('click', this.handleClickFiltersButton.bind(this))
    $turnFiltersOffButtonMobile.addEventListener('click', this.handleClickTurnFiltersOffButton.bind(this))
    $showResultsButtonMobile.addEventListener('click', this.handleClickShowResultsButton.bind(this))
    $backToResultsButtonMobile.addEventListener('click', this.handleClickShowResultsButton.bind(this))
    $module.boundHandleClickLinkPanel = this.handleClickLinkPanel.bind(this)

    // set selected value in dropdown
    $module.countOfCardsPerPage = $resultsPerPageDropdown.value
    $module.currentPageNumber = 1
    this.showResultCardsPerPage.call(this, 0, $resultsPerPageDropdown.value)
    $resultsPerPageDropdown.addEventListener('change', this.handleClickResultsPerPageDropdown.bind(this))
    $filtersButtonMobile.innerText = $filtersButtonMobile.title + '(0)'

    $linkPanelButtons.forEach(function ($button) {
        $button.addEventListener('click', $module.boundHandleClickLinkPanel, true)
    }.bind(this))

    $radioButtonsInput.forEach(function ($input) {
        $input.addEventListener('click', this.handleClickRadioButton.bind(this), true)
        if ($input.checked) {
            this.handleClickRadioButton.call(this, $input)
        }
    }.bind(this))

    $contentTypeCheckBoxes.forEach(function ($checkBox) {
        $checkBox.addEventListener('click', this.handleClickContentTypeCheckBox.bind(this), true)
        if ($checkBox.checked) {
            this.handleClickContentTypeCheckBox.call(this, $checkBox)
        }
    }.bind(this))

    this.handleClickFiltersButton.call(this)
    this.handleClickShowResultsButton.call(this)
}

/**
 * function for handling show results button and 'back to results' button in mobile view
 * hiding and showing elements - mobile version only
 *
 */
SearchResults.prototype.handleClickShowResultsButton = function (e) {
    var $module = this.$module
    var $filterBar = $module.querySelector('.idsk-search-results__filter')
    var $searchBar = $module.querySelector('.idsk-search-results .idsk-search-results__search-bar')
    var $searchBarTitle = $module.querySelector('.idsk-search-results .idsk-intro-block__search__span')
    var $orderByDropdown = $module.querySelector('.idsk-search-results--order__dropdown')
    var $resultsPerPage = $module.querySelector('.idsk-search-results__filter-panel--mobile')
    var $orderByDropdownMobile = $module.querySelector('.idsk-search-results--order')
    var $pagingMobile = $module.querySelector('.idsk-search-results__page-number--mobile')
    var $pagingDesktop = $module.querySelector('.idsk-search-results__content__page-changer')
    var $searchResultsAll = $module.querySelector('.idsk-search-results__content__all')
    var $filterHeaderPanel = $module.querySelector('.idsk-search-results__filter-header-panel')
    var $pickedFiltersPanel = $module.querySelector('.idsk-search-results__content__picked-filters')
    var $showResultsButton = $module.querySelector('.idsk-search-results__show-results__button')
    var $contentContainer = $module.querySelector('.idsk-search-results__content')
    var $title = $module.querySelector('.idsk-search-results__title')
    var $header = document.getElementsByTagName('header');
    var $footer = document.getElementsByTagName('footer');
    var $breadcrumbs = document.getElementsByClassName('govuk-breadcrumbs');

    $title.classList.remove('idsk-search-results--invisible__mobile')
    $contentContainer.classList.remove('idsk-search-results--invisible__mobile')
    $showResultsButton.classList.add('idsk-search-results--invisible')
    $pickedFiltersPanel.classList.add('idsk-search-results--invisible__mobile')
    $filterBar.classList.remove('idsk-search-results--visible')
    $filterHeaderPanel.classList.remove('idsk-search-results--visible__mobile--inline')
    $searchResultsAll.classList.remove('idsk-search-results--invisible__mobile')
    $pagingMobile.classList.remove('idsk-search-results--invisible')
    $pagingDesktop.classList.remove('idsk-search-results--invisible__mobile')
    $searchBar.classList.remove('idsk-search-results--invisible__mobile')
    if ($searchBarTitle) {
        $searchBarTitle.classList.remove('idsk-search-results--invisible__mobile')
    }
    $orderByDropdown.classList.remove('idsk-search-results--invisible__mobile')
    $resultsPerPage.classList.remove('idsk-search-results--invisible__mobile')
    $orderByDropdownMobile.classList.remove('idsk-search-results--invisible')
    if ($header[0] && $footer[0] && $breadcrumbs[0]) {
        $header[0].classList.remove('idsk-search-results--invisible__mobile')
        $footer[0].classList.remove('idsk-search-results--invisible__mobile')
        $breadcrumbs[0].classList.remove('idsk-search-results--invisible__mobile')
    }
}

/**
 * function for handling whether is some filter picked, because of hiding and showing elements in container with picked items
 * returns boolean
 *
 */
SearchResults.prototype.handleSomeFilterPicked = function (e) {
    var $module = this.$module
    var $contentContainer = $module.querySelector('.idsk-search-results__content')
    var $pickedTopics = $module.querySelectorAll('.idsk-search-results__picked-topic')
    var $pickedContentTypes = $module.querySelectorAll('.idsk-search-results__picked-content-type')
    var $pickedDates = $module.querySelectorAll('.idsk-search-results__picked-date')
    var $isFilterPicked = $pickedTopics.length > 0 || $pickedContentTypes.length > 0 || $pickedDates.length > 0

    if ($isFilterPicked) {
        $contentContainer.classList.remove('idsk-search-results--invisible__mobile')
    } else {
        $contentContainer.classList.add('idsk-search-results--invisible__mobile')
    }

    return $isFilterPicked
}

/**
 * function for counting selected filters, for mobile button 'Filters' purposes
 *
 */
SearchResults.prototype.handleCountForFiltersButton = function (e) {
    var $module = this.$module
    var $pickedTopics = $module.querySelectorAll('.idsk-search-results__picked-topic')
    var $pickedContentTypes = $module.querySelectorAll('.idsk-search-results__picked-content-type')
    var $pickedDates = $module.querySelectorAll('.idsk-search-results__picked-date')
    var $filtersButtonMobile = $module.querySelector('.idsk-search-results__filters__button')
    var $countOfPickedFilters = $pickedTopics.length + $pickedContentTypes.length + $pickedDates.length

    $filtersButtonMobile.innerText = $filtersButtonMobile.title + '(' + $countOfPickedFilters + ')'
}

/**
 * function for disabling all picked filters
 *
 */
SearchResults.prototype.handleClickTurnFiltersOffButton = function (e) {
    var $module = this.$module
    var $contentContainer = $module.querySelector('.idsk-search-results__content')
    var $pickedTopics = $module.querySelectorAll('.idsk-search-results__picked-topic')
    var $pickedContentTypes = $module.querySelectorAll('.idsk-search-results__picked-content-type')
    var $pickedDates = $module.querySelectorAll('.idsk-search-results__picked-date')
    var $filtersButtonMobile = $module.querySelector('.idsk-search-results__filters__button')

    $contentContainer.classList.add('idsk-search-results--invisible__mobile')
    $filtersButtonMobile.innerText = $filtersButtonMobile.title + '(0)'

    $pickedTopics.forEach(function ($topic) {
        this.handleRemovePickedTopic.call(this, $topic);
    }.bind(this))

    $pickedContentTypes.forEach(function ($contentType) {
        this.handleRemovePickedContentType.call(this, $contentType);
    }.bind(this))

    $pickedDates.forEach(function ($date) {
        this.handleRemovePickedDate.call(this, $date);
    }.bind(this))
}

/**
 * function for changing view for mobile after click on "Filters" button
 *
 */
SearchResults.prototype.handleClickFiltersButton = function (e) {
    var $module = this.$module
    var $filterBar = $module.querySelector('.idsk-search-results__filter')
    var $searchBar = $module.querySelector('.idsk-search-results .idsk-search-results__search-bar')
    var $searchBarTitle = $module.querySelector('.idsk-search-results .idsk-intro-block__search__span')
    var $orderByDropdown = $module.querySelector('.idsk-search-results--order__dropdown')
    var $resultsPerPage = $module.querySelector('.idsk-search-results__filter-panel--mobile')
    var $orderByDropdownMobile = $module.querySelector('.idsk-search-results--order')
    var $pagingMobile = $module.querySelector('.idsk-search-results__page-number--mobile')
    var $pagingDesktop = $module.querySelector('.idsk-search-results__content__page-changer')
    var $searchResultsAll = $module.querySelector('.idsk-search-results__content__all')
    var $filterHeaderPanel = $module.querySelector('.idsk-search-results__filter-header-panel')
    var $pickedFiltersPanel = $module.querySelector('.idsk-search-results__content__picked-filters')
    var $showResultsButton = $module.querySelector('.idsk-search-results__show-results__button')
    var $title = $module.querySelector('.idsk-search-results__title')
    var $header = document.getElementsByTagName('header');
    var $footer = document.getElementsByTagName('footer');
    var $breadcrumbs = document.getElementsByClassName('govuk-breadcrumbs');

    if (this.handleSomeFilterPicked.call(this)) {
        $showResultsButton.classList.remove('idsk-search-results--invisible')
        $pickedFiltersPanel.classList.remove('idsk-search-results--invisible__mobile')
    }

    $title.classList.add('idsk-search-results--invisible__mobile')
    $filterBar.classList.add('idsk-search-results--visible')
    $filterHeaderPanel.classList.add('idsk-search-results--visible__mobile--inline')
    $searchResultsAll.classList.add('idsk-search-results--invisible__mobile')
    $pagingMobile.classList.add('idsk-search-results--invisible')
    $pagingDesktop.classList.add('idsk-search-results--invisible__mobile')
    $searchBar.classList.add('idsk-search-results--invisible__mobile')
    if ($searchBarTitle) {
        $searchBarTitle.classList.add('idsk-search-results--invisible__mobile')
    }
    $orderByDropdown.classList.add('idsk-search-results--invisible__mobile')
    $resultsPerPage.classList.add('idsk-search-results--invisible__mobile')

    if ($header[0] && $footer[0] && $breadcrumbs[0]) {
        $header[0].classList.add('idsk-search-results--invisible__mobile')
        $footer[0].classList.add('idsk-search-results--invisible__mobile')
        $breadcrumbs[0].classList.add('idsk-search-results--invisible__mobile')
    }
    $orderByDropdownMobile.classList.add('idsk-search-results--invisible')
}

SearchResults.prototype.handleClickPreviousPage = function (e) {
    var $module = this.$module

    location.href = "#";
    $module.currentPageNumber = $module.currentPageNumber - 1
    this.showResultCardsPerPage.call(this, $module.countOfCardsPerPage * ($module.currentPageNumber - 1), $module.countOfCardsPerPage * $module.currentPageNumber);
}

SearchResults.prototype.handleClickNextPage = function (e) {
    var $module = this.$module

    location.href = "#";
    $module.currentPageNumber = $module.currentPageNumber + 1
    this.showResultCardsPerPage.call(this, $module.countOfCardsPerPage * ($module.currentPageNumber - 1), $module.countOfCardsPerPage * $module.currentPageNumber);
}

SearchResults.prototype.handleClickResultsPerPageDropdown = function (e) {
    var $el = e.target || e.srcElement
    var $module = this.$module

    $module.countOfCardsPerPage = $el.value
    this.showResultCardsPerPage.call(this, 0, $el.value);
}

SearchResults.prototype.handleSearchItemsFromInput = function ($type, e) {
    var $el = e.target || e.srcElement
    var $linkPanelButton = $el.closest('.idsk-search-results__link-panel')

    var $items = $linkPanelButton.querySelectorAll('.govuk-' + $type + '__item')
    $items.forEach(function ($item) {
        $item.classList.remove('idsk-search-results--invisible')
    }.bind(this))
    $items.forEach(function ($item) {
        var $labelItem = $item.querySelector('.govuk-' + $type + '__label')

        if (!$labelItem.innerText.toLowerCase().includes($el.value.toLowerCase())) {
            $item.classList.add('idsk-search-results--invisible')
        }
    }.bind(this))
}

SearchResults.prototype.handleFillDate = function ($period, e) {
    var $el = e.target || e.srcElement || e
    var $module = this.$module
    var $choosenDatesInFiltersContainer = $module.querySelector('.idsk-search-results__content__picked-filters__date')
    var $class = 'idsk-search-results__picked-date'
    var $dateElementInContainer = $choosenDatesInFiltersContainer.querySelector('[data-source="' + $el.id + '"]')
    var $contentContainer = $module.querySelector('.idsk-search-results__content')

    if ($el.value == '' || !($el.value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/) || $el.value.match(/^(\d{4})$/))) {
        return;
    }

    if ($el.value && !$dateElementInContainer) {
        var $contentTypePicked = this.createTopicInContainer.call(this, $choosenDatesInFiltersContainer, $el.id, $class, $el, $el.id == 'datum-od' ? true : false);
    } else if ($dateElementInContainer) {
        $contentTypePicked = $dateElementInContainer
        $contentTypePicked.innerHTML = $el.value + ' &#10005;';
    }

    $contentContainer.classList.remove('idsk-search-results--invisible__mobile')
    $contentTypePicked.addEventListener('click', this.handleRemovePickedDate.bind(this));
    $el.value = ''
    $choosenDatesInFiltersContainer.classList.remove('idsk-search-results--invisible')
    this.checkValuesInDateContainer.call(this);
    this.changeBackgroundForPickedFilters.call(this)
}

SearchResults.prototype.handleRemovePickedDate = function (e) {
    var $el = e.target || e.srcElement || e

    $el.remove();
    this.handleSomeFilterPicked.call(this)
    this.checkValuesInDateContainer.call(this);
    this.handleCountForFiltersButton.call(this)
    this.changeBackgroundForPickedFilters.call(this)
}

SearchResults.prototype.createSpanElement = function ($class, $text) {
    var $spanElement = document.createElement('span')
    $spanElement.setAttribute('class', $class)
    $spanElement.innerHTML = $text;

    return $spanElement
}

/**
 * function for checking whether is there any date items selected in container
 *
 */
SearchResults.prototype.checkValuesInDateContainer = function (e) {
    var $choosenDatesInFiltersContainer = this.$module.querySelector('.idsk-search-results__content__picked-filters__date')
    var $beforeDateClass = 'idsk-search-results__before-date'
    var $afterDateClass = 'idsk-search-results__after-date'
    var $beforeDateSpan = $choosenDatesInFiltersContainer.querySelector('.' + $beforeDateClass)
    var $afterDateSpan = $choosenDatesInFiltersContainer.querySelector('.' + $afterDateClass)


    $beforeDateSpan ? $beforeDateSpan.remove() : false
    $afterDateSpan ? $afterDateSpan.remove() : false

    if (!$choosenDatesInFiltersContainer.querySelector('[data-source="datum-od"]') && !$choosenDatesInFiltersContainer.querySelector('[data-source="datum-do"]')) {
        $choosenDatesInFiltersContainer.classList.add('idsk-search-results--invisible')
        return
    }

    if ($choosenDatesInFiltersContainer.querySelector('[data-source="datum-od"]') && $choosenDatesInFiltersContainer.querySelector('[data-source="datum-do"]')) {
        var $beforeDateSpan = this.createSpanElement.call(this, $beforeDateClass, $choosenDatesInFiltersContainer.dataset.lines + ' ' + $choosenDatesInFiltersContainer.dataset.middle);
        var $afterDateSpan = this.createSpanElement.call(this, $afterDateClass, 'a ');

        $choosenDatesInFiltersContainer.insertBefore($beforeDateSpan, $choosenDatesInFiltersContainer.querySelector('[data-source="datum-od"]'));
        $choosenDatesInFiltersContainer.insertBefore($afterDateSpan, $choosenDatesInFiltersContainer.querySelector('[data-source="datum-do"]'));
    } else if ($choosenDatesInFiltersContainer.querySelector('[data-source="datum-od"]')) {
        var $beforeDateSpan = this.createSpanElement.call(this, $beforeDateClass, $choosenDatesInFiltersContainer.dataset.lines + ' ' + $choosenDatesInFiltersContainer.dataset.after);
        $choosenDatesInFiltersContainer.insertBefore($beforeDateSpan, $choosenDatesInFiltersContainer.querySelector('[data-source="datum-od"]'));

    } else if ($choosenDatesInFiltersContainer.querySelector('[data-source="datum-do"]')) {
        var $afterDateSpan = this.createSpanElement.call(this, $afterDateClass, $choosenDatesInFiltersContainer.dataset.lines + ' ' + $choosenDatesInFiltersContainer.dataset.before);
        $choosenDatesInFiltersContainer.insertBefore($afterDateSpan, $choosenDatesInFiltersContainer.querySelector('[data-source="datum-do"]'));
    }
}

/**
 * function for changing number of cards on page
 *
 */
SearchResults.prototype.showResultCardsPerPage = function ($startIndex, $endIndex) {
    var $module = this.$module
    var $backButton = $module.querySelector('.idsk-search-results__button--back')
    var $forwardButton = $module.querySelector('.idsk-search-results__button--forward')
    var $pageNumber = $module.querySelector('.idsk-search-results__page-number')
    var $backButtonMobile = $module.querySelector('.idsk-search-results__button--back__mobile')
    var $forwardButtonMobile = $module.querySelector('.idsk-search-results__button--forward__mobile')
    var $pageNumberMobile = $module.querySelector('.idsk-search-results__page-number__mobile')
    var $i;

    //hide all cards
    $module.resultCards.forEach(function ($card) {
        if (!$card.classList.contains('idsk-search-results--invisible')) {
            $card.classList.add('idsk-search-results--invisible')
        }
    }.bind(this))

    if ($endIndex >= $module.resultCards.length) {
        $endIndex = $module.resultCards.length
        $forwardButton.classList.add('idsk-search-results--hidden')
        $backButton.classList.remove('idsk-search-results--hidden')
        $forwardButtonMobile.classList.add('idsk-search-results--hidden')
        $backButtonMobile.classList.remove('idsk-search-results--hidden')
    } else {
        $forwardButton.classList.remove('idsk-search-results--hidden')
        $forwardButtonMobile.classList.remove('idsk-search-results--hidden')
    }

    if ($startIndex < 0) {
        $startIndex = 0
    } else if ($startIndex > 0) {
        $backButton.classList.remove('idsk-search-results--hidden')
        $backButtonMobile.classList.remove('idsk-search-results--hidden')
    } else if ($startIndex == 0) {
        $module.currentPageNumber = 1
    }

    for ($i = $startIndex; $i < $endIndex; $i++) {
        $module.resultCards[$i].classList.remove('idsk-search-results--invisible')
    }

    // hide back button if 1st page is showed
    if ($startIndex == 0 && !$backButton.classList.contains('idsk-search-results--hidden')) {
        $backButton.classList.add('idsk-search-results--hidden')
        $backButtonMobile.classList.add('idsk-search-results--hidden')
    }

    var $numberOfPages = (($module.resultCards.length / $module.countOfCardsPerPage) | 0) + 1
    var $pageNumberSpan = $module.querySelector('.idsk-search-results__page-number span')
    var $pageNumberText = $pageNumberSpan.dataset.lines.replace("$value1", $module.currentPageNumber).replace("$value2", $numberOfPages)
    $pageNumberSpan.innerText = $pageNumberText
    $pageNumberMobile.innerText = $pageNumberText
}

/**
 * An event handler for click event on $linkPanel - collapse or expand filter
 * @param {object} e
 */
SearchResults.prototype.handleClickLinkPanel = function (e) {
    var $el = e.target || e.srcElement
    var $linkPanelButton = $el.closest('.idsk-search-results__link-panel')
    var $contentPanel = $linkPanelButton.querySelector('.idsk-search-results__list')

    toggleClass($contentPanel, 'idsk-search-results--hidden')
    toggleClass($linkPanelButton, 'idsk-search-results--expand')
    if ($linkPanelButton.classList.contains('idsk-search-results--expand')) {
        $el.setAttribute('aria-expanded', 'true')
    } else {
        $el.setAttribute('aria-expanded', 'false')
    }
}

/**
 * An event handler for click event on radio button
 * @param {object} e
 */
SearchResults.prototype.handleClickRadioButton = function (e) {
    var $el = e.target || e.srcElement || e
    var $module = this.$module
    var $linkPanelButton = $el.closest('.idsk-search-results__link-panel')
    var $buttonCaption = $linkPanelButton.querySelector('.idsk-search-results__link-panel--span')
    var $choosenFiltersContainer = $module.querySelector('.idsk-search-results__content__picked-filters__topics')
    var $radios = $el.closest('.govuk-radios')
    var $filterContainer = $choosenFiltersContainer.querySelector('[data-source="' + $radios.dataset.id + '"]')
    var $class = 'idsk-search-results__picked-topic'
    var $contentContainer = $module.querySelector('.idsk-search-results__content')

    // creating or renaming new span element for picked topic
    if ($el.value && !$filterContainer) {
        var $topicPicked = this.createTopicInContainer.call(this, $choosenFiltersContainer, $radios.dataset.id, $class, $el, false);
        if ($module.subTopicButton) {
            $module.subTopicButton.disabled = false;
        }
    } else if ($filterContainer.dataset.source == $radios.dataset.id) {
        $topicPicked = $filterContainer
        $topicPicked.innerHTML = $el.value + ' &#10005;';
    } else if ($filterContainer.dataset.source != $radios.dataset.id) {
        var $topicPicked = this.createTopicInContainer.call(this, $choosenFiltersContainer, $radios.dataset.id, $class, $el, false);
    }

    $contentContainer.classList.remove('idsk-search-results--invisible__mobile')
    $choosenFiltersContainer.classList.remove('idsk-search-results--invisible')
    $topicPicked.removeEventListener('click', this.handleRemovePickedTopic.bind(this), true);
    $topicPicked.addEventListener('click', this.handleRemovePickedTopic.bind(this));
    this.changeBackgroundForPickedFilters.call(this)
    $buttonCaption.innerText = '1 ' + $buttonCaption.dataset.lines
}

SearchResults.prototype.handleClickContentTypeCheckBox = function (e) {
    var $el = e.target || e.srcElement || e
    var $module = this.$module
    var $linkPanelButton = $el.closest('.idsk-search-results__link-panel')
    var $choosenFiltersContainer = $module.querySelector('.idsk-search-results__content__picked-filters__content-type')
    var $checkBoxes = $el.closest('.govuk-checkboxes')
    var $class = 'idsk-search-results__picked-content-type'
    var $contentContainer = $module.querySelector('.idsk-search-results__content')

    if ($el.checked) {
        var $contentTypePicked = this.createTopicInContainer.call(this, $choosenFiltersContainer, $el.id, $class, $el, false);
        $contentTypePicked.addEventListener('click', this.handleRemovePickedContentType.bind(this));
    } else {
        var $itemToRemove = $module.querySelector('[data-source="' + $el.id + '"]')
        $itemToRemove.remove()
    }

    $contentContainer.classList.remove('idsk-search-results--invisible__mobile')
    $choosenFiltersContainer.classList.remove('idsk-search-results--invisible')
    this.handleCountOfPickedContentTypes.call(this, $checkBoxes, $linkPanelButton);
    this.changeBackgroundForPickedFilters.call(this)
}

SearchResults.prototype.handleRemovePickedContentType = function (e) {
    var $el = e.target || e.srcElement || e
    var $checkBoxes = this.$module.querySelector('.idsk-search-results__content-type-filter .govuk-checkboxes')
    var $checkBoxToRemove = $checkBoxes.querySelector('#' + $el.dataset.source)
    var $linkPanelButton = $checkBoxes.closest('.idsk-search-results__link-panel')

    $checkBoxToRemove.checked = false
    $el.remove();
    this.handleSomeFilterPicked.call(this)
    this.handleCountOfPickedContentTypes.call(this, $checkBoxes, $linkPanelButton);
    this.handleCountForFiltersButton.call(this)
    this.changeBackgroundForPickedFilters.call(this)
}

/**
 * function for counting selected checkboxes in content type filter
 * @param {object} $checkBoxes
 * @param {object} $linkPanelButton
 */
SearchResults.prototype.handleCountOfPickedContentTypes = function ($checkBoxes, $linkPanelButton) {
    var $choosenFiltersContainer = this.$module.querySelector('.idsk-search-results__content__picked-filters__content-type')
    var $buttonCaption = $linkPanelButton.querySelector('.idsk-search-results__link-panel--span')
    var $counter = 0

    if ($checkBoxes) {
        $checkBoxes.querySelectorAll('.govuk-checkboxes__input').forEach(function ($checkBox) {
            if ($checkBox.checked) {
                $counter = $counter + 1
            }
        }.bind(this))
    }
    if ($counter == 0) {
        $buttonCaption.innerText = ''
        $choosenFiltersContainer.classList.add('idsk-search-results--invisible')
    } else {
        $buttonCaption.innerText = $counter + ' ' + $buttonCaption.dataset.lines
    }
}

/**
 * function for creating element in container, in case of date we need param $insertBeforeFirst to check whether it should be on first position or not
 * @param {object} $choosenFiltersContainer
 * @param {object} $input
 * @param {object} $el
 * @param {boolean} $insertBeforeFirst
 */
SearchResults.prototype.createTopicInContainer = function ($choosenFiltersContainer, $input, $class, $el, $insertBeforeFirst) {
    var $showResultsMobileButton = this.$module.querySelector('.idsk-search-results__show-results__button')
    var $turnFiltersOffMobileButton = this.$module.querySelector('.idsk-search-results__button--turn-filters-off')
    var $pickedFiltersContainer = this.$module.querySelector('.idsk-search-results__content__picked-filters')

    var $topicPicked = document.createElement('button')
    $topicPicked.setAttribute('class', $class)
    $topicPicked.setAttribute('tabindex', "0")
    $topicPicked.setAttribute('data-source', $input)
    $topicPicked.setAttribute('data-id', $el.id)
    $topicPicked.innerHTML = $el.value + ' &#10005;';
    if ($insertBeforeFirst) {
        $choosenFiltersContainer.prepend($topicPicked);
    } else {
        $choosenFiltersContainer.appendChild($topicPicked);
    }

    $pickedFiltersContainer.classList.remove('idsk-search-results--invisible')
    $pickedFiltersContainer.classList.remove('idsk-search-results--invisible__mobile')
    $showResultsMobileButton.classList.remove('idsk-search-results--invisible')
    $turnFiltersOffMobileButton.classList.remove('idsk-search-results--invisible')
    this.handleCountForFiltersButton.call(this)

    return $topicPicked
}

/**
 * function for setting grey background for odd elements in picked topics container
 *
 */
SearchResults.prototype.changeBackgroundForPickedFilters = function (e) {
    var $module = this.$module
    var $pickedFiltersContainer = $module.querySelector('.idsk-search-results__content__picked-filters')
    var $notEmptySections = $pickedFiltersContainer.querySelectorAll('div:not(.idsk-search-results--invisible)')

    if ($notEmptySections.length == 0) {
        return
    }

    $notEmptySections.forEach(function ($section) {
        $section.classList.remove('idsk-search-results--grey')
        $section.classList.remove('idsk-search-results--border')
    }.bind(this))

    var $i;
    for ($i = 0; $i < $notEmptySections.length; $i++) {
        if ($i == 0 || $i == 2) {
            $notEmptySections[$i].classList.add('idsk-search-results--grey')
        }
    }

    $notEmptySections[$notEmptySections.length - 1].classList.add('idsk-search-results--border')
}

/**
 * function for disabling 'subtopic' filter, in case of removing topic filter
 *
 */
SearchResults.prototype.disableSubtopic = function (e) {
    var $contentPanel = this.$module.subTopicButton.parentElement.querySelector('.idsk-search-results__list')

    this.$module.subTopicButton.parentElement.classList.remove('idsk-search-results--expand')
    $contentPanel.classList.add('idsk-search-results--hidden')
    if (this.$module.subTopicButton) {
        this.$module.subTopicButton.disabled = true;
    }
}

SearchResults.prototype.handleRemovePickedTopic = function (e) {
    var $el = e.target || e.srcElement || e
    var $choosenFiltersContainer = this.$module.querySelector('.idsk-search-results__content__picked-filters__topics')

    if ($el.dataset.source == 'tema') {
        var $subTopic = $choosenFiltersContainer.querySelector('[data-source="podtema"]')
        if ($subTopic) {
            this.removeTopic.call(this, $subTopic, true);
        } else {
            if (this.$module.subTopicButton) {
                this.disableSubtopic.call(this);
            }
        }
        $choosenFiltersContainer.classList.add('idsk-search-results--invisible')
    }

    this.removeTopic.call(this, $el, false);
}

SearchResults.prototype.removeTopic = function ($el, $disableFilter) {
    var $radios = this.$module.querySelector('[data-id="' + $el.dataset.source + '"]')
    var $buttonCaption = $radios.closest('.idsk-search-results__link-panel')

    $buttonCaption.querySelector('.idsk-search-results__link-panel--span').innerText = ''
    $radios.querySelectorAll('.govuk-radios__input').forEach(function ($radio) {
        $radio.checked = false
    }.bind(this))

    if ($disableFilter && this.$module.subTopicButton) {
        this.disableSubtopic.call(this)
    }

    $el.remove()
    this.handleSomeFilterPicked.call(this)
    this.handleCountForFiltersButton.call(this)
    this.changeBackgroundForPickedFilters.call(this)
}

export default SearchResults
