document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    const jsonContainer = document.getElementById('jsonContainer');

    toggleButton.addEventListener('click', function() {
        if (jsonContainer.classList.contains('hidden')) {
            jsonContainer.classList.remove('hidden');
            toggleButton.textContent = 'Hide JSON';
        } else {
            jsonContainer.classList.add('hidden');
            toggleButton.textContent = 'Toggle JSON';
        }
    });

    fetch('sfdx-project.json')
        .then(response => response.json())
        .then(data => {
            const formattedJSON = JSON.stringify(data, null, 2);
            jsonContainer.textContent = formattedJSON;
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
            jsonContainer.textContent = 'Error loading JSON.';
        });
});
