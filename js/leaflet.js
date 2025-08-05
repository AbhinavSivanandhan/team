// Leaflet Map Integration for Team Projects
// Displays listings data on an interactive map with customizable popups

class LeafletMapManager {
    constructor(containerId = 'map', options = {}) {
        this.containerId = containerId;
        this.map = null;
        this.markers = [];
        this.currentMapStyle = 'monochrome';
        this.currentOverlay = null;
        this.popupOptions = {
            maxWidth: 300,
            className: 'custom-popup',
            closeButton: true,
            autoPan: true,
            autoPanPadding: [20, 48]  // More comfortable space above popup [horizontal, vertical] - added 18px
        };
        
        // Default options
        this.options = {
            height: '500px',
            width: '100%',
            defaultLat: 33.7490,  // Atlanta, GA
            defaultLng: -84.3880,
            defaultZoom: 9,
            ...options
        };
        
        // Map style configurations
        this.mapStyles = {
            monochrome: {
                name: 'Monochrome',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '© OpenStreetMap contributors',
                filter: 'grayscale(1) contrast(1.3) brightness(0.9)'
            },
            coral: {
                name: 'Coral Reef',
                url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                attribution: '© OpenStreetMap contributors, © CARTO',
                filter: 'hue-rotate(330deg) saturate(1.4) contrast(1.1) brightness(1.1)'
            },
            light: {
                name: 'Light Mode',
                url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                attribution: '© OpenStreetMap contributors, © CARTO'
            },
            dark: {
                name: 'Dark Mode',
                url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                attribution: '© OpenStreetMap contributors, © CARTO'
            },
            darkmatter: {
                name: 'Dark Matter',
                url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                attribution: '© OpenStreetMap contributors, © CARTO'
            },
            openstreetmap: {
                name: 'OpenStreetMap',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '© OpenStreetMap contributors'
            },
            satellite: {
                name: 'Satellite',
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                attribution: '© Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
                overlayUrl: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
                overlayAttribution: '© OpenStreetMap contributors, © CARTO'
            },
            terrain: {
                name: 'Terrain',
                url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                attribution: '© OpenTopoMap contributors'
            },
            voyager: {
                name: 'Voyager',
                url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                attribution: '© OpenStreetMap contributors, © CARTO'
            },
            positron: {
                name: 'Positron',
                url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
                attribution: '© OpenStreetMap contributors, © CARTO'
            },
            vintage: {
                name: 'Vintage',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '© OpenStreetMap contributors',
                filter: 'sepia(0.8) contrast(1.2) brightness(0.9) hue-rotate(15deg)'
            },
            sunset: {
                name: 'Sunset',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '© OpenStreetMap contributors',
                filter: 'sepia(0.5) saturate(1.8) hue-rotate(15deg) brightness(0.9) contrast(1.1)'
            },
            forest: {
                name: 'Forest',
                url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                attribution: '© OpenTopoMap contributors',
                filter: 'hue-rotate(80deg) saturate(1.5) contrast(1.1) brightness(0.9)'
            },
            infrared: {
                name: 'Infrared',
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                attribution: '© Esri, Maxar, GeoEye, Earthstar Geographics',
                filter: 'hue-rotate(180deg) saturate(2.5) contrast(1.4)',
                overlayUrl: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
                overlayAttribution: '© OpenStreetMap contributors, © CARTO'
            },
            emerald: {
                name: 'Emerald City',
                url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                attribution: '© OpenStreetMap contributors, © CARTO',
                filter: 'hue-rotate(120deg) saturate(1.8) contrast(1.2) brightness(0.9)'
            },
            sepia: {
                name: 'Old Map',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '© OpenStreetMap contributors',
                filter: 'sepia(1) saturate(0.8) contrast(1.2) brightness(0.8)'
            },
            desert: {
                name: 'Desert',
                url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                attribution: '© OpenTopoMap contributors',
                filter: 'hue-rotate(25deg) saturate(1.2) contrast(1.1) brightness(1.1)'
            },
            autumn: {
                name: 'Autumn Leaves',
                url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                attribution: '© OpenTopoMap contributors',
                filter: 'hue-rotate(15deg) saturate(1.6) contrast(1.1) brightness(1.0) sepia(0.3)'
            },
            thermal: {
                name: 'Thermal Vision',
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                attribution: '© Esri, Maxar, GeoEye, Earthstar Geographics',
                filter: 'hue-rotate(60deg) saturate(3) contrast(1.8) brightness(1.2)',
                overlayUrl: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
                overlayAttribution: '© OpenStreetMap contributors, © CARTO'
            },
            sage: {
                name: 'Sage',
                url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                attribution: '© OpenTopoMap contributors',
                filter: 'hue-rotate(90deg) saturate(0.7) contrast(1.0) brightness(0.95)'
            },
            bronze: {
                name: 'Bronze Age',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '© OpenStreetMap contributors',
                filter: 'sepia(0.4) hue-rotate(35deg) saturate(1.1) contrast(1.1) brightness(0.9)'
            }
        };
        
        this.init();
    }
    
    init() {
        this.createMapContainer();
        this.initializeMap();
        this.addMapStyleSelector();
        this.addCustomCSS();
    }
    
    createMapContainer() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Map container '${this.containerId}' not found`);
            return;
        }
        
        // Set container styles
        container.style.width = this.options.width;
        container.style.height = this.options.height;
        container.style.position = 'relative';
        container.style.borderRadius = '8px';
        container.style.overflow = 'hidden';
        container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        
        // Add Leaflet CSS if not already present
        if (!document.querySelector('link[href*="leaflet.css"]')) {
            const leafletCSS = document.createElement('link');
            leafletCSS.rel = 'stylesheet';
            leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            leafletCSS.crossOrigin = '';
            document.head.appendChild(leafletCSS);
        }
        
        // Add Leaflet JS if not already present
        if (!window.L) {
            const leafletJS = document.createElement('script');
            leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            leafletJS.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            leafletJS.crossOrigin = '';
            leafletJS.onload = () => this.initializeMap();
            document.head.appendChild(leafletJS);
            return;
        }
    }
    
    initializeMap() {
        if (!window.L) {
            setTimeout(() => this.initializeMap(), 100);
            return;
        }
        
        // Initialize map with scroll zoom disabled initially
        this.map = L.map(this.containerId, {
            scrollWheelZoom: false
        }).setView(
            [this.options.defaultLat, this.options.defaultLng], 
            this.options.defaultZoom
        );
        
        // Add click event to toggle scroll zoom
        this.map.on('click', () => {
            if (this.map.scrollWheelZoom.enabled()) {
                this.map.scrollWheelZoom.disable();
                this.showScrollZoomNotification(false);
            } else {
                this.map.scrollWheelZoom.enable();
                this.showScrollZoomNotification(true);
            }
        });
        
        // Load cached background style
        const cachedStyle = this.loadCachedMapStyle();
        if (cachedStyle && this.mapStyles[cachedStyle]) {
            this.currentMapStyle = cachedStyle;
        }
        
        // Add initial tile layer
        this.setMapStyle(this.currentMapStyle);
        
        // Add zoom event listener for dynamic icon sizing
        this.map.on('zoomend', () => {
            this.updateMarkerSizes();
            this.updateZoomDisplay();
        });
        
        // Add zoom display
        this.addZoomDisplay();
    }
    
    addMapStyleSelector() {
        // Create style selector control
        const styleControl = L.control({ position: 'topright' });
        
        styleControl.onAdd = (map) => {
            const div = L.DomUtil.create('div', 'map-style-selector');
            div.innerHTML = `
                <select class="map-style-select">
                    ${Object.entries(this.mapStyles).map(([key, style]) => 
                        `<option value="${key}" ${key === this.currentMapStyle ? 'selected' : ''}>${style.name}</option>`
                    ).join('')}
                </select>
            `;
            
            // Prevent map interaction when clicking selector
            L.DomEvent.disableClickPropagation(div);
            L.DomEvent.disableScrollPropagation(div);
            
            // Handle style changes
            const select = div.querySelector('.map-style-select');
            select.addEventListener('change', (e) => {
                this.setMapStyle(e.target.value);
                this.saveCachedMapStyle(e.target.value);
            });
            
            return div;
        };
        
        styleControl.addTo(this.map);
    }
    
    setMapStyle(styleKey) {
        if (!this.mapStyles[styleKey]) return;
        
        const style = this.mapStyles[styleKey];
        this.currentMapStyle = styleKey;
        
        // Remove existing tile layers
        this.map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                this.map.removeLayer(layer);
            }
        });
        
        // Add base tile layer
        const tileLayer = L.tileLayer(style.url, {
            attribution: style.attribution,
            maxZoom: 18
        }).addTo(this.map);
        
        // Add overlay layer if specified (for labels on satellite imagery)
        // Only show labels at zoom level 8 and above
        if (style.overlayUrl) {
            const overlayLayer = L.tileLayer(style.overlayUrl, {
                attribution: style.overlayAttribution || '',
                maxZoom: 18,
                minZoom: 8  // Only show labels at zoom 8+
            }).addTo(this.map);
            
            // Store reference to overlay for dynamic visibility
            this.currentOverlay = overlayLayer;
        } else {
            this.currentOverlay = null;
        }
        
        // Apply CSS filter if specified
        if (style.filter) {
            const mapContainer = document.getElementById(this.containerId);
            if (mapContainer) {
                // Remove any existing filter
                const existingTiles = mapContainer.querySelectorAll('.leaflet-tile-pane');
                existingTiles.forEach(pane => {
                    pane.style.filter = '';
                });
                
                // Apply new filter after a short delay to ensure tiles are loaded
                setTimeout(() => {
                    const tilePane = mapContainer.querySelector('.leaflet-tile-pane');
                    if (tilePane) {
                        tilePane.style.filter = style.filter;
                    }
                }, 100);
            }
        } else {
            // Remove any existing filter
            const mapContainer = document.getElementById(this.containerId);
            if (mapContainer) {
                const tilePane = mapContainer.querySelector('.leaflet-tile-pane');
                if (tilePane) {
                    tilePane.style.filter = '';
                }
            }
        }
    }
    
    addMarkersFromData(data, config = {}) {
        // Clear existing markers
        this.clearMarkers();
        
        if (!Array.isArray(data) || data.length === 0) {
            console.warn('No data provided for map markers');
            return;
        }
        
        const validMarkers = [];
        
        data.forEach((item, index) => {
            const coords = this.extractCoordinates(item);
            if (coords.lat && coords.lng) {
                const marker = this.createMarker(coords.lat, coords.lng, item, config);
                if (marker) {
                    validMarkers.push({ marker, coords });
                }
            }
        });
        
        // Fit map to show all markers if we have valid markers
        if (validMarkers.length > 0) {
            const group = new L.featureGroup(validMarkers.map(m => m.marker));
            this.map.fitBounds(group.getBounds(), { 
                padding: [10, 10],
                maxZoom: 15  // Zoom closer to fill screen more
            });
        }
        
        console.log(`Added ${validMarkers.length} markers to map from ${data.length} data items`);
    }
    
    extractCoordinates(item) {
        // Try various coordinate field names
        const latFields = ['latitude', 'lat', 'Latitude', 'LAT', 'y', 'Y'];
        const lngFields = ['longitude', 'lng', 'lon', 'Longitude', 'LON', 'LONGITUDE', 'x', 'X'];
        
        let lat = null, lng = null;
        
        // Find latitude
        for (const field of latFields) {
            if (item[field] && !isNaN(parseFloat(item[field]))) {
                lat = parseFloat(item[field]);
                break;
            }
        }
        
        // Find longitude
        for (const field of lngFields) {
            if (item[field] && !isNaN(parseFloat(item[field]))) {
                lng = parseFloat(item[field]);
                break;
            }
        }
        
        // Validate coordinates
        if (lat && lng && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            return { lat, lng };
        }
        
        return { lat: null, lng: null };
    }
    
    createMarker(lat, lng, data, config = {}) {
        try {
            // Create custom icon with zoom-based sizing and shape
            const currentZoom = this.map.getZoom();
            const iconSize = this.getIconSizeForZoom(currentZoom);
            const markerHtml = this.getMarkerHtml(currentZoom, iconSize);
            
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: markerHtml,
                iconSize: [iconSize, iconSize],
                iconAnchor: this.getIconAnchor(currentZoom, iconSize),
                popupAnchor: this.getPopupAnchor(currentZoom, iconSize)
            });
            
            // Create marker with custom icon
            const marker = L.marker([lat, lng], { icon: customIcon });
            
            // Store original data for updates
            marker._markerData = data;
            marker._markerConfig = config;
            
            // Create popup content
            const popupContent = this.createPopupContent(data, config);
            
            // Bind popup with custom options
            marker.bindPopup(popupContent, this.popupOptions);
            
            // Add to map and store reference
            marker.addTo(this.map);
            this.markers.push(marker);
            
            return marker;
        } catch (error) {
            console.error('Error creating marker:', error);
            return null;
        }
    }
    
    createPopupContent(data, config = {}) {
        // Get recognized fields
        const name = this.getFieldValue(data, config.nameColumn || ['name', 'Name', 'organization name', 'city', 'City']);
        const title = this.getFieldValue(data, config.titleColumn || ['title', 'Title']);
        const address = this.getFieldValue(data, config.addressColumn || ['address', 'Address']);
        const category = this.getFieldValue(data, config.valueColumn || ['category', 'Category']);
        const description = this.getFieldValue(data, ['description', 'Description', 'details']);
        const phone = this.getFieldValue(data, ['phone', 'Phone', 'telephone']);
        const email = this.getFieldValue(data, ['email', 'Email']);
        const website = this.getFieldValue(data, ['website', 'Website', 'url', 'URL']);
        const population = this.getFieldValue(data, ['population', 'Population']);
        
        let content = '<div class="popup-content">';
        
        // Header section
        if (name) {
            content += `<div class="popup-title">${this.escapeHtml(name)}</div>`;
        }
        
        if (title && title !== name) {
            content += `<div class="popup-subtitle">${this.escapeHtml(title)}</div>`;
        }
        
        if (category) {
            content += `<div class="popup-category">${this.escapeHtml(category)}</div>`;
        }
        
        // Description
        if (description) {
            content += `<div class="popup-description">${this.escapeHtml(description)}</div>`;
        }
        
        // Address
        if (address) {
            content += `<div class="popup-field">
                <span class="popup-icon">📍</span>
                <span class="popup-text">${this.escapeHtml(address)}</span>
            </div>`;
        }
        
        // Contact info
        if (phone) {
            content += `<div class="popup-field">
                <span class="popup-icon">📞</span>
                <a href="tel:${phone}" class="popup-link">${this.formatPhone(phone)}</a>
            </div>`;
        }
        
        if (email) {
            content += `<div class="popup-field">
                <span class="popup-icon">✉️</span>
                <a href="mailto:${email}" class="popup-link">${this.escapeHtml(email)}</a>
            </div>`;
        }
        
        if (website) {
            const url = website.startsWith('http') ? website : `https://${website}`;
            content += `<div class="popup-field">
                <span class="popup-icon">🌐</span>
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="popup-link">${this.escapeHtml(website)}</a>
            </div>`;
        }
        
        // Population
        if (population) {
            content += `<div class="popup-field">
                <span class="popup-icon">👥</span>
                <span class="popup-text">Population: ${this.formatNumber(population)}</span>
            </div>`;
        }
        
        // Additional data (show up to 3 extra fields)
        const extraFields = this.getExtraFields(data, { nameColumn: config.nameColumn, titleColumn: config.titleColumn, addressColumn: config.addressColumn, valueColumn: config.valueColumn });
        if (extraFields.length > 0) {
            content += '<div class="popup-extra">';
            extraFields.slice(0, 3).forEach(([key, value]) => {
                content += `<div class="popup-field popup-field-small">
                    <span class="popup-label">${this.formatFieldName(key)}:</span>
                    <span class="popup-text">${this.escapeHtml(String(value))}</span>
                </div>`;
            });
            content += '</div>';
        }
        
        content += '</div>';
        return content;
    }
    
    getFieldValue(data, fieldNames) {
        if (typeof fieldNames === 'string') {
            fieldNames = [fieldNames];
        }
        
        for (const fieldName of fieldNames) {
            if (data[fieldName] && String(data[fieldName]).trim()) {
                return String(data[fieldName]).trim();
            }
        }
        return null;
    }
    
    getExtraFields(data, usedColumns = {}) {
        const usedFields = new Set([
            usedColumns.nameColumn,
            usedColumns.titleColumn, 
            usedColumns.addressColumn,
            usedColumns.valueColumn,
            'name', 'Name', 'organization name', 'city', 'City',
            'title', 'Title', 'address', 'Address', 'category', 'Category',
            'description', 'Description', 'details',
            'phone', 'Phone', 'telephone', 'email', 'Email',
            'website', 'Website', 'url', 'URL', 'population', 'Population',
            'latitude', 'lat', 'Latitude', 'LAT', 'y', 'Y',
            'longitude', 'lng', 'lon', 'Longitude', 'LON', 'LONGITUDE', 'x', 'X'
        ]);
        
        return Object.entries(data)
            .filter(([key, value]) => !usedFields.has(key) && value && String(value).trim())
            .slice(0, 5); // Limit to 5 extra fields
    }
    
    formatFieldName(fieldName) {
        return fieldName
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return phone;
    }
    
    formatNumber(num) {
        const number = parseInt(num);
        if (!isNaN(number) && number > 1000) {
            return number.toLocaleString();
        }
        return num;
    }
    
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    clearMarkers() {
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
    }
    
    getIconSizeForZoom(zoom) {
        // Scale icon size based on zoom level
        // Zoom levels typically range from 1-18
        const minSize = 6;   // Smaller minimum icon size at low zoom
        const maxSize = 28;  // Slightly smaller maximum icon size at high zoom
        const minZoom = 1;
        const maxZoom = 18;
        
        // Linear interpolation between min and max sizes
        const ratio = Math.max(0, Math.min(1, (zoom - minZoom) / (maxZoom - minZoom)));
        return Math.round(minSize + (maxSize - minSize) * ratio);
    }
    
    getMarkerHtml(zoom, iconSize) {
        // Use different dot styles based on zoom level
        if (zoom <= 3) {
            // Half-size dots for zoom 1-3
            const halfSize = Math.max(1, Math.round(iconSize * 0.2));
            return `<div class="marker-dot-tiny" style="width: ${halfSize}px; height: ${halfSize}px;"></div>`;
        } else if (zoom === 4) {
            // 30% dots for zoom 4
            const size4 = Math.max(1, Math.round(iconSize * 0.3));
            return `<div class="marker-dot-tiny" style="width: ${size4}px; height: ${size4}px;"></div>`;
        } else if (zoom === 5) {
            // 40% dots for zoom 5
            const size5 = Math.max(2, Math.round(iconSize * 0.4));
            return `<div class="marker-dot-tiny" style="width: ${size5}px; height: ${size5}px;"></div>`;
        } else if (zoom === 6) {
            // 60% dots for zoom 6
            const size6 = Math.max(2, Math.round(iconSize * 0.6));
            return `<div class="marker-dot-tiny" style="width: ${size6}px; height: ${size6}px;"></div>`;
        } else if (zoom === 7) {
            // 100% pins for zoom 7
            return `<div class="marker-pin" style="width: ${iconSize}px; height: ${iconSize}px;">
                      <div class="marker-dot"></div>
                    </div>`;
        } else {
            // Regular pin markers for zoom 8+
            return `<div class="marker-pin" style="width: ${iconSize}px; height: ${iconSize}px;">
                      <div class="marker-dot"></div>
                    </div>`;
        }
    }
    
    getIconAnchor(zoom, iconSize) {
        // Adjust anchor based on marker type and size
        if (zoom <= 3) {
            const halfSize = Math.max(1, Math.round(iconSize * 0.2));
            return [halfSize/2, halfSize/2];  // Center anchor for half-size dots
        } else if (zoom === 4) {
            const size4 = Math.max(1, Math.round(iconSize * 0.3));
            return [size4/2, size4/2];  // Center anchor for 30% dots
        } else if (zoom === 5) {
            const size5 = Math.max(2, Math.round(iconSize * 0.4));
            return [size5/2, size5/2];  // Center anchor for 40% dots
        } else if (zoom === 6) {
            const size6 = Math.max(2, Math.round(iconSize * 0.6));
            return [size6/2, size6/2];  // Center anchor for 60% dots
        } else if (zoom === 7) {
            return [iconSize/2, iconSize];    // Bottom center for 100% pins
        } else {
            return [iconSize/2, iconSize];    // Bottom center for regular pins
        }
    }
    
    getPopupAnchor(zoom, iconSize) {
        // Adjust popup position based on marker type
        if (zoom <= 3) {
            const halfSize = Math.max(1, Math.round(iconSize * 0.2));
            return [0, -halfSize/2];  // Above center for half-size dots
        } else if (zoom === 4) {
            const size4 = Math.max(1, Math.round(iconSize * 0.3));
            return [0, -size4/2];  // Above center for 30% dots
        } else if (zoom === 5) {
            const size5 = Math.max(2, Math.round(iconSize * 0.4));
            return [0, -size5/2];  // Above center for 40% dots
        } else if (zoom === 6) {
            const size6 = Math.max(2, Math.round(iconSize * 0.6));
            return [0, -size6/2];  // Above center for 60% dots
        } else if (zoom === 7) {
            return [0, -iconSize];    // Above 100% pin point
        } else {
            return [0, -iconSize];    // Above regular pin point
        }
    }
    
    updateMarkerSizes() {
        const currentZoom = this.map.getZoom();
        const newIconSize = this.getIconSizeForZoom(currentZoom);
        
        this.markers.forEach(marker => {
            // Create new icon with updated size and shape
            const markerHtml = this.getMarkerHtml(currentZoom, newIconSize);
            
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: markerHtml,
                iconSize: [newIconSize, newIconSize],
                iconAnchor: this.getIconAnchor(currentZoom, newIconSize),
                popupAnchor: this.getPopupAnchor(currentZoom, newIconSize)
            });
            
            // Update marker icon
            marker.setIcon(customIcon);
        });
    }
    
    addZoomDisplay() {
        // Create zoom level display control
        const zoomControl = L.control({ position: 'bottomleft' });
        
        zoomControl.onAdd = (map) => {
            const div = L.DomUtil.create('div', 'zoom-display');
            div.innerHTML = `Level: ${this.map.getZoom()}`;
            
            // Prevent map interaction when clicking display
            L.DomEvent.disableClickPropagation(div);
            L.DomEvent.disableScrollPropagation(div);
            
            return div;
        };
        
        zoomControl.addTo(this.map);
        this.zoomControl = zoomControl;
    }
    
    updateZoomDisplay() {
        const zoomDisplay = document.querySelector('.zoom-display');
        if (zoomDisplay) {
            zoomDisplay.innerHTML = `Level: ${this.map.getZoom()}`;
        }
    }
    
    addCustomCSS() {
        if (document.querySelector('#leaflet-custom-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'leaflet-custom-styles';
        style.textContent = `
            /* Map Style Selector */
            .map-style-selector {
                background: white;
                padding: 5px;
                border-radius: 4px;
                box-shadow: 0 1px 5px rgba(0,0,0,0.2);
            }
            
            /* Zoom Level Display */
            .zoom-display {
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            }
            
            .map-style-select {
                border: none;
                background: none;
                font-size: 12px;
                padding: 2px;
                outline: none;
                cursor: pointer;
            }
            
            /* Custom Marker Styles */
            .custom-marker {
                background: none !important;
                border: none !important;
            }
            
            .marker-pin {
                position: relative;
                background: #137AD1;
                border: 1px solid white;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .marker-pin:hover {
                transform: rotate(-45deg) scale(1.1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            }
            
            .marker-dot {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 30%;
                height: 30%;
                background: white;
                border-radius: 50%;
                transform: translate(-50%, -50%) rotate(45deg);
            }
            
            
            /* Tiny dot marker for very low zoom levels */
            .marker-dot-tiny {
                background: #137AD1;
                border: none;
                border-radius: 50%;
                box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .marker-dot-tiny:hover {
                transform: scale(1.3);
                box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            }
            
            /* Custom Popup Styles */
            .leaflet-popup-content-wrapper {
                border-radius: 8px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            }
            
            .leaflet-popup-content {
                margin: 0 !important;
                line-height: 1.4 !important;
            }
            
            .popup-content {
                padding: 12px;
                padding-top: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .popup-title {
                font-size: 16px;
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 4px;
            }
            
            .popup-subtitle {
                font-size: 14px;
                font-weight: 500;
                color: #4a4a4a;
                margin-bottom: 8px;
            }
            
            .popup-category {
                display: inline-block;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: 500;
                color: #1d4ed8;
                background: #dbeafe;
                border-radius: 12px;
                margin-bottom: 8px;
            }
            
            .popup-description {
                font-size: 13px;
                color: #666;
                margin-bottom: 8px;
                line-height: 1.3;
            }
            
            .popup-field {
                display: flex;
                align-items: flex-start;
                gap: 6px;
                margin-bottom: 4px;
                font-size: 13px;
            }
            
            .popup-field-small {
                font-size: 12px;
                margin-bottom: 2px;
            }
            
            .popup-icon {
                font-size: 12px;
                width: 16px;
                flex-shrink: 0;
            }
            
            .popup-text {
                color: #4a4a4a;
                word-break: break-word;
            }
            
            .popup-label {
                font-weight: 500;
                color: #666;
                min-width: 60px;
                flex-shrink: 0;
            }
            
            .popup-link {
                color: #007bff;
                text-decoration: none;
                word-break: break-all;
            }
            
            .popup-link:hover {
                text-decoration: underline;
            }
            
            .popup-extra {
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid #e5e5e5;
            }
            
            /* Scroll zoom notification */
            .scroll-zoom-notification {
                position: absolute;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
                z-index: 1000;
                animation: fadeInOut 2s ease-in-out;
                pointer-events: none;
            }
            
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
            
            /* Responsive popup */
            @media (max-width: 600px) {
                .leaflet-popup-content-wrapper {
                    max-width: 280px !important;
                }
                
                .popup-content {
                    padding: 10px;
                }
                
                .popup-title {
                    font-size: 15px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Public methods for integration with listing apps
    updateFromListingsApp(listingsApp) {
        if (!listingsApp || !listingsApp.filteredListings) {
            console.warn('Invalid listings app provided');
            return;
        }
        
        this.addMarkersFromData(listingsApp.filteredListings, listingsApp.config);
    }
    
    // Cache management methods
    saveCachedMapStyle(styleKey) {
        try {
            localStorage.setItem('leafletMapStyle', styleKey);
        } catch (error) {
            console.warn('Failed to save map style to cache:', error);
        }
    }
    
    loadCachedMapStyle() {
        try {
            return localStorage.getItem('leafletMapStyle');
        } catch (error) {
            console.warn('Failed to load map style from cache:', error);
            return null;
        }
    }
    
    // Show notification for scroll zoom state
    showScrollZoomNotification(enabled) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'scroll-zoom-notification';
        notification.textContent = enabled ? 'Scroll zoom enabled' : 'Scroll zoom disabled';
        
        // Add to map container
        const mapContainer = document.getElementById(this.containerId);
        if (mapContainer) {
            mapContainer.appendChild(notification);
            
            // Remove after 2 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 2000);
        }
    }
    
    destroy() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        this.markers = [];
    }
}

// Auto-initialize map when DOM is ready if map container exists
// Note: This will be controlled by the listings app for better integration
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load and initialize
    setTimeout(() => {
        const mapContainer = document.getElementById('map');
        if (mapContainer && !window.leafletMap && !window.listingsApp) {
            // Only auto-initialize if there's no listings app to control it
            window.leafletMap = new LeafletMapManager('map');
        }
    }, 100);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeafletMapManager;
} else {
    window.LeafletMapManager = LeafletMapManager;
}