// APCR - Sintetizador de Música Infantil Tradicional para el Día del Niño en Costa Rica
// Genera timbres cristalinos de marimba y cajita de música con Web Audio API nativo (cero dependencias externas)

export interface SongInfo {
  id: string;
  title: string;
  genre: string;
  notes: Array<[string, number]>; // [Nota, duracion en segundos]
}

const NOTE_FREQS: Record<string, number> = {
  'REST': 0,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50
};

export const CHILDREN_SONGS: SongInfo[] = [
  {
    id: 'caballito',
    title: 'Caballito Nicoyano (Folklore Infantil CR)',
    genre: 'Folklore Tradicional Costarricense',
    notes: [
      ['G4', 0.35], ['G4', 0.35], ['E4', 0.35], ['G4', 0.35],
      ['C5', 0.70], ['B4', 0.35], ['A4', 0.35],
      ['G4', 0.70], ['E4', 0.35], ['F4', 0.35],
      ['G4', 0.70], ['REST', 0.20],
      ['A4', 0.35], ['A4', 0.35], ['F4', 0.35], ['A4', 0.35],
      ['C5', 0.70], ['A4', 0.35], ['F4', 0.35],
      ['G4', 0.70], ['E4', 0.35], ['C4', 0.35],
      ['D4', 0.70], ['C4', 0.70], ['REST', 0.40]
    ]
  },
  {
    id: 'pollitos',
    title: 'Los Pollitos Dicen (Ronda Infantil)',
    genre: 'Canción Clásica Escolar',
    notes: [
      ['C4', 0.35], ['D4', 0.35], ['E4', 0.35], ['F4', 0.35],
      ['G4', 0.70], ['G4', 0.70],
      ['A4', 0.35], ['A4', 0.35], ['A4', 0.35], ['A4', 0.35],
      ['G4', 1.20], ['REST', 0.25],
      ['F4', 0.35], ['F4', 0.35], ['F4', 0.35], ['F4', 0.35],
      ['E4', 0.70], ['E4', 0.70],
      ['D4', 0.35], ['D4', 0.35], ['D4', 0.35], ['D4', 0.35],
      ['C4', 1.20], ['REST', 0.40]
    ]
  },
  {
    id: 'arroz',
    title: 'Arroz con Leche (Cajita Musical)',
    genre: 'Ronda Tradicional de Niños',
    notes: [
      ['C4', 0.40], ['F4', 0.40], ['F4', 0.35], ['F4', 0.35],
      ['A4', 0.40], ['F4', 0.40], ['G4', 0.70], ['G4', 0.70],
      ['A4', 0.40], ['B4', 0.35], ['C5', 0.70], ['A4', 0.40],
      ['F4', 0.70], ['G4', 0.70], ['F4', 1.00], ['REST', 0.40]
    ]
  }
];

class ChildrenMusicPlayer {
  private ctx: AudioContext | null = null;
  private currentSongIdx = 0;
  private isPlayingState = false;
  private masterGain: GainNode | null = null;
  private noteTimeouts: ReturnType<typeof setTimeout>[] = [];
  private onStateChangeListeners: Array<(isPlaying: boolean, song: SongInfo) => void> = [];

  private initAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Toca una nota individual con tímbrica de marimba / celesta de juguete
  private playMarimbaNote(freq: number, duration: number, startTime: number) {
    if (!this.ctx || !this.masterGain || freq <= 0) return;

    // Oscilador 1: Fundamental dulce (Seno)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Oscilador 2: Armónico de marimba/celesta (Triángulo afinado 1 octava arriba)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    // Envolvente de volumen (ataque percusivo 3ms y decaimiento suave)
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.6, startTime + 0.005);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.max(0.2, duration * 1.3));

    const harmonicGain = this.ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.18, startTime);

    osc1.connect(noteGain);
    osc2.connect(harmonicGain);
    harmonicGain.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);

    const stopTime = startTime + duration * 1.5;
    osc1.stop(stopTime);
    osc2.stop(stopTime);
  }

  public play(songIdx = this.currentSongIdx) {
    if (typeof window === 'undefined') return;
    this.stopNotes();

    const ctx = this.initAudioContext();
    if (!ctx) return;

    this.currentSongIdx = (songIdx + CHILDREN_SONGS.length) % CHILDREN_SONGS.length;
    const song = CHILDREN_SONGS[this.currentSongIdx];
    this.isPlayingState = true;
    this.notifyState();

    let accumulatedTime = ctx.currentTime + 0.05;
    let totalDuration = 0;

    for (const [noteName, duration] of song.notes) {
      const freq = NOTE_FREQS[noteName] || 0;
      if (freq > 0) {
        this.playMarimbaNote(freq, duration, accumulatedTime);
      }
      accumulatedTime += duration;
      totalDuration += duration;
    }

    // Bucle automático de reproducción continua
    const loopTimeout = setTimeout(() => {
      if (this.isPlayingState) {
        this.play(this.currentSongIdx);
      }
    }, totalDuration * 1000 + 400);

    this.noteTimeouts.push(loopTimeout);
  }

  public pause() {
    this.stopNotes();
    this.isPlayingState = false;
    this.notifyState();
  }

  public toggle() {
    if (this.isPlayingState) {
      this.pause();
    } else {
      this.play();
    }
  }

  public next() {
    const nextIdx = (this.currentSongIdx + 1) % CHILDREN_SONGS.length;
    this.play(nextIdx);
  }

  public previous() {
    const prevIdx = (this.currentSongIdx - 1 + CHILDREN_SONGS.length) % CHILDREN_SONGS.length;
    this.play(prevIdx);
  }

  private stopNotes() {
    for (const t of this.noteTimeouts) {
      clearTimeout(t);
    }
    this.noteTimeouts = [];
  }

  public isPlaying() {
    return this.isPlayingState;
  }

  public getCurrentSong(): SongInfo {
    return CHILDREN_SONGS[this.currentSongIdx];
  }

  public addListener(listener: (isPlaying: boolean, song: SongInfo) => void) {
    this.onStateChangeListeners.push(listener);
    listener(this.isPlayingState, this.getCurrentSong());
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter(l => l !== listener);
    };
  }

  private notifyState() {
    const song = this.getCurrentSong();
    for (const l of this.onStateChangeListeners) {
      try { l(this.isPlayingState, song); } catch {}
    }
  }
}

export const childrenMusic = new ChildrenMusicPlayer();
