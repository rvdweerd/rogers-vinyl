document.addEventListener('DOMContentLoaded', () => {
    const recordCollection = document.getElementById('record-collection');
    const searchInput = document.getElementById('search');
    const filterCategory = document.getElementById('filter-category');
    const autocompleteOptions = document.getElementById('autocomplete-options');
    const fullscreenContainer = document.getElementById('fullscreen-container');
    const fullscreenImage = document.getElementById('fullscreen-image');

    // Fetch records data from JSON
    fetch('records.json')
        .then(response => response.json())
        .then(data => {
            displayRecords(data);
            searchInput.addEventListener('input', () => {
                filterRecords(data);
                updateAutocompleteOptions(data);
            });
            filterCategory.addEventListener('change', () => filterRecords(data));
        });

    function displayRecords(records) {
        recordCollection.innerHTML = '';
        records.forEach(record => {
            const recordElement = document.createElement('div');
            recordElement.className = 'record';
            recordElement.innerHTML = `
                <img src="${record.images[0]}" alt="${record.recordName}" class="main-image">
                <h3>${record.recordName}</h3>
                <p><strong>Artist:</strong> ${record.artist}</p>
                <p><strong>Genre:</strong> ${record.genre}</p>
                <p><strong>Record Label:</strong> ${record.recordLabel}</p>
                <p><strong>Year of Publishing:</strong> ${record.year}</p>
                <div class="expanded-images">
                    ${record.images.slice(1).map(src => `<img src="${src}" alt="${record.recordName}" class="thumbnail">`).join('')}
                </div>
            `;
            recordCollection.appendChild(recordElement);

            // Add click event listener to toggle expanded view
            const mainImage = recordElement.querySelector('.main-image');
            const expandedImages = recordElement.querySelector('.expanded-images');
            mainImage.addEventListener('click', () => {
                expandedImages.classList.toggle('expanded');
            });

            // Add click event listener to each expanded image for full-screen view
            expandedImages.querySelectorAll('.thumbnail').forEach(img => {
                img.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent the main image click event from triggering
                    fullscreenImage.src = event.target.src;
                    fullscreenContainer.classList.remove('hidden');
                    document.body.style.overflow = 'hidden'; // Disable scrolling
                });
            });
        });
    }

    function filterRecords(records) {
        const query = searchInput.value.toLowerCase();
        const category = filterCategory.value;
        const filteredRecords = records.filter(record => {
            return record[category].toLowerCase().includes(query);
        });
        displayRecords(filteredRecords);
    }

    function updateAutocompleteOptions(records) {
        const query = searchInput.value.toLowerCase();
        const category = filterCategory.value;
        const suggestions = new Set();
        
        records.forEach(record => {
            if (record[category].toLowerCase().includes(query)) {
                suggestions.add(record[category]);
            }
        });

        autocompleteOptions.innerHTML = '';
        suggestions.forEach(suggestion => {
            const option = document.createElement('option');
            option.value = suggestion;
            autocompleteOptions.appendChild(option);
        });
    }

    // Close the full-screen view when pressing Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            fullscreenContainer.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Enable scrolling
        }
    });

    // Close the full-screen view when clicking outside the image
    fullscreenContainer.addEventListener('click', (event) => {
        if (event.target === fullscreenContainer) {
            fullscreenContainer.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Enable scrolling
        }
    });
});
