document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const calculators = document.querySelectorAll('.calculator');
    const display = document.getElementById('normal-display');

    // --- LOGIKA UNTUK NAVIGASI/SWITCH KALKULATOR ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hapus kelas 'active' dari semua tombol dan kalkulator
            navButtons.forEach(btn => btn.classList.remove('active'));
            calculators.forEach(calc => calc.classList.remove('active'));

            // Tambahkan kelas 'active' ke tombol yang diklik
            button.classList.add('active');

            // Tampilkan kalkulator yang sesuai
            const calculatorId = button.dataset.calculator + '-calculator';
            document.getElementById(calculatorId).classList.add('active');
        });
    });

    // --- LOGIKA UNTUK KALKULATOR NORMAL ---
    window.appendValue = function(value) {
        display.value += value;
    }

    window.clearDisplay = function() {
        display.value = '';
    }

    window.deleteLast = function() {
        display.value = display.value.slice(0, -1);
    }

    window.calculateResult = function() {
        try {
            // Menggunakan eval() untuk kesederhanaan. 
            // PERHATIAN: eval() bisa berisiko jika input tidak terkontrol.
            // Untuk kalkulator sederhana ini, risikonya minimal.
            const result = eval(display.value.replace('x', '*'));
            display.value = result;
        } catch (error) {
            display.value = 'Error';
        }
    }
});