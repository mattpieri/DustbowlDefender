


import {Behaviour, TransformData, GameObject, serializable, AssetReference, InstantiateOptions, EventList, EventTrigger, Renderer, AudioSource } from '@needle-tools/engine';
import {Color, Vector3} from "three";
import {Counter} from "./Counter";
import {TargetManager} from "./TargetManager";
import {Scale} from "./Scale";
import {Market} from "./Market";
import {LoadManager} from "./LoadManager";
import {Radius2} from "./Radius2";
import {Upgrade} from "./Upgrade";

const LEVEL_MAP = {
    "1":{
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":5,
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "2":{
        "Level1BadGuys":10,
        "Level2BadGuys":0,
        "Level3BadGuys":0,
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "3":{
        "Level1BadGuys":25, //25
        "Level2BadGuys":5,  //5
        "Level3BadGuys":0,
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "4":{
        "Level1BadGuys":5, //5
        "Level2BadGuys":25, //25
        "Level3BadGuys":0,
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "5":{
        "Level1BadGuys":25, //25
        "Level2BadGuys":25, //25
        "Level3BadGuys":0,
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "6":{ //level 3
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":15, //15
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "7":{
        "Level1BadGuys":0,
        "Level2BadGuys":65, //65
        "Level3BadGuys":0,
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "8":{
        "Level1BadGuys":35, //35
        "Level2BadGuys":35, //35
        "Level3BadGuys":0,
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "9":{
        "Level1BadGuys":25, //25
        "Level2BadGuys":25, //25
        "Level3BadGuys":25, //25
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "10":{
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":35, //35
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    } ,
    "11":{ //level 4
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":0,
        "Level4BadGuys":5,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "12":{
        "Level1BadGuys":0,
        "Level2BadGuys":5,
        "Level3BadGuys":0,
        "Level4BadGuys":10,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "13":{
        "Level1BadGuys":5,
        "Level2BadGuys":5,
        "Level3BadGuys":20,
        "Level4BadGuys":5,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    }
    ,
    "14":{
        "Level1BadGuys":5,
        "Level2BadGuys":15,
        "Level3BadGuys":20,
        "Level4BadGuys":5,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "15":{
        "Level1BadGuys":5,
        "Level2BadGuys":33,
        "Level3BadGuys":0,
        "Level4BadGuys":10,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "16":{
        "Level1BadGuys":0,
        "Level2BadGuys":20,
        "Level3BadGuys":5,
        "Level4BadGuys":16,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "17":{
        "Level1BadGuys":0,
        "Level2BadGuys":40,
        "Level3BadGuys":45,
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "18":{
        "Level1BadGuys":5,
        "Level2BadGuys":30,
        "Level3BadGuys":6, //35
        "Level4BadGuys":6,
        "Level5BadGuys":5,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "19":{
        "Level1BadGuys":0,
        "Level2BadGuys":20,
        "Level3BadGuys":20, //35
        "Level4BadGuys":5,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "20":{
        "Level1BadGuys":33,
        "Level2BadGuys":26,
        "Level3BadGuys":20, //35
        "Level4BadGuys":5,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "21":{
        "Level1BadGuys":30,
        "Level2BadGuys":5,
        "Level3BadGuys":30, //35
        "Level4BadGuys":40,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "22":{
        "Level1BadGuys":10,
        "Level2BadGuys":55,
        "Level3BadGuys":20, //35
        "Level4BadGuys":10,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "23":{
        "Level1BadGuys":20,
        "Level2BadGuys":0,
        "Level3BadGuys":33, //35
        "Level4BadGuys":20,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "24":{
        "Level1BadGuys":6,
        "Level2BadGuys":20,
        "Level3BadGuys":20, //35
        "Level4BadGuys":40,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "25":{
        "Level1BadGuys":0,
        "Level2BadGuys":20,
        "Level3BadGuys":0, //35
        "Level4BadGuys":30,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "26":{
        "Level1BadGuys":50,
        "Level2BadGuys":33,
        "Level3BadGuys":33, //35
        "Level4BadGuys":10,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "27":{
        "Level1BadGuys":33,
        "Level2BadGuys":33,
        "Level3BadGuys":33, //35
        "Level4BadGuys":33,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "28":{ //level 5
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":0,
        "Level4BadGuys":0,
        "Level5BadGuys":5,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "29":{
        "Level1BadGuys":1,
        "Level2BadGuys":0,
        "Level3BadGuys":30, //35
        "Level4BadGuys":0,
        "Level5BadGuys":8,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "30":{
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":0, //35
        "Level4BadGuys":20,
        "Level5BadGuys":20,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "31":{
        "Level1BadGuys":30,
        "Level2BadGuys":30,
        "Level3BadGuys":0, //35
        "Level4BadGuys":0,
        "Level5BadGuys":30,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "32":{
        "Level1BadGuys":30,
        "Level2BadGuys":0,
        "Level3BadGuys":30, //35
        "Level4BadGuys":0,
        "Level5BadGuys":30,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "33":{
        "Level1BadGuys":30,
        "Level2BadGuys":30,
        "Level3BadGuys":6, //35
        "Level4BadGuys":6,
        "Level5BadGuys":30,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "34":{
        "Level1BadGuys":1,
        "Level2BadGuys":0,
        "Level3BadGuys":6, //35
        "Level4BadGuys":0,
        "Level5BadGuys":40,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "35":{
        "Level1BadGuys":30,
        "Level2BadGuys":0,
        "Level3BadGuys":20, //35
        "Level4BadGuys":40,
        "Level5BadGuys":20,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "36":{
        "Level1BadGuys":20,
        "Level2BadGuys":20,
        "Level3BadGuys":20, //35
        "Level4BadGuys":20,
        "Level5BadGuys":20,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "37":{
        "Level1BadGuys":5,
        "Level2BadGuys":0,
        "Level3BadGuys":5, //35
        "Level4BadGuys":0,
        "Level5BadGuys":50,
        "Level6BadGuys":5,
        "Level7BadGuys":0,
    },
    "38":{ // level 6
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":0, //35
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":30,
        "Level7BadGuys":0,
    },
    "39":{
        "Level1BadGuys":30,
        "Level2BadGuys":30,
        "Level3BadGuys":30, //35
        "Level4BadGuys":40,
        "Level5BadGuys":10,
        "Level6BadGuys":0,
        "Level7BadGuys":0,
    },
    "40":{
        "Level1BadGuys":30,
        "Level2BadGuys":0,
        "Level3BadGuys":20, //35
        "Level4BadGuys":30,
        "Level5BadGuys":5,
        "Level6BadGuys":16,
        "Level7BadGuys":0,
    },
    "41":{
        "Level1BadGuys":0,
        "Level2BadGuys":50,
        "Level3BadGuys":20, //35
        "Level4BadGuys":20,
        "Level5BadGuys":20,
        "Level6BadGuys":15,
        "Level7BadGuys":0,
    },
    "42":{
        "Level1BadGuys":10,
        "Level2BadGuys":0,
        "Level3BadGuys":40,
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":30,
        "Level7BadGuys":0,
    },
    "43":{ //level 7
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":0,
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":20,
    },
    "44":{
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":40,
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":20,
    },
    "45":{
        "Level1BadGuys":1,
        "Level2BadGuys":0,
        "Level3BadGuys":6, //35
        "Level4BadGuys":40,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":30,
    },
    "46":{
        "Level1BadGuys":1,
        "Level2BadGuys":0,
        "Level3BadGuys":6, //35
        "Level4BadGuys":0,
        "Level5BadGuys":55,
        "Level6BadGuys":0,
        "Level7BadGuys":30,
    },
    "47":{
        "Level1BadGuys":1,
        "Level2BadGuys":55,
        "Level3BadGuys":6, //35
        "Level4BadGuys":0,
        "Level5BadGuys":55,
        "Level6BadGuys":0,
        "Level7BadGuys":30,
    },
    "48":{
        "Level1BadGuys":1,
        "Level2BadGuys":0,
        "Level3BadGuys":6, //35
        "Level4BadGuys":0,
        "Level5BadGuys":55,
        "Level6BadGuys":0,
        "Level7BadGuys":30,
    },
    "49":{
        "Level1BadGuys":1,
        "Level2BadGuys":55,
        "Level3BadGuys":6, //35
        "Level4BadGuys":0,
        "Level5BadGuys":0,
        "Level6BadGuys":0,
        "Level7BadGuys":30,
    },
    "50":{
        "Level1BadGuys":0,
        "Level2BadGuys":55,
        "Level3BadGuys":0,
        "Level4BadGuys":55,
        "Level5BadGuys":0,
        "Level6BadGuys":40,
        "Level7BadGuys":40,
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
                this.addGameStartListener(this._plane)

                // @ts-ignore
               // GameObject.setActive(this._levelCounter, true, false, true) //, true)

                // @ts-ignore
               GameObject.getComponent(this._levelCounter, Counter).altStart()
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


    playChord(){
        // @ts-ignore
        let b = GameObject.getComponents(this._startRoundPrefab, AudioSource)[0];
        if(b !== undefined){
            // @ts-ignore
            b.play()
        }
    }

    // @ts-ignore
    startGame(gameObject: GameObject) {
        const TM = this.context.scene.getObjectByName("TargetManager")
        // @ts-ignore
        const TargetManagerCompenent = GameObject.getComponent(TM, TargetManager);

        if(this.currentLevel ===1){
            // @ts-ignore
            TargetManagerCompenent.startNextRoundListener()
        }

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
        buttonUpComponenet.hide()
        // @ts-ignore
        buttonDownComponenet.hide()
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
            const radiusComp = GameObject.getComponent(purchasedCactus[i], Radius2)
            if(radiusComp!==undefined) {
                // @ts-ignore
                radiusComp.hideRadius()
            }

            // @ts-ignore
            const uppradeComp = GameObject.getComponent(purchasedCactus[i], Upgrade)
            // @ts-ignore
            uppradeComp?.hide(purchasedCactus[i])

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
            let targetManager = this.context.scene.getObjectByName("TargetManager") //TODO:DO I NEED TO CLEAR ALL ARRAYS
            // @ts-ignore
            const targets = GameObject.getComponent(targetManager, TargetManager).getTargets()
            for(let i=0; i<targets.length;i++){
                GameObject.destroy(targets[i])
            }


            // @ts-ignore
            this.currentLevel = 0
            this._levelMap = JSON.parse(JSON.stringify(LEVEL_MAP));

            let cashCounter = this.context.scene.getObjectByName("CashCounter")
            // @ts-ignore
            const cashCounterComp = GameObject.getComponent(cashCounter, Counter)
            // @ts-ignore
            cashCounterComp.setValue(800)

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


    public decreaseBadGuysCount(level: number) {

        if( level === 1){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level1BadGuys"] = this._levelMap[String(this.currentLevel)]["Level1BadGuys"] - 1;
        }else if(level === 2){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level2BadGuys"] = this._levelMap[String(this.currentLevel)]["Level2BadGuys"] - 1;
        }else if(level === 3){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level3BadGuys"] = this._levelMap[String(this.currentLevel)]["Level3BadGuys"] - 1;
        }else if(level === 4){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level4BadGuys"] = this._levelMap[String(this.currentLevel)]["Level4BadGuys"] - 1;
        }else if(level === 5){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level5BadGuys"] = this._levelMap[String(this.currentLevel)]["Level5BadGuys"] - 1;
        }else if(level === 6){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level6BadGuys"] = this._levelMap[String(this.currentLevel)]["Level6BadGuys"] - 1;
        }else if(level === 7){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level7BadGuys"] = this._levelMap[String(this.currentLevel)]["Level7BadGuys"] - 1;
        }
        throw new Error("Level not available")
        // @ts-ignore
    }

    public increaseBadGuysCount(level: number) {

        if( level === 1){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level1BadGuys"] = this._levelMap[String(this.currentLevel)]["Level1BadGuys"] + 1;
        }else if(level === 2){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level2BadGuys"] = this._levelMap[String(this.currentLevel)]["Level2BadGuys"] + 1;
        }else if(level === 3){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level3BadGuys"] = this._levelMap[String(this.currentLevel)]["Level3BadGuys"] + 1;
        }else if(level === 4){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level4BadGuys"] = this._levelMap[String(this.currentLevel)]["Level4BadGuys"] + 1;
        }else if(level === 5){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level5BadGuys"] = this._levelMap[String(this.currentLevel)]["Level5BadGuys"] + 1;
        }else if(level === 6){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level6BadGuys"] = this._levelMap[String(this.currentLevel)]["Level6BadGuys"] + 1;
        }else if(level === 7){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level7BadGuys"] = this._levelMap[String(this.currentLevel)]["Level7BadGuys"] + 1;
        }
        throw new Error("Level not available")
        // @ts-ignore
    }

    public getBadGuysCount(level: number) {

        if( level === 1){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level1BadGuys"]
        }else if(level === 2){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level2BadGuys"]
        }else if(level === 3){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level3BadGuys"]
        }else if(level === 4){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level4BadGuys"]
        }else if(level === 5){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level5BadGuys"]
        }else if(level === 6){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level6BadGuys"]
        }else if(level === 7){
            // @ts-ignore
            return this._levelMap[String(this.currentLevel)]["Level7BadGuys"]
        }
        throw new Error("Level not available")
        // @ts-ignore
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

        /*if( this.isGameOver){
            return
        }*/

        // @ts-ignore
        if(  this._levelMap[String(this.currentLevel + 1)] === undefined) {
            this.showWinner()
            return
        }

        this.playChord()
        // @ts-ignore
        GameObject.getComponent(this._levelCounter, Counter).setValue(this.currentLevel+1)
        // @ts-ignore
        GameObject.setActive(this._levelCounter, true, false, true) //, true)

        const CashCounter = this.context.scene.getObjectByName("CashCounter")


        if( this.getCurrentLevel() !== 0) {
            // @ts-ignore
            GameObject.getComponent(CashCounter, Counter).add(100 - this.getCurrentLevel());
        }
        // @ts-ignore
        GameObject.setActive(this._startRoundPrefab, true, false, true) //, true)

        // @ts-ignore
        GameObject.setActive(this._plane, true, false, true) //, true)

        const buttonUp = this.context.scene.getObjectByName("button_up")
        const buttonDown = this.context.scene.getObjectByName("button_down")

        // @ts-ignore
        let buttonUpComponenet = GameObject.getComponent( buttonUp, Scale)
        // @ts-ignore
        let bbuttonDownComponenet = GameObject.getComponent( buttonDown, Scale)

        // @ts-ignore
        buttonUpComponenet.show()
        // @ts-ignore
        bbuttonDownComponenet.show()

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
        // @ts-ignore
        this._startRoundPrefab.position.add(new Vector3(0, moveUpAmount, 0))
        // @ts-ignore
        this._playAgain.position.add(new Vector3(0, moveUpAmount, 0))
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
        const rotationAxis = new Vector3(0, 1, 0);

        this._startRoundPrefab?.rotateOnAxis(rotationAxis, amount)
        this._startGame?.rotateOnAxis(rotationAxis, amount)
    }

}

