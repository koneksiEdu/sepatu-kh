<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg fixed-top">
    <div class="container-fluid px-4">
      <!-- Brand dengan gradient -->
      <a class="navbar-brand fw-bold fs-3 text-gradient" href="/" style="background: linear-gradient(45deg, #007bff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
        SEPATU KH
      </a>
      
      <!-- Tombol toggle untuk mobile -->
      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!-- Menu utama dengan spacing yang lebih baik -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-4">
          <li class="nav-item">
            <a class="nav-link active fw-semibold px-3 py-2 rounded-pill me-2 position-relative" aria-current="page" href="/" style="background: rgba(0, 123, 255, 0.1); transition: all 0.3s ease;">
              <i class="bi bi-house"></i> Beranda
            </a>
          </li>
          
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle fw-semibold px-3 py-2 rounded-pill me-2 position-relative" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="transition: all 0.3s ease;">
              <i class="bi bi-person"></i> Akun
            </a>
            <ul class="dropdown-menu border-0 shadow-lg rounded-3 mt-2" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);">
              <li v-if="!isLogin"><a class="dropdown-item" href="/register">Daftar</a></li>
              <li v-if="!isLogin"><a class="dropdown-item" href="/login">Masuk</a></li>
              <!-- <li v-if="isLogin"><hr class="dropdown-divider" /></li> -->
              <li v-if="isLogin"><a class="dropdown-item" href="#" @click="logout">Keluar</a></li>
            </ul>
          </li>

          <li v-if="user?.role === 'admin'" class="nav-item">
            <a class="nav-link active fw-semibold px-3 py-2 rounded-pill me-2 position-relative" aria-current="page" href="/admin-panel" style="background: rgba(0, 123, 255, 0.1); transition: all 0.3s ease;">
              <i class="bi bi-gear"></i> Admin Panel
            </a>
          </li>
        </ul>
        
        <!-- Search form dengan desain modern -->
        <form class="d-flex align-items-center" role="search">
          <div class="input-group me-3" style="min-width: 300px;">
            <input class="form-control border-0 rounded-start-pill px-4 py-2" type="search" placeholder="Cari..." aria-label="Search" style="background: rgba(255, 255, 255, 0.1); color: white; backdrop-filter: blur(10px);">
            <button class="btn btn-primary border-0 rounded-end-pill px-4" type="submit" style="background: linear-gradient(45deg, #007bff, #00d4ff); transition: all 0.3s ease;">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { startAutoRefresh, getCurrentUser, clearTokens, isAuthenticated } from '../../lib/auth-utils';

const isLogin = ref(false);
const user = ref(null);

onMounted( async () => {
  try {
    isLogin.value = await isAuthenticated();
    const current = await getCurrentUser();
    if (current) {
      startAutoRefresh();
      user.value = current;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    isLogin.value = false;
    user.value = null;
  }
});

const logout = () => {
  clearTokens();
  window.location.href = '/login';
};
</script>

<!-- Custom CSS untuk efek hover dan animasi -->
<style>
  /* Hover effects untuk nav links */
  .navbar-nav .nav-link:hover {
    background: rgba(0, 123, 255, 0.2) !important;
  }
  
  /* Hover effects untuk dropdown items */
  .dropdown-item:hover {
    background: rgba(0, 123, 255, 0.1) !important;
  }
  
  /* Custom scrollbar untuk dropdown jika diperlukan */
  .dropdown-menu::-webkit-scrollbar {
    width: 4px;
  }
  
  .dropdown-menu::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .dropdown-menu::-webkit-scrollbar-thumb {
    background: #007bff;
    border-radius: 2px;
  }
  
  /* Animasi untuk navbar toggler */
  .navbar-toggler:focus {
    box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  }
  
  /* Responsif untuk mobile */
  @media (max-width: 991px) {
    .input-group {
      min-width: 100% !important;
      margin-top: 1rem;
    }
    
    .navbar-nav {
      margin-left: 0 !important;
    }
    
    .nav-link {
      text-align: center;
      margin: 0.25rem 0;
    }
  }
  
  /* Placeholder styling untuk search input */
  .form-control::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .form-control:focus {
    background: rgba(255, 255, 255, 0.2) !important;
    box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
    color: white;
  }
</style>