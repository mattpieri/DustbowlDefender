import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions, AudioSource, showBalloonMessage, FrameEvent } from "@needle-tools/engine";
import { WaitForSeconds } from "@needle-tools/engine/engine/engine_coroutine";

import { Object3D, Vector3} from "three";

import { MoveTarget} from "./MoveTarget";
import {LevelManager} from "./LevelManager";
import {Scale} from "./Scale";
import {ScaleManager} from "./ScaleManager";
import {Counter} from "./Counter";
import {buffer} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";

export class TargetManager extends Behaviour {

    @serializable(AssetReference)
    myPrefab?: AssetReference;

    @serializable(AssetReference)
    myPrefab2?: AssetReference;

    @serializable(AssetReference)
    level2?: AssetReference;

    @serializable(AssetReference)
    level3?: AssetReference;

    @serializable(AssetReference)
    level4?: AssetReference;

    @serializable(AssetReference)
    level5?: AssetReference;

    @serializable(AssetReference)
    level6?: AssetReference;

    @serializable(AssetReference)
    level7?: AssetReference;

    private targets: GameObject[] = [];
    private unclaimedTargets: GameObject[] = [];

    public clear(){
        this.targets = []
        this.unclaimedTargets = []
        this.toBeRemoved = []
        // @ts-ignore
        this.stopCoroutine(this.badGuy1IntervalGenerator)
        // @ts-ignore
        this.stopCoroutine(this.badGuy2IntervalGenerator)
        // @ts-ignore
        this.stopCoroutine(this.badGuy3IntervalGenerator)
    }

    private badGuy1IntervalGenerator: Generator | undefined;
    private badGuy2IntervalGenerator: Generator | undefined;
    private badGuy3IntervalGenerator: Generator | undefined;
    private badGuy4IntervalGenerator: Generator | undefined;
    private badGuy5IntervalGenerator: Generator | undefined;
    private badGuy6IntervalGenerator: Generator | undefined;
    private badGuy7IntervalGenerator: Generator | undefined;

    private gameStarted = false;
    private isStartingNextRound = false;


    startGame() {
        //GameObject.setActive(this.object, false);
        this.badGuy1IntervalGenerator = this.startCoroutine(this.fireTarget(1, this.myPrefab, this.badGuy1IntervalGenerator),  FrameEvent.Update)
        this.badGuy2IntervalGenerator = this.startCoroutine(this.fireTarget(2, this.level2, this.badGuy2IntervalGenerator),   FrameEvent.Update)
        this.badGuy3IntervalGenerator = this.startCoroutine(this.fireTarget(3, this.level3, this.badGuy3IntervalGenerator),   FrameEvent.Update)
        this.badGuy3IntervalGenerator = this.startCoroutine(this.fireTarget(4, this.level4, this.badGuy4IntervalGenerator),   FrameEvent.Update)
        this.badGuy3IntervalGenerator = this.startCoroutine(this.fireTarget(5, this.level5, this.badGuy5IntervalGenerator),   FrameEvent.Update)
        this.badGuy3IntervalGenerator = this.startCoroutine(this.fireTarget(6, this.level6, this.badGuy6IntervalGenerator),   FrameEvent.Update)
        this.badGuy3IntervalGenerator = this.startCoroutine(this.fireTarget(7, this.level7, this.badGuy7IntervalGenerator),   FrameEvent.Update)

        this.isStartingNextRound = false

        //this.startCoroutine(this.recycleRoutine(),  FrameEvent.Update)
    }

    letNextRoundWork(){
        this.gameStarted = true
    }

    startNextRoundListener(){
        this.startCoroutine(this.checkIfRoundIsOver(), FrameEvent.Update)
    }


    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    awake() {

        // await this.delay(3000);
       // this.cacheLevel1Buffer()

    }

    @serializable()
    level1CacheInterval: number | undefined;

    private buffer: GameObject[] = [];
    private bufferLevel2: GameObject[] = [];

    private cacheLevel1Buffer() {
        const addToLevel1Buffer = async () => {
            if(this.buffer.length <50) {
                await this.myPrefab2?.instantiate().then((prefabTarget) => {
                    // @ts-ignore
                    this.buffer.push(prefabTarget)
                    // @ts-ignore
                    prefabTarget.position.y = -10000
                })
            }
        };
        setInterval(addToLevel1Buffer, 500);
        const addToLevel2Buffer = async () => {
            if(this.buffer.length <50) {
                await this.level2?.instantiate().then((prefabTarget) => {
                    // @ts-ignore
                    this.bufferLevel2.push(prefabTarget)
                    // @ts-ignore
                    prefabTarget.position.y = -10000
                })
            }
        };
        setInterval(addToLevel2Buffer, 500);
    }

    getMoveTargetComponent() {
        const TargetManagerGM = this.context.scene.getObjectByName("TargetManager")
        // @ts-ignore
        return GameObject.getComponent(TargetManagerGM, MoveTarget);
    }


    getLevelManager() {
        const LM = this.context.scene.getObjectByName("LevelManager")

        // @ts-ignore
        return  GameObject.getComponent(LM, LevelManager);
    }

    public offSetY(prefab){
        const ScaleObject = this.context.scene.getObjectByName("Scale")
        // @ts-ignore
        const scaleComponent = GameObject.getComponent(ScaleObject, ScaleManager)

        let offSetY = 0;
        if(scaleComponent){
            offSetY = scaleComponent?.getScaleY() - .40
        }
        prefab.position.y = prefab.position.y + offSetY

    }

    private level1Counter = 0;
    private level2Counter = 0;
    private level3Counter = 0;
    private level4Counter = 0;
    private level5Counter = 0;
    private level6Counter = 0;
    private level7Counter = 0;

    private loadConfig(visible){
        const config = new InstantiateOptions();
        config.visible = visible
        config.parent = this.context.scene.getObjectByName("Content");
        return config
    }

    *fireTarget(level ,asset: AssetReference | undefined, coroutine: Generator | undefined) {
        while(true) {
            if(level === 1){
                this.level1Counter ++
            } else if( level === 2) {
                if( this.level2Counter === 0) {
                    yield WaitForSeconds(1);
                    this.level2Counter ++
                }
            } else if( level === 3) {
                if( this.level3Counter === 0) {
                    yield WaitForSeconds(2);
                    this.level3Counter ++
                }
            } else if( level === 4) {
                if( this.level4Counter === 0) {
                    yield WaitForSeconds(3);
                    this.level4Counter ++
                }
            } else if( level === 5) {
                if( this.level5Counter === 0) {
                    yield WaitForSeconds(4);
                    this.level5Counter ++
                }
            } else if( level === 6) {
                if( this.level5Counter === 0) {
                    yield WaitForSeconds(5);
                    this.level5Counter ++
                }
            } else if( level === 7) {
                if( this.level6Counter === 0) {
                    //yield WaitForSeconds(6);
                    this.level6Counter ++
                }
            }

            let levelManager = this.getLevelManager()
            // @ts-ignore
            if (levelManager.getBadGuysCount(level) <= 0) {
                // @ts-ignore
                this.stopCoroutine(coroutine)
            } else {
                asset?.instantiate().then(async (prefabTarget) => {
                    let moveTargetComponent = GameObject.getComponent(prefabTarget, MoveTarget);
                    // @ts-ignore
                    moveTargetComponent.setLevel(level)

                    // @ts-ignore
                    moveTargetComponent.onStart();

                   // moveTargetComponent.setWayPoints()
                    this.offSetY(prefabTarget)
                    // @ts-ignore
                    this.targets.push(prefabTarget);
                    // @ts-ignore
                    this.unclaimedTargets.push(prefabTarget);
                    // @ts-ignore
                    levelManager.decreaseBadGuysCount(level)
                    // @ts-ignore
                })
            }

            const min = 150;
            const max = 450;
            const randomNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
            yield WaitForSeconds(randomNumber / 1000);


        }
    }

    instantiateFromDead( prefab: GameObject, deadGameObject : GameObject | undefined, waypoint: number, newLevel: number){
        let moveTargetComponent = GameObject.getComponent(prefab, MoveTarget);
        // @ts-ignore
        moveTargetComponent.setLevel(newLevel)
        // @ts-ignore
        moveTargetComponent.setCurrentWaypoint(waypoint)
        // @ts-ignore
        prefab.position.set(deadGameObject.position.x, deadGameObject.position.y, deadGameObject.position.z)
        // @ts-ignore
        this.targets.push(prefab);
        // @ts-ignore
        this.unclaimedTargets.push(prefab);
    }



    fireTargetFromDeadGuy( deadGameObject?: GameObject | undefined) {
        // @ts-ignore
        let deadMoveTargetComponent = GameObject.getComponent(deadGameObject, MoveTarget);
        // @ts-ignore
        if(deadMoveTargetComponent === undefined ){
            return
        }
        // @ts-ignore
        let deadLevel = deadMoveTargetComponent.getLevel();
        if(deadLevel === 1){
            return
        }
        // @ts-ignore
        let deadCurrentWayPoint= deadMoveTargetComponent.getCurrentWaypoint();

        let newLevel;
        let prefabTarget;

        if( deadLevel == 3 ) {

            /*prefabTarget = this.bufferLevel2.pop();

            if( prefabTarget === undefined){
                throw new Error(" oooonn nooo WOOOOOOOOOOOOOAH")
            }*/
            this.level2?.instantiate().then(async (result) => {
                prefabTarget = result;
                newLevel = 2;
                this.instantiateFromDead(prefabTarget, deadGameObject, deadCurrentWayPoint, newLevel)
            })
        } else if ( deadLevel == 2 ){
             //await this.myPrefab2?.instantiate().then( (prefabTarget) => {
            /*prefabTarget = this.buffer.pop();
            // @ts-ignore
            let moveTargetComponent = GameObject.getComponent(prefabTarget, MoveTarget);

            if( moveTargetComponent === null || moveTargetComponent === undefined){
                throw new Error(" WEE WOOOOOOOOOOOOOAH")
            }*/
            this.myPrefab2?.instantiate().then(async (result) => {
                prefabTarget = result;
                newLevel = 1;
                this.instantiateFromDead(prefabTarget, deadGameObject, deadCurrentWayPoint, newLevel)
            })
        } else if ( deadLevel === 4){
            this.level3?.instantiate().then(async (result) => {
                prefabTarget = result;
                newLevel = 3;
                this.instantiateFromDead(prefabTarget, deadGameObject, deadCurrentWayPoint, newLevel)
            })
        } else if ( deadLevel === 5){
            this.level4?.instantiate().then(async (result) => {
                prefabTarget = result;
                newLevel = 4;
                this.instantiateFromDead(prefabTarget, deadGameObject, deadCurrentWayPoint, newLevel)
            })
        } else if ( deadLevel === 6){
            this.level5?.instantiate().then(async (result) => {
                prefabTarget = result;
                newLevel = 5;
                this.instantiateFromDead(prefabTarget, deadGameObject, deadCurrentWayPoint, newLevel)
            })
        } else if ( deadLevel === 7){
            this.level6?.instantiate().then(async (result) => {
                prefabTarget = result;
                newLevel = 6;
                this.instantiateFromDead(prefabTarget, deadGameObject, deadCurrentWayPoint, newLevel)
            })
        }
    }

    getTargets(){
        return this.targets;
    }

    public toBeRemoved: GameObject[] = [];

    *recycleRoutine() {
        while (true) {
            for (let i = 0; i < this.toBeRemoved.length; i++) {

                // @ts-ignore
                this.recycle(this.toBeRemoved[i]);
                if(this.toBeRemoved[i].position) {
                    if (this.toBeRemoved[i].position.y > 0) {
                       // console.log("MEOWHELLLLLLLLLLLLLLLLLLLLLOOOO", this.toBeRemoved[i].position)

                    }
                }
            }
            yield WaitForSeconds(200 / 1000);
        }
    }

    private recycle(gameObject: GameObject){
        //move to infinity
        //tell it to stop moving

        //GameObject.destroy(gameObject)
        gameObject.position.y = -1000
        const moveComponent = GameObject.getComponent(gameObject, MoveTarget)
        // @ts-ignore
        moveComponent.deactivate()
        // @ts-ignore
        moveComponent.setLevel(0)

        //add to cache
    }

    public recycle2(gameObject: GameObject){
        //move to infinity
        //tell it to stop moving

        // @ts-ignore
        if(this.toBeRemoved.includes(gameObject.guid)){
            GameObject.destroy(gameObject)
        }

        //add to cache
    }



    remove(deadObject: GameObject) {
        //if(this.toBeRemoved.includes(targetid)){
       //    //console.log("Skipping:", targetid)
        //    return
        //}

        /*let deadObject = undefined;
        for (let i = 0; i < this.targets.length; i++) {
            if (this.targets[i].guid === targetid) {
                // @ts-ignore
                deadObject = this.targets[i];
            }
        }*/

        // @ts-ignore
        this.toBeRemoved.push(deadObject.guid)
        this.targets = this.targets.filter(target => target.guid !== deadObject.guid);

        this.fireTargetFromDeadGuy(deadObject)

        GameObject.destroy(deadObject)
        // @ts-ignore
        //this.recycle(deadObject)

        //console.log(this.toBeRemoved)

        // @ts-ignore
        //const moveComponent = GameObject.getComponent(deadObject, MoveTarget)

        // @ts-ignore
        //console.log("dog", targetid, deadObject.position, moveComponent)



        //await this.fireTargetFromDeadGuy(deadObject)
        // @ts-ignore

        //let deadMoveTargetComponent = GameObject.getComponent(deadObject, MoveTarget);
        // @ts-ignore
        //console.log(this.getLevelManager().getLevel1BadGuysCount())
        // @ts-ignore
        //console.log(this.getLevelManager().getLevel3BadGuysCount())

        //console.log(this.targets, this.isStartingNextRound)
        if(!this.gameStarted){
            this.gameStarted = true
            if (this.targets.length === 0 && !this.isStartingNextRound && this.gameStarted ) {
                this.isStartingNextRound = true;
                let levelManager = this.getLevelManager()
                // @ts-ignore
                levelManager.showNextRound()
            }
        }

    }

    getUnclaimedTargets() {
        return this.unclaimedTargets
    }

    claimTarget(targetid){
        this.unclaimedTargets = this.unclaimedTargets.filter(target => target.guid !== targetid);
    }

    checkIfClaimed(targetid) {
        for(let i = 0;i<this.unclaimedTargets.length;i++){
            if(this.unclaimedTargets[i].guid === targetid)
                return false
        }
        return true
    }

    *checkIfRoundIsOver() {
        while(true) {
            console.log("HELLLO")
            if (this.targets.length === 0 && !this.isStartingNextRound && this.gameStarted ) {
                this.isStartingNextRound = true;
                let levelManager = this.getLevelManager()
                // @ts-ignore
                levelManager.showNextRound()
            }
            yield WaitForSeconds(.4)
        }
    }


}