
<template>
  <div class="pkkpr-management">
    <!-- Header Section -->
    <section class="pkkpr-header-section mt-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 text-center mb-4">
            <h2 class="h2 fw-bold mb-3 text-white">
              <i class="bi bi-file-earmark-text me-3"></i>
              Manajemen PKKPR
            </h2>
            <p class="text-white-75">Kelola data PKKPR dengan mudah dan efisien</p>
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
                    placeholder="Cari judul PKKPR..."
                    style="min-width: 300px;"
                  />
                  <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                </div>
              </div>
              
              <!-- Filters -->
              <select v-model="typeFilter" @change="fetchPkkpr" class="form-select rounded-pill" style="width: 180px;">
                <option value="">Semua Type</option>
                <option value="Berusaha">Berusaha</option>
                <option value="Non Berusaha">Non Berusaha</option>
              </select>
              
              <button v-if="userRole === 'admin'" class="btn btn-success btn-lg px-4 py-3 rounded-pill glass-btn" @click="openCreateModal">
                <i class="bi bi-plus-circle me-2"></i>
                Tambah PKKPR
              </button>
              
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
    <section class="pkkpr-content-section">
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

        <!-- PKKPR Table Card -->
        <div class="pkkpr-table-card glass-card-light rounded-4 p-4 shadow-lg">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold mb-0">
              <i class="bi bi-table me-2 text-primary"></i>
              Daftar PKKPR
            </h4>
            <div class="pkkpr-stats d-flex gap-2">
              <span class="badge bg-primary rounded-pill px-3 py-2">
                <i class="bi bi-file-earmark-text me-1"></i>
                Total: {{ pagination.total }}
              </span>
              <span v-if="activeCount > 0" class="badge bg-success rounded-pill px-3 py-2">
                <i class="bi bi-check-circle me-1"></i>
                Terbit: {{ activeCount }}
              </span>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted fw-medium">Memuat data PKKPR...</p>
          </div>

          <!-- PKKPR Table -->
          <div v-else class="table-responsive">
            <table class="table table-hover modern-table">
              <thead>
                <tr>
                  <th class="fw-bold">
                    <i class="bi bi-hash me-1"></i>
                    ID
                  </th>
                  <th class="fw-bold">
                    <i class="bi bi-file-earmark-text me-1"></i>
                    Judul PKKPR
                  </th>
                  <th class="fw-bold">
                    <i class="bi bi-tag me-1"></i>
                    Type
                  </th>
                  <th class="fw-bold">
                    <i class="bi bi-info-circle me-1"></i>
                    Status
                  </th>
                  <th class="fw-bold">
                    <i class="bi bi-people me-1"></i>
                    Detail
                  </th>
                  <th class="fw-bold">
                    <i class="bi bi-calendar me-1"></i>
                    Dibuat
                  </th>
                  <th class="fw-bold text-center">
                    <i class="bi bi-gear me-1"></i>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="pkkprList.length === 0">
                  <td colspan="7" class="text-center py-5">
                    <i class="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
                    <p class="text-muted mb-0">Tidak ada data PKKPR yang tersedia</p>
                    <small class="text-muted">{{ searchQuery ? 'Coba ubah kata kunci pencarian' : 'PKKPR belum tersedia' }}</small>
                  </td>
                </tr>
                <tr v-else v-for="item in pkkprList" :key="item.id" class="table-row-hover">
                  <td>
                    <span class="badge bg-light text-dark rounded-pill px-3 py-2">
                      #{{ item.id }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="pkkpr-icon me-3">
                        <i class="bi bi-file-earmark-text text-primary fs-4"></i>
                      </div>
                      <div>
                        <div class="fw-semibold">{{ item.title }}</div>
                        <div class="text-muted small">ID: {{ item.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      class="badge rounded-pill px-3 py-2"
                      :class="{
                        'bg-primary bg-opacity-10 text-primary': item.type === 'Berusaha',
                        'bg-success bg-opacity-10 text-success': item.type === 'Non Berusaha'
                      }"
                    >
                      <i class="bi me-1" :class="{
                        'bi-briefcase': item.type === 'Berusaha',
                        'bi-house': item.type === 'Non Berusaha'
                      }"></i>
                      {{ item.type }}
                    </span>
                  </td>
                  <td>
                    <span class="text-muted">{{ item.status || '-' }}</span>
                  </td>
                  <td>
                    <button 
                      @click="viewApplications(item.id)"
                      :disabled="userRole === 'guest'"
                      class="badge border-0 rounded-pill px-3 py-2"
                      :class="{
                        'bg-info bg-opacity-10 text-info cursor-pointer': userRole !== 'guest',
                        'bg-secondary bg-opacity-10 text-secondary': userRole === 'guest'
                      }"
                      :title="userRole === 'guest' ? 'Akses terbatas' : 'Lihat detail permohonan'"
                    >
                      <i class="bi bi-eye me-1"></i>
                      Lihat
                    </button>
                  </td>
                  <td>
                    <span class="text-muted small">
                      {{ formatDate(item.createdAt) }}
                    </span>
                  </td>
                  <td class="text-center">
                    <div class="btn-group" role="group">
                      <button 
                        v-if="userRole === 'admin'"
                        class="btn btn-sm btn-outline-warning rounded-pill me-2 action-btn" 
                        @click="openEditModal(item)" 
                        title="Edit PKKPR"
                      >
                        <i class="bi bi-pencil-square"></i>
                        Edit
                      </button>
                      <button 
                        v-if="userRole === 'admin'"
                        class="btn btn-sm btn-outline-danger rounded-pill action-btn" 
                        @click="deletePkkpr(item.id)" 
                        title="Hapus PKKPR"
                      >
                        <i class="bi bi-trash3"></i>
                        Hapus
                      </button>
                      <button 
                        v-if="userRole !== 'admin'" 
                        class="btn btn-sm btn-outline-primary rounded-pill action-btn" 
                        @click="viewPkkpr(item)" 
                        title="Lihat PKKPR"
                      >
                        <i class="bi bi-eye"></i>
                        Lihat
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
                  dari {{ pagination.total }} PKKPR
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

    <!-- Create/Edit PKKPR Modal -->
    <div v-if="showModal" class="custom-modal-overlay" @click="closeModal">
      <div class="custom-modal pkkpr-modal" @click.stop>
        <div class="modal-header" :class="isEdit ? 'bg-warning' : 'bg-success'">
          <h5 class="modal-title text-white fw-bold">
            <i class="bi me-2" :class="isEdit ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
            {{ isEdit ? 'Edit PKKPR' : 'Tambah PKKPR Baru' }}
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
        </div>
        
        <div class="modal-body p-4">
          <!-- ID Field (hanya untuk edit) -->
          <div v-if="isEdit" class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-hash me-1"></i>
              ID PKKPR
            </label>
            <input v-model="editPkkpr.id" class="form-control form-control-lg rounded-pill" disabled />
          </div>

          <!-- Title Field -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-file-earmark-text me-1"></i>
              Judul PKKPR <span class="text-danger">*</span>
            </label>
            <input 
              v-model="editPkkpr.title" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan judul PKKPR"
              required 
            />
            <div v-if="!editPkkpr.title" class="form-text text-danger">
              <i class="bi bi-exclamation-circle me-1"></i>
              Judul wajib diisi
            </div>
          </div>

          <!-- Type Field -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-tag me-1"></i>
              Type PKKPR <span class="text-danger">*</span>
            </label>
            <select v-model="editPkkpr.type" class="form-select form-select-lg rounded-pill">
              <option value="">Pilih Type</option>
              <option value="Berusaha">Berusaha</option>
              <option value="Non Berusaha">Non Berusaha</option>
            </select>
            <div v-if="!editPkkpr.type" class="form-text text-danger">
              <i class="bi bi-exclamation-circle me-1"></i>
              Type wajib dipilih
            </div>
          </div>

          <!-- Status Field (Free Text) -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-info-circle me-1"></i>
              Status
            </label>
            <input 
              v-model="editPkkpr.status" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan status (opsional)"
            />
            <div class="form-text text-muted">
              <i class="bi bi-info-circle me-1"></i>
              Contoh: Draft, Masuk, Dalam Review, dll.
            </div>
          </div>
          <!-- Applicant name Field (Free Text) -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-person me-1"></i>
              Nama Pemohon
            </label>
            <input 
              v-model="editPkkpr.applicantName" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan nama pemohon (opsional)"
            />
          </div>

          <!-- Applicant phone Field (Number Input) -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-phone me-1"></i>
              Nomor Telepon Pemohon
            </label>
            <input 
              type="number"
              v-model="editPkkpr.applicantPhone" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukan nomor telepon pemohon (opsional)"
            />
          </div>
          <!-- Act as Field (Free Text) -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-person-fill me-1"></i>
              Bertindak Atas Nama
            </label>
            <input 
              v-model="editPkkpr.representativeName" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan nama yang diwakilkan (opsional)"
            />
          </div>

          <!-- Location Field (Free Text) -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-geo-alt me-1"></i>
              Lokasi yang dimohonkan
            </label>
            <input 
              v-model="editPkkpr.location" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan lokasi yang dimohonkan (opsional)"
            />
          </div>

          <!-- Land area Field (Number Input) -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-map me-1"></i>
              Luas Tanah (m2)
            </label>
            <input 
              type="number"
              v-model="editPkkpr.landArea" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan luas tanah (opsional)"
            />
          </div>

          <!-- Land boundary north Field (Free Text) -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-compass me-1"></i>
              Batas Utara
            </label>
            <input 
              v-model="editPkkpr.landBoundaryNorth" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan batas utara (opsional)"
            />
          </div>

          <!-- Land boundary east Field (Free Text) -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-compass me-1"></i>
              Batas Timur
            </label>
            <input 
              v-model="editPkkpr.landBoundaryEast" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan batas timur (opsional)"
            />
          </div>

          <!-- Land boundary south Field (Free Text) -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-compass me-1"></i>
              Batas Selatan
            </label>
            <input 
              v-model="editPkkpr.landBoundarySouth" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan batas selatan (opsional)"
            />
          </div>

          <!-- Land boundary west Field (Free Text) -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              <i class="bi bi-compass me-1"></i>
              Batas Barat
            </label>
            <input 
              v-model="editPkkpr.landBoundaryWest" 
              class="form-control form-control-lg rounded-pill" 
              placeholder="Masukkan batas barat (opsional)"
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
            @click="savePkkpr" 
            :disabled="!editPkkpr.title || !editPkkpr.type || saving"
          >
            <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else class="bi me-2" :class="isEdit ? 'bi-check-square' : 'bi-plus-circle'"></i>
            {{ saving ? 'Menyimpan...' : (isEdit ? "Update PKKPR" : "Buat PKKPR") }}
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
          <p class="fw-semibold mb-2">Yakin ingin menghapus PKKPR ini?</p>
          <p class="text-muted mb-0">PKKPR ID: <strong>{{ pkkprToDelete?.id }}</strong></p>
          <p class="text-muted">Judul: <strong>{{ pkkprToDelete?.title }}</strong></p>
          <div class="alert alert-warning mt-3">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Peringatan: Data yang dihapus tidak dapat dikembalikan!
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

interface Pkkpr {
  id: number;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  applicantName?: string;
  applicantPhone?: string;
  representativeName?: string;
  location?: string;
  landArea?: number;
  landBoundaryNorth?: string;
  landBoundaryEast?: string;
  landBoundarySouth?: string;
  landBoundaryWest?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const pkkprList = ref<Pkkpr[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const saving = ref(false);
const deleting = ref(false);

// Search and filter
const searchQuery = ref("");
const typeFilter = ref("");

// User role
const userRole = ref<string>("");

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
const isEdit = ref(false);
const editPkkpr = ref<Pkkpr>({ 
  id: 0, 
  title: "", 
  type: "", 
  status: "",
  createdAt: ""
});
const token = ref('');
const pkkprToDelete = ref<Pkkpr | null>(null);

// Computed properties
const activeCount = computed(() => {
  return pkkprList.value.filter(item => item.status && item.status.toLowerCase().includes('Terbit')).length;
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
    fetchPkkpr();
  }, 500);
};

async function fetchPkkpr() {
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
    
    if (typeFilter.value) {
      params.append('type', typeFilter.value);
    }
    
    const res = await fetch(`/api/pkkpr?${params.toString()}`, {
      headers: {
        "Authorization": `Bearer ${token.value}`
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    pkkprList.value = data.pkkpr;
    pagination.value = data.pagination;
  } catch (err) {
    console.error("❌ Error fetching PKKPR:", err);
    error.value = `Gagal memuat data: ${err instanceof Error ? err.message : 'Unknown error'}`;
    pkkprList.value = [];
  } finally {
    loading.value = false;
  }
}

async function savePkkpr() {
  try {
    saving.value = true;
    
    if (!editPkkpr.value.title.trim() || !editPkkpr.value.type) {
      error.value = "Judul dan type wajib diisi";
      return;
    }

    const method = isEdit.value ? "PUT" : "POST";
    const res = await fetch("/api/pkkpr", {
      method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
      },
      body: JSON.stringify(editPkkpr.value),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    
    await fetchPkkpr();
    closeModal();
    error.value = null;
    successMessage.value = `PKKPR ${editPkkpr.value.title} berhasil ${isEdit.value ? 'diupdate' : 'dibuat'}!`;
    
    // Auto hide success message
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
    
  } catch (err) {
    console.error("❌ Error saving PKKPR:", err);
    error.value = `Gagal menyimpan data: ${err instanceof Error ? err.message : 'Unknown error'}`;
  } finally {
    saving.value = false;
  }
}

function deletePkkpr(id: number) {
  const item = pkkprList.value.find(p => p.id === id);
  if (item) {
    pkkprToDelete.value = item;
    showDeleteModal.value = true;
  }
}

async function confirmDelete() {
  if (!pkkprToDelete.value) return;
  
  const pkkprTitle = pkkprToDelete.value.title;
  const pkkprId = pkkprToDelete.value.id;
  
  try {
    deleting.value = true;
    
    const res = await fetch("/api/pkkpr", {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
      },
      body: JSON.stringify({ id: pkkprId }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    
    await fetchPkkpr();
    cancelDelete();
    error.value = null;
    successMessage.value = `PKKPR ${pkkprTitle} berhasil dihapus!`;
    
    // Auto hide success message
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
    
  } catch (err) {
    console.error("❌ Error deleting PKKPR:", err);
    error.value = `Gagal menghapus data: ${err instanceof Error ? err.message : 'Unknown error'}`;
  } finally {
    deleting.value = false;
  }
}

function cancelDelete() {
  showDeleteModal.value = false;
  pkkprToDelete.value = null;
}

function openCreateModal() {
  isEdit.value = false;
  editPkkpr.value = { 
    id: 0, 
    title: "", 
    type: "", 
    status: "",
    createdAt: "",
    applicantName: "",
    applicantPhone: "",
    representativeName: "",
    location: "",
    landArea: undefined,
    landBoundaryNorth: "",
    landBoundaryEast: "",
    landBoundarySouth: "",
    landBoundaryWest: "",
  };
  showModal.value = true;
  error.value = null;
  document.body.classList.add('modal-open');
}

function openEditModal(item: Pkkpr) {
  isEdit.value = true;
  editPkkpr.value = { ...item };
  showModal.value = true;
  error.value = null;
  document.body.classList.add('modal-open');
}

function closeModal() {
  showModal.value = false;
  error.value = null;
  document.body.classList.remove('modal-open');
}

function viewPkkpr(item: Pkkpr) {
  // For non-admin users, just show alert or redirect to view page
  alert(`Melihat PKKPR: ${item.title}\nType: ${item.type}\nStatus: ${item.status}`);
}

function viewApplications(pkkprId: number) {
  if (userRole.value === 'guest') {
    error.value = "Akses terbatas. Hanya user dan admin yang dapat melihat aplikasi.";
    return;
  }
  
  // Redirect to applications page
  window.location.href = `/applications?pkkpr=${pkkprId}`;
}

function refreshData() {
  successMessage.value = "Memperbarui data PKKPR...";
  fetchPkkpr();
}

function changePage(page: number) {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page;
    fetchPkkpr();
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
  if(user) {
    userRole.value = user.role;
    token.value = localStorage.getItem("accessToken") || '';
    fetchPkkpr();
  } else {
    window.location.href = "/login";
  }
});
</script>

<style scoped>
/* Custom color classes */
.text-white-75 {
  color: rgba(255, 255, 255, 0.75) !important;
}

/* Header section */
.pkkpr-header-section {
  background: linear-gradient(135deg, #3498db 0%, #9b59b6 100%);
  min-height: 45vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 60px 0;
  overflow: hidden;
}

.pkkpr-header-section::before {
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
.pkkpr-content-section {
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
  transition: all 0.3s ease;
}

.search-container input:focus {
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 1);
  outline: none;
}

.search-container input::placeholder {
  color: rgba(73, 80, 87, 0.7);
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
  border-collapse: separate;
  border-spacing: 0;
}

.modern-table thead th {
  background: linear-gradient(135deg, #3498db 0%, #9b59b6 100%);
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.modern-table tbody tr:last-child td {
  border-bottom: none;
}

.modern-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
}

.modern-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 10px;
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

/* PKKPR icon */
.pkkpr-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.pkkpr-icon:hover {
  background: rgba(52, 152, 219, 0.2);
  transform: scale(1.1);
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
.pagination {
  gap: 5px;
}

.pagination .page-link {
  border: 2px solid #dee2e6;
  color: #3498db;
  font-weight: 500;
  transition: all 0.3s ease;
  background: white;
}

.pagination .page-item.active .page-link {
  background: linear-gradient(45deg, #3498db, #9b59b6);
  border-color: #3498db;
  color: white;
}

.pagination .page-link:hover:not(.disabled) {
  background: rgba(52, 152, 219, 0.1);
  border-color: #3498db;
  color: #3498db;
  transform: translateY(-1px);
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  background: #f8f9fa;
  cursor: not-allowed;
}

.pagination-info {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
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
  backdrop-filter: blur(5px);
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

.pkkpr-modal {
  max-width: 800px;
}

.modal-header {
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: none;
}

.modal-title {
  margin: 0;
  font-weight: 600;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
}

.btn-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 50%;
}

.btn-close::before {
  content: '×';
  font-size: 24px;
  font-weight: bold;
}

.btn-close:hover {
  opacity: 0.8;
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
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
  border-top: 1px solid #e9ecef;
}

/* Form styling */
.form-control-lg, .form-select-lg {
  padding: 12px 20px;
  font-size: 1.1rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  color: #495057 !important;
  background-color: white !important;
  border-radius: 25px;
}

.form-control:focus, .form-select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
  color: #495057 !important;
  background-color: white !important;
  outline: none;
}

.form-control:hover, .form-select:hover {
  border-color: #b8daff;
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
  cursor: not-allowed;
}

.form-label {
  color: #495057;
  font-size: 1rem;
  margin-bottom: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.form-text {
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}

.form-text.text-danger {
  color: #dc3545 !important;
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
  transform: none !important;
}

.btn-primary { 
  background: linear-gradient(45deg, #3498db, #9b59b6); 
  color: white;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.btn-success { 
  background: linear-gradient(45deg, #28a745, #20c997); 
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.btn-info { 
  background: linear-gradient(45deg, #17a2b8, #6f42c1); 
  color: white;
  box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
}

.btn-warning { 
  background: linear-gradient(45deg, #ffc107, #fd7e14); 
  color: #212529;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
}

.btn-danger { 
  background: linear-gradient(45deg, #dc3545, #e83e8c); 
  color: white;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.btn-secondary { 
  background: linear-gradient(45deg, #6c757d, #adb5bd); 
  color: white;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.btn-outline-primary {
  color: #3498db;
  border: 2px solid #3498db;
  background: transparent;
}

.btn-outline-warning {
  color: #ffc107;
  border: 2px solid #ffc107;
  background: transparent;
}

.btn-outline-danger {
  color: #dc3545;
  border: 2px solid #dc3545;
  background: transparent;
}

.btn-outline-light {
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.btn-outline-primary:hover {
  background: #3498db;
  color: white;
}

.btn-outline-warning:hover {
  background: #ffc107;
  color: #212529;
}

.btn-outline-danger:hover {
  background: #dc3545;
  color: white;
}

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Badge styling */
.badge {
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge.bg-primary { background-color: #3498db !important; }
.badge.bg-success { background-color: #28a745 !important; }
.badge.bg-info { background-color: #17a2b8 !important; }
.badge.bg-warning { background-color: #ffc107 !important; color: #212529 !important; }
.badge.bg-danger { background-color: #dc3545 !important; }
.badge.bg-secondary { background-color: #6c757d !important; }
.badge.bg-light { background-color: #f8f9fa !important; color: #212529 !important; }

.badge.bg-primary.bg-opacity-10 { background-color: rgba(52, 152, 219, 0.1) !important; }
.badge.bg-success.bg-opacity-10 { background-color: rgba(40, 167, 69, 0.1) !important; }
.badge.bg-info.bg-opacity-10 { background-color: rgba(23, 162, 184, 0.1) !important; }
.badge.bg-warning.bg-opacity-10 { background-color: rgba(255, 193, 7, 0.1) !important; }
.badge.bg-danger.bg-opacity-10 { background-color: rgba(220, 53, 69, 0.1) !important; }
.badge.bg-secondary.bg-opacity-10 { background-color: rgba(108, 117, 125, 0.1) !important; }

.badge.text-primary { color: #3498db !important; }
.badge.text-success { color: #28a745 !important; }
.badge.text-info { color: #17a2b8 !important; }
.badge.text-warning { color: #ffc107 !important; }
.badge.text-danger { color: #dc3545 !important; }
.badge.text-secondary { color: #6c757d !important; }

/* Alert styling */
.alert {
  border: none;
  border-radius: 15px;
  padding: 15px 20px;
  font-weight: 500;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
}

.alert-success {
  background: linear-gradient(45deg, rgba(40, 167, 69, 0.1), rgba(32, 201, 151, 0.1));
  color: #155724;
  border-left: 4px solid #28a745;
}

.alert-danger {
  background: linear-gradient(45deg, rgba(220, 53, 69, 0.1), rgba(232, 62, 140, 0.1));
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.alert-warning {
  background: linear-gradient(45deg, rgba(255, 193, 7, 0.1), rgba(253, 126, 20, 0.1));
  color: #856404;
  border-left: 4px solid #ffc107;
}

.alert .btn-close {
  color: inherit;
  opacity: 0.7;
  margin-left: auto;
}

.alert .btn-close:hover {
  opacity: 1;
}

/* Loading spinner */
.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

.spinner-border-sm {
  width: 0.875rem;
  height: 0.875rem;
  border-width: 1px;
}

@keyframes spinner-border {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Decorative elements */
.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

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
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.4; 
  }
  50% { 
    transform: scale(1.05); 
    opacity: 0.2; 
  }
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
  }
  to { 
    opacity: 1; 
  }
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
@media (max-width: 1200px) {
  .container {
    max-width: 100%;
    padding: 0 30px;
  }
  
  .pkkpr-table-card {
    margin: 0 15px;
  }
}

@media (max-width: 992px) {
  .pkkpr-header-section {
    padding: 50px 0;
  }
  
  .custom-modal {
    max-width: 90%;
  }
  
  .modern-table thead th,
  .modern-table tbody td {
    padding: 12px 15px;
  }
  
  .action-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .pkkpr-header-section {
    padding: 40px 0;
    min-height: 40vh;
  }
  
  .pkkpr-content-section {
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
    width: 100%;
  }
  
  .btn-group .btn {
    margin-bottom: 5px;
    margin-right: 0 !important;
    width: 100%;
  }
  
  /* Stack filters vertically on mobile */
  .pkkpr-header-section .d-flex {
    flex-direction: column;
    gap: 15px !important;
  }
  
  .pkkpr-header-section select {
    width: 100% !important;
  }
  
  .glass-btn {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .modal-header {
    padding: 15px 20px;
  }
  
  .modal-title {
    font-size: 1.1rem;
  }
  
  .pkkpr-stats {
    flex-direction: column !important;
    align-items: flex-end !important;
    gap: 8px;
  }
}

@media (max-width: 576px) {
  .pkkpr-header-section {
    padding: 30px 0;
    min-height: 35vh;
  }
  
  .container {
    padding: 0 15px;
  }
  
  .search-container input {
    min-width: 200px !important;
    font-size: 0.9rem;
  }
  
  .glass-btn {
    width: 100%;
    margin-bottom: 10px;
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  
  .pkkpr-table-card {
    padding: 20px 15px !important;
    margin: 0 10px;
    border-radius: 15px;
  }
  
  .table-responsive {
    font-size: 0.85rem;
  }
  
  .modern-table thead th,
  .modern-table tbody td {
    padding: 10px 8px;
  }
  
  /* Hide some columns on very small screens */
  .modern-table th:nth-child(6),
  .modern-table td:nth-child(6) {
    display: none;
  }
  
  .modern-table th:nth-child(5),
  .modern-table td:nth-child(5) {
    display: none;
  }
  
  .pkkpr-stats {
    flex-direction: column !important;
    align-items: flex-end !important;
  }
  
  .pagination-info {
    font-size: 0.85rem;
    text-align: center;
    margin-bottom: 15px;
  }
  
  .pagination {
    justify-content: center;
    flex-wrap: wrap;
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
    margin: 5px 0;
  }
  
  .form-control-lg, .form-select-lg {
    font-size: 1rem;
    padding: 10px 15px;
  }
  
  .badge {
    font-size: 0.75rem;
    padding: 6px 10px;
  }
  
  .alert {
    padding: 12px 15px;
    font-size: 0.9rem;
  }
  
  .decoration-1, .decoration-2, .decoration-3, .decoration-4 {
    display: none;
  }
}

@media (max-width: 480px) {
  .pkkpr-header-section h2 {
    font-size: 1.5rem;
  }
  
  .pkkpr-header-section p {
    font-size: 0.9rem;
  }
  
  .search-container input {
    min-width: 180px !important;
  }
  
  .pkkpr-table-card h4 {
    font-size: 1.1rem;
  }
  
  .modern-table {
    font-size: 0.8rem;
  }
  
  .modern-table thead th {
    font-size: 0.75rem;
    padding: 8px 6px;
  }
  
  .modern-table tbody td {
    padding: 8px 6px;
  }
  
  /* Show only essential columns on extra small screens */
  .modern-table th:nth-child(1),
  .modern-table td:nth-child(1) {
    width: 60px;
  }
  
  .modern-table th:nth-child(4),
  .modern-table td:nth-child(4) {
    display: none;
  }
  
  .custom-modal {
    max-height: 95vh;
    margin: 5px;
    max-width: calc(100% - 10px);
  }
  
  .modal-header {
    padding: 12px 15px;
  }
  
  .modal-title {
    font-size: 1rem;
  }
  
  .modal-body {
    padding: 0.75rem;
    max-height: 50vh;
  }
  
  .modal-footer {
    padding: 0.75rem;
  }
}

@media (max-width: 360px) {
  .search-container input {
    min-width: 160px !important;
    padding: 10px 15px;
  }
  
  .glass-btn {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
  
  .pkkpr-table-card {
    padding: 15px 10px !important;
    margin: 0 5px;
  }
  
  .modern-table th:nth-child(3),
  .modern-table td:nth-child(3) {
    display: none;
  }
  
  .badge {
    font-size: 0.7rem;
    padding: 4px 8px;
  }
  
  .pagination .page-link {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
}

/* Fix for body modal open */
body.modal-open {
  overflow: hidden;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles for accessibility */
.btn:focus,
.form-control:focus,
.form-select:focus,
.page-link:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

.btn:focus-visible,
.form-control:focus-visible,
.form-select:focus-visible,
.page-link:focus-visible {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .glass-card-light {
    background: white;
    border: 2px solid #000;
  }
  
  .modern-table thead th {
    background: #000;
    color: white;
  }
  
  .btn {
    border: 2px solid #000;
  }
  
  .badge {
    border: 1px solid #000;
  }
}

/* Print styles */
@media print {
  .pkkpr-header-section {
    background: none !important;
    color: black !important;
  }
  
  .glass-btn,
  .action-btn,
  .modal-overlay,
  .decoration-1,
  .decoration-2,
  .decoration-3,
  .decoration-4 {
    display: none !important;
  }
  
  .pkkpr-table-card {
    box-shadow: none !important;
    border: 1px solid #000;
  }
  
  .modern-table thead th {
    background: #f0f0f0 !important;
    color: black !important;
  }
  
  .table-row-hover:hover {
    transform: none !important;
    box-shadow: none !important;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Selection styles */
::selection {
  background: rgba(52, 152, 219, 0.3);
  color: inherit;
}

::-moz-selection {
  background: rgba(52, 152, 219, 0.3);
  color: inherit;
}

/* Custom scrollbar for webkit browsers */
.table-responsive::-webkit-scrollbar {
  height: 6px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Loading state improvements */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: inherit;
}

.loading-text {
  margin-top: 20px;
  color: #6c757d;
  font-weight: 500;
}

/* Tooltip styles (if needed) */
.tooltip {
  position: absolute;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
}

.tooltip.show {
  opacity: 1;
  visibility: visible;
}

/* Error state improvements */
.error-state {
  text-align: center;
  padding: 40px 20px;
  color: #dc3545;
}

.error-state i {
  font-size: 3rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.error-state h4 {
  margin-bottom: 15px;
  color: #dc3545;
}

.error-state p {
  color: #6c757d;
  margin-bottom: 20px;
}

/* Success state improvements */
.success-state {
  text-align: center;
  padding: 40px 20px;
  color: #28a745;
}

.success-state i {
  font-size: 3rem;
  margin-bottom: 20px;
  opacity: 0.8;
}

/* Utility classes */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shadow-soft {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08) !important;
}

.shadow-strong {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
}

.border-radius-lg {
  border-radius: 15px !important;
}

.border-radius-xl {
  border-radius: 20px !important;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.gradient-text {
  background: linear-gradient(45deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Animation classes */
.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
}

.animate-slide-up {
  animation: slideUp 0.5s ease forwards;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.animate-pulse {
  animation: pulse-slow 2s ease-in-out infinite;
}

/* Hover effects */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.hover-glow {
  transition: all 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(52, 152, 219, 0.3);
}

/* Final responsive adjustments */
@media (max-width: 320px) {
  .pkkpr-header-section h2 {
    font-size: 1.3rem;
  }
  
  .search-container input {
    min-width: 140px !important;
    font-size: 0.8rem;
  }
  
  .glass-btn {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
  
  .modern-table {
    font-size: 0.75rem;
  }
  
  .badge {
    font-size: 0.65rem;
    padding: 3px 6px;
  }
  
  .btn {
    font-size: 0.8rem;
    padding: 8px 16px;
  }
  
  .modal-title {
    font-size: 0.9rem;
  }
  
  .form-label {
    font-size: 0.9rem;
  }
}
</style>