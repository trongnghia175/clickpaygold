// 1. Khởi tạo dữ liệu từ LocalStorage
let clicks = parseInt(localStorage.getItem('savedClicks')) || 0;
let username = localStorage.getItem('username') || "Người chơi"; 
let lastClickTime = 0; 

const clickCountDisplay = document.getElementById('click-count');
const usernameDisplay = document.getElementById('display-username');
const modalOverlay = document.getElementById('modal-overlay');
const receiptContent = document.getElementById('receipt-content');

// Hiển thị dữ liệu ngay khi load trang
clickCountDisplay.innerText = clicks.toLocaleString();
if(usernameDisplay) usernameDisplay.innerText = username;

// 2. Xử lý sự kiện Click
document.getElementById('click-btn').addEventListener('click', (e) => {
    const currentTime = new Date().getTime();
    


    lastClickTime = currentTime;
    clicks++;
    
    // Lưu và hiển thị
    localStorage.setItem('savedClicks', clicks);
    clickCountDisplay.innerText = clicks.toLocaleString();
});



// 4. Hàm đổi thưởng
function redeem(requiredClicks, rewardName) {
    if (clicks < requiredClicks) {
        showErrorModal();
        return;
    }

    // Trừ điểm và lưu lại
    clicks -= requiredClicks;
    localStorage.setItem('savedClicks', clicks);
    clickCountDisplay.innerText = clicks.toLocaleString();

    // Tính toán số tiền thực nhận (Phí 1k như trong HTML bạn ghi)
    let rewardValue = 0;
    if(requiredClicks >= 100000000) rewardValue = 200;
    else if(requiredClicks >= 10000000) rewardValue = 20;
    else if(requiredClicks >= 1000000) rewardValue = 5;
    
    const finalAmount = rewardValue > 0 ? rewardValue - 1 : 0; 
    
    const successHTML = `
        <div class="receipt-box">
            <p style="color: #2a9d8f; font-weight: bold; font-size: 1.2rem;">GIAO DỊCH THÀNH CÔNG ✅</p>
            <hr style="border: 1px dashed #ddd;">
            <p><strong>Người nhận:</strong> ${username}</p>
            <p><strong>Mã số:</strong> <span style="color: #e76f51;">${generateRandomCode()}</span></p>
            <p><strong>Phần thưởng:</strong> ${rewardName}</p>
            <p><strong>Thực nhận:</strong> ${finalAmount}k (Đã trừ 1k phí)</p>
            <p><strong>Thời gian:</strong> ${getCurrentTime()}</p>
        </div>
    `;
    showModal(successHTML, true);
}

// 5. Các hàm hỗ trợ giao diện
function generateRandomCode() {
    return "PAY-" + Math.floor(100000 + Math.random() * 900000);
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString('vi-VN');
}

function showModal(content, isSuccess) {
    receiptContent.innerHTML = content;
    const modalTitle = document.querySelector('.modal h2');
    modalTitle.innerText = isSuccess ? "THÀNH CÔNG" : "NHẮC NHỞ";
    modalTitle.style.color = isSuccess ? "#ff70a6" : "#5e548e";
    modalOverlay.classList.remove('hidden');
}

function showErrorModal() {
    const errorHTML = `
        <div class="error-box" style="text-align: center;">
            <p style="color: #d62828; font-weight: bold;">Số dư không đủ!</p>
            <p>Bạn cần thêm click để đổi phần thưởng này.</p>
        </div>
    `;
    showModal(errorHTML, false);
}

function closeModal() {
    modalOverlay.classList.add('hidden');
}
