const petServiceAPI = {
    fetchDashboardData: async () => {
        try {
            const [petsRes, boardingRes, historyRes] = await Promise.all([
                fetch(`${API.pets}/my-pets`, { method: "GET", credentials: "include" }),
                fetch(`${API.boarding}/my-current`, { method: "GET", credentials: "include" }),
                fetch(`${API.boarding}/my-history`, { method: "GET", credentials: "include" })
            ]);

            const petsData = petsRes.ok ? await petsRes.json() : [];
            const boardingData = boardingRes.ok ? await boardingRes.json() : [];
            const historyData = historyRes.ok ? await historyRes.json() : [];
            
            const petsList = Array.isArray(petsData) ? petsData : (petsData.content || []);
            const currentBoardings = Array.isArray(boardingData) ? boardingData : (boardingData.content || [boardingData]);      
            const historyList = Array.isArray(historyData) ? historyData : (historyData.content || []);
            
            const activePetIds = new Set();
            currentBoardings.forEach(b => {
                if (b && (b.status === 'BOARDING' || b.status === 'Đang gửi')) {
                    const pId = b.petId || b.pet?.id || b.id;
                    if (pId) activePetIds.add(String(pId));
                }
            });
            
            petsList.forEach(pet => {
                const petIdStr = String(pet.id);
                if (activePetIds.has(petIdStr) || currentBoardings.some(b => (b.petId === pet.id || b.pet?.id === pet.id))) {
                    pet.computedStatus = "Đang gửi";
                    pet.badgeClass = "badge-slate";
                } else {
                    pet.computedStatus = "Ở nhà";
                    pet.badgeClass = "badge-gray";
                }
            });
            
            const activeSendingCount = activePetIds.size > 0 ? activePetIds.size : (currentBoardings.length > 0 && currentBoardings[0].id ? 1 : 0);
            return {
                totalPets: petsList.length,
                activeSending: activeSendingCount,
                totalHistoryCount: historyList.length,
                petsList: petsList
            };
        } catch (error) {
            console.error("Lỗi kết nối API Dashboard:", error);
            return { totalPets: 0, activeSending: 0, totalHistoryCount: 0, petsList: [] };
        }
    },
    fetchSendingData: async () => {
        try {
            const response = await fetch(`${API.boarding}/my-current`, { method: "GET", credentials: "include" });
            const data = response.ok ? await response.json() : [];
            const activeList = Array.isArray(data) ? data : (data ? [data] : []);
            const currentItem = activeList[0] || null;
            return {
                currentSendingCount: activeList.length,
                sendingPet: currentItem
            };
        } catch (error) {
            console.error("Lỗi lấy dữ liệu đang gửi:", error);
            return { currentSendingCount: 0, sendingPet: null };
        }
    },

    fetchHistoryData: async () => {
        try {
            const response = await fetch(`${API.boarding}/my-history`, { method: "GET", credentials: "include" });
            const data = response.ok ? await response.json() : [];
            const historyList = Array.isArray(data) ? data : (data.content || []);
            
            // Lọc chỉ lấy những phiếu có trạng thái là returned / đã trả (loại bỏ BOARDING / đang gửi)
            const filteredHistory = historyList.filter(item => {
                const status = (item.status || "").toUpperCase();
                return status === 'RETURNED' || status === 'ĐÃ TRẢ' || status === 'COMPLETED';
            });

            return { historyList: filteredHistory };
        } catch (error) {
            console.error("Lỗi lấy lịch sử:", error);
            return { historyList: [] };
        }
    },

    fetchCareNoteData: async (id) => {
        try {
            const response = await fetch(`${API.careNotes}/my?boardingId=${id}`, { credentials: "include" });
            const data = response.ok ? await response.json() : [];
            const careNoteList = Array.isArray(data) ? data : (data.content || []);
            return { careNoteList: careNoteList };
        } catch (error) {
            console.error("Lỗi lấy nhật ký chăm sóc:", error);
            return { careNoteList: [] };
        }
    },

    fetchPetDetail: async (petId) => {
        try {
            const response = await fetch(`${API.pets}/${petId}`, { method: "GET", credentials: "include" });
            return response.ok ? await response.json() : null;
        } catch (error) {
            console.error("Lỗi lấy chi tiết thú cưng:", error);
            return null;
        }
    },

    fetchBoardingDetail: async (boardingId) => {
        try {
            const response = await fetch(`${API.boarding}/${boardingId}`, { method: "GET", credentials: "include" });
            return response.ok ? await response.json() : null;
        } catch (error) {
            console.error("Lỗi lấy chi tiết phiếu gửi:", error);
            return null;
        }
    }
};

const renderTemplates = {
    pets: async () => {
        const data = await petServiceAPI.fetchDashboardData();
        let rowsHTML = "";
        
        if (data.petsList.length === 0) {
            rowsHTML = `<tr><td colspan="8" style="text-align: center; color: #888;">Không có dữ liệu thú cưng</td></tr>`;
        } else {
            data.petsList.forEach((pet, index) => {
                const statusText = pet.computedStatus || pet.status || 'Ở nhà';
                const dotColor = statusText === 'Đang gửi' ? '#0284c7' : '#64748b';

                rowsHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${pet.name || pet.petName || 'N/A'}</strong></td>
                        <td><span class="badge-tag badge-gray">${pet.type || pet.species || 'Pet'}</span></td>
                        <td>${pet.breed || 'N/A'}</td>
                        <td>${pet.age ? pet.age + ' tuổi' : 'N/A'}</td>
                        <td>${pet.weight ? pet.weight + ' kg' : 'N/A'}</td>
                        <td>
                            <span style="color: ${dotColor}; font-weight: 500;">
                                <i class="fa-solid fa-circle" style="font-size: 8px; margin-right: 4px;"></i> ${statusText}
                            </span>
                        </td>
                        <td><i class="fa-solid fa-eye action-icon btn-view-pet" data-id="${pet.id}" title="Xem chi tiết thú cưng"></i></td>
                    </tr>
                `;
            });
        }

        return `
            <div class="page-header">
                <h1 class="page-title">Thú cưng của tôi</h1>
                <div class="search-box">
                    <i class="fa-solid fa-magnifying-glass search-icon"></i>
                    <input type="text" class="search-input" placeholder="Tìm theo tên..." id="petSearchInput">
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <span class="badge-tag badge-gray">Của tôi</span>
                    <div class="stat-value">${data.totalPets}</div>
                    <div class="stat-label">THÚ CƯNG</div>
                </div>
                <div class="stat-card">
                    <span class="badge-tag badge-slate">Active</span>
                    <div class="stat-value">${data.activeSending}</div>
                    <div class="stat-label">ĐANG GỬI</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${data.totalHistoryCount}</div>
                    <div class="stat-label">LƯỢT GỬI</div>
                </div>
            </div>

            <div class="table-container">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>THÚ CƯNG</th>
                            <th>LOẠI</th>
                            <th>GIỐNG</th>
                            <th>TUỔI</th>
                            <th>CÂN NẶNG</th>
                            <th>TRẠNG THÁI</th>
                            <th>THAO TÁC</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHTML}
                    </tbody>
                </table>
            </div>
        `;
    },

    sending: async () => {
        const data = await petServiceAPI.fetchSendingData();
        const pet = data.sendingPet;
        if (!pet) {
            return `
                <div class="page-header">
                    <h1 class="page-title">Đang gửi</h1>
                    <span class="badge-tag badge-gray">Thú cưng đang gửi: 0</span>
                </div>
                <div class="table-container" style="text-align: center; padding: 40px; color: #888;">
                    <i class="fa-solid fa-box-open" style="font-size: 40px; margin-bottom: 10px;"></i>
                    <p>Hiện không có thú cưng nào đang được gửi.</p>
                </div>
            `;
        }

        const noteData = await petServiceAPI.fetchCareNoteData(pet.id || pet.boardingId);
        const notesList = noteData.careNoteList;

        const checkInStr = pet.checkInDate || pet.checkIn;
        const expectedStr = pet.expectedReturn || pet.expectedDate || pet.returnDate;
        
        let daysElapsed = 0;
        let daysRemaining = 0;
        let estimatedFee = 0;

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (checkInStr) {
            const checkInDate = new Date(checkInStr);
            checkInDate.setHours(0, 0, 0, 0);
            daysElapsed = Math.max(0, Math.floor((now - checkInDate) / (1000 * 60 * 60 * 24))) + 1;
        }

        if (expectedStr) {
            const expectedDate = new Date(expectedStr);
            expectedDate.setHours(0, 0, 0, 0);
            daysRemaining = Math.floor((expectedDate - now) / (1000 * 60 * 60 * 24));
        }

        const pricePerDay = pet.pricePerDay || pet.dailyPrice || 0;
        estimatedFee = pricePerDay > 0 ? daysElapsed * pricePerDay : (pet.totalFee || pet.estimatedFee || 0);

        return `
            <div class="page-header">
                <h1 class="page-title">Đang gửi</h1>
                <span class="badge-tag badge-gray">Thú cưng đang gửi: ${data.currentSendingCount}</span>
            </div>

            <div class="table-container">
                <div class="sending-header-info">
                    <div class="sending-pet-name">${pet.petName || pet.name || 'N/A'}</div>
                    <span class="badge-tag badge-gray">${pet.petType || pet.type || 'Pet'}</span>
                    <span class="badge-tag badge-slate">Đang gửi</span>
                </div>
                
                <p class="sending-date">
                    <i class="fa-regular fa-calendar"></i> Check-in: ${checkInStr || 'N/A'} &nbsp;|&nbsp; 
                    <i class="fa-regular fa-calendar-check"></i> Dự kiến trả: ${expectedStr || 'N/A'}
                </p>

                <div class="stats-grid" style="margin: 15px 0;">
                    <div class="stat-card" style="padding: 15px;">
                        <div class="stat-value" style="font-size: 20px;">${daysElapsed} ngày</div>
                        <div class="stat-label">ĐÃ GỬI TỪ NAY</div>
                    </div>
                    <div class="stat-card" style="padding: 15px;">
                        <div class="stat-value" style="font-size: 20px; color: ${daysRemaining < 0 ? '#dc3545' : '#28a745'};">${daysRemaining >= 0 ? daysRemaining + ' ngày' : 'Quá hạn ' + Math.abs(daysRemaining) + ' ngày'}</div>
                        <div class="stat-label">CÒN LẠI DỰ KIẾN</div>
                    </div>
                    <div class="stat-card" style="padding: 15px;">
                        <div class="stat-value" style="font-size: 20px; color: #15803d;">${estimatedFee.toLocaleString('vi-VN')}đ</div>
                        <div class="stat-label">TẠM TÍNH TẠM THỜI</div>
                    </div>
                </div>

                <div class="sending-note-box">
                    <i class="fa-solid fa-thumbtack"></i> ${pet.notes || 'Không có ghi chú đặc biệt'}
                </div>
                <button class="sending-btn btn-view-notes" data-boarding-id="${pet.id || pet.boardingId}">
                    <i class="fa-solid fa-pen-to-square"></i> Xem ghi chú chăm sóc (${notesList.length})
                </button>
            </div>
        `;
    },

    history: async () => {
        const data = await petServiceAPI.fetchHistoryData();
        let rowsHTML = "";
        if (data.historyList.length === 0) {
            rowsHTML = `<tr><td colspan="8" style="text-align: center; color: #888;">Chưa có lịch sử gửi nào</td></tr>`;
        } else {
            data.historyList.forEach((item, index) => {
                const isBoarding = item.status === 'BOARDING' || item.status === 'Đang gửi' || !item.actualCheckOut;
                
                // Cập nhật trạng thái hiển thị: Nếu đang gửi hiện "Đang gửi", ngược lại hiển thị ngày trả hoặc trạng thái return
                const returnDateDisplay = isBoarding 
                    ? `<span style="color: #0284c7; font-weight: 500;"><i class="fa-solid fa-circle" style="font-size: 8px;"></i> Đang gửi</span>` 
                    : (item.returnDate || item.actualCheckOut || 'Return');

                let calculatedDays = item.totalDays;
                const checkInStr = item.checkInDate || item.checkIn;

                if (checkInStr) {
                    const checkInDate = new Date(checkInStr);
                    checkInDate.setHours(0, 0, 0, 0);
                    
                    const endDate = isBoarding ? new Date() : new Date(item.actualCheckOut || item.returnDate);
                    endDate.setHours(0, 0, 0, 0);

                    if (!isNaN(checkInDate) && !isNaN(endDate)) {
                        const diffTime = endDate - checkInDate;
                        calculatedDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
                    }
                }

                const totalDaysDisplay = calculatedDays ? calculatedDays + ' ngày' : 'N/A';
                const totalFeeDisplay = item.totalFee ? item.totalFee.toLocaleString('vi-VN') + 'đ' : (isBoarding ? 'Đang cập nhật' : '0đ');

                rowsHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${item.petName || 'N/A'}</strong><br><span style="font-size: 12px; color: #888;">${item.petType || 'Pet'}</span></td>
                        <td>${checkInStr || 'N/A'}</td>
                        <td>${returnDateDisplay}</td>
                        <td>${totalDaysDisplay}</td>
                        <td><strong>${totalFeeDisplay}</strong></td>
                        <td class="${item.lateFee && item.lateFee > 0 ? 'text-danger' : ''}">${item.lateFee ? item.lateFee.toLocaleString('vi-VN') + 'đ' : '—'}</td>
                        <td><i class="fa-solid fa-eye action-icon btn-view-boarding" data-id="${item.id}" title="Xem chi tiết phiếu gửi"></i></td>
                    </tr>
                `;
            });
        }

        return `
            <div class="page-header">
                <h1 class="page-title">Lịch sử gửi</h1>
                <div class="search-box">
                    <i class="fa-solid fa-magnifying-glass search-icon"></i>
                    <input type="text" class="search-input" placeholder="Tìm theo tên thú cưng..." id="historySearchInput">
                </div>
            </div>

            <div class="table-container">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>THÚ CƯNG</th>
                            <th>CHECK-IN</th>
                            <th>TRẠNG THÁI / NGÀY TRẢ</th>
                            <th>SỐ NGÀY</th>
                            <th>TỔNG PHÍ</th>
                            <th>PHỤ THU TRỄ</th>
                            <th>THAO TÁC</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHTML}
                    </tbody>
                </table>
            </div>
        `;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".nav-item");
    const mainContent = document.getElementById("mainContent");
    const detailModal = document.getElementById("detailModal");
    const modalBody = document.getElementById("modalBody");
    const closeModalBtn = document.getElementById("closeModalBtn");

    closeModalBtn.addEventListener("click", () => {
        detailModal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
        if (e.target === detailModal) detailModal.style.display = "none";
    });
    
    async function loadPage(targetKey) {
        if (renderTemplates[targetKey]) {
            mainContent.innerHTML = `<div style="padding: 20px; color: #888;">Đang kết nối đến hệ thống máy chủ...</div>`;
            const htmlContent = await renderTemplates[targetKey]();
            mainContent.innerHTML = htmlContent;
            attachDynamicEvents();
        }
    }

    function attachDynamicEvents() {
        document.querySelectorAll(".btn-view-pet").forEach(btn => {
            btn.addEventListener("click", async function() {
                const petId = this.getAttribute("data-id");
                const pet = await petServiceAPI.fetchPetDetail(petId);
                if (!pet) return alert("Không tìm thấy thông tin thú cưng!");

                const petStatus = pet.computedStatus || pet.status || 'Ở nhà';
                const statusBadgeClass = petStatus === 'Đang gửi' ? 'boarding' : 'completed';

                modalBody.innerHTML = `
                    <div class="modal-detail-header">
                        <h3 class="modal-detail-title">
                            <i class="fa-solid fa-paw" style="color: #0284c7;"></i> Chi tiết Thú cưng #${pet.id}
                        </h3>
                        <span class="modal-badge ${statusBadgeClass}">${petStatus}</span>
                    </div>

                    <div class="modal-info-grid">
                        <div class="modal-info-item">
                            <span>Tên thú cưng</span>
                            <strong>${pet.name || pet.petName || 'N/A'}</strong>
                        </div>
                        <div class="modal-info-item">
                            <span>Loại / Loài</span>
                            <strong>${pet.type || pet.species || 'N/A'}</strong>
                        </div>
                        <div class="modal-info-item">
                            <span>Giống</span>
                            <span class="value">${pet.breed || 'N/A'}</span>
                        </div>
                        <div class="modal-info-item">
                            <span>Tuổi</span>
                            <span class="value">${pet.age ? pet.age + ' tuổi' : 'N/A'}</span>
                        </div>
                        <div class="modal-info-item">
                            <span>Cân nặng</span>
                            <span class="value">${pet.weight ? pet.weight + ' kg' : 'N/A'}</span>
                        </div>
                        <div class="modal-info-item">
                            <span>Trạng thái</span>
                            <span class="value">${petStatus}</span>
                        </div>
                    </div>

                    <div class="modal-note-box">
                        <strong><i class="fa-solid fa-note-sticky"></i> Thông tin thêm:</strong> ${pet.notes || pet.description || 'Không có mô tả thêm.'}
                    </div>
                `;
                detailModal.style.display = "flex";
            });
        });

            document.querySelectorAll(".btn-view-boarding").forEach(btn => {
            btn.addEventListener("click", async function() {
                const boardingId = this.getAttribute("data-id");
                const item = await petServiceAPI.fetchBoardingDetail(boardingId);
                if (!item) return alert("Không tìm thấy thông tin phiếu gửi!");
                
                // Kiểm tra xem phiếu có phải trạng thái Return hay không
                const isBoarding = item.status === 'BOARDING' || item.status === 'Đang gửi' || !item.actualCheckOut;
                
                // Nếu bạn muốn CHỈ cho phép xem các phiếu có trạng thái Return:
                if (isBoarding) {
                    alert("Phiếu gửi này đang trong trạng thái gửi, không phải trạng thái Return!");
                    return;
                }

                const statusClass = 'completed';
                const statusText = 'Return';

                modalBody.innerHTML = `
                    <div class="modal-detail-header">
                        <h3 class="modal-detail-title">
                            <i class="fa-solid fa-file-invoice" style="color: #0284c7;"></i> Chi tiết Phiếu Gửi #${item.id}
                        </h3>
                        <span class="modal-badge ${statusClass}">${statusText}</span>
                    </div>

                    <div class="modal-info-grid">
                        <div class="modal-info-item">
                            <span>Thú cưng</span>
                            <strong>${item.petName || 'N/A'}</strong>
                        </div>
                        <div class="modal-info-item">
                            <span>Chủ nhân</span>
                            <strong>${item.ownerName || 'N/A'}</strong>
                        </div>
                        <div class="modal-info-item">
                            <span>Ngày Check-in</span>
                            <span class="value">${item.checkInDate || item.checkIn || 'N/A'}</span>
                        </div>
                        <div class="modal-info-item">
                            <span>Ngày Trả / Return</span>
                            <span class="value">${item.returnDate || item.actualCheckOut || item.expectedReturn || 'Return'}</span>
                        </div>
                    </div>

                    <div class="modal-price-list">
                        <div class="modal-price-row">
                            <span>Đơn giá dịch vụ:</span>
                            <span>${item.pricePerDay ? item.pricePerDay.toLocaleString('vi-VN') + 'đ / ngày' : 'N/A'}</span>
                        </div>
                        <div class="modal-price-row">
                            <span>Phí cơ bản:</span>
                            <span>${item.baseFee ? item.baseFee.toLocaleString('vi-VN') + 'đ' : 'N/A'}</span>
                        </div>
                        <div class="modal-price-row">
                            <span>Phụ thu trễ hạn:</span>
                            <span style="color: ${item.lateFee > 0 ? '#dc2626' : '#334155'};">${item.lateFee ? item.lateFee.toLocaleString('vi-VN') + 'đ' : '0đ'}</span>
                        </div>
                        <div class="modal-price-row total">
                            <span>Tổng cộng:</span>
                            <span>${item.totalFee ? item.totalFee.toLocaleString('vi-VN') + 'đ' : 'N/A'}</span>
                        </div>
                    </div>

                    <div class="modal-note-box">
                        <strong><i class="fa-solid fa-note-sticky"></i> Ghi chú:</strong> ${item.notes || 'Không có ghi chú đặc biệt.'}
                    </div>
                `;
                detailModal.style.display = "flex";
            });
        });

        document.querySelectorAll(".btn-view-notes").forEach(btn => {
            btn.addEventListener("click", async function() {
                const boardingId = this.getAttribute("data-boarding-id");
                const res = await petServiceAPI.fetchCareNoteData(boardingId);
                const notes = res.careNoteList;

                let notesHtml = notes.length === 0 ? `<p style="color:#64748b;">Chưa có ghi chú chăm sóc nào.</p>` : notes.map((n) => `
                    <div style="background: #f8fafc; padding: 12px; margin-bottom: 10px; border-radius: 6px; border-left: 3px solid #0284c7;">
                        <small style="color: #64748b;"><i class="fa-regular fa-clock"></i> ${n.createdAt || 'Hôm nay'}</small>
                        <p style="margin: 5px 0 0 0; color: #334155;">${n.note}</p>
                    </div>
                `).join('');

                modalBody.innerHTML = `
                    <h3 style="margin-top:0; color:#1e293b; margin-bottom: 15px;"><i class="fa-solid fa-notes-medical"></i> Nhật ký chăm sóc</h3>
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${notesHtml}
                    </div>
                `;
                detailModal.style.display = "flex";
            });
        });
    }

    loadPage("pets");

    navItems.forEach(item => {
        item.addEventListener("click", async function(e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove("active"));
            this.classList.add("active");
            const target = this.getAttribute("data-target");
            await loadPage(target);
        });
    });
});