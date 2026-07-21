
let priceListCache = [];

// Hàm chính được gọi khi click vào menu "Prices"
async function showPrices() {
    renderPriceManagementLayout('content');
    await loadPricesData();
}

// 1. Dựng khung giao diện HTML
function renderPriceManagementLayout(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="price-management-wrapper">
            <div class="page-header">
                <div>
                    <h2 class="price-page-title">Quản lý Bảng giá</h2>
                    <p class="price-page-subtitle">Cấu hình đơn giá dịch vụ theo loại thú cưng và khoảng cân nặng</p>
                </div>
                <div class="price-header-actions">
                    <div class="price-search-box">
                        <i class="fa-solid fa-magnifying-glass price-search-icon"></i>
                        <input type="text" class="price-search-input" id="searchPriceInput" placeholder="Tìm kiếm loại thú cưng..." onkeyup="filterPriceData()">
                    </div>
                    <button class="btn-add-price" onclick="openAddPriceModal()">
                        <i class="fa-solid fa-plus"></i> Thêm cấu hình giá
                    </button>
                </div>
            </div>

            <div class="price-table-container">
                <table class="price-custom-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Loại Thú Cưng</th>
                            <th>Cân Nặng Từ (kg)</th>
                            <th>Cân Nặng Đến (kg)</th>
                            <th>Đơn Giá Cơ Bản (VNĐ)</th>
                            <th style="text-align: center;">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody id="priceTableBody">
                        <tr>
                            <td colspan="6" style="text-align: center; color: #64748b; padding: 24px;">Đang tải dữ liệu...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 2. Gọi API GET từ cấu hình API chung
async function loadPricesData() {
    try {
        const response = await fetch(API.prices, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Không thể tải dữ liệu bảng giá từ server!');
        }

        priceListCache = await response.json();
        prices = priceListCache; // Đồng bộ vào biến global nếu cần sử dụng chung
        renderPriceTable(priceListCache);

    } catch (error) {
        console.error('Lỗi:', error);
        const tbody = document.getElementById('priceTableBody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #ef4444; padding: 24px;">Lỗi tải dữ liệu: ${error.message}</td></tr>`;
        }
    }
}

// 3. Đổ dữ liệu vào bảng HTML
function renderPriceTable(data) {
    const tbody = document.getElementById('priceTableBody');
    console.log(data);
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b; padding: 24px;">Không có cấu hình giá nào.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><span class="price-badge-tag">${item.petType || ''}</span></td>
            <td>${item.weightFrom !== undefined && item.weightFrom !== null ? item.weightFrom : ''}</td>
            <td>${item.weightTo !== undefined && item.weightTo !== null ? item.weightTo : ''}</td>
            <td class="price-highlight">${formatCurrency(item.basePrice)}</td>
            <td style="text-align: center;">
                <div class="price-action-group">
                    <button class="price-action-btn" title="Chỉnh sửa" onclick="editPrice(${item.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="price-action-btn price-text-danger" title="Xóa" onclick="deletePrice(${item.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Hàm format tiền tệ VNĐ
function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '0 đ';
    return Number(amount).toLocaleString('vi-VN') + ' đ';
}

// 4. Tìm kiếm cục bộ trên danh sách đã tải
function filterPriceData() {
    const keyword = document.getElementById('searchPriceInput').value.toLowerCase();
    const filtered = priceListCache.filter(item => 
        item.petType && item.petType.toLowerCase().includes(keyword)
    );
    renderPriceTable(filtered);
}

// ==========================================
// 5. MODAL & XỬ LÝ CRUD (THÊM / SỬA / XÓA)
// ==========================================

let currentEditingPriceId = null;

// Mở Modal Thêm mới
function openAddPriceModal() {
    currentEditingPriceId = null;
    showPriceModal("Thêm cấu hình giá mới", {
        petType: "",
        weightFrom: "",
        weightTo: "",
        basePrice: ""
    });
}
// Mở Modal Chỉnh sửa (Lấy dữ liệu từ cache có sẵn để mở tức thì)
function editPrice(id) {
    currentEditingPriceId = id;
    
    // Tìm kiếm dữ liệu của dòng đó trong priceListCache đã lưu
    const priceData = priceListCache.find(item => item.id === id);
    
    if (priceData) {
        // Truyền đầy đủ object dữ liệu vào modal
        showPriceModal("Cập nhật cấu hình giá", priceData);
    } else {
        // Fallback gọi API chi tiết nếu không tìm thấy trong cache
        fetch(`${API.prices}/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) throw new Error('Không thể lấy thông tin cấu hình giá!');
            return response.json();
        })
        .then(data => {
            showPriceModal("Cập nhật cấu hình giá", data);
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Không thể tải thông tin chi tiết để sửa.');
        });
    }
}
// Dựng giao diện Modal
function showPriceModal(title, data) {
    const existingModal = document.getElementById('priceModalContainer');
    if (existingModal) existingModal.remove();

    const modalHTML = `
        <div id="priceModalContainer" class="price-modal-overlay" style="display: flex;">
            <div class="price-modal-content">
                <div class="price-modal-header">
                    <h3>${title}</h3>
                    <button class="price-modal-close" onclick="closePriceModal()">&times;</button>
                </div>
                <form id="priceForm" onsubmit="handlePriceFormSubmit(event)">
                    <div class="price-form-group">
                        <label>Loại thú cưng (Pet Type)</label>
                        <input type="text" id="modalPetType" class="price-form-input" value="${data.petType || ''}" required placeholder="Ví dụ: Dog, Cat...">
                    </div>
                    <div class="price-form-row">
                        <div class="price-form-group">
                            <label>Cân nặng từ (kg)</label>
                            <input type="number" step="0.1" id="modalWeightFrom" class="price-form-input" value="${data.weightFrom !== undefined && data.weightFrom !== null ? data.weightFrom : ''}" required placeholder="0.0">
                        </div>
                        <div class="price-form-group">
                            <label>Cân nặng đến (kg)</label>
                            <input type="number" step="0.1" id="modalWeightTo" class="price-form-input" value="${data.weightTo !== undefined && data.weightTo !== null ? data.weightTo : ''}" required placeholder="10.0">
                        </div>
                    </div>
                    <div class="price-form-group">
                        <label>Đơn giá cơ bản (VNĐ)</label>
                        <input type="number" step="1000" id="modalBasePrice" class="price-form-input" value="${data.basePrice !== undefined && data.basePrice !== null ? data.basePrice : ''}" required placeholder="150000">
                    </div>
                    <div class="price-modal-actions">
                        <button type="button" class="price-btn-secondary" onclick="closePriceModal()">Hủy</button>
                        <button type="submit" class="price-btn-primary">Lưu lại</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Đóng Modal
function closePriceModal() {
    const modal = document.getElementById('priceModalContainer');
    if (modal) modal.remove();
}

// Xử lý Submit Form (POST hoặc PUT dựa vào ID)
async function handlePriceFormSubmit(event) {
    event.preventDefault();

    const payload = {
        petType: document.getElementById('modalPetType').value.trim(),
        weightFrom: parseFloat(document.getElementById('modalWeightFrom').value),
        weightTo: parseFloat(document.getElementById('modalWeightTo').value),
        basePrice: parseFloat(document.getElementById('modalBasePrice').value)
    };

    const isEdit = currentEditingPriceId !== null;
    const url = isEdit ? `${API.prices}/${currentEditingPriceId}` : API.prices;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(isEdit ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
            closePriceModal();
            loadPricesData();
        } else {
            const errData = await response.json().catch(() => ({}));
            alert('Thất bại: ' + (errData.message || 'Vui lòng kiểm tra lại dữ liệu đầu vào.'));
        }
    } catch (error) {
        console.error('Lỗi khi lưu:', error);
        alert('Đã xảy ra lỗi kết nối với server.');
    }
}

// 6. Xóa cấu hình giá (DELETE)
async function deletePrice(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa cấu hình giá này không?')) return;

    try {
        const response = await fetch(`${API.prices}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Xóa thành công!');
            loadPricesData();
        } else {
            alert('Xóa thất bại từ phía server.');
        }
    } catch (error) {
        console.error('Lỗi khi xóa:', error);
        let message = error && error.message ? error.message : String(error);
        alert('Đã xảy ra lỗi kết nối: ' + message);
    }
}