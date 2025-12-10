// FLOConnect Masraf Modülü - Ana JavaScript Dosyası

// ========================================
// ÖRNEK FİŞ/FATURA VERİLERİ (OCR SİMÜLASYONU)
// ========================================
const sampleReceipts = [
    {
        type: 'taksi',
        belgeTuru: 'fis',
        belgeNo: 'YKF-2024-458712',
        belgeTarihi: '2024-12-09',
        firmaAdi: 'UBER TURKEY TEKNOLOJİ A.Ş.',
        vergiNo: '9876543210',
        brutTutar: 350.00,
        kdvOrani: 20,
        hesapKodu: '770.02',
        aciklama: 'Havalimanı - Ofis transferi. İş seyahati dönüşü.',
        ocrConfidence: 96,
        receiptImage: 'taksi_fisi'
    },
    {
        type: 'yemek',
        belgeTuru: 'fatura',
        belgeNo: 'FTR-2024-00892',
        belgeTarihi: '2024-12-10',
        firmaAdi: 'KEBAPÇI MAHMUT USTA',
        vergiNo: '1234567890',
        brutTutar: 1250.00,
        kdvOrani: 10,
        hesapKodu: '770.01',
        aciklama: 'Müşteri toplantısı iş yemeği - 5 kişi',
        ocrConfidence: 94,
        receiptImage: 'yemek_faturasi'
    },
    {
        type: 'ofis',
        belgeTuru: 'fatura',
        belgeNo: 'FTR-2024-45123',
        belgeTarihi: '2024-12-08',
        firmaAdi: 'KIRTASIYE MARKET A.Ş.',
        vergiNo: '5678901234',
        brutTutar: 2800.00,
        kdvOrani: 20,
        hesapKodu: '770.04',
        aciklama: 'Ofis malzemesi alımı - Kağıt, kalem, dosya',
        ocrConfidence: 98,
        receiptImage: 'ofis_faturasi'
    },
    {
        type: 'kahve',
        belgeTuru: 'fis',
        belgeNo: 'YKF-2024-33256',
        belgeTarihi: '2024-12-05',
        firmaAdi: 'STARBUCKS COFFEE TURKEY',
        vergiNo: '3456789012',
        brutTutar: 285.00,
        kdvOrani: 10,
        hesapKodu: '770.01',
        aciklama: 'Ekip toplantısı kahve ve içecek masrafı',
        ocrConfidence: 92,
        receiptImage: 'kahve_fisi'
    },
    {
        type: 'konaklama',
        belgeTuru: 'fatura',
        belgeNo: 'FTR-2024-78456',
        belgeTarihi: '2024-12-07',
        firmaAdi: 'HILTON ISTANBUL BOMONTI',
        vergiNo: '7891234560',
        brutTutar: 4500.00,
        kdvOrani: 10,
        hesapKodu: '770.03',
        aciklama: 'İş seyahati konaklama - 2 gece',
        ocrConfidence: 97,
        receiptImage: 'otel_faturasi'
    },
    {
        type: 'benzin',
        belgeTuru: 'fis',
        belgeNo: 'YKF-2024-99123',
        belgeTarihi: '2024-12-06',
        firmaAdi: 'SHELL & TURCAS PETROL A.Ş.',
        vergiNo: '4567890123',
        brutTutar: 1850.00,
        kdvOrani: 20,
        hesapKodu: '770.02',
        aciklama: 'Araç yakıt alımı - Şirket aracı',
        ocrConfidence: 95,
        receiptImage: 'benzin_fisi'
    }
];

// Seçilen örnek fiş indexi
let currentReceiptIndex = 0;

// Mobile Menu Toggle
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.mobile-overlay');

    if (sidebar) {
        sidebar.classList.toggle('active');
        sidebar.classList.toggle('open');
    }
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.mobile-overlay');

    if (sidebar) {
        sidebar.classList.remove('active');
        sidebar.classList.remove('open');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// ========================================
// GELİŞMİŞ OCR SİMÜLASYONU
// ========================================

function initFileUpload() {
    const uploadArea = document.querySelector('.file-upload-area');
    const fileInput = document.getElementById('fileInput');

    if (!uploadArea || !fileInput) return;

    // Drag and drop events
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

function handleFiles(files) {
    for (let file of files) {
        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
            processFileWithOCR(file);
        } else {
            showAlert('error', 'Sadece resim (JPG, PNG) veya PDF dosyaları yükleyebilirsiniz.');
        }
    }
}

function processFileWithOCR(file) {
    // Loading UI
    const uploadArea = document.querySelector('.file-upload-area');
    const originalContent = uploadArea.innerHTML;

    uploadArea.innerHTML = `
        <div class="ocr-loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">🤖 Yapay Zeka belgeyi analiz ediyor...</div>
            <div class="loading-steps">
                <div class="step active" id="step1">📷 Görüntü işleniyor...</div>
                <div class="step" id="step2">🔍 Metin tanıma yapılıyor...</div>
                <div class="step" id="step3">📊 Veriler çıkarılıyor...</div>
                <div class="step" id="step4">✅ Kontrol ediliyor...</div>
            </div>
        </div>
    `;

    // Simüle edilmiş OCR işlemi
    simulateOCRProcess(file, originalContent);
}

function simulateOCRProcess(file, originalContent) {
    const steps = ['step1', 'step2', 'step3', 'step4'];
    let currentStep = 0;

    const stepInterval = setInterval(() => {
        if (currentStep < steps.length) {
            document.getElementById(steps[currentStep])?.classList.add('completed');
            currentStep++;
            if (currentStep < steps.length) {
                document.getElementById(steps[currentStep])?.classList.add('active');
            }
        }
    }, 600);

    // OCR tamamlandıktan sonra
    setTimeout(() => {
        clearInterval(stepInterval);

        // Rastgele bir örnek fiş seç
        currentReceiptIndex = Math.floor(Math.random() * sampleReceipts.length);
        const ocrData = sampleReceipts[currentReceiptIndex];

        // Upload alanını geri yükle
        const uploadArea = document.querySelector('.file-upload-area');
        uploadArea.innerHTML = originalContent;

        // OCR sonuçlarını göster
        displayOCRResults(file, ocrData);

        // Form alanlarını doldur
        fillFormWithOCRData(ocrData);

        // Yüklenen dosyalar listesine ekle
        addUploadedFile(file, ocrData);

        showAlert('success', `Belge başarıyla okundu! OCR Güven Skoru: %${ocrData.ocrConfidence}`);
    }, 2800);
}

function displayOCRResults(file, ocrData) {
    const ocrPreview = document.querySelector('.ocr-preview');
    if (!ocrPreview) return;

    ocrPreview.classList.add('active');

    const kdvTutar = ocrData.brutTutar * ocrData.kdvOrani / 100;
    const netTutar = ocrData.brutTutar - kdvTutar;

    ocrPreview.innerHTML = `
        <h3 style="font-size: 16px; margin-bottom: 16px; color: var(--primary-orange);">
            ✅ OCR ile Okunan Veriler
        </h3>
        <div class="alert alert-success" style="margin-bottom: 16px;">
            <span class="alert-icon">🤖</span>
            <div>
                <strong>Yapay Zeka Analizi Tamamlandı!</strong><br>
                <small>Güven Skoru: %${ocrData.ocrConfidence} - Lütfen bilgileri kontrol ediniz.</small>
            </div>
        </div>

        <div class="ocr-result-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <!-- Fiş Görseli -->
            <div class="receipt-preview" style="background: #f8f9fa; padding: 16px; border-radius: 8px;">
                <h4 style="font-size: 14px; margin-bottom: 12px; color: var(--text-secondary);">📄 Belge Önizleme</h4>
                ${generateReceiptPreview(ocrData)}
            </div>

            <!-- Okunan Veriler -->
            <div class="ocr-fields">
                <h4 style="font-size: 14px; margin-bottom: 12px; color: var(--text-secondary);">📋 Okunan Alanlar</h4>
                <div class="ocr-field-list" style="display: grid; gap: 8px;">
                    <div class="ocr-field-item" style="display: flex; justify-content: space-between; padding: 8px; background: white; border-radius: 6px; border: 1px solid var(--border-color);">
                        <span style="color: var(--text-secondary); font-size: 13px;">Belge No:</span>
                        <span style="font-weight: 500;">${ocrData.belgeNo}</span>
                        <span class="confidence-indicator" style="color: var(--success-dark); font-size: 11px;">✓ %98</span>
                    </div>
                    <div class="ocr-field-item" style="display: flex; justify-content: space-between; padding: 8px; background: white; border-radius: 6px; border: 1px solid var(--border-color);">
                        <span style="color: var(--text-secondary); font-size: 13px;">Firma:</span>
                        <span style="font-weight: 500; font-size: 12px;">${ocrData.firmaAdi}</span>
                        <span class="confidence-indicator" style="color: var(--success-dark); font-size: 11px;">✓ %${ocrData.ocrConfidence}</span>
                    </div>
                    <div class="ocr-field-item" style="display: flex; justify-content: space-between; padding: 8px; background: white; border-radius: 6px; border: 1px solid var(--border-color);">
                        <span style="color: var(--text-secondary); font-size: 13px;">Vergi No:</span>
                        <span style="font-weight: 500;">${ocrData.vergiNo}</span>
                        <span class="confidence-indicator" style="color: var(--success-dark); font-size: 11px;">✓ %99</span>
                    </div>
                    <div class="ocr-field-item" style="display: flex; justify-content: space-between; padding: 8px; background: white; border-radius: 6px; border: 1px solid var(--border-color);">
                        <span style="color: var(--text-secondary); font-size: 13px;">Tarih:</span>
                        <span style="font-weight: 500;">${formatDate(ocrData.belgeTarihi)}</span>
                        <span class="confidence-indicator" style="color: var(--success-dark); font-size: 11px;">✓ %97</span>
                    </div>
                    <div class="ocr-field-item" style="display: flex; justify-content: space-between; padding: 8px; background: linear-gradient(135deg, var(--primary-orange), #F4A460); border-radius: 6px; color: white;">
                        <span style="font-size: 13px;">Toplam:</span>
                        <span style="font-weight: 700; font-size: 16px;">₺${ocrData.brutTutar.toFixed(2)}</span>
                        <span style="font-size: 11px;">✓ %${ocrData.ocrConfidence}</span>
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-top: 16px; padding: 12px; background: #E3F2FD; border-radius: 8px; font-size: 13px; color: #1565C0;">
            💡 <strong>İpucu:</strong> Yukarıdaki bilgiler otomatik olarak form alanlarına aktarıldı. Hatalı alanları manuel olarak düzeltebilirsiniz.
        </div>
    `;
}

function generateReceiptPreview(ocrData) {
    const kdvTutar = ocrData.brutTutar * ocrData.kdvOrani / 100;
    const netTutar = ocrData.brutTutar - kdvTutar;

    // Fiş türüne göre farklı görsel
    if (ocrData.belgeTuru === 'fis') {
        return `
            <div style="background: white; border: 1px dashed #ccc; border-radius: 4px; padding: 16px; font-family: 'Courier New', monospace; font-size: 11px; max-width: 220px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="text-align: center; border-bottom: 1px dashed #999; padding-bottom: 8px; margin-bottom: 8px;">
                    <strong style="font-size: 12px;">${ocrData.firmaAdi}</strong>
                </div>
                <div style="margin-bottom: 8px;">
                    VKN: ${ocrData.vergiNo}<br>
                    Tarih: ${formatDate(ocrData.belgeTarihi)}<br>
                    Fiş No: ${ocrData.belgeNo}
                </div>
                <div style="border-top: 1px dashed #999; border-bottom: 1px dashed #999; padding: 8px 0; margin: 8px 0;">
                    ${ocrData.type === 'taksi' ? 'Yolculuk Ücreti' : ocrData.type === 'kahve' ? 'İçecekler' : ocrData.type === 'benzin' ? 'Yakıt Alımı' : 'Ürünler'}
                    <div style="float: right;">₺${netTutar.toFixed(2)}</div>
                    <div style="clear: both;"></div>
                </div>
                <div>
                    KDV (%${ocrData.kdvOrani}): <span style="float: right;">₺${kdvTutar.toFixed(2)}</span>
                    <div style="clear: both;"></div>
                </div>
                <div style="border-top: 2px solid #333; margin-top: 8px; padding-top: 8px; font-weight: bold;">
                    TOPLAM: <span style="float: right; font-size: 14px;">₺${ocrData.brutTutar.toFixed(2)}</span>
                    <div style="clear: both;"></div>
                </div>
                <div style="text-align: center; margin-top: 12px; font-size: 9px; color: #666;">
                    * TEŞEKKÜR EDERİZ *
                </div>
            </div>
        `;
    } else {
        // Fatura görseli
        return `
            <div style="background: white; border: 2px solid #333; border-radius: 4px; padding: 16px; font-family: Arial, sans-serif; font-size: 11px; max-width: 260px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 12px;">
                    <strong style="font-size: 14px;">FATURA</strong><br>
                    <span style="font-size: 10px; color: #666;">${ocrData.belgeNo}</span>
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>${ocrData.firmaAdi}</strong><br>
                    <span style="font-size: 10px;">VKN: ${ocrData.vergiNo}</span>
                </div>
                <div style="background: #f5f5f5; padding: 8px; border-radius: 4px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Tarih:</span>
                        <span>${formatDate(ocrData.belgeTarihi)}</span>
                    </div>
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 4px 0;">Mal/Hizmet Bedeli</td>
                        <td style="text-align: right;">₺${netTutar.toFixed(2)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 4px 0;">KDV (%${ocrData.kdvOrani})</td>
                        <td style="text-align: right;">₺${kdvTutar.toFixed(2)}</td>
                    </tr>
                    <tr style="font-weight: bold; font-size: 12px;">
                        <td style="padding: 8px 0;">GENEL TOPLAM</td>
                        <td style="text-align: right;">₺${ocrData.brutTutar.toFixed(2)}</td>
                    </tr>
                </table>
            </div>
        `;
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR');
}

function fillFormWithOCRData(data) {
    // Belge türü seç
    const belgeTuruSelect = document.getElementById('belgeTuru');
    if (belgeTuruSelect) {
        belgeTuruSelect.value = data.belgeTuru === 'fis' ? 'fis' : 'fatura';
    }

    // Form alanlarını doldur
    const fields = {
        'belgeNo': data.belgeNo,
        'belgeTarihi': data.belgeTarihi,
        'firmaAdi': data.firmaAdi,
        'vergiNo': data.vergiNo,
        'brutTutar': data.brutTutar.toFixed(2),
        'kdvOrani': data.kdvOrani.toString(),
        'aciklama': data.aciklama
    };

    for (let [id, value] of Object.entries(fields)) {
        const input = document.getElementById(id);
        if (input) {
            input.value = value;
            // Animasyonlu dolum efekti
            input.style.backgroundColor = '#E8F5E9';
            setTimeout(() => {
                input.style.backgroundColor = '';
            }, 1000);
        }
    }

    // Hesap kodu seç
    const hesapKoduSelect = document.getElementById('hesapKodu');
    if (hesapKoduSelect && data.hesapKodu) {
        for (let option of hesapKoduSelect.options) {
            if (option.value.startsWith(data.hesapKodu)) {
                hesapKoduSelect.value = option.value;
                break;
            }
        }
    }

    // Tutar hesaplamalarını güncelle
    updateAmountSummary();
}

function addUploadedFile(file, data) {
    const uploadedFiles = document.querySelector('.uploaded-files');
    if (!uploadedFiles) return;

    const fileItem = document.createElement('div');
    fileItem.className = 'uploaded-file';
    fileItem.innerHTML = `
        <span class="uploaded-file-icon">${file.type === 'application/pdf' ? '📄' : '🖼️'}</span>
        <div class="uploaded-file-info">
            <div class="uploaded-file-name">${file.name || 'telefon_kamera_' + Date.now() + '.jpg'}</div>
            <div class="uploaded-file-size">${formatFileSize(file.size || 1024000)} • ${data.firmaAdi} • ₺${data.brutTutar.toFixed(2)}</div>
        </div>
        <div class="uploaded-file-status">
            <span class="status-badge status-approved">OCR %${data.ocrConfidence}</span>
            <button class="uploaded-file-remove" onclick="removeUploadedFile(this)" title="Kaldır">✕</button>
        </div>
    `;

    uploadedFiles.appendChild(fileItem);
}

function removeUploadedFile(btn) {
    const fileItem = btn.closest('.uploaded-file');
    if (fileItem) {
        fileItem.remove();
    }
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ========================================
// TUTAR HESAPLAMALARI
// ========================================

function updateAmountSummary() {
    const brutTutar = parseFloat(document.getElementById('brutTutar')?.value) || 0;
    const kdvOrani = parseFloat(document.getElementById('kdvOrani')?.value) || 0;
    const kdvTutari = brutTutar * kdvOrani / 100;
    const netTutar = brutTutar - kdvTutari;

    // Update fields
    const kdvTutariInput = document.getElementById('kdvTutari');
    const netTutarInput = document.getElementById('netTutar');

    if (kdvTutariInput) kdvTutariInput.value = kdvTutari.toFixed(2);
    if (netTutarInput) netTutarInput.value = netTutar.toFixed(2);

    // Update summary
    const summaryElements = {
        'summaryBrut': '₺' + brutTutar.toFixed(2),
        'summaryKdv': '₺' + kdvTutari.toFixed(2),
        'summaryNet': '₺' + netTutar.toFixed(2),
        'summaryTotal': '₺' + brutTutar.toFixed(2)
    };

    for (let [id, value] of Object.entries(summaryElements)) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }
}

// ========================================
// ALERT SİSTEMİ
// ========================================

function showAlert(type, message) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span class="alert-icon">${icons[type]}</span>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; margin-left: auto;">×</button>
    `;
    alert.style.display = 'flex';
    alert.style.alignItems = 'center';

    alertContainer.appendChild(alert);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// ========================================
// FORM İŞLEMLERİ
// ========================================

function validateMasrafForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalid = null;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--warning-red)';
            field.style.boxShadow = '0 0 0 3px rgba(255, 82, 82, 0.1)';
            isValid = false;
            if (!firstInvalid) firstInvalid = field;
        } else {
            field.style.borderColor = 'var(--border-color)';
            field.style.boxShadow = '';
        }
    });

    if (!isValid) {
        showAlert('error', 'Lütfen zorunlu alanları doldurunuz.');
        if (firstInvalid) firstInvalid.focus();
    }

    return isValid;
}

function saveDraft() {
    const formData = collectFormData();
    localStorage.setItem('masrafTaslak', JSON.stringify(formData));
    showAlert('success', '💾 Taslak başarıyla kaydedildi.');
}

function loadDraft() {
    const draft = localStorage.getItem('masrafTaslak');
    if (draft) {
        const formData = JSON.parse(draft);
        for (let [id, value] of Object.entries(formData)) {
            const input = document.getElementById(id);
            if (input) {
                input.value = value;
            }
        }
        updateAmountSummary();
        showAlert('info', '📂 Taslak yüklendi.');
    }
}

function collectFormData() {
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    const data = {};

    inputs.forEach(input => {
        if (input.id) {
            data[input.id] = input.value;
        }
    });

    return data;
}

function submitMasrafForm() {
    if (!validateMasrafForm()) return;

    // Loading state
    showAlert('info', '📤 Masraf formu gönderiliyor...');

    setTimeout(() => {
        // Clear draft
        localStorage.removeItem('masrafTaslak');

        // Show success message
        showAlert('success', '🎉 Masraf formu başarıyla gönderildi! Onay sürecine alındı.');

        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'masraf-listesi.html';
        }, 2000);
    }, 1500);
}

// ========================================
// TABS VE FİLTRELEME
// ========================================

function initTabs() {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

function initSearch() {
    const searchInput = document.querySelector('.search-bar input') || document.querySelector('.filter-controls input[type="text"]');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.request-card');
        const rows = document.querySelectorAll('.data-table tbody tr');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? 'block' : 'none';
        });

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    });
}

function filterByStatus(status) {
    const cards = document.querySelectorAll('.request-card');

    cards.forEach(card => {
        if (status === 'all') {
            card.style.display = 'block';
        } else {
            const badge = card.querySelector('.status-badge');
            if (badge && badge.classList.contains(`status-${status}`)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });

    // Tab aktifliğini güncelle
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase().includes(status) || (status === 'all' && tab.textContent.includes('Tümü'))) {
            tab.classList.add('active');
        }
    });
}

// ========================================
// ONAY İŞLEMLERİ
// ========================================

function approveRequest(requestId) {
    if (confirm('Bu masraf talebini onaylamak istediğinize emin misiniz?')) {
        showAlert('success', `✅ Talep #MSR-2024-${requestId} onaylandı.`);
        // Satırı güncelle
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
}

function rejectRequest(requestId) {
    const reason = prompt('Red nedenini giriniz:');
    if (reason) {
        showAlert('warning', `❌ Talep #MSR-2024-${requestId} reddedildi.\nNeden: ${reason}`);
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
}

// ========================================
// DÖVİZ ÇEVİRİMİ
// ========================================

function convertCurrency() {
    const amount = parseFloat(document.getElementById('yurtdisiTutar')?.value) || 0;
    const rate = parseFloat(document.getElementById('kurOrani')?.value) || 1;
    const tlAmount = amount * rate;

    const tlAmountInput = document.getElementById('tlKarsiligi');
    if (tlAmountInput) {
        tlAmountInput.value = tlAmount.toFixed(2);
    }
}

// ========================================
// TELEFON KAMERASI OCR SİMÜLASYONU
// ========================================

// Sayfa yüklendiğinde gösterilecek örnek fiş verisi
const preloadedReceiptData = {
    type: 'yemek',
    belgeTuru: 'fis',
    belgeNo: 'YKF-2024-847521',
    belgeTarihi: '2024-12-09',
    firmaAdi: 'KARADENIZ SOFRASI',
    vergiNo: '1234567890',
    brutTutar: 585.00,
    kdvOrani: 10,
    hesapKodu: '770.01',
    aciklama: 'Müşteri toplantısı öğle yemeği - Karadeniz Sofrası',
    ocrConfidence: 94,
    receiptImage: 'yemek_fisi'
};

// Farklı fiş örnekleri (Yeniden Çek butonu için)
const receiptVariants = [
    {
        logo: '🍽️',
        company: 'KARADENIZ SOFRASI',
        companySub: 'Restoran & Lokanta',
        date: '09.12.2024',
        time: '13:45',
        receiptNo: 'YKF-2024-847521',
        items: [
            { name: '2x Karışık Izgara', price: '₺380.00' },
            { name: '2x Pilav', price: '₺60.00' },
            { name: '2x İçecek', price: '₺50.00' },
            { name: '1x Künefe', price: '₺95.00' }
        ],
        total: '₺585.00',
        kdv: 'KDV (%10)',
        kdvAmount: '₺53.18',
        vkn: '1234567890',
        data: preloadedReceiptData
    },
    {
        logo: '☕',
        company: 'STARBUCKS COFFEE',
        companySub: 'Kahve & İçecek',
        date: '10.12.2024',
        time: '09:30',
        receiptNo: 'SBX-2024-33892',
        items: [
            { name: '3x Latte Grande', price: '₺180.00' },
            { name: '2x Cheesecake', price: '₺140.00' },
            { name: '1x Sandwich', price: '₺95.00' }
        ],
        total: '₺415.00',
        kdv: 'KDV (%10)',
        kdvAmount: '₺37.73',
        vkn: '3456789012',
        data: {
            type: 'kahve',
            belgeTuru: 'fis',
            belgeNo: 'SBX-2024-33892',
            belgeTarihi: '2024-12-10',
            firmaAdi: 'STARBUCKS COFFEE TURKEY',
            vergiNo: '3456789012',
            brutTutar: 415.00,
            kdvOrani: 10,
            hesapKodu: '770.01',
            aciklama: 'Ekip kahvaltısı toplantısı - Starbucks',
            ocrConfidence: 96
        }
    },
    {
        logo: '⛽',
        company: 'SHELL PETROL',
        companySub: 'Akaryakıt İstasyonu',
        date: '08.12.2024',
        time: '16:20',
        receiptNo: 'SHL-2024-78452',
        items: [
            { name: '45.2 Lt Benzin (95)', price: '₺1,850.00' },
            { name: 'Cam Suyu', price: '₺45.00' }
        ],
        total: '₺1,895.00',
        kdv: 'KDV (%20)',
        kdvAmount: '₺315.83',
        vkn: '4567890123',
        data: {
            type: 'benzin',
            belgeTuru: 'fis',
            belgeNo: 'SHL-2024-78452',
            belgeTarihi: '2024-12-08',
            firmaAdi: 'SHELL & TURCAS PETROL A.Ş.',
            vergiNo: '4567890123',
            brutTutar: 1895.00,
            kdvOrani: 20,
            hesapKodu: '770.02',
            aciklama: 'Şirket aracı yakıt alımı - Shell',
            ocrConfidence: 98
        }
    },
    {
        logo: '🚕',
        company: 'BITAKSI',
        companySub: 'Ulaşım Hizmetleri',
        date: '10.12.2024',
        time: '08:15',
        receiptNo: 'BTX-2024-99123',
        items: [
            { name: 'Yolculuk Ücreti', price: '₺285.00' },
            { name: 'Köprü Geçişi', price: '₺65.00' }
        ],
        total: '₺350.00',
        kdv: 'KDV (%20)',
        kdvAmount: '₺58.33',
        vkn: '9876543210',
        data: {
            type: 'taksi',
            belgeTuru: 'fis',
            belgeNo: 'BTX-2024-99123',
            belgeTarihi: '2024-12-10',
            firmaAdi: 'BITAKSI ULAŞIM TEKNOLOJİ A.Ş.',
            vergiNo: '9876543210',
            brutTutar: 350.00,
            kdvOrani: 20,
            hesapKodu: '770.02',
            aciklama: 'Havalimanı - Ofis transferi, iş seyahati',
            ocrConfidence: 97
        }
    }
];

let currentVariantIndex = 0;

// OCR İşlemi - "OCR ile Oku" butonuna tıklandığında
function processOCR() {
    const documentPreviewCard = document.getElementById('documentPreviewCard');
    const ocrProcessing = document.getElementById('ocrProcessing');
    const ocrSuccess = document.getElementById('ocrSuccess');

    // Belge önizlemesini geçici olarak gizle
    if (documentPreviewCard) {
        documentPreviewCard.style.display = 'none';
    }

    // OCR işlem animasyonunu göster
    if (ocrProcessing) {
        ocrProcessing.style.display = 'block';

        // Adım adım işlem animasyonu
        const steps = ['step1', 'step2', 'step3', 'step4'];
        let currentStep = 0;

        const stepInterval = setInterval(() => {
            if (currentStep > 0) {
                document.getElementById(steps[currentStep - 1])?.classList.add('completed');
                document.getElementById(steps[currentStep - 1])?.classList.remove('active');
            }

            if (currentStep < steps.length) {
                document.getElementById(steps[currentStep])?.classList.add('active');
                currentStep++;
            } else {
                clearInterval(stepInterval);
            }
        }, 700);

        // 3 saniye sonra başarılı sonucu göster
        setTimeout(() => {
            ocrProcessing.style.display = 'none';

            // Belge önizlemesini tekrar göster
            if (documentPreviewCard) {
                documentPreviewCard.style.display = 'block';
            }

            if (ocrSuccess) {
                ocrSuccess.style.display = 'block';
            }

            // Mevcut fiş verisini al
            const currentReceipt = receiptVariants[currentVariantIndex];

            // OCR güven skorunu güncelle
            const confidenceTag = document.getElementById('ocrConfidenceTag');
            if (confidenceTag) {
                confidenceTag.textContent = `%${currentReceipt.data.ocrConfidence} Başarılı`;
            }

            // Form alanlarını doldur (animasyonlu)
            fillFormWithOCRDataAnimated(currentReceipt.data);

            // Başarı mesajı
            showAlert('success', `Belge başarıyla okundu! OCR Güven Skoru: %${currentReceipt.data.ocrConfidence}`);

        }, 3200);
    }
}

// Yeniden Çek - Farklı bir fiş örneği göster
function retakePhoto() {
    currentVariantIndex = (currentVariantIndex + 1) % receiptVariants.length;
    const newReceipt = receiptVariants[currentVariantIndex];

    // Fiş görselini güncelle
    updateReceiptVisual(newReceipt);

    // OCR sonuçlarını sıfırla
    const ocrSuccess = document.getElementById('ocrSuccess');
    if (ocrSuccess) {
        ocrSuccess.style.display = 'none';
    }

    showAlert('info', '📸 Yeni fotoğraf çekildi!');
}

// Fiş görselini güncelle (Yeni basit stil)
function updateReceiptVisual(receipt) {
    const receiptSimple = document.getElementById('receiptSimple');
    if (!receiptSimple) return;

    // Items HTML oluştur
    let itemsHTML = '';
    receipt.items.forEach(item => {
        itemsHTML += `
            <div class="receipt-simple-item">
                <span>${item.name}</span>
                <span>${item.price}</span>
            </div>
        `;
    });

    receiptSimple.innerHTML = `
        <div class="receipt-simple-header">
            <strong class="receipt-simple-company">${receipt.company}</strong>
            <span class="receipt-simple-sub">${receipt.companySub}</span>
        </div>
        <div class="receipt-simple-divider"></div>
        <div class="receipt-simple-info">
            VKN: ${receipt.vkn}<br>
            Tarih: ${receipt.date} ${receipt.time}<br>
            Fiş No: ${receipt.receiptNo}
        </div>
        <div class="receipt-simple-divider"></div>
        <div class="receipt-simple-items">
            ${itemsHTML}
        </div>
        <div class="receipt-simple-totals">
            <div class="receipt-simple-item">
                <span>${receipt.kdv}</span>
                <span>${receipt.kdvAmount}</span>
            </div>
            <div class="receipt-simple-item total">
                <strong>TOPLAM</strong>
                <strong>${receipt.total}</strong>
            </div>
        </div>
        <div class="receipt-simple-footer">
            * TEŞEKKÜRLER *<br>
            Bu belge mali değer taşır
        </div>
    `;

    // OCR Güven skorunu güncelle
    const confidenceTag = document.getElementById('ocrConfidenceTag');
    if (confidenceTag && receipt.data) {
        confidenceTag.textContent = `%${receipt.data.ocrConfidence} Başarılı`;
    }

    // Basit animasyon efekti
    receiptSimple.style.transform = 'scale(0.98)';
    receiptSimple.style.opacity = '0.7';
    setTimeout(() => {
        receiptSimple.style.transform = 'scale(1)';
        receiptSimple.style.opacity = '1';
    }, 200);
}

// Form alanlarını animasyonlu doldur
function fillFormWithOCRDataAnimated(data) {
    const fields = [
        { id: 'belgeTuru', value: data.belgeTuru === 'fis' ? 'fis' : 'fatura', delay: 100 },
        { id: 'belgeNo', value: data.belgeNo, delay: 200 },
        { id: 'belgeTarihi', value: data.belgeTarihi, delay: 300 },
        { id: 'firmaAdi', value: data.firmaAdi, delay: 400 },
        { id: 'vergiNo', value: data.vergiNo, delay: 500 },
        { id: 'brutTutar', value: data.brutTutar.toFixed(2), delay: 600 },
        { id: 'kdvOrani', value: data.kdvOrani.toString(), delay: 700 },
        { id: 'hesapKodu', value: data.hesapKodu, delay: 800 },
        { id: 'aciklama', value: data.aciklama, delay: 900 }
    ];

    fields.forEach(field => {
        setTimeout(() => {
            const input = document.getElementById(field.id);
            if (input) {
                input.value = field.value;
                input.classList.add('ocr-filled');

                // Smooth scroll to show the field
                if (field.id === 'belgeNo') {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                // Animasyon sınıfını kaldır
                setTimeout(() => {
                    input.classList.remove('ocr-filled');
                }, 2000);
            }
        }, field.delay);
    });

    // Tutar hesaplamalarını güncelle
    setTimeout(() => {
        updateAmountSummary();
    }, 1000);
}

// Eski kamera fonksiyonu (uyumluluk için)
function openCamera() {
    showAlert('info', '📷 Kamera açılıyor...');
    setTimeout(() => {
        const fakeFile = new File([''], 'telefon_kamera.jpg', { type: 'image/jpeg' });
        processFileWithOCR(fakeFile);
    }, 1000);
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initFileUpload();
    initTabs();
    initSearch();

    // Bind calculation events
    const brutTutar = document.getElementById('brutTutar');
    const kdvOrani = document.getElementById('kdvOrani');

    if (brutTutar) brutTutar.addEventListener('input', updateAmountSummary);
    if (kdvOrani) kdvOrani.addEventListener('change', updateAmountSummary);

    // Load draft if exists
    if (localStorage.getItem('masrafTaslak') && document.getElementById('brutTutar')) {
        if (confirm('Kaydedilmiş bir taslağınız var. Yüklemek ister misiniz?')) {
            loadDraft();
        }
    }

    // CSS for loading animation
    const style = document.createElement('style');
    style.textContent = `
        .ocr-loading {
            padding: 40px;
            text-align: center;
        }
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--primary-orange);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loading-text {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 20px;
        }
        .loading-steps {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-width: 250px;
            margin: 0 auto;
        }
        .loading-steps .step {
            padding: 8px 12px;
            background: #f5f5f5;
            border-radius: 6px;
            font-size: 13px;
            color: var(--text-secondary);
            transition: all 0.3s;
        }
        .loading-steps .step.active {
            background: #FFF3CD;
            color: #856404;
        }
        .loading-steps .step.completed {
            background: #D4EDDA;
            color: #155724;
        }
    `;
    document.head.appendChild(style);
});
