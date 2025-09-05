<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding-top: 100px;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <!-- Card utama untuk verifikasi email -->
          <div class="card border-0 shadow-lg rounded-4" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px);">
            <div class="card-body p-5">
              
              <!-- Loading State -->
              <div v-if="isLoading" class="text-center">
                <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <h3 class="fw-bold text-primary mb-2">Memverifikasi Email...</h3>
                <p class="text-muted">Mohon tunggu sebentar</p>
              </div>

              <!-- Success State -->
              <div v-else-if="verificationStatus === 'success'" class="text-center">
                <div class="mb-4">
                  <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-check-circle-fill text-success" style="font-size: 2.5rem;"></i>
                  </div>
                </div>
                <h2 class="fw-bold text-success mb-3">Email Berhasil Diverifikasi!</h2>
                <p class="text-muted mb-4">
                  Selamat! Akun Anda telah berhasil diverifikasi. 
                  Anda sekarang dapat masuk ke akun Anda.
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
              <div v-else-if="verificationStatus === 'error'" class="text-center">
                <div class="mb-4">
                  <div class="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-x-circle-fill text-danger" style="font-size: 2.5rem;"></i>
                  </div>
                </div>
                <h2 class="fw-bold text-danger mb-3">Verifikasi Gagal</h2>
                <p class="text-muted mb-4">{{ errorMessage }}</p>
                
                <div class="d-grid gap-2">
                  <!-- Tombol untuk kirim ulang email verifikasi -->
                  <button 
                    @click="resendVerification" 
                    class="btn btn-primary btn-lg rounded-pill fw-bold py-3"
                    :disabled="isResending"
                  >
                    <i class="bi bi-envelope me-2"></i>
                    {{ isResending ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi' }}
                  </button>
                  
                  <a href="/register" class="btn btn-outline-secondary rounded-pill">
                    <i class="bi bi-person-plus me-2"></i>Daftar Ulang
                  </a>
                  
                  <a href="/" class="btn btn-outline-secondary rounded-pill">
                    <i class="bi bi-house me-2"></i>Kembali ke Beranda
                  </a>
                </div>
              </div>

              <!-- Expired State -->
              <div v-else-if="verificationStatus === 'expired'" class="text-center">
                <div class="mb-4">
                  <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-clock-fill text-warning" style="font-size: 2.5rem;"></i>
                  </div>
                </div>
                <h2 class="fw-bold text-warning mb-3">Link Sudah Kedaluwarsa</h2>
                <p class="text-muted mb-4">
                  Link verifikasi email Anda sudah kedaluwarsa. 
                  Silakan kirim ulang email verifikasi untuk mendapatkan link baru.
                </p>
                
                <div class="d-grid gap-2">
                  <button 
                    @click="resendVerification" 
                    class="btn btn-primary btn-lg rounded-pill fw-bold py-3"
                    :disabled="isResending"
                  >
                    <i class="bi bi-envelope me-2"></i>
                    {{ isResending ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi' }}
                  </button>
                  
                  <a href="/login" class="btn btn-outline-secondary rounded-pill">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Coba Masuk
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
                  <i class="bi bi-info-circle text-primary" style="font-size: 1.5rem;"></i>
                </div>
                <div class="col">
                  <h6 class="mb-1 fw-bold">Butuh Bantuan?</h6>
                  <p class="mb-0 text-muted small">
                    Jika Anda mengalami masalah dengan verifikasi email, silakan hubungi tim support kami.
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
import { ref, onMounted } from 'vue'
import { isAuthenticated } from '../../lib/auth-utils'

// Reactive data
const isLoading = ref(true)
const verificationStatus = ref(null) // 'success', 'error', 'expired'
const errorMessage = ref('')
const isResending = ref(false)
const email = ref('')
const token = ref('')
const toastEl = ref(null)

const toast = ref({
  type: 'success',
  message: ''
})

// Methods
const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  email.value = urlParams.get('email') || ''
  token.value = urlParams.get('token') || ''
}

const verifyEmail = async () => {
  if (!email.value || !token.value) {
    verificationStatus.value = 'error'
    errorMessage.value = 'Parameter email atau token tidak valid'
    isLoading.value = false
    return
  }

  try {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        token: token.value
      }),
    })

    const data = await response.json()

    if (response.ok) {
      verificationStatus.value = 'success'
    } else {
      verificationStatus.value = response.status === 410 ? 'expired' : 'error'
      errorMessage.value = data.message || 'Terjadi kesalahan saat verifikasi'
    }
  } catch (error) {
    verificationStatus.value = 'error'
    errorMessage.value = 'Terjadi kesalahan jaringan. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}

const resendVerification = async () => {
  if (!email.value) {
    showToast('error', 'Email tidak ditemukan')
    return
  }

  isResending.value = true

  try {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value
      }),
    })

    const data = await response.json()

    if (response.ok) {
      showToast('success', 'Email verifikasi berhasil dikirim ulang! Silakan cek email Anda.')
    } else {
      showToast('error', data.message || 'Gagal mengirim email verifikasi')
    }
  } catch (error) {
    showToast('error', 'Terjadi kesalahan. Silakan coba lagi.')
  } finally {
    isResending.value = false
  }
}

const showToast = (type, message) => {
  toast.value = { type, message }
  if (toastEl.value) {
    const bsToast = new bootstrap.Toast(toastEl.value)
    bsToast.show()
  }
}

// Lifecycle
onMounted( async () => {
  const isLoggedIn = await isAuthenticated()
  if (isLoggedIn) {
    window.location.href = '/'
  }
  getUrlParams()
  verifyEmail()
})
</script>

<style scoped>
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
.bi-clock-fill {
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 2rem !important;
  }
  
  .container {
    padding: 1rem;
  }
}

/* Loading spinner custom color */
.spinner-border {
  border-color: #007bff;
  border-right-color: transparent;
}
</style>