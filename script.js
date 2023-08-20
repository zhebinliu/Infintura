document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    const jsonContainer = document.getElementById('jsonContainer');
    const jsonContent = document.getElementById('jsonContent');

    toggleButton.addEventListener('click', function() {
        jsonContainer.classList.toggle('hidden');
        if (!jsonContainer.classList.contains('hidden')) {
            fetchJSON();
        }
    });

    function fetchJSON() {
        fetch('sfdx-project.json')
            .then(response => response.json())
            .then(data => {
                const formattedJSON = JSON.stringify(data, null, 2);
                jsonContent.textContent = formattedJSON;
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
                jsonContent.textContent = 'Error loading JSON.';
            });
    }
});
