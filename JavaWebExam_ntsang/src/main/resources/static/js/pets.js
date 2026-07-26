/* =====================================================
    SHOW PET PAGE (COMPLETE & UPDATED)
===================================================== */
let currentPetSortDirection = "NONE"; // Biến lưu trạng thái sắp xếp theo tên thú cưng ("NONE", "ASC", "DESC")

async function showPets() {
    const mainView = document.getElementById("content");
    if (!mainView) return;

    mainView.innerHTML = `
        <div class="dashboard-container">
            <header class="dashboard-header">
                <div>
                    <h1>Quản Lý Thú Cưng</h1>
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
                            <button class="filter-btn" onclick="filterPet('DELETED', this)" style="color: #ef4444; border-color: #fca5a5;">🗑️ Đã xóa</button>
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
            const isDeleted = pet.deletedAt === true || pet.isDeleted === true;

            return `
                <tr class="pet-row" onclick="viewPetDetail(${pet.id})" style="${isDeleted ? 'opacity: 0.6; background: #fafafa;' : ''}">
                    <td>${stt}</td>
                    <td>
                        <div class="pet-cell" style="display: flex; align-items: center; gap: 8px;">
                            <div class="pet-avatar-mini" style="font-size: 20px;">        
                                <img src="${pet.image || ''}" style="width: 20px; height: 20px; object-fit: cover; border-radius: 50%;">
                            </div>
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
                    <td>${isDeleted ? '<span class="status-oval deleted" style="background: #fee2e2; color: #dc2626; padding: 2px 8px; border-radius: 12px; font-size: 12px;">Đã xóa</span>' : (typeof petStatusBadge === "function" ? petStatusBadge(pet.status) : pet.status)}</td>
                    <td>
                        <div class="action-group">
                            ${!isDeleted ? `<button class="action-btn edit" title="Chỉnh sửa" onclick="event.stopPropagation(); editPet(${pet.id})">✏️</button>` : ''}
                            ${!isDeleted ? `<button class="action-btn delete" title="Xóa" onclick="event.stopPropagation(); deletePet(${pet.id})">🗑️</button>` : ''}
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
    
    if (currentPetFilter === "DELETED") {
        result = result.filter(pet => pet.deletedAt === true || pet.isDeleted === true);
    } else {
        result = result.filter(pet => !(pet.deletedAt === true || pet.isDeleted === true));
        if (currentPetFilter !== "ALL") {
            result = result.filter(pet => pet.type === currentPetFilter);
        }
    }

    if (currentPetKeyword) {
        result = result.filter(pet => {
            const name = pet.name?.toLowerCase() ?? "";
            return name.includes(currentPetKeyword);
        });
    }
    return result;
}

function searchPet(keyword) {
    currentPetKeyword = keyword.toLowerCase();
    currentPetPage = 1;
    updatePetView();
}

function togglePetSort() {
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

// Hàm tải danh sách bảng giá đổ vào thẻ <select id="pet-pricing-select">
async function loadPricingOptionsToSelect() {
    const pricingSelect = document.getElementById("pet-pricing-select");
    if (!pricingSelect) return;

    try {
        // Thay API.pricings bằng đường dẫn API thực tế của bạn
        const response = await fetch(`${API.prices}`);
        if (response.ok) {
            const pricings = await response.json();
            
            let html = `<option value="">-- Chọn mức giá theo cân nặng --</option>`;
            if (Array.isArray(pricings) && pricings.length > 0) {
                pricings.forEach(item => {
                    // item mẫu: { id: 1, petType: "Dog", weightFrom: 0, weightTo: 10, actualPrice: 120000 }
                    html += `<option value="${item.id}">
                        [${item.petType}] Từ ${item.weightFrom}kg - ${item.weightTo}kg 
                        (Giá: ${item.actualPrice.toLocaleString('vi-VN')} VNĐ)
                    </option>`;
                });
            } else {
                html += `<option value="" disabled>Không có dữ liệu bảng giá</option>`;
            }
            pricingSelect.innerHTML = html;
        } else {
            pricingSelect.innerHTML = `<option value="" disabled>Lỗi tải bảng giá</option>`;
        }
    } catch (error) {
        console.error("Lỗi khi tải bảng giá:", error);
        pricingSelect.innerHTML = `<option value="" disabled>Lỗi kết nối máy chủ</option>`;
    }
}
/* =====================================================
    MODAL & CHỦ NUÔI INTEGRATION
===================================================== */
async function openPetModal(pet = null) {
    const modal = document.getElementById("pet-modal");
    const form = document.getElementById("pet-form");
    if (!modal) {
        console.warn("Không tìm thấy phần tử #pet-modal trên trang này.");
        return;
    }

    modal.style.display = "flex";

    const currentPetType = pet ? (pet.type || "Dog") : (document.getElementById("pet-type")?.value || "Dog");

    await Promise.all([
        loadOwnerOptionsToSelect(),
        loadPricingOptionsToSelect(currentPetType)
    ]);

    if (!pet) {
        if (form) {
            form.style.display = "block";
            form.reset();
        }
        const detailContainer = document.getElementById("pet-detail-view-container");
        if (detailContainer) detailContainer.style.display = "none";

        let idInput = document.getElementById("pet-id");
        if (idInput) idInput.value = "";
        
        const title = document.getElementById("title-detail");
        if (title) title.textContent = "Thêm mới thú nuôi";
        return;
    }

    if (form) {
        form.style.display = "block";
    }
    
    const idInput = document.getElementById("pet-id");
    const nameInput = document.getElementById("pet-name");
    const typeSelect = document.getElementById("pet-type");
    const breedInput = document.getElementById("pet-breed");
    const ageInput = document.getElementById("pet-age");
    const weightInput = document.getElementById("pet-weight");
    const ownerSelect = document.getElementById("pet-owner-select");
    const imageInput = document.getElementById("pet-image");
    const pricingSelect = document.getElementById("pet-pricing-select");

    if (idInput) idInput.value = pet.id || "";
    if (nameInput) nameInput.value = pet.name || "";
    if (typeSelect) typeSelect.value = pet.type || "Dog";
    if (breedInput) breedInput.value = pet.breed || "";
    if (ageInput) ageInput.value = pet.age || "";
    if (weightInput) weightInput.value = pet.weight || "";
    if (ownerSelect) ownerSelect.value = pet.ownerId || "";
    if (imageInput) imageInput.value = pet.image || "";

    if (pricingSelect && pet.weight && pet.type) {
        const petWeight = Number(pet.weight);
        const matchingOption = Array.from(pricingSelect.options).find(option => {
            if (!option.value) return false;
            const text = option.textContent;
            const matchType = text.includes(`[${pet.type}]`);
            const regex = /Từ\s+(\d+(?:\.\d+)?)\s*kg\s*-\s*(\d+(?:\.\d+)?)\s*kg/i;
            const match = text.match(regex);
            if (match && matchType) {
                const weightFrom = Number(match[1]);
                const weightTo = Number(match[2]);
                return petWeight >= weightFrom && petWeight <= weightTo;
            }
            return false;
        });

        if (matchingOption) {
            pricingSelect.value = matchingOption.value;
        }
    }

    const title = document.getElementById("title-detail") || modal.querySelector(".modal-title");
    if (title) {
        title.textContent = "Chỉnh sửa thông tin thú nuôi";
    }

    const detailContainer = document.getElementById("pet-detail-view-container");
    if (detailContainer) detailContainer.style.display = "none";
}

async function loadPricingOptionsToSelect() {
    const pricingSelect = document.getElementById("pet-pricing-select");
    if (!pricingSelect) return;

    try {
        const response = await fetch(`${API.prices}`);
        if (response.ok) {
            const pricings = await response.json();
            let html = `<option value="">-- Chọn mức giá theo cân nặng --</option>`;
            if (Array.isArray(pricings) && pricings.length > 0) {
                pricings.forEach(item => {
                    // item mẫu: { id: 1, petType: "Dog", weightFrom: 0, weightTo: 10, actualPrice: 120000 }
                    html += `<option value="${item.id}">
                        [${item.petType}] Từ ${item.weightFrom}kg - ${item.weightTo}kg 
                        (Giá: ${item.actualPrice ? item.actualPrice.toLocaleString('vi-VN') : 0} VNĐ)
                    </option>`;
                });
            } else {
                html += `<option value="" disabled>Không có dữ liệu bảng giá</option>`;
            }
            pricingSelect.innerHTML = html;
        } else {
            pricingSelect.innerHTML = `<option value="" disabled>Lỗi tải bảng giá</option>`;
        }
    } catch (error) {
        console.error("Lỗi khi tải bảng giá:", error);
        pricingSelect.innerHTML = `<option value="" disabled>Lỗi kết nối máy chủ</option>`;
    }
}

// Hàm phụ trợ để tải danh sách chủ nuôi đổ vào thẻ <select id="pet-owner-select">
async function loadOwnerOptionsToSelect() {
    const ownerSelect = document.getElementById("pet-owner-select");
    if (!ownerSelect) return;

    try {
        const response = await fetch(API.owners);
        if (response.ok) {
            const owners = await response.json();
            
            let html = `<option value="">-- Chọn chủ nuôi --</option>`;
            if (Array.isArray(owners) && owners.length > 0) {
                owners.forEach(owner => {
                    html += `<option value="${owner.id}">${owner.name} (${owner.phone || 'Không có SĐT'})</option>`;
                });
            } else {
                html += `<option value="" disabled>Không có chủ nuôi nào trong hệ thống</option>`;
            }
            ownerSelect.innerHTML = html;
        } else {
            ownerSelect.innerHTML = `<option value="" disabled>Lỗi tải danh sách chủ nuôi</option>`;
        }
    } catch (error) {
        console.error("Lỗi khi tải danh sách chủ nuôi:", error);
        ownerSelect.innerHTML = `<option value="" disabled>Lỗi kết nối máy chủ</option>`;
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
    const imageInput = document.getElementById("pet-image");
    
    const id = idInput ? idInput.value : "";
    const ownerId = ownerSelect ? Number(ownerSelect.value) : 0;
    const name = nameInput ? nameInput.value.trim() : "";
    const type = typeSelect ? typeSelect.value : "Dog";
    const age = ageInput ? Number(ageInput.value) : 0;
    const weight = weightInput ? Number(weightInput.value) : 0;

    if (!ownerId) {
        showToast("Vui lòng chọn chủ nuôi hợp lệ!", "error");
        return;
    }
    if (!name) {
        showToast("Vui lòng nhập tên thú cưng!", "error");
        return;
    }
    if (isNaN(age) || age <= 0) {
        showToast("Tuổi thú cưng phải lớn hơn 0!", "error");
        return;
    }
    if (isNaN(weight) || weight <= 0) {
        showToast("Cân nặng thú cưng phải lớn hơn 0!", "error");
        return;
    }
    
    const isDuplicate = pets.some(p => {
        const isCurrentPet = id && Number(p.id) === Number(id);
        if (isCurrentPet) return false;
        return Number(p.ownerId) === Number(ownerId) &&
               p.name.trim().toLowerCase() === name.toLowerCase() &&
               p.type === type;
    });

    if (isDuplicate) {
        showToast(`Chủ nuôi này đã có thú cưng loại "${type}" tên là "${name}" rồi!`, "error");
        return;
    }

    const petData = {
        name: name,
        type: type,
        breed: breedInput ? breedInput.value : "",
        age: age,
        weight: weight,
        ownerId: ownerId,
        image: imageInput ? imageInput.value : ""
    };
    
    if (id) {
        const existingPet = pets.find(p => Number(p.id) === Number(id));
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

function editPet(id) {
    const pet = pets.find(item => item.id === id);
    if (!pet) return;
    openPetModal(pet);
}

/* =====================================================
   XÓA THÚ CƯNG (DỰA TRÊN LOGIC TRẠNG THÁI pet.status)
===================================================== */
async function deletePet(id) {
    const pet = pets.find(item => Number(item.id) === Number(id));
    if (!pet) {
        showToast("Không tìm thấy thông tin thú cưng", "error");
        return;
    }

    if (pet.status === "BOARDING") {
        showToast("Không thể xóa thú cưng đang trong quá trình đang gửi!", "error");
        return;
    }

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
            
            if (typeof loadDashboardData === "function") {
                await loadDashboardData();
            }
        } else {
            showToast("Không thể xóa thú cưng này", "error");
        }
    } catch (error) {
        console.error("Lỗi kết nối khi xóa:", error);
        showToast("Xóa thất bại", "error");
    }
}

/* =====================================================
    XEM CHI TIẾT THÚ CƯNG & THỐNG KÊ LẦN GỬI
===================================================== */
async function viewPetDetail(id) {
    const pet = pets.find(item => Number(item.id) === Number(id));
    if (!pet) return;

    // 1. Mở modal chính
    const modal = document.getElementById("pet-modal");
    if (!modal) {
        showToast("Không tìm thấy modal hiển thị!", "error");
        return;
    }
    modal.style.display = "flex";

    // 2. Ẩn form chỉnh sửa, hiện container xem chi tiết
    const form = document.getElementById("pet-form");
    if (form) form.style.display = "none";

    let detailContainer = document.getElementById("pet-detail-view-container");
    if (!detailContainer) {
        // Nếu chưa có container chi tiết trong HTML, tự động tạo bên trong modal-content
        const modalContent = modal.querySelector(".modal-content") || modal.querySelector("div");
        detailContainer = document.createElement("div");
        detailContainer.id = "pet-detail-view-container";
        if (modalContent) modalContent.appendChild(detailContainer);
    }
    detailContainer.style.display = "block";

    // 3. Lấy thông tin chủ nuôi
    const owner = await getOwnerById(pet.ownerId);

    // 4. Lấy lịch sử gửi thú cưng (boarding records) để tính toán số lần & thời gian gần nhất
    let totalBoardingCount = 0;
    let latestBoardingText = "Chưa từng gửi";

    try {
        const response = await fetch(API.boarding);
        if (response.ok) {
            const boardingRecords = await response.json();
            // Lọc các bản ghi gửi của thú cưng này dựa trên petId
            const petRecords = boardingRecords.filter(item => Number(item.petId) === Number(pet.id));
            
            totalBoardingCount = petRecords.length;

            if (totalBoardingCount > 0) {
                // Sắp xếp giảm dần theo checkInDate mới nhất
                petRecords.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
                
                const latest = petRecords[0];
                const checkIn = latest.checkInDate ? new Date(latest.checkInDate).toLocaleDateString("vi-VN") : "N/A";
                
                // Ưu tiên hiển thị ngày trả thực tế (actualCheckOut), nếu chưa có thì lấy ngày dự kiến (expectedReturn), nếu không thì ghi "Đang gửi"
                let checkOut = "Đang gửi";
                if (latest.actualCheckOut) {
                    checkOut = new Date(latest.actualCheckOut).toLocaleDateString("vi-VN");
                } else if (latest.expectedReturn) {
                    checkOut = new Date(latest.expectedReturn).toLocaleDateString("vi-VN") + " (Dự kiến)";
                }
                
                latestBoardingText = `${checkIn} ➔ ${checkOut}`;
            }
        }
    } catch (error) {
        console.error("Lỗi khi tải lịch sử gửi:", error);
    }

    // 5. Render nội dung chi tiết vào modal
    detailContainer.innerHTML = `
        <div class="pet-detail-header" style="text-align: center; margin-bottom: 20px;">
            <img src="${pet.image || ''}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%; border: 3px solid #f3f4f6; margin-bottom: 10px;">
            <h2 style="margin: 0; color: #111;">${pet.name ?? "Không rõ"}</h2>
            <p style="color: #666; font-size: 14px; margin: 4px 0 0 0;">${pet.type} - ${pet.breed || "Không rõ giống"}</p>
        </div>

        <div class="pet-detail-info" style="background: #f9fafb; padding: 16px; border-radius: 8px; font-size: 14px; display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">🎂 Tuổi:</span>
                <strong>${pet.age ?? 0} tuổi</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">⚖️ Cân nặng:</span>
                <strong>${pet.weight ?? 0} kg</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">👤 Chủ nuôi:</span>
                <strong>${owner ? owner.name + ' (' + (owner.phone || 'Không có SĐT') + ')' : 'Không có'}</strong>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 4px 0;">
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">📦 Tổng số lần gửi:</span>
                <strong style="color: #2563eb;">${totalBoardingCount} lần</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">⏱️ Khung thời gian gửi gần nhất:</span>
                <strong style="color: #16a34a;">${latestBoardingText}</strong>
            </div>
        </div>

        <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" class="btn-secondary" onclick="closePetModal()" style="padding: 8px 16px; background: #e5e7eb; border: none; border-radius: 6px; cursor: pointer;">Đóng</button>
            <button type="button" class="btn-primary" onclick="closePetModal(); editPet(${pet.id});" style="padding: 8px 16px; background: #2563eb; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Chỉnh sửa</button>
        </div>
    `;

    const modalTitle = document.getElementById("title-detail") || modal.querySelector(".modal-title");
    if (modalTitle) {
        modalTitle.textContent = "Chi tiết thú nuôi";
    }
}