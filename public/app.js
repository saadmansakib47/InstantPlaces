document.addEventListener('DOMContentLoaded', () => {
    const placesGrid = document.querySelector('.places-grid');
    const searchField = document.getElementById('search-place');
    const addPlaceBtn = document.getElementById('add-place-btn');
    const modal = document.getElementById('add-place-modal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const mainContent = document.querySelector('.container');
    const addPlaceForm = document.getElementById('add-place-form');
    const filterRadios = document.querySelectorAll('input[name="type"]');
    const filterCheckboxes = document.querySelectorAll('input[name="facility"]');

    let places = [];

    // Fetch initial places data
    fetch('/places.json')
        .then(response => response.json())
        .then(data => {
            places = data;
            displayPlaces(places);
        })
        .catch(error => console.error('Error fetching places:', error));

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
        applyFilters(filteredPlaces);
    });

    // Apply filters
    function applyFilters(filteredPlaces) {
        const selectedType = Array.from(filterRadios).find(radio => radio.checked).value;
        const selectedFacilities = Array.from(filterCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        let filteredPlacesResult = filteredPlaces;

        if (selectedType !== 'all') {
            filteredPlacesResult = filteredPlacesResult.filter(place => place.type === selectedType);
        }

        if (selectedFacilities.length > 0) {
            filteredPlacesResult = filteredPlacesResult.filter(place =>
                selectedFacilities.every(facility => place.facilities.includes(facility))
            );
        }

        displayPlaces(filteredPlacesResult);
    }

    // Handle filter changes
    function handleFilterChange() {
        const filteredPlaces = places.filter(place =>
            place.name.toLowerCase().includes(searchField.value.toLowerCase())
        );
        applyFilters(filteredPlaces);
    }

    filterRadios.forEach(radio => radio.addEventListener('change', handleFilterChange));
    filterCheckboxes.forEach(checkbox => checkbox.addEventListener('change', handleFilterChange));

    // Show modal on button click
    addPlaceBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        mainContent.classList.add('blur'); // Apply blur to main content
    });

    // Close the modal when close button is clicked
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        mainContent.classList.remove('blur'); // Remove blur from main content
    });

    // Close the modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            mainContent.classList.remove('blur'); // Remove blur from main content
        }
    });

    // Handle form submission
    addPlaceForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Retrieve form data
        const formData = new FormData(addPlaceForm);
        const newPlace = {
            name: formData.get('place-name'),
            type: formData.get('place-type'),
            facilities: formData.get('place-facility').split(',').map(facility => facility.trim()),
            image: formData.get('place-image'),
            detailsLink: formData.get('place-wikipedia')
        };

        // Process the new place (e.g., send to server, update UI, etc.)
        fetch('/add-place', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPlace)
        }).then(response => response.json())
            .then(data => {
                console.log('New place added:', data);
                places.push(data);
                applyFilters(places); // Update filtered places
            })
            .catch(error => console.error('Error adding place:', error));

        // Clear form fields
        addPlaceForm.reset();
        modal.style.display = 'none';
        mainContent.classList.remove('blur'); // Remove blur from main content
    });
});
