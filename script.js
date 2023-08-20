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
            fetchReleaseDef('release-definitions/orde-cl.xml');
            fetchReleaseDef('release-definitions/orde-loan-servicing.xml');
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
    
    function fetchReleaseDef(xmlPath) {
        fetch(xmlPath)
            .then(response => response.text())
            .then ( xmlData => {
                console.log('file=>'+xmlPath)
                xmlContent.textContent += xmlPath+'\n';
                parseXML(xmlData);
            })
            .catch(error => {
                console.error('Error fetching XML:', error);
                xmlContent.textContent = 'Error loading XML from URL.';
            });
    }

    function parseXML(xmlData) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, 'application/xml');

        const packageNodes = xmlDoc.querySelectorAll('includeOnlyArtifacts package');
        let packagesList

        if (packageNodes.length > 0) {
            const packageNames = Array.from(packageNodes).map(node => node.textContent);
            xmlContent.innerHTML += `<ul>${packageNames.map(name => `<li>${name}</li>`).join('')}</ul>`;
        } else {
            xmlContent.textContent += 'No packages found under includeOnlyArtifacts.';
        }

    }
});
