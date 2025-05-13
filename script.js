const accesskey = "nLG62krMBpiPJH0UAYUTR1smuYaX_TfoGihzLBjDmeg";

const formEl = document.querySelector('form');
const inputEl = document.querySelector('#search-input');
const searchResults = document.querySelector('.container');
const retryButton = document.querySelector('#retry-button');
const loadMore = document.querySelector('#load-more-btn');

let inputData = '';
let page = 1;

async function searchImages() {
    try {
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
            searchResults.innerHTML = '<p class="no-results">No images found. Try another search term.</p>';
        } else {
            retryButton.style.display = 'none';
            results.forEach((result) => {
                const imageWrapper = document.createElement('div');
                imageWrapper.classList.add('card');

                const image = document.createElement('img');
                image.src = result.urls.small;
                image.alt = result.alt_description;
                image.title = result.alt_description;

                const contentDiv = document.createElement('div');
                contentDiv.classList.add('card-content');

                const title = document.createElement('h3');
                title.classList.add('card-title');
                title.textContent = result.alt_description || 'Untitled Image';

                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('card-actions');

                // View button
                const viewButton = createActionButton('View', 'primary-button', () => {
                    window.open(result.links.html, '_blank');
                });

                // Download button
                const downloadButton = createActionButton('Download', 'secondary-button', () => {
                    window.open(result.links.download, '_blank');
                });

                // Share button
                const shareButton = createActionButton('Share', 'secondary-button', () => {
                    if (navigator.share) {
                        navigator.share({
                            title: result.alt_description || 'Shared Image',
                            text: 'Check out this image from Unsplash!',
                            url: result.links.html
                        });
                    } else {
                        copyToClipboard(result.links.html);
                        alert('Link copied to clipboard!');
                    }
                });

                actionsDiv.appendChild(viewButton);
                actionsDiv.appendChild(downloadButton);
                actionsDiv.appendChild(shareButton);

                contentDiv.appendChild(title);
                contentDiv.appendChild(actionsDiv);

                imageWrapper.appendChild(image);
                imageWrapper.appendChild(contentDiv);
                searchResults.appendChild(imageWrapper);
            });

            page++;
            loadMore.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        searchResults.innerHTML = '<p class="no-results">An error occurred. Please try again later.</p>';
    }
}

function createActionButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('action-button', className);
    button.addEventListener('click', onClick);
    return button;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy text:', err);
    });
}

retryButton.addEventListener('click', () => {
    inputEl.value = '';
    page = 1;
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

// Add loading state to search button
const searchButton = document.querySelector('form button');
formEl.addEventListener('submit', () => {
    searchButton.textContent = 'Searching...';
    searchButton.disabled = true;
    setTimeout(() => {
        searchButton.textContent = 'Search';
        searchButton.disabled = false;
    }, 1000);
});