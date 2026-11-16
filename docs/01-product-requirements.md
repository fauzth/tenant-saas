# Product Requirements Document (PRD)
## Project: TenantFlow (Enterprise Multi-Tenant Saas)

## 1. Project Overview
TenantFlow adalah platform manajemen proyek berbasis website dengan arsitektur multi-tenancy. Sistem ini dirancang untuk memfasilitasi kolaborasi tim dalam sebuah organisasi/perusahaan secara terisolasi, aman, dan terstruktur.

## 2. Target User & Roles
*  **Tenant Owner (Admin):**
    *   Dapat mendaftarkan organisasi/perusahaan baru (Tenant).
    *   Mengatur peran (*role*) dan menghapus proyek dalam organisasi/perusahaan miliknya.
  **Project Manager:**
    *   Membuat, mengedit, dan menghapus proyek di dalam *workspace* tenant.
    *   Menugaskan *tasks* kepada anggota tim.
    *   Memberikan persetujuan (*Acc*) perubahan status task dari *In Progress* menjadi *Done*.
  **Member (Staff):**
    *   Melihat daftar proyek dan *tasks* yang ditugaskan kepadanya.
    *   Mengubah status task dari *To Do* ke *In Progress* secara mandiri.
    *   Mengajukan perubahan status task dari *In Progress* ke *Done* (membutuhkan persetujuan PM).

## 3. MVP Scope
*  [ ] **Authentication & Tenant Onboarding:**
    *   Registerasi Tenant baru (otomatis membuat akun user dengan role *Tenant Owner*).
    *   Sistem Login berbasis JWT.
*  [ ] **Multi-Tenancy Data Isolation:**
    *   Memastikan setiap kueri database (Project, Task, User) terikat ketat pada `tenant_id` masing-masing perusahaan.
*  [ ] **Project & Task Management (CRUD):**
    *   Manajemen Proyek sederhana oleh Owner / Project Manager.
    *   Manajemen Task di dalam proyek dengan 4 status: *To Do*, *In Progress*, *Pending Review*, dan *Done*.
*  [ ] **Task Approval Workflow:**
    *   Member mengubah status task dari *To Do* **$\rightarrow$ *In Progress* secara mandiri.**
    *   Member mengajukan perubahan dari *In Progress* $\rightarrow$ *Pending Review*.
    *   Project Manager memberikan *ACC* untuk mengubah status dari *Pending Review* $\rightarrow$ *Done*.
    
## 4. Non-Functional Requirements
*   **Security:** Password wajib di-*hash* menggunakan bcrypt, validasi token invite dengan masa kedaluwarsa.
*   **Performance:** Waktu respon API target di bawah 300ms untuk operasi CRUD standar.
*   **Containerization:** Aplikasi harus dapat dijalankan secara lokal menggunakan Docker & Docker Compose.
