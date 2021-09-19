<script lang="ts">
  import L from "leaflet";
  import MapToolbar from "./MapToolbar.svelte";
  import MarkerPopup from "./MarkerPopup.svelte";
  import { bubble } from "./markers.ts";
  import { fetchDocs, getCoords } from "./data.ts";
  let map;

  async function getData() {
    const csv = await fetchDocs();

    const markers = csv.forEach(line => {
      const m = createMarker(getCoords(line["Koordinaten"]), line);
      markerLayers.addLayer(m);
    });
  }

  getData();

  const initialView = [52.520008, 13.404954];
  function createMap(container) {
    let m = L.map(container, { preferCanvas: true }).setView(initialView, 13);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
        subdomains: "abcd",
        maxZoom: 16
      }
    ).addTo(m);

    return m;
  }

  let eye = true;
  let lines = true;

  let toolbar = L.control({ position: "topright" });
  let toolbarComponent;

  toolbar.onAdd = map => {
    let div = L.DomUtil.create("div");
    toolbarComponent = new MapToolbar({
      target: div,
      props: {}
    });

    toolbarComponent.$on("click-eye", ({ detail }) => (eye = detail));
    toolbarComponent.$on("click-reset", () => {
      map.setView(initialView, 13, { animate: true });
    });

    return div;
  };

  toolbar.onRemove = () => {
    if (toolbarComponent) {
      toolbarComponent.$destroy();
      toolbarComponent = null;
    }
  };

  function bindPopup(marker, createFn) {
    let popupComponent;
    marker.bindPopup(() => {
      let container = L.DomUtil.create("div");
      popupComponent = createFn(container);
      return container;
    });

    marker.on("popupclose", () => {
      if (popupComponent) {
        let old = popupComponent;
        popupComponent = null;
        // Wait to destroy until after the fadeout completes.
        setTimeout(() => {
          old.$destroy();
        }, 500);
      }
    });
  }

  let markers = new Map();

  function markerIcon(count) {
    let html = `<div class="map-marker">
	<div>${bubble}</div>
	<div class="marker-text">${count}</div>
</div>`;
    return L.divIcon({
      html,
      className: "map-marker"
    });
  }

  function createMarker(
    loc: { lat: number; long: number },
    data: { Name: string; Rezension: string; Sterne: string }
  ) {
    const icon = markerIcon(data.Sterne);
    const marker = L.marker([loc.lat, loc.long], { icon });

    bindPopup(marker, m => {
      return new MarkerPopup({
        target: m,
        props: {
          data
        }
      });
    });

    return marker;
  }

  let markerLayers;
  let lineLayers;
  function mapAction(container) {
    map = createMap(container);
    toolbar.addTo(map);

    markerLayers = L.layerGroup();
    markerLayers.addTo(map);

    return {
      destroy: () => {
        toolbar.remove();
        map.remove();
        map = null;
      }
    };
  }

  // We could do these in the toolbar's click handler but this is an example
  // of modifying the map with reactive syntax.
  $: if (markerLayers && map) {
    if (eye) {
      markerLayers.addTo(map);
    } else {
      markerLayers.remove();
    }
  }

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }
</script>

<style>
  .map :global(.marker-text) {
    width: min-content;
    text-align: center;
    font-weight: 600;
    background-color: #444;
    color: #eee;
    border-radius: 0.5rem;
  }

  .map :global(.map-marker) {
    width: 30px;
    /* transform: translateX(-50%) translateY(-25%); */
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>

<svelte:window on:resize={resizeMap} />
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
  crossorigin="" />
<div class="map" style="height:100%;width:100%" use:mapAction />
