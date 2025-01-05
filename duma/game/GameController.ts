class GameController {
    private horseRacing: HorseRacing;
    private isGameRunning: boolean = false;

    constructor() {
        this.horseRacing = new HorseRacing();
    }

    startGame() {
        if (this.isGameRunning) return;
        this.isGameRunning = true;

        const gameInterval = setInterval(() => {
            const winner = this.horseRacing.simulateRound();
            
            if (winner) {
                this.isGameRunning = false;
                clearInterval(gameInterval);
                const prizes = this.horseRacing.calculatePrize(winner);
                this.announceWinner(winner, prizes);
            }
        }, 1000); // 每秒更新一次
    }

    private announceWinner(winner: Character, prizes: Map<string, number>) {
        console.log(`比赛结束！获胜者是: ${winner.name}`);
        prizes.forEach((prize, character) => {
            console.log(`玩家下注 ${character} 获得奖励: ${prize}`);
        });
    }
} 