// index.js

document.addEventListener('DOMContentLoaded', () => {
    const placesGrid = document.querySelector('.places-grid');
    const searchField = document.getElementById('search-place');
    const filterRadios = document.querySelectorAll('input[name="type"]');
    const filterCheckboxes = document.querySelectorAll('input[name="facility"]');

    let places = [];

    // Fetch initial places data
    fetch('places.json')
        .then(response => response.json())
        .then(data => {
            places = data;
            displayPlaces(places);
        });

    // Display places in the grid
    function displayPlaces(places) {
        placesGrid.innerHTML = '';
        places.forEach(place => {
            const placeDiv = document.createElement('div');
            placeDiv.classList.add('place');
            placeDiv.innerHTML = `
                <img src="${place.image}" alt="${place.name}">
                <div class="name">${place.name}</div>
                <div class="criteria">${place.type} | ${place.facilities.join(', ')}</div>
            `;
            placeDiv.addEventListener('click', () => {
                window.location.href = place.detailsLink;
            });
            placesGrid.appendChild(placeDiv);
        });
    }

    // Handle search input
    searchField.addEventListener('input', () => {
        const searchQuery = searchField.value.toLowerCase();
        const filteredPlaces = places.filter(place =>
            place.name.toLowerCase().includes(searchQuery)
        );
        displayPlaces(filteredPlaces);
    });

    // Handle filter changes
    function handleFilterChange() {
        const selectedType = Array.from(filterRadios).find(radio => radio.checked).value;
        const selectedFacilities = Array.from(filterCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        let filteredPlaces = places;

        if (selectedType !== 'all') {
            filteredPlaces = filteredPlaces.filter(place => place.type === selectedType);
        }

        if (selectedFacilities.length > 0) {
            filteredPlaces = filteredPlaces.filter(place =>
                selectedFacilities.every(facility => place.facilities.includes(facility))
            );
        }

        displayPlaces(filteredPlaces);
    }

    filterRadios.forEach(radio => radio.addEventListener('change', handleFilterChange));
    filterCheckboxes.forEach(checkbox => checkbox.addEventListener('change', handleFilterChange));
});

