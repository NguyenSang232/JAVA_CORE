/* =====================================================
   OWNER.JS
   OWNER MANAGEMENT (Supports Active & Deleted Tabs)
===================================================== */
let currentSortDirection = "NONE"; // Biến lưu trạng thái sắp xếp ("NONE", "ASC", "DESC")
let currentOwnerTab = "ACTIVE";    // Trạng thái tab hiện tại: "ACTIVE" hoặc "DELETED"

async function showOwners() {
    const mainView = document.getElementById("content");
    if (!mainView) return;
    mainView.innerHTML = `
        <div class="dashboard-container">
            <header class="dashboard-header">
                <div>
                    <h1>Quản Lý Chủ Nuôi</h1>
                    <p style="color: #999; margin: 4px 0 0 0; font-size: 14px;">Quản lý thông tin chủ nuôi trong hệ thống</p>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div class="pet-toolbar" style="margin-bottom: 0;">
                        <input type="text" id="owner-search-input" placeholder="Tìm theo tên, số điện thoại..." oninput="searchOwner(this.value)">
                    </div>
                    <button class="btn-create" onclick="openOwnerModal()">+ Thêm chủ nuôi</button>
                </div>
            </header>

            <div class="dashboard-tabs" style="display: flex; gap: 15px; border-bottom: 2px solid #eee; margin-bottom: 20px;">
                <div class="tab-item active" id="tab-owner-active" onclick="switchOwnerTab('ACTIVE')" style="padding: 10px 15px; cursor: pointer; font-weight: bold; border-bottom: 2px solid #007bff; color: #007bff;">
                    Đang hoạt động
                </div>
                <div class="tab-item" id="tab-owner-deleted" onclick="switchOwnerTab('DELETED')" style="padding: 10px 15px; cursor: pointer; font-weight: bold; color: #666;">
                    Đã xóa
                </div>
            </div>

            <section class="dashboard-grid-owner">
                <div class="panel">
                    <div class="panel-title-area">
                        <h3 id="owner-panel-title">Danh sách chủ nuôi <span class="count-badge" id="owner-countAll">0</span></h3>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th style="cursor: pointer; user-select: none;" onclick="toggleOwnerSort()">
                                    HỌ TÊN <span id="owner-sort-icon" style="font-size: 12px; margin-left: 4px;">⇅</span>
                                </th>
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
    currentSortDirection = "NONE";
    currentOwnerTab = "ACTIVE";
    await loadOwnersData();
}

/* =====================================================
   LOAD OWNER DATA
===================================================== */
async function loadOwnersData() {
    try {
        const response = await fetch(API.owners);
        if (!response.ok) throw new Error("Lỗi gọi API owners");
        owners = await response.json();

        // Giữ nguyên trạng thái sắp xếp nếu đang bật
        if (currentSortDirection === "ASC" || currentSortDirection === "DESC") {
            sortOwnerData(currentSortDirection, false);
        } else {
            updateOwnerView();
        }
    } catch (error) {
        console.error(error);
        showToast("Không tải được danh sách Owner", "error");
    }
}

function switchOwnerTab(tab) {
    currentOwnerTab = tab;
    currentOwnerPage = 1;

    const tabActive = document.getElementById("tab-owner-active");
    const tabDeleted = document.getElementById("tab-owner-deleted");

    if (tab === "ACTIVE") {
        tabActive.style.borderBottom = "2px solid #007bff";
        tabActive.style.color = "#007bff";
        tabDeleted.style.borderBottom = "none";
        tabDeleted.style.color = "#666";
    } else {
        tabDeleted.style.borderBottom = "2px solid #dc3545";
        tabDeleted.style.color = "#dc3545";
        tabActive.style.borderBottom = "none";
        tabActive.style.color = "#666";
    }

    updateOwnerView();
}

async function openOwnerModalDetail(ownerId = null) {
    const modalOverlay = document.getElementById("owner-modal-overlay");
    const form = document.getElementById("owner-form-detail");
    const title = document.getElementById("owner-modal-title");
    const listContainer = document.getElementById("pet-detail-list-detail-owner");
    if (!modalOverlay) return;
    
    modalOverlay.style.display = "flex"; 
    if (ownerId) {
        const owner = owners.find(o => o.id == ownerId);
        if (!owner) return;
        title.innerText = "Chỉnh sửa chủ nuôi";
        document.getElementById("owner-id-detail").value = owner.id;
        document.getElementById("owner-name-detail").value = owner.name;
        document.getElementById("owner-email-detail").value = owner.email;
        document.getElementById("owner-phone-detail").value = owner.phone;
        document.getElementById("owner-address-detail").value = owner.address || "";
        document.getElementById("owner-username-detail").value = owner.phone;       
        listContainer.innerHTML = "Đang tải...";        
        
        const pets = await getPetByOwnerId(ownerId);
        const hasUser = await getUserByOwnerId(ownerId);       
        
        const userIdInput = document.getElementById("user-id-detail");
        const passwordInput = document.getElementById("owner-password-detail");
        if (hasUser) {
            try {
                const response = await fetch(`${API.users}/detail/${ownerId}`);
                const userData = await response.json();
                if (userData) {
                    if (userIdInput) userIdInput.value = userData.id || "";
                    if (passwordInput) passwordInput.value = userData.password || "";
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
            }
        } else {
            if (userIdInput) userIdInput.value = "";
        }
        
        listContainer.innerHTML = pets.map(p => `
           <div class="pet-card" onclick="editPet(${p.id})">
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
        title.innerText = "Thêm Chủ Nuôi Mới";
        if (form) form.reset();
        document.getElementById("owner-id-detail").value = "";
        const userIdInput = document.getElementById("user-id-detail");
        if (userIdInput) userIdInput.value = "";
        const passwordInput = document.getElementById("owner-password-detail");
        if (passwordInput) passwordInput.value = "";
        listContainer.innerHTML = "Chưa có dữ liệu.";
    }
}

function closeOwnerModalDetail() {
    const modal = document.getElementById("owner-modal-overlay");
    if (modal) modal.style.display = "none";
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
    if (modal) modal.style.display = "flex";
}

function updateOwnerView() {
    const filteredData = searchOwnerData();
    document.getElementById("owner-countAll").textContent = filteredData.length;

    const pageData = paginateOwner(filteredData, currentOwnerPage);
    renderOwnerTable(pageData);
    renderOwnerPagination(filteredData.length);
}

async function renderOwnerTable(ownerList) {
    const tableBody = document.getElementById("owner-table");
    if (!tableBody) return;

    if (!ownerList || ownerList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: #999;">Không có chủ nuôi nào</td></tr>`;
        return;
    }

    const perPage = typeof OWNERS_PER_PAGE !== "undefined" ? OWNERS_PER_PAGE : 5;

    const rows = await Promise.all(
        ownerList.map(async (owner, index) => {
            const stt = (currentOwnerPage - 1) * perPage + (index + 1);
            
            const [pets, hasAccount] = await Promise.all([
                getPetByOwnerId(owner.id),
                getUserByOwnerId(owner.id)
            ]);

            const isDeleted = owner.deletedAt === true;

            return `
                <tr onclick="openOwnerModalDetail(${owner.id})" style="cursor: pointer;">
                    <td>${stt}</td>
                    <td><strong style="color: #111;">${owner.name ?? "-"}</strong></td>
                    <td>${owner.phone ?? "-"}</td>
                    <td>${owner.email ?? "-"}</td>
                    <td style="font-weight: 600; color: #444;">🐾 ${pets.length}</td>
                    <td>${accountBadge(hasAccount)}</td>
                    <td>
                        <div class="action-group">
                            ${isDeleted ? `
                                <button class="action-btn restore" title="Khôi phục" onclick="event.stopPropagation(); restoreOwner(${owner.id})">♻️</button>
                            ` : `
                                <button class="action-btn edit" title="Chỉnh sửa" onclick="event.stopPropagation(); openOwnerModalDetail(${owner.id})">✏️</button>
                                <button class="action-btn delete" title="Xóa" onclick="event.stopPropagation(); deleteOwner(${owner.id})">🗑️</button>
                            `}
                        </div>
                    </td>
                </tr>
            `;
        })
    );

    tableBody.innerHTML = rows.join("");
}

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

function searchOwner(keyword) {
    currentOwnerKeyword = keyword.toLowerCase();
    currentOwnerPage = 1;
    updateOwnerView();
}

function searchOwnerData() {
    // Phân loại danh sách theo tab Đang hoạt động hoặc Đã xóa
    let data = owners.filter(owner => {
        const isDeleted = owner.deletedAt === true;
        return currentOwnerTab === "DELETED" ? isDeleted : !isDeleted;
    });

    if (currentOwnerKeyword) {
        data = data.filter(owner => {
            const name = owner.name?.toLowerCase() ?? "";
            const phone = owner.phone?.toLowerCase() ?? "";
            return name.includes(currentOwnerKeyword) || phone.includes(currentOwnerKeyword);
        });
    }
    return data;
}

function toggleOwnerSort() {
    if (currentSortDirection === "NONE" || currentSortDirection === "DESC") {
        currentSortDirection = "ASC";
        sortOwnerData("ASC", true);
    } else {
        currentSortDirection = "DESC";
        sortOwnerData("DESC", true);
    }
}

function sortOwnerData(type, resetPage = true) {
    owners.sort((a, b) => {
        const nameA = a.name?.toLowerCase() ?? "";
        const nameB = b.name?.toLowerCase() ?? "";
        return type === "ASC" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    if (resetPage) {
        currentOwnerPage = 1;
    }
    updateOwnerView();
}

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
    updateOwnerView();
}

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

const phoneInput = document.getElementById("owner-phone");
if (phoneInput) {
    phoneInput.addEventListener("input", function() {
        const usernameDisplay = document.getElementById("owner-username-display");
        if (usernameDisplay) usernameDisplay.value = this.value;
    });
}

async function editOnwerSave(event) {
    if (event) event.preventDefault();
    
    const id = document.getElementById("owner-id-detail").value;
    if (!id) return;

    const name = document.getElementById("owner-name-detail").value;
    const email = document.getElementById("owner-email-detail").value.trim();
    const phone = document.getElementById("owner-phone-detail").value.trim();
    const address = document.getElementById("owner-address-detail").value;

    // --- KIỂM TRA ĐỊNH DẠNG ---
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        showToast("Số điện thoại phải bao gồm đúng 10 chữ số!", "error");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        showToast("Email không đúng định dạng!", "error");
        return;
    }
    // -------------------------

    const passwordInput = document.getElementById("owner-password-detail");
    const password = passwordInput ? passwordInput.value.trim() : "";
    const updateOwner = {
        name: name,
        phone: phone,
        email: email,
        address: address
    };
    try {
        const response = await fetch(`${API.owners}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateOwner)
        });
        if (!response.ok) {
            showToast("Không thể cập nhật thông tin chủ nuôi", "error");
            return;
        }
        if (password) {
            let hasAccount = false;
            try {
                const userRes = await fetch(`${API.users}/${id}`);
                if (userRes.ok) {
                    hasAccount = await userRes.json();
                }
            } catch (err) {
                console.error("Lỗi kiểm tra trạng thái tài khoản:", err);
            }

            if (hasAccount === true) {
                const updateUser = {
                    username: phone,
                    password: password,
                    ownerId: Number(id),
                    role: "ROLE_CUSTOMER"
                };
                await fetch(`${API.users}/${id}`, { 
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updateUser)
                });
            } else {
                const newUser = {
                    username: phone,
                    password: password,
                    ownerId: Number(id),
                    role: "ROLE_CUSTOMER"
                };

                await fetch(`${API.users}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newUser)
                });
            }
        }

        showToast("Cập nhật chủ nuôi thành công!", "success");
        await loadOwnersData();
        closeOwnerModalDetail();
        
        if (typeof loadDashboardData === "function") {
            await loadDashboardData();
        }

    } catch (error) {
        console.error(error);
        showToast("Lỗi kết nối máy chủ", "error");
    }
}

async function saveOwner(event) {
    event.preventDefault();
    const name = document.getElementById("owner-name").value;
    const phone = document.getElementById("owner-phone").value.trim();
    const address = document.getElementById("owner-address").value;
    const email = document.getElementById("owner-email").value.trim();

    // --- KIỂM TRA ĐỊNH DẠNG ---
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        showToast("Số điện thoại phải bao gồm đúng 10 chữ số!", "error");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        showToast("Email không đúng định dạng!", "error");
        return;
    }
    // -------------------------

    const passwordInput = document.getElementById("owner-password");
    const password = passwordInput ? passwordInput.value.trim() : "";
    const newOwner = { 
        name, 
        email, 
        phone, 
        address, 
        createdAt: new Date().toISOString() 
    };

    try {
        const response = await fetch(API.owners, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOwner)
        });
        if (!response.ok) {
            showToast("Không thể lưu chủ nuôi mới", "error");
            return;
        }
        const createdOwner = await response.json();
        const ownerId = createdOwner.id;
        if (password) {
            const newUser = {
                username: phone,
                password: password,
                ownerId: ownerId,
                role: "ROLE_CUSTOMER" 
            };

            const userResponse = await fetch(API.users, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });

            if (!userResponse.ok) {
                showToast("Thêm chủ nuôi thành công nhưng tạo tài khoản thất bại!", "warning");
            } else {
                showToast("Thêm chủ nuôi và tài khoản thành công!", "success");
            }
        } else {
            showToast("Thêm chủ nuôi thành công!", "success");
        }
        await loadOwnersData();
        closeOwnerModal();
        
        if (typeof loadDashboardData === "function") {
            await loadDashboardData();
        }
    } catch (error) {
        console.error(error);
        showToast("Lỗi kết nối máy chủ", "error");
    }
}

function editOwner(id) {
    const owner = owners.find(item => item.id === id);
    if (!owner) return;
    openOwnerModal(owner);
}

async function deleteOwner(id) {
    const confirmAction = confirm("Bạn có chắc muốn xóa chủ nuôi này? (Các thú cưng của chủ nuôi cũng sẽ bị xóa)");
    if (!confirmAction) return;

    try {
        const response = await fetch(`${API.owners}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            showToast("Xóa Owner thành công");
            await loadOwnersData();
        } else {
            showToast("Xóa thất bại", "error");
        }
    } catch (error) {
        console.error(error);
        showToast("Xóa thất bại", "error");
    }
}

async function restoreOwner(id) {
    try {
        const response = await fetch(`${API.owners}/restore?id=${id}`, {
            method: "PUT"
        });

        if (response.ok) {
            showToast("Khôi phục chủ nuôi thành công!");
            await loadOwnersData();
        } else {
            showToast("Khôi phục thất bại", "error");
        }
    } catch (error) {
        console.error(error);
        showToast("Lỗi kết nối máy chủ", "error");
    }
}