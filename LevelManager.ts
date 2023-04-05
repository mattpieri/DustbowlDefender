


import {Behaviour, TransformData, GameObject, serializable, AssetReference, InstantiateOptions, EventList, EventTrigger, Renderer } from '@needle-tools/engine';
import {Color, Vector3} from "three";
import {Counter} from "./Counter";
import {TargetManager} from "./TargetManager";
import {Scale} from "./Scale";

const LEVEL_MAP = {
    "1":{
        "Level1BadGuys":0 ,
        "Level2BadGuys":0,
        "Level3BadGuys":50,
    },
    "2":{
        "Level1BadGuys":20,
        "Level2BadGuys":0,
        "Level3BadGuys":0,
    },
    "3":{
        "Level1BadGuys":30,
        "Level2BadGuys":0,
        "Level3BadGuys":0,
    },
    "4":{
        "Level1BadGuys":20,
        "Level2BadGuys":5,
        "Level3BadGuys":0,
    },
    "5":{
        "Level1BadGuys":20,
        "Level2BadGuys":10,
        "Level3BadGuys":0,
    },
    "6":{
        "Level1BadGuys":20,
        "Level2BadGuys":20,
        "Level3BadGuys":0,
    },
    "7":{
        "Level1BadGuys":20,
        "Level2BadGuys":20,
        "Level3BadGuys":5,
    },
    "8":{
        "Level1BadGuys":20,
        "Level2BadGuys":0,
        "Level3BadGuys":0,
    },
    "9":{
        "Level1BadGuys":20,
        "Level2BadGuys":0,
        "Level3BadGuys":0,
    },
    "10":{
        "Level1BadGuys":20,
        "Level2BadGuys":0,
        "Level3BadGuys":0,
    }
}

export class LevelManager extends Behaviour {


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

    async start(){
        await this.startGamePrefab?.instantiate(this.loadConfig(true))
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
        GameObject.setActive(this._startGame, false, false, true) //, true)
        // @ts-ignore
        GameObject.setActive(this._startRoundPrefab, false, false, true) //, true)

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
        });

        // Create an EventList that will be invoked when the button is clicked
        const onExitEvent: EventList = new EventList();
        // Add the onClickCallback function to the EventList
        onExitEvent.addEventListener((...args: any[]) => {
            // @ts-ignore
            unhighlight(gameObject, ...args);
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

    public getCurrentLevel() {
        return this.currentLevel
    }

    private currentLevel = 0;

    public decreaseLevel1BadGuysCount() {
        LEVEL_MAP[String(this.currentLevel)]["Level1BadGuys"] = LEVEL_MAP[String(this.currentLevel)]["Level1BadGuys"] - 1;
    }

    public decreaseLevel2BadGuysCount() {
        LEVEL_MAP[String(this.currentLevel)]["Level2BadGuys"] = LEVEL_MAP[String(this.currentLevel)]["Level2BadGuys"] - 1;
    }

    public decreaseLevel3BadGuysCount() {
        LEVEL_MAP[String(this.currentLevel)]["Level3BadGuys"] = LEVEL_MAP[String(this.currentLevel)]["Level3BadGuys"] - 1;
    }

    public getLevel1BadGuysCount() {
        return LEVEL_MAP[String(this.currentLevel)]["Level1BadGuys"]
    }
    public getLevel2BadGuysCount() {
        return LEVEL_MAP[String(this.currentLevel)]["Level2BadGuys"]
    }
    public getLevel3BadGuysCount() {
        return LEVEL_MAP[String(this.currentLevel)]["Level3BadGuys"]
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

        if(  LEVEL_MAP[String(this.currentLevel + 1)] === undefined) {
            this.showWinner()
            return
        }

        const CashCounter = this.context.scene.getObjectByName("CashCounter")
        // @ts-ignore
        GameObject.getComponent(CashCounter, Counter).add(100 + this.getCurrentLevel() * 50 );

        // @ts-ignore
        GameObject.setActive(this._startRoundPrefab, true, false, true) //, true)

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

    showGameOVer(){
        // @ts-ignore
        GameObject.setActive(this._gameOver, true, false, true) //, true)

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

    }

    public rotate(amount){
        console.log(amount)
        const rotationAxis = new Vector3(0, 1, 0);

        this._startRoundPrefab?.rotateOnAxis(rotationAxis, amount)
        this._startGame?.rotateOnAxis(rotationAxis, amount)
    }

}

