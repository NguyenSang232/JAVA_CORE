/* =====================================================
   INIT
===================================================== */
window.onload = function () {
    showDashboard();
};
/* =====================================================
   SHOW DASHBOARD
===================================================== */
async function showReports() {
    setActiveMenu("menu-reports");

    const mainView = document.getElementById("content");
    if (!mainView) return;

    mainView.innerHTML = `
        <div class="dashboard-container">
            <header class="dashboard-header">
                <h1>Dashboard</h1>
                <button class="btn-create" onclick="openBoardingModal()">+ Tạo phiếu gửi</button>
            </header>

            <div class="dashboard-tabs">
                <div class="tab-item">Tổng quan</div>
            </div>

            <!-- HÀNG THẺ TỔNG HỢP (SUMMARY CARDS) -->
            <section class="summary-cards">
                <div class="summary-card">
                    <div class="card-top">
                        <div class="icon-wrapper">👤</div>
                        <div class="trend-badge">↑ +3</div>
                    </div>
                    <div class="card-bottom">
                        <h2 id="total-owner">...</h2>
                        <h4>Chủ nuôi</h4>
                    </div>
                </div>

                <div class="summary-card">
                    <div class="card-top">
                        <div class="icon-wrapper">🐾</div>
                        <div class="trend-badge">↑ +5</div>
                    </div>
                    <div class="card-bottom">
                        <h2 id="total-pet">...</h2>
                        <h4>Thú cưng</h4>
                    </div>
                </div>

                <div class="summary-card">
                    <div class="card-top">
                        <div class="icon-wrapper">📋</div>
                        <div class="trend-badge" style="color: #15803d;">Active</div>
                    </div>
                    <div class="card-bottom">
                        <h2 id="total-boarding">...</h2>
                        <h4>Đang gửi</h4>
                    </div>
                </div>

                <div class="summary-card">
                    <div class="card-top">
                        <div class="icon-wrapper">💰</div>
                        <div class="trend-badge">↑ +12%</div>
                    </div>
                    <div class="card-bottom">
                        <h2 id="total-revenue">0đ</h2>
                        <h4>Doanh thu</h4>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="card-top">
                        <div class="icon-wrapper">📝</div>
                        <div class="trend-badge">↑ +8</div>
                    </div>
                    <div class="card-bottom">
                        <h2 id="total-notes">7</h2>
                        <h4>Ghi chú</h4>
                    </div>
                </div>
            </section>

            <!-- LƯỚI NỘI DUNG CHÍNH (MAIN CONTENT GRID) -->
            <section class="dashboard-content">
                <!-- PANEL TRÁI: PHIẾU GỬI GẦN ĐÂY -->
                <div class="panel">
                    <div class="panel-title-area">
                        <h3>Doanh thu theo tháng </h3>
                    </div>
					<div class="panel">
					  <div class="chart-header">
					   <h3 id="chart-year-title">Doanh thu 2026</h3>
					   <span class="total-amount" id="chart-total-amount">0đ</span>
					   </div>
					   <div class="chart-body">
					    <canvas id="boardingChart"></canvas>
					    </div>
					    </div>
                </div>

                <!-- PANEL PHẢI: BIỂU ĐỒ & BẢNG TIẾN TRÌNH PHÂN BỐ -->
                <div class="right-dashboard">

                    <!-- PHÂN BỐ LOÀI THÚ CƯNG (PROGRESS BARS) -->
                    <div class="panel">
                        <div class="panel-title-area" style="margin-bottom: 10px;">
                            <h3>Phân bố loài</h3>
                        </div>
                        <div class="pet-type-distribution" id="pet-type-container">
                            <p style="color: #999; font-size: 13px;">Đang tính toán...</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;

    await loadDashboardData();
}

/* =====================================================
   LOAD DASHBOARD DATA
===================================================== */
async function loadDashboardData() {
    try {
        const [ownerData, petData, boardingData] = await Promise.all([
            fetch(API.owners).then(res => res.json()),
            fetch(API.pets).then(res => res.json()),
            fetch(API.boarding).then(res => res.json())
        ]);

        owners = ownerData;
        pets = petData;
        boardings = boardingData;

        // Cập nhật các thẻ số liệu tổng quan
        document.getElementById("total-owner").textContent = owners.length;
        document.getElementById("total-pet").textContent = pets.length;
        
        const currentBoarding = boardings.filter(item => item.status === "BOARDING").length;
        document.getElementById("total-boarding").textContent = currentBoarding;

        const revenue = boardings.reduce((sum, item) => sum + (item.totalFee ?? 0), 0);
        document.getElementById("total-revenue").textContent = formatMoney(revenue);
        document.getElementById("chart-total-amount").textContent = formatMoney(revenue);

        // Đổ dữ liệu vào bảng và biểu đồ
        renderRecentBoarding(boardings);
        drawBoardingChart(boardings);
        drawPetTypeChart(pets);
    } catch (error) {
        console.error("Dashboard error:", error);
        showToast("Không thể tải dữ liệu Dashboard", "error");
    }
}

/* =====================================================
   RENDER RECENT BOARDING
===================================================== */
function renderRecentBoarding(data) {
    const tableBody = document.getElementById("recent-boarding");
    const countBadge = document.getElementById("recent-count");
    if (!tableBody) return;

    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">Chưa có phiếu gửi nào</td></tr>`;
        if (countBadge) countBadge.textContent = "0";
        return;
    }

    // Sắp xếp lấy 5 phiếu gửi mới tạo gần đây nhất
    const recent = [...data]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    if (countBadge) countBadge.textContent = recent.length;

    tableBody.innerHTML = recent.map(item => {
        const statusText = item.status === "BOARDING" ? "Đang gửi" : "Đã trả";
        const feeText = item.status === "RETURNED" ? formatMoney(item.totalFee) : "—";
        const petIcon = typeof getPetIcon === "function" ? getPetIcon(item.petType) : "🐾";

        return `
            <tr>
                <td>
                    <div class="pet-cell">
                        <div class="pet-avatar-mini">${petIcon}</div>
                        <div class="pet-meta">
                            <strong>${item.petName ?? "Thú cưng"}</strong>
                            <small>${item.petBreed ?? "Giống loại"}</small>
                        </div>
                    </div>
                </td>
                <td class="owner-cell">${item.ownerName ?? "Người dùng"}</td>
                <td>${formatDate(item.checkInDate)}</td>
                <td>
                    <span class="status-oval">${statusText}</span>
                </td>
                <td class="fee-cell">${feeText}</td>
                <td>
                    <button class="action-view-btn" title="Xem chi tiết" onclick="editBoarding(${item.id})">👁</button>
                </td>
            </tr>
        `;
    }).join("");
}

/* =====================================================
   FILTER RECENT (HÀM BỔ TRỢ BỘ LỌC TẠI CHỖ)
===================================================== */
function filterRecent(status, btnElement) {
    // Đổi trạng thái nút bấm active
    const buttons = btnElement.parentElement.querySelectorAll(".filter-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    btnElement.classList.add("active");

    if (status === "ALL") {
        renderRecentBoarding(boardings);
    } else {
        const filtered = boardings.filter(item => item.status === status);
        renderRecentBoarding(filtered);
    }
}

/* =====================================================
   BOARDING CHART (BIỂU ĐỒ CỘT DOANH THU THEO THÁNG)
===================================================== */
function drawBoardingChart(data) {
    const canvas = document.getElementById("boardingChart");
    if (!canvas) return;

    if (window.revenueChart) {
        window.revenueChart.destroy();
    }

    const months = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const values = Array(12).fill(0);

    data.forEach(item => {
        if (item.checkInDate) {
            const month = new Date(item.checkInDate).getMonth();
            // Cộng dồn phí thu được của các phiếu gửi theo từng tháng
            values[month] += (item.totalFee ?? 0);
        }
    });

    window.revenueChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: months,
            datasets: [{
                label: "Doanh thu",
                data: values,
                backgroundColor: "#555555",
                hoverBackgroundColor: "#111111",
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "#f5f5f5" },
                    ticks: { maxTicksLimit: 5 }
                }
            }
        }
    });
}

/* =====================================================
   DRAW PET TYPE (CHUYỂN THÀNH PROGRESS BARS GIỐNG ẢNH)
===================================================== */
function drawPetTypeChart(data) {
    const container = document.getElementById("pet-type-container");
    if (!container) return;
    if (!data || data.length === 0) {
        container.innerHTML = `<p style="color: #999; font-size: 13px;">Chưa có dữ liệu phân bố</p>`;
        return;
    }
    const types = {};
    data.forEach(p => {
        const type = p.type || "Other";
        types[type] = (types[type] || 0) + 1;
    });

    const totalPets = data.length;
    
    // Sắp xếp các loài có số lượng từ cao xuống thấp
    const sortedTypes = Object.entries(types).sort((a, b) => b[1] - a[1]);

    container.innerHTML = sortedTypes.map(([type, count]) => {
        const percentage = Math.round((count / totalPets) * 100);
        const petIcon = typeof getPetIcon === "function" ? getPetIcon(type) : "🐾";

        return `
            <div class="distribution-row">
                <div class="distribution-meta">
                    <span class="type-label">${petIcon} ${type}</span>
                    <span class="stats-data">${count} <span>${percentage}%</span></span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percentage}%;"></div>
                </div>
            </div>
        `;
    }).join("");
}

/* =====================================================
   ACTIVE MENU
===================================================== */
function setActiveMenu(id) {
    const menus = document.querySelectorAll(".sidebar li");
    menus.forEach(item => {
        item.classList.remove("active");
    });
    const current = document.getElementById(id);
    if (current) {
        current.classList.add("active");
    }
}