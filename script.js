document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THEME SWITCHER LOGIC (DARK/LIGHT MODE) ---
    const themeToggle = document.getElementById('theme-switch-checkbox');
    const docElement = document.documentElement;

    // Cek tema yang tersimpan di localStorage saat halaman dimuat
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        docElement.classList.remove('dark-mode');
        themeToggle.checked = true;
    } else {
        docElement.classList.add('dark-mode');
        themeToggle.checked = false;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            docElement.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        } else {
            docElement.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    });

    // --- 2. RESPONSIVE NAVIGATION LOGIC (HAMBURGER MENU) ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Tutup sidebar saat link di-klik (untuk mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // --- 3. PAGE NAVIGATION LOGIC ---
    const pages = document.querySelectorAll('.page');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- LOGIKA SEMUA KALKULATOR (TETAP SAMA SEPERTI SEBELUMNYA) ---
    // (Kode logika kalkulator dari jawaban sebelumnya disalin di sini)
    
    // 4. Kalkulator Standar
    const normalDisplay = document.getElementById('normal-display');
    const normalButtons = document.querySelector('#standar .buttons');
    normalButtons.addEventListener('click', e => {
        if (e.target.tagName !== 'BUTTON') return;
        const value = e.target.dataset.value;
        const text = e.target.innerText;
        if (value) { normalDisplay.value += value; } 
        else if (text === 'C') { normalDisplay.value = ''; } 
        else if (text === 'DEL') { normalDisplay.value = normalDisplay.value.slice(0, -1); } 
        else if (text === '=') { try { normalDisplay.value = eval(normalDisplay.value.replace('x', '*')); } catch { normalDisplay.value = 'Error'; } }
    });

    // 5. Kalkulator Jaringan IP
    document.getElementById('ip-calculate-btn').addEventListener('click', () => {
        const ipStr = document.getElementById('ip-address').value;
        const cidr = parseInt(document.getElementById('ip-cidr').value);
        const resultDiv = document.getElementById('ip-result');
        if (!ipStr || isNaN(cidr) || cidr < 0 || cidr > 32) { resultDiv.innerHTML = "Input tidak valid."; return; }
        const ipParts = ipStr.split('.').map(Number);
        if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) { resultDiv.innerHTML = "Format Alamat IP tidak valid."; return; }
        const ipInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
        const maskInt = (-1 << (32 - cidr)) >>> 0;
        const networkInt = ipInt & maskInt;
        const broadcastInt = networkInt | (~maskInt >>> 0);
        const intToIp = (int) => `${(int>>>24)&255}.${(int>>>16)&255}.${(int>>>8)&255}.${int&255}`;
        const numHosts = Math.pow(2, 32 - cidr) - 2;
        resultDiv.innerHTML = `Alamat Jaringan: <strong>${intToIp(networkInt)}</strong>\nAlamat Broadcast: <strong>${intToIp(broadcastInt)}</strong>\nRentang Host: <strong>${intToIp(networkInt + 1)} - ${intToIp(broadcastInt - 1)}</strong>\nJumlah Host: <strong>${numHosts > 0 ? numHosts : 0}</strong>`;
    });

    // 6. Kalkulator Massa Molar
    const atomicMasses = {'H':1.008,'He':4.003,'Li':6.941,'Be':9.012,'B':10.811,'C':12.011,'N':14.007,'O':15.999,'F':18.998,'Ne':20.18,'Na':22.99,'Mg':24.305,'Al':26.982,'Si':28.086,'P':30.974,'S':32.065,'Cl':35.453,'Ar':39.948,'K':39.098,'Ca':40.078,'Fe':55.845,'Cu':63.546,'Zn':65.38,'Br':79.904,'Ag':107.868,'I':126.904};
    document.getElementById('kimia-calculate-btn').addEventListener('click', () => {
        const formula = document.getElementById('kimia-formula').value;
        const resultDiv = document.getElementById('kimia-result');
        const regex = /([A-Z][a-z]?)(\d*)/g;
        let match, totalMass = 0, isValid = false;
        while((match = regex.exec(formula)) !== null) {
            isValid = true;
            const element = match[1], count = match[2] ? parseInt(match[2]) : 1;
            if (atomicMasses[element]) { totalMass += atomicMasses[element] * count; } 
            else { resultDiv.innerHTML = `Elemen <strong>${element}</strong> tidak ditemukan.`; return; }
        }
        if (!isValid || formula.trim() === '') { resultDiv.innerHTML = 'Format rumus kimia tidak valid.'; } 
        else { resultDiv.innerHTML = `Massa Molar dari <strong>${formula}</strong> adalah <strong>${totalMass.toFixed(3)} g/mol</strong>.`; }
    });

    // 7. Kalkulator Kalori (BMR & TDEE)
    document.getElementById('kalori-calculate-btn').addEventListener('click', () => {
        const age=parseInt(document.getElementById('kalori-usia').value), gender=document.getElementById('kalori-gender').value, weight=parseFloat(document.getElementById('kalori-berat').value), height=parseFloat(document.getElementById('kalori-tinggi').value), activity=parseFloat(document.getElementById('kalori-aktivitas').value);
        const resultDiv = document.getElementById('kalori-result');
        if (isNaN(age) || isNaN(weight) || isNaN(height)) { resultDiv.innerHTML = 'Mohon isi semua field dengan valid.'; return; }
        let bmr = (gender === 'male') ? (10 * weight + 6.25 * height - 5 * age + 5) : (10 * weight + 6.25 * height - 5 * age - 161);
        resultDiv.innerHTML = `Kebutuhan Kalori Basal (BMR): <strong>${bmr.toFixed(2)} kalori/hari</strong>\nKebutuhan Kalori Harian (TDEE): <strong>${(bmr * activity).toFixed(2)} kalori/hari</strong>`;
    });

    // 8. Konverter Basis Angka
    document.querySelectorAll('#basis-angka input').forEach(input => {
        input.addEventListener('input', (e) => {
            const sourceBase = parseInt(e.target.dataset.base), value = e.target.value;
            if (value.trim()==='') { document.querySelectorAll('#basis-angka input').forEach(i=>i.value=''); return; }
            const decimalValue = parseInt(value, sourceBase);
            if (isNaN(decimalValue)) return;
            document.querySelectorAll('#basis-angka input').forEach(otherInput => {
                if (parseInt(otherInput.dataset.base) !== sourceBase) { otherInput.value = decimalValue.toString(parseInt(otherInput.dataset.base)).toUpperCase(); }
            });
        });
    });

    // 9. Kalkulator BMI
    document.getElementById('bmi-calculate-btn').addEventListener('click', () => {
        const weight = parseFloat(document.getElementById('bmi-berat').value), height = parseFloat(document.getElementById('bmi-tinggi').value), resultDiv = document.getElementById('bmi-result');
        if (isNaN(weight) || isNaN(height) || height <= 0) { resultDiv.innerHTML = 'Mohon masukkan data yang valid.'; return; }
        const bmi = weight / ((height / 100) ** 2);
        let category = (bmi < 18.5) ? 'Berat Badan Kurang' : (bmi < 24.9) ? 'Berat Badan Normal' : (bmi < 29.9) ? 'Kelebihan Berat Badan' : 'Obesitas';
        resultDiv.innerHTML = `BMI Anda adalah <strong>${bmi.toFixed(2)}</strong>.<br>Kategori: <strong>${category}</strong>.`;
    });

    // 10. Konverter Satuan
    const unitInput=document.getElementById('satuan-input'), unitFrom=document.getElementById('satuan-dari'), unitTo=document.getElementById('satuan-ke'), unitResult=document.getElementById('satuan-result');
    const units={temp:['c','f','k'], length:['m','km','cm'], mass:['kg','g','lb']};
    function updateUnitToOptions() {
        const fromValue = unitFrom.value;
        let category = Object.keys(units).find(key => units[key].includes(fromValue));
        unitTo.innerHTML = '';
        units[category].forEach(unit => {
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = document.querySelector(`#satuan-dari option[value=${unit}]`).textContent;
            unitTo.appendChild(option);
        });
        convertUnits();
    }
    function convertUnits() {
        const val = parseFloat(unitInput.value);
        if (isNaN(val)) { unitResult.innerHTML = ''; return; }
        const from = unitFrom.value, to = unitTo.value;
        let baseValue = val;
        if (from === 'f') baseValue = (val - 32) * 5/9; else if (from === 'k') baseValue = val - 273.15;
        else if (from === 'km') baseValue = val * 1000; else if (from === 'cm') baseValue = val / 100;
        else if (from === 'g') baseValue = val / 1000; else if (from === 'lb') baseValue = val / 2.20462;
        let result = baseValue;
        if (to === 'f') result = (baseValue * 9/5) + 32; else if (to === 'k') result = baseValue + 273.15;
        else if (to === 'km') result = baseValue / 1000; else if (to === 'cm') result = baseValue * 100;
        else if (to === 'g') result = baseValue * 1000; else if (to === 'lb') result = baseValue * 2.20462;
        unitResult.innerHTML = `Hasil: <strong>${result.toFixed(4)}</strong>`;
    }
    unitFrom.addEventListener('change', updateUnitToOptions);
    unitTo.addEventListener('change', convertUnits);
    unitInput.addEventListener('input', convertUnits);
    updateUnitToOptions();
});