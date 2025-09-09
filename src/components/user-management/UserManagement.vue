<template>
  <div class="user-management">
    <!-- Header Section -->
    <section class="user-header-section mt-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 text-center mb-4">
            <h2 class="h2 fw-bold mb-3 text-white">
              <i class="bi bi-people me-3"></i>
              Manajemen User
            </h2>
            <p class="text-white-75">Kelola data user dengan mudah dan efisien</p>
          </div>
        </div>
        
        <!-- Action Buttons & Search -->
        <div class="row justify-content-center mb-4">
          <div class="col-lg-8">
            <div class="d-flex flex-wrap gap-3 justify-content-center align-items-center">
              <!-- Search -->
              <div class="search-container">
                <div class="position-relative">
                  <input 
                    v-model="searchQuery"
                    @input="debouncedSearch"
                    class="form-control form-control-lg rounded-pill ps-5"
                    placeholder="Cari nama, email, atau deskripsi..."
                    style="min-width: 300px;"
                  />
                  <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                </div>
              </div>
              
              <!-- Filters -->
              <select v-model="roleFilter" @change="fetchUsers" class="form-select rounded-pill" style="width: 150px;">
                <option value="">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="guest">Guest</option>
              </select>
              
              <select v-model="verifiedFilter" @change="fetchUsers" class="form-select rounded-pill" style="width: 170px;">
                <option value="">Semua Status</option>
                <option value="1">Terverifikasi</option>
                <option value="0">Belum Verifikasi</option>
              </select>
              
              <button class="btn btn-outline-light btn-lg px-4 py-3 rounded-pill glass-btn" @click="refreshData">
                <i class="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </button>
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
    <section class="user-content-section">
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

        <!-- User Table Card -->
        <div class="user-table-card glass-card-light rounded-4 p-4 shadow-lg">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold mb-0">
              <i class="bi bi-table me-2 text-primary"></i>
              Daftar User
            </h4>
            <div class="user-stats d-flex gap-2">
              <span class="badge bg-primary rounded-pill px-3 py-2">
                <i class="bi bi-people me-1"></i>
                Total: {{ pagination.total }}
              </span>
              <span v-if="unverifiedCount > 0" class="badge bg-warning rounded-pill px-3 py-2">
                <i class="bi bi-exclamation-triangle me-1"></i>
                Belum Verifikasi: {{ unverifiedCount }}
              </span>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted fw-medium">Memuat data user...</p>
          </div>

          <!-- User Table -->
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
                    Nama & Email
                  </th>
                  <th class="fw-bold">
                    <i class="bi bi-shield me-1"></i>
                    Role
                  </th>
                  <th class="fw-bold">
                    <i class="bi bi-check-circle me-1"></i>
                    Status
                  </th>
                  <th class="fw-bold">
                    <i class="bi bi-calendar me-1"></i>
                    Terdaftar
                  </th>
                  <th class="fw-bold text-center">
                    <i class="bi bi-gear me-1"></i>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="userList.length === 0">
                  <td colspan="6" class="text-center py-5">
                    <i class="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
                    <p class="text-muted mb-0">Tidak ada data user yang tersedia</p>
                    <small class="text-muted">{{ searchQuery ? 'Coba ubah kata kunci pencarian' : 'User belum terdaftar' }}</small>
                  </td>
                </tr>
                <tr v-else v-for="user in userList" :key="user.id" class="table-row-hover">
                  <td>
                    <span class="badge bg-light text-dark rounded-pill px-3 py-2">
                      #{{ user.id }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="user-avatar me-3">
                        <i class="bi bi-person-circle text-primary fs-4"></i>
                      </div>
                      <div>
                        <div class="fw-semibold">{{ user.name }}</div>
                        <div class="text-muted small">{{ user.email }}</div>
                        <div v-if="user.description" class="text-muted small fst-italic">{{ user.description }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      class="badge rounded-pill px-3 py-2"
                      :class="{
                        'bg-danger bg-opacity-10 text-danger': user.role === 'admin',
                        'bg-success bg-opacity-10 text-success': user.role === 'user',
                        'bg-secondary bg-opacity-10 text-secondary': user.role === 'guest'
                      }"
                    >
                      <i class="bi me-1" :class="{
                        'bi-shield-check': user.role === 'admin',
                        'bi-person-check': user.role === 'user',
                        'bi-person': user.role === 'guest'
                      }"></i>
                      {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
                    </span>
                  </td>
                  <td>
                    <button
                      @click="toggleVerification(user)"
                      class="badge border-0 rounded-pill px-3 py-2 cursor-pointer"
                      :class="{
                        'bg-success bg-opacity-10 text-success': user.is_verified === 1,
                        'bg-warning bg-opacity-10 text-warning': user.is_verified === 0
                      }"
                      :disabled="verifying"
                    >
                      <i class="bi me-1" :class="{
                        'bi-check-circle-fill': user.is_verified === 1,
                        'bi-clock': user.is_verified === 0
                      }"></i>
                      {{ user.is_verified === 1 ? 'Terverifikasi' : 'Belum Verifikasi' }}
                    </button>
                  </td>
                  <td>
                    <span class="text-muted small">
                      {{ formatDate(user.created_at) }}
                    </span>
                  </td>
                  <td class="text-center">
                    <div class="btn-group" role="group">
                      <button class="btn btn-sm btn-outline-warning rounded-pill me-2 action-btn" @click="openEditModal(user)" title="Edit User">
                        <i class="bi bi-pencil-square"></i>
                        Edit
                      </button>
                      <button class="btn btn-sm btn-outline-danger rounded-pill action-btn" @click="deleteUser(user.id)" title="Hapus User">
                        <i class="bi bi-trash3"></i>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination -->
            <div v-if="pagination.totalPages > 1" class="d-flex justify-content-between align-items-center mt-4">
              <div class="pagination-info">
                <span class="text-muted">
                  Menampilkan {{ ((pagination.page - 1) * pagination.limit) + 1 }} - 
                  {{ Math.min(pagination.page * pagination.limit, pagination.total) }} 
                  dari {{ pagination.total }} user
                </span>
              </div>
              <nav>
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item" :class="{ disabled: !pagination.hasPrev }">
                    <button class="page-link rounded-pill me-1" @click="changePage(pagination.page - 1)" :disabled="!pagination.hasPrev">
                      <i class="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  
                  <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === pagination.page }">
                    <button class="page-link rounded-pill me-1" @click="changePage(page)">
                      {{ page }}
                    </button>
                  </li>
                  
                  <li class="page-item" :class="{ disabled: !pagination.hasNext }">
                    <button class="page-link rounded-pill" @click="changePage(pagination.page + 1)" :disabled="!pagination.hasNext">
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Edit User Modal -->
    <div v-if="showModal" class="custom-modal-overlay" @click="closeModal">
      <div class="custom-modal user-modal" @click.stop>
        <div class="modal-header bg-warning">
          <h5 class="modal-title text-white fw-bold">
            <i class="bi bi-pencil-square me-2"></i>
            Edit User
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
        </div>
        
        <div class="modal-body p-4">
          <!-- ID Field -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-hash me-1"></i>
              ID User
            </label>
            <input v-model="editUser.id" class="form-control form-control-lg rounded-pill" disabled />
          </div>

          <!-- Name Field -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-person me-1"></i>
              Nama Lengkap <span class="text-danger">*</span>
            </label>
            <input 
              v-model="editUser.name" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan nama lengkap"
              required 
            />
            <div v-if="!editUser.name" class="form-text text-danger">
              <i class="bi bi-exclamation-circle me-1"></i>
              Nama wajib diisi
            </div>
          </div>

          <!-- Email Field -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-envelope me-1"></i>
              Email <span class="text-danger">*</span>
            </label>
            <input 
              v-model="editUser.email" 
              type="email"
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan email"
              required 
            />
            <div v-if="!editUser.email" class="form-text text-danger">
              <i class="bi bi-exclamation-circle me-1"></i>
              Email wajib diisi
            </div>
          </div>

          <!-- Role Field -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-shield me-1"></i>
              Role
            </label>
            <select v-model="editUser.role" class="form-select form-select-lg rounded-pill">
              <option value="guest">Guest</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <!-- Description Field -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-file-text me-1"></i>
              Deskripsi
            </label>
            <textarea 
              v-model="editUser.description" 
              class="form-control form-control-lg rounded-4" 
              rows="3"
              placeholder="Masukkan deskripsi (opsional)"
            ></textarea>
          </div>

          <!-- Verification Status -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-check-circle me-1"></i>
              Status Verifikasi
            </label>
            <div class="form-check form-switch">
              <input 
                v-model="editUser.is_verified" 
                class="form-check-input" 
                type="checkbox" 
                :true-value="1"
                :false-value="0"
                id="verificationSwitch"
              >
              <label class="form-check-label fw-medium" for="verificationSwitch">
                {{ editUser.is_verified === 1 ? 'Terverifikasi' : 'Belum Verifikasi' }}
              </label>
            </div>
          </div>

          <!-- Password Field -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-lock me-1"></i>
              Password Baru
            </label>
            <input 
              v-model="editUser.password" 
              type="password"
              class="form-control form-control-lg rounded-pill" 
              placeholder="Kosongkan jika tidak ingin mengubah password"
            />
            <div class="form-text text-muted">
              <i class="bi bi-info-circle me-1"></i>
              Minimal 6 karakter. Kosongkan jika tidak ingin mengubah password.
            </div>
          </div>
        </div>
        
        <div class="modal-footer p-4">
          <button class="btn btn-secondary btn-lg px-4 rounded-pill me-3" @click="closeModal">
            <i class="bi bi-x-circle me-2"></i>
            Batal
          </button>
          <button 
            class="btn btn-warning btn-lg px-4 rounded-pill"
            @click="saveUser" 
            :disabled="!editUser.name || !editUser.email || saving"
          >
            <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else class="bi bi-check-square me-2"></i>
            {{ saving ? 'Menyimpan...' : "Update User" }}
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
          <p class="fw-semibold mb-2">Yakin ingin menghapus user ini?</p>
          <p class="text-muted mb-0">User ID: <strong>{{ userToDelete?.id }}</strong></p>
          <p class="text-muted">Nama: <strong>{{ userToDelete?.name }}</strong></p>
          <p class="text-muted">Email: <strong>{{ userToDelete?.email }}</strong></p>
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
import { ref, onMounted, computed } from "vue";
import { getCurrentUser } from "../../lib/auth-utils";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  description: string | null;
  is_verified: number;
  created_at: string;
  password?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const userList = ref<User[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const saving = ref(false);
const deleting = ref(false);
const verifying = ref(false);

// Search and filter
const searchQuery = ref("");
const roleFilter = ref("");
const verifiedFilter = ref("");

// Pagination
const pagination = ref<Pagination>({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false
});

// Modal state
const showModal = ref(false);
const showDeleteModal = ref(false);
const editUser = ref<User>({ 
  id: 0, 
  name: "", 
  email: "", 
  role: "guest", 
  description: "", 
  is_verified: 0,
  created_at: "",
  password: ""
});
const token = ref('');
const userToDelete = ref<User | null>(null);

// Computed properties
const unverifiedCount = computed(() => {
  return userList.value.filter(user => user.is_verified === 0).length;
});

const visiblePages = computed(() => {
  const pages = [];
  const total = pagination.value.totalPages;
  const current = pagination.value.page;
  
  let start = Math.max(1, current - 2);
  let end = Math.min(total, current + 2);
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4);
    } else if (end === total) {
      start = Math.max(1, end - 4);
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1;
    fetchUsers();
  }, 500);
};

async function fetchUsers() {
  try {
    loading.value = true;
    error.value = null;
    
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString(),
    });
    
    if (searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim());
    }
    
    if (roleFilter.value) {
      params.append('role', roleFilter.value);
    }
    
    if (verifiedFilter.value !== "") {
      params.append('verified', verifiedFilter.value);
    }
    
    const res = await fetch(`/api/users?${params.toString()}`, {
      headers: {
        "Authorization": `Bearer ${token.value}`
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    userList.value = data.users;
    pagination.value = data.pagination;
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    error.value = `Gagal memuat data: ${err instanceof Error ? err.message : 'Unknown error'}`;
    userList.value = [];
  } finally {
    loading.value = false;
  }
}

async function saveUser() {
  try {
    saving.value = true;
    
    if (!editUser.value.name.trim() || !editUser.value.email.trim()) {
      error.value = "Nama dan email wajib diisi";
      return;
    }

    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
      },
      body: JSON.stringify(editUser.value),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    
    await fetchUsers();
    closeModal();
    error.value = null;
    successMessage.value = `User ${editUser.value.name} berhasil diupdate!`;
    
    // Auto hide success message
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
    
  } catch (err) {
    console.error("❌ Error saving user:", err);
    error.value = `Gagal menyimpan data: ${err instanceof Error ? err.message : 'Unknown error'}`;
  } finally {
    saving.value = false;
  }
}

async function toggleVerification(user: User) {
  try {
    verifying.value = true;
    
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
      },
      body: JSON.stringify({ 
        id: user.id, 
        is_verified: user.is_verified === 1 ? 0 : 1 
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    
    const response = await res.json();
    await fetchUsers();
    successMessage.value = response.message;
    
    // Auto hide success message
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
    
  } catch (err) {
    console.error("❌ Error toggling verification:", err);
    error.value = `Gagal mengubah status verifikasi: ${err instanceof Error ? err.message : 'Unknown error'}`;
  } finally {
    verifying.value = false;
  }
}

function deleteUser(id: number) {
  const user = userList.value.find(u => u.id === id);
  if (user) {
    userToDelete.value = user;
    showDeleteModal.value = true;
  }
}

async function confirmDelete() {
  if (!userToDelete.value) return;
  
  const userName = userToDelete.value.name;
  const userId = userToDelete.value.id;
  
  try {
    deleting.value = true;
    
    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
      },
      body: JSON.stringify({ id: userId }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    
    await fetchUsers();
    cancelDelete();
    error.value = null;
    successMessage.value = `User ${userName} berhasil dihapus!`;
    
    // Auto hide success message
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
    
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    error.value = `Gagal menghapus data: ${err instanceof Error ? err.message : 'Unknown error'}`;
  } finally {
    deleting.value = false;
  }
}

function cancelDelete() {
  showDeleteModal.value = false;
  userToDelete.value = null;
}

function openEditModal(user: User) {
  editUser.value = { 
    ...user, 
    password: "" // Reset password field
  };
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
  successMessage.value = "Memperbarui data user...";
  fetchUsers();
}

function changePage(page: number) {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page;
    fetchUsers();
  }
}

function formatDate(dateString: string) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

onMounted(async() => {
  const user = await getCurrentUser();
  if(user?.role == "admin") {
    token.value = localStorage.getItem("accessToken") || '';
    fetchUsers();
  } else {
    window.location.href = "/";
  }
});
</script>

<style scoped>
/* Custom color classes */
.text-white-75 {
  color: rgba(255, 255, 255, 0.75) !important;
}

/* Header section */
.user-header-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  min-height: 45vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 60px 0;
}

.user-header-section::before {
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
.user-content-section {
  background: #f8f9fa;
  min-height: 55vh;
  padding: 60px 0;
  margin-top: -30px;
  position: relative;
  z-index: 2;
}

.container {
  z-index: 2;
  position: relative;
}

/* Search container */
.search-container input {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #495057;
}

.search-container input:focus {
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 1);
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

/* User avatar */
.user-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 50%;
}

/* Cursor pointer for clickable badges */
.cursor-pointer {
  cursor: pointer;
  transition: all 0.2s ease;
}

.cursor-pointer:hover {
  transform: scale(1.05);
}

/* Pagination */
.pagination .page-link {
  border: 2px solid #dee2e6;
  color: #667eea;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination .page-item.active .page-link {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-color: #667eea;
  color: white;
}

.pagination .page-link:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  color: #667eea;
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
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
}

.user-modal .modal-header {
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.9) 0%, rgba(253, 126, 20, 0.9) 100%) !important;
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
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  background: #f8f9fa;
}

/* Form styling */
.form-control-lg, .form-select-lg {
  padding: 12px 20px;
  font-size: 1.1rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  color: #495057 !important;
  background-color: white !important;
}

.form-control:focus, .form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  color: #495057 !important;
  background-color: white !important;
}

/* Form switches */
.form-check-input:checked {
  background-color: #28a745;
  border-color: #28a745;
}

.form-check-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

/* Ensure form elements in modal are visible */
.custom-modal .form-control,
.custom-modal .form-select,
.custom-modal .form-control:focus,
.custom-modal .form-select:focus {
  color: #495057 !important;
  background-color: white !important;
}

.custom-modal .form-control::placeholder {
  color: #6c757d !important;
  opacity: 0.8;
}

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
  .user-header-section {
    padding: 40px 0;
    min-height: 40vh;
  }
  
  .user-content-section {
    padding: 40px 0;
  }
  
  .search-container input {
    min-width: 250px !important;
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
    font-size: 0.9rem;
  }
  
  .btn-group {
    flex-direction: column;
  }
  
  .btn-group .btn {
    margin-bottom: 5px;
    margin-right: 0 !important;
  }
  
  /* Stack filters vertically on mobile */
  .user-header-section .d-flex {
    flex-direction: column;
    gap: 15px !important;
  }
  
  .user-header-section select {
    width: 100% !important;
  }
}

@media (max-width: 576px) {
  .user-header-section {
    padding: 30px 0;
    min-height: 35vh;
  }
  
  .search-container input {
    min-width: 200px !important;
  }
  
  .glass-btn {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .user-table-card {
    padding: 20px 15px !important;
  }
  
  .table-responsive {
    font-size: 0.85rem;
  }
  
  .modern-table thead th,
  .modern-table tbody td {
    padding: 10px 8px;
  }
  
  /* Hide some columns on very small screens */
  .modern-table th:nth-child(5),
  .modern-table td:nth-child(5) {
    display: none;
  }
  
  .user-stats {
    flex-direction: column !important;
    align-items: flex-end !important;
  }
  
  .pagination-info {
    font-size: 0.85rem;
  }
}

/* Fix for body modal open */
body.modal-open {
  overflow: hidden;
}
</style>