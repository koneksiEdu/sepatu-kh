<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding-top: 100px;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <!-- Card utama untuk form login -->
          <div class="card border-0 shadow-lg rounded-4 mb-4" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px);">
            <div class="card-body p-5">
              
              <!-- Login Success State -->
              <div v-if="loginSuccess" class="text-center">
                <div class="mb-4">
                  <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-check-circle-fill text-success" style="font-size: 2.5rem;"></i>
                  </div>
                </div>
                <h2 class="fw-bold text-success mb-3">Login Berhasil!</h2>
                <p class="text-muted mb-4">Selamat datang kembali! Anda akan diarahkan ke beranda dalam beberapa detik.</p>
                
                <div class="d-grid">
                  <a href="/" class="btn btn-primary btn-lg rounded-pill fw-bold py-3">
                    <i class="bi bi-house me-2"></i>Ke Beranda
                  </a>
                </div>
              </div>

              <!-- Password Reset Success State -->
              <div v-else-if="resetEmailSent" class="text-center">
                <div class="mb-4">
                  <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-envelope-check-fill text-info" style="font-size: 2.5rem;"></i>
                  </div>
                </div>
                <h2 class="fw-bold text-info mb-3">Email Reset Dikirim!</h2>
                <p class="text-muted mb-4">
                  Kami telah mengirim link reset password ke 
                  <strong>{{ resetEmail }}</strong>. 
                  Silakan cek inbox dan folder spam Anda.
                </p>
                
                <div class="alert alert-warning border-0 rounded-3 mb-4" style="background: rgba(255, 193, 7, 0.1);">
                  <i class="bi bi-clock me-2"></i>
                  <small>Link reset password akan expired dalam 1 jam.</small>
                </div>

                <div class="d-grid gap-2">
                  <button 
                    @click="resendResetEmail" 
                    class="btn btn-outline-info btn-lg rounded-pill fw-bold py-3"
                    :disabled="isResendingReset"
                  >
                    <i class="bi bi-envelope me-2"></i>
                    {{ isResendingReset ? 'Mengirim...' : 'Kirim Ulang Email Reset' }}
                  </button>
                  
                  <button 
                    @click="backToLogin" 
                    class="btn btn-outline-secondary rounded-pill"
                  >
                    <i class="bi bi-arrow-left me-2"></i>Kembali ke Login
                  </button>
                </div>
              </div>

              <!-- Login Form -->
              <div v-else-if="!showForgotPassword">
                <!-- Header -->
                <div class="text-center mb-4">
                  <h2 class="fw-bold text-gradient mb-2" style="background: linear-gradient(45deg, #007bff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    Masuk Akun
                  </h2>
                  <p class="text-muted">Selamat datang kembali di SEPATU KH</p>
                </div>

                <!-- Form Login -->
                <form @submit.prevent="handleLogin">
                  <!-- Email -->
                  <div class="mb-3">
                    <label for="email" class="form-label fw-semibold">
                      <i class="bi bi-envelope me-2"></i>Email
                    </label>
                    <input 
                      type="email" 
                      class="form-control form-control-lg border-0 rounded-pill px-4 py-3 custom-input" 
                      id="email" 
                      v-model="loginData.email"
                      placeholder="nama@email.com"
                      required
                      :disabled="isLoggingIn"
                      style="background: rgba(0, 123, 255, 0.05); transition: all 0.3s ease; color: #000 !important;"
                    >
                  </div>

                  <!-- Password -->
                  <div class="mb-4">
                    <label for="password" class="form-label fw-semibold">
                      <i class="bi bi-lock me-2"></i>Password
                    </label>
                    <div class="password-input-container">
                      <input 
                        :type="showPassword ? 'text' : 'password'" 
                        class="form-control form-control-lg border-0 rounded-pill password-input custom-input" 
                        id="password" 
                        v-model="loginData.password"
                        placeholder="Masukkan password"
                        required
                        :disabled="isLoggingIn"
                        style="background: rgba(0, 123, 255, 0.05); transition: all 0.3s ease; color: #000 !important;"
                      >
                      <button 
                        type="button" 
                        class="password-toggle-btn"
                        @click="showPassword = !showPassword"
                        :disabled="isLoggingIn"
                        tabindex="-1"
                      >
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" class="text-muted"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Forgot Password -->
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <button 
                      type="button" 
                      class="btn btn-link p-0 text-primary text-decoration-none fw-semibold"
                      @click="showForgotPassword = true"
                      :disabled="isLoggingIn"
                    >
                      Lupa password?
                    </button>
                  </div>

                  <!-- Tombol Login -->
                  <button 
                    type="submit" 
                    class="btn btn-lg w-100 rounded-pill fw-bold py-3 mb-3 border-0"
                    :disabled="!isLoginFormValid || isLoggingIn"
                    style="background: linear-gradient(45deg, #007bff, #00d4ff); transition: all 0.3s ease; transform: translateY(0);"
                    :style="(isLoginFormValid && !isLoggingIn) ? 'opacity: 1' : 'opacity: 0.6'"
                  >
                    <div v-if="isLoggingIn" class="d-flex align-items-center justify-content-center">
                      <div class="spinner-border spinner-border-sm me-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                      Masuk...
                    </div>
                    <div v-else>
                      <i class="bi bi-box-arrow-in-right me-2"></i>Masuk Sekarang
                    </div>
                  </button>
                </form>

                <!-- Divider -->
                <div class="text-center mb-3">
                  <span class="text-muted">atau</span>
                </div>

                <!-- Link ke halaman register -->
                <div class="text-center">
                  <p class="mb-0 text-muted">
                    Belum punya akun? 
                    <a href="/register" class="text-primary text-decoration-none fw-semibold">Daftar di sini</a>
                  </p>
                </div>
              </div>

              <!-- Forgot Password Form -->
              <div v-else>
                <!-- Header -->
                <div class="text-center mb-4">
                  <div class="mb-3">
                    <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                      <i class="bi bi-key text-warning" style="font-size: 1.5rem;"></i>
                    </div>
                  </div>
                  <h2 class="fw-bold text-gradient mb-2" style="background: linear-gradient(45deg, #ffc107, #ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    Lupa Password
                  </h2>
                  <p class="text-muted">Masukkan email Anda untuk reset password</p>
                </div>

                <!-- Form Reset Password -->
                <form @submit.prevent="handleForgotPassword">
                  <!-- Email -->
                  <div class="mb-4">
                    <label for="resetEmail" class="form-label fw-semibold">
                      <i class="bi bi-envelope me-2"></i>Email Terdaftar
                    </label>
                    <input 
                      type="email" 
                      class="form-control form-control-lg border-0 rounded-pill px-4 py-3 custom-input" 
                      id="resetEmail" 
                      v-model="forgotPasswordData.email"
                      placeholder="nama@email.com"
                      required
                      :disabled="isSendingReset"
                      style="background: rgba(255, 193, 7, 0.05); transition: all 0.3s ease; color: #000 !important;"
                    >
                  </div>

                  <!-- Tombol Kirim Reset -->
                  <button 
                    type="submit" 
                    class="btn btn-lg w-100 rounded-pill fw-bold py-3 mb-3 border-0"
                    :disabled="!forgotPasswordData.email || isSendingReset"
                    style="background: linear-gradient(45deg, #ffc107, #ff8c00); transition: all 0.3s ease;"
                    :style="(forgotPasswordData.email && !isSendingReset) ? 'opacity: 1' : 'opacity: 0.6'"
                  >
                    <div v-if="isSendingReset" class="d-flex align-items-center justify-content-center">
                      <div class="spinner-border spinner-border-sm me-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                      Mengirim...
                    </div>
                    <div v-else>
                      <i class="bi bi-envelope me-2"></i>Kirim Link Reset
                    </div>
                  </button>

                  <!-- Tombol Kembali -->
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary btn-lg w-100 rounded-pill fw-bold py-3"
                    @click="backToLogin"
                    :disabled="isSendingReset"
                  >
                    <i class="bi bi-arrow-left me-2"></i>Kembali ke Login
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Help Card untuk Forgot Password -->
          <div v-if="resetEmailSent" class="card border-0 shadow-sm rounded-4 mt-4" style="background: rgba(255, 255, 255, 0.9);">
            <div class="card-body p-4">
              <div class="row align-items-center">
                <div class="col-auto">
                  <i class="bi bi-question-circle text-info" style="font-size: 1.5rem;"></i>
                </div>
                <div class="col">
                  <h6 class="mb-1 fw-bold">Tidak menerima email reset?</h6>
                  <p class="mb-0 text-muted small">
                    Cek folder spam/junk. Email reset password mungkin masuk ke sana. 
                    Jika masih tidak ada, gunakan tombol "Kirim Ulang" di atas.
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
      <div class="toast border-0 rounded-3" :class="toast.type === 'success' ? 'bg-success' : toast.type === 'info' ? 'bg-info' : 'bg-danger'" role="alert" aria-live="assertive" aria-atomic="true" ref="toastEl">
        <div class="toast-body text-white d-flex align-items-center">
          <i :class="toast.type === 'success' ? 'bi bi-check-circle' : toast.type === 'info' ? 'bi bi-info-circle' : 'bi bi-exclamation-circle'" class="me-2"></i>
          {{ toast.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { isAuthenticated } from '../../lib/auth-utils'

// Reactive data
const loginData = ref({
  email: '',
  password: '',
})

const forgotPasswordData = ref({
  email: ''
})

const showPassword = ref(false)
const showForgotPassword = ref(false)
const toastEl = ref(null)

// Login states
const loginSuccess = ref(false)
const isLoggingIn = ref(false)

// Forgot password states
const resetEmailSent = ref(false)
const resetEmail = ref('')
const isSendingReset = ref(false)
const isResendingReset = ref(false)

const toast = ref({
  type: 'success',
  message: ''
})

// Computed
const isLoginFormValid = computed(() => {
  return loginData.value.email && loginData.value.password
})

// Methods
const handleLogin = async () => {
  if (!isLoginFormValid.value || isLoggingIn.value) return

  isLoggingIn.value = true

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginData.value.email.toLowerCase().trim(),
        password: loginData.value.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      // Set login success state
      loginSuccess.value = true
      showToast('success', 'Login berhasil! Selamat datang kembali.')
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    
    } else {
      const errorMessage = data.message || 'Login gagal, coba kembali';
      showToast('error', errorMessage)
    }
    
  } catch (error) {
    console.error('Login error:', error)
    showToast('error', 'Terjadi kesalahan. Silakan coba lagi.')
  } finally {
    isLoggingIn.value = false
  }
}

const handleForgotPassword = async () => {
  if (!forgotPasswordData.value.email || isSendingReset.value) return

  isSendingReset.value = true

  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: forgotPasswordData.value.email.toLowerCase().trim()
      }),
    })

    const data = await response.json()

    if (response.ok) {
      resetEmailSent.value = true
      resetEmail.value = forgotPasswordData.value.email.toLowerCase().trim()
      showToast('info', 'Link reset password berhasil dikirim ke email Anda!')
    } else if (response.status === 429) {
      showToast('error', data.message || 'Terlalu banyak permintaan. Silakan tunggu sebentar.')
    } else {
      showToast('error', data.message || 'Gagal mengirim email reset password')
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    showToast('error', 'Terjadi kesalahan. Silakan coba lagi.')
  } finally {
    isSendingReset.value = false
  }
}

const resendResetEmail = async () => {
  if (!resetEmail.value || isResendingReset.value) return

  isResendingReset.value = true

  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: resetEmail.value
      }),
    })

    const data = await response.json()

    if (response.ok) {
      showToast('info', 'Email reset password berhasil dikirim ulang!')
    } else if (response.status === 429) {
      showToast('error', data.message || 'Terlalu banyak permintaan. Silakan tunggu sebentar.')
    } else {
      showToast('error', data.message || 'Gagal mengirim ulang email reset password')
    }
  } catch (error) {
    console.error('Resend reset password error:', error)
    showToast('error', 'Terjadi kesalahan. Silakan coba lagi.')
  } finally {
    isResendingReset.value = false
  }
}

const backToLogin = () => {
  showForgotPassword.value = false
  resetEmailSent.value = false
  resetEmail.value = ''
  forgotPasswordData.value.email = ''
  isSendingReset.value = false
  isResendingReset.value = false
}

const showToast = (type, message) => {
  toast.value = { type, message }
  if (toastEl.value) {
    const bsToast = new bootstrap.Toast(toastEl.value)
    bsToast.show()
  }
}

onMounted( async () => {
  const loggedIn = await isAuthenticated();
  if (loggedIn) {
    window.location.href = '/'; // Redirect ke beranda
  }
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

/* Password toggle button - STYLING YANG DIPERBAIKI */
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

/* Custom input focus effects */
.form-control:focus {
  background: rgba(0, 123, 255, 0.1) !important;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25) !important;
  border-color: transparent !important;
  color: #000 !important;
}

/* Forgot password input focus */
input[id="resetEmail"]:focus {
  background: rgba(255, 193, 7, 0.1) !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25) !important;
  color: #000 !important;
}

/* Custom input styling to ensure text is always black */
.custom-input {
  color: #000 !important;
}

.custom-input::placeholder {
  color: #6c757d !important;
  font-weight: 400 !important;
}

/* Ensure autofill doesn't override text color */
.custom-input:-webkit-autofill,
.custom-input:-webkit-autofill:hover,
.custom-input:-webkit-autofill:focus,
.custom-input:-webkit-autofill:active {
  -webkit-text-fill-color: #000 !important;
  -webkit-box-shadow: 0 0 0 30px rgba(0, 123, 255, 0.05) inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* Button hover effects - KECUALI password toggle button */
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
a:hover, .btn-link:hover {
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
.bi-check-circle-fill,
.bi-envelope-check-fill {
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
.form-control:disabled,
.form-check-input:disabled {
  opacity: 0.6;
  color: #000 !important;
}

/* Forgot password link styling */
.btn-link {
  font-size: 0.9rem;
}

.btn-link:hover {
  color: #0056b3 !important;
}
</style>