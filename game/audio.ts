

let audioContext: AudioContext | null = null;

const initAudio = () => {
    // Check if running in a browser environment
    if (typeof window === 'undefined') return;
    
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch(e) {
            console.error("Web Audio API is not supported in this browser");
        }
    }
};

export type SoundType = 'JUMP' | 'ENEMY_DEATH' | 'PLAYER_DEATH' | 'WEAPON_PICKUP' | 'POWERUP' | 'POWERDOWN' | 'BOMB_EXPLOSION';
export type MusicType = 'TITLE' | 'CUTSCENE' | 'FIELD' | 'CAVE' | 'CASTLE' | 'BOSS';

let musicInterval: ReturnType<typeof setInterval> | null = null;
let musicGainNode: GainNode | null = null;

export const playMusic = (type: MusicType) => {
    if (!audioContext) {
        initAudio();
        if (!audioContext) return;
    }
    
    stopMusic(); // Stop any existing music

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    musicGainNode = audioContext.createGain();
    musicGainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    musicGainNode.connect(audioContext.destination);

    let notes: number[] = [];
    let noteDuration = 500; // ms
    let oscType: OscillatorType = 'sine';

    switch(type) {
        case 'TITLE':
            // A heroic, uplifting theme in C Major.
            notes = [
                523.25, 392.00, 329.63, 261.63, // C5, G4, E4, C4
                329.63, 261.63, 329.63, 392.00, // E4, C4, E4, G4
                523.25, 392.00, 329.63, 261.63, // C5, G4, E4, C4
                329.63, 392.00, 329.63, 523.25, // E4, G4, E4, C5
            ];
            noteDuration = 200;
            oscType = 'square';
            break;
        case 'CUTSCENE':
            notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
            noteDuration = 400;
            oscType = 'sine';
            break;
        case 'FIELD':
            // C Major Pentatonic - cheerful, open
            notes = [261.63, 329.63, 392.00, 523.25, 587.33, 392.00, 329.63, 523.25]; 
            noteDuration = 350;
            oscType = 'triangle';
            break;
        case 'CAVE':
            // A minor pentatonic - mysterious, sparse
            notes = [220.00, 261.63, 329.63, 220.00, 392.00, 261.63, 329.63, 220.00]; 
            noteDuration = 700;
            oscType = 'sine';
            break;
        case 'CASTLE':
            // A Harmonic Minor - dramatic, formal
            notes = [220.00, 246.94, 261.63, 329.63, 349.23, 261.63, 415.30, 440.00]; // A, B, C, E, F, C, G#, A
            noteDuration = 500;
            oscType = 'square';
            break;
        case 'BOSS':
             // Diminished scale feel - tense
            notes = [261.63, 293.66, 349.23, 261.63, 415.30, 466.16, 349.23, 293.66]; // C, D, F, C, G#, A#, F, D
            noteDuration = 250;
            oscType = 'sawtooth';
            break;
    }

    if (notes.length > 0) {
        let noteIndex = 0;
        musicInterval = setInterval(() => {
            if (!audioContext || !musicGainNode) return;

            const now = audioContext.currentTime;
            const osc = audioContext.createOscillator();
            osc.connect(musicGainNode);
            osc.type = oscType;
            osc.frequency.setValueAtTime(notes[noteIndex], now);
            
            // noteDuration is in ms, osc.stop expects seconds
            osc.start(now);
            osc.stop(now + (noteDuration * 0.9) / 1000);

            noteIndex = (noteIndex + 1) % notes.length;

        }, noteDuration);
    }
};

export const stopMusic = () => {
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
    if (musicGainNode && audioContext) {
        const now = audioContext.currentTime;
        musicGainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        
        // Disconnect after fade out
        const localGainNode = musicGainNode;
        setTimeout(() => {
            localGainNode.disconnect();
        }, 500);
        
        musicGainNode = null;
    }
};


export const playSound = (type: SoundType) => {
    if (!audioContext) {
        initAudio();
        if (!audioContext) return;
    }
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    

    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.15, now);

    switch(type) {
        case 'JUMP':
            oscillator.connect(gainNode);
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(523.25, now); // C5
            oscillator.frequency.linearRampToValueAtTime(783.99, now + 0.1); // G5
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
            oscillator.start(now);
            oscillator.stop(now + 0.15);
            break;
        case 'ENEMY_DEATH':
            oscillator.connect(gainNode);
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;
        case 'PLAYER_DEATH':
            oscillator.connect(gainNode);
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(440, now);
            oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.6);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
            oscillator.start(now);
            oscillator.stop(now + 0.6);
            break;
        case 'WEAPON_PICKUP':
            gainNode.gain.setValueAtTime(0.2, now);
            const freqs = [523.25, 659.25, 783.99, 1046.50];
            freqs.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                osc.connect(gainNode);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + i * 0.1);
                osc.start(now + i * 0.1);
                osc.stop(now + (i + 1) * 0.1);
            });
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
            break;
        case 'POWERUP':
            gainNode.gain.setValueAtTime(0.2, now);
            const powerupFreqs = [440, 587.33, 880, 1174.66];
             powerupFreqs.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                osc.connect(gainNode);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + i * 0.1);
                osc.start(now + i * 0.1);
                osc.stop(now + (i + 1) * 0.1);
            });
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
            break;
        case 'POWERDOWN':
            oscillator.connect(gainNode);
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(523.25, now);
            oscillator.frequency.exponentialRampToValueAtTime(130.81, now + 0.4);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
            oscillator.start(now);
            oscillator.stop(now + 0.4);
            break;
        case 'BOMB_EXPLOSION':
            oscillator.connect(gainNode);
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(160, now);
            oscillator.frequency.exponentialRampToValueAtTime(40, now + 0.5);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
            oscillator.start(now);
            oscillator.stop(now + 0.5);
            break;
    }
};

export const resumeAudioContext = () => {
    if (!audioContext) {
        initAudio();
    }
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
};