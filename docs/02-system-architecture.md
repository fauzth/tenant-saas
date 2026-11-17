# System Architecture & Technical Design Document
## Project: TenantFlow (Enterprise Multi-Tenant Saas)

## 1.  High-Level Architecture Overview
TenantFlow menggunakan arsitektur monolitik modular modern yang memisahkan lapisan *Frontend* dan *Backend*, didukung oleh basis data relasional terpusat dengan isolasi logis berbasis *Tenant ID*. 

Alur operasional sistem berjalan secara hierarkis: pengguna pertama mendaftarkan organisasi sebagai Tenant Owner, yang kemudian dapat melakukan provisioning akun Project Manager (PM) di dalam workspace tersebut. Selanjutnya, PM dapat mengelola proyek dan menugaskan akun Member (Staff) ke dalam proyek spesifik. Seluruh permintaan (requests) dari frontend akan diproses oleh Express.js (Backend REST API) yang menangani autentikasi JWT dan validasi Role-Based Access Control (RBAC). Data kemudian disimpan ke PostgreSQL, di mana setiap tabel operasional diwajibkan memiliki kolom `tenant_id` untuk memastikan isolasi data antar-perusahaan terjaga secara ketat.

<img src="./assets/figure_1_high_level_system_deployment.png" alt="High-Level System Deployment" width="700px"  height="400px"/>

*   **Frontend Layer:** Next.js (App Router). Bertindak sebagai Single Page Application (SPA).
*   **Backend Layer:** Node.js (Express.js) / REST API yang menangani logika bisnis, autentikasi JWT, dan validasi *Role-Based Access Control (RBAC)*.
*   **Database Layer:** PostgreSQL yang mengandalkan kolom `tenant_id` pada setiap tabel relasional untuk memastikan keamanan isolasi data antar perusahaan.
*   **Containerization:** Docker & Docker Compose untuk menyeragamkan lingkungan pengembangan lokal (*Local Development Environment*).

---

## 2. Database Schema & Entity Relationship Diagram (ERD)

Basis data **TenantFlow** dirancang menggunakan pendekatan relasional terpusat dengan PostgreSQL untuk memastikan integritas data, konsistensi transaksi (*ACID compliance*), serta isolasi logis antar-perusahaan (*multi-tenancy*).

<img src="./assets/figure_2_ERD.png" alt="TenantFlow Entity-Relationship Diagram" width="750px" />

1. **`tenants` (Tabel Organisasi / Workspace):**
   * Berfungsi sebagai entitas induk (*parent*) bagi seluruh data operasional perusahaan yang terdaftar di dalam sistem.
   * **Kolom Utama:** `id` (PK), `name`, `slug`, dan `created_at`.
2. **`users` (Tabel Manajemen Pengguna):**
   * Menyimpan informasi akun pengguna yang tergabung dalam suatu *tenant* tertentu, dilengkapi dengan kolom `role` untuk membedakan hak akses (*Owner*, *Project Manager*, *Member*).
   * **Kolom Utama:** `id` (PK), `tenant_id` (FK ke `tenants.id`), `name`, `email`, `password_hash`, `role`, dan `created_at`.
3. **`projects` (Tabel Manajemen Proyek):**
   * Dikelola oleh *Project Manager* di dalam suatu *tenant* untuk mengelompokkan pekerjaan dan tugas-tugas tim.
   * **Kolom Utama:** `id` (PK), `tenant_id` (FK ke `tenants.id`), `name`, `description`, `status` (*planning*, *in_progress*, *completed*), dan `created_at`.
4. **`tasks` (Tabel Tugas / Pekerjaan):**
   * Memuat rincian tugas spesifik di dalam suatu proyek yang dapat ditugaskan (*assigned*) kepada anggota tim (*member*).
   * **Kolom Utama:** `id` (PK), `project_id` (FK ke `projects.id`), `tenant_id` (FK ke `tenants.id`), `assigned_to` (FK ke `users.id`), `title`, `status` (*todo*, *in_progress*, *done*), dan `created_at`.
