document.addEventListener('DOMContentLoaded', () => {
    const recordCollection = document.getElementById('record-collection');
    const searchInput = document.getElementById('search');
    const filterCategory = document.getElementById('filter-category');
    const autocompleteOptions = document.getElementById('autocomplete-options');

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
                <img src="${record.images[0]}" alt="${record.recordName}">
                <h3>${record.recordName}</h3>
                <p><strong>Artist:</strong> ${record.artist}</p>
                <p><strong>Genre:</strong> ${record.genre}</p>
                <p><strong>Record Label:</strong> ${record.recordLabel}</p>
                <p><strong>Year of Publishing:</strong> ${record.year}</p>
                <div class="record-images">
                    ${record.images.map(src => `<img src="${src}" alt="${record.recordName}">`).join('')}
                </div>
            `;
            recordCollection.appendChild(recordElement);
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
});
