import { SoundAlias } from "../types";


enum SoundAliasToPath {
    BACKGROUND = '/gin-no-saji-soundtrack.mp3',
    BRICK_HIT = '/brick-hit.wav',
    GROUND_HIT = '/small-hit-in-a-game.wav',
    WALL_HIT = '/arcade-mechanical-bling.wav'
};

interface PreProcessedSoundData {
    id: SoundAlias;
    name: SoundAliasToPath;
};

interface PostProcessedSoundData {
    id: SoundAlias;
    audio: HTMLAudioElement;
}

// interface SoundData

const SOUNDS: PreProcessedSoundData[] = Object.values(SoundAlias).map(soundAlias => ({
    id: soundAlias,
    name: SoundAliasToPath[soundAlias]
}));


class SoundManager {
    sounds: PostProcessedSoundData[];
    muted: boolean;

    constructor() {
        this.muted = true;
        this.sounds = this.processSounds(SOUNDS);
    }

    playSound(soundAlias: SoundAlias) {
        if(this.muted) return;
        this.stopSounds();
        this.resumeBackgroundSound();
        this.sounds.find(sound => sound.id === soundAlias)?.audio.play();
    }

    toggle() {
        this.muted = !this.muted;
        this.muted ? this.stopSounds() : this.resumeBackgroundSound();
    }

    private processSounds(sounds: PreProcessedSoundData[]): PostProcessedSoundData[] {
        return sounds.map(sound => ({
            id: sound.id,
            audio: new Audio(sound.name)
        }))
    }

    private resumeBackgroundSound() {
        this.sounds.forEach(sound => {
            if(sound.id === SoundAlias.BACKGROUND) sound.audio.play();
        })
    }

    private stopSounds() {
        this.sounds.forEach(sound => {
            sound.audio.pause();
            if(sound.id !== SoundAlias.BACKGROUND) {
                sound.audio.currentTime = 0;
            } 
        });
    }
}

export default SoundManager;