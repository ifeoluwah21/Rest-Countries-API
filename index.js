const searchQuery = document.querySelector(`#search`);
const filterQuery = document.querySelector(`#filter`);
const cardGrid = document.querySelector(`.cards-grid`);
const form = document.querySelector(`form`);
const detailsPage = document.querySelector(`.detail-card`);
const backBtn = document.querySelector(`.detail-card__back-btn`)
const borderBox = document.querySelector(`.detail-card__less-container`);


let darkMode = false;

let all;
const eventListenerFnstore = {
    getAll() {
        return fetchAll().then(data => all = data);
    },
    getByQuery(e) {
        e.preventDefault();
        cardGrid.innerHTML = ``;
        if (e.target.name === `filter`) {
            return fetchByQuery(e.target.name, e.target.value)
        }
        return fetchByQuery(`search`, searchQuery.value)
    },

    preventFormDefault(e) {
        let key = e.charCode || e.keyCode || 0;
        if (key === 13) {
            e.preventDefault();
        }
    },
    showDetailsPage(e) {
        detailsPage.classList.add(`show`);
    },
    hideDetailsPage(e) {
        detailsPage.classList.remove(`show`);
    }
}
//FetchAll countries
async function fetchAll() {
    try {
        let res = await fetch('https://restcountries.com/v3.1/all');
        let details = await res.json();

        createCard(details);
        return details;
        //return getdetails();
    } catch (err) {
        console.log(err)
        return err;
    }
}

//Search query fetch
async function fetchByQuery(type, query) {
    try {
        let res, all;
        if (type === `search`) {
            res = await fetch(`https://restcountries.com/v3.1/name/${query}`);

        }
        if (type === `filter`) {
            res = await fetch(`https://restcountries.com/v3.1/region/${query}`);
        }
        let details = await res.json()
        if (!Array.isArray(details)) {
            errorMessage(`No country is found based of your query`);
            throw Error(`No country is found based of your query`);
        }
        cardGrid.innerHTML = ``;
        createCard(details);
        return details
    } catch (err) {
        return err;
    }
}

function errorMessage(err) {
    let div = document.createElement(`div`);
    div.classList.add(`card`)
    div.innerHTML = `
                        <div class="card__about">
                        <h2 class="card__title">${err}</h2>
                            </div>`
    cardGrid.appendChild(div);
}

function createCard(details) {

    let someDetails = details.length > 40 ? details.slice(0, 40) : details;

    someDetails.forEach((detail) => {
        let div = document.createElement(`div`);
        div.classList.add(`card`);
        if (darkMode === true) {
            div.classList.add(`card--dark`)
        }
        div.innerHTML = `<div class="card__flag-container">
                        <img class="card__flag-img" src="${detail.flags.png}" alt="${detail.name.official}">
                        </div>
                        <div class="card__about">
                        <h2 class="card__title">${detail.name.common}</h2>
                        <p class="card__info"><span class="card__info--bold">Population: </span><span>${detail.population}</span></p>
                    <p class="card__info"><span class="card__info--bold">Region: </span><span></span>${detail.region}</p>
                    <p class="card__info"><span class="card__info--bold">Capital: </span><span>${detail.capital}</span></p>
                    </div>`

        div.addEventListener(`click`, (e) => {
            loadedDetailCard(detail);
            eventListenerFnstore.showDetailsPage();
        })
        cardGrid.appendChild(div);

    })
}


window.addEventListener(`DOMContentLoaded`, eventListenerFnstore.getAll)
filterQuery.addEventListener(`change`, eventListenerFnstore.getByQuery)

form.addEventListener(`submit`, eventListenerFnstore.getByQuery);
backBtn.addEventListener(`click`, eventListenerFnstore.hideDetailsPage)


function loadedDetailCard(detail) {
    //Getting the detail page
    const detailCard = document.querySelector(`.detail-card`);
    const detailCardImg = detailCard.querySelector(`.detail-card__img`);
    const detailCardTitle = detailCard.querySelector(`.detail-card__title`);
    const detailCardName = detailCard.querySelector(`span[data-name="native name"]`);
    const detailCardPopulation = detailCard.querySelector(`span[data-name="population"]`);
    const detailCardRegion = detailCard.querySelector(`span[data-name="region"]`);
    const detailCardSubRegion = detailCard.querySelector(`span[data-name="sub-region"]`);
    const detailCardCapital = detailCard.querySelector(`span[data-name="capital"]`);
    const detailCardTld = detailCard.querySelector(`span[data-name="tld"]`);
    const detailCardCur = detailCard.querySelector(`span[data-name="cur"]`);
    const detailCardLang = detailCard.querySelector(`span[data-name="lang"]`);


    let names = helperFnStore.valuesFromObj(detail.name.nativeName, `common`)
    let currencies = helperFnStore.valuesFromObj(detail.currencies, "name");
    let langs = helperFnStore.valuesFromObj(detail.languages)


    detailCardImg.setAttribute(`src`, detail.flags.png)
    detailCardTitle.innerHTML = detail.name.common;
    detailCardName.innerHTML = names.length > 1 ? names.join(`, `) : names.length === 1 ? names[0] : '';
    detailCardTld.innerHTML = detail.tld.length > 1 ? detail.tld.join(`, `) : detail.tld.length === 1 ? detail.tld[0] : '';
    detailCardPopulation.innerHTML = detail.population.toLocaleString();
    detailCardRegion.innerHTML = detail.region;
    detailCardSubRegion.innerHTML = detail.subregion;
    detailCardCapital.innerHTML = detail.capital[0]
    detailCardCur.innerHTML = currencies.length > 1 ? currencies.join(`, `) : currencies.length === 1 ? currencies[0] : '';
    detailCardLang.innerHTML = langs.length > 1 ? langs.join(`, `) : langs.length === 1 ? langs[0] : '';


    //Setting border countries
    //let borderCountries = helperFnStore.getBorderQuery(details, detail.borders);
    borderBox.innerHTML = ``;
    let borderCountries = helperFnStore.getBorderQuery(all, detail.borders);
    borderCountries.forEach(country => {
        helperFnStore.borderCountries(country, borderBox)
    })

}

const helperFnStore = {
    valuesFromObj(obj, key) {
        let arrValues = [];
        for (let val of Object.values(obj)) {
            if (typeof val === 'object') {
                arrValues.push(val[key]);
            } else {
                arrValues.push(val)
            }
        }
        return arrValues;
    },
    getBorderQuery(all, list) {
        let result = all.filter((d, i, a) => {
            return list?.includes(d.cca3);
        })
        return result
    },
    borderCountries(i, body) {

        let div = document.createElement(`div`);
        div.classList.add(`detail-card__less-item`);
        if (darkMode === true) {
            div.classList.add(`detail-card__less-item--dark`);
        }
        if (i && i.name) {
            div.innerHTML = `<p>${i?.name?.common}</p>`;
        }
        body.appendChild(div)
    }
}


const darkModeBtn = document.querySelector(`.header__feature`);

darkModeBtn.addEventListener(`click`, (e) => {
    darkMode = darkMode ? false : true;
    enableDarkMode(darkMode);
    disableDarkMode(darkMode);

})


function enableDarkMode(check) {
    if (!check) {
        return;
    }
    let body = document.querySelector(`.body`);
    let header = document.querySelector(`.header`);
    let searchIcon = document.querySelector(`.form__search-icon`);
    let search = document.querySelector(`.form__search`);
    let filter = document.querySelector(`.form__filter`);
    let cards = document.querySelectorAll(`.card`);
    let detailCard = document.querySelector(`.detail-card`);
    let detailCardBorders = detailCard.querySelectorAll(`.detail-card__less-item`)
    let detailCardBtn = detailCard.querySelector(`.detail-card__back-btn`);
    if (check === true) {
        body.classList.add("body--dark");
        header.classList.add("header--dark");
        searchIcon.classList.add("form__search-icon--dark");
        search.classList.add("form__search--dark");
        filter.classList.add("form__filter--dark");
        cards?.forEach(card => card?.classList?.add?.(`card--dark`));
        detailCard.classList.add("detail-card--dark")
        detailCardBorders.forEach(border => border?.classList?.add("detail-card__less-item--dark"))
        detailCardBtn.classList.add("detail-card__back-btn--dark")
    }
}
function disableDarkMode(check) {
    if (check) {
        return;
    }
    let body = document.querySelector(`.body`);
    let header = document.querySelector(`.header`);
    let searchIcon = document.querySelector(`.form__search-icon`);
    let search = document.querySelector(`.form__search`);
    let filter = document.querySelector(`.form__filter`);
    let cards = document.querySelectorAll(`.card`);
    let detailCard = document.querySelector(`.detail-card`);
    let detailCardBorders = detailCard.querySelectorAll(`.detail-card__less-item`)
    let detailCardBtn = detailCard.querySelector(`.detail-card__back-btn`);
    if (check !== true) {
        body.classList.remove("body--dark");
        header.classList.remove("header--dark");
        searchIcon.classList.remove("form__search-icon--dark");
        search.classList.remove("form__search--dark");
        filter.classList.remove("form__filter--dark");
        cards?.forEach(card => card?.classList?.remove?.(`card--dark`));
        detailCard.classList.remove("detail-card--dark")
        detailCardBorders.forEach(border => border?.classList?.remove("detail-card__less-item--dark"))
        detailCardBtn.classList.remove("detail-card__back-btn--dark")
    }
}