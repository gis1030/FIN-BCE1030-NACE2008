// ++++++++ Choix de cartes et Arbres ++++++++
var CarteGroup = {
    "<b>OSM.fr Carte</b>": carte01,
    "<b>Google Terrain</b>": carte02,
/*     "<b>Google Streets</b>": carte03,
    "<b>Google Satellite</b>": carte04,
    "<b>Google Satellite-Streets</b>": carte05,
    "<b>Google Terrain-Cycle</b>": carte06,
    "<b>Google Streets-Cycle</b>": carte07,
    "<b>Google Traffic</b>": carte08, */
};


var GroupBCE1030 = {
    "<img src='images/icon-Entreprises.png', width='20px'/><b>Enterprises Schaerbeek</b></br>": GroupMarkersMap1030_ALL,
};


var LControl01 = L.control.layers(CarteGroup).addTo(carte);
var LControl02 = L.control.layers(GroupBCE1030).addTo(carte);
// ++++++++ Choix de cartes et Arbres ++++++++

// +++++++ Revient a la position initial ++++++++
L.easyButton('<img src="images/home.png" width="26" height="26" >', function () {
    carte.setView([50.86070401717095, 4.3830651582691456], 13);
    layerGroup.clearLayers();
}).addTo(carte);

// +++++++ Géolocalisation ++++++++
function onLocationFound(e) {
    var radius = e.accuracy / 2;
    var location = e.latlng
    L.marker(location).addTo(carte)
    L.circle(location, radius).addTo(carte);
}

function onLocationError(e) {
    alert(e.message);
}

function getLocationLeafvar() {
    carte.on('locationfound', onLocationFound);
    carte.on('locationerror', onLocationError);
    carte.locate({ setView: true, maxZoom: 15 });
}

L.easyButton('<img src="images/gps-position.png" width="26" height="26" >', function () {
    getLocationLeafvar()
}).addTo(carte);

// +++++++  MousePosition Maps ++++++++
var mousePoistion = L.geoportalControl.MousePosition({
    position: 'bottomright',
    collapsed: true,
    units: [],
}).addTo(carte);

// +++++++ Esri Leafvar Geocoder ++++++++
var searchControl = L.esri.Geocoding.geosearch({
    position: 'topleft',
    zoomToResult: true,
    useMapBounds: true,
    providers: [L.esri.Geocoding.arcgisOnlineProvider()],
    collapseAfterResult: true,
    expanded: false,
    title: 'Recherche d`emplacement',
    placeholder: 'SVP, Entrez une adresse...'
}).addTo(carte);

var geocodeService = L.esri.Geocoding.geocodeService({});
var markerReal
var layerGroup = L.layerGroup().addTo(carte);

carte.on('click', function (e) {
    // var positionMarker = e.latlng
    ClearMarkerData()
    //addMarker(positionMarker)

    geocodeService.reverse().latlng(e.latlng).run(function (error, result) {
        if (error) {
            return;
        }
        //var emplacement = convertToAddress(e.latlng);
        var lngLatString = `${Math.round(result.latlng.lat * 100000) / 100000}, ${Math.round(result.latlng.lng * 100000) / 100000}`;
        layerGroup.clearLayers();
        marker = L.marker(result.latlng)
            .addTo(layerGroup) //.addTo(carte) l'utilisation de vette option permet au marqueur de rester sur la carte
            .bindPopup(`<dt>${lngLatString}</dt>` + `<dt>${result.address.LongLabel}</dt>`) // adresse avec les coordonnées gps 
            //.bindPopup(result.address.Match_addr) // adresse sans les coordonnées gps 
            //.bindPopup(result.address.LongLabel) // version plus longue de l'adresse Match_addr contenant plus d'informations administratives
            //.bindPopup(result.address.ShortLabel) // version abrégée de l'adresse Match_addr
            .openPopup();

        //document.querySelector("#LatitudeArb").value = result.latlng.lat
        //document.querySelector("#LongitudeArb").value = result.latlng.lng
        //document.querySelector("#CommentairesBCE").value = result.address.LongLabel
        document.querySelector("#CommentairesBCE").value = result.address.LongLabel + "\n" + "Lat: " + result.latlng.lat + " - " + "Lon: " + result.latlng.lat
    });
});

// +++++++ Javascript Functions ++++++++
function ClearMarkerData() {
    layerGroup.clearLayers();
};

function ClearMarkerData_ORIGINAL() {
    layerGroup.clearLayers();

    document.querySelector("EntityNumBCE").value = ""
    document.querySelector("EnterpNumBCE").value = ""
    document.querySelector("EntityTypeBCE").value = ""
    document.querySelector("NomBCE").value = ""
    document.querySelector("NaceBCE").value = ""
    document.querySelector("SecCodeBCE").value = ""
    document.querySelector("SecGroupBCE").value = ""
    document.querySelector("AdressesEntityBCE").value = ""
    document.querySelector("AddressEnterpriseBCE").value = ""
    document.querySelector("AdresseURBISBCE").value = ""
    document.querySelector("StreetBCE").value = ""
    //document.querySelector("HouseNumBCE").value = ""
    //document.querySelector("CityBCE").value = ""
    document.querySelector("QuartierBCE").value = ""
    document.querySelector("LatitudeBCE").value = ""
    document.querySelector("LongitudeBCE").value = ""
    document.querySelector("CommentairesBCE").value = ""

    document.querySelector("TypeOfEnterprise").value = ""
    document.querySelector("Classification").value = ""
    document.querySelector("JuridicalForm").value = ""
    document.querySelector("Division").value = ""
    document.querySelector("Activites").value = ""
};

var TreeIconNEW = L.icon({
    iconUrl: src = "images/home.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [-5, 5]
});

function addMarker(positionMarker) {
    // On verifie si un marqueur existence
    if (markerReal != undefined) {
        carte.removeLayer(markerReal)
    }
    markerReal = L.marker(
        positionMarker, { icon: TreeIconNEW }
    )
    document.querySelector("#LatitudeBCE").value = positionMarker.lat;
    document.querySelector("#LongitudeBCE").value = positionMarker.lng;

    markerReal.addTo(carte)
}

// +++++++ menu principal +++++++++++++++++
let MyControlClass = L.Control.extend({
    options: {
        position: 'topleft',
    },

    onAdd: function (carte) {
        var div = L.DomUtil.create('div', 'leaflet-bar my-control');

        var myButton = L.DomUtil.create('button', 'my-button-class', div);
        myButton.innerHTML = 'menu principal';
        myButton.style.width = '85px';
        L.DomEvent.on(myButton, 'click', function () {
            window.open("../index.html");
            window.close();
        }, this);
        return div;
    },

    onRemove: function (carte) {
    }
});
let myControl = new MyControlClass().addTo(carte);

// +++++++ Menu principal  +++++++++++
let ChartPopClass = L.Control.extend({
    options: { position: 'topleft' },

    onAdd: function (carte) {
        var div = L.DomUtil.create('div', 'leaflet-bar my-control');

        var myButton = L.DomUtil.create('button', 'my-button-class', div);
        myButton.innerHTML = 'Affichage des statistiques globales';
        myButton.style.width = '150px';
        myButton.style.height = '30px';
        L.DomEvent.on(myButton, 'click', function () {
            window.open("BCE1030Charts.html");
            window.close();
        }, this);
        return div;
    },

    onRemove: function (carte) {
    }
});
let ChartPopControl = new ChartPopClass().addTo(carte);

// +++++++ Title  +++++++++++
var title = new L.Control({ 'position': 'bottomleft' });
title.onAdd = function (carte) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
title.update = function () {
    this._div.innerHTML = '<a style="font-size: 17px; background-color: white; border: 4px solid white">Entités commerciales BCE-1030</a>';
};
title.addTo(carte);

// +++++++ .Watermark  ++++++++++
L.Control.Watermark = L.Control.extend({
    onAdd: function (carte) {
        var img = L.DomUtil.create('img');
        img.src = 'images/schaerbeek1030_logo_white.png';
        img.style.width = '75px';

        return img;
    },
    onRemove: function (carte) {
        // Nothing to do here
    }
});
L.control.watermark = function (opts) { return new L.Control.Watermark(opts); }
L.control.watermark({ position: 'bottomleft' }).addTo(carte);