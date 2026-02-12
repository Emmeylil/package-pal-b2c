<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    // Pre-bundled stations to guarantee visibility even if fetch fails
    const FALLBACK_STATIONS = [
        {
            name: "Jumia Pickup Station Oron Road",
            week: "Mon-Fri 8am-6pm",
            weekend: "Sat 9am-5pm",
            phone: "2348143224330",
            address: "39 Oron Road opposite old Oron Road",
            state: "Akwa Ibom",
            landmark: "Opposite Old Oron Road",
            map: "https://maps.app.goo.gl/yH8G5oM92T7n6M997",
            lat: 5.0315537,
            lng: 7.9147607,
        },
        {
            name: "Jumia Pickup Station Idi-Aba",
            week: "Mon-Fri 8am-5pm",
            weekend: "Sat 9am-5pm",
            phone: "2349169875561",
            address: "Shop 11, Bayus Complex, Idi-aba, Abeokuta",
            state: "Ogun",
            landmark: "Opposite Federal Medical Center",
            map: "https://maps.app.goo.gl/6cs6kF9ExRXVU8ZT9",
            lat: 7.1434077,
            lng: 3.3739137,
        },
        {
            name: "Jumia Pickup Station-Palmgrove",
            week: "Mon-Fri 8am-6pm",
            weekend: "Sat 9am-5pm",
            phone: "2348065658678",
            address: "2, Efunboye Close, Off Shyllon street, Palmgrove, Lagos",
            state: "Lagos",
            landmark: "Shyllon Primary School",
            map: "https://maps.app.goo.gl/ANwtqg4tDMuRtTRR6",
            lat: 6.5395362,
            lng: 3.3644841,
        },
        {
            name: "Jumia Pickup Station Akure",
            week: "Mon-Fri 8am-5pm",
            weekend: "Sat 9am-5pm",
            phone: "2349035516600",
            address: "3 shessy emirate filling station, Oda road Akure",
            state: "Ondo",
            landmark: "SUPEB Office",
            map: "https://maps.app.goo.gl/crx1ERQXiHZCHbxY7",
            lat: 7.2315537,
            lng: 5.2147607,
        },
        {
            name: "Jumia Pickup Station Ihiala",
            week: "Mon-Fri 8am-6pm",
            weekend: "Sat 9am-5pm",
            phone: "2348134192652",
            address: "Shop 104 LJO plaza opposite GUO transport company",
            state: "Anambra",
            landmark: "GUO transport company",
            map: "https://maps.app.goo.gl/73L2J1LMWgGx28Gf7",
            lat: 5.8587522,
            lng: 6.8596315,
        },
    ];

    /** @type {any[]} */
    let stations = $state(FALLBACK_STATIONS); // Start with fallback to avoid blank screen
    let searchTerm = $state("");
    let loading = $state(true);
    let error = $state(null);
    /** @type {any|null} */
    let selectedStation = $state(FALLBACK_STATIONS[0]);
    /** @type {any} */
    let map = null;
    let mapElement = $state();
    let markerMap = new Map();

    onMount(async () => {
        try {
            const res = await fetch("/api/stations");
            if (!res.ok) throw new Error("HTTP " + res.status);
            const parsed = await res.json();
            if (parsed.length > 0) {
                stations = parsed;
                selectedStation = stations[0];
            }
        } catch (e) {
            console.warn(
                "Using pre-bundled network data due to connection issue.",
            );
        } finally {
            loading = false;
        }
    });

    async function initMap() {
        if (!browser || !mapElement || stations.length === 0) return;
        if (typeof (/** @type {any} */ (window).L) === "undefined") {
            setTimeout(initMap, 200);
            return;
        }
        if (map) return;
        const L = /** @type {any} */ (window).L;
        const DefaultIcon = L.icon({
            iconUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        });
        L.Marker.prototype.options.icon = DefaultIcon;

        const pos =
            selectedStation && Number.isFinite(selectedStation.lat)
                ? [selectedStation.lat, selectedStation.lng]
                : [6.5244, 3.3792];
        map = L.map(mapElement, {
            zoomControl: true,
            scrollWheelZoom: false,
        }).setView(pos, 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap",
        }).addTo(map);

        stations.forEach((s) => {
            if (Number.isFinite(s.lat) && Number.isFinite(s.lng)) {
                const m = L.marker([s.lat, s.lng])
                    .addTo(map)
                    .bindPopup(
                        `<b>${s.name}</b><br><span style="font-size: 12px">${s.address}</span>`,
                    );
                m.on("click", () => selectStation(s));
                markerMap.set(s.name, m);
            }
        });

        setTimeout(() => map.invalidateSize(), 100);
    }

    $effect(() => {
        if (!loading && browser) initMap();
    });

    /** @param {any} s */
    function selectStation(s) {
        selectedStation = s;
        if (map && s.lat) {
            map.setView([s.lat, s.lng], 15);
            markerMap.get(s.name)?.openPopup();
        }
    }

    let filteredStations = $derived(
        stations.filter(
            (s) =>
                s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.state?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</svelte:head>

<section id="pickup-stations" class="bg-[#f2f2f2] py-8 md:py-16 min-h-[600px]">
    <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-10">
            <h2 class="text-3xl md:text-4xl font-bold mb-2">
                Explore our network and pickup points
            </h2>
            <p class="text-[#75757a]">
                With {stations.length}+ Pickup Points, dropping off a package is
                simple.
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
            <!-- Sidebar -->
            <div
                class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[500px] lg:h-[700px] flex flex-col order-2 lg:order-1"
            >
                <input
                    type="text"
                    bind:value={searchTerm}
                    placeholder="Search stations..."
                    class="w-full px-4 py-2.5 bg-[#f8f9fa] border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f68b1e] text-sm mb-4"
                />
                <div class="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                    {#each filteredStations as station}
                        <button
                            onclick={() => selectStation(station)}
                            class="w-full text-left p-4 rounded-lg border transition-all text-sm font-medium {selectedStation?.name ===
                            station.name
                                ? 'bg-[#f68b1e] text-white'
                                : 'bg-[#fefaf6] hover:border-gray-300'}"
                        >
                            {station.name}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Map Card -->
            <div
                class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px] lg:h-[700px] order-1 lg:order-2"
            >
                <div class="flex-1 relative bg-gray-100">
                    <div
                        bind:this={mapElement}
                        class="absolute inset-0 z-0 h-full w-full"
                    ></div>
                    {#if loading && stations.length < 10}
                        <div
                            class="absolute inset-0 flex items-center justify-center bg-white/50 z-10 font-bold"
                        >
                            Connecting...
                        </div>
                    {/if}
                </div>
                <div id="station-details" class="p-6 md:p-10 border-t bg-white">
                    {#if selectedStation}
                        <h3
                            class="text-xl md:text-3xl font-bold text-[#212529] mb-4"
                        >
                            {selectedStation.name}
                        </h3>
                        <div class="space-y-4 text-sm md:text-base">
                            <p
                                class="text-[#212529] font-medium leading-relaxed"
                            >
                                {selectedStation.address}, {selectedStation.state}
                            </p>

                            {#if selectedStation.landmark}
                                <p class="text-[#75757a]">
                                    <span class="font-bold text-[#212529]"
                                        >Landmark:</span
                                    >
                                    {selectedStation.landmark}
                                </p>
                            {/if}

                            <div
                                class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 pt-4 text-[#75757a]"
                            >
                                <div class="flex items-center gap-2.5">
                                    <svg
                                        class="w-5 h-5 opacity-60"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        ><path
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            stroke-width="2"
                                        ></path></svg
                                    >
                                    <span>Mon-Fri: {selectedStation.week}</span>
                                </div>
                                <div class="flex items-center gap-2.5">
                                    <svg
                                        class="w-5 h-5 opacity-60"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        ><path
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            stroke-width="2"
                                        ></path></svg
                                    >
                                    <span>Sat: {selectedStation.weekend}</span>
                                </div>
                                <div
                                    class="flex items-center gap-2.5 font-bold text-[#212529]"
                                >
                                    <svg
                                        class="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        ><path
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            stroke-width="2"
                                        ></path></svg
                                    >
                                    <span>{selectedStation.phone}</span>
                                </div>
                                {#if selectedStation.map}
                                    <a
                                        href={selectedStation.map}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-[#f68b1e] font-bold hover:underline"
                                    >
                                        Get Directions →
                                    </a>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 5px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e0e0e0;
        border-radius: 10px;
    }
    :global(.leaflet-container) {
        z-index: 1;
        width: 100% !important;
        height: 100% !important;
        border-radius: 4px;
    }
</style>
