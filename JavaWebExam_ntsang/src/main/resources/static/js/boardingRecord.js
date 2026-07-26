/* =====================================================
    BOARDING.JS - PHIẾU GỬI MANAGEMENT (ADVANCED FILTER)
===================================================== */

let allBoardingRecords = [];

async function showBoardingRecords() {
    const mainView = document.getElementById("content");
    if (!mainView) return;
    
    mainView.innerHTML = `
        <div class="dashboard-container">
            <header class="dashboard-header">
                <div>
                    <h1>Phiếu gửi</h1>
                    <p style="color: #999; margin: 4px 0 0 0; font-size: 14px;">Quản lý và theo dõi lịch sử gửi thú cưng</p>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <button class="btn-create" onclick="openBoardingModal()">+ Thêm Phiếu Gửi</button>
                </div>
            </header>

            <div class="dashboard-tabs">
                <div class="tab-item">Danh sách phiếu gửi</div>
            </div>

            <!-- BỘ LỌC NÂNG CAO (ADVANCED FILTER PANEL) -->
            <div class="boarding-filter-panel">
                <div class="boarding-filter-group" style="flex: 2; min-width: 220px;">
                    <label>Tìm kiếm nhanh</label>
                    <input type="text" id="boarding-search" placeholder="Tìm tên pet hoặc chủ nuôi..." oninput="searchBoarding(this.value)">
                </div>

                <div class="boarding-filter-group">
                    <label>Loài thú cưng</label>
                    <select id="filter-pet-type" onchange="applyAdvancedBoardingFilters()">
                        <option value="">Tất cả loài</option>
                        <option value="Dog">Chó (Dog)</option>
                        <option value="Cat">Mèo (Cat)</option>
                        <option value="Other">Khác</option>
                    </select>
                </div>

                <div class="boarding-filter-group">
                    <label>Chủ nuôi</label>
                    <select id="filter-owner" onchange="applyAdvancedBoardingFilters()">
                        <option value="">Tất cả chủ nuôi</option>
                    </select>
                </div>

                <div class="boarding-filter-group">
                    <label>Từ ngày (Check-in)</label>
                    <input type="date" id="boarding-start-date" onchange="onStartDateFilterChange()">
                </div>

                <div class="boarding-filter-group">
                    <label>Đến ngày (Check-in)</label>
                    <input type="date" id="boarding-end-date" onchange="applyAdvancedBoardingFilters()">
                </div>

                <div class="boarding-filter-actions">
                    <button class="btn-reset-filter" onclick="resetBoardingFilters()" title="Làm mới bộ lọc">Làm mới</button>
                </div>
            </div>

            <section class="dashboard-grid-owner">
                <div class="panel">
                    <div class="panel-title-area">
                        <div class="filter-group">
                            <button class="filter-btn active" onclick="filterBoardingRecord('ALL', this)">
                                Tất cả <span class="filter-count" id="count-all">0</span>
                            </button>
                            <button class="filter-btn" onclick="filterBoardingRecord('BOARDING', this)">
                                Đang gửi <span class="filter-count" id="count-boarding">0</span>
                            </button>
                            <button class="filter-btn" onclick="filterBoardingRecord('RETURNED', this)">
                                Đã trả <span class="filter-count" id="count-returned">0</span>
                            </button>
                            <button class="filter-btn" onclick="filterBoardingRecord('DELETED', this)">
                                Đã xóa <span class="filter-count" id="count-deleted">0</span>
                            </button>
                        </div>
                        <div class="filter-group">
                            <select id="boarding-sort" class="filter-btn" style="padding: 5px 10px;" onchange="sortBoarding(this.value)">
                                <option value="NEW">Mới nhất</option>
                                <option value="OLD">Cũ nhất</option>
                            </select>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>THÚ CƯNG</th>
                                <th>CHỦ NUÔI</th>
                                <th>NGÀY GỬI</th>
                                <th>NGÀY TRẢ DỰ KIẾN</th>
                                <th>PHÍ</th>
                                <th>TRẠNG THÁI</th>
                                <th>THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody id="boarding-table">
                            <tr>
                                <td colspan="8" style="text-align: center; padding: 20px; color: #999;">Đang tải dữ liệu...</td>
                            </tr>
                        </tbody>
                    </table>

                    <div id="boarding-pagination" class="pagination"></div>
                </div>
            </section>
        </div>
    `;

    currentBoardingPage = 1;
    currentBoardingFilter = "ALL";
    currentBoardingKeyword = "";
    currentBoardingSort = "NEW";
    
    await loadOwnersForBoardingFilter();
    await loadBoardingRecords();
}

// Xử lý ràng buộc ngày ở bộ lọc
function onStartDateFilterChange() {
    const startDateInput = document.getElementById("boarding-start-date");
    const endDateInput = document.getElementById("boarding-end-date");
    
    if (startDateInput && endDateInput) {
        endDateInput.min = startDateInput.value;
        if (endDateInput.value && endDateInput.value < startDateInput.value) {
            endDateInput.value = startDateInput.value;
        }
    }
    applyAdvancedBoardingFilters();
}

async function loadOwnersForBoardingFilter() {
    try {
        const response = await fetch(API.owners);
        if (!response.ok) return;
        const owners = await response.json();
        const ownerSelect = document.getElementById("filter-owner");
        if (ownerSelect) {
            ownerSelect.innerHTML = `<option value="">Tất cả chủ nuôi</option>` + 
                owners.map(o => `<option value="${o.id}">${o.name} (${o.phone})</option>`).join("");
        }
    } catch (error) {
        console.error("Lỗi tải danh sách chủ nuôi:", error);
    }
}

async function loadBoardingRecords() {
    try {
        let url = `${API.boarding}/paginations?page=0&size=1000&status=ALL`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Lỗi tải dữ liệu");    
        const result = await response.json(); 
        
        allBoardingRecords = result.content || result.data || result;
        if (!Array.isArray(allBoardingRecords)) allBoardingRecords = [];

        processAndRenderBoarding();
    } catch (error) {
        console.error("Load boarding error:", error);
        showToast("Không tải được phiếu gửi", "error");
    }
}

async function processAndRenderBoarding() {
    let filtered = [...allBoardingRecords];

    // Lọc theo Tab trạng thái
    if (currentBoardingFilter === "DELETED") {
        filtered = filtered.filter(item => item.isDeleted || item.deleted);
    } else {
        // Loại bỏ các bản ghi đã xóa ở các tab thông thường
        filtered = filtered.filter(item => !(item.isDeleted || item.deleted));
        if (currentBoardingFilter !== "ALL") {
            filtered = filtered.filter(item => item.status === currentBoardingFilter);
        }
    }

    if (currentBoardingKeyword) {
        filtered = filtered.filter(item => {
            const text = `${item.petName || ""} ${item.ownerName || ""}`.toLowerCase();
            return text.includes(currentBoardingKeyword);
        });
    }

    const petTypeVal = document.getElementById("filter-pet-type")?.value;
    if (petTypeVal && petTypeVal !== "") {
        const filterPromises = filtered.map(async item => {
            let pType = item.petType || (item.pet ? item.pet.type : null);
            if (!pType && item.petId) {
                const foundPet = typeof getPetById === "function" ? await getPetById(item.petId) : globalPetsData.find(p => String(p.id) === String(item.petId));
                pType = foundPet ? (foundPet.type || foundPet.petType) : "";
            }
            return (pType || "").trim().toLowerCase() === petTypeVal.trim().toLowerCase();
        });
        const filterResults = await Promise.all(filterPromises);
        filtered = filtered.filter((_, index) => filterResults[index]);
    }

    const ownerIdVal = document.getElementById("filter-owner")?.value;
    if (ownerIdVal) {
        const filterPromises = filtered.map(async item => {
            let oId = item.ownerId;
            if (!oId && item.petId) {
                const pet = await getPetById(item.petId);
                oId = pet ? pet.ownerId : null;
            }
            return String(oId) === String(ownerIdVal);
        });
        const filterResults = await Promise.all(filterPromises);
        filtered = filtered.filter((_, index) => filterResults[index]);
    }

    const startDateVal = document.getElementById("boarding-start-date")?.value;
    const endDateVal = document.getElementById("boarding-end-date")?.value;
    if (startDateVal || endDateVal) {
        filtered = filtered.filter(item => {
            if (!item.checkInDate) return false;
            const checkInDateStr = item.checkInDate.split('T')[0];
            if (startDateVal && checkInDateStr < startDateVal) return false;
            if (endDateVal && checkInDateStr > endDateVal) return false;
            return true;
        });
    }

    filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.checkInDate || 0);
        const dateB = new Date(b.createdAt || b.checkInDate || 0);
        return currentBoardingSort === "NEW" ? dateB - dateA : dateA - dateB;
    });

    // Tính toán số lượng cho các Badge
    const activeRecords = allBoardingRecords.filter(item => !(item.isDeleted || item.deleted));
    const totalItems = filtered.length; // Số lượng theo kết quả tìm kiếm/lọc hiện tại của bảng

    // Cố định số lượng các badge thống kê từ dữ liệu gốc
    const allCount = activeRecords.length;
    const boardingCount = activeRecords.filter(item => item.status === "BOARDING").length;
    const returnedCount = activeRecords.filter(item => item.status === "RETURNED").length;
    const deletedCount = allBoardingRecords.filter(item => item.isDeleted || item.deleted).length;

    const startIndex = (currentBoardingPage - 1) * BOARDING_PER_PAGE;
    const endIndex = startIndex + BOARDING_PER_PAGE;
    const paginatedData = filtered.slice(startIndex, endIndex);

    await renderBoardingTable(paginatedData);
    updateFilterCounts(allCount, boardingCount, returnedCount, deletedCount);
    renderApiBoardingPagination(totalItems);
}

function applyAdvancedBoardingFilters() {
    currentBoardingPage = 1;
    processAndRenderBoarding();
}

function resetBoardingFilters() {
    const searchInput = document.getElementById("boarding-search");
    const petTypeSelect = document.getElementById("filter-pet-type");
    const ownerSelect = document.getElementById("filter-owner");
    const startDateInput = document.getElementById("boarding-start-date");
    const endDateInput = document.getElementById("boarding-end-date");

    if (searchInput) searchInput.value = "";
    if (petTypeSelect) petTypeSelect.value = "";
    if (ownerSelect) ownerSelect.value = "";
    if (startDateInput) startDateInput.value = "";
    if (endDateInput) {
        endDateInput.value = "";
        endDateInput.min = "";
    }

    currentBoardingKeyword = "";
    currentBoardingPage = 1;
    processAndRenderBoarding();
}

async function renderBoardingTable(data) {
    const tableBody = document.getElementById("boarding-table");
    if (!tableBody) return;

    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: #999;">Chưa có phiếu gửi nào phù hợp</td></tr>`;
        return;
    }
    const rows = await Promise.all(
        data.map(async (record) => {
            const pet = await getPetById(record.petId);
            const owner = pet ? await getOwnerById(pet.ownerId) : null;
            const petIcon = typeof getPetIcon === "function" && pet ? getPetIcon(pet.type) : "🐾";
            const isDeleted = record.isDeleted || record.deleted;

            const checkoutBtn = record.status === "BOARDING" && !isDeleted
                ? `<button class="action-btn edit" style="background: #dcfce7; color: #15803d;" title="Trả thú cưng" onclick="checkoutBoarding(${record.id})">🏠</button>`
                : "";
            
                
            let statusText = record.status === "BOARDING" ? "Đang gửi" : "Đã trả";
            if (isDeleted) statusText = "Đã xóa";

            const statusClass = isDeleted ? "deleted" : record.status.toLowerCase();
            const feeText = record.status === "RETURNED" || record.totalFee > 0 ? formatMoney(record.totalFee) : "—";
            
            return `
                <tr style="cursor: pointer; ${isDeleted ? 'opacity: 0.6; background: #fafafa;' : ''}" onclick="event.stopPropagation(); showBoardingDetail(${record.id})">
                    <td>${record.id}</td>
                    <td>
                        <div class="pet-cell">
                            <img src="${pet?.image || ''}" style="width: 20px; height: 20px; object-fit: cover; border-radius: 50%;">
                            <div class="pet-meta">
                                <strong>${pet ? pet.name : (record.petName ?? "Unknown")}</strong>
                                <small>${pet ? (pet.breed ?? "Giống loại") : "—"}</small>
                            </div>
                        </div>
                    </td>
                    <td class="owner-cell">${record.ownerName || (owner ? owner.name : "-")}</td>
                    <td>${formatDate(record.checkInDate)}</td>
                    <td>${formatDate(record.expectedReturn)}</td>
                    <td class="fee-cell">${feeText}</td>
                    <td>
                        <span class="status-oval ${statusClass}">${statusText}</span>
                    </td>
                    <td>
                        <div class="action-group" onclick="event.stopPropagation();">
                            ${checkoutBtn}
                            ${!isDeleted ? `<button class="action-btn edit" title="Chỉnh sửa" onclick="editBoarding(${record.id})">✏️</button>` : ''}
                            ${!isDeleted ? `<button class="action-btn delete" title="Xóa" onclick="deleteBoarding(${record.id})">🗑️</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        })
    );
    tableBody.innerHTML = rows.join("");
}

function updateFilterCounts(totalItems, boardingCount, returnedCount, deletedCount) {
    const countAllEl = document.getElementById("count-all");
    const countBoardingEl = document.getElementById("count-boarding");
    const countReturnedEl = document.getElementById("count-returned");
    const countDeletedEl = document.getElementById("count-deleted");

    if (countAllEl) countAllEl.textContent = totalItems;
    if (countBoardingEl) countBoardingEl.textContent = boardingCount;
    if (countReturnedEl) countReturnedEl.textContent = returnedCount;
    if (countDeletedEl) countDeletedEl.textContent = deletedCount;
}

async function getPetById(id) {
    if (!id) return null;
    try {
        const response = await fetch(`${API.pets}/${id}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Lỗi getPetById:", error);
        return null;
    }
}

async function getOwnerById(id) {
    if (!id) return null;
    try {
        const response = await fetch(`${API.owners}/${id}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Lỗi getOwnerById:", error);
        return null;
    }
}

function searchBoarding(keyword) {
    currentBoardingKeyword = keyword.trim().toLowerCase();
    currentBoardingPage = 1;
    processAndRenderBoarding();
}

function filterBoardingRecord(status, btnElement) {
    const buttons = btnElement.parentElement.querySelectorAll(".filter-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    btnElement.classList.add("active");
    currentBoardingFilter = status;
    currentBoardingPage = 1;
    processAndRenderBoarding();
}

function sortBoarding(type) {
    currentBoardingSort = type;
    currentBoardingPage = 1;
    processAndRenderBoarding();
}

function renderApiBoardingPagination(totalItems) {
    const pagination = document.getElementById("boarding-pagination");
    if (!pagination) return;

    const totalPages = Math.ceil(totalItems / BOARDING_PER_PAGE);
    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    let html = "";
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = currentBoardingPage === i ? "active" : "";
        html += `<button class="page-btn ${activeClass}" onclick="changeBoardingPage(${i})">${i}</button>`;
    }
    pagination.innerHTML = html;
}

async function changeBoardingPage(page) {
    currentBoardingPage = page;
    await processAndRenderBoarding();
    document.querySelector(".dashboard-grid-owner")?.scrollIntoView({ behavior: 'smooth' });
}

async function openBoardingModal(record = null) {
    const modal = document.getElementById("boarding-modal");
    const form = document.getElementById("boarding-form");
    const petSelect = document.getElementById("modal-pet-select");
    const ownerInput = document.getElementById("modal-owner-name");
    const checkInInput = document.getElementById("modal-check-in");
    const expectedReturnInput = document.getElementById("modal-expected-return");
    const totalFeeInput = document.getElementById("modal-total-fee");    
    if (!modal) return;
    
    let idInput = document.getElementById("modal-boarding-id");
    if (!idInput) {
        idInput = document.createElement("input");
        idInput.type = "hidden";
        idInput.id = "modal-boarding-id";
        if (form) form.appendChild(idInput);
    }
    if (form) form.reset();
    if (ownerInput) ownerInput.value = "";
    idInput.value = "";
    modal.style.display = "flex";

    if (!petSelect) return;

    try {
        const response = await fetch(API.pets);
        const allPets = await response.json();
        
        // Chỉ cho phép chọn thú cưng chưa từng được gửi hoặc đã trả (loại bỏ những con đang ở trạng thái BOARDING)
        const activePetIds = allBoardingRecords
            .filter(b => b.status === "BOARDING" && !(b.isDeleted || b.deleted) && (!record || b.id !== record.id))
            .map(b => String(b.petId));

        const availablePets = allPets.filter(p => !activePetIds.includes(String(p.id)));

        petSelect.innerHTML = `
            <option value="">-- Chọn thú cưng --</option>
            ${availablePets.map(p => `
                <option value="${p.id}" 
                    data-owner-id="${p.ownerId || ''}" 
                    data-owner-name="${p.ownerName || p.owner?.name || ''}" 
                    data-type="${p.type || 'Other'}" 
                    data-weight="${p.weight || 0}">
                    ${p.name} (${p.type || 'Other'})
                </option>
            `).join("")}
        `;

        const todayStr = new Date().toISOString().split('T')[0];

        if (checkInInput) {
            checkInInput.min = todayStr;
            checkInInput.value = todayStr;
            checkInInput.onchange = function() {
                if (expectedReturnInput) {
                    expectedReturnInput.min = checkInInput.value;
                    if (expectedReturnInput.value && expectedReturnInput.value < checkInInput.value) {
                        expectedReturnInput.value = checkInInput.value;
                    }
                }
            };
        }

        if (expectedReturnInput) {
            expectedReturnInput.min = todayStr;
        }

        if (record) {
            idInput.value = record.id;
            petSelect.value = record.petId;
            if (typeof onModalPetChange === "function") await onModalPetChange();
            if (checkInInput) {
                checkInInput.value = record.checkInDate ? record.checkInDate.split('T')[0] : todayStr;
            }
            if (expectedReturnInput) {
                expectedReturnInput.min = checkInInput.value;
                expectedReturnInput.value = record.expectedReturn ? record.expectedReturn.split('T')[0] : "";
            }
            if (totalFeeInput) totalFeeInput.value = record.totalFee ?? 0;
        }
    } catch (error) {
        console.error("Lỗi khi chuẩn bị dữ liệu trong Modal:", error);
        showToast("Không thể tải thông tin biểu mẫu", "error");
    }
}
async function onModalPetChange() {
    console.log("Tetdb");
    const petSelect = document.getElementById("modal-pet-select");
    const ownerNameResult = document.getElementById("modal-owner-name");
    const pricePerDayInput = document.getElementById("modal-price-per-day");
    if (!petSelect) return;
    const petId = petSelect.value;
    if (!petId) {
        if (ownerInput) ownerInput.value = "";
        if (pricePerDayInput) pricePerDayInput.value = "";
        currentPricePerDay = 0;
        calculateEstimatedFee();
        return;
    }
    const selectedOption = petSelect.options[petSelect.selectedIndex];
    let ownerName = selectedOption.getAttribute("data-owner-name") || "";
    let petType = selectedOption.getAttribute("data-type") || "Other";
    let petWeight = Number(selectedOption.getAttribute("data-weight")) || 0;
    const ownerId = selectedOption.getAttribute("data-owner-id");
    if (!ownerName && (ownerId || petId)) {
        try {
            if (ownerId) {
                const ownerRes = await fetch(`${API.owners}/${ownerId}`);
                if (ownerRes.ok) {
                    const ownerData = await ownerRes.json();
                    ownerName = ownerData.fullName || ownerData.name || "";
                }
            } else {
                const petRes = await fetch(`${API.pets}/${petId}`);
                if (petRes.ok) {
                    const petData = await petRes.json();
                    if (petData.type) petType = petData.type;
                    if (petData.weight) petWeight = Number(petData.weight);
                    if (petData.ownerId) {
                        const ownerRes = await fetch(`${API.owners}/${petData.ownerId}`);
                        if (ownerRes.ok) {
                            const ownerData = await ownerRes.json();
                            ownerName = ownerData.fullName || ownerData.name || "";
                        }
                    }
                }
            }
        } catch (e) {
            console.warn("Không thể fetch bổ sung thông tin pet/owner:", e);
        }
    }
    if (ownerNameResult) {
        ownerNameResult.value = ownerName;
		console.log(ownerName);
    }
    try {
        const response = await fetch(`${API.prices}/search?typeOfAnimal=${encodeURIComponent(petType)}&weight=${petWeight}`);
        if (response.ok) {
            const priceData = await response.json();
            currentPricePerDay = priceData.basePrice || priceData.price || 0;
            if (pricePerDayInput) pricePerDayInput.value = currentPricePerDay;        
            calculateEstimatedFee();
        } else {
            currentPricePerDay = 0;
            if (pricePerDayInput) pricePerDayInput.value = 0;
            calculateEstimatedFee();
        }
    } catch (error) {
        console.error("Lỗi khi lấy đơn giá:", error);
        currentPricePerDay = 0;
        if (pricePerDayInput) pricePerDayInput.value = 0;
        calculateEstimatedFee();
    }
}

function calculateEstimatedFee() {
    const checkInInput = document.getElementById("modal-check-in")?.value;
    const expectedReturnInput = document.getElementById("modal-expected-return")?.value;
    const totalFeeInput = document.getElementById("modal-total-fee");
    
    if (!checkInInput || !expectedReturnInput || currentPricePerDay <= 0) {
        if (totalFeeInput) totalFeeInput.value = 0;
        return;
    }
    const checkInDate = new Date(checkInInput);
    const expectedDate = new Date(expectedReturnInput);
    const diffTime = expectedDate.getTime() - checkInDate.getTime();
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
        diffDays = 1;
    }
    const estimatedTotal = diffDays * currentPricePerDay;
    if (totalFeeInput) totalFeeInput.value = estimatedTotal;
}

function closeBoardingModal() {
    const modal = document.getElementById("boarding-modal");
    if (modal) {
        modal.style.display = "none";
    }
}


let currentPricePerDay = 0;

async function saveBoarding(event) {
    if (event) event.preventDefault();
    const idInput = document.getElementById("modal-boarding-id");
    const petSelect = document.getElementById("modal-pet-select");
    const checkInInput = document.getElementById("modal-check-in");
    const expectedReturnInput = document.getElementById("modal-expected-return");
	const noteInput = document.getElementById("modal-notes");
    const id = idInput ? idInput.value : "";
    const petId = Number(petSelect?.value);
    if (!petId) {
        showToast("Vui lòng chọn một thú cưng hợp lệ!", "error");
        return;
    }
    const checkInDateStr = checkInInput ? checkInInput.value : "";
    const expectedReturnStr = expectedReturnInput ? expectedReturnInput.value : "";
    if (!checkInDateStr || !expectedReturnStr) {
        showToast("Vui lòng chọn đầy đủ ngày gửi và ngày dự kiến trả!", "error");
        return;
    }
    const selectedOption = petSelect.options[petSelect.selectedIndex];
    const petText = selectedOption.text;
    const petName = petText.split(" (")[0];

    let petType = "Other";
    if (petText.toLowerCase().includes("dog")) petType = "Dog";
    else if (petText.toLowerCase().includes("cat")) petType = "Cat";
    else if (petText.toLowerCase().includes("bird")) petType = "Bird";
    else if (petText.toLowerCase().includes("rabbit")) petType = "Rabbit";
    const petWeight = Number(selectedOption.getAttribute("data-weight")) || 0;
    let baseFee = 0;
    let pricePerDay = 0;
    try {
        const priceResponse = await fetch(`${API.prices}/search?typeOfAnimal=${encodeURIComponent(petType)}&weight=${petWeight}`);
        if (priceResponse.ok) {
            const priceData = await priceResponse.json();
            pricePerDay = priceData.basePrice || priceData.price || 0; // Tùy thuộc cấu trúc trả về của DTO
        } else {
            showToast("Không tìm thấy đơn giá phù hợp cho thú cưng này!", "error");
            return;
        }      
        const checkInDate = new Date(checkInDateStr);
        const expectedDate = new Date(expectedReturnStr);
        const diffTime = expectedDate.getTime() - checkInDate.getTime();
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 0) {
            diffDays = 1;
        }
        baseFee = diffDays * pricePerDay;

    } catch (error) {
        console.error("Lỗi khi tính toán chi phí:", error);
        showToast("Lỗi khi lấy thông tin giá cước!", "error");
        return;
    }
    const data = {
        petId: petId,
        petName: petName,
        petType: petType,
        ownerName: document.getElementById("modal-owner-name")?.value || "",
        checkInDate: checkInDateStr,
        expectedReturn: expectedReturnStr,
        pricePerDay: pricePerDay,
        baseFee: baseFee,
		notes: noteInput ? noteInput.value : "",
        status: "BOARDING"
    };
    if (id) {
        const existingRecord = boardingRecords.find(item => item.id === Number(id));
        if (existingRecord) {
            data.status = existingRecord.status;
            data.createdAt = existingRecord.createdAt;
        }
    } else {
        data.createdAt = new Date().toISOString();
    }

    try {
        let response;
        if (id) {
            response = await fetch(`${API.boarding}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(API.boarding, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        }

        if (response.ok) {
            showToast("Lưu phiếu gửi thành công", "success");
            closeBoardingModal();
            await loadBoardingRecords();
        } else {
            showToast("Không thể lưu phiếu gửi", "error");
        }
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu lên máy chủ:", error);
        showToast("Lưu thất bại do sự cố kết nối", "error");
    }
}

function editBoarding(id) {
    const record = allBoardingRecords.find(item => item.id === id);
    if (!record) return;
    openBoardingModal(record);
}

async function checkoutBoarding(boardingId, totalFee) {
    const confirm = window.confirm("Xác nhận trả thú cưng?");
    if (!confirm) return;
	const checkoutInfor = {
		actualCheckOut: new Date().toISOString(),
		baseFee: totalFee
	}
	console.log(checkoutInfor);
    try {
        const response = await fetch(`${API.boarding}/checkout/${boardingId}`, {
            method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(checkoutInfor)
        });

        if (response.ok) {
            showToast("Checkout thành công", "success");
            await loadBoardingRecords();
        }
    } catch (error) {
        console.error(error);
        showToast("Checkout thất bại", "error");
    }
}

function closeDetailModal() {
    const modal = document.getElementById("detail-modal");
    if (modal) modal.style.display = "none";
}

function closeDetailModalNote() {
    const modal = document.getElementById("detail-modal-note");
    if (modal) modal.style.display = "none";
}

function openNoteModal() {
    const modal = document.getElementById("note-modal");
    const form = document.getElementById("note-form");
    if (form) form.reset();
    if (modal) modal.style.display = "flex";
}

function closeNoteModal() {
    const modal = document.getElementById("note-modal");
    if (modal) modal.style.display = "none";
}

async function showBoardingDetail(id) {
    const modal = document.getElementById("detail-modal-note");
    if (!modal) return;
    try {
        const response = await fetch(`${API.boarding}/${id}`);
        if (!response.ok) throw new Error("Không thể tải phiếu gửi");
        const record = await response.json();
		        let pet = null
		console.log(record);
        let owner = null;
        try {
            pet = await getPetById(record.petId);
            if (pet) {
                owner = await getOwnerById(pet.ownerId);
            }
        } catch (e) {
            console.warn("Không lấy được dữ liệu chi tiết của Pet/Owner từ API phụ:", e);
        }       
        const petIcon = typeof getPetIcon === "function" && pet ? getPetIcon(pet.type) : "🐾";
        const petNameToShow = record.petName || (pet ? pet.name : "Unknown");
        const petTypeToShow = pet ? pet.type : "Khác";        
        const detPetNameEl = document.getElementById("det-pet-name-detail");
        if (detPetNameEl) {
            detPetNameEl.innerHTML = `${petIcon} ${petNameToShow} (${petTypeToShow})`;
        }        
        const detOwnerInfoEl = document.getElementById("det-owner-info");
        if (detOwnerInfoEl) {
            detOwnerInfoEl.textContent = record.ownerName 
                ? `${record.ownerName} ${owner ? `• ${owner.phone}` : ""}` 
                : (owner ? `${owner.name} • ${owner.phone}` : "—");
        }
            
        const detCheckInEl = document.getElementById("det-check-in-detail");
        if (detCheckInEl) {
            detCheckInEl.textContent = formatDate(record.checkInDate);
        }
        const actualReturnEl = document.getElementById("det-actual-return-detail");
        const feeEl = document.getElementById("det-fee-detail");
        
        if (actualReturnEl && feeEl) {
            if (record.status === "BOARDING") {
                actualReturnEl.textContent = "—";
                feeEl.textContent = record.pricePerDay;
                feeEl.style.color = "#888";
            } else {
                actualReturnEl.textContent = formatDate(record.actualCheckOut);
                feeEl.textContent = record.totalFee ? formatMoney(record.totalFee) : "0đ";
                feeEl.style.color = "#15803d"; 
            }
        }
        const statusEl = document.getElementById("det-status-detail");
        if (statusEl) {
            statusEl.textContent = record.status === "BOARDING" ? " Đang gửi" : " Đã trả";
            statusEl.className = `status-oval ${record.status.toLowerCase()}`;
        }
        const detNotesEl = document.getElementById("det-notes-detail");
        if (detNotesEl) {
            detNotesEl.textContent = record.notes || "Không có ghi chú ban đầu";
        }
        renderCareNotesList(record.careNote || []);
        const btnSubmit = document.getElementById("btn-submit-care-note");
        const inputField = document.getElementById("new-care-note-text");
        const inputContainer = document.getElementById("care-note-input-container");

        if (record.status === "BOARDING") {
            if (inputContainer) inputContainer.style.display = "flex"; 
            
            if (btnSubmit) {
                btnSubmit.onclick = async () => {
                    const noteText = inputField.value.trim();
                    if (!noteText) return;
					if( noteText == ""){
						showToast("Vui lòng nhập thông tin ghi chú đầy đủ", "Retry");
					}
                    const newCareNoteObj = {
                        note: noteText,
                        boardingRecordId: record.id
                    };
					console.log(newCareNoteObj);
                    const updatedCareNote = [...(record.careNote || []), newCareNoteObj];

                    try {
                        const updateRes = await fetch(`${API.careNotes}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(
                              newCareNoteObj)
                        });
                        if (updateRes.ok) {
                            inputField.value = "";                            
                            const freshDataRes = await fetch(`${API.boarding}/${id}`);
                            const freshRecord = await freshDataRes.json();                          
                            record.careNote = freshRecord.careNote; 
                            renderCareNotesList(freshRecord.careNote || []); 
                            showToast("Đã thêm ghi chú chăm sóc!", "success");
                        } else {
                            showToast("Không thể lưu ghi chú", "error");
                        }
                    } catch (err) {
                        console.error("Gặp lỗi khi lưu ghi chú chăm sóc:", err);
                        showToast("Lỗi kết nối khi lưu ghi chú", "error");
                    }
                };
            }
        } else {
            if (inputContainer) inputContainer.style.display = "none"; 
        }
        const checkoutBtn = document.getElementById("btn-detail-checkout");
		if (checkoutBtn) {
		            if (record.status === "BOARDING") {
		                checkoutBtn.style.display = "block";		       
		                checkoutBtn.onclick = async () => {
		                    closeDetailModalNote();
		                    await openCheckoutModal(record.id); 
		                };
		            } else {
		                checkoutBtn.style.display = "none";
		            }
		        }
        modal.style.display = "flex";
    } catch (error) {
        console.error("Lỗi khi tải chi tiết phiếu gửi:", error);
        showToast("Không thể xem chi tiết", "error");
    }
}

let currentCheckoutRecord = null;

async function openCheckoutModal(id) {
    if (!id) {
        showToast("Không tìm thấy mã phiếu gửi!", "error");
        return;
    }
    try {
        const response = await fetch(`${API.boarding}/${id}`);
        if (!response.ok) {
            showToast("Không thể lấy dữ liệu checkout", "error");
            return;
        }
        const item = await response.json();
        console.log(item);
        currentCheckoutRecord = item;

        document.getElementById("checkout-boarding-id").value = item.id;
        
        const ownerDisplay = (item.ownerName || 'N/A') + (item.ownerPhone ? ` (${item.ownerPhone})` : '');
        document.getElementById("checkout-owner-text").textContent = ownerDisplay;
        
        document.getElementById("checkout-pet-text").textContent = item.petName ? `${item.petName} (${item.petBreed || item.petType || 'Thú cưng'})` : '-';
        
        document.getElementById("checkout-checkin-text").textContent = formatDate(item.checkInDate) || '-';
        document.getElementById("checkout-expected-text").textContent = formatDate(item.expectedReturn) || '-';
        
        const todayStr = new Date().toLocaleDateString('en-CA');
        document.getElementById("checkout-date").value = item.actualReturnDate ? item.actualReturnDate.substring(0, 10) : todayStr;
        
        document.getElementById("checkout-price-per-date").value = item.pricePerDay ;
		
        document.getElementById("checkout-note").value = item.notes || "";
        
        calculateCheckoutFee();

        const checkoutModal = document.getElementById("checkout-modal");
        if (checkoutModal) {
            checkoutModal.style.display = "flex";
        }
    } catch (error) {
        console.error("Lỗi mở modal checkout:", error);
        showToast("Lỗi kết nối máy chủ", "error");
    }
}

// Tinh tien 
function calculateCheckoutFee() {
    if (!currentCheckoutRecord) return;
    
    let lateFee = 0;
    let discountFee = 0;
    const checkInStr = currentCheckoutRecord.checkInDate;
    const actualStr = document.getElementById("checkout-date").value;
    const pricePerDay = Number(document.getElementById("checkout-price-per-date").value) || currentCheckoutRecord.pricePerDay || 0;
    
    if (!checkInStr || !actualStr) return;
    
    const checkInDate = new Date(checkInStr);
    const actualDate = new Date(actualStr);
    const diffTimeTotal = actualDate - checkInDate;
    let totalDays = Math.ceil(diffTimeTotal / (1000 * 60 * 60 * 24));
    if (totalDays < 1) totalDays = 1;
    
    const expectedStr = currentCheckoutRecord.expectedReturn || currentCheckoutRecord.expectedDay;
    const lateDaysEl = document.getElementById("checkout-late-days");
    
    let expectedDays = 0;
    if (expectedStr) {
        const expectedDate = new Date(expectedStr);
        const diffTimeExpected = actualDate - expectedDate;
        const diffDays = Math.ceil(diffTimeExpected / (1000 * 60 * 60 * 24));
        const diffTimeExpTotal = expectedDate - checkInDate;
        expectedDays = Math.ceil(diffTimeExpTotal / (1000 * 60 * 60 * 24));
        if (expectedDays < 1) expectedDays = 1;
        if (diffDays > 0) {
            lateDaysEl.textContent = `Trễ ${diffDays} ngày`;
            lateDaysEl.style.color = "#d9534f"; // Màu đỏ
            lateFee = diffDays * pricePerDay * 20 / 100; 
        } else if (diffDays === 0) {
            lateDaysEl.textContent = "Đúng hạn";
            lateDaysEl.style.color = "#15803d"; // Màu xanh lá
            lateFee = 0;
        } else {
            lateDaysEl.textContent = `Trả sớm ${Math.abs(diffDays)} ngày`;
            lateDaysEl.style.color = "#0275d8"; // Màu xanh dương
            lateFee = 0;
        }
    }
    const lateFeeInput = document.getElementById("checkout-late-fee");
    if (lateFeeInput) {
        lateFeeInput.value = Number(lateFee) || 0;
    }
    const baseFee = totalDays * pricePerDay;
    const evaluatingDays = Math.max(totalDays, expectedDays);
    let discountPercent = 0;
    if (evaluatingDays >= 14) {
        discountPercent = 0.10; // Giảm 10%
    } else if (evaluatingDays >= 7) {
        discountPercent = 0.05; // Giảm 5%
    }
    discountFee = baseFee * discountPercent;
    const discountInput = document.getElementById("checkout-discount-fee");
    if (discountInput) {
        discountInput.value = discountFee;
    }
    const totalFee = baseFee + Number(lateFee) - discountFee;
    const feeInput = document.getElementById("checkout-fee");
    if (feeInput) {
        feeInput.value = totalFee > 0 ? totalFee : 0;
    }
}
function closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if (modal) {
        modal.style.display = "none";
    }
    currentCheckoutRecord = null;
}

/* =====================================================
   3. XÁC NHẬN CHECK-OUT (SUBMIT FORM)
===================================================== */
async function submitCheckout(event) {
    event.preventDefault();

    const id = document.getElementById("checkout-boarding-id").value;
    const actualReturnDate = document.getElementById("checkout-date").value;
    const feePerDay = Number(document.getElementById("checkout-price-per-date").value);
    const notes = document.getElementById("checkout-note").value;

    const payload = {
        actualCheckOut: actualReturnDate,
		pricePerDay: feePerDay
    };
	console.log(payload);
    try {
        const response = await fetch(`${API.boarding}/checkout/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Lỗi check-out từ backend");
        }

        showToast("Check-out thành công!", "success");
        closeCheckoutModal();

        if (typeof loadDashboardData === "function") await loadDashboardData();
        if (typeof loadBoardingRecords === "function") await loadBoardingRecords();

    } catch (error) {
        console.error("Lỗi khi checkout:", error);
        showToast("Thao tác Check-out thất bại!", "error");
    }
}
function renderCareNotesList(careNotes) {
    const listContainer = document.getElementById("care-notes-list");
    if (!listContainer) return;
    if (!careNotes || careNotes.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; color: #bbb; font-size: 13px; padding: 10px 0;">Chưa có hoạt động chăm sóc nào.</div>`;
        return;
    }
    listContainer.innerHTML = careNotes.map(item => {
        const displayDate = item.createdAt ? formatDate(item.createdAt) : "Hôm nay";
        return `
            <div class="care-note-item">
                <span class="care-note-content">${item.note}</span>
                <span class="care-note-time">${displayDate}</span>
            </div>
        `;
    }).join("");
}
async function saveNote(event) {
    event.preventDefault();
    const content = document.getElementById("note-content").value;
    const newNote = {
        content: content,
        createdAt: new Date().toISOString()
    };
    try {
        const response = await fetch(API.careNotes, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newNote)
        });

        if (response.ok) {
            showToast("Thêm ghi chú thành công!", "success");
            closeNoteModal();
            
            const noteCountEl = document.getElementById("total-notes");
            if (noteCountEl) {
                const currentCount = parseInt(noteCountEl.textContent) || 0;
                noteCountEl.textContent = currentCount + 1;
            }
        } else {
            showToast("Lỗi khi tạo ghi chú", "error");
        }
    } catch (error) {
        console.error(error);
        showToast("Lỗi kết nối lưu ghi chú", "error");
    }
}
async function deleteBoarding(id) {
    const confirm = typeof confirmDelete === "function" 
        ? confirmDelete("Bạn có chắc muốn xóa phiếu gửi?") 
        : window.confirm("Bạn có chắc muốn xóa phiếu gửi?");
    if (!confirm) return;

    try {
        const response = await fetch(`${API.boarding}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            showToast("Xóa phiếu gửi thành công", "success");
            await loadBoardingRecords();
        }
    } catch (error) {
        console.error(error);
        showToast("Xóa thất bại", "error");
    }
}
