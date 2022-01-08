const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

function Game(){
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;

}

Game.prototype.initializeGame = function(){
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'axe'));

    this.currentEnemy = this.enemies[0];

    inquirer.prompt(
        {
            type: 'text',
            name: 'name',
            message: 'What is your name?'
        }
    ).then(({ name } ) => {
        this.player = new Player(name);

        //test the object creation
        this.startNewBattle();
    })
}

Game.prototype.startNewBattle = function(){
    if(this.player.agility > this.currentEnemy.agility){
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }

    console.log('Your stats are as follows:');
    console.table(this.player.getStats());
    console.log(this.currentEnemy.getDescription());

    this.battle()

}

Game.prototype.battle = function(){
    if (this.isPlayerTurn) {
        inquirer.prompt(
            {
                type: 'list',
                message: 'What would you like to do',
                name: 'action',
                choices: ['Attack', 'Use Potion']
            }
        ).then(({ action }) => {
            if(action === 'Use Potion'){
                if(!this.player.getInventory()){
                    console.log("You don't have any potions!");
                    return;
                }

                inquirer.prompt(
                    {
                        type: 'list',
                        message: 'Which potion would you like to use?',
                        name: 'action',
                        choices: this.player.getInventory().map((item, index) => `${index +1}: ${item.name}`) 
                    }

                )
                //follow-up prompt will go here
            } else {
                const damage = this.player.getAttackValue();
                this.currentEnemy.reduceHealth(damage);

                console.log(`You attacked the ${this.currentEnemy.name}`)
                console.log(this.currentEnemy.getHealth());
            }
        })
    } else {
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`You were attacked by the ${this.currentEnemy.name}`);
        console.log(this.player.getHealth);
    }
}

// If it is the players turn it will need to prompt the player to either attack or use potion
// if a potion is used display the potions in your inventory
// apply the selected potion to player stats 
// delete the potion from the inventory
//If attacking subtract health from the Enemy based on Player attack value

//If enemy turn: 
//subtract health from the Player based on Enemy attack value

module.exports = Game; 