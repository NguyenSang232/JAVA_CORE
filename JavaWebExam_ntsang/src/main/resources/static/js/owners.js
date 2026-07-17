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

            const hasAccount = user && user.ownerId != null;

            return `
                <tr>
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
// GETPETBYONWER
async function getUserByOwnerId(ownerId) {
    try {
        const response = await fetch(`${API.users}/${ownerId}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
     console.error("User owner error:", error);
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

async function saveOwner(event) {
    event.preventDefault();
    const name = document.getElementById("owner-name").value;
    const phone = document.getElementById("owner-phone").value;
    const address = document.getElementById("owner-address").value;
	const email = document.getElementById("owner-email").value;
    const newOwner = { name, email, phone, address, createdAt: new Date().toISOString() };
    try {
        const response = await fetch(API.owners, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOwner)
        });

        if (response.ok) {
            showToast("Thêm chủ nuôi thành công!", "success");
			loadOwnersData();
            closeOwnerModal();
            
            // Cập nhật lại UI Dashboard (nếu đang ở trang dashboard)
            if (typeof loadDashboardData === "function") {
                await loadDashboardData();
            }
        } else {
            showToast("Không thể lưu chủ nuôi mới", "error");
        }
    } catch (error) {
        console.error(error);
        showToast("Lỗi kết nối máy chủ", "error");
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