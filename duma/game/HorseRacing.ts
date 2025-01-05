interface Character {
    name: string;
    skill: Skill;
    rage: number;
    position: number;
    direction: number;
    odds: number;
}

enum Skill {
    BLOCK = 'block',       // 格挡
    WHIRLWIND = 'whirlwind', // 回旋
    RANDOM = 'random',     // 随机
    THRUST = 'thrust'      // 突刺
}

class HorseRacing {
    private characters: Character[] = [
        { name: '爱德华', skill: Skill.BLOCK, rage: 0, position: 0, direction: 2, odds: 3.5 },
        { name: '贝奥武夫', skill: Skill.WHIRLWIND, rage: 0, position: 0, direction: 2, odds: 4.0 },
        { name: '黑马', skill: Skill.RANDOM, rage: 0, position: 0, direction: 2, odds: 5.0 },
        { name: '理查德', skill: Skill.WHIRLWIND, rage: 0, position: 0, direction: 2, odds: 3.8 },
        { name: '莱奥', skill: Skill.THRUST, rage: 0, position: 0, direction: 2, odds: 4.2 },
        { name: '吉利特', skill: Skill.WHIRLWIND, rage: 0, position: 0, direction: 2, odds: 3.6 },
        { name: '罗兰', skill: Skill.BLOCK, rage: 0, position: 0, direction: 2, odds: 3.7 },
        { name: '席恩', skill: Skill.WHIRLWIND, rage: 0, position: 0, direction: 2, odds: 3.9 }
    ];

    private bets: Map<string, number> = new Map();
    private readonly FINISH_LINE = 100;

    // 下注方法
    placeBet(characterName: string, amount: number): boolean {
        const character = this.characters.find(c => c.name === characterName);
        if (!character) return false;
        this.bets.set(characterName, (this.bets.get(characterName) || 0) + amount);
        return true;
    }

    // 计算技能相克
    private calculateSkillAdvantage(attacker: Character, defender: Character): number {
        const skillMatchups: { [key: string]: string } = {
            [Skill.WHIRLWIND]: Skill.BLOCK,
            [Skill.BLOCK]: Skill.THRUST,
            [Skill.THRUST]: Skill.WHIRLWIND
        };

        if (attacker.skill === Skill.RANDOM) {
            return Math.random() * 2;
        }

        return skillMatchups[attacker.skill] === defender.skill ? 1.5 : 1;
    }

    // 更新怒气值
    private updateRage(character: Character) {
        const directionRageMap = {
            0: 0.50,  // 右方向
            2: 0.55,  // 右2点方向
            12: 0.60, // 右12点方向
            4: 0.45   // 右4点方向
        };
        character.rage += directionRageMap[character.direction] || 0;
    }

    // 模拟一回合比赛
    simulateRound(): Character | null {
        let winner: Character | null = null;

        this.characters.forEach(char => {
            // 更新位置和怒气
            this.updateRage(char);
            let moveDistance = Math.random() * 10 * (1 + char.rage / 100);

            // 计算技能相克加成
            const opponent = this.characters[Math.floor(Math.random() * this.characters.length)];
            moveDistance *= this.calculateSkillAdvantage(char, opponent);

            char.position += moveDistance;

            // 检查是否有角色到达终点
            if (char.position >= this.FINISH_LINE && !winner) {
                winner = char;
            }
        });

        return winner;
    }

    // 计算赢家的奖励
    calculatePrize(winner: Character): Map<string, number> {
        const prizes = new Map<string, number>();
        if (this.bets.has(winner.name)) {
            const betAmount = this.bets.get(winner.name) || 0;
            prizes.set(winner.name, betAmount * winner.odds);
        }
        return prizes;
    }
} 