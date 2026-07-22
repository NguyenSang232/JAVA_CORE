/* =====================================================
   SHOW PET PAGE
===================================================== */
let currentPetSortDirection = "NONE"; // Biến lưu trạng thái sắp xếp theo tên thú cưng ("NONE", "ASC", "DESC")

async function showPets() {
    const mainView = document.getElementById("content");
    if (!mainView) return;

    mainView.innerHTML = `
        <div class="dashboard-container">
            <header class="dashboard-header">
                <div>
                    <h1>Pets</h1>
                    <p style="color: #999; margin: 4px 0 0 0; font-size: 14px;">Quản lý danh sách và trạng thái thú cưng</p>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div class="pet-toolbar" style="margin-bottom: 0;">
                        <input type="text" id="pet-search" placeholder="Tìm tên thú cưng..." oninput="searchPet(this.value)">
                    </div>
                    <button class="btn-create" onclick="openPetModal()">+ Thêm thú nuôi</button>
                </div>
            </header>

            <div class="dashboard-tabs">
                <div class="tab-item">Tổng quan thú cưng</div>
            </div>

            <section class="dashboard-grid-owner">
                <div class="panel">
                    <div class="panel-title-area">
                        <div class="filter-group">
                            <button class="filter-btn active" onclick="filterPet('ALL', this)">🐾 All</button>
                            <button class="filter-btn" onclick="filterPet('Dog', this)">🐶 Dog</button>
                            <button class="filter-btn" onclick="filterPet('Cat', this)">🐱 Cat</button>
                            <button class="filter-btn" onclick="filterPet('Bird', this)">🐦 Bird</button>
                            <button class="filter-btn" onclick="filterPet('Rabbit', this)">🐰 Rabbit</button>
                            <button class="filter-btn" onclick="filterPet('Other', this)">🐾 Other</button>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th style="cursor: pointer; user-select: none;" onclick="togglePetSort()">
                                    THÚ CƯNG <span id="owner-sort-icon" style="font-size: 12px; margin-left: 4px;">⇅</span>
                                </th>
                                <th>LOẠI</th>
                                <th>GIỐNG</th>
                                <th>TUỔI</th>
                                <th>CÂN NẶNG</th>
                                <th>CHỦ NUÔI</th>
                                <th>TRẠNG THÁI</th>
                                <th>THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody id="pet-table">
                            <tr>
                                <td colspan="9" style="text-align: center; padding: 20px; color: #999;">Đang tải dữ liệu...</td>
                            </tr>
                        </tbody>
                    </table>

                    <div id="pet-pagination" class="pagination"></div>
                </div>
            </section>
        </div>
    `;

    currentPetPage = 1;
    currentPetFilter = "ALL";
    currentPetKeyword = "";
    currentPetSortDirection = "NONE";
    await loadPetData();
}

async function loadPetData() {
    try {
        const [petResponse, boardingResponse] = await Promise.all([
            fetch(API.pets),
            fetch(API.boarding)
        ]);

        pets = await petResponse.json();
        const boardingRecords = await boardingResponse.json();

        pets = pets.map(pet => {
            const record = boardingRecords.find(
                item => item.petId === pet.id && item.status === "BOARDING"
            );
            return {
                ...pet,
                status: record ? "BOARDING" : getPetStatus(pet.id, boardingRecords)
            };
        });

        if (currentPetSortDirection === "ASC" || currentPetSortDirection === "DESC") {
            sortPetData(currentPetSortDirection, false);
        } else {
            updatePetView();
        }
    } catch (error) {
        console.error("Load pet error:", error);
        showToast("Không tải được dữ liệu thú cưng", "error");
    }
}

function getPetStatus(petId, boardingRecords) {
    const returned = boardingRecords.find(
        item => item.petId === petId && item.status === "RETURNED"
    );
    return returned ? "RETURNED" : "HOME";
}

function updatePetView() {
    let processedData = filterPetData();

    if (currentPetSortDirection === "ASC" || currentPetSortDirection === "DESC") {
        processedData.sort((a, b) => {
            const nameA = a.name?.toLowerCase() ?? "";
            const nameB = b.name?.toLowerCase() ?? "";
            return currentPetSortDirection === "ASC" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
    }

    const pageData = paginatePet(processedData, currentPetPage);
    renderPetTable(pageData);
    renderPetPagination(processedData.length);
}

/* =====================================================
   RENDER PET TABLE
===================================================== */
function getPetIcon(type) {
    switch (type) {
        case "Dog": return "🐶";
        case "Cat": return "🐱";
        case "Bird": return "🐦";
        case "Rabbit": return "🐰";
        default: return "🐾";
    }
}

async function renderPetTable(petList) {
    const tableBody = document.getElementById("pet-table");
    if (!tableBody) return;

    if (!petList || petList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 20px; color: #999;">Chưa có thú cưng nào phù hợp</td></tr>`;
        return;
    }

    const perPage = typeof PETS_PER_PAGE !== "undefined" ? PETS_PER_PAGE : 5;

    const rows = await Promise.all(
        petList.map(async (pet, index) => {
            const stt = (currentPetPage - 1) * perPage + (index + 1);
            const owner = await getOwnerById(pet.ownerId);

            return `
                <tr class="pet-row" onclick="editPet(${pet.id})">
                    <td>${stt}</td>
                    <td>
                        <div class="pet-cell" style="display: flex; align-items: center; gap: 8px;">
                            <div class="pet-avatar-mini" style="font-size: 20px;">${getPetIcon(pet.type)}</div>
                            <div class="pet-meta">
                                <strong style="color: #111; display: block;">${pet.name ?? "-"}</strong>
                            </div>
                        </div>
                    </td>
                    <td>${typeof petBadge === "function" ? petBadge(pet.type) : pet.type}</td>
                    <td>${pet.breed ?? "-"}</td>
                    <td><span class="age-badge" style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 13px;">${pet.age ?? 0} tuổi</span></td>
                    <td>${pet.weight ?? 0} kg</td>
                    <td class="owner-cell">👤 ${owner ? owner.name : "-"}</td>
                    <td>${typeof petStatusBadge === "function" ? petStatusBadge(pet.status) : pet.status}</td>
                    <td>
                        <div class="action-group">
                            <button class="action-btn edit" title="Chỉnh sửa" onclick="editPet(${pet.id})">✏️</button>
                            <button class="action-btn delete" title="Xóa" onclick="deletePet(${pet.id})">🗑️</button>
                        </div>
                    </td>
                </tr>
            `;
        })
    );

    tableBody.innerHTML = rows.join("");
}

async function getOwnerById(id) {
    if (!id) return null;
    try {
        const response = await fetch(`${API.owners}/${id}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
}

function filterPet(type, btnElement) {
    const buttons = btnElement.parentElement.querySelectorAll(".filter-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    btnElement.classList.add("active");

    currentPetFilter = type;
    currentPetPage = 1;
    updatePetView();
}

function filterPetData() {
    let result = [...pets];

    if (currentPetFilter !== "ALL") {
        result = result.filter(pet => pet.type === currentPetFilter);
    }

    if (currentPetKeyword) {
        result = result.filter(pet => {
            const name = pet.name?.toLowerCase() ?? "";
            return name.includes(currentPetKeyword);
        });
    }

    return result;
}

/* =====================================================
   SEARCH PET
===================================================== */
function searchPet(keyword) {
    currentPetKeyword = keyword.toLowerCase();
    currentPetPage = 1;
    updatePetView();
}

/* =====================================================
   SORT PET (THEO ICON MŨI TÊN ĐỒNG THỜI Ở TIÊU ĐỀ)
===================================================== */
function togglePetSort() {
    const iconSpan = document.getElementById("pet-sort-icon");

    if (currentPetSortDirection === "NONE" || currentPetSortDirection === "DESC") {
        currentPetSortDirection = "ASC";
        sortPetData("ASC", true);
    } else {
        currentPetSortDirection = "DESC";
        sortPetData("DESC", true);
    }
}

function sortPetData(type, resetPage = true) {
    pets.sort((a, b) => {
        const nameA = a.name?.toLowerCase() ?? "";
        const nameB = b.name?.toLowerCase() ?? "";
        return type === "ASC" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    if (resetPage) {
        currentPetPage = 1;
    }
    updatePetView();
}

/* =====================================================
   PAGINATION
===================================================== */
function paginatePet(data, page) {
    const perPage = typeof PETS_PER_PAGE !== "undefined" ? PETS_PER_PAGE : 5;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return data.slice(start, end);
}

function renderPetPagination(total) {
    const pagination = document.getElementById("pet-pagination");
    if (!pagination) return;

    const perPage = typeof PETS_PER_PAGE !== "undefined" ? PETS_PER_PAGE : 5;
    const totalPage = Math.ceil(total / perPage);

    if (totalPage <= 1) {
        pagination.innerHTML = "";
        return;
    }

    let html = "";
    for (let i = 1; i <= totalPage; i++) {
        const isActive = currentPetPage === i ? "active" : "";
        html += `<button class="page-btn ${isActive}" onclick="changePetPage(${i})">${i}</button>`;
    }
    pagination.innerHTML = html;
}

function changePetPage(page) {
    currentPetPage = page;
    updatePetView();
}

/* =====================================================
   MODAL LOGIC: THÚ CƯNG (PET) - CHUẨN HÓA & KHÔNG TRÙNG LẶP
===================================================== */
async function openPetModal(pet = null) {
    const modal = document.getElementById("pet-modal");
    const form = document.getElementById("pet-form");
    const ownerSelect = document.getElementById("pet-owner-select");
    const title = document.getElementById("title-detail");
    if (title) title.textContent = pet ? "Chỉnh sửa thông tin thú cưng" : "Thêm mới thú nuôi";

    if (!modal) {
        console.warn("Không tìm thấy phần tử #pet-modal trên trang này.");
        return;
    }

    let idInput = document.getElementById("pet-id");
    if (!idInput) {
        idInput = document.createElement("input");
        idInput.type = "hidden";
        idInput.id = "pet-id";
        if (form) form.appendChild(idInput);
    }

    if (form) form.reset();
    idInput.value = "";
    modal.style.display = "flex";

    if (!ownerSelect) return;

    try {
        const response = await fetch(API.owners);
        const allOwners = await response.json();

        ownerSelect.innerHTML = `
            <option value="">-- Chọn chủ nuôi --</option>
            ${allOwners.map(o => `<option value="${o.id}">${o.name} (${o.phone})</option>`).join("")}
        `;

        if (pet) {
            idInput.value = pet.id ?? "";
            const nameInput = document.getElementById("pet-name");
            const typeSelect = document.getElementById("pet-type");
            const breedInput = document.getElementById("pet-breed");
            const ageInput = document.getElementById("pet-age");
            const weightInput = document.getElementById("pet-weight");
            if (nameInput) nameInput.value = pet.name ?? "";
            if (typeSelect) typeSelect.value = pet.type ?? "Dog";
            if (breedInput) breedInput.value = pet.breed ?? "";
            if (ageInput) ageInput.value = pet.age ?? "";
            if (weightInput) weightInput.value = pet.weight ?? "";
            
            ownerSelect.value = pet.ownerId ?? "";
        }
    } catch (error) {
        console.error("Lỗi chuẩn bị dữ liệu trong Pet Modal:", error);
        showToast("Không thể nạp danh sách chủ nuôi", "error");
    }
}

function closePetModal() {
    const modal = document.getElementById("pet-modal");
    if (modal) {
        modal.style.display = "none";
    }
}

async function savePet(event) {
    if (event) event.preventDefault();
	
    const idInput = document.getElementById("pet-id");
    const nameInput = document.getElementById("pet-name");
    const typeSelect = document.getElementById("pet-type");
    const breedInput = document.getElementById("pet-breed");
    const ageInput = document.getElementById("pet-age");
    const weightInput = document.getElementById("pet-weight");
    const ownerSelect = document.getElementById("pet-owner-select");
    const id = idInput ? idInput.value : "";
    const ownerId = ownerSelect ? Number(ownerSelect.value) : 0;

    if (!ownerId) {
        showToast("Vui lòng chọn chủ nuôi hợp lệ!", "error");
        return;
    }

    const petData = {
        name: nameInput ? nameInput.value : "",
        type: typeSelect ? typeSelect.value : "Dog",
        breed: breedInput ? breedInput.value : "",
        age: ageInput ? Number(ageInput.value) || 0 : 0,
        weight: weightInput ? Number(weightInput.value) || 0 : 0,
        ownerId: ownerId,
    };

    if (id) {
        const existingPet = pets.find(p => p.id === Number(id));
        if (existingPet) {
            petData.createdAt = existingPet.createdAt;
        }
    } else {
        petData.createdAt = new Date().toISOString();
    }

    try {
        let response;
        if (id) {
            response = await fetch(`${API.pets}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(petData)
            });
        } else {
            response = await fetch(API.pets, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(petData)
            });
        }

        if (response.ok) {
            showToast("Lưu thông tin thú cưng thành công!", "success");
            closePetModal();
            await loadPetData();

            if (typeof loadDashboardData === "function") {
                await loadDashboardData();
            }
        } else {
            showToast("Lưu thông tin thất bại. Vui lòng thử lại!", "error");
        }
    } catch (error) {
        console.error("Lỗi kết nối máy chủ:", error);
        showToast("Lỗi kết nối khi lưu thú cưng", "error");
    }
}

/* =====================================================
   EDIT PET
===================================================== */
function editPet(id) {
    const pet = pets.find(item => item.id === id);
    if (!pet) return;
    openPetModal(pet);
}

/* =====================================================
   DELETE PET
===================================================== */
async function deletePet(id) {
    const confirm = typeof confirmDelete === "function" 
        ? confirmDelete("Bạn có chắc muốn xóa thú cưng này?") 
        : window.confirm("Bạn có chắc muốn xóa thú cưng này?");
    if (!confirm) return;

    try {
        const response = await fetch(`${API.pets}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            showToast("Xóa thú cưng thành công", "success");
            await loadPetData();
        } else {
            showToast("Không thể xóa thú cưng này", "error");
        }
    } catch (error) {
        console.error(error);
        showToast("Xóa thất bại", "error");
    }
}