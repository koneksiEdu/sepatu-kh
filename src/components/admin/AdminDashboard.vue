<template>
  <div class="admin-dashboard">
    <!-- Main Menu Section -->
    <section class="admin-menu-section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 text-center mb-5">
            <h2 class="h3 fw-bold mb-3 text-white">Panel Manajemen</h2>
            <p class="text-white-75">Pilih menu untuk mengelola sistem SEPATU KH</p>
          </div>
        </div>
        
        <div class="row g-4 justify-content-center">
          <!-- Staff Management -->
          <div class="col-lg-5 col-md-6">
            <div class="menu-card glass-card-dark rounded-4 p-4 h-100 position-relative overflow-hidden" @click="navigateToStaffManagement">
              <div class="card-content position-relative z-2">
                <div class="menu-icon mb-4">
                  <div class="icon-wrapper p-4 rounded-3 d-inline-block" style="background: linear-gradient(45deg, rgba(40, 167, 69, 0.2), rgba(40, 167, 69, 0.3));">
                    <i class="bi bi-person-badge text-success" style="font-size: 3rem;"></i>
                  </div>
                </div>
                
                <h4 class="fw-bold mb-3 text-white">Manajemen Staff</h4>
                <p class="text-white-75 mb-4">
                  Kelola data staff dengan menghapus, menambah atau mengedit staff.
                </p>
                
                <!-- Features List -->
                <ul class="list-unstyled mb-4">
                  <li class="d-flex align-items-center mb-2">
                    <i class="bi bi-check-circle text-success me-3"></i>
                    <span class="text-white-75">Tambah Staff</span>
                  </li>
                  <li class="d-flex align-items-center mb-2">
                    <i class="bi bi-check-circle text-success me-3"></i>
                    <span class="text-white-75">Hapus Staff</span>
                  </li>
                  <li class="d-flex align-items-center mb-2">
                    <i class="bi bi-check-circle text-success me-3"></i>
                    <span class="text-white-75">Edit staff</span>
                  </li>
                </ul>
                
                <div class="menu-action">
                  <div class="btn btn-success btn-lg px-4 py-3 rounded-pill w-100">
                    <i class="bi bi-arrow-right me-2"></i>
                    Kelola Staff
                  </div>
                </div>
              </div>
              
              <!-- Card decoration -->
              <div class="card-decoration position-absolute" style="top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(40, 167, 69, 0.1); border-radius: 50%;"></div>
            </div>
          </div>
          
          <!-- User Management -->
          <div class="col-lg-5 col-md-6">
            <div class="menu-card glass-card-dark rounded-4 p-4 h-100 position-relative overflow-hidden" @click="navigateToUserManagement">
              <div class="card-content position-relative z-2">
                <div class="menu-icon mb-4">
                  <div class="icon-wrapper p-4 rounded-3 d-inline-block" style="background: linear-gradient(45deg, rgba(23, 162, 184, 0.2), rgba(23, 162, 184, 0.3));">
                    <i class="bi bi-people text-info" style="font-size: 3rem;"></i>
                  </div>
                </div>
                
                <h4 class="fw-bold mb-3 text-white">Manajemen User</h4>
                <p class="text-white-75 mb-4">
                  Kelola data pengguna, ubah password, pengaturan akses pengguna internal sistem SEPATU KH.
                </p>
                
                <!-- Features List -->
                <ul class="list-unstyled mb-4">
                  <li class="d-flex align-items-center mb-2">
                    <i class="bi bi-check-circle text-info me-3"></i>
                    <span class="text-white-75">Verifikasi User Baru</span>
                  </li>
                  <li class="d-flex align-items-center mb-2">
                    <i class="bi bi-check-circle text-info me-3"></i>
                    <span class="text-white-75">Kelola Status Akun</span>
                  </li>
                  <li class="d-flex align-items-center mb-2">
                    <i class="bi bi-check-circle text-info me-3"></i>
                    <span class="text-white-75">Ganti Password</span>
                  </li>
                </ul>
                
                <div class="menu-action">
                  <div class="btn btn-info btn-lg px-4 py-3 rounded-pill w-100">
                    <i class="bi bi-arrow-right me-2"></i>
                    Kelola User
                  </div>
                </div>
              </div>
              
              <!-- Card decoration -->
              <div class="card-decoration position-absolute" style="top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(23, 162, 184, 0.1); border-radius: 50%;"></div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="row mt-5">
          <div class="col-12">
            <div class="quick-actions glass-card-light rounded-4 p-4">
              <h5 class="fw-bold mb-4 text-center">Aksi Cepat</h5>
              <div class="row g-3 justify-content-center">
                <div class="col-md-3 col-6">
                  <button class="btn btn-outline-primary w-100 py-3 rounded-pill" @click="showSystemInfo">
                    <i class="bi bi-info-circle mb-2 d-block fs-4"></i>
                    Info Sistem
                  </button>
                </div>
                <div class="col-md-3 col-6">
                  <button class="btn btn-outline-warning w-100 py-3 rounded-pill" @click="showExportOptions">
                    <i class="bi bi-download mb-2 d-block fs-4"></i>
                    Export Data
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

    <!-- Custom Modals -->
    
    <!-- Access Denied Modal -->
    <div v-if="modals.accessDenied.show" class="custom-modal-overlay" @click="closeModal('accessDenied')">
      <div class="custom-modal" @click.stop>
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Akses Ditolak
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="closeModal('accessDenied')"></button>
        </div>
        <div class="modal-body">
          <p class="mb-0">{{ modals.accessDenied.message }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="redirectToHome">OK</button>
        </div>
      </div>
    </div>

    <!-- Navigation Info Modal -->
    <div v-if="modals.navigation.show" class="custom-modal-overlay" @click="closeModal('navigation')">
      <div class="custom-modal" @click.stop>
        <div class="modal-header bg-info text-white">
          <h5 class="modal-title">
            <i class="bi bi-info-circle me-2"></i>
            {{ modals.navigation.title }}
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="closeModal('navigation')"></button>
        </div>
        <div class="modal-body">
          <p class="mb-0">{{ modals.navigation.message }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" @click="closeModal('navigation')">OK</button>
        </div>
      </div>
    </div>

    <!-- System Info Modal -->
    <div v-if="modals.systemInfo.show" class="custom-modal-overlay" @click="closeModal('systemInfo')">
      <div class="custom-modal" @click.stop>
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">
            <i class="bi bi-info-circle me-2"></i>
            Info Sistem
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="closeModal('systemInfo')"></button>
        </div>
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-sm-6">
              <strong>Sistem:</strong>
            </div>
            <div class="col-sm-6">
              SEPATU KH Admin Panel
            </div>
            <div class="col-sm-6">
              <strong>Versi:</strong>
            </div>
            <div class="col-sm-6">
              {{ version }}
            </div>
            <div class="col-sm-6">
              <strong>Server:</strong>
            </div>
            <div class="col-sm-6">
              {{ environment }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="closeModal('systemInfo')">Tutup</button>
        </div>
      </div>
    </div>

    <!-- Export Options Modal -->
    <div v-if="modals.exportOptions.show" class="custom-modal-overlay" @click="closeModal('exportOptions')">
      <div class="custom-modal" @click.stop>
        <div class="modal-header bg-warning text-dark">
          <h5 class="modal-title">
            <i class="bi bi-download me-2"></i>
            Export Data
          </h5>
          <button type="button" class="btn-close" @click="closeModal('exportOptions')"></button>
        </div>
        <div class="modal-body">
          <div class="export-options">
            <p class="mb-4">Pilih jenis data yang ingin diekspor:</p>
            
            <!-- Data Type Selection -->
            <div class="mb-4">
              <h6 class="fw-semibold mb-3">Jenis Data:</h6>
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="exportType" id="exportAll" value="all" v-model="exportSettings.type">
                <label class="form-check-label" for="exportAll">
                  <i class="bi bi-database me-2"></i>Semua Data
                </label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="exportType" id="exportStaff" value="staff" v-model="exportSettings.type">
                <label class="form-check-label" for="exportStaff">
                  <i class="bi bi-person-badge me-2"></i>Data Staff Saja
                </label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="exportType" id="exportUsers" value="users" v-model="exportSettings.type">
                <label class="form-check-label" for="exportUsers">
                  <i class="bi bi-people me-2"></i>Data User Saja
                </label>
              </div>
            </div>
            
            <!-- Format Selection -->
            <div class="mb-4">
              <h6 class="fw-semibold mb-3">Format File:</h6>
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="exportFormat" id="formatJson" value="json" v-model="exportSettings.format">
                <label class="form-check-label" for="formatJson">
                  <i class="bi bi-file-earmark-code me-2"></i>JSON (.json)
                </label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="exportFormat" id="formatCsv" value="csv" v-model="exportSettings.format">
                <label class="form-check-label" for="formatCsv">
                  <i class="bi bi-file-earmark-spreadsheet me-2"></i>CSV (.csv)
                </label>
              </div>
            </div>
            
            <!-- Security Notice -->
            <div class="alert alert-info d-flex align-items-start">
              <i class="bi bi-shield-check me-3 mt-1"></i>
              <div>
                <strong>Catatan Keamanan:</strong>
                <p class="mb-0 small mt-1">Data yang diekspor tidak akan menyertakan informasi sensitif seperti password atau deskripsi pribadi untuk menjaga keamanan sistem.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal('exportOptions')">
            <i class="bi bi-x me-2"></i>Batal
          </button>
          <button type="button" class="btn btn-warning" @click="performExport" :disabled="isExporting">
            <i class="bi bi-download me-2" v-if="!isExporting"></i>
            <i class="bi bi-hourglass-split me-2" v-if="isExporting"></i>
            {{ isExporting ? 'Mengekspor...' : 'Export Data' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Export Status Modal -->
    <div v-if="modals.exportStatus.show" class="custom-modal-overlay" @click="closeModal('exportStatus')">
      <div class="custom-modal" @click.stop>
        <div class="modal-header" :class="modals.exportStatus.success ? 'bg-success text-white' : 'bg-danger text-white'">
          <h5 class="modal-title">
            <i :class="['bi', modals.exportStatus.success ? 'bi-check-circle' : 'bi-exclamation-triangle', 'me-2']"></i>
            {{ modals.exportStatus.success ? 'Export Berhasil' : 'Export Gagal' }}
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="closeModal('exportStatus')"></button>
        </div>
        <div class="modal-body">
          <p class="mb-0">{{ modals.exportStatus.message }}</p>
          <div v-if="modals.exportStatus.success && modals.exportStatus.details" class="mt-3">
            <small class="text-muted">
              <strong>Detail Export:</strong><br>
              {{ modals.exportStatus.details }}
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" :class="modals.exportStatus.success ? 'btn btn-success' : 'btn btn-danger'" @click="closeModal('exportStatus')">
            OK
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { isAuthenticated, getCurrentUser } from '../../lib/auth-utils';

// Reactive variables
const user = ref(null);
const isExporting = ref(false);

// Export settings
const exportSettings = ref({
  type: 'all',
  format: 'json'
});

// Modal states
const modals = ref({
  accessDenied: {
    show: false,
    message: ''
  },
  navigation: {
    show: false,
    title: '',
    message: ''
  },
  systemInfo: {
    show: false
  },
  exportOptions: {
    show: false
  },
  exportStatus: {
    show: false,
    success: false,
    message: '',
    details: ''
  }
});

const environment = import.meta.env.PUBLIC_ENVIRONMENT || 'development';
const version = import.meta.env.PUBLIC_VERSION || '0.0.1';

// Modal methods
const showModal = (modalName, data = {}) => {
  modals.value[modalName].show = true;
  Object.assign(modals.value[modalName], data);
};

const closeModal = (modalName) => {
  modals.value[modalName].show = false;
};

// Navigation methods
const navigateToStaffManagement = () => {
  console.log('Navigating to Staff Management');
  showModal('navigation', {
    title: 'Manajemen Staff',
    message: 'Mengalihkan ke halaman manajemen staff...'
  });
  
  setTimeout(() => {
    closeModal('navigation');
    window.location.href = '/staff-management';
  }, 2000);
};

const navigateToUserManagement = () => {
  console.log('Navigating to User Management');
  showModal('navigation', {
    title: 'Manajemen User',
    message: 'Mengalihkan ke halaman manajemen user...'
  });
  
  setTimeout(() => {
    closeModal('navigation');
    window.location.href = '/user-management';
  }, 2000);
};

// Quick action methods
const showSystemInfo = () => {
  console.log('Showing system info');
  showModal('systemInfo');
};

const showExportOptions = () => {
  console.log('Showing export options');
  showModal('exportOptions');
};

// Export functionality
const performExport = async () => {
  if (isExporting.value) return;
  
  isExporting.value = true;
  
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }

    const params = new URLSearchParams({
      type: exportSettings.value.type,
      format: exportSettings.value.format
    });

    const response = await fetch(`/api/export?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP Error: ${response.status}`);
    }

    // Get filename from response headers
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `sepatu_kh_export_${new Date().toISOString().split('T')[0]}.${exportSettings.value.format}`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    // Show success modal
    closeModal('exportOptions');
    showModal('exportStatus', {
      success: true,
      message: 'Data berhasil diekspor dan diunduh.',
      details: `File: ${filename}\nJenis: ${exportSettings.value.type}\nFormat: ${exportSettings.value.format.toUpperCase()}`
    });

  } catch (error) {
    console.error('Export error:', error);
    closeModal('exportOptions');
    showModal('exportStatus', {
      success: false,
      message: error.message || 'Terjadi kesalahan saat mengekspor data.'
    });
  } finally {
    isExporting.value = false;
  }
};

// Helper methods
const redirectToHome = () => {
  window.location.href = '/';
};

onMounted(async () => {
  const isLogin = await isAuthenticated();
  if (!isLogin) {
    showModal('accessDenied', {
      message: 'Anda harus login terlebih dahulu.'
    });
  } else {
    const currentUser = await getCurrentUser();
    console.log('Current user:', currentUser);
    if (currentUser.role !== 'admin') {
      showModal('accessDenied', {
        message: 'Anda tidak memiliki hak akses administrator.'
      });
    }
    user.value = currentUser;
  }
});
</script>

<style scoped>
/* Custom color classes */
.text-white-75 {
  color: rgba(255, 255, 255, 0.75) !important;
}

/* Menu section - Full height with gradient background */
.admin-menu-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 80px 0;
}

.admin-menu-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.container {
  z-index: 2;
  position: relative;
}

/* Glass card styling */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
}

.glass-card-dark {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-card-light {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Menu cards */
.menu-card {
  transition: all 0.4s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.menu-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.menu-card:hover .btn {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.menu-card .btn {
  transition: all 0.3s ease;
  border: 2px solid;
}

.menu-card:hover .icon-wrapper {
  transform: scale(1.1);
}

.icon-wrapper {
  transition: all 0.3s ease;
}

/* Quick actions */
.quick-actions .btn {
  transition: all 0.3s ease;
  font-weight: 600;
}

.quick-actions .btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Custom Modal Styles */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.custom-modal {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-weight: 600;
  font-size: 1.1rem;
}

.btn-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  opacity: 0.7;
}

.btn-close-white {
  color: white;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;
}

.btn-primary { background: #007bff; color: white; }
.btn-secondary { background: #6c757d; color: white; }
.btn-success { background: #28a745; color: white; }
.btn-info { background: #17a2b8; color: white; }
.btn-warning { background: #ffc107; color: #212529; }
.btn-danger { background: #dc3545; color: white; }

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Form styles */
.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-check-input {
  margin: 0;
}

.form-check-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid transparent;
}

.alert-info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.bg-success { background: #28a745; color: white; }

/* Export specific styles */
.export-options {
  font-size: 0.95rem;
}

.export-options h6 {
  color: #495057;
  font-size: 1rem;
}

.export-options .form-check-label {
  font-size: 0.9rem;
  color: #6c757d;
}

.export-options .form-check-input:checked + .form-check-label {
  color: #495057;
  font-weight: 500;
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
  .admin-menu-section {
    padding: 60px 0;
  }
  
  .menu-card {
    margin-bottom: 2rem;
  }
  
  .custom-modal {
    margin: 10px;
    max-width: calc(100% - 20px);
  }
  
  .export-options .form-check {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 576px) {
  .admin-menu-section {
    padding: 40px 0;
  }
  
  .menu-card .btn {
    padding: 12px 20px;
    font-size: 0.95rem;
  }
  
  .quick-actions .btn {
    padding: 15px 10px;
    font-size: 0.85rem;
  }
  
  .custom-modal-overlay {
    padding: 10px;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .modal-footer {
    padding: 1rem;
    flex-direction: column;
  }
  
  .modal-footer .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>