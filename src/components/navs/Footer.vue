<template>
  <footer class="footer bg-dark text-light">
    <div class="container-fluid px-4 py-5">
      <div class="row">
        <!-- Brand Section -->
        <div class="col-lg-4 col-md-6 mb-4">
          <h4 class="fw-bold text-gradient mb-3" style="background: linear-gradient(45deg, #007bff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            SEPATU KH
          </h4>
          <p class="text-light-emphasis mb-3">
            Sepatu KH adalah website yang digunkan untuk inventarisasi PKKPR dalam lingkup internal bidang tata ruang Dinas PUPR Kapuas Hulu.
          </p>
          <!-- <div class="social-links d-flex gap-3">
            <a href="#" class="social-link" style="color: #007bff; font-size: 1.5rem; transition: all 0.3s ease;">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="#" class="social-link" style="color: #007bff; font-size: 1.5rem; transition: all 0.3s ease;">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="#" class="social-link" style="color: #007bff; font-size: 1.5rem; transition: all 0.3s ease;">
              <i class="bi bi-twitter"></i>
            </a>
          </div> -->
        </div>

        <!-- Contact Information -->
        <div class="col-lg-4 col-md-6 mb-4">
          <h5 class="fw-semibold mb-3 text-gradient" style="background: linear-gradient(45deg, #007bff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            Hubungi Admin
          </h5>
          <div class="contact-item d-flex align-items-center mb-3">
            <div class="contact-icon me-3 p-2 rounded-2" style="background: rgba(0, 123, 255, 0.1);">
              <i class="bi bi-whatsapp text-success" style="font-size: 1.2rem;"></i>
            </div>
            <div>
              <p class="mb-0 text-light-emphasis">WhatsApp</p>
              <a href="https://wa.me/6285143059694" class="text-decoration-none" style="color: #00d4ff;" target="_blank">
                +62 851-4305-9694 (Arisadada A.T.)
              </a>
            </div>
          </div>
          
          <div class="contact-item d-flex align-items-center mb-3">
            <div class="contact-icon me-3 p-2 rounded-2" style="background: rgba(0, 123, 255, 0.1);">
              <i class="bi bi-envelope" style="color: #007bff; font-size: 1.2rem;"></i>
            </div>
            <div>
              <p class="mb-0 text-light-emphasis">Email</p>
              <a href="mailto:info@sepatukh.com" class="text-decoration-none" style="color: #00d4ff;">
                arisadada.akhsanitaqwim@mail.go.id
              </a>
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="col-lg-4 col-md-12 mb-4">
          <h5 class="fw-semibold mb-3 text-gradient" style="background: linear-gradient(45deg, #007bff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            Alamat Kantor
          </h5>
          <div class="contact-item d-flex align-items-start">
            <div class="contact-icon me-3 p-2 rounded-2" style="background: rgba(0, 123, 255, 0.1);">
              <i class="bi bi-geo-alt" style="color: #007bff; font-size: 1.2rem;"></i>
            </div>
            <div>
              <p class="mb-2 text-light">
                Jl. Lingkar Mupa-Transmigrasi<br>
                Desa Pala Pulau<br>
                Kecamatan Putussibau Utara<br>
                Kabupaten Kapuas Hulu, Kalimantan Barat<br>
                78716
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Divider -->
      <hr class="my-4" style="border-color: rgba(0, 123, 255, 0.3);">
      
      <!-- Copyright Section -->
      <div class="row align-items-center">
        <div class="col-md-6">
          <p class="mb-0 text-light-emphasis">
            &copy; {{ new Date().getFullYear() }} SEPATU KH. All rights reserved.
          </p>
        </div>
        <div class="col-md-6 text-md-end mt-2 mt-md-0">
          <p class="mb-0 text-light-emphasis">
            Dibuat dengan <i class="bi bi-heart-fill text-danger"></i> oleh <a href="https://www.linkedin.com/in/arisadadaat" target="_blank" class="fw-bold text-gradient" style="background: linear-gradient(45deg, #007bff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Arisadada A.T.</a>
          </p>
        </div>
      </div>
    </div>
    
    <!-- Decorative wave effect -->
    <div class="wave-decoration" style="height: 4px; background: linear-gradient(90deg, #007bff, #00d4ff, #007bff); animation: wave 3s ease-in-out infinite;"></div>
  </footer>
</template>

<script setup>
import { onMounted } from 'vue';
// No additional script needed for basic footer
onMounted(() => {
})
</script>

<style scoped>
/* Hover effects untuk social links */
.social-link:hover {
  color: #00d4ff !important;
  transform: translateY(-2px);
}

/* Hover effects untuk contact links */
.contact-item a:hover {
  color: #007bff !important;
}

/* Contact icon hover effects */
.contact-icon {
  transition: all 0.3s ease;
}

.contact-item:hover .contact-icon {
  background: rgba(0, 123, 255, 0.2) !important;
  transform: scale(1.1);
}

/* Wave animation */
@keyframes wave {
  0%, 100% {
    background: linear-gradient(90deg, #007bff, #00d4ff, #007bff);
  }
  50% {
    background: linear-gradient(90deg, #00d4ff, #007bff, #00d4ff);
  }
}

/* Responsif untuk mobile */
@media (max-width: 768px) {
  .footer {
    text-align: center;
  }
  
  .contact-item {
    justify-content: center;
    text-align: left;
  }
  
  .social-links {
    justify-content: center !important;
  }
}

/* Smooth transitions untuk semua elemen */
.footer * {
  transition: all 0.3s ease;
}

/* Custom styling untuk text gradient di mobile */
@media (max-width: 576px) {
  .text-gradient {
    font-size: 1.1rem;
  }
}
</style>