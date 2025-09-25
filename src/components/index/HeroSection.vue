<template>
  <section class="hero-section position-relative overflow-hidden">
    <!-- Hero Content -->
    <div class="container-fluid px-0">
      <div class="container position-relative z-2 h-100 d-flex align-items-center">
        <div class="row w-100 align-items-center mx-0">
          <!-- Text Content -->
          <div class="col-lg-6 col-md-12 mb-5 mb-lg-0 px-3 px-md-4">
            <div class="hero-content text-white text-center text-lg-start">
              <!-- Badge -->
              <div class="hero-badge mb-4 d-flex justify-content-center justify-content-lg-start">
                <span class="badge rounded-pill px-4 py-2" style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.25);">
                  <i class="bi bi-shield-check me-2"></i>
                  Sistem Internal Bidang Tata Ruang
                </span>
              </div>
              
              <!-- Main Title -->
              <h1 class="display-4 fw-bold mb-4 hero-title">
                <span class="text-gradient">SEPATU KH</span>
              </h1>
              
              <!-- Subtitle -->
              <h2 class="h4 mb-4 text-white-75">
                Sistem Elektronik Penginventarisasi Agraria dan Tata Ruang Kapuas Hulu
              </h2>
              
              <!-- Description -->
              <p class="lead mb-4 text-white-75 mx-auto mx-lg-0" style="max-width: 500px;">
                Platform digital untuk inventarisasi data PKKPR (Persetujuan Kesesuaian Kegiatan Pemanfaatan Ruang) dalam lingkup internal bidang tata ruang Dinas PUPR Kapuas Hulu. Akses aman dan terpadu untuk manajemen dokumen dan data spasial.
              </p>
              
              <!-- Action Buttons (hidden if logged in) -->
              <div v-if="!isLogin" class="hero-buttons d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3 mb-5">
                <a href="/login" class="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow-lg">
                  <i class="bi bi-box-arrow-in-right me-2"></i>
                  Masuk Sistem
                </a>
                <a href="/register" class="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                  <i class="bi bi-person-plus me-2"></i>
                  Daftar Akun
                </a>
              </div>
              
              <!-- Welcome message if logged in -->
              <div v-if="isLogin" class="hero-welcome mb-5 d-flex justify-content-center justify-content-lg-start">
                <div class="glass-card rounded-4 p-4">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-person-check-fill text-success fs-3 me-3"></i>
                    <div>
                      <h5 class="text-white mb-1">Selamat Datang Kembali {{ user.name }}!</h5>
                      <p class="text-white-75 mb-0">Anda telah masuk ke sistem SEPATU KH</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Features -->
              <div class="hero-features mt-5">
                <div class="row g-4 justify-content-center justify-content-lg-start">
                  <div class="col-sm-6 col-md-4 col-lg-6">
                    <div class="feature-item d-flex align-items-center justify-content-center justify-content-lg-start" @click="handleFeatureClick('dokumen')">
                      <div class="feature-icon me-3 p-3 rounded-2" style="background: rgba(255, 255, 255, 0.15);">
                        <i class="bi bi-file-earmark-text text-white fs-5"></i>
                      </div>
                      <div class="text-center text-lg-start">
                        <h6 class="mb-1 text-white fw-semibold">Data</h6>
                        <small class="text-white-75">List PKKPR</small>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-4 col-lg-6">
                    <div class="feature-item d-flex align-items-center justify-content-center justify-content-lg-start" @click="handleFeatureClick('spasial')">
                      <div class="feature-icon me-3 p-3 rounded-2" style="background: rgba(255, 255, 255, 0.15);">
                        <i class="bi bi-geo-alt text-white fs-5"></i>
                      </div>
                      <div class="text-center text-lg-start">
                        <h6 class="mb-1 text-white fw-semibold">Peta Spasial</h6>
                        <small class="text-white-75">Persebaran PKKPR</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Visual Elements -->
          <div class="col-lg-6 col-md-12 px-3 px-md-4">
            <div class="hero-visual position-relative text-center">
              <!-- Central visual element -->
              <div class="hero-central-visual d-flex justify-content-center">
                <div class="central-circle position-relative">
                  <div class="circle-outer"></div>
                  <div class="circle-middle"></div>
                  <div class="circle-inner d-flex align-items-center justify-content-center">
                    <div class="text-center">
                      <i class="bi bi-building text-white mb-3" style="font-size: 4rem;"></i>
                      <h5 class="text-white fw-bold mb-2">SEPATU KH</h5>
                    </div>
                  </div>
                </div>
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
    
    <!-- Wave decoration -->
    <div class="wave-decoration position-absolute bottom-0 w-100"></div>

    <!-- Modal for non-registered users -->
    <div v-if="showModal && modalType === 'registration'" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-shield-lock me-2"></i>
              Akses Terbatas
            </h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-4">
              <div class="mb-3">
                <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
              </div>
              <h6 class="fw-semibold mb-3">Hanya Pengguna Terdaftar</h6>
              <p class="text-muted mb-4">
                Maaf, fitur ini hanya dapat diakses oleh pengguna yang telah terdaftar dan masuk ke dalam sistem SEPATU KH.
              </p>
            </div>
            
            <div class="d-grid gap-2">
              <a href="/login" class="btn btn-primary btn-lg">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Masuk ke Sistem
              </a>
              <a href="/register" class="btn btn-outline-primary">
                <i class="bi bi-person-plus me-2"></i>
                Daftar Akun Baru
              </a>
            </div>
            
            <div class="text-center mt-3">
              <small class="text-muted">
                Hubungi administrator jika Anda memerlukan bantuan
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for internal staff only -->
    <div v-if="showModal && modalType === 'internal'" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-shield-exclamation me-2 text-warning"></i>
              Akses Terbatas - Tim Internal
            </h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-4">
              <div class="mb-3">
                <i class="bi bi-geo-alt-fill text-primary" style="font-size: 3rem;"></i>
              </div>
              <h6 class="fw-semibold mb-3">Hanya Tim Internal Tata Ruang</h6>
              <p class="text-muted mb-4">
                Fitur Peta Spasial hanya dapat diakses oleh Tim Internal Tata Ruang atau pemangku kepentingan yang telah terverifikasi dalam sistem SEPATU KH.
              </p>
            </div>
            
            <div class="d-grid gap-2">
              <button type="button" class="btn btn-outline-primary" @click="closeModal">
                <i class="bi bi-arrow-left me-2"></i>
                Kembali ke Beranda
              </button>
            </div>
            
            <div class="text-center mt-3">
              <small class="text-muted">
                Hubungi administrator untuk informasi lebih lanjut mengenai akses fitur ini
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { isAuthenticated, getCurrentUser } from '../../lib/auth-utils';

// Reactive variables
const isLogin = ref(false);
const showModal = ref(false);
const modalType = ref('registration'); // 'registration' or 'internal'
const user = ref(null);
const isLoading = ref(true);

// Methods
const handleFeatureClick = (feature) => {
  if (!isLogin.value) {
    modalType.value = 'registration';
    showModal.value = true;
  } else {
    if (feature === 'dokumen') {
      window.location.href = '/pkkpr-list';
    } else if (feature === 'spasial') {
      // Check if user has access to spatial map (admin or user roles only)
      if (user.value && (user.value.role === 'admin' || user.value.role === 'user')) {
        window.location.href = '/map-view';
      } else {
        modalType.value = 'internal';
        showModal.value = true;
      }
    }
  }
};

const closeModal = () => {
  showModal.value = false;
};

onMounted(async() => {
  // Check if the user is logged in
  try {
    isLogin.value = await isAuthenticated();
    user.value = await getCurrentUser();
  } catch (error) {
    console.error('Error getting current user:', error);
    isLogin.value = false;
  }
  
  // Add smooth scrolling animation if scroll indicator exists
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
  }
});
</script>

<style scoped>
/* Custom color classes */
.text-white-75 {
  color: rgba(255, 255, 255, 0.75) !important;
}

.hero-section {
  border-radius: 12px;
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%),
              url('/hero-1.jpg') center/cover no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  padding-top: 100px;
  margin-bottom: 4rem;
}

.hero-section::before {
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
}

.text-gradient {
  background: linear-gradient(45deg, #ffffff, #e3f2fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.hero-title {
  animation: fadeInUp 1s ease-out;
}

/* Button styles */
.hero-buttons .btn {
  transition: all 0.4s ease;
  font-weight: 600;
  min-width: 200px;
}

.hero-buttons .btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  position: relative;
  overflow: hidden;
}

.hero-buttons .btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.hero-buttons .btn-primary:hover::before {
  left: 100%;
}

.hero-buttons .btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4) !important;
}

.hero-buttons .btn-outline-light {
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.hero-buttons .btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.1);
}

/* Feature items */
.feature-item {
  transition: all 0.4s ease;
  padding: 1rem;
  border-radius: 1rem;
  cursor: pointer;
  max-width: 100%;
}

.feature-item:hover {
  transform: translateX(10px);
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 991.98px) {
  .feature-item:hover {
    transform: translateY(-5px);
  }
}

.feature-icon {
  transition: all 0.4s ease;
  flex-shrink: 0;
}

.feature-item:hover .feature-icon {
  background: rgba(255, 255, 255, 0.25) !important;
  transform: scale(1.1);
}

/* Glass card styling */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.icon-wrapper {
  transition: all 0.3s ease;
}

.glass-card:hover .icon-wrapper {
  transform: scale(1.1);
}

/* Floating cards animations */
.floating-card {
  animation: float 4s ease-in-out infinite;
  z-index: 10;
  cursor: pointer;
}

.card-1 {
  top: 5%;
  right: 5%;
  animation-delay: 0s;
}

.card-2 {
  top: 45%;
  left: -5%;
  animation-delay: 1.5s;
}

.card-3 {
  bottom: 15%;
  right: 15%;
  animation-delay: 3s;
}

/* Central visual element */
.central-circle {
  width: 300px;
  height: 300px;
  position: relative;
  cursor: pointer;
}

.circle-outer, .circle-middle, .circle-inner {
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.circle-outer {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
  animation: pulse-slow 4s ease-in-out infinite;
}

.circle-middle {
  width: 80%;
  height: 80%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: pulse-slow 3s ease-in-out infinite reverse;
}

.circle-inner {
  width: 60%;
  height: 60%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Welcome message styling */
.hero-welcome .glass-card {
  border: 2px solid rgba(40, 167, 69, 0.3);
  background: rgba(40, 167, 69, 0.1);
}

/* MODAL STYLING - FIXED CENTERING */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1060;
  padding: 20px;
  box-sizing: border-box;
}

.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  margin: auto;
  position: relative;
  animation: modalFadeIn 0.3s ease-out;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-weight: 600;
  color: #0d6efd;
  font-size: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.btn-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #000;
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

.wave-decoration {
  height: 80px;
  background: rgba(255, 255, 255, 0.05);
  clip-path: polygon(0 30%, 100% 0%, 100% 100%, 0% 100%);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
}

@keyframes pulse-slow {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
  50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.2; }
}

@keyframes modalFadeIn {
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
  .hero-section {
    padding-top: 80px;
    margin-bottom: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-buttons {
    align-items: center;
  }
  
  .hero-buttons .btn {
    width: 100%;
    max-width: 300px;
    min-width: auto;
  }
  
  .central-circle {
    width: 250px;
    height: 250px;
  }
  
  .central-circle i {
    font-size: 3rem !important;
  }
  
  .feature-item {
    justify-content: center;
    padding: 1rem 0.5rem;
  }
  
  .hero-content {
    padding: 0 1rem;
  }
  
  .modal-overlay {
    padding: 15px;
  }
  
  .modal-container {
    max-width: 90%;
  }
}

@media (max-width: 576px) {
  .hero-section {
    padding-top: 60px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-content h2 {
    font-size: 1.2rem;
  }
  
  .hero-content .lead {
    font-size: 1rem;
    padding: 0 1rem;
  }
  
  .hero-buttons .btn {
    padding: 14px 28px;
    font-size: 0.95rem;
    max-width: 280px;
  }
  
  .central-circle {
    width: 200px;
    height: 200px;
  }
  
  .central-circle i {
    font-size: 2.5rem !important;
  }
  
  .glass-card {
    padding: 1rem !important;
  }
  
  .hero-content {
    padding: 0 0.5rem;
  }
  
  .feature-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .feature-icon {
    margin-right: 0 !important;
    margin-bottom: 0.5rem;
  }
  
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-container {
    max-width: 95%;
  }
  
  .modal-header,
  .modal-body {
    padding: 1rem;
  }
}

@media (max-width: 400px) {
  .hero-content .lead {
    font-size: 0.9rem;
    padding: 0 0.5rem;
  }
  
  .hero-buttons .btn {
    font-size: 0.9rem;
    padding: 12px 24px;
  }
  
  .central-circle {
    width: 180px;
    height: 180px;
  }
  
  .central-circle h5 {
    font-size: 1rem;
  }
  
  .modal-overlay {
    padding: 8px;
  }
  
  .modal-container {
    max-width: 98%;
  }
}

/* Extra small devices - better centering */
@media (max-width: 360px) {
  .hero-content {
    padding: 0 0.25rem;
  }
  
  .hero-content .lead {
    padding: 0 0.25rem;
  }
}
</style>