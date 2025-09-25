<template> 
  <div class="map-management">
    <!-- Header Section -->
    <section class="map-header-section mt-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 text-center mb-4">
            <h2 class="h2 fw-bold mb-3 text-white">
              <i class="bi bi-geo-alt me-3"></i>
              Peta Persebaran PKKPR Kapuas Hulu
            </h2>
            <p class="text-white-75">Visualisasi data geografis dengan teknologi pemetaan modern</p>
          </div>
        </div>
        
        <!-- Control Panel -->
        <div class="row justify-content-center mb-4">
          <div class="col-lg-8">
            <div class="control-panel glass-card-light rounded-4 p-4 shadow-lg">
              <div class="row align-items-center g-3">
                <div class="col-md-4">
                  <div class="d-flex align-items-center">
                    <label for="year" class="form-label mb-0 fw-semibold me-3">
                      <i class="bi bi-calendar-event text-primary me-1"></i>
                      Tahun:
                    </label>
                    <input 
                      id="year" 
                      v-model="year" 
                      type="number" 
                      min="2020" 
                      max="2030" 
                      class="form-control form-control-lg rounded-pill text-center" 
                      style="max-width: 120px;" 
                      placeholder="2024"
                    />
                  </div>
                </div>
                <div class="col-md-4 text-center">
                  <div class="data-info">
                    <div class="badge bg-primary rounded-pill px-3 py-2 fs-6">
                      <i class="bi bi-geo-alt me-1"></i>
                      {{ markerCount }} Lokasi
                    </div>
                  </div>
                </div>
                <div class="col-md-4 text-end">
                  <button 
                    @click="downloadGeoJSON" 
                    :disabled="loading || markerCount === 0"
                    class="btn btn-success btn-lg px-4 py-2 rounded-pill glass-btn"
                  >
                    <i class="bi bi-download me-2 text-center"></i>
                    GIS Vector Layer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="hero-decoration">
        <div class="decoration-1"></div>
        <div class="decoration-2"></div>
        <div class="decoration-3"></div>
        <div class="decoration-4"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="map-content-section">
      <div class="container">
        <!-- Alert untuk error -->
        <div v-if="error" class="alert alert-danger alert-dismissible fade show glass-card-light rounded-4 mb-4" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" @click="error = ''"></button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-card glass-card-light rounded-4 p-5 text-center shadow-lg mb-4">
          <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h5 class="fw-bold text-primary mb-2">Memuat Data Peta</h5>
          <p class="text-muted mb-0">Sedang mengambil data geografis wilayah Kapuas Hulu...</p>
        </div>

        <!-- Map Card -->
        <div class="map-card glass-card-light rounded-4 shadow-lg overflow-hidden">
          <div class="map-header p-4 border-bottom">
            <div class="d-flex justify-content-between align-items-center">
              <h4 class="fw-bold mb-0">
                <i class="bi bi-map text-primary me-2"></i>
                Peta Interaktif
              </h4>
              <div class="map-stats d-flex gap-3">
                <span class="badge bg-info bg-opacity-10 text-info rounded-pill px-3 py-2">
                  <i class="bi bi-calendar me-1"></i>
                  {{ year || new Date().getFullYear() }}
                </span>
                <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                  <i class="bi bi-check-circle me-1"></i>
                  {{ markers.filter(m => m.isVerified).length }} Terverifikasi
                </span>
              </div>
            </div>
          </div>
          
          <!-- Map Container -->
          <div class="map-wrapper">
            <div ref="mapEl" id="leaflet-map" class="leaflet-map-container"></div>
          </div>
          
          <!-- Map Footer -->
          <div class="map-footer p-3 bg-light">
            <div class="row align-items-center text-muted small">
              <div class="col-md-6">
                <i class="bi bi-info-circle me-1"></i>
                Klik pada marker untuk melihat detail informasi
              </div>
            </div>
          </div>
        </div>
        
        <!-- Statistics Cards -->
        <div class="row mt-4">
          <div class="col-md-3 col-6 mb-3">
            <div class="stat-card glass-card-light rounded-4 p-4 text-center shadow">
              <div class="stat-icon bg-primary bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style="width: 60px; height: 60px;">
                <i class="bi bi-geo-alt text-primary fs-4"></i>
              </div>
              <h4 class="fw-bold text-primary">{{ markerCount }}</h4>
              <p class="text-muted mb-0 small">Total Lokasi</p>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-3">
            <div class="stat-card glass-card-light rounded-4 p-4 text-center shadow">
              <div class="stat-icon bg-success bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style="width: 60px; height: 60px;">
                <i class="bi bi-check-circle text-success fs-4"></i>
              </div>
              <h4 class="fw-bold text-success">{{ markers.filter(m => m.isVerified).length }}</h4>
              <p class="text-muted mb-0 small">Terverifikasi</p>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-3">
            <div class="stat-card glass-card-light rounded-4 p-4 text-center shadow">
              <div class="stat-icon bg-warning bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style="width: 60px; height: 60px;">
                <i class="bi bi-clock text-warning fs-4"></i>
              </div>
              <h4 class="fw-bold text-warning">{{ markers.filter(m => !m.isVerified).length }}</h4>
              <p class="text-muted mb-0 small">Menunggu Verifikasi</p>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-3">
            <div class="stat-card glass-card-light rounded-4 p-4 text-center shadow">
              <div class="stat-icon bg-info bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style="width: 60px; height: 60px;">
                <i class="bi bi-calendar text-info fs-4"></i>
              </div>
              <h4 class="fw-bold text-info">{{ year || new Date().getFullYear() }}</h4>
              <p class="text-muted mb-0 small">Tahun Data</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div> 
</template> 

<script setup> 
import { onMounted, ref, watch, nextTick, onBeforeUnmount } from "vue";
import { getCurrentUser, isAuthenticated } from "../../lib/auth-utils";

const role = ref("");
const mapEl = ref(null); 
const year = ref(new Date().getFullYear().toString()); 
const loading = ref(false);
const error = ref("");
const markerCount = ref(0);
// PERBAIKAN: Menggunakan ref untuk markers agar reactive
const markers = ref([]); 
// PERBAIKAN: Menyimpan layer group untuk markers
const markerLayerGroup = ref(null);
let map; 
let L;
const token = ref(""); 

// Konstanta untuk batas wilayah Kapuas Hulu
const KAPUAS_HULU_BOUNDS = {
  center: [0.815, 112.927],
  zoom: 10,
  bounds: [
    [0.2, 111.5],
    [1.5, 114.0]   
  ]
};

const fetchData = async () => { 
  if (!map) return; 
  
  loading.value = true;
  error.value = "";
  
  // PERBAIKAN: Clear existing markers dengan layer group
  if (markerLayerGroup.value) {
    markerLayerGroup.value.clearLayers();
  }
  
  // PERBAIKAN: Reset array markers dengan reactive ref
  markers.value = [];
  markerCount.value = 0;
 
  try {
    const params = new URLSearchParams(); 
    if (year.value && year.value.toString().trim() !== '') {
      params.append("year", year.value.toString());
    }
   
    console.log('Fetching data with params:', params.toString());
    
    const res = await fetch(`/api/map-data?${params.toString()}`, { 
      headers: { 
        Authorization: "Bearer " + token.value, 
      }, 
    }); 
    
    if (!res.ok) {
      const errorText = await res.text();
      error.value = `API Error: ${res.status} ${res.statusText}`;
      return;
    }
    
    const data = await res.json(); 
    
    if (!Array.isArray(data)) {
      error.value = 'Invalid data format received from API';
      return;
    }

    console.log('Received data:', data.length, 'items');
   
    data.forEach((item) => { 
      const lat = parseFloat(item.latitude);
      const lng = parseFloat(item.longitude);
      
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return;
      }
      
      try {
        const marker = L.marker([lat, lng]);
        
        const popupContent = `
          <div class="custom-popup">
            <div class="popup-header">
              <h5 class="fw-bold text-primary mb-2">
                <i class="bi bi-geo-alt me-2"></i>
                ${item.name || "Nama tidak tersedia"}
              </h5>
              <div class="verification-badge">
                <span class="badge ${item.isVerified ? 'bg-success' : 'bg-warning'} rounded-pill">
                  ${item.isVerified ? "✅ Terverifikasi" : "⏳ Menunggu"}
                </span>
              </div>
            </div>
            
            <div class="popup-body">
              <div class="info-grid">
                <div class="info-item">
                  <i class="bi bi-telephone text-muted me-2"></i>
                  <span class="fw-medium">Phone:</span>
                  <span class="text-muted">${item.phone || "Tidak tersedia"}</span>
                </div>
                
                <div class="info-item">
                  <i class="bi bi-geo text-muted me-2"></i>
                  <span class="fw-medium">Lokasi:</span>
                  <span class="text-muted">${item.location || "Tidak tersedia"}</span>
                </div>
                
                <div class="info-item">
                  <i class="bi bi-rulers text-muted me-2"></i>
                  <span class="fw-medium">Luas Tanah:</span>
                  <span class="text-muted">${item.landArea || "Tidak tersedia"} m²</span>
                </div>
                
                <div class="info-item">
                  <i class="bi bi-person-badge text-muted me-2"></i>
                  <span class="fw-medium">Bertindak atas:</span>
                  <span class="text-muted">${item.actAs || "Tidak tersedia"}</span>
                </div>
                
                <div class="info-item">
                  <i class="bi bi-tag text-muted me-2"></i>
                  <span class="fw-medium">Jenis:</span>
                  <span class="text-muted">${item.type || "Tidak tersedia"}</span>
                </div>
              </div>
              
              ${item.north || item.south || item.east || item.west ? `
                <div class="border-section mt-3 pt-3">
                  <h6 class="fw-bold text-secondary mb-2">
                    <i class="bi bi-compass me-2"></i>
                    Batas Wilayah
                  </h6>
                  <div class="border-grid">
                    ${item.north ? `<div><strong>Utara:</strong> ${item.north}</div>` : ''}
                    ${item.south ? `<div><strong>Selatan:</strong> ${item.south}</div>` : ''}
                    ${item.east ? `<div><strong>Timur:</strong> ${item.east}</div>` : ''}
                    ${item.west ? `<div><strong>Barat:</strong> ${item.west}</div>` : ''}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent, { 
          maxWidth: 400,
          className: 'custom-popup-container',
          closeButton: false,
        }); 
        
        // PERBAIKAN: Tambahkan marker ke layer group
        if (markerLayerGroup.value) {
          markerLayerGroup.value.addLayer(marker);
        }
        
        // PERBAIKAN: Tambahkan ke array reactive
        markers.value.push({...item, marker});
        
      } catch (markerError) {
        console.error('Error creating marker:', markerError);
      }
    });
    
    markerCount.value = markers.value.length;
    
    map.setView(KAPUAS_HULU_BOUNDS.center, KAPUAS_HULU_BOUNDS.zoom);
    
    console.log(`Successfully loaded ${markerCount.value} markers for year ${year.value}`);
    
  } catch (fetchError) {
    error.value = `Error loading data: ${fetchError.message}`;
    console.error('Fetch error:', fetchError);
  } finally {
    loading.value = false;
  }
};

const downloadGeoJSON = async () => {
  if (markerCount.value === 0) {
    alert('Tidak ada data untuk diunduh');
    return;
  }
  
  try {
    const params = new URLSearchParams();
    if (year.value && year.value.toString().trim() !== '') {
      params.append("year", year.value.toString());
    }
    params.append("format", "geojson");
    
    const res = await fetch(`/api/map-data?${params.toString()}`, {
      headers: {
        Authorization: "Bearer " + token.value,
      },
    });
    
    if (!res.ok) {
      throw new Error('Failed to download GeoJSON');
    }
    
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `map-data-${year.value || new Date().getFullYear()}.geojson`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (downloadError) {
    alert('Error downloading GeoJSON: ' + downloadError.message);
  }
};

const waitForLeaflet = () => {
  return new Promise((resolve) => {
    if (window.L) {
      resolve(window.L);
    } else {
      const checkLeaflet = setInterval(() => {
        if (window.L) {
          clearInterval(checkLeaflet);
          resolve(window.L);
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkLeaflet);
        resolve(null);
      }, 10000);
    }
  });
};

const initMap = async () => {
  try {
    loading.value = true;
    
    L = await waitForLeaflet();
    
    if (!L) {
      throw new Error('Leaflet library not found');
    }
    
    if (!mapEl.value) {
      throw new Error('Map element not found');
    }
    
    if (map) {
      map.remove();
      map = null;
    }
    
    mapEl.value.style.width = '100%';
    mapEl.value.style.height = '600px';
    mapEl.value.style.minHeight = '600px';
    mapEl.value.style.position = 'relative';
    mapEl.value.style.zIndex = '1';
    
    map = L.map(mapEl.value, {
      center: KAPUAS_HULU_BOUNDS.center,
      zoom: KAPUAS_HULU_BOUNDS.zoom,
      zoomControl: true,
      attributionControl: true,
      preferCanvas: false
    }); 
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { 
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      tileSize: 256
    }).addTo(map); 
    
    // PERBAIKAN: Buat layer group untuk markers
    markerLayerGroup.value = L.layerGroup().addTo(map);
    
    const fixMapRendering = () => {
      if (map) {
        map.invalidateSize(true);
        map.getContainer().style.height = '600px';
        map._onResize();
      }
    };
    
    setTimeout(fixMapRendering, 0);
    setTimeout(fixMapRendering, 100);
    setTimeout(fixMapRendering, 300);
    setTimeout(fixMapRendering, 500);
    
    await fetchData(); 
    setTimeout(fixMapRendering, 100);
    
  } catch (initError) {
    error.value = `Error initializing map: ${initError.message}`;
  } finally {
    loading.value = false;
  }
};
 
onMounted(async () => {
  const user = await getCurrentUser();
  const authenticated = await isAuthenticated();
  if (user && user.role) {
    role.value = user.role;
  }
  if (!authenticated) {
    error.value = "You must be logged in to view this map.";
    window.location.href = "/login";
    return;
  }
  if (role.value !== 'admin' && role.value !== 'user') {
    error.value = "You do not have permission to view this map.";
    window.location.href = "/";
    return;
  }
  if (typeof window !== 'undefined') {
    token.value = localStorage.getItem("accessToken") || ""; 
    if (!token.value) {
      error.value = "No access token found. Please login first.";
      return;
    }
  }
  
  await nextTick();
  
  setTimeout(async () => {
    await initMap();
  }, 100);
});

onBeforeUnmount(() => {
  // PERBAIKAN: Bersihkan layer group juga
  if (markerLayerGroup.value) {
    markerLayerGroup.value.clearLayers();
    markerLayerGroup.value = null;
  }
  if (map) {
    map.remove();
    map = null;
  }
});
 
// PERBAIKAN: Watch dengan debounce untuk menghindari multiple request
let watchTimeout = null;
watch(year, (newYear, oldYear) => {
  if (newYear && /^\d{4}$/.test(newYear.toString()) && newYear !== oldYear) {
    console.log('Year changed from', oldYear, 'to', newYear);
    
    // Clear timeout sebelumnya
    if (watchTimeout) {
      clearTimeout(watchTimeout);
    }
    
    // Debounce 500ms
    watchTimeout = setTimeout(() => {
      fetchData();
    }, 500);
  }
}, { immediate: false }); 
</script>

<style scoped>
/* Custom color classes */
.text-white-75 {
  color: rgba(255, 255, 255, 0.75) !important;
}

/* Header section */
.map-header-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  min-height: 40vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 60px 0;
}

.map-header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

/* Content section */
.map-content-section {
  background: #f8f9fa;
  min-height: 60vh;
  padding: 60px 0;
  margin-top: -30px;
  position: relative;
  z-index: 2;
}

.container {
  z-index: 2;
  position: relative;
}

/* Glass effects */
.glass-card-light {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.glass-btn {
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.glass-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* Control Panel */
.control-panel {
  margin-bottom: 0 !important;
}

/* Map Card */
.map-card {
  overflow: hidden;
}

.map-header {
  background: rgba(248, 249, 250, 0.8);
  backdrop-filter: blur(10px);
}

.map-wrapper {
  width: 100%;
  height: 600px;
  position: relative;
  overflow: hidden;
}

.leaflet-map-container {
  width: 100% !important;
  height: 600px !important;
  min-height: 600px !important;
  position: relative !important;
  z-index: 1 !important;
  background-color: #f8f9fa !important;
}

/* Map Overlay */
.map-overlay {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 1000;
  pointer-events: none;
}

.overlay-card {
  pointer-events: auto;
  min-width: 160px;
}

/* Statistics Cards */
.stat-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15) !important;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Loading Card */
.loading-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Form Controls */
.form-control-lg {
  padding: 12px 20px;
  font-size: 1.1rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  background-color: white;
  color: #495057;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  background-color: white;
  color: #495057;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.btn-lg {
  padding: 12px 30px;
  font-size: 1.1rem;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-primary { background: linear-gradient(45deg, #667eea, #764ba2); color: white; }
.btn-success { background: linear-gradient(45deg, #28a745, #20c997); color: white; }
.btn-info { background: linear-gradient(45deg, #17a2b8, #6f42c1); color: white; }
.btn-warning { background: linear-gradient(45deg, #ffc107, #fd7e14); color: #212529; }
.btn-danger { background: linear-gradient(45deg, #dc3545, #e83e8c); color: white; }

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* Badge styling */
.badge {
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Alert styling */
.alert {
  border: none;
  border-radius: 15px;
  padding: 15px 20px;
  font-weight: 500;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

/* Leaflet Overrides */
:deep(.leaflet-container) {
  width: 100% !important;
  height: 600px !important;
  min-height: 600px !important;
  position: relative !important;
  z-index: 1 !important;
  font-family: inherit !important;
  background-color: #f8f9fa !important;
}

/* Custom Popup Styling */
:deep(.custom-popup-container .leaflet-popup-content-wrapper) {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0;
  margin: 0;
}

:deep(.custom-popup-container .leaflet-popup-content) {
  margin: 0 !important;
  line-height: 1.5 !important;
  font-family: inherit !important;
}

:deep(.custom-popup) {
  max-width: 380px;
  padding: 20px;
}

:deep(.popup-header) {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

:deep(.popup-header h5) {
  margin: 0;
  color: #667eea;
}

:deep(.verification-badge) {
  margin-top: 8px;
}

:deep(.popup-body) {
  color: #495057;
}

:deep(.info-grid) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.info-item) {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
}

:deep(.info-item .fw-medium) {
  min-width: 120px;
  color: #495057;
}

:deep(.border-section) {
  border-top: 1px solid #e9ecef;
}

:deep(.border-grid) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  font-size: 0.85rem;
  color: #6c757d;
}

:deep(.border-grid div) {
  padding: 2px 0;
}

:deep(.leaflet-popup-tip) {
  background: rgba(255, 255, 255, 0.98) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

/* Menghilangkan tombol close pada popup */
:deep(.leaflet-popup-close-button) {
  display: none !important;
  visibility: hidden !important;
}

:deep(.leaflet-control-container) {
  visibility: visible !important;
  opacity: 1 !important;
}

:deep(.leaflet-tile) {
  visibility: visible !important;
  opacity: 1 !important;
}

:deep(.leaflet-tile-pane) {
  visibility: visible !important;
  opacity: 1 !important;
}

:deep(.leaflet-objects-pane) {
  visibility: visible !important;
  opacity: 1 !important;
}

/* Enhanced Leaflet Controls */
:deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
  border-radius: 10px !important;
  overflow: hidden;
}

:deep(.leaflet-control-zoom a) {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px) !important;
  color: #667eea !important;
  border: none !important;
  font-weight: bold !important;
  transition: all 0.3s ease !important;
}

:deep(.leaflet-control-zoom a:hover) {
  background: rgba(102, 126, 234, 0.1) !important;
  color: #4c63d2 !important;
}

:deep(.leaflet-control-attribution) {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px) !important;
  border-radius: 5px !important;
  font-size: 0.75rem !important;
  padding: 2px 5px !important;
}

/* Decorative elements */
.decoration-1 {
  position: absolute;
  top: 15%;
  left: 8%;
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  animation: pulse-slow 5s ease-in-out infinite;
}

.decoration-2 {
  position: absolute;
  top: 65%;
  right: 12%;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  animation: pulse-slow 4s ease-in-out infinite reverse;
}

.decoration-3 {
  position: absolute;
  bottom: 25%;
  left: 15%;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
  animation: pulse-slow 6s ease-in-out infinite;
}

.decoration-4 {
  position: absolute;
  top: 30%;
  right: 25%;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  animation: pulse-slow 3.5s ease-in-out infinite;
}

/* Animations */
@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.05); opacity: 0.2; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .map-header-section {
    padding: 40px 0;
    min-height: 35vh;
  }
  
  .map-content-section {
    padding: 40px 0;
  }
  
  .control-panel .row {
    text-align: center;
  }
  
  .control-panel .col-md-4 {
    margin-bottom: 15px;
  }
  
  .map-card {
    border-radius: 15px !important;
  }
  
  .map-wrapper {
    height: 400px;
  }
  
  .leaflet-map-container {
    height: 400px !important;
    min-height: 400px !important;
  }
  
  .map-overlay {
    position: relative;
    top: auto;
    right: auto;
    margin: 15px;
  }
  
  .stat-card {
    margin-bottom: 15px;
  }
}

@media (max-width: 576px) {
  .map-header-section {
    padding: 30px 0;
    min-height: 30vh;
  }
  
  .glass-btn {
    width: 100%;
    margin-top: 10px;
  }
  
  .control-panel {
    padding: 20px 15px !important;
  }
  
  .map-card {
    margin: 0 10px;
  }
  
  .map-wrapper {
    height: 350px;
  }
  
  .leaflet-map-container {
    height: 350px !important;
    min-height: 350px !important;
  }
  
  .stat-card {
    padding: 20px 15px !important;
  }
  
  .stat-icon {
    width: 50px !important;
    height: 50px !important;
  }
  
  .stat-card h4 {
    font-size: 1.5rem;
  }
}

/* Utility classes */
.gap-2 > * + * {
  margin-top: 0.5rem;
}

.d-flex.gap-2 > * + * {
  margin-left: 0.5rem;
  margin-top: 0;
}

.gap-3 > * + * {
  margin-left: 1rem;
}

/* Enhanced hover effects */
.map-stats .badge {
  transition: all 0.3s ease;
}

.map-stats .badge:hover {
  transform: scale(1.05);
}

/* Loading animation enhancement */
.loading-card .spinner-border {
  animation: spin 1s linear infinite, pulse-slow 2s ease-in-out infinite;
}

/* Custom scrollbar for responsive */
@media (max-width: 768px) {
  .map-content-section::-webkit-scrollbar {
    width: 4px;
  }
  
  .map-content-section::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .map-content-section::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 2px;
  }
}
</style>