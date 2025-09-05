<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding-top: 100px;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <!-- Card utama untuk form daftar -->
          <div class="card border-0 shadow-lg rounded-4 mb-4" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px);">
            <div class="card-body p-5">
              
              <!-- Success Registration State -->
              <div v-if="registrationSuccess" class="text-center">
                <div class="mb-4">
                  <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-check-circle-fill text-success" style="font-size: 2.5rem;"></i>
                  </div>
                </div>
                <h2 class="fw-bold text-success mb-3">Pendaftaran Berhasil!</h2>
                <p class="text-muted mb-4">
                  Akun Anda telah berhasil dibuat. Kami telah mengirim email verifikasi ke 
                  <strong>{{ registeredEmail }}</strong>. 
                  Silakan cek inbox dan folder spam Anda.
                </p>
                
                <div class="alert alert-info border-0 rounded-3 mb-4" style="background: rgba(13, 202, 240, 0.1);">
                  <i class="bi bi-info-circle me-2"></i>
                  <small>Anda perlu memverifikasi email sebelum dapat masuk ke akun.</small>
                </div>

                <div class="d-grid gap-2">
                  <button 
                    @click="resendVerification" 
                    class="btn btn-outline-primary btn-lg rounded-pill fw-bold py-3"
                    :disabled="isResending"
                  >
                    <i class="bi bi-envelope me-2"></i>
                    {{ isResending ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi' }}
                  </button>
                  
                  <a href="/login" class="btn btn-primary rounded-pill">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Ke Halaman Login
                  </a>
                  
                  <button 
                    @click="resetForm" 
                    class="btn btn-outline-secondary rounded-pill"
                  >
                    <i class="bi bi-person-plus me-2"></i>Daftar Akun Lain
                  </button>
                </div>
              </div>

              <!-- Registration Form -->
              <div v-else>
                <!-- Header -->
                <div class="text-center mb-4">
                  <h2 class="fw-bold text-gradient mb-2" style="background: linear-gradient(45deg, #007bff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    Daftar Akun
                  </h2>
                  <p class="text-muted">Bergabunglah dengan SEPATU KH</p>
                </div>

                <!-- Form Daftar -->
                <form @submit.prevent="handleSubmit">
                  <!-- Nama Lengkap -->
                  <div class="mb-3">
                    <label for="fullName" class="form-label fw-semibold">
                      <i class="bi bi-person me-2"></i>Nama Lengkap
                    </label>
                    <input 
                      type="text" 
                      class="form-control form-control-lg border-0 rounded-pill px-4 py-3" 
                      id="fullName" 
                      v-model="formData.fullName"
                      placeholder="Masukkan nama lengkap"
                      required
                      :disabled="isSubmitting"
                      style="background: rgba(0, 123, 255, 0.05); transition: all 0.3s ease;"
                    >
                  </div>

                  <!-- Email -->
                  <div class="mb-3">
                    <label for="email" class="form-label fw-semibold">
                      <i class="bi bi-envelope me-2"></i>Email
                    </label>
                    <input 
                      type="email" 
                      class="form-control form-control-lg border-0 rounded-pill px-4 py-3" 
                      id="email" 
                      v-model="formData.email"
                      placeholder="nama@email.com"
                      required
                      :disabled="isSubmitting"
                      style="background: rgba(0, 123, 255, 0.05); transition: all 0.3s ease;"
                    >
                  </div>

                  <!-- Deskripsi -->
                  <div class="mb-3">
                    <label for="description" class="form-label fw-semibold">
                      <i class="bi bi-card-text me-2"></i>
                      Ceritakan Diri Anda
                    </label>
                    <textarea 
                      id="description"
                      class="form-control form-control-lg border-0 rounded-4 px-4 py-3"
                      v-model="formData.description"
                      placeholder="Ceritakan secara singkat siapa Anda dan apa tujuan Anda menggunakan layanan ini..."
                      rows="4"
                      :disabled="isSubmitting"
                      style="background: rgba(0, 123, 255, 0.05); transition: all 0.3s ease; resize: none;"
                    ></textarea>
                    <small class="text-muted">
                      Contoh: Saya Sada dari Dinas PUPR Bidang Tata Ruang, ingin mengakses data untuk keperluan cek dan verifikasi dokumen.
                    </small>
                  </div>

                  <!-- Password -->
                  <div class="mb-3">
                    <label for="password" class="form-label fw-semibold">
                      <i class="bi bi-lock me-2"></i>Password
                    </label>
                    <div class="password-input-container">
                      <input 
                        :type="showPassword ? 'text' : 'password'" 
                        class="form-control form-control-lg border-0 rounded-pill password-input" 
                        id="password" 
                        v-model="formData.password"
                        placeholder="Masukkan password"
                        required
                        :disabled="isSubmitting"
                        style="background: rgba(0, 123, 255, 0.05); transition: all 0.3s ease;"
                      >
                      <button 
                        type="button" 
                        class="password-toggle-btn"
                        @click="showPassword = !showPassword"
                        :disabled="isSubmitting"
                      >
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" class="text-muted"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Konfirmasi Password -->
                  <div class="mb-4">
                    <label for="confirmPassword" class="form-label fw-semibold">
                      <i class="bi bi-lock-fill me-2"></i>Konfirmasi Password
                    </label>
                    <div class="password-input-container">
                      <input 
                        :type="showConfirmPassword ? 'text' : 'password'" 
                        class="form-control form-control-lg border-0 rounded-pill password-input" 
                        id="confirmPassword" 
                        v-model="formData.confirmPassword"
                        placeholder="Ulangi password"
                        required
                        :disabled="isSubmitting"
                        style="background: rgba(0, 123, 255, 0.05); transition: all 0.3s ease;"
                      >
                      <button 
                        type="button" 
                        class="password-toggle-btn"
                        @click="showConfirmPassword = !showConfirmPassword"
                        :disabled="isSubmitting"
                      >
                        <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" class="text-muted"></i>
                      </button>
                    </div>
                    <div v-if="formData.confirmPassword && formData.password !== formData.confirmPassword" class="text-danger mt-2 small">
                      <i class="bi bi-exclamation-circle me-1"></i>Password tidak cocok
                    </div>
                  </div>

                  <!-- Checkbox Setuju -->
                  <div class="mb-4">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="agreeTerms" 
                        v-model="formData.agreeTerms"
                        required
                        :disabled="isSubmitting"
                      >
                      <label class="form-check-label" for="agreeTerms">
                        Saya setuju dengan <a href="#" class="text-primary text-decoration-none" @click="showTermsModal = true">Syarat & Ketentuan</a> dan <a href="#" class="text-primary text-decoration-none" @click="showPrivacyModal = true">Kebijakan Privasi</a>
                      </label>
                    </div>
                  </div>

                  <!-- Tombol Daftar -->
                  <button 
                    type="submit" 
                    class="btn btn-lg w-100 rounded-pill fw-bold py-3 mb-3 border-0"
                    :disabled="!isFormValid || isSubmitting"
                    style="background: linear-gradient(45deg, #007bff, #00d4ff); transition: all 0.3s ease; transform: translateY(0);"
                    :style="(isFormValid && !isSubmitting) ? 'opacity: 1' : 'opacity: 0.6'"
                  >
                    <div v-if="isSubmitting" class="d-flex align-items-center justify-content-center">
                      <div class="spinner-border spinner-border-sm me-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                      Mendaftarkan...
                    </div>
                    <div v-else>
                      <i class="bi bi-person-plus me-2"></i>Daftar Sekarang
                    </div>
                  </button>
                </form>

                <!-- Divider -->
                <div class="text-center mb-3">
                  <span class="text-muted">atau</span>
                </div>

                <!-- Link ke halaman login -->
                <div class="text-center">
                  <p class="mb-0 text-muted">
                    Sudah punya akun? 
                    <a href="/login" class="text-primary text-decoration-none fw-semibold">Masuk di sini</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Help Card -->
          <div v-if="registrationSuccess" class="card border-0 shadow-sm rounded-4 mt-4" style="background: rgba(255, 255, 255, 0.9);">
            <div class="card-body p-4">
              <div class="row align-items-center">
                <div class="col-auto">
                  <i class="bi bi-question-circle text-primary" style="font-size: 1.5rem;"></i>
                </div>
                <div class="col">
                  <h6 class="mb-1 fw-bold">Tidak menerima email?</h6>
                  <p class="mb-0 text-muted small">
                    Cek folder spam/junk. Email verifikasi mungkin masuk ke sana. 
                    Jika masih tidak ada, gunakan tombol "Kirim Ulang" di atas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Syarat & Ketentuan -->
    <div class="modal fade" id="termsModal" tabindex="-1" aria-labelledby="termsModalLabel" aria-hidden="true" ref="termsModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 rounded-4">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold" id="termsModalLabel">
              <i class="bi bi-file-text me-2"></i>Syarat & Ketentuan
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="text-muted">
              <h6 class="fw-bold text-dark">1. Penerimaan Syarat</h6>
              <p>Dengan menggunakan layanan SEPATU KH, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini.</p>
              
              <h6 class="fw-bold text-dark">2. Penggunaan Layanan</h6>
              <p>Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan sesuai dengan ketentuan yang berlaku.</p>
              
              <h6 class="fw-bold text-dark">3. Akun Pengguna</h6>
              <p>Anda bertanggung jawab untuk menjaga keamanan akun dan password Anda.</p>
              
              <h6 class="fw-bold text-dark">4. Kebijakan Penggunaan</h6>
              <p>Pengaksesan dan pemasukan data dapat dilakukan sesuai dengan kebijakan yang telah ditetapkan dimana otorisasi difasilitasi oleh admin web ini.</p>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-primary rounded-pill px-4" data-bs-dismiss="modal">Tutup</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Kebijakan Privasi -->
    <div class="modal fade" id="privacyModal" tabindex="-1" aria-labelledby="privacyModalLabel" aria-hidden="true" ref="privacyModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 rounded-4">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold" id="privacyModalLabel">
              <i class="bi bi-shield-check me-2"></i>Kebijakan Privasi
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="text-muted">
              <h6 class="fw-bold text-dark">Pengumpulan Data</h6>
              <p>Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama dan email.</p>
              
              <h6 class="fw-bold text-dark">Penggunaan Data</h6>
              <p>Data yang dikumpulkan digunakan untuk memberikan layanan terbaik dan komunikasi dengan <em>stackholder</em> kami.</p>
              
              <h6 class="fw-bold text-dark">Keamanan Data</h6>
              <p>Kami berkomitmen untuk melindungi data pribadi Anda dengan sistem keamanan yang terpercaya.</p>
              
              <h6 class="fw-bold text-dark">Hak Pengguna</h6>
              <p>Anda memiliki hak untuk mengakses, memperbarui, atau menghapus data pribadi Anda.</p>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-primary rounded-pill px-4" data-bs-dismiss="modal">Tutup</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast untuk notifikasi -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055;">
      <div class="toast border-0 rounded-3" :class="toast.type === 'success' ? 'bg-success' : 'bg-danger'" role="alert" aria-live="assertive" aria-atomic="true" ref="toastEl">
        <div class="toast-body text-white d-flex align-items-center">
          <i :class="toast.type === 'success' ? 'bi bi-check-circle' : 'bi bi-exclamation-circle'" class="me-2"></i>
          {{ toast.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { isAuthenticated } from '../../lib/auth-utils'

// Reactive data
const formData = ref({
  fullName: '',
  description: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)
const toastEl = ref(null)
const termsModal = ref(null)
const privacyModal = ref(null)

// Registration states
const registrationSuccess = ref(false)
const registeredEmail = ref('')
const isSubmitting = ref(false)
const isResending = ref(false)

const toast = ref({
  type: 'success',
  message: ''
})

// Computed
const isFormValid = computed(() => {
  return formData.value.fullName && 
         formData.value.email && 
         formData.value.password &&
         formData.value.description && 
         formData.value.confirmPassword && 
         formData.value.password === formData.value.confirmPassword &&
         formData.value.agreeTerms
})

// Methods
const handleSubmit = async () => {
  if (!isFormValid.value || isSubmitting.value) return

  isSubmitting.value = true

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.value.fullName.trim(),
        email: formData.value.email.toLowerCase().trim(),
        description: formData.value.description.trim(),
        password: formData.value.password
      }),
    });

    if (response.ok) {
      // Set registration success state
      registrationSuccess.value = true
      registeredEmail.value = formData.value.email.toLowerCase().trim()
      
      showToast('success', 'Akun berhasil dibuat! Email verifikasi telah dikirim.')
    
      // Clear sensitive form data
      formData.value.password = ''
      formData.value.confirmPassword = ''
    } else {
      const error = await response.json();
      const errorMessage = error.message || 'Registrasi gagal, coba kembali';
      showToast('error', errorMessage)
    }
    
  } catch (error) {
    console.error('Registration error:', error)
    showToast('error', 'Terjadi kesalahan. Silakan coba lagi.')
  } finally {
    isSubmitting.value = false
  }
}

const resendVerification = async () => {
  if (!registeredEmail.value || isResending.value) return

  isResending.value = true

  try {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: registeredEmail.value
      }),
    })

    const data = await response.json()

    if (response.ok) {
      showToast('success', 'Email verifikasi berhasil dikirim ulang! Silakan cek email Anda.')
    } else if (response.status === 429) {
      showToast('error', data.message || 'Terlalu banyak permintaan. Silakan tunggu sebentar.')
    } else {
      showToast('error', data.message || 'Gagal mengirim email verifikasi')
    }
  } catch (error) {
    console.error('Resend verification error:', error)
    showToast('error', 'Terjadi kesalahan. Silakan coba lagi.')
  } finally {
    isResending.value = false
  }
}

const resetForm = () => {
  // Reset all states
  registrationSuccess.value = false
  registeredEmail.value = ''
  formData.value = {
    fullName: '',
    description: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  }
  isSubmitting.value = false
  isResending.value = false
}

const showToast = (type, message) => {
  toast.value = { type, message }
  if (toastEl.value) {
    const bsToast = new bootstrap.Toast(toastEl.value)
    bsToast.show()
  }
}

// Watchers
watch(showTermsModal, (newVal) => {
  if (newVal && termsModal.value) {
    const modal = new bootstrap.Modal(termsModal.value)
    modal.show()
    showTermsModal.value = false
  }
})

watch(showPrivacyModal, (newVal) => {
  if (newVal && privacyModal.value) {
    const modal = new bootstrap.Modal(privacyModal.value)
    modal.show()
    showPrivacyModal.value = false
  }
})

onMounted( async() => {
  const loggedIn = await isAuthenticated();
  if (loggedIn) {
    window.location.href = '/'; // Redirect ke beranda
  }
})
</script>

<style scoped>
/* Password input container - FIXED LAYOUT */
.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

/* Password input styling - FIXED PADDING */
.password-input {
  padding-right: 3.5rem !important;
  width: 100%;
}

/* Password toggle button - FIXED POSITIONING */
.password-toggle-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.password-toggle-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.password-toggle-btn:focus {
  outline: none;
  box-shadow: none;
  background-color: rgba(0, 0, 0, 0.1);
}

.password-toggle-btn i {
  font-size: 1.1rem;
  color: #6c757d;
}

/* PERBAIKAN UTAMA - Warna teks input menjadi hitam dan styling lebih baik */
.form-control {
  color: #212529 !important; /* Warna teks hitam */
  font-weight: 500 !important;
}

.form-control::placeholder {
  color: #6c757d !important; /* Warna placeholder abu-abu */
  font-weight: 400 !important;
}

/* Custom input focus effects */
.form-control:focus {
  background: rgba(0, 123, 255, 0.08) !important;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25) !important;
  border-color: transparent !important;
  color: #212529 !important; /* Pastikan warna teks tetap hitam saat focus */
}

/* Styling untuk form disabled */
.form-control:disabled {
  background: rgba(0, 0, 0, 0.05) !important;
  color: #6c757d !important;
}

/* Button hover effects - TIDAK MEMPENGARUHI PASSWORD TOGGLE */
.btn:not(.password-toggle-btn):hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3) !important;
}

.btn:not(.password-toggle-btn):active {
  transform: translateY(0) !important;
}

/* Button disabled state */
.btn:disabled {
  transform: none !important;
  box-shadow: none !important;
}

/* Link hover effects */
a:hover {
  text-decoration: underline !important;
}

/* Card hover effect */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

/* Success state animations */
.bi-check-circle-fill {
  animation: bounceIn 0.6s ease-in-out;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Modal backdrop */
.modal-backdrop {
  backdrop-filter: blur(5px);
}

/* Custom scrollbar untuk modal */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 3px;
}

/* Loading state */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 2rem !important;
  }
  
  .container {
    padding: 1rem;
  }
  
  .password-toggle-btn {
    right: 8px;
    padding: 6px;
  }
}

/* Form disabled state */
.form-check-input:disabled {
  opacity: 0.6;
}

/* Password strength indicator bisa ditambahkan di sini */
.password-strength {
  height: 4px;
  border-radius: 2px;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
}

.strength-weak { background: #dc3545; width: 33%; }
.strength-medium { background: #ffc107; width: 66%; }
.strength-strong { background: #28a745; width: 100%; }
</style>