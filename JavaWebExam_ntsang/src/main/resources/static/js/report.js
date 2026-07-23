/* =====================================================
   INIT
===================================================== */
async function showReports() {
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