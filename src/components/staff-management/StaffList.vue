<template>
  <div class="staff-management">
    <!-- Header Section -->
    <section class="staff-header-section mt-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 text-center mb-4">
            <h2 class="h2 fw-bold mb-3 text-white">
              <i class="bi bi-person-badge me-3"></i>
              Manajemen Staff
            </h2>
            <p class="text-white-75">Kelola data staff dengan mudah dan efisien</p>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="row justify-content-center mb-4">
          <div class="col-auto">
            <button class="btn btn-success btn-lg px-4 py-3 rounded-pill glass-btn" @click="openAddModal">
              <i class="bi bi-plus-circle me-2"></i>
              Tambah Staff Baru
            </button>
          </div>
          <div class="col-auto">
            <button class="btn btn-outline-light btn-lg px-4 py-3 rounded-pill glass-btn" @click="refreshData">
              <i class="bi bi-arrow-clockwise me-2"></i>
              Refresh Data
            </button>
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
    <section class="staff-content-section">
      <div class="container">
        <!-- Alert untuk error -->
        <div v-if="error" class="alert alert-danger alert-dismissible fade show glass-card-light rounded-4 mb-4" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" @click="error = null"></button>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="alert alert-success alert-dismissible fade show glass-card-light rounded-4 mb-4" role="alert">
          <i class="bi bi-check-circle me-2"></i>
          {{ successMessage }}
          <button type="button" class="btn-close" @click="successMessage = null"></button>
        </div>

        <!-- Staff Table Card -->
        <div class="staff-table-card glass-card-light rounded-4 p-4 shadow-lg">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold mb-0">
              <i class="bi bi-table me-2 text-primary"></i>
              Daftar Staff
            </h4>
            <div class="staff-stats">
              <span class="badge bg-primary rounded-pill px-3 py-2">
                <i class="bi bi-people me-1"></i>
                Total: {{ staffList.length }}
              </span>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted fw-medium">Memuat data staff...</p>
          </div>

          <!-- Staff Table -->
          <div v-else class="table-responsive">
            <table class="table table-hover modern-table">
              <thead>
                <tr>
                  <th class="fw-bold">
                    <i class="bi bi-hash me-1"></i>
                    ID
                  </th>
                  <th class="fw-bold">
                    <i class="bi bi-person me-1"></i>
                    Nama Lengkap
                  </th>
                  <th class="fw-bold">
                    <i class="bi bi-briefcase me-1"></i>
                    Jabatan
                  </th>
                  <th class="fw-bold text-center">
                    <i class="bi bi-gear me-1"></i>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="staffList.length === 0">
                  <td colspan="4" class="text-center py-5">
                    <i class="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
                    <p class="text-muted mb-0">Tidak ada data staff yang tersedia</p>
                    <small class="text-muted">Silakan tambah staff baru dengan tombol di atas</small>
                  </td>
                </tr>
                <tr v-else v-for="staff in staffList" :key="staff.id" class="table-row-hover">
                  <td>
                    <span class="badge bg-light text-dark rounded-pill px-3 py-2">
                      #{{ staff.id }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="staff-avatar me-3">
                        <i class="bi bi-person-circle text-primary fs-4"></i>
                      </div>
                      <div>
                        <div class="fw-semibold">{{ staff.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span v-if="staff.position" class="badge bg-info bg-opacity-10 text-info rounded-pill px-3 py-2">
                      {{ staff.position }}
                    </span>
                    <span v-else class="text-muted fst-italic">Tidak ada jabatan</span>
                  </td>
                  <td class="text-center">
                    <div class="btn-group" role="group">
                      <button class="btn btn-sm btn-outline-warning rounded-pill me-2 action-btn" @click="openEditModal(staff)" title="Edit Staff">
                        <i class="bi bi-pencil-square"></i>
                        Edit
                      </button>
                      <button class="btn btn-sm btn-outline-danger rounded-pill action-btn" @click="deleteStaff(staff.id)" title="Hapus Staff">
                        <i class="bi bi-trash3"></i>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Custom Modal -->
    <div v-if="showModal" class="custom-modal-overlay" @click="closeModal">
      <div class="custom-modal staff-modal" @click.stop>
        <div class="modal-header" :class="isEdit ? 'bg-warning' : 'bg-success'">
          <h5 class="modal-title text-white fw-bold">
            <i :class="isEdit ? 'bi bi-pencil-square' : 'bi bi-plus-circle'" class="me-2"></i>
            {{ isEdit ? "Edit Staff" : "Tambah Staff Baru" }}
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
        </div>
        
        <div class="modal-body p-4">
          <!-- ID Field (only for edit) -->
          <div v-if="isEdit" class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-hash me-1"></i>
              ID Staff
            </label>
            <input v-model="newStaff.id" class="form-control form-control-lg rounded-pill" disabled />
          </div>

          <!-- Name Field -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-person me-1"></i>
              Nama Lengkap <span class="text-danger">*</span>
            </label>
            <input 
              v-model="newStaff.name" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan nama lengkap staff"
              required 
            />
            <div v-if="!newStaff.name" class="form-text text-danger">
              <i class="bi bi-exclamation-circle me-1"></i>
              Nama wajib diisi
            </div>
          </div>

          <!-- Position Field -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-briefcase me-1"></i>
              Jabatan
            </label>
            <input 
              v-model="newStaff.position" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan jabatan staff (opsional)"
            />
          </div>
        </div>
        
        <div class="modal-footer p-4">
          <button class="btn btn-secondary btn-lg px-4 rounded-pill me-3" @click="closeModal">
            <i class="bi bi-x-circle me-2"></i>
            Batal
          </button>
          <button 
            class="btn btn-lg px-4 rounded-pill"
            :class="isEdit ? 'btn-warning' : 'btn-success'"
            @click="saveStaff" 
            :disabled="!newStaff.name || saving"
          >
            <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else :class="isEdit ? 'bi bi-check-square' : 'bi bi-save'" class="me-2"></i>
            {{ saving ? 'Menyimpan...' : (isEdit ? "Update Staff" : "Simpan Staff") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="custom-modal-overlay" @click="cancelDelete">
      <div class="custom-modal" @click.stop>
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title fw-bold">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Konfirmasi Hapus
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="cancelDelete"></button>
        </div>
        
        <div class="modal-body p-4 text-center">
          <i class="bi bi-trash3 display-4 text-danger mb-3 d-block"></i>
          <p class="fw-semibold mb-2">Yakin ingin menghapus staff ini?</p>
          <p class="text-muted mb-0">Staff ID: <strong>{{ staffToDelete?.id }}</strong></p>
          <p class="text-muted">Nama: <strong>{{ staffToDelete?.name }}</strong></p>
          <div class="alert alert-warning mt-3">
            <i class="bi bi-exclamation-triangle me-2"></i>
            <strong>Peringatan:</strong> Data yang dihapus tidak dapat dikembalikan!
          </div>
        </div>
        
        <div class="modal-footer p-4">
          <button class="btn btn-secondary btn-lg px-4 rounded-pill me-3" @click="cancelDelete">
            <i class="bi bi-x-circle me-2"></i>
            Batal
          </button>
          <button class="btn btn-danger btn-lg px-4 rounded-pill" @click="confirmDelete" :disabled="deleting">
            <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else class="bi bi-trash3 me-2"></i>
            {{ deleting ? 'Menghapus...' : 'Ya, Hapus!' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getCurrentUser } from "../../lib/auth-utils";

interface Staff {
  id: number;
  name: string;
  position: string | null;
}

const staffList = ref<Staff[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const saving = ref(false);
const deleting = ref(false);

// Modal state
const showModal = ref(false);
const showDeleteModal = ref(false);
const newStaff = ref<Staff>({ id: 0, name: "", position: "" });
const isEdit = ref(false);
const token = ref('');
const staffToDelete = ref<Staff | null>(null);

async function fetchStaff() {
  try {
    loading.value = true;
    error.value = null;
    
    const res = await fetch("/api/staff", {
      headers: {
        "Authorization": `Bearer ${token.value}`
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    staffList.value = data;
  } catch (err) {
    console.error("❌ Error fetching staff:", err);
    error.value = `Gagal memuat data: ${err instanceof Error ? err.message : 'Unknown error'}`;
    staffList.value = [];
  } finally {
    loading.value = false;
  }
}

async function saveStaff() {
  try {
    saving.value = true;
    
    if (!newStaff.value.name.trim()) {
      error.value = "Nama wajib diisi";
      return;
    }

    const method = isEdit.value ? "PUT" : "POST";
    const url = "/api/staff";
    
    const res = await fetch(url, {
      method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
      },
      body: JSON.stringify(newStaff.value),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    
    await fetchStaff();
    closeModal();
    error.value = null;
    successMessage.value = isEdit.value ? 
      `Staff ${newStaff.value.name} berhasil diupdate!` : 
      `Staff ${newStaff.value.name} berhasil ditambahkan!`;
    
    // Auto hide success message
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
    
  } catch (err) {
    console.error("❌ Error saving staff:", err);
    error.value = `Gagal menyimpan data: ${err instanceof Error ? err.message : 'Unknown error'}`;
  } finally {
    saving.value = false;
  }
}

function deleteStaff(id: number) {
  const staff = staffList.value.find(s => s.id === id);
  if (staff) {
    staffToDelete.value = staff;
    showDeleteModal.value = true;
  }
}

async function confirmDelete() {
  if (!staffToDelete.value) return;
  
  // Simpan nama staff sebelum menghapus untuk pesan sukses
  const staffName = staffToDelete.value.name;
  const staffId = staffToDelete.value.id;
  
  try {
    deleting.value = true;
    
    const res = await fetch("/api/staff", {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
      },
      body: JSON.stringify({ id: staffId }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    
    await fetchStaff();
    cancelDelete();
    error.value = null;
    
    // Gunakan nama yang sudah disimpan sebelumnya
    successMessage.value = `Staff ${staffName} berhasil dihapus!`;
    
    // Auto hide success message
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
    
  } catch (err) {
    console.error("❌ Error deleting staff:", err);
    error.value = `Gagal menghapus data: ${err instanceof Error ? err.message : 'Unknown error'}`;
  } finally {
    deleting.value = false;
  }
}

function cancelDelete() {
  showDeleteModal.value = false;
  staffToDelete.value = null;
}

function openAddModal() {
  isEdit.value = false;
  newStaff.value = { id: 0, name: "", position: "" };
  showModal.value = true;
  error.value = null;
  document.body.classList.add('modal-open');
}

function openEditModal(staff: Staff) {
  isEdit.value = true;
  newStaff.value = { ...staff };
  showModal.value = true;
  error.value = null;
  document.body.classList.add('modal-open');
}

function closeModal() {
  showModal.value = false;
  error.value = null;
  document.body.classList.remove('modal-open');
}

function refreshData() {
  successMessage.value = "Memperbarui data staff...";
  fetchStaff();
}

onMounted(async() => {
  const user = await getCurrentUser()
  if(user?.role == "admin") {
    token.value = localStorage.getItem("accessToken") || '';
    fetchStaff();
  } else {
    window.location.href = "/"
  }
});
</script>

<style scoped>
/* Custom color classes */
.text-white-75 {
  color: rgba(255, 255, 255, 0.75) !important;
}

/* Header section */
.staff-header-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  min-height: 40vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 60px 0;
}

.staff-header-section::before {
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
.staff-content-section {
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

/* Table styling */
.modern-table {
  border: none;
  margin: 0;
}

.modern-table thead th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.85rem;
}

.modern-table thead th:first-child {
  border-top-left-radius: 10px;
}

.modern-table thead th:last-child {
  border-top-right-radius: 10px;
}

.modern-table tbody td {
  padding: 18px 20px;
  border: none;
  vertical-align: middle;
  background: white;
}

.table-row-hover {
  transition: all 0.3s ease;
  cursor: pointer;
}

.table-row-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.table-row-hover:hover td {
  background: #f8f9ff !important;
}

/* Action buttons */
.action-btn {
  transition: all 0.3s ease;
  font-weight: 500;
  padding: 8px 16px;
  font-size: 0.85rem;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Staff avatar */
.staff-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 50%;
}

/* Modal styling */
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
  border-radius: 20px;
  overflow: hidden;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
}

.staff-modal .modal-header {
  padding: 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%) !important;
}

.modal-title {
  margin: 0;
  font-weight: 600;
  font-size: 1.3rem;
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
  transition: all 0.2s ease;
}

.btn-close:hover {
  opacity: 0.7;
  transform: scale(1.1);
}

.btn-close-white {
  color: white;
}

.modal-body {
  padding: 2rem;
}

.modal-footer {
  padding: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  background: #f8f9fa;
}

/* Form styling */
.form-control-lg {
  padding: 12px 20px;
  font-size: 1.1rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  color: #495057 !important; /* Force text color */
  background-color: white !important; /* Force background color */
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  color: #495057 !important; /* Ensure text color on focus */
  background-color: white !important; /* Ensure background on focus */
}

/* Specifically target input fields in modal */
.custom-modal .form-control,
.custom-modal .form-control:focus {
  color: #495057 !important;
  background-color: white !important;
}

/* Ensure placeholder text is visible */
.custom-modal .form-control::placeholder {
  color: #6c757d !important;
  opacity: 0.8;
}

/* For disabled input */
.custom-modal .form-control:disabled {
  background-color: #e9ecef !important;
  color: #6c757d !important;
  opacity: 1;
}

.form-label {
  color: #495057;
  font-size: 1rem;
  margin-bottom: 8px;
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
.btn-secondary { background: linear-gradient(45deg, #6c757d, #adb5bd); color: white; }

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
  .staff-header-section {
    padding: 40px 0;
    min-height: 35vh;
  }
  
  .staff-content-section {
    padding: 40px 0;
  }
  
  .custom-modal {
    margin: 10px;
    max-width: calc(100% - 20px);
    border-radius: 15px;
  }
  
  .modal-body, .modal-footer {
    padding: 1.5rem;
  }
  
  .modern-table thead th,
  .modern-table tbody td {
    padding: 12px 10px;
  }
  
  .btn-group {
    flex-direction: column;
  }
  
  .btn-group .btn {
    margin-bottom: 5px;
    margin-right: 0 !important;
  }
}

@media (max-width: 576px) {
  .staff-header-section {
    padding: 30px 0;
    min-height: 30vh;
  }
  
  .glass-btn {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .staff-table-card {
    padding: 20px 15px !important;
  }
  
  .table-responsive {
    font-size: 0.85rem;
  }
  
  .modern-table thead th,
  .modern-table tbody td {
    padding: 10px 8px;
  }
}
</style>