import { GCLOUD_BASE_URL } from "./constants";
import { SoundAlias } from "./types";


interface Muted {
    background: boolean;
    all: boolean;
}


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
    muted: Muted;

    constructor() {
        this.muted = {
            background: false,
            all: false
        };
        this.sounds = this.processSounds(SOUNDS, GCLOUD_BASE_URL);
    }

    playSound(soundAlias: SoundAlias) {
        if(this.muted.all) return;
        this.stopSounds();
        if(!this.muted.background) this.resumeBackgroundSound();
        this.sounds.find(sound => sound.id === soundAlias)?.audio.play();
    }

    toggle() {
        this.muted.all = !this.muted.all;
        this.muted.background = false;
        this.muted.all ? this.stopSounds() : this.resumeBackgroundSound();
    }

    toggleMuteBackground() {
        this.muted.background = !this.muted.background;
        this.muted.background 
        ? this.sounds.forEach(sound => {
            if(sound.id === SoundAlias.BACKGROUND) sound.audio.pause();
        })
        :  this.resumeBackgroundSound();
    }

    private processSounds(sounds: PreProcessedSoundData[], baseUrl: string): PostProcessedSoundData[] {
        return sounds.map(sound => ({
            id: sound.id,
            audio: new Audio(`${baseUrl}${sound.name}`)
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