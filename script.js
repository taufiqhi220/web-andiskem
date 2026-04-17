import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR API FIREBASE KEY", // INSERT YOUR FIREBASE KEY PROJECT
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

const IMGBB_API_KEY = "";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById('dosaForm');
const list = document.getElementById('dosaList');
const fileInput = document.getElementById('buktiGambar');
const fileNameDisplay = document.getElementById('fileName');
const sortOrderDropdown = document.getElementById('sortOrder');
let currentDosas = [];

// Handle UI File Name
fileInput.addEventListener('change', function () {
    if (this.files && this.files.length > 0) {
        fileNameDisplay.textContent = `✅ ${this.files.length} Gambar Dipilih`;
    }
});

const getFormattedDate = () => {
    return new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

// --- Fungsi Zoom Gambar ---
window.openImage = function (src) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('imgZoomed');
    modal.classList.add('active');
    img.src = src;
};

window.closeImageModal = function () {
    document.getElementById('imageModal').classList.remove('active');
};

// --- Update Render UI (Tambahkan onclick pada gambar) ---
function renderUI() {
    list.innerHTML = '';
    const sortValue = sortOrderDropdown.value;
    let sortedDosas = [...currentDosas];

    if (sortValue === 'terbaru') {
        sortedDosas.sort((a, b) => b.timestamp - a.timestamp);
    } else {
        sortedDosas.sort((a, b) => a.timestamp - b.timestamp);
    }

    const referenceArray = [...currentDosas].sort((a, b) => a.timestamp - b.timestamp);

    sortedDosas.forEach((dosa) => {
        const li = document.createElement('li');
        li.className = 'dosa-item';
        const displayIndex = referenceArray.findIndex(d => d.id === dosa.id) + 1;

        let content = `
            <div class="dosa-header">
                <span class="dosa-text">#${displayIndex}. ${dosa.text}</span>
                <span class="dosa-date">Terdeteksi: ${dosa.date}</span>
            </div>
        `;

        if (dosa.images && dosa.images.length > 0) {
            content += `<div class="image-gallery">`;
            dosa.images.forEach(imgSrc => {
                // TAMBAHKAN onclick="openImage"
                content += `<img src="${imgSrc}" alt="Bukti" onclick="openImage('${imgSrc}')" onerror="this.style.display='none'">`;
            });
            content += `</div>`;
        }

        content += `<button class="delete-btn" onclick="deleteDosa('${dosa.id}')">HAPUS DATA</button>`;
        li.innerHTML = content;
        list.appendChild(li);
    });
}

sortOrderDropdown.addEventListener('change', renderUI);

// Firestore Listener
const q = query(collection(db, "dosas"));
onSnapshot(q, (snapshot) => {
    currentDosas = [];
    snapshot.forEach((doc) => {
        currentDosas.push({ id: doc.id, ...doc.data() });
    });
    renderUI();
});

// Submit Form
// --- LOGIKA UPLOAD DENGAN PASSWORD ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const textInput = document.getElementById('deskripsi').value;
    const passInput = document.getElementById('uploadPassword').value; // Ambil password upload
    const files = fileInput.files;
    const btnSubmit = document.querySelector('.submit-btn');

    // VALIDASI PASSWORD SEBELUM PROSES
    if (passInput !== 'ANDI MARAYA TUKANG SKEM') {
        alert("PASSWORD SALAH! Anda tidak memiliki akses untuk menambah data.");
        return;
    }

    btnSubmit.textContent = "SEDANG MENGUPLOAD...";
    btnSubmit.disabled = true;

    try {
        let uploadedImageUrls = [];
        if (files.length > 0) {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append('image', file);
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                return data.data.url;
            });
            uploadedImageUrls = await Promise.all(uploadPromises);
        }

        // Kirim ke Firestore
        await addDoc(collection(db, "dosas"), {
            text: textInput,
            date: getFormattedDate(),
            timestamp: Date.now(),
            images: uploadedImageUrls
        });

        // OTOMATIS URUTKAN KE TERBARU AGAR DATA BARU LANGSUNG KELIHATAN
        // 1. Paksa dropdown ke "terbaru"
        sortOrderDropdown.value = 'terbaru';

        // 2. JALANKAN renderUI secara manual agar urutan langsung berubah
        renderUI();

        // 3. Scroll ke daftar agar terlihat
        const listOffset = document.getElementById('dosaList').offsetTop;
        window.scrollTo({ top: listOffset - 100, behavior: 'smooth' });

        form.reset();
        fileNameDisplay.textContent = "Pilih File Gambar";

        form.reset();
        fileNameDisplay.textContent = "Pilih File Gambar";

        // Tampilkan popup sukses custom
        const successModal = document.getElementById('successModal');
        successModal.querySelector('h3').textContent = "BERHASIL DIARSIPKAN";
        successModal.querySelector('p').textContent = "Data baru telah otomatis ditampilkan di urutan teratas.";
        successModal.classList.add('active');

    } catch (error) {
        alert("Gagal upload: " + error.message);
    } finally {
        btnSubmit.textContent = "UPLOAD DATA";
        btnSubmit.disabled = false;
    }
});

// --- LOGIKA HAPUS DATA ---

// Gunakan satu variabel global yang konsisten
window.targetIdHapus = null;

window.deleteDosa = function (id) {
    window.targetIdHapus = id;
    document.getElementById('confirmInput').value = '';
    document.getElementById('deleteModal').classList.add('active');
    setTimeout(() => document.getElementById('confirmInput').focus(), 100);
};

window.closeModal = function () {
    document.getElementById('deleteModal').classList.remove('active');
};

window.closeSuccessModal = function () {
    document.getElementById('successModal').classList.remove('active');
};

document.getElementById('btnExecute').onclick = async function () {
    const input = document.getElementById('confirmInput').value;
    const btn = document.getElementById('btnExecute');

    if (input === 'ANDI MARAYA TUKANG SKEM') {
        if (!window.targetIdHapus) {
            alert("ID Data tidak ditemukan.");
            return;
        }

        btn.textContent = "MENGHAPUS...";
        btn.disabled = true;

        try {
            await deleteDoc(doc(db, "dosas", window.targetIdHapus));

            window.closeModal();
            // Munculkan popup sukses buatanmu
            document.getElementById('successModal').classList.add('active');
            window.targetIdHapus = null;
        } catch (error) {
            console.error("Error Lengkap:", error);
            alert("Gagal koneksi! Pastikan Rules Firebase sudah di-Publish ke 'true'.");
        } finally {
            btn.textContent = "Hapus Data";
            btn.disabled = false;
        }
    } else {
        alert('Password Salah!');
    }
};