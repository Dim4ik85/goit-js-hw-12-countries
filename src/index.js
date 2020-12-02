import './styles.css';
import countryCardTpl from './templates/country.hbs';
import countriesListTpl from './templates/country-list.hbs';
import API from './js/api-service.js';
import getRefs from './js/get-refs.js';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

const { error, success } = require('@pnotify/core');
let debounce = require('lodash.debounce');

const refs = getRefs();

refs.input.addEventListener('input', debounce(onSearch, 500));

function renderCountryCards(country) {
    const markup = countryCardTpl(country);
    refs.description.innerHTML = markup;
}

function renderCountriesList(country) {
    const listMarkup = countriesListTpl(country);
    refs.description.innerHTML = listMarkup;
  }

function onSearch(e) {
    e.preventDefault();

    const searchQuery = e.target.value.trim();
    if(searchQuery.length === 0) return cleanMarkup();
    console.log(searchQuery);

    API.fetchCountryByName(searchQuery)
    .then(data => {
        if(data.length > 10) {
            error({
                text: 'Too many matches found. Please enter a more specific query!',
                 });
        }
        else if(data.length >= 2 && data.length <= 10) {
            renderCountriesList(data);
        }
        else if(data.length === 1) {
            renderCountryCards(data);
            success({
                text: 'Sticky success... I\'m not even gonna make a joke',
            })
        }
        else {
            error({
                title: 'Oh No!',
                text: 'No matches found with such query. Please, try to fill up another name of the country',
              });  
        }
    })
}


