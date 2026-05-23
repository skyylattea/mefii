// Sistem & Status Global
let currentMission = 0; // 1: Star Hunt, 2: Survival, 3: Football
let starCount = 0;
let survivalTimer = 24;
let survivalInterval;
let starSpawnInterval;
let playerX = 50; // posisi persentase player astronaut
let isGameOver = false;
let timeLeft = 24; // Waktu dalam detik
let gameTimer;
let collectedStars = 0; // Untuk menghitung jumlah bintang yang diklik

// Fungsi Pemutar Efek Suara
function playSnd(id) {
    const audio = document.getElementById('snd-' + id);
    if (audio) {
        // Reset waktu ke 0 agar suara bisa diputar berulang-ulang dengan cepat
        audio.currentTime = 0;
        
        // Coba mainkan
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Berhasil diputar
            }).catch(error => {
                console.log("Audio diblokir browser: " + error);
            });
        }
    }
}

// Fungsi Perpindahan Layar/Screen
function changeScreen(screenId) {
    document.querySelectorAll('.screen').forEach(scr => scr.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

async function startOpeningSequence() {
    const title = document.getElementById('dynamic-text');
    const sub = document.getElementById('sub-text');
    const btn = document.getElementById('start-btn');

    // Scene 1
    title.innerText = "Incoming Transmission...";
    title.classList.add('typewriter');
    await new Promise(r => setTimeout(r, 2500));
    title.classList.remove('typewriter');
    title.style.borderRight = "none";
    title.innerText = "";

    // Scene 2
    title.innerText = "MISSION: MEFI";
    sub.innerText = "A special birthday protocol has been activated.";
    sub.classList.add('fade-in');
    await new Promise(r => setTimeout(r, 2000));

    // Scene 3
    btn.classList.remove('hidden');
    btn.classList.add('fade-in');
}

function handleStart() {
    // 1. Ambil elemen audio
    const bgm = document.getElementById('snd-hbd');
    
    // 2. Mainkan musik dengan volume yang pas (misal 0.5)
    bgm.volume = 0.5;
    bgm.play().catch(err => console.log("Gagal memutar audio otomatis: ", err));
    
    // 3. Efek visual transisi
    playSnd('click');
    document.body.classList.add('bg-white');
    setTimeout(() => document.body.classList.remove('bg-white'), 100);
    
    // 4. Masuk ke halaman password
    changeScreen('scr-password');
}

function toggleMute() {
    const bgm = document.getElementById('snd-hbd');
    const icon = document.querySelector('#mute-btn i');
    
    if (bgm.muted) {
        bgm.muted = false;
        icon.className = "fa-solid fa-volume-high";
    } else {
        bgm.muted = true;
        icon.className = "fa-solid fa-volume-xmark";
    }
}

// Panggil saat load
window.onload = startOpeningSequence;

// 2. LOGIKA VALIDASI PASSWORD
function checkPassword() {
    const input = document.getElementById('pass-input').value;
    const feedback = document.getElementById('pass-feedback');
    
    // Silakan ganti kata sandi utama di bawah ini ('mefi' atau '24')
    if(input.toLowerCase() === 'riimeister' || input === '24') {
        playSnd('success');
        feedback.className = "font-game text-sm text-emerald-400 uppercase glitch-active";
        feedback.innerText = "ACCESS GRANTED.";
        setTimeout(() => {
            feedback.classList.remove('glitch-active');
            runLoadingScreen();
        }, 1200);
    } else {
        playSnd('fail');
        feedback.className = "font-game text-sm text-rose-500 uppercase";
        feedback.innerText = "ACCESS DENIED.";
        
        // Efek guncang kontainer jika salah
        const container = document.getElementById('screen-container');
        container.classList.add('glitch-active');
        setTimeout(() => container.classList.remove('glitch-active'), 300);
    }
}

// 3. LOGIKA YES / NO DIALOGUE SEQUENCE
let currentQ = 1;
function setupQuestions() {
    changeScreen('scr-questions');
    showQuestion();
}

function showQuestion() {
    const txt = document.getElementById('question-text');
    const noBtn = document.getElementById('btn-no');
    
    
    // Reset properti tombol NO ke posisi awal
    noBtn.style.position = 'static';
    noBtn.style.transform = 'scale(1)';
    noBtn.onmouseover = fleeButton;
    noBtn.onclick = fleeButton;
    
    if(currentQ === 1) {
        txt.innerText = "“Seneng ngga pas buka web ini?”";
        noBtn.innerText = "NO";
    } else if(currentQ === 2) {
        txt.innerText = "Penasaran ngga isinya apa?";
        noBtn.innerText = "NO";
    } else if(currentQ === 3) {
        txt.innerText = "“Mau ngeluangin waktu sebentar buat aku ngga?”";
        noBtn.innerText = "NO";
    }
}

function fleeButton() {
    const noBtn = document.getElementById('btn-no');
    noBtn.style.position = 'absolute';
    noBtn.style.left = Math.random() * (window.innerWidth - 100) + 'px';
    noBtn.style.top = Math.random() * (window.innerHeight - 100) + 'px';
    
    // Tambahkan peluang 10% tombol berhenti lari agar bisa diklik
    if (Math.random() < 0.1) {
        noBtn.onmouseover = null; 
    }
}
function answerQuestion(isYes) {
    playSnd('click');
    if(currentQ === 1 || currentQ === 2) {
        currentQ++;
        showQuestion();
    } else if(currentQ === 3) {
        if(isYes) {
            // Efek kilatan cahaya putih layar singkat
            document.body.classList.add('bg-white');
            setTimeout(() => {
                document.body.classList.remove('bg-white');
                triggerBriefing(1); // Mulai petualangan misi ke-1
            }, 200);
        }
    }
}

// 4. LOGIKA LOADING PROGRESS SIMULATOR
function runLoadingScreen() {
    changeScreen('scr-loading');
    const bar = document.getElementById('load-bar');
    const sub = document.getElementById('load-subtitle');
    const btn = document.getElementById('btn-continue');
    
    const logs = [
        "Target located: MEFI",
        "Authorization complete.",
        "Preparing mission sequence...",
        "Calibrating celebration system...",
        "Entering birthday protocol..."
    ];
    
    let progress = 0;
    let logIdx = 0;
    bar.style.width = '0%';
    btn.classList.add('hidden');

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 2;
        if(progress >= 100) {
            progress = 100;
            clearInterval(interval);
            btn.classList.remove('hidden');
        }
        bar.style.width = progress + '%';
        
        if(progress % 20 === 0 && logIdx < logs.length) {
            sub.innerText = logs[logIdx];
            logIdx++;
        }
    }, 80);
}

function startMissionsSequence() {
    playSnd('click');
    setupQuestions();
}

// 5. SISTEM BRIEFING DAN COUNTDOWN JEDA GAME
function triggerBriefing(missionNum) {
    currentMission = missionNum;

    changeScreen('scr-briefing');
    
    // Tambahkan baris ini agar suara berbunyi saat pop-up muncul
    playSnd('alert'); 
    
    changeScreen('scr-briefing');
    
    const title = document.getElementById('brief-title');
    const desc = document.getElementById('brief-desc');
    const readyBtn = document.getElementById('btn-brief-ready');
    const briefingScreen = document.getElementById('scr-briefing');
    briefingScreen.style.animation = 'none';
    briefingScreen.offsetHeight; /* Trik untuk memicu reflow */
    briefingScreen.style.animation = 'gamePopIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

    // ... (sisa kode tetap sama)
    if(missionNum === 1) {
        title.innerText = "FIRST MISSION: STAR HUNT";
        desc.innerText = "Kumpulkan dan tembak 24 bintang sebelum lenyap. Kecepatan tangan diuji!";
        readyBtn.onclick = () => runCountdown(startStarHunt);
    } else if(missionNum === 2) {
        title.innerText = "SECOND MISSION: SURVIVAL MODE";
        desc.innerText = "Hindari hujan meteor ungu berbahaya! Bertahanlah selama 24 detik penuh.";
        readyBtn.onclick = () => runCountdown(startSurvival);
    } else if(missionNum === 3) {
        title.innerText = "LAST MISSION: FINAL MATCH";
        desc.innerText = "Baca arah gerakan kiper. Cetak gol untuk membuka hadiah!";
        readyBtn.onclick = () => runCountdown(startFootball);
    }
}

function runCountdown(callback) {
    changeScreen('scr-countdown');
    const num = document.getElementById('count-number');
    let count = 3;
    num.innerText = count;
    
    const timer = setInterval(() => {
        count--;
        if(count <= 0) {
            clearInterval(timer);
            callback();
        } else {
            num.innerText = count;
        }
    }, 800);
}

// HASIL AKHIR (MENANG/KALAH) LAYAR OVERLAY
function showOutcome(success, titleText, subText, btnText, actionCallback) {
    changeScreen('scr-outcome');
    const title = document.getElementById('outcome-title');
    const sub = document.getElementById('outcome-subtext');
    const btn = document.getElementById('outcome-btn');

    title.innerText = titleText;
    sub.innerText = subText;
    btn.innerText = btnText;

    if(success) {
        playSnd('success');
        title.className = "font-game text-4xl font-black text-emerald-400 glow-blue";
        btn.className = "font-game px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow-lg transition transform hover:scale-105";
        document.getElementById('screen-container').classList.add('glitch-active');
        setTimeout(() => document.getElementById('screen-container').classList.remove('glitch-active'), 200);
    } else {
        playSnd('fail');
        title.className = "font-game text-4xl font-black text-rose-500";
        btn.className = "font-game px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded shadow-lg transition transform hover:scale-105";
    }

    btn.onclick = () => {
        playSnd('click');
        actionCallback();
    };
}

// ================= MISI 1: STAR HUNT =================
function startStarHunt() {
    changeScreen('scr-starhunt');
    starCount = 0;
    document.getElementById('star-counter').innerText = "0 / 24";
    const arena = document.getElementById('star-arena');
    arena.innerHTML = '';
    
    starSpawnInterval = setInterval(() => {
        if(starCount >= 24) {
            clearInterval(starSpawnInterval);
            showOutcome(true, "MISSION ACCOMPLISHED!", "Target selesai dengan sukses. 24 Bintang berhasil dikumpulkan.", "NEXT MISSION", () => triggerBriefing(2));
            return;
        }
        spawnSingleStar();
    }, 600);
}

function spawnSingleStar() {
    const arena = document.getElementById('star-arena');
    const star = document.createElement('div');
    star.className = "absolute text-amber-300 text-xl cursor-pointer hover:scale-125 transition active:text-white filter drop-shadow-[0_0_5px_rgba(251,191,36,1)]";
    star.innerHTML = '<i class="fa-solid fa-star"></i>';
    
    const x = Math.random() * (arena.clientWidth - 24);
    const y = Math.random() * (arena.clientHeight - 24);
    star.style.left = x + 'px';
    star.style.top = y + 'px';
    
    star.onclick = () => {
        playSnd('click');
        starCount++;
        document.getElementById('star-counter').innerText = `${starCount} / 24`;
        star.remove();
    };
    
    arena.appendChild(star);
    setTimeout(() => { if(star.parentNode) star.remove(); }, 1500);
}

// ================= MISI 2: SURVIVAL MODE =================
function startSurvival() {
    changeScreen('scr-survival');
    survivalTimer = 24;
    isGameOver = false;
    playerX = 50;
    updatePlayerPos();
    
    document.getElementById('surv-timer').innerText = survivalTimer + "s";
    const arena = document.getElementById('surv-arena');
    const pNode = document.getElementById('player');
    arena.innerHTML = '';
    arena.appendChild(pNode);

    // Deteksi Keyboard
    window.onkeydown = (e) => {
        if(isGameOver) return;
        if(e.key === 'ArrowLeft' && playerX > 5) playerX -= 8;
        if(e.key === 'ArrowRight' && playerX < 95) playerX += 8;
        updatePlayerPos();
    };
    
    // Deteksi Layar Sentuh Mobile HP
    document.getElementById('btn-left').onclick = () => { if(playerX > 5) playerX -= 10; updatePlayerPos(); };
    document.getElementById('btn-right').onclick = () => { if(playerX < 95) playerX += 10; updatePlayerPos(); };

    survivalInterval = setInterval(() => {
        survivalTimer--;
        document.getElementById('surv-timer').innerText = survivalTimer + "s";
        if(survivalTimer <= 0) {
            endSurvivalGame(true);
        }
    }, 1000);

    starSpawnInterval = setInterval(() => {
        if(!isGameOver) spawnAsteroid();
    }, 400);
}

function updatePlayerPos() {
    document.getElementById('player').style.left = playerX + '%';
}

function spawnAsteroid() {
    const arena = document.getElementById('surv-arena');
    const ast = document.createElement('div');
    ast.className = "absolute text-slate-400 text-lg";
    ast.innerHTML = '<i class="fa-solid fa-meteor text-purple-500"></i>';
    
    const startX = Math.random() * (arena.clientWidth - 20);
    ast.style.left = startX + 'px';
    ast.style.top = '0px';
    arena.appendChild(ast);

    let currentY = 0;
    const fallSpeed = Math.random() * 3 + 3;

    const fallInterval = setInterval(() => {
        if(isGameOver) {
            clearInterval(fallInterval);
            return;
        }
        currentY += fallSpeed;
        ast.style.top = currentY + 'px';

        const player = document.getElementById('player');
        if(currentY >= (arena.clientHeight - 40) && currentY <= arena.clientHeight) {
            const pLeft = player.offsetLeft;
            const pRight = pLeft + player.clientWidth;
            const astLeft = ast.offsetLeft;

            if(astLeft >= pLeft - 10 && astLeft <= pRight + 10) {
                clearInterval(fallInterval);
                endSurvivalGame(false);
            }
        }

        if(currentY > arena.clientHeight) {
            clearInterval(fallInterval);
            if(ast.parentNode) ast.remove();
        }
    }, 30);
}

function endSurvivalGame(isWin) {
    isGameOver = true;
    clearInterval(survivalInterval);
    clearInterval(starSpawnInterval);
    window.onkeydown = null;

    if(isWin) {
        showOutcome(true, "MISSION ACCOMPLISHED!", "Pilot survived. Reflex Check: Excellent!", "NEXT MISSION", () => triggerBriefing(3));
    } else {
        showOutcome(false, "MISSION FAILED", "Kerusakan kapal ekstrem. Coba kendalikan lebih baik.", "TRY AGAIN?", () => triggerBriefing(2));
    }
}

// ================= MISI 3: FINAL MATCH =================
let keeperDirection = 'center';
let keeperInterval;

function startFootball() {
    changeScreen('scr-football');
    const keeper = document.getElementById('keeper');
    const ball = document.getElementById('ball');
    
    ball.style.bottom = '1.5rem';
    ball.style.left = '50%';
    ball.style.transform = 'translateX(-50%)';
    keeper.style.left = '50%';

    const positions = ['25%', '50%', '75%'];
    const dirNames = ['left', 'center', 'right'];
    let idx = 0;
    
    keeperInterval = setInterval(() => {
        idx = Math.floor(Math.random() * 3);
        keeper.style.left = positions[idx];
        keeperDirection = dirNames[idx];
    }, 200);
}

function shootFootball(playerTargetDir) {
    clearInterval(keeperInterval);
    playSnd('click');
    const ball = document.getElementById('ball');
    
    if(playerTargetDir === 'left') {
        ball.style.left = '25%';
    } else if(playerTargetDir === 'right') {
        ball.style.left = '75%';
    } else {
        ball.style.left = '50%';
    }
    ball.style.bottom = '12rem';

    setTimeout(() => {
        if(playerTargetDir === keeperDirection) {
            showOutcome(false, "SHOT MISSED", "Kiper berhasil menebak strategi tendanganmu dengan tepat.", "TRY AGAIN?", startFootball);
        } else {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            showOutcome(true, "GOOOAL!! MISSION ACCOMPLISHED!", "Sistem terbuka. Hadiah utama telah siap.", "OPEN YOUR GIFT", enterMainLobby);
        }
    }, 500);
}

// ================= 8. LOBBY UTAMA & PENGATURAN TAB HADIAH =================
function enterMainLobby() {
    changeScreen('scr-lobby');
    openTab('tab-cake');
}

function openTab(tabId) {
    playSnd('click');
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = "tab-btn bg-slate-950/60 p-2 rounded-t-lg border-b-2 border-transparent text-slate-400";
    });

    document.getElementById(tabId).classList.remove('hidden');
    
    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabId));
    if(activeBtn) {
        activeBtn.className = "tab-btn bg-slate-800 p-2 rounded-t-lg border-b-2 border-purple-500 font-bold text-white";
    }
}

function blowCandle() {
    const flame = document.getElementById('candle-flame');
    const status = document.getElementById('cake-status');
    
    if(flame && !flame.classList.contains('hidden')) {
        flame.classList.add('hidden');
        status.innerHTML = "<span class='text-emerald-400 font-bold font-game'>Happy Birthday Kak Mefi aka Mas Fahri. 🎉</span>";
        
        playSnd('hbd'); // Mainkan lagu ulang tahun loop
        confetti({ particleCount: 200, spread: 100 }); // Ledakan konfeti meriah
    }
}

function runCredits() {
    document.getElementById('btn-trigger-credits').classList.add('hidden');
    const area = document.getElementById('credits-area');
    area.classList.remove('opacity-0');
    
    setTimeout(() => {
        document.getElementById('the-end-zone').classList.remove('hidden');
    }, 3000);
}

function initHoverSound() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            // Cek apakah suara sudah pernah diinisialisasi
            playSnd('hover'); 
        });
    });
}

// Panggil fungsi ini setelah halaman selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
    initHoverSound();
});

function initTypingSound() {
    const passInput = document.getElementById('pass-input');
    
    if (passInput) {
        passInput.addEventListener('input', () => {
            // Kita panggil fungsi playSnd dengan ID 'typing'
            playSnd('typing');
        });
    }
}

// Panggil fungsi ini saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    initTypingSound();
});

function playBirthdaySong() {
    const hbdSong = document.getElementById('snd-hbd-song');
    const bgm = document.getElementById('snd-hbd'); // Asumsi ini BGM utamamu

    // 1. Matikan BGM utama supaya tidak beradu
    if (bgm) {
        bgm.pause();
    }

    // 2. Putar lagu Happy Birthday
    hbdSong.currentTime = 0;
    hbdSong.play().catch(err => console.log("Gagal putar lagu:", err));

    // 3. (Opsional) Ubah tombol menjadi tombol "Stop" setelah diklik
    const btn = document.getElementById('btn-play-song');
    btn.innerHTML = '<i class="fa-solid fa-stop"></i> STOP';
    btn.onclick = stopBirthdaySong;
}

function stopBirthdaySong() {
    const hbdSong = document.getElementById('snd-hbd-song');
    const bgm = document.getElementById('snd-hbd');
    const btn = document.getElementById('btn-play-song');

    hbdSong.pause();
    hbdSong.currentTime = 0;
    
    // Kembali ke BGM utama
    if (bgm) {
        bgm.play();
    }

    // Kembali ke status tombol play
    btn.innerHTML = '<i class="fa-solid fa-cake-candles"></i> PLAY SONG';
    btn.onclick = playBirthdaySong;
}