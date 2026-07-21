/* =====================================================
   PET SERVICE API (GỌI DỮ LIỆU)
===================================================== */
const petServiceAPI = {
    fetchDashboardData: async () => {
        try {
            const [petsRes, boardingRes] = await Promise.all([
                fetch(`${API.pets}/my-pets`, {
                    method: "GET",
                    credentials: "include"
                }),
                fetch(`${API.boarding}/my-current`, {
                    method: "GET",
                    credentials: "include"
                })
            ]);
            const petsData = petsRes.ok ? await petsRes.json() : [];
            const boardingData = boardingRes.ok ? await boardingRes.json() : [];
            const petsList = Array.isArray(petsData) ? petsData : (petsData.content || []);
            const currentBoardings = Array.isArray(boardingData) ? boardingData : (boardingData.content || [boardingData]);       
            const historyRes = await fetch(`${API.boarding}/my-history`, {
                method: "GET",
                credentials: "include"
            });
            const historyData = historyRes.ok ? await historyRes.json() : [];
            const historyList = Array.isArray(historyData) ? historyData : (historyData.content || []);
            const activeSending = currentBoardings.filter(b => b && (b.status === 'BOARDING' || b.status === 'Đang gửi')).length;
            return {
                totalPets: petsList.length,
                activeSending: activeSending > 0 ? activeSending : (currentBoardings.length > 0 && currentBoardings[0].id ? 1 : 0),
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
            const response = await fetch(`${API.boarding}/my-current`, {
                method: "GET",
                credentials: "include"
            });
			console.log(response);
            const data = response.ok ? await response.json() : [];
			console.log(data);
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
            const response = await fetch(`${API.boarding}/my-history`, {
                method: "GET",
                credentials: "include"
            });
            const data = response.ok ? await response.json() : [];
            const historyList = Array.isArray(data) ? data : (data.content || []);
            return {
                historyList: historyList
            };
        } catch (error) {
            console.error("Lỗi lấy lịch sử:", error);
            return { historyList: [] };
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
                rowsHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${pet.name || pet.petName || 'N/A'}</strong></td>
                        <td><span class="badge-tag badge-gray">${pet.type || pet.species || 'Pet'}</span></td>
                        <td>${pet.breed || 'N/A'}</td>
                        <td>${pet.age ? pet.age + ' tuổi' : 'N/A'}</td>
                        <td>${pet.weight ? pet.weight + ' kg' : 'N/A'}</td>
                        <td><span style="color: #666;"><i class="fa-solid fa-circle" style="font-size: 8px;"></i> ${pet.status || 'Ở nhà'}</span></td>
                        <td><i class="fa-solid fa-eye action-icon"></i></td>
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
            
            const diffTimeNow = now - checkInDate;
            daysElapsed = Math.max(0, Math.floor(diffTimeNow / (1000 * 60 * 60 * 24))) + 1;
        }

        if (expectedStr) {
            const expectedDate = new Date(expectedStr);
            expectedDate.setHours(0, 0, 0, 0);
            
            const diffTimeExpected = expectedDate - now;
            daysRemaining = Math.floor(diffTimeExpected / (1000 * 60 * 60 * 24));
        }

        const pricePerDay = pet.pricePerDay || pet.dailyPrice || 0;
        if (pricePerDay > 0) {
            estimatedFee = daysElapsed * pricePerDay;
        } else {
            estimatedFee = pet.totalFee || pet.estimatedFee || 0;
        }

        return `
            <div class="page-header">
                <h1 class="page-title">Đang gửi</h1>
                <span class="badge-tag badge-gray">Thú cưng đang gửi: ${data.currentSendingCount}</span>
            </div>

            <div class="table-container">
                <div class="sending-header-info">
                    <div class="sending-pet-name">${pet.petName || pet.name || 'N/A'}</div>
                    <span class="badge-tag badge-gray">${pet.petType || pet.type || 'Pet'}</span>
                    <span class="badge-tag badge-slate">${pet.status || 'Đang gửi'}</span>
                </div>
                
                <p class="sending-date">
                    <i class="fa-regular fa-calendar"></i> Check-in: ${checkInStr || 'N/A'} &nbsp;|&nbsp; 
                    <i class="fa-regular fa-calendar-check"></i> Dự kiến trả: ${expectedStr || 'N/A'}
                </p>

                <!-- Thống kê chi phí và số ngày -->
                <div class="stats-grid" style="margin: 15px 0;">
                    <div class="stat-card" style="padding: 15px;">
                        <div class="stat-value" style="font-size: 20px;">${daysElapsed} ngày</div>
                        <div class="stat-label">ĐÃ GỬI TỪNG ĐẾN NAY</div>
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
                <button class="sending-btn">
                    <i class="fa-solid fa-pen-to-square"></i> Xem ghi chú chăm sóc (${pet.notesCount || 0})
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
                rowsHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${item.petName || 'N/A'}</strong><br><span style="font-size: 12px; color: #888;">${item.petType || 'Pet'}</span></td>
                        <td>${item.checkInDate || item.checkIn || 'N/A'}</td>
                        <td>${item.returnDate || item.actualCheckOut || 'N/A'}</td>
                        <td>${item.totalDays ? item.totalDays + ' ngày' : 'N/A'}</td>
                        <td><strong>${item.totalFee || item.totalPrice || '0đ'}</strong></td>
                        <td class="${item.lateFee && item.lateFee > 0 ? 'text-danger' : ''}">${item.lateFee ? item.lateFee + 'đ' : '—'}</td>
                        <td><i class="fa-solid fa-eye action-icon"></i></td>
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
                            <th>NGÀY TRẢ</th>
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

    async function loadPage(targetKey) {
        if (renderTemplates[targetKey]) {
            mainContent.innerHTML = `<div style="padding: 20px; color: #888;">Đang kết nối đến hệ thống máy chủ...</div>`;
            const htmlContent = await renderTemplates[targetKey]();
            mainContent.innerHTML = htmlContent;
        }
    }

    // Mặc định load tab đầu tiên (Thú cưng)
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