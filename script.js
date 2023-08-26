class SoundButton {
    constructor(id, name, soundUrl) {
        this.id = id;
        this.name = name;
        this.soundUrl = soundUrl;
        this.button = this.createButton();
        this.audio = new Audio(this.soundUrl);
        this.setupButtonEvents();
    }

    createButton() {
        const button = document.createElement('button');
        button.classList.add('soundButton');
        button.textContent = this.name;
        button.id = 'music_' + this.id;
        return button;
    }

    setupButtonEvents() {
        this.button.addEventListener('click', () => {
            if (!this.button.classList.contains('active')) {
                this.playSound();
            } else {
                this.pauseSound();
            }
            this.toggleActive();
        });

        this.audio.addEventListener('ended', () => {
            this.toggleActive();
        });
    }

    toggleActive() {
        this.button.classList.toggle('active');
    }

    playSound() {
        this.audio.currentTime = 0; // Reinicia o áudio para o início
        this.audio.play();
    }

    pauseSound() {
        this.audio.pause();
    }
}

class SoundController {
    constructor(soundsData) {
        this.soundsData = soundsData;
        this.soundButtonsContainer = document.getElementById('soundsContent');
        this.soundButtons = [];
        this.init();
    }

    init() {
        this.createSoundButtons();
        this.setupVolumeControl();
    }

    createSoundButtons() {
        this.soundsData.sounds.forEach(sound => {
            const soundButton = new SoundButton(sound.id, sound.name, sound.soundUrl);
            this.soundButtonsContainer.appendChild(soundButton.button);
            this.soundButtons.push(soundButton);
        });
    }

    setupVolumeControl() {
        const volumeControl = document.querySelector('.volume-control');
        const volumeSlider = document.querySelector('.volume-slider');
        const sliderBall = document.querySelector('.slider-ball');

        let isDragging = false;

        volumeSlider.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.updateVolume(e.clientX, volumeControl, volumeSlider, sliderBall);
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                this.updateVolume(e.clientX, volumeControl, volumeSlider, sliderBall);
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        volumeSlider.addEventListener('touchstart', (e) => {
            isDragging = true;
            this.updateVolume(e.touches[0].clientX, volumeControl, volumeSlider, sliderBall);
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                this.updateVolume(e.touches[0].clientX, volumeControl, volumeSlider, sliderBall);
            }
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    updateVolume(x, volumeControl, volumeSlider, sliderBall) {
        const volumeWidth = x - volumeControl.getBoundingClientRect().left;
        const volumePercentage = (volumeWidth / volumeControl.offsetWidth) * 100;

        if (volumePercentage >= 0 && volumePercentage <= 100) {
            volumeSlider.style.width = volumePercentage + '%';
            sliderBall.style.left = volumePercentage + '%';
            const volume = volumePercentage / 100;
            this.adjustPageVolume(volume);
        }
    }

    adjustPageVolume(volume) {
        this.soundButtons.forEach(soundButton => {
            soundButton.audio.volume = volume;
        });
    }
}

const soundsData = {
    "sounds": [
        {
            "id": 1,
            "name": "funeral",
            "soundUrl": "/sound-touch/sounds/funeral.mp3"
        },
        {
            "id": 2,
            "name": "infantil",
            "soundUrl": "/sound-touch/sounds/infantil.mp3"
        },
        {
            "id": 3,
            "name": "floresta",
            "soundUrl": "/sound-touch/sounds/floresta.mp3"
        },
        {
            "id": 4,
            "name": "anjos",
            "soundUrl": "/sound-touch/sounds/anjos.mp3"
        },
        {
            "id":5,
            "name": "fita",
            "soundUrl": "/sound-touch/sounds/fita.mp3"
          }
    ]
};

const soundController = new SoundController(soundsData);

const volumeSlider = document.querySelector('.volume-slider');
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100; // Converte o valor do slider (0-100) para um valor entre 0 e 1
    soundController.adjustPageVolume(volume);
});
