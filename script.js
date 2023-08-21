document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    const outputContainer = document.getElementById('outputContainer');
    const jsonContent = document.getElementById('jsonContent');
    const ordeClContent = document.getElementById('orde-cl-context');
    const ordeLoanServicingContent = document.getElementById('orde-loan-servicing-context');
    const tabNavi = document.getElementById('tab-navi');
    const tabContainer = document.getElementById('tabContainer');

    toggleButton.addEventListener('click', function() {
        outputContainer.classList.toggle('hidden');
        if (!outputContainer.classList.contains('hidden')) {
            fetchJSON();
            const reldefs = readRelDefFolder('releasedefinitions');
            console.log(reldefs)
            console.log(reldefs[0])
            tabNavi.innerHTML = ''
            const fileArr = ['orde-cl.yml','orde-loan-servicing.yml']
            for( const index in fileArr){
                const filePath = fileArr[index];
                const tabName = filePath.replace(/\.[^/.]+$/, "")
                tabNavi.innerHTML += `<button class="tablinks" onclick="openYaml(event, '${tabName}')">${tabName}</button>`
                tabContainer.innerHTML += `<div id="${tabName}" class="tabcontent"><pre id="${'tab-'+tabName}"></pre></div>`
                const tempTabContent = document.getElementById('tab-'+tabName);
                fetchReleaseDef('releasedefinitions/'+filePath, tempTabContent);
            }

        }
    });

    async function readRelDefFolder(directory) {
        const url = `https://api.github.com/repos/zhebinliu/infintura/git/trees/main`;
        const list = await fetch(url).then(res => res.json());
        const dir = list.tree.find(node => node.path === directory);
        if (dir) {
            const list = await fetch(dir.url).then(res => res.json());
            return list.tree.map(node => node.path);
        }
    }

    function fetchJSON() {
        fetch('sfdx-project.json')
            .then(response => response.json())
            .then(data => {
                jsonContent.innerHTML = '<h3>Packages</h3>';
                jsonContent.innerHTML += '<table><tr><th>Packages</th><th>Domain</th></tr>';
                data.packageDirectories.forEach((package)=> {
                    jsonContent.innerHTML += `<tr><td>${package}</td><td></td></tr>`;
                });
                jsonContent.innerHTML += `</table>`;
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
        container.innerHTML = ''
        //console.log(includeOnlyArtifacts)
        if (Array.isArray(includeOnlyArtifacts) && includeOnlyArtifacts.length > 0) {
            includeOnlyArtifacts.forEach((package)=> {
                container.innerHTML += `<div>${package}</div>`;
            });
            //xmlContent.innerHTML += `<ul>${includeOnlyArtifacts.map(name => `<li>${name}</li>`).join('')}</ul>`;
        } else {
            container.textContent = 'No packages found under includeOnlyArtifacts.';
        }

    }

    
});

function openYaml(evt, domain) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(domain).style.display = "block";
    evt.currentTarget.className += " active";
  }
