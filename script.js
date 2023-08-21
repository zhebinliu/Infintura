document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    const outputContainer = document.getElementById('outputContainer');
    const jsonContent = document.getElementById('jsonContent');
    const ordeClContent = document.getElementById('orde-cl-context');
    const ordeLoanServicingContent = document.getElementById('orde-loan-servicing-context');

    toggleButton.addEventListener('click', function() {
        outputContainer.classList.toggle('hidden');
        if (!outputContainer.classList.contains('hidden')) {
            fetchJSON();
            fetchReleaseDef('releasedefinitions/orde-cl.yml', ordeClContent);
            fetchReleaseDef('releasedefinitions/orde-loan-servicing.yml', ordeLoanServicingContent);
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
    
    function fetchReleaseDef(ymlPath, container) {
        fetch(ymlPath)
            .then(response => response.text())
            .then ( ymlData => {
                console.log('file=>'+ymlPath)
                container.textContent += ymlPath +'\n';
                parseYML(ymlData, container);
            })
            .catch(error => {
                console.error('Error fetching YML:', error);
                xmlContent.textContent = 'Error loading YML from URL.';
            });
    }

    function parseYML(ymlData, container) {
        const parsedYAML = jsyaml.load(ymlData); 
        const includeOnlyArtifacts = parsedYAML.includeOnlyArtifacts;
        //console.log(includeOnlyArtifacts)
        if (Array.isArray(includeOnlyArtifacts) && includeOnlyArtifacts.length > 0) {
            includeOnlyArtifacts.forEach((package)=> {
                container.textContent += package +'\n';
            });
            //xmlContent.innerHTML += `<ul>${includeOnlyArtifacts.map(name => `<li>${name}</li>`).join('')}</ul>`;
        } else {
            container.textContent = 'No packages found under includeOnlyArtifacts.';
        }

    }
});
