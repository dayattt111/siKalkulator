document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIKA NAVIGASI DASAR ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            // Hapus kelas active dari semua link dan page
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));

            // Tambahkan kelas active ke link yang diklik dan page yang sesuai
            link.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- 1. LOGIKA KALKULATOR STANDAR ---
    const normalDisplay = document.getElementById('normal-display');
    const normalButtons = document.querySelector('#standar .buttons');
    normalButtons.addEventListener('click', e => {
        if (e.target.tagName !== 'BUTTON') return;
        
        const value = e.target.dataset.value;
        const text = e.target.innerText;

        if (value) { // Jika tombol punya data-value (angka atau operator)
            normalDisplay.value += value;
        } else if (text === 'C') {
            normalDisplay.value = '';
        } else if (text === 'DEL') {
            normalDisplay.value = normalDisplay.value.slice(0, -1);
        } else if (text === '=') {
            try {
                normalDisplay.value = eval(normalDisplay.value.replace('x', '*'));
            } catch {
                normalDisplay.value = 'Error';
            }
        }
    });

    // --- 2. LOGIKA KALKULATOR JARINGAN IP ---
    document.getElementById('ip-calculate-btn').addEventListener('click', () => {
        const ipStr = document.getElementById('ip-address').value;
        const cidr = parseInt(document.getElementById('ip-cidr').value);
        const resultDiv = document.getElementById('ip-result');

        if (!ipStr || isNaN(cidr) || cidr < 0 || cidr > 32) {
            resultDiv.innerHTML = "Input tidak valid. Mohon periksa kembali.";
            return;
        }

        const ipParts = ipStr.split('.').map(Number);
        if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
            resultDiv.innerHTML = "Format Alamat IP tidak valid.";
            return;
        }

        const ipInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
        const maskInt = (-1 << (32 - cidr)) >>> 0;
        
        const networkInt = ipInt & maskInt;
        const broadcastInt = networkInt | (~maskInt >>> 0);

        const intToIp = (int) => `${(int>>>24)&255}.${(int>>>16)&255}.${(int>>>8)&255}.${int&255}`;

        const networkAddr = intToIp(networkInt);
        const broadcastAddr = intToIp(broadcastInt);
        const firstHost = intToIp(networkInt + 1);
        const lastHost = intToIp(broadcastInt - 1);
        const numHosts = Math.pow(2, 32 - cidr) - 2;

        resultDiv.innerHTML = `
Alamat Jaringan: <strong>${networkAddr}</strong>
Alamat Broadcast: <strong>${broadcastAddr}</strong>
Rentang Host: <strong>${firstHost} - ${lastHost}</strong>
Jumlah Host: <strong>${numHosts > 0 ? numHosts : 0}</strong>
Subnet Mask: <strong>${intToIp(maskInt)}</strong>
        `;
    });

    // --- 3. LOGIKA KALKULATOR MASSA MOLAR ---
    const atomicMasses = {
        'H': 1.008, 'He': 4.003, 'Li': 6.941, 'Be': 9.012, 'B': 10.811, 'C': 12.011,
        'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180, 'Na': 22.990, 'Mg': 24.305,
        'Al': 26.982, 'Si': 28.086, 'P': 30.974, 'S': 32.065, 'Cl': 35.453, 'Ar': 39.948,
        'K': 39.098, 'Ca': 40.078, 'Sc': 44.956, 'Ti': 47.867, 'V': 50.942, 'Cr': 51.996,
        'Mn': 54.938, 'Fe': 55.845, 'Co': 58.933, 'Ni': 58.693, 'Cu': 63.546, 'Zn': 65.38,
        'Ga': 69.723, 'Ge': 72.63, 'As': 74.922, 'Se': 78.971, 'Br': 79.904, 'Kr': 83.798,
        'Rb': 85.468, 'Sr': 87.62, 'Y': 88.906, 'Zr': 91.224, 'Nb': 92.906, 'Mo': 95.96,
        'Tc': 98, 'Ru': 101.07, 'Rh': 102.906, 'Pd': 106.42, 'Ag': 107.868, 'Cd': 112.411,
        'In': 114.818, 'Sn': 118.71, 'Sb': 121.76, 'Te': 127.6, 'I': 126.904, 'Xe': 131.293
    };
    document.getElementById('kimia-calculate-btn').addEventListener('click', () => {
        const formula = document.getElementById('kimia-formula').value;
        const resultDiv = document.getElementById('kimia-result');
        const regex = /([A-Z][a-z]?)(\d*)/g;
        let match;
        let totalMass = 0;
        let isValid = false;

        while((match = regex.exec(formula)) !== null) {
            isValid = true;
            const element = match[1];
            const count = match[2] ? parseInt(match[2]) : 1;
            if (atomicMasses[element]) {
                totalMass += atomicMasses[element] * count;
            } else {
                resultDiv.innerHTML = `Elemen <strong>${element}</strong> tidak ditemukan.`;
                return;
            }
        }
        
        if (!isValid || formula.trim() === '') {
            resultDiv.innerHTML = 'Format rumus kimia tidak valid.';
        } else {
            resultDiv.innerHTML = `Massa Molar dari <strong>${formula}</strong> adalah <strong>${totalMass.toFixed(3)} g/mol</strong>.`;
        }
    });

    // --- 4. LOGIKA KALKULATOR KALORI (BMR & TDEE) ---
    document.getElementById('kalori-calculate-btn').addEventListener('click', () => {
        const age = parseInt(document.getElementById('kalori-usia').value);
        const gender = document.getElementById('kalori-gender').value;
        const weight = parseFloat(document.getElementById('kalori-berat').value);
        const height = parseFloat(document.getElementById('kalori-tinggi').value);
        const activity = parseFloat(document.getElementById('kalori-aktivitas').value);
        const resultDiv = document.getElementById('kalori-result');

        if (isNaN(age) || isNaN(weight) || isNaN(height)) {
            resultDiv.innerHTML = 'Mohon isi semua field dengan angka yang valid.';
            return;
        }

        let bmr = 0;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else { // female
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        const tdee = bmr * activity;
        resultDiv.innerHTML = `
Kebutuhan Kalori Basal (BMR): <strong>${bmr.toFixed(2)} kalori/hari</strong>
Kebutuhan Kalori Harian (TDEE): <strong>${tdee.toFixed(2)} kalori/hari</strong>
<br><small>BMR adalah kalori yang dibutuhkan tubuh saat istirahat total. TDEE memperhitungkan tingkat aktivitas Anda.</small>
        `;
    });

    // --- 5. LOGIKA KONVERTER BASIS ANGKA ---
    const basisInputs = document.querySelectorAll('#basis-angka input');
    basisInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const sourceBase = parseInt(e.target.dataset.base);
            const value = e.target.value;

            if (value.trim() === '') {
                basisInputs.forEach(i => i.value = '');
                return;
            }

            const decimalValue = parseInt(value, sourceBase);

            if (isNaN(decimalValue)) return; // Abaikan input tidak valid

            basisInputs.forEach(otherInput => {
                const targetBase = parseInt(otherInput.dataset.base);
                if (sourceBase !== targetBase) {
                    otherInput.value = decimalValue.toString(targetBase).toUpperCase();
                }
            });
        });
    });

    // --- 6. LOGIKA KALKULATOR BMI ---
     document.getElementById('bmi-calculate-btn').addEventListener('click', () => {
        const weight = parseFloat(document.getElementById('bmi-berat').value);
        const height = parseFloat(document.getElementById('bmi-tinggi').value);
        const resultDiv = document.getElementById('bmi-result');
        
        if (isNaN(weight) || isNaN(height) || height <= 0) {
            resultDiv.innerHTML = 'Mohon masukkan berat dan tinggi yang valid.';
            return;
        }

        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        let category = '';
        if (bmi < 18.5) category = 'Berat Badan Kurang';
        else if (bmi < 24.9) category = 'Berat Badan Normal';
        else if (bmi < 29.9) category = 'Kelebihan Berat Badan';
        else category = 'Obesitas';

        resultDiv.innerHTML = `BMI Anda adalah <strong>${bmi.toFixed(2)}</strong>.<br>Kategori: <strong>${category}</strong>.`;
     });

    // --- 7. LOGIKA KONVERTER SATUAN ---
    const unitInput = document.getElementById('satuan-input');
    const unitFrom = document.getElementById('satuan-dari');
    const unitTo = document.getElementById('satuan-ke');
    const unitResult = document.getElementById('satuan-result');
    
    const units = {
        temp: ['c', 'f', 'k'],
        length: ['m', 'km', 'cm'],
        mass: ['kg', 'g', 'lb']
    };
    
    function updateUnitToOptions() {
        const fromValue = unitFrom.value;
        let category = '';
        if (units.temp.includes(fromValue)) category = 'temp';
        else if (units.length.includes(fromValue)) category = 'length';
        else if (units.mass.includes(fromValue)) category = 'mass';

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
        if (isNaN(val)) {
            unitResult.innerHTML = '';
            return;
        }
        
        const from = unitFrom.value;
        const to = unitTo.value;
        let result = val;

        // Konversi ke basis (C, m, kg)
        let baseValue = val;
        if (from === 'f') baseValue = (val - 32) * 5/9;
        else if (from === 'k') baseValue = val - 273.15;
        else if (from === 'km') baseValue = val * 1000;
        else if (from === 'cm') baseValue = val / 100;
        else if (from === 'g') baseValue = val / 1000;
        else if (from === 'lb') baseValue = val / 2.20462;
        
        // Konversi dari basis ke target
        if (to === 'f') result = (baseValue * 9/5) + 32;
        else if (to === 'k') result = baseValue + 273.15;
        else if (to === 'c') result = baseValue;
        else if (to === 'km') result = baseValue / 1000;
        else if (to === 'cm') result = baseValue * 100;
        else if (to === 'm') result = baseValue;
        else if (to === 'g') result = baseValue * 1000;
        else if (to === 'lb') result = baseValue * 2.20462;
        else if (to === 'kg') result = baseValue;
        
        unitResult.innerHTML = `Hasil: <strong>${result.toFixed(4)}</strong>`;
    }

    unitFrom.addEventListener('change', updateUnitToOptions);
    unitTo.addEventListener('change', convertUnits);
    unitInput.addEventListener('input', convertUnits);
    
    // Inisialisasi awal
    updateUnitToOptions();
});