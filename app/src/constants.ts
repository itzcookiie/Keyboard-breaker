export const GCLOUD_BASE_URL = 'https://storage.googleapis.com/keyboard-breaker-assets';

export const COLORS = {
    AQUA: '#00FFFF',
    ORANGE: '#FFAC1C',
    WHITE: '#FFFFFF',
    EASTERN_BLUE: '#2596BE',
    LOGITECH_BLUE: '#0039a6'
};

export const BOARD_SETTINGS = {
    width: 100,
    height: 10,
    color: COLORS.ORANGE
};

export const BRICK_SETTINGS = {
    width: 50,
    height: 50,
    color: COLORS.WHITE,
    padding: 20,
    gap: 1
};

export const KEY_SETTINGS = {
    width: 40, // Longest text width (probably W?)
    height: 45, // Longest text height (think all the same)
    color: COLORS.LOGITECH_BLUE
};

export const BALL_SETTINGS = {
    radius: 10,
    color: COLORS.WHITE,
    level1: {
        xVelocity: 5.5,
        yVelocity: 5.5
    },
    level2: {
        xVelocity: 5.5,
        yVelocity: 5.5
    },
    level3: {
        xVelocity: 5.5,
        yVelocity: 5.5
    },
};

export const SCORE_SETTINGS = {
    xOffset: 50,
    y: 50,
    color: COLORS.LOGITECH_BLUE
};

export const ARROW_SETTINGS = {
    
};

export const GAME_SETTINGS = {
    lives: 2,
    pointsPerBrick: 100
};