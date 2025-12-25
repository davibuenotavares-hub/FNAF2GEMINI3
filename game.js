// Configurações e Variáveis
let power = 100;
let hour = 0;
let musicBox = 100;
let isMaskOn = false;
let currentCam = 1;
let secondsCounter = 0;

const animatronics = {
    "Toy Freddy": { loc: 1, path: [1, "Corredor", "Escritório"], chance: 0.3 },
    "Toy Bonnie": { loc: 3, path: [3, "Duto Direito", "Escritório"], chance: 0.4 },
    "Toy Chica": { loc: 2, path: [2, "Duto Esquerdo", "Escritório"], chance: 0.4 }
};

// Elementos da UI
const powerTxt = document.getElementById('power');
const hourTxt = document.getElementById('hour');
const musicTxt = document.getElementById('music-box-level');
const camNamesTxt = document.getElementById('detected-names');

// --- SISTEMA DE TEMPO (1 min = 1 hora) ---
setInterval(() => {
    secondsCounter++;
    if (secondsCounter >= 60) {
        hour++;
        secondsCounter = 0;
        hourTxt.innerText = hour;
        if (hour === 6) alert("VOCÊ SOBREVIVEU!");
    }
}, 1000);

// --- GASTO DE ENERGIA E MÚSICA ---
setInterval(() => {
    // Diminui música
    musicBox = Math.max(0, musicBox - 2);
    musicTxt.innerText = musicBox;
    if (musicBox <= 0) gameOver("O Puppet te pegou!");

    // Gasta energia (se usar lanterna gasta mais)
    power = Math.max(0, power - 0.5);
    powerTxt.innerText = Math.floor(power);
    if (power <= 0) gameOver("Sem energia!");
}, 2000);

// --- IA DOS ANIMATRÔNICOS ---
setInterval(() => {
    for (let nome in animatronics) {
        let a = animatronics[nome];
        if (Math.random() < a.chance) {
            // Lógica simples de movimento
            if (a.loc === 1 || a.loc === 2 || a.loc === 3) {
                a.loc = a.path[1];
            } else if (a.loc === a.path[1]) {
                a.loc = "Escritório";
                checkJumpscare(nome);
            }
        }
    }
    updateCameraInfo();
}, 5000);

function checkJumpscare(nome) {
    setTimeout(() => {
        if (!isMaskOn) {
            gameOver("Jumpscare: " + nome);
        } else {
            // Se estiver de máscara, ele volta para a câmera inicial
            animatronics[nome].loc = animatronics[nome].path[0];
        }
    }, 3000);
}

// --- CONTROLES ---
document.getElementById('mask-btn').onclick = () => {
    isMaskOn = !isMaskOn;
    document.getElementById('office').style.filter = isMaskOn ? "brightness(0.5) sepia(1)" : "none";
};

document.getElementById('camera-btn').onclick = () => {
    document.getElementById('camera-feed').classList.remove('hidden');
    updateCameraInfo();
};

document.getElementById('close-cam-btn').onclick = () => {
    document.getElementById('camera-feed').classList.add('hidden');
};

document.getElementById('wind-music-btn').onclick = () => {
    musicBox = Math.min(100, musicBox + 20);
    musicTxt.innerText = musicBox;
};

// Seleção de Câmeras
document.querySelectorAll('.cam-sel').forEach(btn => {
    btn.onclick = () => {
        currentCam = parseInt(btn.dataset.cam);
        document.getElementById('camera-name').innerText = "CAM 0" + currentCam;
        updateCameraInfo();
    };
});

// Detecção de Nomes na Câmera
function updateCameraInfo() {
    let detectados = [];
    for (let nome in animatronics) {
        if (animatronics[nome].loc === currentCam) {
            detectados.push(nome);
        }
    }
    camNamesTxt.innerText = detectados.length > 0 ? detectados.join(", ") : "Nenhum";
}

// Dutos e Corredor (Sua mecânica de clicar e ver quem está lá)
document.getElementById('duct-left').onclick = () => checkArea("Duto Esquerdo");
document.getElementById('duct-right').onclick = () => checkArea("Duto Direito");
document.getElementById('hallway').onclick = () => checkArea("Corredor");

function checkArea(local) {
    let quem = "Vazio";
    for (let nome in animatronics) {
        if (animatronics[nome].loc === local) quem = nome;
    }
    alert(local + ": " + quem);
}

function gameOver(msg) {
    document.getElementById('jumpscare-screen').classList.remove('hidden');
    document.getElementById('jumpscare-screen').innerText = msg;
    setTimeout(() => location.reload(), 3000);
}
