# ChatBot Sekolah

ChatBot Sekolah adalah aplikasi chatbot berbasis web yang membantu menjawab pertanyaan seputar SMK Syafi'i Akrom, termasuk informasi PPDB, jurusan, fasilitas, ekstrakurikuler, dan pengetahuan umum yang bermanfaat.

## Fitur
- Menjawab pertanyaan tentang sekolah secara otomatis
- Mendukung pertanyaan seputar PPDB, BKK, jurusan, jadwal, fasilitas, dan ekstrakurikuler
- Dapat menjawab pertanyaan umum (ilmu pengetahuan, sains, dll)
- Toleran terhadap typo dan perubahan topik
- Integrasi dengan AI Gemini Google

## Cara Menjalankan
1. **Backend**
   - Install dependensi:
     ```
     pip install -r backend/requirements.txt
     ```
   - Jalankan server Flask:
     ```
     python backend/app.py
     ```

2. **Frontend**
   - Buka file `frontend/index.html` di browser

## Konfigurasi
- Pastikan API Key Gemini sudah diatur di `frontend/script.js`
- Edit endpoint backend jika diperlukan

## Kontribusi
Pull request dan saran sangat terbuka!

## Lisensi
Proyek ini menggunakan lisensi MIT.
