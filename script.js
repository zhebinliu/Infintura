document.addEventListener('DOMContentLoaded', function() {
    const fetchButton = document.getElementById('fetchButton');
    const jsonUrlInput = document.getElementById('jsonUrl');
    const jsonContainer = document.getElementById('jsonContainer');
    const jsonContent = document.getElementById('jsonContent');

    fetchButton.addEventListener('click', function() {
        const jsonUrl = jsonUrlInput.value;
        if (jsonUrl.trim() !== '') {
            jsonContainer.classList.remove('hidden');
            fetchJSONFromURL(jsonUrl);
        }
    });

    function fetchJSONFromURL(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const formattedJSON = JSON.stringify(data, null, 2);
                jsonContent.textContent = formattedJSON;
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
                jsonContent.textContent = 'Error loading JSON from URL.';
            });
    }
});
