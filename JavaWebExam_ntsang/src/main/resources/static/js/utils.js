/* =====================================================
   DATE
===================================================== */
function setActiveMenu(id) {
    const menus = document.querySelectorAll(".menu a");
    menus.forEach(item => {
        item.classList.remove("active");
    });
    const current = document.getElementById(id);
    if (current) {
        current.classList.add("active");
    }
}
/**
 * yyyy-MM-dd -> dd/MM/yyyy
 */
function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
}
/**
 * yyyy-MM-dd HH:mm:ss
 */
function formatDateTime(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
}

function formatMoney(value) {
    if (value == null) return "0 VNĐ";
    return Number(value).toLocaleString("vi-VN") + " VNĐ";
}

function boardingBadge(status) {
    switch (status) {
        case "BOARDING":
            return `<span class="badge boarding">🟢 Boarding</span>`;

        case "RETURNED":
            return `<span class="badge returned">🔵 Returned</span>`;

        default:
            return `<span class="badge">Unknown</span>`;
    }
}
function petStatusBadge(status) {
    switch (status) {
        case "BOARDING":
            return `
                <span class="badge boarding">
                    🟢 Đang gửi
                </span>
            `;
        case "RETURNED":
            return `
                <span class="badge returned">
                    🔵 Đã trả
                </span>
            `;
        default:
            return `
                <span class="badge">
                    🏠 Ở nhà
                </span>
            `;
    }
}

function petIcon(type) {
    switch (type) {
        case "Dog":
            return "🐶";
        case "Cat":
            return "🐱";
        case "Bird":
            return "🐦";
        case "Rabbit":
            return "🐰";
        default:
            return "🐾";
    }
}

function petBadge(type) {
    return `
        <span class="pet-type">
            ${petIcon(type)} ${type}
        </span>
    `;
}

function accountBadge(hasAccount) {
    if (hasAccount) {
        return `
            <span class="badge success">
                ✅ Đã có
            </span>
        `;
    }
    return `
        <span class="badge danger">
            ❌ Chưa có
        </span>
    `;
}

function enabledBadge(enabled){
    return enabled
        ? `<span class="badge success">Hoạt động</span>`
        : `<span class="badge danger">Đã khóa</span>`;

}

function showToast(message, type = "success") {
    const oldToast = document.querySelector(".toast");
    if (oldToast) {
        oldToast.remove();
    }
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("show");
    }, 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function confirmDelete(message = "Bạn có chắc muốn xóa?") {
    return window.confirm(message);
}

function showLoading() {
    const table = document.getElementById("boarding-table");
    if (!table) return;
    table.innerHTML = `
        <tr>
            <td colspan="20" style="text-align:center;padding:40px;">
                ⏳ Đang tải dữ liệu...
            </td>
        </tr>
    `;
}

function hideLoading() {
    // Để trống vì renderTable() sẽ tự ghi đè dữ liệu
}

function emptyTable(message = "Không có dữ liệu") {
    return `
        <tr>
            <td colspan="20" style="text-align:center;padding:40px;">
                ${message}
            </td>
        </tr>
    `;
}

function searchByKeyword(list, keyword, field) {
    if (!keyword) return list;
    keyword = keyword.toLowerCase();
    return list.filter(item => {
        const value = item[field];
        if (!value) return false;
        return value.toLowerCase().includes(keyword);
    });
}