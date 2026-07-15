const API = {
  owners: "http://localhost:8081/api/owners",
  users: "http://localhost:8081/api/users",
  pets: "http://localhost:8081/api/pets",
  carenotes: "http://localhost:8081/api/care-notes", 
  boardingrecords: "http://localhost:8081/api/boarding-records" // Sửa lại đúng chính tả endpoint và đồng bộ với API gốc của bạn
};
// Khai báo các biến lưu trữ dữ liệu riêng biệt để tránh ghi đè lẫn nhau
let ownersData = [];
let usersData = [];
let petsData = [];
let careNotesData = [];
let boardingRecordsData = [];
let countPet = [];
// Hàm set trạng thái active cho menu sidebar
function setActiveMenu(menuId) {
  document.querySelectorAll(".sidebar a").forEach((item) => {
    item.classList.remove("active");
  });
  const activeItem = document.getElementById(menuId);
  if (activeItem) {
    activeItem.classList.add("active");
  }
}
// Event Logout
const logoutBtn = document.getElementById("menu-logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async function(e) {
    e.preventDefault();
    const response = await fetch("/logout", {
        method: "POST",
        credentials: "include"
    });
    if (response.ok) {
        window.location.href = "/login.html";
    } else {
        alert("Logout failed!");
    }
  });
}
/* ========================================================
   CÁC HÀM CALL API (LƯU DỮ LIỆU VÀO BIẾN RIÊNG BIỆT)
=========================================================== */
// 1. Load Owners
async function loadOwners() {
  try {
    const response = await fetch(API.owners);
    if (!response.ok) throw new Error("Cannot load owners");
    ownersData = await response.json();
    return ownersData;
  } catch (err) {
    console.error("Lỗi tải chủ nuôi:", err);
    return [];
  }
}
// 2. Load Users
async function loadUsers() {
  try {
    const response = await fetch(API.users);
    if (!response.ok) throw new Error("Cannot load users");
    usersData = await response.json();
    return usersData;
  } catch (err) {
    console.error("Lỗi tải tài khoản:", err);
    return [];
  }
}
// 3. Load Pets
async function loadPets() {
  try {
    const response = await fetch(API.pets);
    if (!response.ok) throw new Error("Cannot load pets");
    petsData = await response.json();
    return petsData;
  } catch (err) {
    console.error("Lỗi tải thú cưng:", err);
    return [];
  }
}
// 4. Load Care Notes
async function loadCareNotes() {
  try {
    const response = await fetch(API.carenotes);
    if (!response.ok) throw new Error("Cannot load care notes");
    careNotesData = await response.json();
    return careNotesData;
  } catch (err) {
    console.error("Lỗi tải ghi chú chăm sóc:", err);
    return [];
  }
}
// 5. Load Boarding Records (Sửa lỗi gọi API.boardingrecodesowners trước đó)
async function loadBoardingRecords() {
  try {
    const response = await fetch(API.boardingrecords);
    if (!response.ok) throw new Error("Cannot load boarding records");
    boardingRecordsData = await response.json();
    return boardingRecordsData;
  } catch (err) {
    console.error("Lỗi tải phiếu gửi:", err);
    return [];
  }
}
/* ========================================================
   RENDER DASHBOARD & ĐỔ DỮ LIỆU
=========================================================== */
async function showDashboard() {
  setActiveMenu("menu-dashboard");
  const mainView = document.getElementById("content");
  if (!mainView) return;
  // 1. Dựng khung HTML ban đầu cho Dashboard
  mainView.innerHTML = `
    <header class="topbar">
        <div>
            <h1>Dashboard</h1>
            <p>Tổng quan</p>
        </div>
        <button class="primary-btn">+ Tạo phiếu gửi</button>
    </header>
    
    <!-- STATISTIC -->
    <section class="cards">
        <div class="card">
            <i class="fa-solid fa-user"></i>
            <div>
                <h2 id="owner-count">...</h2>
                <p>CHỦ NUÔI</p>
            </div>
        </div>
        <div class="card">
            <i class="fa-solid fa-paw"></i>
            <div>
                <h2 id="pet-count">...</h2>
                <p>THÚ CƯNG</p>
            </div>
        </div>
        <div class="card">
            <i class="fa-solid fa-house"></i>
            <div>
                <h2 id="boarding-count">...</h2>
                <p>ĐANG GỬI</p>
            </div>
        </div>
        <div class="card">
            <i class="fa-solid fa-money-bill"></i>
            <div>
                <h2 id="revenue-count">0đ</h2>
                <p>DOANH THU</p>
            </div>
        </div>
        <div class="card">
            <i class="fa-solid fa-note-sticky"></i>
            <div>
                <h2 id="carenote-count">...</h2>
                <p>GHI CHÚ</p>
            </div>
        </div>
    </section>

    <!-- MAIN GRID -->
    <section class="dashboard-grid">
        <!-- BOARDING TABLE -->
        <div class="panel">
            <div class="panel-header">
				<div class="total-inf">
                <h3>Phiếu gửi gần đây </h3>
				<h3 id="boarding-countAll"> ...</3>
				</div>
                <div class="filter">
                    <button class="active-filter" onclick="filterBoarding('all')">Tất cả</button>
                    <button onclick="filterBoarding('BOARDING')">Đang gửi</button>
                    <button onclick="filterBoarding('RETURNED')">Đã trả</button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>THÚ CƯNG</th>
                        <th>CHỦ NUÔI</th>
                        <th>CHECK-IN</th>
                        <th>TRẠNG THÁI</th>
                        <th>PHÍ</th>
                    </tr>
                </thead>
                <tbody id="boarding-table">
                    <tr><td colspan="5" style="text-align: center;">Đang tải dữ liệu...</td></tr>
                </tbody>
            </table>
        </div>
		
        <!-- RIGHT SIDE -->
        <div class="right-content">
            <div class="panel">
                <div class="panel-header">
                    <h3>Doanh thu 2025</h3>
                    <strong id="yearly-revenue">0đ</strong>
                </div>
                <canvas id="revenueChart"></canvas>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <h3>Phân bố loài</h3>
                </div>
                <div id="pet-type-statistic">
                     <!-- Sẽ được tính toán và đổ tự động bằng JS -->
                </div>
            </div>
        </div>
    </section>
  `;
  const [owners, pets, carenotes, records] = await Promise.all([
    loadOwners(),
    loadPets(),
    loadCareNotes(),
    loadBoardingRecords()
  ]);
  // 3. Tính toán số liệu thống kê
  const totalOwners = owners.length;
  const totalPets = pets.length;
  const totalCareNotes = carenotes.length;

  // Lọc danh sách thú cưng đang thực tế gửi (ví dụ: status == 'boarding' hoặc 'Đang gửi')
  const boardingRecords = records.filter(r => r.status === "BOARDING");
  const boardingRecordCount = records.length;
  const boardingCount = boardingRecords.length;
  // Tính tổng doanh thu từ tất cả các phiếu gửi (cộng dồn trường 'price' hoặc 'fee' trong record)
  const totalRevenue = records.reduce((sum, record) => {
    const fee = parseFloat(record.totalFee || 0);
    return sum + fee;
  }, 0);
  document.getElementById("owner-count").textContent = totalOwners;
  document.getElementById("pet-count").textContent = totalPets;
  document.getElementById("boarding-count").textContent = boardingCount;
  document.getElementById("boarding-countAll").textContent = " " + boardingRecordCount;
  document.getElementById("carenote-count").textContent = totalCareNotes;
  const formattedRevenue = new Intl.NumberFormat('vi-VN').format(totalRevenue) + "đ";
  document.getElementById("revenue-count").textContent = formattedRevenue;
  document.getElementById("yearly-revenue").textContent = formattedRevenue;
  // 5. Đổ danh sách phiếu gửi gần đây vào bảng
  renderBoardingTable(records);
  // 6. Tự động tính toán & vẽ "Phân bố loài" dựa trên dữ liệu thật của Pets
  renderPetTypeStatistics(pets);
  // Chart
  renderRevenueChart();
}
// Hàm render dữ liệu vào bảng phiếu gửi
function renderBoardingTable(recordsList) {
  const tableBody = document.getElementById("boarding-table");
  if (!tableBody) return;
  if (recordsList.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Chưa có phiếu gửi nào.</td></tr>`;
    return;
  }
  tableBody.innerHTML = recordsList.map(record => {
    const status = record.status ? record.status.toUpperCase() : "";
    const isBoarding = status === "BOARDING";
    const statusClass = isBoarding ? "boarding" : "returned";
    const statusText = isBoarding ? "Đang gửi" : "Đã trả";
    const fee = record.totalFee || record.fee;
    const feeFormatted = fee ? new Intl.NumberFormat('vi-VN').format(fee) + "đ" : "Chưa tính";
    return `
      <tr style="cursor: pointer;" onclick="openModalWithData(${record.id})">
          <td><strong>${record.petName || "N/A"}</strong></td>
          <td>${record.ownerName || "N/A"}</td>
          <td>${record.checkInDate || record.checkIn || "N/A"}</td>
          <td><span class="status ${statusClass}">${statusText}</span></td>
          <td><strong>${feeFormatted}</strong></td>
      </tr>
    `;
  }).join('');
}
function filterBoarding(type) {
  const buttons = document.querySelectorAll(".filter button");
  buttons.forEach(btn => btn.classList.remove("active-filter"));
  if (type === "all") {
    renderBoardingTable(boardingRecordsData);
  } else if (type === "boarding") {
    const filtered = boardingRecordsData.filter(r => r.status === "boarding" || r.status === "Đang gửi");
    renderBoardingTable(filtered);
  } else if (type === "returned") {
    const filtered = boardingRecordsData.filter(r => r.status === "returned" || r.status === "Đã trả");
    renderBoardingTable(filtered);
  }
}
function renderPetTypeStatistics(petsList) {
  const statContainer = document.getElementById("pet-type-statistic");
  if (!statContainer || petsList.length === 0) return;
  // Gom nhóm và đếm số lượng từng loài (Dog, Cat, Rabbit,...)
  const counts = {};
  petsList.forEach(pet => {
    const type = pet.type || pet.species || "Khác";
    counts[type] = (counts[type] || 0) + 1;
  });
  const total = petsList.length;
  let htmlContent = "";
  // Sinh HTML tỉ lệ phần trăm cho từng loài thú cưng
  for (const [type, count] of Object.entries(counts)) {
    const percentage = Math.round((count / total) * 100);
    const icon = type.toLowerCase() === "dog" ? "🐶" : type.toLowerCase() === "cat" ? "🐱" : "🐾";
   
    htmlContent += `
      <div class="pet-row">
          <span>${icon} ${type}</span>
          <b>${percentage}%</b>
      </div>
      <div class="progress">
          <div style="width: ${percentage}%"></div>
      </div>
    `;
  }

  statContainer.innerHTML = htmlContent;
}
// Chart
function renderRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;
  const monthlyRevenue = new Array(12).fill(0);
  const currentYear = new Date().getFullYear(); 
  boardingRecordsData.forEach(record => {
    const dateStr = record.checkInDate;
    if (!dateStr) return;
    let recordDate;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      recordDate = new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
      recordDate = new Date(dateStr);
    }
    if (recordDate.getFullYear() === currentYear) {
      const month = recordDate.getMonth(); // Lấy tháng (0 -> 11)
      const fee = parseFloat(record.totalFee || 0);
      monthlyRevenue[month] += fee;
    }
  });
  const currentMonthIndex = new Date().getMonth();
  const backgroundColors = monthlyRevenue.map((_, index) => {
    return index === currentMonthIndex ? '#ff5252' : '#1e88e5';
  });
  const hoverColors = monthlyRevenue.map((_, index) => {
    return index === currentMonthIndex ? '#ff1744' : '#1565c0';
  });
  const labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Doanh thu thực tế (đ)',
        data: monthlyRevenue,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverColors,
        borderRadius: 6,
        borderSkipped: false,
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
              let value = context.raw;
              return ' ' + new Intl.NumberFormat('vi-VN').format(value) + 'đ';
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: 'Segoe UI',
              weight: '600'
            },
            color: '#777',
            callback: function(val, index) {
              const targetMonths = [0, 2, 4, 6, 11]; // Tương ứng T1, T3, T5, T7, T12
              if (targetMonths.includes(index) || index === currentMonthIndex) {
                return labels[index];
              }
              return ''; 
            }
          }
        },
        y: {
          border: {
            dash: [5, 5]
          },
          grid: {
            color: '#eaeaea'
          },
          ticks: {
            font: {
              family: 'Segoe UI'
            },
            color: '#999',
            // Rút gọn đơn vị hiển thị (Ví dụ: 1.5M thay vì 1.500.000đ)
            callback: function(value) {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1).replace('.0', '') + 'M';
              } else if (value >= 1000) {
                return (value / 1000).toFixed(0) + 'K';
              }
              return value;
            }
          }
        }
      }
    }
  });
}
//Owner management
async function showOwners() {
  setActiveMenu("menu-owners");
  const mainView = document.getElementById("content");
  if (!mainView) return;
  // 1. Dựng khung HTML ban đầu cho Dashboard
  mainView.innerHTML = `
    <header class="topbar">
        <div>
            <h1>Owners</h1>
        </div>
		
        <button class="primary-btn">+ Add Owners</button>
    </header>
    <!-- MAIN GRID -->
    <section class="dashboard-grid-owner">
        <!-- BOARDING TABLE -->
        <div class="panel">
            <div class="panel-header">
				<div class="total-inf">
                <h3>Phiếu gửi gần đây </h3>
				<h3 id="owner-countAll"> ...</3>
				</div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>HỌ TÊN</th>
                        <th>ĐIỆN THOẠI</th>
                        <th>EMAIL</th>
                        <th>THÚ CƯNG</th>
						<th>TÀI KHOẢN</th>
						<th>THAO TÁC</th>
                    </tr>
                </thead>
                <tbody id="boarding-table">
                    <tr><td colspan="5" style="text-align: center;">Đang tải dữ liệu...</td></tr>
                </tbody>
            </table>
        </div>
    </section>
  `;
	owners = await loadOwners();
	const totalOwners = owners.length;
	document.getElementById("owner-countAll").textContent = totalOwners;
	renderOwnerTable(owners);
}
// Count pets for each owner
async function getPetByOwnerId(id){
	const response = await fetch(`${API.pets}/owner/${id}`);
	countPet = await response.json();
	return countPet;
}
// Hàm render dữ liệu vào bảng phiếu gửi
async function renderOwnerTable(owners) {
  const tableBody = document.getElementById("boarding-table");
  if (!tableBody) return;
  if (owners.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Chưa có phiếu gửi nào.</td></tr>`;
    return;
  }
  tableBody.innerHTML = ownersData.map(owners => {
	let test = getPetByOwnerId(owners.id);
	const totalPet = test.length;
	console.log(totalPet);
    const id = owners.id;
    const name = owners.name;
   	const phone = owners.phone;
	const email = owners.email;
	const pets = "";
	const account = ""
	const activity = ""
    return `
      <tr style="cursor: pointer;" onclick="openModalWithData(${owners.id})">
          <td><strong>${id || "N/A"}</strong></td>
          <td>${name || "N/A"}</td>
          <td>${phone}</td>
		  <td>${email}</td>
		  <td>${totalPet}</td>
          <td>${account}</td>
		  <td>${activity}</td>
      </tr>
    `;
  }).join('');
}

//Owner Pets
async function showPets() {
  setActiveMenu("menu-pets");
  const mainView = document.getElementById("content");
  if (!mainView) return;
  // 1. Dựng khung HTML ban đầu cho Dashboard
  mainView.innerHTML = `
    <header class="topbar">
        <div>
            <h1>Pets</h1>
        </div>
		
        <button class="primary-btn">+ Add Pets</button>
    </header>
    <!-- MAIN GRID -->
    <section class="dashboard-grid-owner">
        <!-- BOARDING TABLE -->
        <div class="panel">
		<div class="filter">
		                    <button class="active-filter" onclick="filterBoarding('all')">Tất cả</button>
		                    <button onclick="filterBoarding('BOARDING')">Đang gửi</button>
		                    <button onclick="filterBoarding('RETURNED')">Đã trả</button>
		                </div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>THÚ CƯNG</th>
                        <th>LOẠI</th>
                        <th>GIỐNG</th>
                        <th>TUỔI</th>
						<th>CÂN NẶNG</th>
						<th>CHỦ NUÔI</th>
						<th>TRẠNG THÁI</th>
						<th>THAO TÁC</th>
                    </tr>
                </thead>
                <tbody id="boarding-table">
                    <tr><td colspan="5" style="text-align: center;">Đang tải dữ liệu...</td></tr>
                </tbody>
            </table>
        </div>
    </section>
  `;
	pets = await loadPets();
	renderPetsTable(pets);
}
// Hàm render dữ liệu vào bảng phiếu gửi
async function renderPetsTable(pets) {
  const tableBody = document.getElementById("boarding-table");
  if (!tableBody) return;
  if (owners.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Chưa có phiếu gửi nào.</td></tr>`;
    return;
  }
  tableBody.innerHTML = ownersData.map(owners => {
    const id = pets.id;
    const name = pets.name;
	const type = pets.type;
	const breed = pets.breed;
	const age = pets.age;
	const weight = pets.weight;
    return `
      <tr style="cursor: pointer;" onclick="openModalWithData(${owners.id})">
          <td><strong>${id || "N/A"}</strong></td>
          <td>${name || "N/A"}</td>
          <td>${type}</td>
		  <td>${breed}</td>
		  <td>${age}</td>
          <td>${weight}</td>
		  <td>${3}</td>
		  <td>${4}</td>
		  <td>${2}</td>
      </tr>
    `;
  }).join('');
}
// Kích hoạt chạy Dashboard ngay khi tải trang
window.onload = function() {
 	showDashboard();
};
