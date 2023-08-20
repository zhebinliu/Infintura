document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    const outputContainer = document.getElementById('outputContainer');
    const jsonContent = document.getElementById('jsonContent');
    const xmlContainer = document.getElementById('xmlContainer');
    const xmlContent = document.getElementById('xmlContent');

    toggleButton.addEventListener('click', function() {
        outputContainer.classList.toggle('hidden');
        if (!outputContainer.classList.contains('hidden')) {
            fetchJSON();
            fetchReleaseDef('releasedefinitions/orde-cl.yml');
            fetchReleaseDef('releasedefinitions/orde-loan-servicing.yml');
        }
    });

    function fetchJSON() {
        fetch('sfdx-project.json')
            .then(response => response.json())
            .then(data => {
                jsonContent.textContent = 'Package list \n';
                data.packageDirectories.forEach((package)=> {
                    jsonContent.textContent += package.package+'\n';
                });
                //const formattedJSON = JSON.stringify(data.packageDirectories, null, 2);
                //jsonContent.textContent = formattedJSON;
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
                jsonContent.textContent = 'Error loading JSON.';
            });
    }
    
    function fetchReleaseDef(ymlPath) {
        fetch(ymlPath)
            .then(response => response.text())
            .then ( ymlData => {
                console.log('file=>'+ymlPath)
                xmlContent.textContent += ymlPath+'\n';
                console.log(ymlData)
                parseYML(ymlData);
            })
            .catch(error => {
                console.error('Error fetching YML:', error);
                xmlContent.textContent = 'Error loading YML from URL.';
            });
    }

    function parseYML(ymlData) {
        const parsedYAML = jsyaml.load(ymlData); 
        const includeOnlyArtifacts = parsedYAML.includeOnlyArtifacts;
        console.log(xmlDoc)
        
        if (Array.isArray(includeOnlyArtifacts) && includeOnlyArtifacts.length > 0) {
            xmlContent.innerHTML = `<ul>${includeOnlyArtifacts.map(name => `<li>${name}</li>`).join('')}</ul>`;
        } else {
            xmlContent.textContent = 'No packages found under includeOnlyArtifacts.';
        }

    }
});
