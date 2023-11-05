const accesskey = "nLG62krMBpiPJH0UAYUTR1smuYaX_TfoGihzLBjDmeg";

const formEl = document.querySelector('form');
const inputEl = document.querySelector('#search-input');
const searchResults = document.querySelector('.container');
const retryButton = document.querySelector('#retry-button');
const loadMore = document.querySelector('#load-more-btn');

let inputData = '';
let page = 1;

async function searchImages() {
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accesskey}`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data.results;

    if (page === 1) {
        searchResults.innerHTML = '';
    }

    if (results.length === 0) {
        retryButton.style.display = 'block';
        loadMore.style.display = 'none';
    } else {
        retryButton.style.display = 'none';
        results.map((result) => {
            const imageWrapper = document.createElement('div');
            imageWrapper.classList.add('card');

            const image = document.createElement('img');
            image.src = result.urls.small;
            image.alt = result.alt_description;
            image.title = result.alt_description

            const imageLink = document.createElement('a');
            imageLink.href = result.links.html;
            imageLink.target = '_blank';
            imageLink.textContent = result.alt_description;

            imageWrapper.appendChild(image);
            imageWrapper.appendChild(imageLink);
            searchResults.appendChild(imageWrapper);
        });
        page++;
        loadMore.style.display = 'block';
    }
}

retryButton.addEventListener('click', () => {
    inputEl.value = '';
    page = 1;
    searchImages();
    window.location.href = 'index.html';
});
loadMore.addEventListener('click', () => {
    searchImages();
});
formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    page = 1;
    inputData = inputEl.value;
    searchImages();
});

// preTag
const preTags = document.querySelectorAll(".pre-tags pre");

function searchWithPreTag(tag) {
    inputEl.value = tag;
    page = 1;
    inputData = tag;
    searchImages();
}

preTags.forEach((preTag) => {
    preTag.addEventListener("click", () => {
        const searchText = preTag.textContent;
        searchWithPreTag(searchText);
    });
});
