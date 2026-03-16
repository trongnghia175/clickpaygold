// 1. Khởi tạo dữ liệu từ LocalStorage hoặc bằng 0
let clicks = parseInt(localStorage.getItem('savedClicks')) || 0;
let lastClickTime = 0; // Dùng để đo tốc độ click

const clickCountDisplay = document.getElementById('click-count');
const modalOverlay = document.getElementById('modal-overlay');
const receiptContent = document.getElementById('receipt-content');

// Hiển thị số click ngay khi load trang
clickCountDisplay.innerText = clicks.toLocaleString();

// Xử lý sự kiện Click
document.getElementById('click-btn').addEventListener('click', (e) => {
    const currentTime = new Date().getTime();
    
    // KIỂM TRA AUTO CLICK: Nếu click nhanh hơn 50ms (khoảng 20 click/giây)
    if (currentTime - lastClickTime < 50) {
        alert("⚠️ PHÁT HIỆN GIAN LẬN!\nHệ thống phát hiện phần mềm Auto Click. Toàn bộ dữ liệu của bạn sẽ bị xóa!");
        
        // Reset toàn bộ
        clicks = 0;
        localStorage.clear();
        clickCountDisplay.innerText = "0";
        location.reload(); // Tải lại trang để áp dụng reset
        return;
    }

    lastClickTime = currentTime;
    clicks++;
    
    // Lưu vào LocalStorage mỗi khi click
    localStorage.setItem('savedClicks', clicks);
    clickCountDisplay.innerText = clicks.toLocaleString();
});

// Hàm tạo mã số ngẫu nhiên 6 chữ số
function generateRandomCode() {
    return "#+" + Math.floor(100000 + Math.random() * 900000);
}

// Hàm lấy thời gian thực định dạng Việt Nam
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

// Hàm đổi thưởng chính (Cập nhật logic trừ tiền và lưu lại)
function redeem(requiredClicks, rewardName) {
    // Lưu ý: value trong file cũ của bạn bị thiếu tham số truyền vào, mình sẽ lấy giá trị từ rewardName hoặc bạn tự định nghĩa lại.
    // Ở đây mình tạm giả định giá trị dựa trên số click để tính 'thực nhận'
    const valueMap = { 1000: 100, 2000: 200 };
    const value = valueMap[requiredClicks] || 0;

    if (clicks < requiredClicks) {
        showErrorModal();
        return;
    }

    // Nếu đủ điều kiện: Trừ điểm và Cập nhật Storage
    clicks -= requiredClicks;
    localStorage.setItem('savedClicks', clicks); 
    clickCountDisplay.innerText = clicks.toLocaleString();

    const finalAmount = value - 10;
    
    const successHTML = `
        <div class="receipt-box">
            <p style="color: #2a9d8f; font-weight: bold; font-size: 1.2rem;">✨ GIAO DỊCH THÀNH CÔNG ✨</p>
            <hr style="border: 1px dashed #ddd;">
            <p><strong>Mã số:</strong> <span style="color: #e76f51;">${generateRandomCode()}</span></p>
            <p><strong>Phần thưởng:</strong> ${rewardName}</p>
            <p><strong>Thực nhận:</strong> ${finalAmount}k (Đã trừ 10k phí)</p>
            <p><strong>Thời gian:</strong> ${getCurrentTime()}</p>
        </div>
    `;

    showModal(successHTML, true);
}

function showErrorModal() {
    const errorHTML = `
        <div class="error-box">
            <img src="https://cdn-icons-png.flaticon.com/512/6659/6659895.png" width="80" alt="Sad face">
            <p style="color: #d62828; font-weight: bold; font-size: 1.1rem; margin-top: 10px;">
                Opps! Tài khoản không đủ số dư
            </p>
            <p>Bạn cần tích lũy thêm click để đổi phần quà này nhé! 🌸</p>
        </div>
    `;
    showModal(errorHTML, false);
}

function showModal(content, isSuccess) {
    receiptContent.innerHTML = content;
    const modalTitle = document.querySelector('.modal h2');
    modalTitle.innerText = isSuccess ? "THÔNG BÁO" : "NHẮC NHỞ";
    modalTitle.style.color = isSuccess ? "#ff70a6" : "#5e548e";
    modalOverlay.classList.remove('hidden');
}

function closeModal() {
    modalOverlay.classList.add('hidden');
}
// Khởi tạo dữ liệu
let clicks = parseInt(localStorage.getItem('savedClicks')) || 0;
// Lấy tên đã lưu hoặc đặt mặc định
let username = localStorage.getItem('username') || "Người chơi"; 
let lastClickTime = 0;

const clickCountDisplay = document.getElementById('click-count');
const usernameDisplay = document.getElementById('display-username');

// Hiển thị dữ liệu khi load trang
clickCountDisplay.innerText = clicks.toLocaleString();
usernameDisplay.innerText = username;

// Hàm đổi tên người dùng
function changeName() {
    const newName = prompt("Nhập tên mới của bạn:", username);
    if (newName && newName.trim() !== "") {
        username = newName.trim();
        localStorage.setItem('username', username); // Lưu vào máy
        usernameDisplay.innerText = username;
    }
}

// Cập nhật hàm redeem để hiện tên trong biên lai (Tùy chọn)
function redeem(requiredClicks, rewardName) {
    const valueMap = { 1000: 100, 2000: 200 };
    const value = valueMap[requiredClicks] || 0;

    if (clicks < requiredClicks) {
        showErrorModal();
        return;
    }

    clicks -= requiredClicks;
    localStorage.setItem('savedClicks', clicks);
    clickCountDisplay.innerText = clicks.toLocaleString();

    const finalAmount = value - 10;
    
    const successHTML = `
        <div class="receipt-box">
            <p style="color: #2a9d8f; font-weight: bold; font-size: 1.2rem;">✨ GIAO DỊCH THÀNH CÔNG ✨</p>
            <hr style="border: 1px dashed #ddd;">
            <p><strong>Người nhận:</strong> ${username}</p> <p><strong>Mã số:</strong> <span style="color: #e76f51;">${generateRandomCode()}</span></p>
            <p><strong>Phần thưởng:</strong> ${rewardName}</p>
            <p><strong>Thực nhận:</strong> ${finalAmount}k (Đã trừ 10k phí)</p>
            <p><strong>Thời gian:</strong> ${getCurrentTime()}</p>
        </div>
    `;
    showModal(successHTML, true);
}
