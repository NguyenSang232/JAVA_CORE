/* =====================================================
   INIT
===================================================== */
window.onload = function () {
    showDashboard();
};

/* =====================================================
   SHOW DASHBOARD
===================================================== */
async function showDashboard() {
    const mainView = document.getElementById("content");
    if (!mainView) return;
    mainView.innerHTML = `
        <div class="dashboard-container">
            <header class="dashboard-header">
                <h1>Dashboard</h1>
                <button class="btn-create" onclick="openBoardingModal()">+ Tạo phiếu gửi</button>
            </header>

            <section class="summary-cards">
                <div class="summary-card">
                    <div class="card-top">
                        <div class="icon-wrapper">👤</div>
                        <div class="trend-badge" id="trend-owner" style="display: none;"></div>
                    </div>
                    <div class="card-bottom">
                        <h2 id="total-owner">...</h2>
                        <h4>Chủ nuôi</h4>
                    </div>
                </div>

                <div class="summary-card">
                    <div class="card-top">
                        <div class="icon-wrapper">🐾</div>
                        <div class="trend-badge" id="trend-pet" style="display: none;"></div>
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
                        <div class="trend-badge" id="trend-revenue" style="display: none;"></div>
                    </div>
                    <div class="card-bottom">
                        <h2 id="total-revenue">0đ</h2>
                        <h4>Doanh thu</h4>
                    </div>
                </div>

                <div class="summary-card">
                    <div class="card-top">
                        <div class="icon-wrapper">📝</div>
                        <div class="trend-badge" id="trend-notes" style="display: none;"></div>
                    </div>
                    <div class="card-bottom">
                        <h2 id="total-notes">0</h2>
                        <h4>Ghi chú</h4>
                    </div>
                </div>
            </section>

            <section class="dashboard-content">
                <div class="panel">
                    <div class="panel-title-area">
                        <h3>Phiếu gửi gần đây <span class="count-badge" id="recent-count">0</span></h3>
                        <div class="filter-group">
                            <button class="filter-btn active" onclick="filterRecent('ALL', this)">Tất cả</button>
                            <button class="filter-btn" onclick="filterRecent('BOARDING', this)">Đang gửi</button>
                            <button class="filter-btn" onclick="filterRecent('RETURNED', this)">Đã trả</button>
                        </div>
                    </div>
                    <table>
                        <thead><tr><th>Thú cưng</th><th>Chủ nuôi</th><th>Check-in</th><th>Trạng thái</th><th>Phí</th><th></th></tr></thead>
                        <tbody id="recent-boarding"></tbody>
                    </table>
                </div>
                <div class="right-dashboard">
                    <div class="panel" style="height: 300px;">
                        <div class="chart-header">
                            <h3 id="chart-year-title">Doanh thu 2026</h3>
                            <span class="total-amount" id="chart-total-amount">0đ</span>
                        </div>
                        <canvas id="boardingChart"></canvas>
                    </div>
                    <div class="panel">
                        <h3>Phân bố loài</h3>
                        <div id="pet-type-container"></div>
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
        const [ownerData, petData, boardingData, noteData] = await Promise.all([
            fetch(API.owners).then(res => res.json()),
            fetch(API.pets).then(res => res.json()),
            fetch(API.boarding).then(res => res.json()),
            fetch(API.careNotes || '/api/care-notes').then(res => res.json()).catch(() => [])
        ]);
		
        owners = ownerData || [];
        pets = petData || [];
        boardings = boardingData || [];
        document.getElementById("total-owner").textContent = owners.length;
        document.getElementById("total-pet").textContent = pets.length;
        document.getElementById("total-notes").textContent = noteData.length || 0;
        document.getElementById("total-boarding").textContent = boardings.filter(i => i.status === "BOARDING").length;

        const totalRevenue = boardings.reduce((sum, item) => sum + (item.totalFee ?? item.baseFee ?? 0), 0);
        document.getElementById("total-revenue").textContent = formatMoney(totalRevenue);
        document.getElementById("chart-total-amount").textContent = formatMoney(totalRevenue);
        const today = "2026-07-21";
        const isDateToday = (dateStr) => {
            if (!dateStr) return false;
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return false; // Tránh lỗi Invalid time
            return d.toISOString().split('T')[0] === today;
        };
        const newOwners = owners.filter(i => isDateToday(i.createdAt)).length;
        const newPets = pets.filter(i => isDateToday(i.createdAt)).length;
		console.log(newPets);
        const newNotes = noteData.filter(i => isDateToday(i.createdAt)).length;
        const revToday = boardings
            .filter(i => isDateToday(i.checkInDate))
            .reduce((s, i) => s + (i.totalFee || i.baseFee || 0), 0);
        renderSimpleTrend("trend-owner", newOwners);
        renderSimpleTrend("trend-pet", newPets);
        renderSimpleTrend("trend-notes", newNotes);
        renderSimpleTrend("trend-revenue", revToday, true);

        renderRecent(boardings);
        drawBoardingChart(boardings);
        drawPetTypeChart(pets);

    } catch (e) {
        console.error("Dashboard error:", e);
    }
}

function renderSimpleTrend(id, val, isMoney = false) {
    const el = document.getElementById(id);
    if (!el) return;

    // Luôn hiển thị để bạn biết hệ thống đã chạy
    el.style.display = "inline-block";
    
    // Nếu > 0 thì hiện màu xanh, nếu = 0 thì hiện màu xám trung tính
    if (val > 0) {
        el.textContent = isMoney ? `+${formatMoney(val)}` : `+${val}`;
        el.style.color = "#15803d"; // Màu xanh
    } else {
        el.textContent = "+0";
        el.style.color = "#999999"; // Màu xám
    }
}
/* =====================================================
   RENDER RECENT BOARDING
===================================================== */
function renderRecent(data) {
    const tableBody = document.getElementById("recent-boarding");
    const countBadge = document.getElementById("recent-count");
    if (!tableBody) return;

    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">Chưa có phiếu gửi nào</td></tr>`;
        if (countBadge) countBadge.textContent = "0";
        return;
    }
    const recent = [...data]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

    if (countBadge) countBadge.textContent = recent.length;

    tableBody.innerHTML = recent.map(item => {
        const statusText = item.status === "BOARDING" ? "Đang gửi" : "Đã trả";
        const feeText = item.status === "RETURNED" ? formatMoney(item.totalFee ?? item.baseFee) : "—";
        const petIcon = typeof getPetIcon === "function" ? getPetIcon(item.petType) : "🐾";

        return `
            <tr>
                <td>
                    <div class="pet-cell">
                        <div class="pet-avatar-mini">${petIcon}</div>
                        <div class="pet-meta">
                            <strong>${item.petName ?? "Thú cưng"}</strong>
                            <small>${item.petBreed ?? item.petType ?? "Giống loại"}</small>
                        </div>
                    </div>
                </td>
                <td class="owner-cell">${item.ownerName ?? "Người dùng"}</td>
                <td>${formatDate(item.checkInDate)}</td>
                <td>
                    <span class="status-oval status-${(item.status ?? 'boarding').toLowerCase()}">${statusText}</span>
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
   RENDER RECENT BOARDING
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