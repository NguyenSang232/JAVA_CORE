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

async function fetchPetById(petId) {
    try {
        const response = await fetch(`${API.pets}/${petId}`);
        if (!response.ok) throw new Error("Không thể lấy dữ liệu thú cưng");
        const pet = await response.json();
        return pet;
    } catch (error) {
        console.error("Lỗi khi fetch pet:", error);
        return null;
    }
}

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

        const totalOwnerEl = document.getElementById("total-owner");
        if (totalOwnerEl) totalOwnerEl.textContent = owners.length;

        const totalPetEl = document.getElementById("total-pet");
        if (totalPetEl) totalPetEl.textContent = pets.length;

        const totalNotesEl = document.getElementById("total-notes");
        if (totalNotesEl) totalNotesEl.textContent = noteData.length || 0;

        const totalBoardingEl = document.getElementById("total-boarding");
        if (totalBoardingEl) totalBoardingEl.textContent = boardings.filter(i => i.status === "BOARDING").length;

        const totalRevenue = boardings.reduce((sum, item) => sum + (item.totalFee ?? item.baseFee ?? 0), 0);
        
        const totalRevEl = document.getElementById("total-revenue");
        if (totalRevEl) totalRevEl.textContent = formatMoney(totalRevenue);

        const chartAmountEl = document.getElementById("chart-total-amount");
        if (chartAmountEl) chartAmountEl.textContent = formatMoney(totalRevenue);

        const todayDate = new Date();
        const today = todayDate.toLocaleDateString('en-CA'); 
        
        const yesterdayDate = new Date();
        yesterdayDate.setDate(todayDate.getDate() - 1);
        const yesterday = yesterdayDate.toLocaleDateString('en-CA');

        const isDateToday = (dateStr, targetDate) => {
           if (!dateStr) return false;
           const datePart = String(dateStr).trim().substring(0, 10);
           return datePart === targetDate;
        };

        const newOwners = owners.filter(i => isDateToday(i.createAt || i.createdAt, today)).length;
        const newPets = pets.filter(i => isDateToday(i.createdAt, today)).length;
        const newNotes = noteData.filter(i => isDateToday(i.createdAt, today)).length;
        const revToday = boardings
            .filter(i => isDateToday(i.actualCheckOut || i.checkInDate, today))
            .reduce((s, i) => s + (i.totalFee || i.baseFee || 0), 0);

        const yesterdayOwners = owners.filter(i => isDateToday(i.createAt || i.createdAt, yesterday)).length;
        const yesterdayPets = pets.filter(i => isDateToday(i.createdAt, yesterday)).length;
        const yesterdayNotes = noteData.filter(i => isDateToday(i.createdAt, yesterday)).length;
        const revYesterday = boardings
            .filter(i => isDateToday(i.actualCheckOut || i.checkInDate, yesterday))
            .reduce((s, i) => s + (i.totalFee || i.baseFee || 0), 0);
       let percentStr = "+0.0%";
        if (revYesterday > 0) {
            const percent = ((revToday - revYesterday) / revYesterday) * 100;
            percentStr = `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
        } else if (revToday > 0) {
            percentStr = "+100.0%"; // Hôm qua 0, hôm nay có doanh thu -> tăng 100%
        }
        renderSimpleTrend("trend-owner", newOwners, false, yesterdayOwners);
        renderSimpleTrend("trend-pet", newPets, false, yesterdayPets);
        renderSimpleTrend("trend-notes", newNotes, false, yesterdayNotes);
        renderSimpleTrend("trend-revenue", percentStr , true, revYesterday);

        if (document.getElementById("recent-table") || typeof renderRecent === "function") {
            try { renderRecent(boardings); } catch (err) {}
        }
        if (typeof drawBoardingChart === "function") {
            try { drawBoardingChart(boardings); } catch (err) {}
        }
        if (typeof drawPetTypeChart === "function") {
            try { drawPetTypeChart(pets); } catch (err) {}
        }
    } catch (e) {
        console.error("Dashboard error:", e);
    }
}

function renderSimpleTrend(id, val, isMoney = false, compareVal = 0) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = "inline-block";
    
    if (isMoney && typeof val === 'string') {
        el.textContent = val;
        if (val.includes('+') && !val.includes('+0.0')) {
            el.style.color = "#15803d";
        } else {
            el.style.color = "#999999";
        }
        el.title = `So với hôm qua (Hôm qua: ${formatMoney(compareVal)})`;
        return;
    }

    if (Number(val) > 0) {
        el.textContent = isMoney ? `+${formatMoney(val)}` : `+${val}`;
        el.style.color = "#15803d"; 
    } else {
        el.textContent = "+0";
        el.style.color = "#999999";
    }

    if (isMoney) {
        let percentStr = "0%";
        if (compareVal > 0) {
            const percent = ((Number(val) - compareVal) / compareVal) * 100;
            percentStr = `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
        } else if (Number(val) > 0) {
            percentStr = "+100%";
        }
        el.title = `So với hôm qua: ${percentStr} (Hôm qua: ${formatMoney(compareVal)})`;
    } else {
        const diff = Number(val) - compareVal;
        const diffStr = diff >= 0 ? `+${diff}` : `${diff}`;
        el.title = `So với hôm qua: ${diffStr} (Hôm qua: ${compareVal})`;
    }
}

/* =====================================================
   RENDER RECENT BOARDING
===================================================== */
async function renderRecent(data) {
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

    const petPromises = recent.map(async (item) => {
        const petId = item.petId || (item.pet ? item.pet.id : null);
        if (!petId) return null;
        
        let foundPet = (typeof pets !== 'undefined') ? pets.find(p => String(p.id) === String(petId)) : null;
        if (foundPet) return foundPet;

        try {
            const response = await fetch(`${API.pets}/${petId}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            return null;
        }
    });

    const resolvedPets = await Promise.all(petPromises);

    tableBody.innerHTML = recent.map((item, index) => {
        const foundPet = resolvedPets[index];
        const petImg = foundPet?.image;
        
        const avatarHTML = petImg 
            ? `<img src="${petImg}" alt="${foundPet?.name || 'Pet'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
            : (typeof getPetIcon === "function" ? getPetIcon(foundPet?.type || item.petType) : "🐾");

        const isDeleted = item.isDeleted || item.deleted === true;
        let statusText = "Đang gửi";
        let badgeStyle = "background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;";

        if (item.status === "RETURNED") {
            statusText = "Đã trả";
            badgeStyle = "background: #fef3c7; color: #d97706; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;";
        }
        if (isDeleted) {
            statusText = "Đã xóa";
            badgeStyle = "background: #fee2e2; color: #dc2626; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;";
        }

        const statusClass = isDeleted ? "deleted" : (item.status ?? 'boarding').toLowerCase();
        const feeText = item.status === "RETURNED" ? formatMoney(item.totalFee ?? item.baseFee) : "—";
        
        return `
            <tr style="cursor: pointer;" onclick="showBoardingDetail(${item.id})">
                <td>
                    <div class="pet-cell">
                        <div class="pet-avatar-mini" style="width: 36px; height: 36px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f1f5f9; border-radius: 50%;">
                            ${avatarHTML}
                        </div>
                        <div class="pet-meta">
                            <strong>${foundPet?.name || item.petName || "Thú cưng"}</strong>
                            <small>${foundPet?.breed || item.petBreed || foundPet?.type || item.petType || "Giống loại"}</small>
                        </div>
                    </div>
                </td>
                <td class="owner-cell">${item.ownerName ?? "Người dùng"}</td>
                <td>${formatDate(item.checkInDate)}</td>
                <td>
                    <span class="status-oval status-${statusClass}" style="${badgeStyle}">${statusText}</span>
                </td>
                <td class="fee-cell">${feeText}</td>
                <td>
                    <button class="action-view-btn" title="Xem chi tiết" onclick="event.stopPropagation(); showBoardingDetail(${item.id})">👁</button>
                </td>
            </tr>
        `;
    }).join("");
}

function filterRecent(status, btnElement) {
    const buttons = btnElement.parentElement.querySelectorAll(".filter-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    btnElement.classList.add("active");

    if (status === "ALL") {
        renderRecent(boardings);
    } else {
        const filtered = boardings.filter(item => item.status === status);
         renderRecent(filtered);
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

    const currentMonthIndex = new Date().getMonth();

    const backgroundColors = months.map((_, index) => 
        index === currentMonthIndex ? "#2563eb" : "#cbd5e1"
    );
    const hoverColors = months.map((_, index) => 
        index === currentMonthIndex ? "#1d4ed8" : "#94a3b8"
    );

    window.revenueChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: months,
            datasets: [{
                label: "Doanh thu",
                data: values,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: hoverColors,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += formatMoney(context.raw);
                            if (context.dataIndex === currentMonthIndex) {
                                label += " (Tháng hiện tại)";
                            }
                            return label;
                        }
                    }
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