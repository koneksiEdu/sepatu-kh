<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding-top: 100px;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <!-- Card utama untuk reset password -->
          <div class="card border-0 shadow-lg rounded-4" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px);">
            <div class="card-body p-5">
              
              <!-- Loading State -->
              <div v-if="isLoading" class="text-center">
                <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <h3 class="fw-bold text-primary mb-2">Memproses Reset Password...</h3>
                <p class="text-muted">Mohon tunggu sebentar</p>
              </div>

              <!-- Reset Password Form -->
              <div v-else-if="resetStatus === null" class="text-center">
                <div class="mb-4">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-shield-lock text-primary" style="font-size: 2.5rem;"></i>
                  </div>
                </div>
                <h2 class="fw-bold text-primary mb-3">Reset Password</h2>
                <p class="text-muted mb-4">
                  Masukkan password baru untuk akun Anda
                </p>

                <form @submit.prevent="resetPassword" class="text-start">
                  <!-- Email Display -->
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Email</label>
                    <input 
                      type="email" 
                      class="form-control form-control-lg rounded-pill bg-light"
                      :value="email"
                      readonly
                      style="cursor: not-allowed;"
                    >
                  </div>

                  <!-- New Password -->
                  <div class="mb-3">
                    <label for="newPassword" class="form-label fw-semibold">Password Baru</label>
                    <div class="password-input-container">
                      <input 
                        id="newPassword"
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control form-control-lg rounded-pill password-input"
                        :class="{'is-invalid': passwordError}"
                        v-model="newPassword"
                        placeholder="Masukkan password baru"
                        required
                        minlength="6"
                        @input="validatePasswords"
                      >
                      <button 
                        type="button"
                        class="password-toggle-btn"
                        @click="showPassword = !showPassword"
                        tabindex="-1"
                      >
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" class="text-muted"></i>
                      </button>
                    </div>
                    <div v-if="passwordError" class="invalid-feedback d-block">
                      {{ passwordError }}
                    </div>
                    <small class="text-muted">Password minimal 6 karakter</small>
                  </div>

                  <!-- Confirm Password -->
                  <div class="mb-4">
                    <label for="confirmPassword" class="form-label fw-semibold">Konfirmasi Password Baru</label>
                    <div class="password-input-container">
                      <input 
                        id="confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="form-control form-control-lg rounded-pill password-input"
                        :class="{'is-invalid': confirmPasswordError}"
                        v-model="confirmPassword"
                        placeholder="Ulangi password baru"
                        required
                        @input="validatePasswords"
                      >
                      <button 
                        type="button"
                        class="password-toggle-btn"
                        @click="showConfirmPassword = !showConfirmPassword"
                        tabindex="-1"
                      >
                        <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" class="text-muted"></i>
                      </button>
                    </div>
                    <div v-if="confirmPasswordError" class="invalid-feedback d-block">
                      {{ confirmPasswordError }}
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <div class="d-grid gap-2 mb-3">
                    <button 
                      type="submit" 
                      class="btn btn-primary btn-lg rounded-pill fw-bold py-3"
                      :disabled="isProcessing || !canSubmit"
                    >
                      <i v-if="isProcessing" class="bi bi-arrow-clockwise me-2 spin"></i>
                      <i v-else class="bi bi-shield-check me-2"></i>
                      {{ isProcessing ? 'Memproses...' : 'Reset Password' }}
                    </button>
                  </div>

                  <!-- Back to Login -->
                  <div class="text-center">
                    <a href="/login" class="btn btn-outline-secondary rounded-pill">
                      <i class="bi bi-arrow-left me-2"></i>Kembali ke Halaman Login
                    </a>
                  </div>
                </form>
              </div>

              <!-- Success State -->
              <div v-else-if="resetStatus === 'success'" class="text-center">
                <div class="mb-4">
                  <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-check-circle-fill text-success" style="font-size: 2.5rem;"></i>
                  </div>
                </div>
                <h2 class="fw-bold text-success mb-3">Password Berhasil Direset!</h2>
                <p class="text-muted mb-4">
                  Password Anda telah berhasil diubah. 
                  Anda sekarang dapat masuk dengan password baru.
                </p>
                <div class="d-grid gap-2">
                  <a href="/login" class="btn btn-success btn-lg rounded-pill fw-bold py-3">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Masuk Sekarang
                  </a>
                  <a href="/" class="btn btn-outline-secondary rounded-pill">
                    <i class="bi bi-house me-2"></i>Kembali ke Beranda
                  </a>
                </div>
              </div>

              <!-- Error State -->
              <div v-else-if="resetStatus === 'error'" class="text-center">
                <div class="mb-4">
                  <div class="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-x-circle-fill text-danger" style="font-size: 2.5rem;"></i>
                  </div>
                </div>
                <h2 class="fw-bold text-danger mb-3">Reset Password Gagal</h2>
                <p class="text-muted mb-4">{{ errorMessage }}</p>
                
                <div class="d-grid gap-2">
                  <button 
                    @click="resetForm" 
                    class="btn btn-primary btn-lg rounded-pill fw-bold py-3"
                  >
                    <i class="bi bi-arrow-clockwise me-2"></i>Coba Lagi
                  </button>
                  
                  <a href="/forgot-password" class="btn btn-outline-secondary rounded-pill">
                    <i class="bi bi-envelope me-2"></i>Kirim Ulang Link Reset
                  </a>
                  
                  <a href="/login" class="btn btn-outline-secondary rounded-pill">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Kembali ke Login
                  </a>
                </div>
              </div>

              <!-- Expired State -->
              <div v-else-if="resetStatus === 'expired'" class="text-center">
                <div class="mb-4">
                  <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-clock-fill text-warning" style="font-size: 2.5rem;"></i>
                  </div>
                </div>
                <h2 class="fw-bold text-warning mb-3">Link Sudah Kedaluwarsa</h2>
                <p class="text-muted mb-4">
                  Link reset password Anda sudah kedaluwarsa. 
                  Silakan kirim ulang permintaan reset password untuk mendapatkan link baru.
                </p>
                
                <div class="d-grid gap-2">
                  <a href="/forgot-password" class="btn btn-primary btn-lg rounded-pill fw-bold py-3">
                    <i class="bi bi-envelope me-2"></i>Kirim Ulang Link Reset
                  </a>
                  
                  <a href="/login" class="btn btn-outline-secondary rounded-pill">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Kembali ke Login
                  </a>
                </div>
              </div>

            </div>
          </div>

          <!-- Info Card -->
          <div class="card border-0 shadow-sm rounded-4 my-4" style="background: rgba(255, 255, 255, 0.9);">
            <div class="card-body p-4">
              <div class="row align-items-center">
                <div class="col-auto">
                  <i class="bi bi-shield-check text-primary" style="font-size: 1.5rem;"></i>
                </div>
                <div class="col">
                  <h6 class="mb-1 fw-bold">Keamanan Terjamin</h6>
                  <p class="mb-0 text-muted small">
                    Password Anda akan dienkripsi dengan standar keamanan tinggi.
                  </p>
                </div>
              </div>
            </div>
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
const isLoading = ref(true)
const isProcessing = ref(false)
const resetStatus = ref(null) // null, 'success', 'error', 'expired'
const errorMessage = ref('')
const email = ref('')
const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordError = ref('')
const confirmPasswordError = ref('')
const toastEl = ref(null)

const toast = ref({
  type: 'success',
  message: ''
})

// Computed properties
const canSubmit = computed(() => {
  return newPassword.value.length >= 6 && 
         confirmPassword.value.length >= 6 && 
         newPassword.value === confirmPassword.value &&
         !passwordError.value &&
         !confirmPasswordError.value
})

// Methods
const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  email.value = urlParams.get('email') || ''
  token.value = urlParams.get('token') || ''
}

const validatePasswords = () => {
  passwordError.value = ''
  confirmPasswordError.value = ''

  if (newPassword.value && newPassword.value.length < 6) {
    passwordError.value = 'Password minimal 6 karakter'
  }

  if (confirmPassword.value && newPassword.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Konfirmasi password tidak cocok'
  }
}

const resetPassword = async () => {
  validatePasswords()
  
  if (!canSubmit.value) {
    showToast('error', 'Silakan lengkapi form dengan benar')
    return
  }

  isProcessing.value = true

  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        token: token.value,
        newPassword: newPassword.value
      }),
    })

    const data = await response.json()

    if (response.ok) {
      resetStatus.value = 'success'
      showToast('success', 'Password berhasil direset!')
    } else {
      if (response.status === 400 && data.message.includes('kedaluwarsa')) {
        resetStatus.value = 'expired'
      } else {
        resetStatus.value = 'error'
        errorMessage.value = data.message || 'Terjadi kesalahan saat reset password'
      }
    }
  } catch (error) {
    resetStatus.value = 'error'
    errorMessage.value = 'Terjadi kesalahan jaringan. Silakan coba lagi.'
  } finally {
    isProcessing.value = false
  }
}

const resetForm = () => {
  resetStatus.value = null
  newPassword.value = ''
  confirmPassword.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
  showPassword.value = false
  showConfirmPassword.value = false
}

const showToast = (type, message) => {
  toast.value = { type, message }
  if (toastEl.value) {
    const bsToast = new bootstrap.Toast(toastEl.value)
    bsToast.show()
  }
}

const validateInitialParams = () => {
  if (!email.value || !token.value) {
    resetStatus.value = 'error'
    errorMessage.value = 'Link reset password tidak valid atau parameter tidak lengkap'
    isLoading.value = false
    return false
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    resetStatus.value = 'error'
    errorMessage.value = 'Format email tidak valid'
    isLoading.value = false
    return false
  }

  return true
}

// Watch for password changes
watch([newPassword, confirmPassword], () => {
  if (newPassword.value || confirmPassword.value) {
    validatePasswords()
  }
}, { immediate: false })

// Lifecycle
onMounted(async() => {
  const isLoggedIn = await isAuthenticated()
  console.log(isLoggedIn)
  if (isLoggedIn) {
    window.location.href = '/'
  }
  getUrlParams()
  
  if (validateInitialParams()) {
    resetStatus.value = null
  }
  
  isLoading.value = false
})
</script>

<style scoped>
/* Password input container */
.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

/* Password input styling */
.password-input {
  padding-right: 3.5rem !important;
  width: 100%;
}

/* Password toggle button */
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

/* Button hover effects */
.btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3) !important;
}

.btn:active {
  transform: translateY(0) !important;
}

/* Card hover effect */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

/* Custom animation for success/error icons */
.bi-check-circle-fill,
.bi-x-circle-fill,
.bi-clock-fill,
.bi-shield-lock {
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

/* Spinning animation for loading */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Form control focus effects */
.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-control.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

/* Invalid feedback styling */
.invalid-feedback.d-block {
  display: block !important;
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

/* Loading spinner custom color */
.spinner-border {
  border-color: #007bff;
  border-right-color: transparent;
}

/* FIXED: Input field styling - menghapus CSS yang terlalu spesifik */
/* Input fields akan menggunakan default Bootstrap styling */
.form-control {
  color: #000 !important;
}

/* Placeholder styling yang lebih tepat */
.form-control::placeholder {
  color: #6c757d !important;
  opacity: 0.7;
}

/* Hanya override autofill untuk webkit */
.form-control:-webkit-autofill,
.form-control:-webkit-autofill:hover,
.form-control:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* Readonly input styling (untuk email field) */
.form-control[readonly] {
  background-color: #f8f9fa !important;
  color: #6c757d !important;
  cursor: not-allowed;
}
</style>