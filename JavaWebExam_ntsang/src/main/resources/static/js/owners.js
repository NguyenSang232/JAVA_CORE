/* =====================================================
   OWNER.JS
   OWNER MANAGEMENT
===================================================== */
async function showOwners() {
    setActiveMenu("menu-owners");
    const mainView = document.getElementById("content");
    if (!mainView) return;
    mainView.innerHTML = `
        <div class="dashboard-container">
            <header class="dashboard-header">
                <div>
                    <h1>Owners</h1>
                    <p style="color: #999; margin: 4px 0 0 0; font-size: 14px;">Quản lý thông tin chủ nuôi trong hệ thống</p>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div class="pet-toolbar" style="margin-bottom: 0;">
                        <input type="text" id="owner-search-input" placeholder="Tìm theo tên, số điện thoại..." oninput="searchOwner(this.value)">
                    </div>
                    <button class="btn-create" onclick="openOwnerModal()">+ Thêm chủ nuôi</button>
                </div>
            </header>

            <div class="dashboard-tabs">
                <div class="tab-item">Danh sách chủ nuôi</div>
            </div>

            <section class="dashboard-grid-owner">
                <div class="panel">
                    <div class="panel-title-area">
                        <h3>Tất cả chủ nuôi <span class="count-badge" id="owner-countAll">0</span></h3>
                        <div class="filter-group">
                            <button class="filter-btn active" onclick="sortOwner('ASC')">Tên A-Z</button>
                            <button class="filter-btn" onclick="sortOwner('DESC')">Tên Z-A</button>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>HỌ TÊN</th>
                                <th>ĐIỆN THOẠI</th>
                                <th>EMAIL</th>
                                <th>THÚ CƯNG</th>
                                <th>TÀI KHOẢN</th>
                                <th>THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody id="owner-table">
                            <tr>
                                <td colspan="7" style="text-align: center; padding: 20px; color: #999;">Đang tải dữ liệu...</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="pagination" id="owner-pagination"></div>
                </div>
            </section>
        </div>
    `;

    currentOwnerPage = 1;
    currentOwnerKeyword = "";
    await loadOwnersData();
}
/* =====================================================
   LOAD OWNER DATA
===================================================== */
async function loadOwnersData() {
    try {
        const response = await fetch(API.owners);
        owners = await response.json();

        updateOwnerView();
    } catch (error) {
        console.error(error);
        showToast("Không tải được danh sách Owner", "error");
    }
}

async function showPetModal(ownerId) {
    const modal = document.getElementById("pet-detail-modal");
    const listContainer = document.getElementById("pet-detail-list");
    const title = document.getElementById("modal-owner-name");

    // Lấy thông tin chủ nuôi để hiển thị tên
    const owner = owners.find(o => o.id === ownerId);
    title.innerText = `Thú cưng của: ${owner ? owner.name : 'Chủ nuôi'}`;

    // Lấy danh sách thú cưng
    const pets = await getPetByOwnerId(ownerId);
    
    if (pets.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center; color:#999; padding:20px;">Chủ nuôi này chưa có thú cưng nào.</p>`;
    } else {
        listContainer.innerHTML = pets.map(p => `
            <div style="display:flex; align-items:center; padding: 12px; border-bottom: 1px solid #eee;">
                <div style="font-size: 30px; margin-right: 15px; background: #f8f8f8; padding: 10px; border-radius: 8px;">
                    ${getPetIcon(p.type)}
                </div>
                <div style="flex-grow: 1;">
                    <div style="font-weight: bold; font-size: 16px;">${p.name}</div>
                    <div style="color: #666; font-size: 13px;">
                        Loài: ${p.type} | Giống: ${p.breed || 'N/A'}
                    </div>
                </div>
                <div style="color: #888; font-size: 12px;">ID: ${p.id}</div>
            </div>
        `).join("");
    }

    modal.style.display = "flex";
}

function closeDetailOwnerModal() {
    const modal = document.getElementById("pet-detail-modal");
    modal.style.display = "none";
}

// Đóng modal khi click ra ngoài vùng nội dung
window.onclick = function(event) {
    const modal = document.getElementById("pet-detail-modal");
    if (event.target == modal) {
       closeDetailOwnerModal();
    }
}
/* =====================================================
   UPDATE OWNER VIEW (KẾT HỢP TÌM KIẾM VÀ PHÂN TRANG)
===================================================== */
function updateOwnerView() {
    const filteredData = searchOwnerData();
    document.getElementById("owner-countAll").textContent = filteredData.length;

    const pageData = paginateOwner(filteredData, currentOwnerPage);
    renderOwnerTable(pageData);
    renderOwnerPagination(filteredData.length);
}

/* =====================================================
   RENDER OWNER TABLE
===================================================== */
async function renderOwnerTable(ownerList) {
    const tableBody = document.getElementById("owner-table");
    if (!tableBody) return;

    if (!ownerList || ownerList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: #999;">Chưa có chủ nuôi nào phù hợp</td></tr>`;
        return;
    }

    const rows = await Promise.all(
        ownerList.map(async (owner) => {
            const [pets, user] = await Promise.all([
                getPetByOwnerId(owner.id),
                getUserByOwnerId(owner.id)
            ]);

            console.log(`Kiểm tra Owner ID ${owner.id} nhận được user:`, user);
            const actualUser = Array.isArray(user) ? user[0] : user;
            const hasAccount = !!(actualUser && actualUser.ownerId != null);
            console.log(actualUser);
             // Xác định trạng thái tài khoản một cách chắc chắn bằng toán tử !! (ép về boolean true/false)
           

            return `
                <tr onclick="showPetModal(${owner.id})">
                    <td>${owner.id}</td>
                    <td><strong style="color: #111;">${owner.name ?? "-"}</strong></td>
                    <td>${owner.phone ?? "-"}</td>
                    <td>${owner.email ?? "-"}</td>
                    <td style="font-weight: 600; color: #444;">🐾 ${pets.length}</td>
                    <td>${accountBadge(hasAccount)}</td>
                    <td>
                        <div class="action-group">
                            <button class="action-btn edit" title="Chỉnh sửa" onclick="editOwner(${owner.id})">✏️</button>
                            <button class="action-btn delete" title="Xóa" onclick="deleteOwner(${owner.id})">🗑️</button>
                        </div>
                    </td>
                </tr>
            `;
        })
    );

    tableBody.innerHTML = rows.join("");
}

/* =====================================================
   GET PET BY OWNER
===================================================== */
async function getPetByOwnerId(ownerId) {
    try {
		
        const response = await fetch(`${API.pets}/owner/${ownerId}`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Pet owner error:", error);
        return [];
    }
}

// GET ONWER
async function getUserByOwnerId(ownerId) {
    try {
        const response = await fetch(`${API.users}/owner/${ownerId}`);
        
        // In log chi tiết nếu Backend chặn request từ Frontend
        if (!response.ok) {
            console.warn(`API User cho Owner ${ownerId} thất bại với Status: ${response.status}`);
            return null;
        }
        
        if (response.status === 204) return null;

        const text = await response.text();
        if (!text) return null; 

        return JSON.parse(text);
    } catch (error) {
        console.error("Lỗi kết nối API User:", error);
        return null;
    }
}
//   OWNER SEARCH
function searchOwner(keyword) {
    currentOwnerKeyword = keyword.toLowerCase();
    currentOwnerPage = 1;
    updateOwnerView();
}

function searchOwnerData() {
    if (!currentOwnerKeyword) {
        return owners;
    }
    return owners.filter(owner => {
        const name = owner.name?.toLowerCase() ?? "";
        const phone = owner.phone?.toLowerCase() ?? "";
        return name.includes(currentOwnerKeyword) || phone.includes(currentOwnerKeyword);
    });
}

/* =====================================================
   OWNER SORT
===================================================== */
function sortOwner(type = "ASC") {
    // Đổi nút active trong bộ lọc sắp xếp
    const buttons = document.querySelectorAll(".panel-title-area .filter-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");

    owners.sort((a, b) => {
        const nameA = a.name?.toLowerCase() ?? "";
        const nameB = b.name?.toLowerCase() ?? "";
        return type === "ASC" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    currentOwnerPage = 1;
    updateOwnerView();
}

/* =====================================================
   OWNER PAGINATION
===================================================== */
function paginateOwner(data, page) {
    const perPage = typeof OWNERS_PER_PAGE !== "undefined" ? OWNERS_PER_PAGE : 5;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return data.slice(start, end);
}

function renderOwnerPagination(total) {
    const pagination = document.getElementById("owner-pagination");
    if (!pagination) return;

    const perPage = typeof OWNERS_PER_PAGE !== "undefined" ? OWNERS_PER_PAGE : 5;
    const totalPage = Math.ceil(total / perPage);
    
    if (totalPage <= 1) {
        pagination.innerHTML = "";
        return;
    }

    let html = "";
    for (let i = 1; i <= totalPage; i++) {
        const isActive = currentOwnerPage === i ? "active" : "";
        html += `
            <button class="page-btn ${isActive}" onclick="changeOwnerPage(${i})">
                ${i}
            </button>
        `;
    }
    pagination.innerHTML = html;
}

function changeOwnerPage(page) {
    currentOwnerPage = page;
    const filteredData = searchOwnerData();
    const pageData = paginateOwner(filteredData, currentOwnerPage);

    renderOwnerTable(pageData);
    renderOwnerPagination(filteredData.length);
}
/* =====================================================
   MODAL LOGIC: CHỦ NUÔI (OWNER)
===================================================== */
function openOwnerModal() {
    const modal = document.getElementById("owner-modal");
    const form = document.getElementById("owner-form");
    if (form) form.reset();
    if (modal) modal.style.display = "flex";
}

function closeOwnerModal() {
    const modal = document.getElementById("owner-modal");
    if (modal) modal.style.display = "none";
}
// 1. Đồng bộ Số điện thoại lên ô Tên đăng nhập (Username) theo thời gian thực
document.getElementById("owner-phone").addEventListener("input", function() {
    document.getElementById("owner-username-display").value = this.value;
});

// 2. Hàm xử lý khi submit Form Thêm Chủ Nuôi Mới
async function saveOwner(event) {
    event.preventDefault(); // Chặn hành vi tải lại trang mặc định của form

    // --- BƯỚC 1: Thu thập dữ liệu từ các ô input của Owner ---
    const name = document.getElementById("owner-name").value.trim();
    const email = document.getElementById("owner-email").value.trim();
    const phone = document.getElementById("owner-phone").value.trim();
    const address = document.getElementById("owner-address").value.trim();
    
    // Thu thập thông tin tài khoản
    const password = document.getElementById("owner-password").value;

    // Tạo object dữ liệu cho Owner gửi lên Server
    const newOwner = { 
        name: name, 
        email: email, 
        phone: phone, 
        address: address
    };

    try {
        // --- BƯỚC 2: Gọi API lưu thông tin Chủ nuôi (Owner) trước ---
        const ownerResponse = await fetch(API.owners, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOwner)
        });

        if (!ownerResponse.ok) {
            showToast("Không thể lưu thông tin chủ nuôi mới!", "error");
            return; 
        }

        // Đọc dữ liệu trả về từ Database (Lúc này savedOwner đã chứa trường id tự sinh)
        const savedOwner = await ownerResponse.json();
        console.log("Dữ liệu Owner nhận được:", savedOwner);
        // --- BƯỚC 3: Tạo và gọi API thêm tài khoản User tương ứng ---
        // Chuẩn hóa tên thuộc tính `ownerId` để khớp với cách định nghĩa `#{ownerId}` trong MyBatis của bạn
        const newUser = {
            username: phone,         // Lấy Số điện thoại làm tên đăng nhập
            password: password,      // Mật khẩu người dùng nhập vào
            role: "ROLE_CUSTOMER",   // Quyền hạn mặc định cho nhóm khách hàng
            ownerId: savedOwner.id   // Lấy ID tự động sinh từ Owner vừa lưu ở bước trên gán vào đây
        };

        const userResponse = await fetch(API.users, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });

        // --- BƯỚC 4: Kiểm tra trạng thái và cập nhật lại giao diện ---
        if (!userResponse.ok) {
            // Trường hợp hy hữu: Đã có thông tin chủ nuôi nhưng tài khoản tạo bị trùng Username hoặc lỗi bảo mật dữ liệu
            showToast("Đã thêm thông tin chủ nuôi, nhưng khởi tạo tài khoản hệ thống thất bại!", "warning");
        } else {
            showToast("Thêm mới chủ nuôi và khởi tạo tài khoản thành công!", "success");
        }

        // Làm mới lại bảng dữ liệu hiển thị (DataTable / List) ngoài Dashboard
        if (typeof loadOwnersData === "function") {
             await loadOwnersData();
        }
        
        // Cập nhật lại các khối Summary Card nếu có thay đổi số liệu thống kê chung
        if (typeof loadDashboardData === "function") {
            await loadDashboardData();
        }

        // Đóng modal nhập liệu
        closeOwnerModal();

    } catch (error) {
        console.error("Lỗi trong quá trình xử lý luồng tạo dữ liệu:", error);
        showToast("Đã xảy ra lỗi kết nối với máy chủ hệ thống!", "error");
    }
}
/* =====================================================
   EDIT OWNER
===================================================== */
function editOwner(id) {
    const owner = owners.find(item => item.id === id);
    if (!owner) return;
    openOwnerModal(owner);
}

/* =====================================================
   DELETE OWNER
===================================================== */
async function deleteOwner(id) {
    const confirm = confirmDelete("Bạn có chắc muốn xóa chủ nuôi này?");
    if (!confirm) return;

    try {
        const response = await fetch(`${API.owners}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            showToast("Xóa Owner thành công");
            await loadOwnersData();
        }
    } catch (error) {
        console.error(error);
        showToast("Xóa thất bại", "error");
    }
}