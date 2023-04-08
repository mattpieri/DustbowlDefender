


import {Behaviour, TransformData, GameObject, serializable, AssetReference, InstantiateOptions, EventList, EventTrigger, Renderer } from '@needle-tools/engine';
import {Color, Vector3} from "three";
import {Counter} from "./Counter";
import {TargetManager} from "./TargetManager";
import {Scale} from "./Scale";
import {Market} from "./Market";
import {LoadManager} from "./LoadManager";

const LEVEL_MAP = {
    "1":{
        "Level1BadGuys":12 ,
        "Level2BadGuys":0,
        "Level3BadGuys":0,
    },
    "2":{
        "Level1BadGuys":25,
        "Level2BadGuys":0,
        "Level3BadGuys":0,
    },
    "3":{
        "Level1BadGuys":25,
        "Level2BadGuys":5,
        "Level3BadGuys":0,
    },
    "4":{
        "Level1BadGuys":5, //?
        "Level2BadGuys":25,
        "Level3BadGuys":0,
    },
    "5":{
        "Level1BadGuys":25,
        "Level2BadGuys":25,
        "Level3BadGuys":0,
    },
    "6":{
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":15,
    },
    "7":{
        "Level1BadGuys":0,
        "Level2BadGuys":65,
        "Level3BadGuys":0,
    },
    "8":{
        "Level1BadGuys":35,
        "Level2BadGuys":35,
        "Level3BadGuys":0,
    },
    "9":{
        "Level1BadGuys":25,
        "Level2BadGuys":25,
        "Level3BadGuys":25,
    },
    "10":{
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":35,
    }
}

interface LevelMap {
    [level: string]: {
        Level1BadGuys: number;
        Level2BadGuys: number;
        Level3BadGuys: number;
    };
}

export class LevelManager extends Behaviour {


    @serializable(AssetReference)
    levelCounterPrefab?: AssetReference;

    private _levelCounter:  GameObject | undefined | null;


    @serializable(AssetReference)
    playAgainPrefab?: AssetReference;

    private _playAgain:  GameObject | undefined | null;


    @serializable(AssetReference)
    startGamePrefab?: AssetReference;

    private _startGame:  GameObject | undefined | null;

    @serializable(AssetReference)
    startRoundPrefab?: AssetReference;

    @serializable(AssetReference)
    plane?: AssetReference;

    @serializable(AssetReference)
    gameOverPrefab?: AssetReference;

    private _gameOver:  GameObject | undefined | null;

    @serializable(AssetReference)
    winnnerPrefab?: AssetReference;

    private _winnner:  GameObject | undefined | null;

    private _startRoundPrefab:  GameObject | undefined | null;
    private _plane:  GameObject | undefined | null;

    private loadConfig(visible){
        const config = new InstantiateOptions();
        config.visible = visible
        config.parent = this.context.scene.getObjectByName("Content");
        return config
    }

    private _levelMap: LevelMap | undefined;

    async start(){

        this._levelMap = JSON.parse(JSON.stringify(LEVEL_MAP));

        await this.startGamePrefab?.instantiate(this.loadConfig(false))
            .then((result) => {
                // @ts-ignore
                this._startGame = result
                // @ts-ignore
                this._startGame.position.setY(2.5)

                return this.startRoundPrefab?.instantiate(this.loadConfig(false))
            })
            .then((result) => {
                // @ts-ignore
                this._startRoundPrefab = result
                // @ts-ignore
                this._startRoundPrefab.position.setY(2.5)

                return this.plane?.instantiate(this.loadConfig(true))
            }).then((result) => {
                // @ts-ignore
                this._plane = result
                // @ts-ignore
                this._plane.position.setY(2.5)

                // @ts-ignore
                this.addGameStartListener(this._plane)

                return this.gameOverPrefab?.instantiate(this.loadConfig(false))
            }).then((result) => {
                // @ts-ignore
                this._gameOver = result
                // @ts-ignore
                this._gameOver.position.setY(2.5)

                return this.winnnerPrefab?.instantiate(this.loadConfig(false))
            }).then((result) => {
                // @ts-ignore
                this._winnner = result
                // @ts-ignore
                this._winnner.position.setY(2.5)

                return this.levelCounterPrefab?.instantiate(this.loadConfig(false))
            }).then((result) => {
                // @ts-ignore
                this._levelCounter = result
                // @ts-ignore
                this._levelCounter.position.setY(1.58)
                // @ts-ignore
                this._levelCounter.position.setZ(-.75)
                // @ts-ignore
                //GameObject.setActive(this._levelCounter, false, false, true) //, true)

                return this.playAgainPrefab?.instantiate(this.loadConfig(false))
            }).then((result) => {
                // @ts-ignore
                this._playAgain = result
                // @ts-ignore
                this._playAgain.position.setY(1.58)
                // @ts-ignore
                this._playAgain.position.setZ(.2)
                // @ts-ignore
                this.addPlayAgainListener(this._playAgain)


            })
    }


    // @ts-ignore
    startGame(gameObject: GameObject) {
        console.log("test")
        const TM = this.context.scene.getObjectByName("TargetManager")
        // @ts-ignore
        const TargetManagerCompenent = GameObject.getComponent(TM, TargetManager);
        // @ts-ignore
        TargetManagerCompenent.startGame()
        // @ts-ignore

        //GameObject.setActive(this._startGame, false, false, true) //, true)

        // @ts-ignore
        //GameObject.getComponent(this._levelCounter, Counter).setValue(undefined) //hideEverything
        GameObject.getComponent(this._levelCounter, Counter).hideEverything()
        // @ts-ignore
        GameObject.setActive(this._startRoundPrefab, false, false, true) //, true)
        // @ts-ignore

        GameObject.setActive(this._plane, false, false, true) //, true)

        const buttonUp = this.context.scene.getObjectByName("button_up")
        const buttonDown = this.context.scene.getObjectByName("button_down")

        // @ts-ignore
        let buttonUpComponenet = GameObject.getComponent( buttonUp, Scale)
        // @ts-ignore
        let buttonDownComponenet = GameObject.getComponent( buttonDown, Scale)

        // @ts-ignore
        //buttonUpComponenet.hide()
        // @ts-ignore
        //buttonDownComponenet.hide()
    }

    private log(message, message2){
        const texty = this.context.scene.getObjectByName("Texty")
        // @ts-ignore
        const TextComponent = GameObject.getComponent(texty, Text)
        // @ts-ignore
        TextComponent.text = message + "\n" + message2
    }

    addGameStartListener(gameObject: GameObject){

        // @ts-ignore
        const eventTrigger = GameObject.getOrAddComponent(gameObject, EventTrigger);
        // Define a callback function that accepts the GameObject and event arguments as parameters

        // @ts-ignore
        const highlight = (gameObject: GameObject) => {
            //this.log("Highlight!", "")
            // @ts-ignore
            const renderer = GameObject.getComponent(this._startGame, Renderer);
            // @ts-ignore
            renderer.material.color = new Color(1, 0.92, 0.016, 1);
            // @ts-ignore
            const renderer2 = GameObject.getComponent(this._startRoundPrefab, Renderer);
            // @ts-ignore
            renderer2.material.color = new Color(1, 0.92, 0.016, 1);


        };
        // @ts-ignore
        const unhighlight = (gameObject: GameObject) => {
            //this.log("Don't Highlight!", "")
            // @ts-ignore
            const renderer = GameObject.getComponent(this._startGame, Renderer);
            // @ts-ignore
            renderer.material.color = new Color(1, 1, 1, 1);
            // @ts-ignore
            const renderer2 = GameObject.getComponent(this._startRoundPrefab, Renderer);
            // @ts-ignore
            renderer2.material.color = new Color(1, 1, 1, 1);

        };

        // Create an EventList that will be invoked when the button is clicked
        const onEnterEvent: EventList = new EventList();
        // Add the onClickCallback function to the EventList
        onEnterEvent.addEventListener((...args: any[]) => {
            // @ts-ignore
            highlight(gameObject, ...args);

            // @ts-ignore
            GameObject.getComponent(this._levelCounter, Counter).highlight(new Color(1, 0.92, 0.016, 1))
        });

        // Create an EventList that will be invoked when the button is clicked
        const onExitEvent: EventList = new EventList();
        // Add the onClickCallback function to the EventList
        onExitEvent.addEventListener((...args: any[]) => {
            // @ts-ignore
            unhighlight(gameObject, ...args);
            // @ts-ignore

            GameObject.getComponent(this._levelCounter, Counter).highlight( new Color(1, 1, 1, 1))

        });

        // Create an EventList that will be invoked when the button is clicked
        const onClickEvent: EventList = new EventList();
        // Add the onClickCallback function to the EventList
        onClickEvent.addEventListener(() => {
            // @ts-ignore
            this.currentLevel++
            this.startGame(gameObject)
        });

        // Add the onClickEventList to the EventTrigger's triggers array
        // @ts-ignore
        eventTrigger.triggers = [{
            eventID: 0,
            callback: onEnterEvent,
        }, {
            eventID: 1,
            callback: onExitEvent,
        }, {
            eventID: 4,
            callback: onClickEvent,
        }];
    }

    deleteShooter(market: string){
        let cactusMarket = this.context.scene.getObjectByName(market)
        // @ts-ignore
        let purchasedCactus = GameObject.getComponent(cactusMarket, Market).getPurchased();
        for (let i = 0; i < purchasedCactus.length; i++) {
            // @ts-ignore
            GameObject.destroy(purchasedCactus[i])
        }
        // @ts-ignore
        GameObject.getComponent(cactusMarket, Market).clearPurchased();

    }

    addPlayAgainListener(gameObject: GameObject){
        // @ts-ignore
        const eventTrigger = GameObject.getOrAddComponent(gameObject, EventTrigger);

        // @ts-ignore
        const highlight = (gameObject: GameObject) => {
            // @ts-ignore
            const renderer = GameObject.getComponent(this._playAgain, Renderer);
            // @ts-ignore
            renderer.material.color = new Color(1, 0.92, 0.016, 1);
        };
        // @ts-ignore
        const unhighlight = (gameObject: GameObject) => {
            // @ts-ignore
            const renderer = GameObject.getComponent(this._playAgain, Renderer);
            // @ts-ignore
            renderer.material.color = new Color(1, 1, 1, 1);
        };

        const onEnterEvent: EventList = new EventList();
        onEnterEvent.addEventListener((...args: any[]) => {
            // @ts-ignore
            highlight(gameObject, ...args);
        });

        const onExitEvent: EventList = new EventList();
        onExitEvent.addEventListener((...args: any[]) => {
            // @ts-ignore
            unhighlight(gameObject, ...args);
        });

        const onClickEvent: EventList = new EventList();
        onClickEvent.addEventListener(() => {
            // @ts-ignore
            this.currentLevel = 0
            this._levelMap = JSON.parse(JSON.stringify(LEVEL_MAP));

            let cashCounter = this.context.scene.getObjectByName("CashCounter")
            // @ts-ignore
            const cashCounterComp = GameObject.getComponent(cashCounter, Counter)
            // @ts-ignore
            cashCounterComp.setValue(4000)

            let healthCounter = this.context.scene.getObjectByName("HealthCounter")
            // @ts-ignore
            const healthCounterComp = GameObject.getComponent(healthCounter, Counter)
            // @ts-ignore
            healthCounterComp.setValue(40)

            this.deleteShooter("CactusMarket")
            this.deleteShooter("ShortMarket")
            this.deleteShooter("BombMarket")

            // @ts-ignore
            GameObject.setActive(this._playAgain, false, false, true) //, true)

            // @ts-ignore
            GameObject.setActive(this._gameOver, false, false, true) //, true)

            let targetManager = this.context.scene.getObjectByName("TargetManager") //TODO:DO I NEED TO CLEAR ALL ARRAYS
            // @ts-ignore
            const targets = GameObject.getComponent(targetManager, TargetManager).getTargets()
            for(let i=0; i<targets.length;i++){
                GameObject.destroy(targets[i])
            }

            // @ts-ignore
            GameObject.getComponent(targetManager, TargetManager).clear()

            this.isGameOver = false
            this.showStartGame()
        });

        // @ts-ignore
        eventTrigger.triggers = [{
            eventID: 0,
            callback: onEnterEvent,
        }, {
            eventID: 1,
            callback: onExitEvent,
        }, {
            eventID: 4,
            callback: onClickEvent,
        }];
    }

    public getCurrentLevel() {
        return this.currentLevel
    }

    private currentLevel = 0;



    public decreaseLevel1BadGuysCount() {
        // @ts-ignore
        this._levelMap[String(this.currentLevel)]["Level1BadGuys"] = this._levelMap[String(this.currentLevel)]["Level1BadGuys"] - 1;
    }

    public decreaseLevel2BadGuysCount() {
        // @ts-ignore
        this._levelMap[String(this.currentLevel)]["Level2BadGuys"] = this._levelMap[String(this.currentLevel)]["Level2BadGuys"] - 1;
    }

    public decreaseLevel3BadGuysCount() {
        // @ts-ignore
        this._levelMap[String(this.currentLevel)]["Level3BadGuys"] = this._levelMap[String(this.currentLevel)]["Level3BadGuys"] - 1;
    }

    public getLevel1BadGuysCount() {
        // @ts-ignore
        return this._levelMap[String(this.currentLevel)]["Level1BadGuys"]
    }
    public getLevel2BadGuysCount() {
        // @ts-ignore
        return this._levelMap[String(this.currentLevel)]["Level2BadGuys"]
    }
    public getLevel3BadGuysCount() {
        // @ts-ignore
        return this._levelMap[String(this.currentLevel)]["Level3BadGuys"]
    }


    getTargetManager() {
        const TM = this.context.scene.getObjectByName("TargetManager")

        // @ts-ignore
        return  GameObject.getComponent(TM, TargetManager);
    }

    showNextRound(){
        if( this.isGameOver){
                    return
         }
        // @ts-ignore
        GameObject.getComponent(this._levelCounter, Counter).setValue(this.currentLevel+1)
        // @ts-ignore
        GameObject.setActive(this._levelCounter, true, false, true) //, true)

        /*if( this.isGameOver){
            return
        }*/

        // @ts-ignore
        if(  this._levelMap[String(this.currentLevel + 1)] === undefined) {
            this.showWinner()
            return
        }

        const CashCounter = this.context.scene.getObjectByName("CashCounter")
        // @ts-ignore
        GameObject.getComponent(CashCounter, Counter).add(100 - this.getCurrentLevel() );

        // @ts-ignore
        GameObject.setActive(this._startRoundPrefab, true, false, true) //, true)

        // @ts-ignore
        GameObject.setActive(this._plane, true, false, true) //, true)

        const buttonUp = this.context.scene.getObjectByName("button_up")
        const buttonDown = this.context.scene.getObjectByName("button_down")

        // @ts-ignore
        let buttonUpComponenet = GameObject.getComponent( buttonUp, Scale)
        // @ts-ignore
        let buttonDownComponenet = GameObject.getComponent( buttonDown, Scale)

        // @ts-ignore
        //buttonUpComponenet.show()
        // @ts-ignore
       // buttonDownComponenet.show()

    }

    private isGameOver = false;

    showStartGame(){
        // @ts-ignore
        GameObject.getComponent(this._levelCounter, Counter).setValue(this.currentLevel+1)
        // @ts-ignore
        GameObject.setActive(this._levelCounter, true, false, true) //, true)
        // @ts-ignore
        GameObject.setActive(this._startRoundPrefab, true, false, true) //, true)
        // @ts-ignore
        GameObject.setActive(this._plane, true, false, true) //, true)


    }

    showGameOVer(){
        // @ts-ignore
        GameObject.setActive(this._gameOver, true, false, true) //, true)
        // @ts-ignore
        GameObject.setActive(this._playAgain, true, false, true) //, true)

        this.isGameOver = true;

    }

    showWinner(){
        // @ts-ignore
        GameObject.setActive(this._winnner, true, false, true) //, true)
        // @ts-ignore
        GameObject.setActive(this._levelCounter, true, false, true) //, true)

        this.isGameOver = true;

    }

    async startNextRound(){
        console.log('Starting next round');
        await this.delay(3000);
        console.log('3');
        await this.delay(3000);
        console.log('2');
        await this.delay(3000);
        console.log('1');
        await this.delay(3000);
        console.log('go');
        this.currentLevel++
        let tm = this.getTargetManager()



        // @ts-ignore
        tm.startGame()
    }


    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public onMoveUp(moveUpAmount){
        console.log(moveUpAmount)
        // @ts-ignore
        this._startRoundPrefab.position.add(new Vector3(0, moveUpAmount, 0))
        // @ts-ignore
        this._startGame.position.add(new Vector3(0, moveUpAmount, 0))
        // @ts-ignore
        this._plane.position.add(new Vector3(0, moveUpAmount, 0))
        // @ts-ignore
        this._gameOver.position.add(new Vector3(0, moveUpAmount, 0))
        // @ts-ignore
        this._winnner.position.add(new Vector3(0, moveUpAmount, 0))
        // @ts-ignore
        GameObject.getComponent(this._levelCounter, Counter).onMoveUp(moveUpAmount)

    }

    public rotate(amount){
        console.log(amount)
        const rotationAxis = new Vector3(0, 1, 0);

        this._startRoundPrefab?.rotateOnAxis(rotationAxis, amount)
        this._startGame?.rotateOnAxis(rotationAxis, amount)
    }

}

