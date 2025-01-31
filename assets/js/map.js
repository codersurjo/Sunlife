var listingData, searchResultData, activeCategory = "";
        mapboxgl.accessToken = 'pk.eyJ1Ijoic3VuY2xpZmZlZ2luIiwiYSI6ImNsOXg4NHpkczA0cWYzb3BsNXJiNzRmNDYifQ.H5TBvxL2m1x9E-cmlvqLuQ';
        const map = new mapboxgl.Map({
        container: 'map', // container ID
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: 'mapbox://styles/suncliffegin/cl9z8cgf2008d15s2tvy2yjnx', // style URL
            // center: [-98.362, 39.4253], // starting position [lng, lat]
            center:[-112.0082747438563, 33.88688698109439 ],
            zoom: 3.4, // starting zoom
            projection: 'mercator' // display the map as a 3D globe
        });
        
        map.on('style.load', () => {
            map.setFog({}); // Set the default atmosphere styl
        });


        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            placeholder:'Enter a location',
            types: 'country,region,place,postcode,locality,neighborhood'
        });
        
        geocoder.addTo('#geocoder');

        // Get the geocoder results container.
        // const results = document.getElementById('result');
        
        // Add geocoder result to container.
        geocoder.on('result', (e) => {
            // results.innerText = JSON.stringify(e.result, null, 2);
            console.log(e.result);

            // find the results close to the area within the given distance
            filterDataWithin(e.result.center);
            map.flyTo({
                center:e.result.center,
                zoom:12
            });

        });
        
        // Clear results container when search is cleared.
        geocoder.on('clear', () => {
            // results.innerText = '';
            
        });

        let mapMarkers = [];
        let activeRadius = 5;

        d3.csv('/assets/data/liqor_store.csv')
            .then(data => {
                console.log(data);

                loadListingData(data);
                renderListingMarkers(data);

                listingData = JSON.parse(JSON.stringify(data));
                searchResultData = JSON.parse(JSON.stringify(data));
            })

        // function load listing data
        function loadListingData(data, isFilter=false) {
            let results = data.map(entry => {
                let address = entry.Address.split(",");
                let distanceSection = isFilter ? `<div class="storepoint-distance">${entry.distance} miles</div>` : "";

                return ` <div class="storepoint-location" id="location_${entry.Id}" data-location-tags="">
                    <div class="storepoint-name"> 
                        <a class="storepoint-link" rel="nofollow" target="_blank" href="${entry.Link}">${entry.Name}</a>
                    </div>

                    <div class="storepoint-address">${address[0]}  <br> ${address.slice(1,).join(", ")}</div>

                    ${distanceSection}
                </div>`;
            });

            // <div class="storepoint-contact"></div><div class="storepoint-btn">
            //     <a class="storepoint-btn" rel="nofollow" target="_blank" href="${entry.Link}">website</a>
            // </div>


            document.getElementById("side-bar").innerHTML = results.join("");

            if(isFilter) {
                console.log("Adding a click button");

                let showAllSection = document.createElement("div");
                showAllSection.classList.add("all-section");

                showAllSection.onclick = (e) => {
                    loadListingData(listingData);
                    renderListingMarkers(listingData);
                }

                showAllSection.innerHTML = "Show all the locations";

                document.getElementById("side-bar").append(showAllSection);
            }

            // event listeners
            fireEventListeners();
        }


        // loadListingData(listingData);


        // render listing markers
        function renderListingMarkers(data) {
            mapMarkers = data.map(entry => {
                let customIcon = document.createElement("div");
                customIcon.className = "div-marker";
                customIcon.innerHTML = `<img src="/assets/images/icon-image.png" alt="icon"/>`;

                let popup = new mapboxgl.Popup({focusAfterOpen:false});
                let address = entry.Address.split(",");

                popup.setHTML(`
                    <div class="">
                        <div class="storepoint-name"> 
                            <a class="storepoint-link" rel="nofollow" target="_blank" href="${entry.Link}">${entry.Name}</a>
                        </div>
                        <p class="storepoint-address">${address[0]}  <br> ${address.slice(1,).join(", ")}</p>
                    </div>
                `);


                let marker = new mapboxgl.Marker({element:customIcon})
                    .setLngLat([
                        parseFloat(entry.Lng), 
                        parseFloat(entry.Lat)
                    ])
                    .addTo(map)

                marker.id = `location_${entry.Id}`;
                marker.setPopup(popup);

                return marker;
            })
        }

        // renderListingMarkers(listingData);     
        
        document.getElementById("radius").onchange = (e) => {
            activeRadius = e.target.value;
        }

        document.querySelectorAll(".category-toggler").forEach(toggler => {
            toggler.onclick = (e) => {
                let value = e.target.dataset.value;

                if(e.target.checked && value == activeCategory) {
                    e.target.checked = false;
                    activeCategory = ""
                } else {
                    activeCategory = value;
                }

                console.log(activeCategory);

                mapMarkers.forEach(marker => marker.remove());
                
                if(activeCategory) {
                    let dt = searchResultData.filter(entry => entry.Category == activeCategory);
                    loadListingData(dt);
                    renderListingMarkers(dt)
                } else {
                    loadListingData(searchResultData);
                    renderListingMarkers(searchResultData);
                }
            }
        });

        // filter data
        function filterDataWithin(center) {
            let p2 = turf.point([...center]);

            let dt = listingData.filter(entry => {
                let p1 = turf.point([parseFloat(entry.Lng), parseFloat(entry.Lat)]);

                let distance = turf.distance(p1, p2, {units:'miles'});

                if(distance <= activeRadius) {
                    entry.distance = distance.toFixed(2);

                    return entry;
                } else {
                    return false;
                }
            });

            searchResultData = JSON.parse(JSON.stringify(dt))


            loadListingData(dt, true);
        }

        function fireEventListeners() {
            let cards = document.querySelectorAll(".storepoint-location");

            cards.forEach(card => {
                card.onclick = e => {
                    console.log(e);
                    let id = e.target.id;

                    zoomToMarker(id);
                }
            });
        }

       

        function zoomToMarker(id) {
            mapMarkers.forEach(marker => {
                if(marker.id == id) {
                    marker.togglePopup();

                    map.flyTo({
                        center:marker.getLngLat(),
                        zoom:15
                    });

                }

            });
        }