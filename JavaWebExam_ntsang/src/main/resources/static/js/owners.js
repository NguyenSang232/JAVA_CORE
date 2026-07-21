/* =====================================================
   OWNER.JS
   OWNER MANAGEMENT
===================================================== */
async function showOwners() {
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

async function getDetaiOwner(owenerId){

}


async function openOwnerModalDetail(ownerId = null) {
    const modalOverlay = document.getElementById("owner-modal-overlay");
    const form = document.getElementById("owner-form-detail");
    const title = document.getElementById("owner-modal-title");
    const listContainer = document.getElementById("pet-detail-list-detail-owner");

    // Hiển thị modal
    modalOverlay.style.display = "flex";

    if (ownerId) {
        // Mode CHỈNH SỬA: Tìm chủ nuôi trong mảng toàn cục 'owners'
        const owner = owners.find(o => o.id == ownerId);
        title.innerText = "Chỉnh sửa chủ nuôi";
        
        document.getElementById("owner-id-detail").value = owner.id;
        document.getElementById("owner-name-detail").value = owner.name;
        document.getElementById("owner-email-detail").value = owner.email;
        document.getElementById("owner-phone-detail").value = owner.phone;
        document.getElementById("owner-address-detail").value = owner.address || "";

        // Load thú cưng
        listContainer.innerHTML = "Đang tải...";
        const pets = await getPetByOwnerId(ownerId);
        console.log(`Thú cưng của Owner ID ${ownerId}:`, pets);
      listContainer.innerHTML = pets.map(p => `
           <div class="pet-card" onclick=editPet(${p.id})>
                <div class="pet-avatar">
                    ${getPetIcon(p.type)}
                </div>
                <div class="pet-info">
                    <h4 class="pet-name">${p.name}</h4>
                    <span class="pet-meta">${p.type} • ${p.breed || 'Không rõ giống'}</span>
                </div>
                <div class="pet-id">#${p.id}</div>
            </div>
        `).join("");
    } else {
        // Mode THÊM MỚI
        title.innerText = "Thêm Chủ Nuôi Mới";
        form.reset();
        document.getElementById("owner-id-detail").value = "";
        listContainer.innerHTML = "Chưa có dữ liệu.";
    }
}

function closeOwnerModalDetail() {
    document.getElementById("owner-modal-overlay").style.display = "none";
}

async function showPetModal(ownerId) {
    const modal = document.getElementById("pet-detail-modal");
    const listContainer = document.getElementById("pet-detail-list");
    const title = document.getElementById("modal-owner-name");
    const owner = owners.find(o => o.id === ownerId);
    title.innerText = `Thú cưng của: ${owner ? owner.name : 'Chủ nuôi'}`;
    const pets = await getPetByOwnerId(ownerId); 
    if (pets.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center; color:#999; padding:20px;">Chủ nuôi này chưa có thú cưng nào.</p>`;
    } else {
        listContainer.innerHTML = pets.map(p => `
            <div style="display:flex; align-items:center; padding: 12px; border-bottom: 1px solid #eee;">
                <div style="font-size: 30px; margin-right: 15px; background: #f8f8f8; padding: 10px; border-radius: 8px;">
                    ${getPetIcon(p.type)}
                </div>
                <div style="flex-grow: 1;" onclick="openPetModalDetail(${p.id})">
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
                <tr onclick="openOwnerModalDetail(${owner.id})" style="cursor: pointer;">
                    <td>${owner.id}</td>
                    <td><strong style="color: #111;">${owner.name ?? "-"}</strong></td>
                    <td>${owner.phone ?? "-"}</td>
                    <td>${owner.email ?? "-"}</td>
                    <td style="font-weight: 600; color: #444;">🐾 ${pets.length}</td>
                    <td>${accountBadge(hasAccount)}</td>
                    <td>
                        <div class="action-group">
                            <button class="action-btn edit" title="Chỉnh sửa" onclick=" event.stopPropagation(); editOwner(${owner.id})">✏️</button>
                            <button class="action-btn delete" title="Xóa" onclick="event.stopPropagation(); deleteOwner(${owner.id})">🗑️</button>
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