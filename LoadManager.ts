import {Behaviour, TransformData, GameObject, FrameEvent } from '@needle-tools/engine';
import {LevelManager} from "./LevelManager";
import {ScaleManager} from "./ScaleManager";

export class LoadManager extends Behaviour {
    public cactusMarketLoaded() {
        this._cactusMarketLoaded = true;
    }

    public shortMarketLoaded() {
        this._shortMarketLoaded = true;
    }

    public cannonMarketLoaded() {
        this._cannonMarketLoaded = true;
    }

    public healthCounterLoaded() {
        this._healthCounterLoaded = true;
    }

    public cashCounterLoaded() {
        this._cashCounterLoaded = true;
    }

    public levelManagerLoadedTest(vale:boolean) {
        this._levelManagerLoaded = vale;
    }


    public loaded() {
        this._loaded = true;
    }

    private _cactusMarketLoaded = false;
    private _shortMarketLoaded = false;
    private _cannonMarketLoaded = false;
    private _healthCounterLoaded = false;
    private _cashCounterLoaded = false;
    private _levelManagerLoaded = false;
    private _loaded = false;

    startGame(){
        //set flags on start game
        //allow users to drag players
        //show up and down buttons
    }

    private elapsedTime: number = 0;


    update(){
        ///TODO: FIXXX THIS CODEE
        ///TODO: FIXXX THIS CODEE
        ///TODO: FIXXX THIS CODEE

        if( this._cactusMarketLoaded && this._shortMarketLoaded && this._cannonMarketLoaded &&
                this._healthCounterLoaded && this._cannonMarketLoaded ){ //&& this._levelManagerLoaded ) {
            this._loaded = true;
            // @ts-ignore
            GameObject.setActive(this.gameObject, false, false, true) //, true)

            const LM = this.context.scene.getObjectByName("LevelManager")

            // @ts-ignore
            GameObject.getComponent(LM, LevelManager).showStartGame(1);

        } else {
            let speed = 5
            this.elapsedTime += this.context.time.deltaTime * speed;
            let oscillationHeight = Math.sin(this.elapsedTime) * .05
            this.gameObject.position.setY(1.4 + oscillationHeight + 1);
            console.log(this._loaded)
        }
    }

    /// addour courtoutine

}