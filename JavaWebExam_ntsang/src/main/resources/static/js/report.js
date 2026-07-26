/* =====================================================
   GLOBAL STATE CHO BÁO CÁO
===================================================== */

let globalPetsData = [];
let currentReportFilter = 'month';

async function showReports() {
    const mainView = document.getElementById("content");
    if (!mainView) return;

    mainView.innerHTML = `
        <div class="dashboard-container">
            <header class="dashboard-header">
                <div>
                    <h1>Báo cáo thống kê</h1>
                    <p>Thống kê tổng quan toàn hệ thống</p>
                </div>
                
                <!-- BỘ LỌC TOÀN CỤC (MASTER FILTER) -->
                <div class="chart-filter-group">
                    <button onclick="changeGlobalReportFilter('week')" id="btn-filter-week">Tuần</button>
                    <button onclick="changeGlobalReportFilter('month')" id="btn-filter-month" class="active">Tháng</button>
                    <button onclick="changeGlobalReportFilter('quarter')" id="btn-filter-quarter">Quý</button>
                    <button onclick="changeGlobalReportFilter('year')" id="btn-filter-year">Năm</button>
                </div>
            </header>

            <!-- HÀNG THẺ TỔNG HỢP (SUMMARY CARDS - Đã thêm sự kiện click xem chi tiết) -->
            <section class="summary-cards">
                <div class="summary-card" style="cursor: pointer;" onclick="openReportDetailModal('revenue')" title="Xem chi tiết doanh thu">
                    <div class="card-top">
                        <div class="icon-wrapper">💰</div>
                    </div>
                    <div class="card-bottom">
                        <h2 id="total-revenue">0đ</h2>
                        <h4>Tổng doanh thu</h4>
                    </div>
                </div>

                <div class="summary-card" style="cursor: pointer;" onclick="openReportDetailModal('boarding')" title="Xem danh sách phiếu gửi">
                    <div class="card-top">
                        <div class="icon-wrapper">📋</div>
                        <span class="badge-status badge-active">Active</span>
                    </div>
                    <div class="card-bottom">
                        <h2 id="total-boarding">0</h2>
                        <h4>Tổng phiếu gửi</h4>
                    </div>
                </div>

                <div class="summary-card" style="cursor: pointer;" onclick="openReportDetailModal('top-pet')" title="Xem thú cưng gửi nhiều nhất">
                    <div class="card-top">
                        <div class="icon-wrapper">⭐</div>
                    </div>
                    <div class="card-bottom">
                        <h2 id="top-pet-sent">---</h2>
                        <h4>Gửi nhiều nhất</h4>
                    </div>
                </div>

                <div class="summary-card" style="cursor: pointer;" onclick="openReportDetailModal('late')" title="Xem danh sách phiếu trả trễ">
                    <div class="card-top">
                        <div class="icon-wrapper">⚠️</div>
                        <span class="badge-status badge-alert">Trễ hạn</span>
                    </div>
                    <div class="card-bottom">
                        <h2 id="total-late-return">0</h2>
                        <h4>Phiếu trả trễ</h4>
                    </div>
                </div>

                <div class="summary-card" style="cursor: pointer;" onclick="openReportDetailModal('notes')" title="Xem danh sách ghi chú chăm sóc">
                    <div class="card-top">
                        <div class="icon-wrapper">📝</div>
                    </div>
                    <div class="card-bottom">
                        <h2 id="total-notes">0</h2>
                        <h4>Ghi chú chăm sóc</h4>
                    </div>
                </div>
            </section>

            <!-- LƯỚI NỘI DUNG CHÍNH (MAIN CONTENT GRID) -->
            <section class="dashboard-content">
                <!-- PANEL TRÁI: BIỂU ĐỒ DOANH THU -->
                <div class="panel panel-chart">
                    <div class="chart-header">
                        <div>
                            <h3 id="chart-year-title">Doanh thu theo thời gian</h3>
                            <span class="total-amount" id="chart-total-amount">0đ</span>
                        </div>
                    </div>
                    <div class="chart-body">
                        <canvas id="boardingChart"></canvas>
                    </div>
                </div>

                <!-- PANEL PHẢI: PHÂN BỐ LOÀI THÚ CƯNG (Đã lọc theo thời gian) -->
                <div class="right-dashboard">
                    <div class="panel panel-distribution">
                        <div class="panel-title-area">
                            <h3>Phân bố loài thú cưng</h3>
                            <span class="subtitle-filter-info" id="distribution-subtitle">Trong kỳ</span>
                        </div>
                        <div class="pet-type-distribution" id="pet-type-container">
                            <p class="loading-text">Đang tính toán...</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- MODAL HIỂN THỊ CHI TIẾT KHI CLICK VÀO THẺ THỐNG KÊ -->
        <div id="reportDetailModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="modal-content" style="background: #fff; width: 800px; max-width: 90%; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <div class="modal-header" style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                    <h3 id="report-modal-title" style="margin: 0; font-size: 18px; color: #1e293b;">Chi tiết thống kê</h3>
                    <button onclick="closeReportDetailModal()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">&times;</button>
                </div>
                <div class="modal-body" id="report-modal-body" style="padding: 20px; max-height: 400px; overflow-y: auto;">
                    <!-- Nội dung bảng chi tiết sẽ được render tại đây -->
                </div>
                <div class="modal-footer" style="padding: 12px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: right;">
                    <button onclick="closeReportDetailModal()" style="padding: 8px 16px; background: #e2e8f0; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">Đóng</button>
                </div>
            </div>
        </div>
    `;

    await fetchAllReportData();
}

async function fetchAllReportData() {
    try {
        const [resBoarding, resPets] = await Promise.all([
            fetch(API.boarding || '/api/boarding').catch(() => ({ ok: false })),
            fetch(API.pets || '/api/pets').catch(() => ({ ok: false }))
        ]);

        if (resBoarding.ok) globalBoardingData = await resBoarding.json();
        if (resPets.ok) globalPetsData = await resPets.json();

        applyGlobalFilterAndRender();
    } catch (e) {
        console.error("Lỗi tải dữ liệu báo cáo:", e);
    }
}

function changeGlobalReportFilter(type) {
    currentReportFilter = type;
    
    ['week', 'month', 'quarter', 'year'].forEach(f => {
        const btn = document.getElementById(`btn-filter-${f}`);
        if (btn) {
            if (f === type) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });

    applyGlobalFilterAndRender();
}

// Biến lưu trữ tạm dữ liệu đã lọc theo kỳ để phục vụ việc xem chi tiết qua modal
let currentFilteredBoardingData = [];

function applyGlobalFilterAndRender() {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Lọc dữ liệu toàn cục theo đúng khoảng thời gian master filter (Giống Dashboard)
    currentFilteredBoardingData = globalBoardingData.filter(item => {
        if (!item.checkInDate) return false;
        const d = new Date(item.checkInDate);
        
        if (currentReportFilter === 'week') {
            const diffTime = now - d;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            return diffDays >= 0 && diffDays <= 7;
        } else if (currentReportFilter === 'month') {
            return d.getFullYear() === currentYear;
        } else if (currentReportFilter === 'quarter') {
            return d.getFullYear() === currentYear;
        } else if (currentReportFilter === 'year') {
            const startYear = currentYear - 3;
            const year = d.getFullYear();
            return year >= startYear && year <= currentYear;
        }
        return true;
    });
    const totalRevenue = currentFilteredBoardingData.reduce((sum, item) => sum + (Number(item.totalFee) ?? Number(item.baseFee) ?? 0), 0);
    const totalBoardingCount = currentFilteredBoardingData.length;
    const lateReturnCount = currentFilteredBoardingData.filter(item => (Number(item.lateFee) || 0) > 0 || item.status === 'LATE').length;
    const petCountMap = {};
    currentFilteredBoardingData.forEach(item => {
        const pId = item.petId || (item.pet ? item.pet.id : null);
        if (pId) {
            petCountMap[pId] = (petCountMap[pId] || 0) + 1;
        }
    });

    let topPetName = "Chưa có";
    if (Object.keys(petCountMap).length > 0) {
        const topPetId = Object.keys(petCountMap).reduce((a, b) => petCountMap[a] > petCountMap[b] ? a : b);
        const foundPet = globalPetsData.find(p => String(p.id) === String(topPetId));
        if (foundPet) {
            topPetName = `${foundPet.name} (${petCountMap[topPetId]} lần)`;
        }
    }
    document.getElementById("total-revenue").innerText = (typeof formatMoney === 'function' ? formatMoney(totalRevenue) : totalRevenue.toLocaleString('vi-VN') + "đ");
    document.getElementById("total-boarding").innerText = totalBoardingCount;
    document.getElementById("top-pet-sent").innerText = topPetName;
    document.getElementById("total-late-return").innerText = lateReturnCount;
    document.getElementById("total-notes").innerText = currentFilteredBoardingData.reduce((acc, i) => acc + (i.notes ? i.notes.length : 0), 0);
    updateChartData(currentReportFilter, globalBoardingData);
    drawFilteredPetTypeChart(currentFilteredBoardingData);
}

function updateChartData(filterType, dataList) {
    const canvas = document.getElementById("boardingChart");
    if (!canvas) return;

    if (window.revenueChart) {
        window.revenueChart.destroy();
    }

    let labels = [];
    let values = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    let highlightIndex = -1;

    if (filterType === 'week') {
        labels = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
        values = Array(7).fill(0);
        
        let currentDayIndex = now.getDay();
        highlightIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

        dataList.forEach(item => {
            if (item.checkInDate) {
                const date = new Date(item.checkInDate);
                let dayIndex = date.getDay();
                dayIndex = dayIndex === 0 ? 6 : dayIndex - 1; 
                if (date.getFullYear() === currentYear) {
                    values[dayIndex] += (Number(item.totalFee) ?? Number(item.baseFee) ?? 0);
                }
            }
        });
    } else if (filterType === 'month') {
        labels = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
        values = Array(12).fill(0);
        highlightIndex = now.getMonth();

        dataList.forEach(item => {
            if (item.checkInDate) {
                const date = new Date(item.checkInDate);
                if (date.getFullYear() === currentYear) {
                    values[date.getMonth()] += (Number(item.totalFee) ?? Number(item.baseFee) ?? 0);
                }
            }
        });
    } else if (filterType === 'quarter') {
        labels = ["Quý 1", "Quý 2", "Quý 3", "Quý 4"];
        values = Array(4).fill(0);
        highlightIndex = Math.floor(now.getMonth() / 3);

        dataList.forEach(item => {
            if (item.checkInDate) {
                const date = new Date(item.checkInDate);
                if (date.getFullYear() === currentYear) {
                    const quarter = Math.floor(date.getMonth() / 3);
                    values[quarter] += (Number(item.totalFee) ?? Number(item.baseFee) ?? 0);
                }
            }
        });
    } else if (filterType === 'year') {
        const startYear = currentYear - 3;
        labels = [String(startYear), String(startYear + 1), String(startYear + 2), String(currentYear)];
        values = Array(4).fill(0);
        highlightIndex = 3;

        dataList.forEach(item => {
            if (item.checkInDate) {
                const yearIndex = new Date(item.checkInDate).getFullYear() - startYear;
                if (yearIndex >= 0 && yearIndex < 4) {
                    values[yearIndex] += (Number(item.totalFee) ?? Number(item.baseFee) ?? 0);
                }
            }
        });
    }

    const totalAmount = values.reduce((acc, val) => acc + val, 0);
    const totalAmountEl = document.getElementById("chart-total-amount");
    if (totalAmountEl) {
        totalAmountEl.innerText = (typeof formatMoney === 'function' ? formatMoney(totalAmount) : totalAmount.toLocaleString('vi-VN') + "đ");
    }

    // Áp dụng đúng 2 màu bạn vừa cung cấp cho mọi bộ lọc
    const backgroundColors = values.map((_, index) => 
        index === highlightIndex ? "#2563eb" : "#cbd5e1"
    );
    const hoverBackgroundColors = values.map((_, index) => 
        index === highlightIndex ? "#1d4ed8" : "#94a3b8"
    );

    window.revenueChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Doanh thu",
                data: values,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: hoverBackgroundColors,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { color: "#f1f5f9" }, ticks: { maxTicksLimit: 5 } }
            }
        }
    });
}

function drawFilteredPetTypeChart(filteredBoarding) {
    const container = document.getElementById("pet-type-container");
    const subtitle = document.getElementById("distribution-subtitle");
    if (!container) return;
    
    if (subtitle) {
        const filterNames = { week: '7 ngày qua', month: 'Tháng này', quarter: 'Quý này', year: 'Năm nay' };
        subtitle.innerText = filterNames[currentReportFilter] || '';
    }

    if (!filteredBoarding || filteredBoarding.length === 0) {
        container.innerHTML = `<p class="empty-text">Không có dữ liệu trong kỳ này</p>`;
        return;
    }

    const typeCountMap = {};
    let totalValidPetsCount = 0;

    filteredBoarding.forEach(item => {
        const pId = item.petId || (item.pet ? item.pet.id : null);
        if (pId) {
            const foundPet = globalPetsData.find(p => String(p.id) === String(pId));
            if (foundPet) {
                const type = foundPet.type || "Other";
                typeCountMap[type] = (typeCountMap[type] || 0) + 1;
                totalValidPetsCount++;
            }
        }
    });

    if (totalValidPetsCount === 0) {
        container.innerHTML = `<p class="empty-text">Không có dữ liệu loài trong kỳ này</p>`;
        return;
    }

    const sortedTypes = Object.entries(typeCountMap).sort((a, b) => b[1] - a[1]);

    container.innerHTML = sortedTypes.map(([type, count]) => {
        const percentage = Math.round((count / totalValidPetsCount) * 100);
        const petIcon = typeof getPetIcon === "function" ? getPetIcon(type) : "🐾";

        return `
            <div class="distribution-row">
                <div class="distribution-meta">
                    <span>${petIcon} ${type}</span>
                    <span>${count} (${percentage}%)</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percentage}%;"></div>
                </div>
            </div>
        `;
    }).join("");
}

/* =====================================================
   XỬ LÝ HIỂN THỊ MODAL CHI TIẾT KHI CLICK VÀO THẺ
===================================================== */
function openReportDetailModal(type) {
    const modal = document.getElementById("reportDetailModal");
    const titleEl = document.getElementById("report-modal-title");
    const bodyEl = document.getElementById("report-modal-body");
    if (!modal || !bodyEl) return;

    let title = "";
    let dataToShow = [];

    if (type === 'revenue' || type === 'boarding') {
        title = type === 'revenue' ? "Chi tiết doanh thu các phiếu trong kỳ" : "Danh sách tổng phiếu gửi trong kỳ";
        dataToShow = currentFilteredBoardingData;
    } else if (type === 'late') {
        title = "Danh sách phiếu gửi trả trễ / quá hạn";
        dataToShow = currentFilteredBoardingData.filter(item => (Number(item.lateFee) || 0) > 0 || item.status === 'LATE');
    } else if (type === 'notes') {
        title = "Danh sách ghi chú chăm sóc trong kỳ";
        // Lọc các phiếu có chứa ghi chú
        dataToShow = currentFilteredBoardingData.filter(item => item.notes && item.notes.length > 0);
    } else if (type === 'top-pet') {
        title = "Thống kê thú cưng gửi nhiều nhất";
        renderTopPetModalContent(bodyEl);
        titleEl.innerText = title;
        modal.style.display = "flex";
        return;
    }

    titleEl.innerText = title;

    if (dataToShow.length === 0) {
        bodyEl.innerHTML = `<p style="text-align: center; color: #64748b; padding: 20px;">Không có dữ liệu chi tiết cho mục này trong kỳ.</p>`;
    } else {
        bodyEl.innerHTML = `
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
                <thead>
                    <tr style="border-bottom: 2px solid #e2e8f0; color: #475569;">
                        <th style="padding: 10px;">Mã phiếu</th>
                        <th style="padding: 10px;">Thú cưng</th>
                        <th style="padding: 10px;">Check-in</th>
                        <th style="padding: 10px;">Trạng thái</th>
                        <th style="padding: 10px; text-align: right;">Tổng phí</th>
                    </tr>
                </thead>
                <tbody>
                    ${dataToShow.map(item => {
                        const foundPet = globalPetsData.find(p => String(p.id) === String(item.petId || (item.pet ? item.pet.id : '')));
                        const petName = foundPet ? foundPet.name : (item.petName || 'Thú cưng');
                        const fee = Number(item.totalFee || 0).toLocaleString('vi-VN') + "đ";
                        return `
                            <tr style="border-bottom: 1px solid #f1f5f9; cursor: pointer;" onclick="if(typeof editBoarding === 'function') { closeReportDetailModal(); editBoarding(${item.id}); }">
                                <td style="padding: 10px; font-weight: 500;">#${item.id}</td>
                                <td style="padding: 10px;">${petName}</td>
                                <td style="padding: 10px;">${item.checkInDate ? new Date(item.checkInDate).toLocaleDateString('vi-VN') : '---'}</td>
                                <td style="padding: 10px;"><span style="padding: 2px 8px; border-radius: 4px; font-size: 12px; background: #e2e8f0;">${item.status || 'ACTIVE'}</span></td>
                                <td style="padding: 10px; text-align: right; font-weight: 600; color: #2563eb;">${fee}</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        `;
    }

    modal.style.display = "flex";
}

function renderTopPetModalContent(container) {
    const petCountMap = {};
    currentFilteredBoardingData.forEach(item => {
        const pId = item.petId || (item.pet ? item.pet.id : null);
        if (pId) {
            petCountMap[pId] = (petCountMap[pId] || 0) + 1;
        }
    });

    const sortedPets = Object.entries(petCountMap).sort((a, b) => b[1] - a[1]);

    if (sortedPets.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #64748b; padding: 20px;">Chưa có dữ liệu thú cưng gửi trong kỳ.</p>`;
        return;
    }

    container.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
            <thead>
                <tr style="border-bottom: 2px solid #e2e8f0; color: #475569;">
                    <th style="padding: 10px;">Thú cưng</th>
                    <th style="padding: 10px;">Loài / Giống</th>
                    <th style="padding: 10px; text-align: right;">Số lần gửi</th>
                </tr>
            </thead>
            <tbody>
                ${sortedPets.map(([pId, count]) => {
                    const foundPet = globalPetsData.find(p => String(p.id) === String(pId));
                    const petName = foundPet ? foundPet.name : "Không rõ";
                    const petType = foundPet ? (foundPet.type || "Khác") : "---";
                    const petIcon = typeof getPetIcon === "function" ? getPetIcon(petType) : "🐾";
                    return `
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 10px; font-weight: 500;">${petIcon} ${petName}</td>
                            <td style="padding: 10px;">${petType}</td>
                            <td style="padding: 10px; text-align: right; font-weight: 600; color: #16a34a;">${count} lần</td>
                        </tr>
                    `;
                }).join("")}
            </tbody>
        </table>
    `;
}

function closeReportDetailModal() {
    const modal = document.getElementById("reportDetailModal");
    if (modal) {
        modal.style.display = "none";
    }
}

window.showReports = showReports;
window.changeGlobalReportFilter = changeGlobalReportFilter;
window.openReportDetailModal = openReportDetailModal;
window.closeReportDetailModal = closeReportDetailModal;