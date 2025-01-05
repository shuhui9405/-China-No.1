class Character {
    constructor(name, skill, direction, odds, avatar) {
        this.name = name;
        this.skill = skill;
        this.rage = 0;
        this.position = 0;
        this.direction = direction;
        this.odds = odds;
        this.avatar = avatar;
        this.element = null;
        this.rageDirection = Math.floor(Math.random() * 4);
        this.startPosition = Math.random() * 30;
        // 如果是黑马，随机选择一个技能
        if (this.skill === 'random') {
            const skills = ['block', 'thrust', 'whirlwind'];
            this.currentSkill = skills[Math.floor(Math.random() * skills.length)];
        }
        this.maxHp = 10;
        this.currentHp = 10;
        // 根据位置设置暴击率
        this.criticalRate = 0; // 将在初始化时设置
    }

    getSkillName() {
        const skillNames = {
            'block': '格挡',
            'thrust': '突刺',
            'whirlwind': '回旋',
            'random': this.getCurrentSkillName()
        };
        return skillNames[this.skill] || this.skill;
    }

    getCurrentSkillName() {
        const skillNames = {
            'block': '格挡',
            'thrust': '突刺',
            'whirlwind': '回旋'
        };
        return skillNames[this.currentSkill] || '随机';
    }

    getSkillImage() {
        if (this.skill === 'random') {
            // 黑马使用当前随机选择的技能图片
            const skillImages = {
                'block': 'gedang.png',
                'thrust': 'tuci.png',
                'whirlwind': 'huixuan.png'
            };
            return skillImages[this.currentSkill];
        }

        const skillImages = {
            'block': 'gedang.png',
            'thrust': 'tuci.png',
            'whirlwind': 'huixuan.png'
        };
        return skillImages[this.skill];
    }

    // 获取当前实际技能
    getCurrentSkill() {
        return this.skill === 'random' ? this.currentSkill : this.skill;
    }

    // 随机更换技能（仅黑马使用）
    randomizeSkill() {
        if (this.skill === 'random') {
            const skills = ['block', 'thrust', 'whirlwind'];
            this.currentSkill = skills[Math.floor(Math.random() * skills.length)];
            // 如果有技能图标元素，更新显示
            if (this.element) {
                const skillIndicator = this.element.querySelector('.skill-indicator');
                if (skillIndicator) {
                    skillIndicator.style.backgroundImage = `url('images/${this.getSkillImage()}')`;
                }
            }
        }
    }

    getRageImage() {
        return `${this.rageDirection + 1}.png`; // 1.png, 2.png, 3.png, 4.png
    }

    createCharacterElement() {
        const charElement = document.createElement('div');
        charElement.className = 'character';
        
        // 添加顶部白线
        const topLine = document.createElement('div');
        topLine.className = 'top-line';
        charElement.appendChild(topLine);
        
        // 添加顶部图案
        const topDecoration = document.createElement('div');
        topDecoration.className = 'top-decoration';
        charElement.appendChild(topDecoration);
        
        // 添加进度条容器
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressContainer.appendChild(progressBar);
        charElement.appendChild(progressContainer);
        
        // 创建头像容器
        const avatarContainer = document.createElement('div');
        avatarContainer.className = 'avatar-container';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'character-avatar';
        avatarDiv.style.backgroundImage = `url('images/avatars/${this.avatar}')`;
        avatarContainer.appendChild(avatarDiv);
        
        // 创建角色信息容器
        const infoDiv = document.createElement('div');
        infoDiv.className = 'character-info';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'character-name';
        nameDiv.textContent = this.name;
        
        // 创建技能和怒气值的容器
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'indicators-container';
        
        // 添加技能指示器
        const skillDiv = document.createElement('div');
        skillDiv.className = 'skill-indicator';
        skillDiv.style.backgroundImage = `url('images/${this.getSkillImage()}')`;
        
        // 添加怒气值指示器
        const rageDiv = document.createElement('div');
        rageDiv.className = 'rage-indicator';
        rageDiv.style.backgroundImage = `url('images/${this.getRageImage()}')`;
        
        // 将技能和怒气值添加到容器中
        indicatorsContainer.appendChild(skillDiv);
        indicatorsContainer.appendChild(rageDiv);
        
        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(indicatorsContainer);
        
        charElement.appendChild(avatarContainer);
        charElement.appendChild(infoDiv);
        
        // 添加血条
        const hpBar = document.createElement('div');
        hpBar.className = 'hp-bar';
        
        const hpFill = document.createElement('div');
        hpFill.className = 'hp-fill';
        
        const hpNumber = document.createElement('div');
        hpNumber.className = 'hp-number';
        hpNumber.textContent = `${this.currentHp}/${this.maxHp}`;
        
        hpBar.appendChild(hpFill);
        hpBar.appendChild(hpNumber);
        charElement.appendChild(hpBar);
        
        return charElement;
    }

    updateProgress(percentage) {
        if (this.element) {
            const progressBar = this.element.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.height = `${percentage}%`;
            }
        }
    }

    // 添加更新血量的方法
    updateHp(newHp) {
        this.currentHp = Math.max(0, Math.min(newHp, this.maxHp));
        if (this.element) {
            const hpFill = this.element.querySelector('.hp-fill');
            const hpNumber = this.element.querySelector('.hp-number');
            if (hpFill) {
                const percentage = (this.currentHp / this.maxHp) * 100;
                hpFill.style.width = `${percentage}%`;
            }
            if (hpNumber) {
                hpNumber.textContent = `${this.currentHp}/${this.maxHp}`;
            }
        }
    }

    // 添加攻击方法
    attack(target) {
        // 基础伤害
        let damage = 2;
        let isCritical = false;
        
        // 检查暴击
        if (Math.random() < this.criticalRate) {
            damage = 4;
            isCritical = true;
            this.showCriticalEffect(); // 显示暴击效果
            console.log(`${this.name} 触发暴击！`);
        }

        target.takeDamage(damage);
        return { damage, isCritical }; // 返回攻击结果
    }

    showCriticalEffect() {
        if (this.element) {
            // 创建暴击特效元素
            const criticalEffect = document.createElement('div');
            criticalEffect.className = 'critical-effect';
            criticalEffect.textContent = '暴击！';
            this.element.appendChild(criticalEffect);

            // 动画结束后移除特效
            setTimeout(() => {
                criticalEffect.remove();
            }, 1000);
        }
    }

    takeDamage(damage) {
        this.updateHp(this.currentHp - damage);
    }

    isDead() {
        return this.currentHp <= 0;
    }
}

class HorseRacing {
    // 获取随机赔率增量
    getRandomOddsIncrement(increments) {
        // 生成一个0-100的随机数
        const rand = Math.random() * 100;
        
        // 根据概率分配返回值
        if (rand < 85) {
            // 85%的概率返回0-4
            return increments.slice(0, 5)[Math.floor(Math.random() * 5)];
        } else if (rand < 93) {
            // 8%的概率返回5-6
            return increments.slice(5, 7)[Math.floor(Math.random() * 2)];
        } else if (rand < 98) {
            // 5%的概率返回7-8
            return increments.slice(7, 9)[Math.floor(Math.random() * 2)];
        } else {
            // 2%的概率返回8.4
            return increments[9];
        }
    }

    constructor() {
        // 定义可能的赔率增量
        const oddsIncrements = [0, 1, 2, 3, 4, 5, 6, 7, 8, 8.4];
        
        // 创建角色时随机分配赔率增量
        this.characters = [
            new Character('爱德华', 'block', 0, 1.5 + this.getRandomOddsIncrement(oddsIncrements), 'edward.png'),
            new Character('贝奥武夫', 'whirlwind', 2, 1.5 + this.getRandomOddsIncrement(oddsIncrements), 'beowulf.png'),
            new Character('黑马', 'random', 12, 1.5 + this.getRandomOddsIncrement(oddsIncrements), 'blackhorse.png'),
            new Character('理查德', 'whirlwind', 4, 1.5 + this.getRandomOddsIncrement(oddsIncrements), 'richard.png'),
            new Character('莱奥', 'thrust', 0, 1.5 + this.getRandomOddsIncrement(oddsIncrements), 'leo.png'),
            new Character('吉利特', 'whirlwind', 2, 1.5 + this.getRandomOddsIncrement(oddsIncrements), 'gillette.png'),
            new Character('罗兰', 'block', 12, 1.5 + this.getRandomOddsIncrement(oddsIncrements), 'roland.png'),
            new Character('席恩', 'whirlwind', 4, 1.5 + this.getRandomOddsIncrement(oddsIncrements), 'shien.png')
        ];
        this.totalBet = 0;
        this.bets = new Map();
        this.FINISH_LINE = 100;
        this.characterElements = [];
        this.isGameRunning = false;
        this.shouldShuffle = false;
        this.winners = [];
        this.currentRound = 1;
        this.playerCoins = 20000;
        this.betHistory = [];
        this.battleRecords = []; // 添加战斗记录数组
        
        // 初始化UI和主题选择器
        this.initializeUI();
        this.initializeThemeSelector();
        this.initializeInfoPanel();
        this.initializeRulesPanel();

        // 初始化音效
        this.victorySound = new Audio('./sounds/Various.mp3');
        this.victorySound.volume = 10;
        
        // 预加载音频并添加错误处理
        this.victorySound.addEventListener('error', (e) => {
            console.error("音频加载错误:", {
                error: e.error,
                currentSrc: this.victorySound.currentSrc,
                networkState: this.victorySound.networkState
            });
        });

        // 尝试加载音频
        this.victorySound.load();
        
        // 添加音频加载状态检查
        this.victorySound.addEventListener('canplaythrough', () => {
            console.log("音频加载完成，可以播放");
        });
        
        this.victorySound.addEventListener('error', (e) => {
            console.log("音频加载失败:", e);
        });
    }

    initializeUI() {
        const charactersContainer = document.getElementById('characters-container');
        const charactersList = document.querySelector('.characters-list');
        
        charactersContainer.innerHTML = '';
        charactersList.innerHTML = '';
        
        // 定义8个固定位置
        const positions = [
            { left: '5%' },    // 1号位
            { left: '17%' },   // 2号位
            { left: '29%' },   // 3号位
            { left: '41%' },   // 4号位
            { left: '53%' },   // 5号位
            { left: '65%' },   // 6号位
            { left: '77%' },   // 7号位
            { left: '89%' }    // 8号位
        ];

        // 创建赛道容器
        const raceLanes = document.createElement('div');
        raceLanes.className = 'race-lanes';

        // 创建所有赛道和角色
        this.characters.forEach((char, index) => {
            const raceLane = document.createElement('div');
            raceLane.className = 'race-lane';
            Object.assign(raceLane.style, positions[index]);
            
            const charElement = char.createCharacterElement();
            raceLane.appendChild(charElement);
            raceLanes.appendChild(raceLane);
            char.element = charElement;
            
            // 存储角色元素引用
            this.characterElements[index] = {
                character: char,
                lane: raceLane,
                element: charElement
            };

            // 创建下注面板中的角色卡片
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <img src="images/avatars/${char.avatar}" alt="${char.name}">
                <div class="name">${char.name}</div>
                <div class="skill">${char.getSkillName()}</div>
                <div class="odds">赔率: ${char.odds}</div>
                <input type="number" class="bet-input" min="100" step="100" placeholder="下注">
            `;
            
            const betInput = card.querySelector('.bet-input');
            betInput.addEventListener('change', (e) => {
                const amount = parseInt(e.target.value) || 0;
                this.updateBet(char.name, amount);
            });
            
            charactersList.appendChild(card);
        });

        // 将赛道容器添加到主容器
        charactersContainer.appendChild(raceLanes);

        // 显示总下注金额
        const totalBetDiv = document.createElement('div');
        totalBetDiv.className = 'total-bet';
        totalBetDiv.textContent = `总下注: ${this.totalBet} 个金币`;
        document.querySelector('.betting-panel').insertBefore(totalBetDiv, charactersList);

        document.getElementById('start-game-btn').addEventListener('click', () => this.startGame());

        // 修改随机位置变换的逻辑
        setInterval(() => {
            if (this.shouldShuffle) {
                // 随机打乱角色顺序
                const shuffledIndices = Array.from({length: 8}, (_, i) => i)
                    .sort(() => Math.random() - 0.5);
                
                // 保存当前的角色元素
                const tempElements = [...this.characterElements];
                
                // 根据打乱的顺序重新分配角色到赛道
                shuffledIndices.forEach((newIndex, currentIndex) => {
                    const currentLane = this.characterElements[currentIndex].lane;
                    const characterToMove = tempElements[newIndex];
                    
                    // 移动角色到新位置
                    currentLane.innerHTML = '';
                    currentLane.appendChild(characterToMove.element);
                    
                    // 更新引用
                    this.characterElements[currentIndex] = {
                        ...characterToMove,
                        lane: currentLane
                    };
                });
                
                this.shouldShuffle = false; // 重置标记
            }
        }, 1000); // 检查间隔改为1秒

        // 添加刷新按钮
        const refreshButton = document.createElement('button');
        refreshButton.id = 'refresh-btn';
        refreshButton.className = 'refresh-button';
        refreshButton.innerHTML = '刷新对阵 <span class="refresh-icon">🔄</span>';
        refreshButton.addEventListener('click', () => this.refreshGame());
        
        // 将刷新按钮添加到下注面板中
        const bettingPanel = document.querySelector('.betting-panel');
        const controlsDiv = document.querySelector('.betting-controls');
        controlsDiv.appendChild(refreshButton);
    }

    updateBet(characterName, amount) {
        if (amount > this.playerCoins) {
            alert('金币不足！');
            return;
        }

        const oldBet = this.bets.get(characterName) || 0;
        this.totalBet = this.totalBet - oldBet + amount;
        this.bets.set(characterName, amount);
        
        // 更新玩家金币
        this.playerCoins -= (amount - oldBet);
        this.updateCoinsDisplay();
        
        // 更新总下注显示
        const totalBetDiv = document.querySelector('.total-bet');
        if (totalBetDiv) {
            totalBetDiv.textContent = `总下注: ${this.totalBet} 个金币`;
        }
    }

    updateCoinsDisplay() {
        const coinsDiv = document.querySelector('.player-coins');
        if (coinsDiv) {
            coinsDiv.textContent = `金币: ${this.playerCoins}`;
        }
    }

    addBetRecord(character, amount, isWin, prize = 0) {
        const record = document.createElement('div');
        record.className = `bet-record ${isWin ? 'win' : 'lose'}`;
        record.textContent = isWin 
            ? `赢: ${character} 下注${amount} 获得${prize}`
            : `输: ${character} 下注${amount}`;
        
        const historyDiv = document.querySelector('.bet-history');
        if (historyDiv) {
            historyDiv.insertBefore(record, historyDiv.firstChild);
        }
    }

    startGame() {
        this.isGameRunning = true;
        if (this.totalBet === 0) {
            alert('请先下注！');
            return;
        }

        this.currentRound = 1;
        this.winners = [];
        
        // 设置每个位置的暴击率
        const criticalRates = [0.10, 0.09, 0.08, 0.05, 0.10, 0.09, 0.08, 0.05];
        this.characters.forEach((char, index) => {
            char.criticalRate = criticalRates[index];
            char.updateHp(char.maxHp); // 重置血量
            if (char.element) {
                char.element.style.bottom = '0px'; // 重置位置
            }
        });

        document.getElementById('start-game-btn').disabled = true;
        const inputs = document.querySelectorAll('.bet-input');
        inputs.forEach(input => input.disabled = true);

        this.startFirstRound();
    }

    startFirstRound() {
        console.log("第一轮比赛开始！");
        const matchups = [
            [0, 1], // 1号位对阵2号位
            [2, 3], // 3号位对阵4号位
            [4, 5], // 5号位对阵6号位
            [6, 7]  // 7号位对阵8号位
        ];

        let roundCount = 0;
        const battleInterval = setInterval(() => {
            roundCount++;
            console.log(`第 ${roundCount} 回合`);

            matchups.forEach(([index1, index2]) => {
                const char1 = this.characters[index1];
                const char2 = this.characters[index2];

                if (!char1.isDead() && !char2.isDead()) {
                    const result1 = char1.attack(char2);
                    const result2 = char2.attack(char1);
                    
                    // 记录战斗结果
                    this.addBattleRecord(char1, char2, result1.damage, result1.isCritical);
                    this.addBattleRecord(char2, char1, result2.damage, result2.isCritical);
                }
            });

            let battleEnded = matchups.every(([index1, index2]) => {
                return this.characters[index1].isDead() || this.characters[index2].isDead();
            });

            if (battleEnded) {
                clearInterval(battleInterval);
                this.processFirstRoundResults(matchups);
            }
        }, 1000);
    }

    processFirstRoundResults(matchups) {
        let resultText = "<div class='round-result'><h3>第一轮比赛结果</h3>";
        this.winners = [];
        const losers = [];

        matchups.forEach(([index1, index2]) => {
            const char1 = this.characters[index1];
            const char2 = this.characters[index2];
            
            const winner = !char1.isDead() ? char1 : char2;
            const loser = !char1.isDead() ? char2 : char1;
            
            this.winners.push(winner);
            losers.push(loser);
            
            resultText += `<p>${char1.name} VS ${char2.name} => 胜者: ${winner.name}</p>`;

            // 移动胜利者
            if (winner.element) {
                winner.element.style.transition = 'all 0.5s ease';
                winner.element.style.bottom = '200px';
            }

            // 保持失败者在原位，但设置透明度
            if (loser.element) {
                loser.element.style.transition = 'all 0.5s ease';
                loser.element.style.opacity = '0.5';
            }
        });

        resultText += "</div>";
        const resultDiv = document.getElementById('game-result');
        resultDiv.innerHTML = resultText; // 第一轮结果

        // 重置胜利者血量并开始第二轮
        setTimeout(() => {
            this.winners.forEach(winner => {
                winner.updateHp(winner.maxHp);
            });
            this.startSecondRound();
        }, 1500);
    }

    startSecondRound() {
        console.log("第二轮比赛开始！");
        this.currentRound = 2;

        // 第二轮的对阵
        const matchups = [
            [0, 1], // 第一轮的1号胜者对阵2号胜者
            [2, 3]  // 第一轮的3号胜者对阵4号胜者
        ];

        let roundCount = 0;
        const battleInterval = setInterval(() => {
            roundCount++;
            console.log(`第二轮 - 第 ${roundCount} 回合`);

            matchups.forEach(([index1, index2]) => {
                const char1 = this.winners[index1];
                const char2 = this.winners[index2];

                if (!char1.isDead() && !char2.isDead()) {
                    char1.attack(char2);
                    char2.attack(char1);
                }
            });

            let battleEnded = matchups.every(([index1, index2]) => {
                return this.winners[index1].isDead() || this.winners[index2].isDead();
            });

            if (battleEnded) {
                clearInterval(battleInterval);
                this.processSecondRoundResults(matchups);
            }
        }, 1000);
    }

    processSecondRoundResults(matchups) {
        let resultText = "<div class='round-result'><h3>第二轮比赛结果</h3>";
        const secondRoundWinners = [];
        const secondRoundLosers = [];

        matchups.forEach(([index1, index2]) => {
            const char1 = this.winners[index1];
            const char2 = this.winners[index2];
            
            const winner = !char1.isDead() ? char1 : char2;
            const loser = !char1.isDead() ? char2 : char1;
            
            secondRoundWinners.push(winner);
            secondRoundLosers.push(loser);
            
            resultText += `<p>${char1.name} VS ${char2.name} => 胜者: ${winner.name}</p>`;

            if (winner.element) {
                winner.element.style.transition = 'all 0.5s ease';
                winner.element.style.bottom = '400px';
            }

            if (loser.element) {
                loser.element.style.opacity = '0.3';
            }
        });

        resultText += "</div>";
        const resultDiv = document.getElementById('game-result');
        const firstRoundResult = resultDiv.innerHTML;
        resultDiv.innerHTML = firstRoundResult + resultText; // 保留第一轮结果，添加第二轮结果

        // 更新胜利者数组
        this.winners = secondRoundWinners;

        setTimeout(() => {
            this.winners.forEach(winner => {
                winner.updateHp(winner.maxHp);
            });
            this.startThirdRound();
        }, 1500);
    }

    startThirdRound() {
        console.log("第三轮比赛开始！");
        this.currentRound = 3;

        // 第三轮的对阵（最后两名胜者）
        const matchups = [[0, 1]];

        let roundCount = 0;
        const battleInterval = setInterval(() => {
            roundCount++;
            console.log(`第三轮 - 第 ${roundCount} 回合`);

            const char1 = this.winners[0];
            const char2 = this.winners[1];

            if (!char1.isDead() && !char2.isDead()) {
                char1.attack(char2);
                char2.attack(char1);
            }

            if (char1.isDead() || char2.isDead()) {
                clearInterval(battleInterval);
                this.processThirdRoundResults(char1, char2);
            }
        }, 1000);
    }

    processThirdRoundResults(char1, char2) {
        const champion = !char1.isDead() ? char1 : char2;
        const loser = !char1.isDead() ? char2 : char1;
        
        // 使用新的播放方法
        this.playVictorySound();

        let resultText = "<div class='round-result'><h3>冠军诞生！</h3>";
        resultText += `<p>${char1.name} VS ${char2.name} => 冠军: ${champion.name}</p></div>`;

        const resultDiv = document.getElementById('game-result');
        const previousResults = resultDiv.innerHTML;
        resultDiv.innerHTML = previousResults + resultText;

        // 处理失败者
        if (loser.element) {
            loser.element.style.opacity = '0.2';
        }

        // 添加冠军头衔和移动到中央
        if (champion.element) {
            const crownDiv = document.createElement('div');
            crownDiv.className = 'crown';
            crownDiv.innerHTML = '👑';
            champion.element.insertBefore(crownDiv, champion.element.firstChild);

            // 移动到中央并上升600px
            champion.element.style.transition = 'all 0.5s ease';
            champion.element.style.bottom = '600px'; // 改为600px
            champion.element.style.left = '50%';
            champion.element.style.transform = 'translateX(-50%)';
            champion.element.style.opacity = '1';
            champion.element.style.zIndex = '100'; // 确保冠军显示在最上层
            
            // 调整父元素位置到中央
            champion.element.parentElement.style.left = '50%';
            champion.element.parentElement.style.transform = 'translateX(-50%)';
            champion.element.parentElement.style.width = '120px';
        }

        // 结算下注
        this.bets.forEach((amount, characterName) => {
            if (characterName === champion.name) {
                const prize = Math.floor(amount * champion.odds);
                this.playerCoins += prize;
                this.addBetRecord(characterName, amount, true, prize);
            } else {
                this.addBetRecord(characterName, amount, false);
            }
        });

        this.updateCoinsDisplay();

        // 开始倒计时
        this.startNextGameCountdown();
    }

    startNextGameCountdown() {
        let timeLeft = 15;
        const countdownDiv = document.createElement('div');
        countdownDiv.className = 'countdown';
        countdownDiv.style.textAlign = 'center';
        countdownDiv.style.fontSize = '24px';
        countdownDiv.style.marginTop = '20px';
        document.getElementById('game-result').appendChild(countdownDiv);

        const countdownInterval = setInterval(() => {
            countdownDiv.textContent = `下一轮比赛将在 ${timeLeft} 秒后开始`;
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(countdownInterval);
                this.resetGame(false); // 传入 false 表示不清除记录
            }
        }, 1000);
    }

    resetGame(clearRecords = true) {
        // 保存当前的记录
        const resultDiv = document.getElementById('game-result');
        const oldResultHtml = resultDiv.innerHTML;
        const betHistoryDiv = document.querySelector('.bet-history');
        const battleRecordsDiv = document.querySelector('.battle-records');
        const oldBetHistory = betHistoryDiv ? betHistoryDiv.innerHTML : '';
        const oldBattleRecords = battleRecordsDiv ? battleRecordsDiv.innerHTML : '';

        // 定义固定位置
        const positions = [
            { left: '5%' },    // 1号位
            { left: '17%' },   // 2号位
            { left: '29%' },   // 3号位
            { left: '41%' },   // 4号位
            { left: '53%' },   // 5号位
            { left: '65%' },   // 6号位
            { left: '77%' },   // 7号位
            { left: '89%' }    // 8号位
        ];

        // 随机打乱角色顺序
        const shuffledIndices = Array.from({length: 8}, (_, i) => i)
            .sort(() => Math.random() - 0.5);
        
        // 创建新的角色数组和元素数组，按照打乱后的顺序
        const shuffledCharacters = shuffledIndices.map(i => this.characters[i]);
        const shuffledElements = shuffledIndices.map(i => this.characterElements[i]);
        
        // 更新主数组
        this.characters = shuffledCharacters;
        this.characterElements = shuffledElements;

        // 重置所有角色状态
        this.characters.forEach((char, index) => {
            // 重置血量和怒气值
            char.updateHp(char.maxHp);
            char.rageDirection = Math.floor(Math.random() * 4);
            
            if (char.element) {
                // 移除冠军头衔
                const crown = char.element.querySelector('.crown');
                if (crown) {
                    crown.remove();
                }
                
                // 重置角色样式
                char.element.style.transition = 'all 0.5s ease';
                char.element.style.bottom = '0px';
                char.element.style.left = '';
                char.element.style.transform = '';
                char.element.style.opacity = '1';
                char.element.style.zIndex = '1';

                // 更新怒气值显示
                const rageIndicator = char.element.querySelector('.rage-indicator');
                if (rageIndicator) {
                    rageIndicator.style.backgroundImage = `url('images/${char.getRageImage()}')`;
                }

                // 重置赛道位置
                const raceLane = this.characterElements[index].lane;
                Object.assign(raceLane.style, positions[index]);
                raceLane.style.transform = '';
                raceLane.style.width = '100px';

                // 将角色放到新位置
                raceLane.innerHTML = '';
                raceLane.appendChild(char.element);

                // 更新引用
                this.characterElements[index] = {
                    character: char,
                    lane: raceLane,
                    element: char.element
                };
            }
        });

        // 重新生成下注面板，使用相同的打乱顺序
        const charactersList = document.querySelector('.characters-list');
        charactersList.innerHTML = '';
        
        // 使用打乱后的顺序创建下注卡片
        this.characters.forEach((char, index) => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <img src="images/avatars/${char.avatar}" alt="${char.name}">
                <div class="name">${char.name}</div>
                <div class="skill">${char.getSkillName()}</div>
                <div class="odds">赔率: ${char.odds.toFixed(1)}</div>
                <input type="number" class="bet-input" min="100" step="100" placeholder="下注">
            `;
            
            const betInput = card.querySelector('.bet-input');
            betInput.addEventListener('change', (e) => {
                const amount = parseInt(e.target.value) || 0;
                this.updateBet(char.name, amount);
            });
            
            charactersList.appendChild(card);
        });

        // 重置下注金额
        this.totalBet = 0;
        this.bets.clear();
        document.querySelector('.total-bet').textContent = `总下注: ${this.totalBet} 个金币`;

        // 重新随机分配赔率
        const oddsIncrements = [0, 1, 2, 3, 4, 5, 6, 7, 8, 8.4];
        this.characters.forEach(char => {
            char.odds = 1.5 + this.getRandomOddsIncrement(oddsIncrements);
        });

        // 更新下注面板中的赔率显示
        const cards = document.querySelectorAll('.character-card');
        cards.forEach((card, index) => {
            const oddsDiv = card.querySelector('.odds');
            if (oddsDiv) {
                oddsDiv.textContent = `赔率: ${this.characters[index].odds.toFixed(1)}`;
            }
        });

        // 添加分隔线
        if (!clearRecords) {
            resultDiv.innerHTML += '<div class="game-separator"></div>';
        }

        // 启用下注功能
        document.getElementById('start-game-btn').disabled = false;
        const inputs = document.querySelectorAll('.bet-input');
        inputs.forEach(input => {
            input.disabled = false;
            input.value = '';
        });

        // 只在需要时清除记录
        if (clearRecords) {
            resultDiv.innerHTML = '';
            if (betHistoryDiv) {
                betHistoryDiv.innerHTML = '<h3>下注记录</h3>';
            }
            if (battleRecordsDiv) {
                battleRecordsDiv.innerHTML = '<h3>战斗记录</h3>';
            }
        } else {
            // 恢复所有记录
            resultDiv.innerHTML = oldResultHtml;
            if (betHistoryDiv) {
                betHistoryDiv.innerHTML = oldBetHistory;
            }
            if (battleRecordsDiv) {
                battleRecordsDiv.innerHTML = oldBattleRecords;
            }
        }
    }

    initializeThemeSelector() {
        const themeSelector = document.createElement('div');
        themeSelector.className = 'theme-selector';
        themeSelector.innerHTML = `
            <label>选择背景色：</label>
            <select id="theme-select">
                <option value="white">白色主题</option>
                <option value="pink">粉色主题</option>
                <option value="green">绿色主题</option>
                <option value="blue">浅蓝色主题</option>
            </select>
        `;

        const gameContainer = document.querySelector('.game-container');
        gameContainer.insertBefore(themeSelector, gameContainer.firstChild);

        document.getElementById('theme-select').addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });
    }

    changeTheme(theme) {
        const root = document.documentElement;
        const themes = {
            white: {
                '--bg-primary': 'var(--bg-white-primary)',
                '--bg-secondary': 'var(--bg-white-secondary)',
                '--bg-card': 'var(--bg-white-card)',
                '--bg-lane': 'var(--bg-white-lane)',
                '--border-color': 'rgba(0, 0, 0, 0.2)',
                '--text-color': '#333',
                '--accent-color': '#666'
            },
            pink: {
                '--bg-primary': 'var(--bg-pink-primary)',
                '--bg-secondary': 'var(--bg-pink-secondary)',
                '--bg-card': 'var(--bg-pink-card)',
                '--bg-lane': 'var(--bg-pink-lane)',
                '--border-color': 'rgba(255, 182, 193, 0.4)',
                '--text-color': '#d63384',
                '--accent-color': '#e83e8c'
            },
            green: {
                '--bg-primary': 'var(--bg-green-primary)',
                '--bg-secondary': 'var(--bg-green-secondary)',
                '--bg-card': 'var(--bg-green-card)',
                '--bg-lane': 'var(--bg-green-lane)',
                '--border-color': 'rgba(144, 238, 144, 0.4)',
                '--text-color': '#198754',
                '--accent-color': '#20c997'
            },
            blue: {
                '--bg-primary': 'var(--bg-blue-primary)',
                '--bg-secondary': 'var(--bg-blue-secondary)',
                '--bg-card': 'var(--bg-blue-card)',
                '--bg-lane': 'var(--bg-blue-lane)',
                '--border-color': 'rgba(173, 216, 230, 0.4)',
                '--text-color': '#0dcaf0',
                '--accent-color': '#0d6efd'
            }
        };

        const selectedTheme = themes[theme];
        for (const [property, value] of Object.entries(selectedTheme)) {
            root.style.setProperty(property, value);
        }
    }

    initializeInfoPanel() {
        const infoPanel = document.createElement('div');
        infoPanel.className = 'game-info-panel';
        
        // 显示金币
        const coinsDiv = document.createElement('div');
        coinsDiv.className = 'player-coins';
        
        coinsDiv.textContent = `💰金币: ${this.playerCoins}`;
        infoPanel.appendChild(coinsDiv);

        // 下注历史记录
        const historyDiv = document.createElement('div');
        historyDiv.className = 'bet-history';
        historyDiv.innerHTML = '<h3>下注记录</h3>';
        infoPanel.appendChild(historyDiv);

        // 添加战斗记录区域
        const battleRecordsDiv = document.createElement('div');
        battleRecordsDiv.className = 'battle-records';
        battleRecordsDiv.innerHTML = '<h3>战斗记录</h3>';
        infoPanel.appendChild(battleRecordsDiv);

        document.body.appendChild(infoPanel);
    }

    initializeRulesPanel() {
        const rulesPanel = document.createElement('div');
        rulesPanel.className = 'rules-panel';
        rulesPanel.innerHTML = `
            <h3>比赛规则</h3>
            <p>1. 第一轮：8位选手两两对战，产生4位胜者</p>
            <p>2. 第二轮：4位胜者两两对战，产生2位胜者</p>
            <p>3. 第三轮：2位胜者决战，产生最终冠军</p>
            <p>4. 每回合伤害：基础2点，暴击4点</p>
            <p>5. 暴击率：</p>
            <p>　- 怒气值(暴击率）<img src="images/3.png" alt="3号位" style="width: 20px; height: 20px;">：10%</p>
            <p>　- 怒气值(暴击率）<img src="images/2.png" alt="2号位" style="width: 20px; height: 20px;">：9%</p>
            <p>　- 怒气值(暴击率）<img src="images/1.png" alt="1号位" style="width: 20px; height: 20px;">：8%</p>
            <p>　- 怒气值(暴击率）<img src="images/4.png" alt="4号位" style="width: 20px; height: 20px;">：5%</p>
            <p>6. 初始HP：10点</p>
            <p>7. 技能克制：</p>
            <p>　- <img src="images/gedang.png" alt="格挡" style="width: 30px; height: 30px;">克<img src="images/tuci.png" alt="突刺" style="width: 30px; height: 30px;"></p>
            <p>　- <img src="images/tuci.png" alt="突刺" style="width: 30px; height: 30px;">克<img src="images/huixuan.png" alt="回旋" style="width: 30px; height: 30px;"></p>
            <p>　-  <img src="images/huixuan.png" alt="回旋" style="width: 30px; height: 30px;">克<img src="images/gedang.png" alt="格挡" style="width: 30px; height: 30px;"></p>

        `;
        document.body.appendChild(rulesPanel);
    }

    // 添加战斗记录
    addBattleRecord(attacker, defender, damage, isCritical) {
        const record = document.createElement('div');
        record.className = 'battle-record';
        record.innerHTML = `${attacker.name} 对 ${defender.name} 造成 ${damage} 点伤害 ${isCritical ? '<span class="critical">暴击！</span>' : ''}`;
        
        const recordsDiv = document.querySelector('.battle-records');
        if (recordsDiv) {
            recordsDiv.insertBefore(record, recordsDiv.firstChild);
        }
    }

    // 添加刷新游戏方法
    refreshGame() {
        // 保存当前的金币和记录
        const currentCoins = this.playerCoins;
        const currentBetHistory = [...this.betHistory];  // 创建副本
        const currentBattleRecords = [...this.battleRecords];  // 创建副本
        
        // 保存当前的记录DOM元素
        const betHistoryDiv = document.querySelector('.bet-history');
        const battleRecordsDiv = document.querySelector('.battle-records');
        const oldBetHistory = betHistoryDiv.innerHTML;
        const oldBattleRecords = battleRecordsDiv.innerHTML;
        
        // 重置游戏状态
        this.resetGame();
        
        // 恢复金币和记录
        this.playerCoins = currentCoins;
        this.betHistory = currentBetHistory;
        this.battleRecords = currentBattleRecords;
        
        // 恢复记录的DOM显示
        if (betHistoryDiv) {
            betHistoryDiv.innerHTML = oldBetHistory;
        }
        if (battleRecordsDiv) {
            battleRecordsDiv.innerHTML = oldBattleRecords;
        }
        
        // 更新金币显示
        this.updateCoinsDisplay();
    }

    // 更新下注历史记录
    updateBetHistory() {
        const historyDiv = document.querySelector('.bet-history');
        if (historyDiv) {
            historyDiv.innerHTML = '<h3>下注记录</h3>';
            this.betHistory.forEach(record => {
                const recordDiv = document.createElement('div');
                recordDiv.className = `bet-record ${record.win ? 'win' : 'lose'}`;
                recordDiv.textContent = record.text;
                historyDiv.appendChild(recordDiv);
            });
        }
    }

    // 更新战斗记录
    updateBattleRecords() {
        const recordsDiv = document.querySelector('.battle-records');
        if (recordsDiv) {
            recordsDiv.innerHTML = '<h3>战斗记录</h3>';
            this.battleRecords.forEach(record => {
                recordsDiv.insertBefore(record, recordsDiv.firstChild);
            });
        }
    }

    // 修改处理冠军的方法
    handleChampion(winner) {
        // 播放胜利音效
        this.victorySound.play().catch(error => {
            console.log("音频播放失败:", error);
        });

        // 添加冠军头衔
        const crown = document.createElement('div');
        crown.className = 'crown';
        crown.textContent = '👑';
        winner.element.appendChild(crown);

        // 更新游戏结果显示
        const resultDiv = document.getElementById('game-result');
        resultDiv.innerHTML += `
            <div class="round-result">
                <h3>🏆 最终冠军</h3>
                <p>${winner.name}</p>
            </div>
        `;

        // 处理下注结算
        this.settleBets(winner);
        
        // 15秒后开始新一轮
        this.startNextGameCountdown();
    }

    // 修改播放音效的方法
    playVictorySound() {
        // 检查音频是否已加载
        if (this.victorySound.readyState === 4) {  // HAVE_ENOUGH_DATA
            this.victorySound.currentTime = 0;  // 重置到开始位置
            this.victorySound.play().catch(error => {
                console.error("音频播放失败:", error);
            });
        } else {
            console.warn("音频尚未加载完成");
            // 等待加载完成后播放
            this.victorySound.addEventListener('canplaythrough', () => {
                this.victorySound.play().catch(error => {
                    console.error("音频播放失败:", error);
                });
            }, { once: true });  // 只监听一次
        }
    }
}

// 初始化游戏
window.onload = () => {
    new HorseRacing();
}; 