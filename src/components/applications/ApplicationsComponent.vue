<template>
  <div class="applications-management">
    <!-- Header Section -->
    <section class="app-header-section mt-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 text-center mb-4">
            <h2 class="h2 fw-bold mb-3 text-white">
              <i class="bi bi-file-earmark-text me-3"></i>
              Detail Permohonan PKKPR
            </h2>
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
    <section class="app-content-section">
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

        <!-- Tabs Navigation -->
        <div class="tabs-container glass-card-light rounded-4 mb-4 shadow-lg">
          <ul class="nav nav-tabs modern-tabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                :class="{ active: activeTab === 'applications' }"
                @click="activeTab = 'applications'"
                type="button"
              >
                <i class="bi bi-file-earmark-text me-2"></i>
                Permohonan
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                :class="{ active: activeTab === 'verification' }"
                @click="activeTab = 'verification'"
                type="button"
              >
                <i class="bi bi-check-circle me-2"></i>
                Verifikasi Lapangan
              </button>
            </li>
          </ul>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Applications Tab -->
          <div v-if="activeTab === 'applications'" class="tab-pane active">
            <div class="app-table-card glass-card-light rounded-4 p-4 shadow-lg">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="fw-bold mb-0">
                  <i class="bi bi-file-earmark-text me-2 text-primary"></i>
                  Data Permohonan
                </h4>
              </div>

              <!-- Loading State -->
              <div v-if="loadingApplications" class="text-center py-5">
                <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted fw-medium">Memuat data permohonan...</p>
              </div>

              <!-- Applications Table -->
              <div v-else class="table-responsive">
                <table class="table table-hover modern-table">
                  <thead>
                    <tr>
                      <th class="fw-bold">Nama</th>
                      <th class="fw-bold">Telepon</th>
                      <th class="fw-bold">Bertindak Sebagai</th>
                      <th class="fw-bold">Lokasi</th>
                      <th class="fw-bold">Luas Lahan</th>
                      <th v-if="userRole === 'admin'" class="fw-bold text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="applications.length === 0">
                      <td :colspan="userRole === 'admin' ? 7 : 6" class="text-center py-5">
                        <i class="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
                        <p class="text-muted mb-0">Tidak ada data permohonan yang tersedia</p>
                      </td>
                    </tr>
                    <tr v-else v-for="app in applications" :key="app.id" class="table-row-hover">
                      <td>
                        <div class="fw-semibold">{{ app.name || '-' }}</div>
                      </td>
                      <td>{{ app.phone || '-' }}</td>
                      <td>{{ app.actAs || '-' }}</td>
                      <td>{{ app.location || '-' }}</td>
                      <td>
                        <span v-if="app.landArea" class="badge bg-info bg-opacity-10 text-info rounded-pill px-3 py-2">
                          {{ app.landArea }} m²
                        </span>
                        <span v-else class="text-muted">-</span>
                      </td>
                      <td v-if="userRole === 'admin'" class="text-center">
                        <div class="btn-group" role="group">
                          <button class="btn btn-sm btn-outline-warning rounded-pill me-2 action-btn" @click="openEditApplicationModal(app)">
                            <i class="bi bi-pencil-square"></i>
                            Edit
                          </button>
                          <button class="btn btn-sm btn-outline-danger rounded-pill action-btn" @click="deleteApplication(app.id)">
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

            <div class="app-table-card glass-card-light mt-4 rounded-4 p-4 shadow-lg">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="fw-bold mb-0">
                  <i class="bi bi-geo-alt me-2 text-primary"></i>
                  Data Batas Tanah
                </h4>
              </div>

              <!-- Loading State -->
              <div v-if="loadingApplications" class="text-center py-5">
                <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted fw-medium">Memuat data batas tanah...</p>
              </div>

              <!-- Applications Table -->
              <div v-else class="table-responsive">
                <table class="table table-hover modern-table">
                  <thead>
                    <tr>
                      <th class="fw-bold">Utara</th>
                      <th class="fw-bold">Timur</th>
                      <th class="fw-bold">Selatan</th>
                      <th class="fw-bold">Barat</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="applications.length === 0">
                      <td :colspan="userRole === 'admin' ? 7 : 6" class="text-center py-5">
                        <i class="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
                        <p class="text-muted mb-0">Tidak ada data batas tanah yang tersedia</p>
                      </td>
                    </tr>
                    <tr v-else v-for="app in applications" :key="app.id" class="table-row-hover">
                      <td>{{ app.north || '-' }}</td>
                      <td>{{ app.east || '-' }}</td>
                      <td>{{ app.south || '-' }}</td>
                      <td>{{ app.west || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Field Verification Tab -->
          <div v-if="activeTab === 'verification'" class="tab-pane active">
            <!-- Field Verification Info -->
            <div class="verification-info-card glass-card-light rounded-4 p-4 shadow-lg mb-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="fw-bold mb-0">
                  <i class="bi bi-check-circle me-2 text-primary"></i>
                  Informasi Verifikasi Lapangan
                </h4>
                <div v-if="userRole === 'admin' && !fieldVerification" class="verification-actions">
                  <button class="btn btn-success btn-lg px-4 py-3 rounded-pill glass-btn" @click="openAddVerificationModal">
                    <i class="bi bi-plus-circle me-2"></i>
                    Buat Verifikasi
                  </button>
                </div>
              </div>

              <!-- Loading State for Verification -->
              <div v-if="loadingVerification" class="text-center py-5">
                <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted fw-medium">Memuat data verifikasi...</p>
              </div>

              <!-- Verification Data -->
              <div v-else-if="fieldVerification" class="verification-data">
                <div class="row">
                  <div class="col-md-6">
                    <div class="info-item mb-3">
                      <label class="fw-bold text-muted">Status Verifikasi:</label>
                      <div>
                        <span v-if="fieldVerification.isVerified" class="badge bg-success rounded-pill px-3 py-2">
                          <i class="bi bi-check-circle me-1"></i>
                          Terverifikasi
                        </span>
                        <span v-else class="badge bg-warning rounded-pill px-3 py-2">
                          <i class="bi bi-clock me-1"></i>
                          Belum Verifikasi
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item mb-3">
                      <label class="fw-bold text-muted">Tanggal Verifikasi:</label>
                      <div>{{ fieldVerification.verifiedAt || 'Belum diverifikasi' }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item mb-3">
                      <label class="fw-bold text-muted">Koordinat Latitude:</label>
                      <div>{{ fieldVerification.latitude || '-' }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item mb-3">
                      <label class="fw-bold text-muted">Koordinat Longitude:</label>
                      <div>{{ fieldVerification.longitude || '-' }}</div>
                    </div>
                  </div>
                </div>
                
                <div v-if="userRole === 'admin'" class="mt-3">
                  <button class="btn btn-warning rounded-pill me-2" @click="openEditVerificationModal">
                    <i class="bi bi-pencil-square me-2"></i>
                    Edit Verifikasi
                  </button>
                </div>
              </div>

              <!-- No Verification Data -->
              <div v-else class="text-center py-5">
                <i class="bi bi-exclamation-circle display-4 text-muted mb-3 d-block"></i>
                <p class="text-muted mb-0">Belum ada data verifikasi lapangan</p>
                <small v-if="userRole === 'admin'" class="text-muted">Silakan buat verifikasi baru dengan tombol di atas</small>
              </div>
            </div>

            <!-- Team Verification -->
            <div v-if="fieldVerification" class="team-verification-card glass-card-light rounded-4 p-4 shadow-lg">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="fw-bold mb-0">
                  <i class="bi bi-people me-2 text-primary"></i>
                  Tim Verifikasi Lapangan
                </h4>
                <div v-if="userRole === 'admin'" class="team-actions">
                  <button class="btn btn-success rounded-pill" @click="openAddTeamModal">
                    <i class="bi bi-person-plus me-2"></i>
                    Tambah Anggota
                  </button>
                </div>
              </div>

              <!-- Loading State for Team -->
              <div v-if="loadingTeam" class="text-center py-5">
                <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted fw-medium">Memuat data tim...</p>
              </div>

              <!-- Team Table -->
              <div v-else class="table-responsive">
                <table class="table table-hover modern-table">
                  <thead>
                    <tr>
                      <th class="fw-bold">Nama Staff</th>
                      <th class="fw-bold">Jabatan</th>
                      <th v-if="userRole === 'admin'" class="fw-bold text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="verificationTeam.length === 0">
                      <td :colspan="userRole === 'admin' ? 4 : 3" class="text-center py-5">
                        <i class="bi bi-person-x display-4 text-muted mb-3 d-block"></i>
                        <p class="text-muted mb-0">Belum ada anggota tim verifikasi</p>
                        <small v-if="userRole === 'admin'" class="text-muted">Silakan tambah anggota tim dengan tombol di atas</small>
                      </td>
                    </tr>
                    <tr v-else v-for="member in verificationTeam" :key="member.id" class="table-row-hover">
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="staff-avatar me-3">
                            <i class="bi bi-person-circle text-primary fs-4"></i>
                          </div>
                          <div class="fw-semibold">{{ member.staffName || '-' }}</div>
                        </div>
                      </td>
                      <td>{{ member.staffPosition || '-' }}</td>
                      <td v-if="userRole === 'admin'" class="text-center">
                        <button class="btn btn-sm btn-outline-danger rounded-pill action-btn" @click="removeTeamMember(member.id)">
                          <i class="bi bi-person-dash"></i>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Application Modal -->
    <div v-if="showApplicationModal" class="custom-modal-overlay" @click="closeApplicationModal">
      <div class="custom-modal application-modal" @click.stop>
        <div class="modal-header" :class="isEditApplication ? 'bg-warning' : 'bg-success'">
          <h5 class="modal-title text-white fw-bold">
            <i :class="isEditApplication ? 'bi bi-pencil-square' : 'bi bi-plus-circle'" class="me-2"></i>
            {{ isEditApplication ? "Edit Permohonan" : "Tambah Permohonan Baru" }}
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="closeApplicationModal"></button>
        </div>
        
        <div class="modal-body p-4">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label fw-semibold">Nama <span class="text-danger">*</span></label>
                <input v-model="newApplication.name" class="form-control form-control-lg rounded-pill" placeholder="Nama lengkap pemohon" required />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label fw-semibold">Telepon</label>
                <input v-model="newApplication.phone" class="form-control form-control-lg rounded-pill" placeholder="Nomor telepon" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label fw-semibold">Bertindak Sebagai</label>
                <input v-model="newApplication.actAs" class="form-control form-control-lg rounded-pill" placeholder="Pemilik/Kuasa/dll" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label fw-semibold">Luas Lahan (m²)</label>
                <input v-model.number="newApplication.landArea" type="number" step="0.01" class="form-control form-control-lg rounded-pill" placeholder="Luas lahan dalam m²" />
              </div>
            </div>
            <div class="col-12">
              <div class="mb-3">
                <label class="form-label fw-semibold">Lokasi</label>
                <textarea v-model="newApplication.location" class="form-control" rows="3" placeholder="Alamat/lokasi lahan"></textarea>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label fw-semibold">Batas Utara</label>
                <input v-model="newApplication.north" class="form-control form-control-lg rounded-pill" placeholder="Batas sebelah utara" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label fw-semibold">Batas Selatan</label>
                <input v-model="newApplication.south" class="form-control form-control-lg rounded-pill" placeholder="Batas sebelah selatan" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label fw-semibold">Batas Timur</label>
                <input v-model="newApplication.east" class="form-control form-control-lg rounded-pill" placeholder="Batas sebelah timur" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label fw-semibold">Batas Barat</label>
                <input v-model="newApplication.west" class="form-control form-control-lg rounded-pill" placeholder="Batas sebelah barat" />
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer p-4">
          <button class="btn btn-secondary btn-lg px-4 rounded-pill me-3" @click="closeApplicationModal">
            <i class="bi bi-x-circle me-2"></i>
            Batal
          </button>
          <button 
            class="btn btn-lg px-4 rounded-pill"
            :class="isEditApplication ? 'btn-warning' : 'btn-success'"
            @click="saveApplication" 
            :disabled="!newApplication.name || savingApplication"
          >
            <span v-if="savingApplication" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else :class="isEditApplication ? 'bi bi-check-square' : 'bi bi-save'" class="me-2"></i>
            {{ savingApplication ? 'Menyimpan...' : (isEditApplication ? "Update" : "Simpan") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Verification Modal -->
    <div v-if="showVerificationModal" class="custom-modal-overlay" @click="closeVerificationModal">
      <div class="custom-modal verification-modal" @click.stop>
        <div class="modal-header" :class="isEditVerification ? 'bg-warning' : 'bg-success'">
          <h5 class="modal-title text-white fw-bold">
            <i :class="isEditVerification ? 'bi bi-pencil-square' : 'bi bi-plus-circle'" class="me-2"></i>
            {{ isEditVerification ? "Edit Verifikasi" : "Buat Verifikasi Lapangan" }}
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="closeVerificationModal"></button>
        </div>
        
        <div class="modal-body p-4">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label fw-semibold">Status Verifikasi</label>
                <select v-model="newVerification.isVerified" class="form-select form-control-lg rounded-pill">
                  <option :value="false">Belum Verifikasi</option>
                  <option :value="true">Terverifikasi</option>
                </select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label fw-semibold">Tanggal Verifikasi</label>
                <input v-model="newVerification.verifiedAt" type="datetime-local" class="form-control form-control-lg rounded-pill" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label fw-semibold">Latitude</label>
                <input v-model.number="newVerification.latitude" type="number" step="any" class="form-control form-control-lg rounded-pill" placeholder="Koordinat latitude" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label fw-semibold">Longitude</label>
                <input v-model.number="newVerification.longitude" type="number" step="any" class="form-control form-control-lg rounded-pill" placeholder="Koordinat longitude" />
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer p-4">
          <button class="btn btn-secondary btn-lg px-4 rounded-pill me-3" @click="closeVerificationModal">
            <i class="bi bi-x-circle me-2"></i>
            Batal
          </button>
          <button 
            class="btn btn-lg px-4 rounded-pill"
            :class="isEditVerification ? 'btn-warning' : 'btn-success'"
            @click="saveVerification" 
            :disabled="savingVerification"
          >
            <span v-if="savingVerification" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else :class="isEditVerification ? 'bi bi-check-square' : 'bi bi-save'" class="me-2"></i>
            {{ savingVerification ? 'Menyimpan...' : (isEditVerification ? "Update" : "Simpan") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add Team Member Modal -->
    <div v-if="showTeamModal" class="custom-modal-overlay" @click="closeTeamModal">
      <div class="custom-modal team-modal" @click.stop>
        <div class="modal-header bg-success">
          <h5 class="modal-title text-white fw-bold">
            <i class="bi bi-person-plus me-2"></i>
            Tambah Anggota Tim
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="closeTeamModal"></button>
        </div>
        
        <div class="modal-body p-4">
          <div class="mb-3">
            <label class="form-label fw-semibold">Staff <span class="text-danger">*</span></label>
            <select v-model="newTeamMember.staffId" class="form-select form-control-lg rounded-pill" required>
              <option value="">Pilih Staff</option>
              <option v-for="staff in availableStaff" :key="staff.id" :value="staff.id">
                {{ staff.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="modal-footer p-4">
          <button class="btn btn-secondary btn-lg px-4 rounded-pill me-3" @click="closeTeamModal">
            <i class="bi bi-x-circle me-2"></i>
            Batal
          </button>
          <button 
            class="btn btn-success btn-lg px-4 rounded-pill"
            @click="saveTeamMember" 
            :disabled="!newTeamMember.staffId || savingTeam"
          >
            <span v-if="savingTeam" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else class="bi bi-person-plus me-2"></i>
            {{ savingTeam ? 'Menambahkan...' : 'Tambah Anggota' }}
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
          <p class="fw-semibold mb-2">{{ deleteType === 'application' ? 'Yakin ingin menghapus permohonan ini?' : 'Yakin ingin menghapus anggota tim ini?' }}</p>
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

interface Application {
  id: number;
  pkkprId: number;
  name: string | null;
  phone: string | null;
  actAs: string | null;
  location: string | null;
  landArea: number | null;
  north: string | null;
  south: string | null;
  east: string | null;
  west: string | null;
}

interface FieldVerification {
  id: number;
  pkkprId: number;
  isVerified: boolean;
  latitude: number | null;
  longitude: number | null;
  verifiedAt: string | null;
}

interface TeamMember {
  id: number;
  fieldVerificationId: number;
  staffId: number;
  role: string | null;
  staffName: string;
  staffPosition: string | null;
}

interface Staff {
  id: number;
  name: string;
  position: string | null;
}

// State variables
const activeTab = ref('applications');
const pkkprId = ref<number | null>(null);
const userRole = ref<string>('');
const token = ref('');

// Applications
const applications = ref<Application[]>([]);
const loadingApplications = ref(true);
const showApplicationModal = ref(false);
const isEditApplication = ref(false);
const savingApplication = ref(false);
const newApplication = ref<Application>({
  id: 0,
  pkkprId: 0,
  name: '',
  phone: '',
  actAs: '',
  location: '',
  landArea: null,
  north: '',
  south: '',
  east: '',
  west: ''
});

// Field Verification
const fieldVerification = ref<FieldVerification | null>(null);
const loadingVerification = ref(true);
const showVerificationModal = ref(false);
const isEditVerification = ref(false);
const savingVerification = ref(false);
const newVerification = ref<FieldVerification>({
  id: 0,
  pkkprId: 0,
  isVerified: false,
  latitude: null,
  longitude: null,
  verifiedAt: ''
});

// Team Verification
const verificationTeam = ref<TeamMember[]>([]);
const loadingTeam = ref(true);
const showTeamModal = ref(false);
const savingTeam = ref(false);
const newTeamMember = ref({
  staffId: '',
  role: ''
});

// Staff data for team selection
const availableStaff = ref<Staff[]>([]);

// Common state
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const showDeleteModal = ref(false);
const deleting = ref(false);
const deleteType = ref<'application' | 'team'>('application');
const itemToDelete = ref<number | null>(null);

// Get PKKPR ID from URL params
onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const pkkprParam = urlParams.get('pkkpr');
  
  if (!pkkprParam) {
    error.value = "PKKPR ID tidak ditemukan dalam URL";
    return;
  }
  
  pkkprId.value = parseInt(pkkprParam);
  
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "/login";
    return;
  }
  
  if (user.role === "guest") {
    window.location.href = "/";
    return;
  }
  
  userRole.value = user.role;
  token.value = localStorage.getItem("accessToken") || '';
  
  // Load initial data
  await Promise.all([
    fetchApplications(),
    fetchFieldVerification(),
    fetchStaff()
  ]);
});

// Applications functions
async function fetchApplications() {
  try {
    loadingApplications.value = true;
    error.value = null;
    
    const res = await fetch(`/api/applications?pkkprId=${pkkprId.value}`, {
      headers: {
        "Authorization": `Bearer ${token.value}`
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    applications.value = data;
  } catch (err) {
    console.error("❌ Error fetching applications:", err);
    error.value = `Gagal memuat data permohonan: ${err instanceof Error ? err.message : 'Unknown error'}`;
    applications.value = [];
  } finally {
    loadingApplications.value = false;
  }
}

async function saveApplication() {
  try {
    savingApplication.value = true;
    
    if (!newApplication.value.name?.trim()) {
      error.value = "Nama wajib diisi";
      return;
    }

    const method = isEditApplication.value ? "PUT" : "POST";
    const applicationData = { ...newApplication.value, pkkprId: pkkprId.value };
    
    const res = await fetch("/api/applications", {
      method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
      },
      body: JSON.stringify(applicationData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    
    await fetchApplications();
    closeApplicationModal();
    error.value = null;
    successMessage.value = isEditApplication.value ? 
      `Permohonan berhasil diupdate!` : 
      `Permohonan berhasil ditambahkan!`;
    
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
    
  } catch (err) {
    console.error("❌ Error saving application:", err);
    error.value = `Gagal menyimpan data: ${err instanceof Error ? err.message : 'Unknown error'}`;
  } finally {
    savingApplication.value = false;
  }
}

function openAddApplicationModal() {
  isEditApplication.value = false;
  newApplication.value = {
    id: 0,
    pkkprId: pkkprId.value || 0,
    name: '',
    phone: '',
    actAs: '',
    location: '',
    landArea: null,
    north: '',
    south: '',
    east: '',
    west: ''
  };
  showApplicationModal.value = true;
  error.value = null;
}

function openEditApplicationModal(app: Application) {
  isEditApplication.value = true;
  newApplication.value = { ...app };
  showApplicationModal.value = true;
  error.value = null;
}

function closeApplicationModal() {
  showApplicationModal.value = false;
  error.value = null;
}

function deleteApplication(id: number) {
  deleteType.value = 'application';
  itemToDelete.value = id;
  showDeleteModal.value = true;
}

// Field Verification functions
async function fetchFieldVerification() {
  try {
    loadingVerification.value = true;
    error.value = null;
    
    const res = await fetch(`/api/field-verification?pkkprId=${pkkprId.value}`, {
      headers: {
        "Authorization": `Bearer ${token.value}`
      }
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        fieldVerification.value = null;
        return;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    fieldVerification.value = data;
    
    // Fetch team if verification exists
    if (data) {
      await fetchVerificationTeam();
    }
  } catch (err) {
    console.error("❌ Error fetching field verification:", err);
    error.value = `Gagal memuat data verifikasi: ${err instanceof Error ? err.message : 'Unknown error'}`;
    fieldVerification.value = null;
  } finally {
    loadingVerification.value = false;
  }
}

async function saveVerification() {
  try {
    savingVerification.value = true;

    const method = isEditVerification.value ? "PUT" : "POST";
    const verificationData = { ...newVerification.value, pkkprId: pkkprId.value };
    
    const res = await fetch("/api/field-verification", {
      method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
      },
      body: JSON.stringify(verificationData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    
    await fetchFieldVerification();
    closeVerificationModal();
    error.value = null;
    successMessage.value = isEditVerification.value ? 
      `Verifikasi berhasil diupdate!` : 
      `Verifikasi berhasil dibuat!`;
    
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
    
  } catch (err) {
    console.error("❌ Error saving verification:", err);
    error.value = `Gagal menyimpan data verifikasi: ${err instanceof Error ? err.message : 'Unknown error'}`;
  } finally {
    savingVerification.value = false;
  }
}

function openAddVerificationModal() {
  isEditVerification.value = false;
  newVerification.value = {
    id: 0,
    pkkprId: pkkprId.value || 0,
    isVerified: false,
    latitude: null,
    longitude: null,
    verifiedAt: ''
  };
  showVerificationModal.value = true;
  error.value = null;
}

function openEditVerificationModal() {
  if (!fieldVerification.value) return;
  
  isEditVerification.value = true;
  newVerification.value = { ...fieldVerification.value };
  showVerificationModal.value = true;
  error.value = null;
}

function closeVerificationModal() {
  showVerificationModal.value = false;
  error.value = null;
}

// Team functions
async function fetchVerificationTeam() {
  if (!fieldVerification.value) return;
  
  try {
    loadingTeam.value = true;
    
    const res = await fetch(`/api/field-verification-team?fieldVerificationId=${fieldVerification.value.id}`, {
      headers: {
        "Authorization": `Bearer ${token.value}`
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    verificationTeam.value = data;
  } catch (err) {
    console.error("❌ Error fetching verification team:", err);
    error.value = `Gagal memuat data tim: ${err instanceof Error ? err.message : 'Unknown error'}`;
    verificationTeam.value = [];
  } finally {
    loadingTeam.value = false;
  }
}

async function fetchStaff() {
  try {
    const res = await fetch("/api/staff", {
      headers: {
        "Authorization": `Bearer ${token.value}`
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    availableStaff.value = data;
  } catch (err) {
    console.error("❌ Error fetching staff:", err);
    error.value = `Gagal memuat data staff: ${err instanceof Error ? err.message : 'Unknown error'}`;
    availableStaff.value = [];
  }
}

async function saveTeamMember() {
  try {
    savingTeam.value = true;
    
    if (!newTeamMember.value.staffId) {
      error.value = "Staff wajib dipilih";
      return;
    }

    if (!fieldVerification.value) {
      error.value = "Verifikasi lapangan belum dibuat";
      return;
    }

    const teamData = {
      fieldVerificationId: fieldVerification.value.id,
      staffId: parseInt(newTeamMember.value.staffId),
    };
    
    const res = await fetch("/api/field-verification-team", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
      },
      body: JSON.stringify(teamData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    
    await fetchVerificationTeam();
    closeTeamModal();
    error.value = null;
    successMessage.value = "Anggota tim berhasil ditambahkan!";
    
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
    
  } catch (err) {
    console.error("❌ Error saving team member:", err);
    error.value = `Gagal menambahkan anggota tim: ${err instanceof Error ? err.message : 'Unknown error'}`;
  } finally {
    savingTeam.value = false;
  }
}

function openAddTeamModal() {
  newTeamMember.value = {
    staffId: '',
    role: ''
  };
  showTeamModal.value = true;
  error.value = null;
}

function closeTeamModal() {
  showTeamModal.value = false;
  error.value = null;
}

function removeTeamMember(id: number) {
  deleteType.value = 'team';
  itemToDelete.value = id;
  showDeleteModal.value = true;
}

// Delete functions
async function confirmDelete() {
  if (!itemToDelete.value) return;
  
  try {
    deleting.value = true;
    
    let url = '';
    let body = {};
    
    if (deleteType.value === 'application') {
      url = '/api/applications';
      body = { id: itemToDelete.value };
    } else {
      url = '/api/field-verification-team';
      body = { id: itemToDelete.value };
    }
    
    const res = await fetch(url, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
      },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    
    if (deleteType.value === 'application') {
      await fetchApplications();
      successMessage.value = "Permohonan berhasil dihapus!";
    } else {
      await fetchVerificationTeam();
      successMessage.value = "Anggota tim berhasil dihapus!";
    }
    
    cancelDelete();
    error.value = null;
    
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
    
  } catch (err) {
    console.error("❌ Error deleting:", err);
    error.value = `Gagal menghapus data: ${err instanceof Error ? err.message : 'Unknown error'}`;
  } finally {
    deleting.value = false;
  }
}

function cancelDelete() {
  showDeleteModal.value = false;
  itemToDelete.value = null;
}
</script>

<style scoped>
/* Custom color classes */
.text-white-75 {
  color: rgba(255, 255, 255, 0.75) !important;
}

/* Header section */
.app-header-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  min-height: 40vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 60px 0;
}

.app-header-section::before {
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
.app-content-section {
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

/* Tabs styling */
.tabs-container {
  padding: 0;
  overflow: hidden;
}

.modern-tabs {
  border: none;
  margin: 0;
  background: none;
}

.modern-tabs .nav-link {
  border: none;
  background: none;
  color: #6c757d;
  padding: 20px 30px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border-radius: 0;
  position: relative;
}

.modern-tabs .nav-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.modern-tabs .nav-link.active {
  color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-bottom: 3px solid #667eea;
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

/* Info items */
.info-item label {
  font-size: 0.9rem;
  margin-bottom: 5px;
  display: block;
}

.info-item div {
  font-size: 1rem;
  color: #495057;
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
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
}

.application-modal {
  max-width: 900px;
}

.verification-modal,
.team-modal {
  max-width: 600px;
}

.modal-header {
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
.form-control,
.form-select {
  padding: 12px 20px;
  font-size: 1.1rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  color: #495057 !important;
  background-color: white !important;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  color: #495057 !important;
  background-color: white !important;
}

.form-control::placeholder {
  color: #6c757d !important;
  opacity: 0.8;
}

.form-control:disabled {
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
  .app-header-section {
    padding: 40px 0;
    min-height: 35vh;
  }
  
  .app-content-section {
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
  
  .modern-tabs .nav-link {
    padding: 15px 20px;
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .app-header-section {
    padding: 30px 0;
    min-height: 30vh;
  }
  
  .glass-btn {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .app-table-card,
  .verification-info-card,
  .team-verification-card {
    padding: 20px 15px !important;
  }
  
  .table-responsive {
    font-size: 0.85rem;
  }
  
  .modern-table thead th,
  .modern-table tbody td {
    padding: 10px 8px;
  }
  
  .modern-tabs .nav-link {
    padding: 12px 15px;
    font-size: 0.9rem;
  }
}
</style>