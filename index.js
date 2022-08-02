
const cardGrid = document.querySelector(`.cards-grid`);

async function fetchAll() {
    try {
        let res = await fetch('https://restcountries.com/v3.1/all');
        let details = await res.json();
        console.log(details);
        createCard(details);
        return details;
        //return getdetails();
    } catch (err) {
        console.log(err)
        return err;
    }
}

fetchAll()

window.addEventListener(`DOMContentLoaded`, function () {

})

function createCard(details) {
    details.forEach((detail, index, all) => {
        let div = document.createElement(`div`);
        div.classList.add(`card`)
        div.innerHTML = `<div class="card__flag-container">
                        <img class="card__flag-img" src="${detail.flags.png}" alt="${detail.name.common}">
                        </div>
                        <div class="card__about">
                        <h3 class="card__title">${detail.name.official}</h3>
                        <p class="card__info"><span class="card__info--bold">Population: </span><span>${detail.population}</span></p>
                    <p class="card__info"><span class="card__info--bold">Region: </span><span></span>${detail.region}</p>
                    <p class="card__info"><span class="card__info--bold">Capital: </span><span>${detail.capital}</span></p>
                    </div>`
        cardGrid.appendChild(div);

    })
}