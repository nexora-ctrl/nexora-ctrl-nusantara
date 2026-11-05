/**
 * NEXORA CTRL NUSANTARA
 * Interactive Scripts & Application Logic
 * Dark/Light Mode, Interactive CRM Demo, KPR Calculator & Pipeline
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbarScroll();
  initMobileMenu();
  initDemoTabs();
  initCrmInteractive();
  initKprCalculator();
  initPipelineInteractive();
  initContactForm();
  initScrollTop();
});

/* ===================================================================
   1. THEME TOGGLE (LIGHT & DARK MODE)
   =================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('nexora_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  setTheme(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    showToast(`Beralih ke mode ${newTheme === 'dark' ? 'Gelap (Dark)' : 'Terang (Light)'}`);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('nexora_theme', theme);

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'ti ti-sun';
        toggleBtn.setAttribute('title', 'Ganti ke Mode Terang');
        toggleBtn.setAttribute('aria-label', 'Ganti ke Mode Terang');
      } else {
        icon.className = 'ti ti-moon';
        toggleBtn.setAttribute('title', 'Ganti ke Mode Gelap');
        toggleBtn.setAttribute('aria-label', 'Ganti ke Mode Gelap');
      }
    }
  }
}

/* ===================================================================
   2. NAVBAR SCROLL & ACTIVE LINK (THROTTLED & 60FPS SMOOTH)
   =================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 20;
        if (navbar.classList.contains('scrolled') !== isScrolled) {
          navbar.classList.toggle('scrolled', isScrolled);
        }
        highlightNavOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function highlightNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 120;
    const sectionId = current.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink.classList.add('active');
      } else {
        navLink.classList.remove('active');
      }
    }
  });
}

/* ===================================================================
   3. MOBILE NAVIGATION MENU & DROPDOWN ACCORDION
   =================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!mobileToggle || !navMenu) return;

  function closeMobileNav() {
    navMenu.classList.remove('open');
    const icon = mobileToggle.querySelector('i');
    if (icon) icon.className = 'ti ti-menu-2';
    // Reset all open dropdown accordions on mobile
    document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
      item.classList.remove('mobile-open');
    });
  }

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.className = navMenu.classList.contains('open') ? 'ti ti-x' : 'ti ti-menu-2';
    }
  });

  // Handle dropdown toggle clicks on mobile/touch devices
  const dropdownToggles = navMenu.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        const parentItem = toggle.closest('.nav-item.has-dropdown');
        if (parentItem) {
          const isOpen = parentItem.classList.contains('mobile-open');
          // Close other open accordions
          document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
            if (item !== parentItem) item.classList.remove('mobile-open');
          });
          parentItem.classList.toggle('mobile-open', !isOpen);
        }
      }
    });
  });

  // Close mobile drawer when clicking direct nav links or dropdown sub-items
  navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 960) {
        closeMobileNav();
      }
    });
  });

  // Close when clicking outside navbar on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 960 && 
        navMenu.classList.contains('open') && 
        !navMenu.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      closeMobileNav();
    }
  });
}

/* ===================================================================
   4. DEMO TABS (PROPERTY WEBSITE VS ADMIN CRM DASHBOARD)
   =================================================================== */
function initDemoTabs() {
  const tabBtns = document.querySelectorAll('.demo-tab-btn');
  const panes = document.querySelectorAll('.demo-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   5. INTERACTIVE CRM DASHBOARD DEMO
   =================================================================== */
// Mock initial database of leads
let leadsData = [
  { id: 'REG-NXR-8812', name: 'Jay Hargudson', property: 'Cluster Acacia (Tipe 36)', phone: '0812-4412-xxxx', date: '2026-11-04', status: 'Lolos Verifikasi Awal', badgeClass: 'status-approved' },
  { id: 'REG-NXR-8813', name: 'Budi Gunawan', property: 'Grand Samanea (Tipe 60)', phone: '0857-9921-xxxx', date: '2026-11-04', status: 'Proses Bank/Pihak Terkait', badgeClass: 'status-process' },
  { id: 'REG-NXR-8814', name: 'Muhammad Eko Sudrajat', property: 'Cluster Acacia (Tipe 45)', phone: '0813-8820-xxxx', date: '2026-11-05', status: 'Menunggu Verifikasi', badgeClass: 'status-pending' },
  { id: 'REG-NXR-8815', name: 'Siti Nurhaliza', property: 'Cluster Acacia (Tipe 36)', phone: '0821-3140-xxxx', date: '2026-11-05', status: 'Pengajuan Baru', badgeClass: 'status-new' },
  { id: 'REG-NXR-8816', name: 'Hendri Setiawan', property: 'Grand Samanea (Tipe 60)', phone: '0878-1123-xxxx', date: '2026-11-03', status: 'Perlu Perbaikan Data', badgeClass: 'status-warning' }
];

function initCrmInteractive() {
  renderCrmTable(leadsData);

  // Search input filter
  const searchInput = document.getElementById('crm-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = leadsData.filter(lead => 
        lead.name.toLowerCase().includes(term) ||
        lead.id.toLowerCase().includes(term) ||
        lead.property.toLowerCase().includes(term) ||
        lead.status.toLowerCase().includes(term)
      );
      renderCrmTable(filtered);
    });
  }

  // Export Data Button simulation
  const exportBtn = document.getElementById('crm-export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      showToast('Rekap data prospek berhasil diekspor ke format Spreadsheet!');
    });
  }
}

function renderCrmTable(data) {
  const tbody = document.getElementById('crm-leads-tbody');
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);"><i class="ti ti-search-off" style="font-size: 1.5rem; display:block; margin-bottom: 8px;"></i>Tidak ada data pengajuan yang cocok</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map((item, index) => `
    <tr>
      <td>
        <span style="font-weight: 700; color: var(--brand-blue); font-family: var(--font-display);">${item.id}</span>
        <div style="font-size: 0.72rem; color: var(--text-muted);">${item.date}</div>
      </td>
      <td>
        <div style="font-weight: 700; color: var(--text-main);">${item.name}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${item.phone}</div>
      </td>
      <td>
        <span style="font-weight: 600;">${item.property}</span>
      </td>
      <td>
        <span class="status-pill ${item.badgeClass}">
          <i class="ti ti-point-filled"></i> ${item.status}
        </span>
      </td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-sm btn-secondary" onclick="cycleLeadStatus('${item.id}')" title="Perbarui Status">
            <i class="ti ti-refresh" style="font-size: 1rem;"></i> Update
          </button>
          <a href="https://wa.me/6281230011284?text=Halo%20Admin%20Nexora,%20saya%20ingin%20follow%20up%20pengajuan%20${item.id}" target="_blank" class="btn btn-sm btn-outline" title="Hubungi Calon Pembeli">
            <i class="ti ti-brand-whatsapp" style="font-size: 1rem;"></i>
          </a>
        </div>
      </td>
    </tr>
  `).join('');
}

// Function to update lead status interactively
window.cycleLeadStatus = function(leadId) {
  const statuses = [
    { status: 'Pengajuan Baru', badgeClass: 'status-new' },
    { status: 'Menunggu Verifikasi', badgeClass: 'status-pending' },
    { status: 'Perlu Perbaikan Data', badgeClass: 'status-warning' },
    { status: 'Lolos Verifikasi Awal', badgeClass: 'status-approved' },
    { status: 'Proses Bank/Pihak Terkait', badgeClass: 'status-process' },
    { status: 'Disetujui', badgeClass: 'status-approved' },
    { status: 'Tidak Dilanjutkan', badgeClass: 'status-closed' }
  ];

  const lead = leadsData.find(l => l.id === leadId);
  if (lead) {
    const currentIndex = statuses.findIndex(s => s.status === lead.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    lead.status = statuses[nextIndex].status;
    lead.badgeClass = statuses[nextIndex].badgeClass;

    renderCrmTable(leadsData);
    showToast(`Status ID ${leadId} diperbarui: "${lead.status}"`);
  }
};

/* ===================================================================
   6. SIMULASI KPR / FINANCING CALCULATOR
   =================================================================== */
function initKprCalculator() {
  const priceInput = document.getElementById('calc-price');
  const priceDisplay = document.getElementById('calc-price-val');
  
  const dpPercentInput = document.getElementById('calc-dp');
  const dpDisplay = document.getElementById('calc-dp-val');

  const tenorInput = document.getElementById('calc-tenor');
  const tenorDisplay = document.getElementById('calc-tenor-val');

  const rateInput = document.getElementById('calc-rate');
  const rateDisplay = document.getElementById('calc-rate-val');

  const resultAmount = document.getElementById('calc-monthly-installment');
  const resultLoan = document.getElementById('calc-loan-principal');

  if (!priceInput || !resultAmount) return;

  function calculateInstallment() {
    const price = parseFloat(priceInput.value);
    const dpPercent = parseFloat(dpPercentInput.value);
    const tenorYears = parseInt(tenorInput.value, 10);
    const annualRate = parseFloat(rateInput.value);

    // Update label displays
    if (priceDisplay) priceDisplay.textContent = formatRupiah(price);
    if (dpDisplay) dpDisplay.textContent = `${dpPercent}% (Rp ${formatRupiah((price * dpPercent) / 100)})`;
    if (tenorDisplay) tenorDisplay.textContent = `${tenorYears} Tahun`;
    if (rateDisplay) rateDisplay.textContent = `${annualRate}% p.a`;

    // Calculation
    const downPayment = (price * dpPercent) / 100;
    const loanPrincipal = price - downPayment;
    if (resultLoan) resultLoan.textContent = `Rp ${formatRupiah(loanPrincipal)}`;

    const monthlyRate = (annualRate / 100) / 12;
    const totalMonths = tenorYears * 12;

    // Standard annuity formula: P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                           (Math.pow(1 + monthlyRate, totalMonths) - 1);

    resultAmount.textContent = `Rp ${formatRupiah(Math.round(monthlyPayment))} / bln`;
  }

  [priceInput, dpPercentInput, tenorInput, rateInput].forEach(elem => {
    if (elem) elem.addEventListener('input', calculateInstallment);
  });

  // Run initial calculation
  calculateInstallment();
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID').format(number);
}

/* ===================================================================
   7. 8-STEP PIPELINE INTERACTION
   =================================================================== */
function initPipelineInteractive() {
  const steps = document.querySelectorAll('.step-card');
  const previewBox = document.getElementById('pipeline-detail-preview');

  const stepDetails = {
    1: {
      title: '01 • Kunjungan Website',
      desc: 'Calon konsumen membuka website resmi perumahan yang diakses via tautan promosi media sosial, iklan, atau pencarian Google. Mereka membaca informasi tipe unit, foto, spesifikasi 36/120, lokasi strategis, dan simulasi pembiayaan.'
    },
    2: {
      title: '02 • Pengisian Formulir',
      desc: 'Calon konsumen mengisi formulir minat secara online: nama lengkap, nomor WhatsApp aktif, tipe unit yang diminati (contoh: Cluster Acacia), dan waktu kunjungan survei lokasi yang diinginkan.'
    },
    3: {
      title: '03 • Persetujuan dan Pengiriman',
      desc: 'Pengguna membaca kebijakan privasi dan memberikan persetujuan eksplisit sesuai regulasi perlindungan data pribadi (PDP). Data dikirim terenkripsi melalui koneksi SSL/HTTPS aman.'
    },
    4: {
      title: '04 • Pencatatan Otomatis & No. Registrasi',
      desc: 'Sistem Nexora secara instan men-generate nomor registrasi unik (misal: REG-NXR-2026-xxxx) dan menyimpan data calon konsumen secara terstruktur ke dalam database terpusat.'
    },
    5: {
      title: '05 • Notifikasi Admin Seketika',
      desc: 'Sistem mengirimkan peringatan instan kepada tim pemasaran/admin perumahan bahwa ada calon konsumen baru yang siap untuk ditindaklanjuti.'
    },
    6: {
      title: '06 • Pemeriksaan Awal',
      desc: 'Admin memeriksa kelengkapan data administratif, memeriksa preferensi unit yang dipilih, dan menghubungi calon konsumen via WhatsApp/telepon untuk konfirmasi.'
    },
    7: {
      title: '07 • Tindak Lanjut & Catatan Riwayat',
      desc: 'Admin mencatat hasil percakapan (jadwal survei lokasi, status berkas, simulasi KPR) dan meng-update status pengajuan langsung pada dashboard CRM.'
    },
    8: {
      title: '08 • Monitoring Manajemen',
      desc: 'Manajemen developer dan penanggung jawab dapat memantau grafik konversi prospek harian/bulanan, unit terlaris, dan mengekspor rekap spreadsheet untuk rapat evaluasi bisnis.'
    }
  };

  steps.forEach(card => {
    card.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('active-step'));
      card.classList.add('active-step');

      const stepNum = card.getAttribute('data-step');
      if (previewBox && stepDetails[stepNum]) {
        previewBox.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <span class="status-pill status-new" style="font-size: 0.82rem;">Tahap Terpilih</span>
            <h4 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 700;">${stepDetails[stepNum].title}</h4>
          </div>
          <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6;">${stepDetails[stepNum].desc}</p>
        `;
      }
    });
  });
}

/* ===================================================================
   8. FORMULIR PENGAJUAN / KONSULTASI INTERAKTIF
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('consultation-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const company = document.getElementById('form-company').value.trim() || 'Pengembang / Bisnis';
    const service = document.getElementById('form-service').value;
    const notes = document.getElementById('form-notes').value.trim();

    if (!name || !phone) {
      showToast('Harap isi Nama dan Nomor WhatsApp Anda.');
      return;
    }

    // Generate simulated registration ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const regId = `REG-NXR-${randomNum}`;

    // Add to CRM table preview live!
    const newLead = {
      id: regId,
      name: name,
      property: `${service} (${company})`,
      phone: phone,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pengajuan Baru',
      badgeClass: 'status-new'
    };

    leadsData.unshift(newLead);
    renderCrmTable(leadsData);

    // Update lead counter stats on hero preview
    const totalLeadsCounter = document.getElementById('hero-total-leads');
    if (totalLeadsCounter) {
      const current = parseInt(totalLeadsCounter.textContent.replace(/\D/g, ''), 10) || 300;
      totalLeadsCounter.textContent = `${current + 1}+`;
    }

    showToast(`Registrasi Berhasil! ID Anda: ${regId}. Data masuk ke dashboard CRM.`);

    // Reset form
    form.reset();

    // Prepare WhatsApp message
    const waText = encodeURIComponent(
      `Halo Tim Nexora Ctrl Nusantara,\n\nSaya telah mengajukan konsultasi melalui website:\n` +
      `• ID Registrasi: ${regId}\n` +
      `• Nama: ${name}\n` +
      `• Perusahaan: ${company}\n` +
      `• Layanan yang Diminati: ${service}\n` +
      `• Catatan: ${notes || '-'}\n\n` +
      `Mohon informasi lebih lanjut terkait penawaran kerja sama ini. Terima kasih!`
    );

    setTimeout(() => {
      if (confirm(`Pengajuan ID ${regId} tersimpan ke CRM! Lanjutkan chat langsung ke WhatsApp resmi Nexora?`)) {
        window.open(`https://wa.me/6281230011284?text=${waText}`, '_blank');
      }
    }, 600);
  });
}

/* ===================================================================
   9. SCROLL TO TOP UTILITY
   =================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===================================================================
   10. TOAST NOTIFICATION UTILITY
   =================================================================== */
function showToast(message) {
  let toast = document.getElementById('system-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'system-toast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="ti ti-check-circle"></i> <span>${message}</span>`;
  toast.classList.add('show');

  if (window.toastTimeout) clearTimeout(window.toastTimeout);

  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3600);
}

