const searchQuery = document.querySelector(`#search`);
const filterQuery = document.querySelector(`#filter`);
const cardGrid = document.querySelector(`.cards-grid`);
const form = document.querySelector(`form`);

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
        let res;
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
        div.classList.add(`card`)
        div.innerHTML = `<div class="card__flag-container">
                        <img class="card__flag-img" src="${detail.flags.png}" alt="${detail.name.common}">
                        </div>
                        <div class="card__about">
                        <h2 class="card__title">${detail.name.official}</h2>
                        <p class="card__info"><span class="card__info--bold">Population: </span><span>${detail.population}</span></p>
                    <p class="card__info"><span class="card__info--bold">Region: </span><span></span>${detail.region}</p>
                    <p class="card__info"><span class="card__info--bold">Capital: </span><span>${detail.capital}</span></p>
                    </div>`
        cardGrid.appendChild(div);

    })
}


window.addEventListener(`DOMContentLoaded`, function () {
    return fetchAll();
})
searchQuery.addEventListener(`change`, (e) => {
    e.preventDefault();
    cardGrid.innerHTML = ``;
    fetchByQuery(`search`, e.target.value)

})
filterQuery.addEventListener(`change`, (e) => {
    e.preventDefault();
    cardGrid.innerHTML = ``;
    fetchByQuery(`filter`, e.target.value)
})

form.addEventListener(`keypress`, (e) => {
    let key = e.charCode || e.keyCode || 0;
    if (key === 13) {
        e.preventDefault();
    }
})