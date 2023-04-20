import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions, AudioSource, showBalloonMessage, FrameEvent } from "@needle-tools/engine";
import { WaitForSeconds } from "@needle-tools/engine/engine/engine_coroutine";
import { InstantiateIdProvider } from "@needle-tools/engine/engine/engine_networking_instantiate";
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
        // @ts-ignore
        this.stopCoroutine(this.badGuy1IntervalGenerator)
        this.badGuy1IntervalGenerator = undefined
        // @ts-ignore
        this.stopCoroutine(this.badGuy2IntervalGenerator)
        this.badGuy2IntervalGenerator = undefined
        // @ts-ignore
        this.stopCoroutine(this.badGuy3IntervalGenerator)
        this.badGuy3IntervalGenerator = undefined
        // @ts-ignore
        this.stopCoroutine(this.badGuy4IntervalGenerator)
        this.badGuy4IntervalGenerator = undefined
        // @ts-ignore
        this.stopCoroutine(this.badGuy5IntervalGenerator)
        this.badGuy5IntervalGenerator = undefined
        // @ts-ignore
        this.stopCoroutine(this.badGuy6IntervalGenerator)
        this.badGuy6IntervalGenerator = undefined
        // @ts-ignore
        this.stopCoroutine(this.badGuy7IntervalGenerator)
        this.badGuy7IntervalGenerator = undefined

    }

    private badGuy1IntervalGenerator: Generator | undefined;
    private badGuy2IntervalGenerator: Generator | undefined;
    private badGuy3IntervalGenerator: Generator | undefined;
    private badGuy4IntervalGenerator: Generator | undefined;
    private badGuy5IntervalGenerator: Generator | undefined;
    private badGuy6IntervalGenerator: Generator | undefined;
    private badGuy7IntervalGenerator: Generator | undefined;

    private badGuy1Buffer = [];
    private badGuy2Buffer = [];
    private badGuy3Buffer = [];
    private badGuy4Buffer = [];
    private badGuy5Buffer = [];
    private badGuy6Buffer = [];
    private badGuy7Buffer = [];

    private badGuy1BufferGenerator: Generator | undefined;
    private badGuy2BufferGenerator: Generator | undefined;

    private gameStarted = false;
    private isStartingNextRound = false;
    private spawnFromDeadGen: Generator | undefined ;

    startGame() {
        //GameObject.setActive(this.object, false);
        if(!this.badGuy1IntervalGenerator) {
            this.badGuy1IntervalGenerator = this.startCoroutine(this.fireTarget(1,  this.badGuy1IntervalGenerator), FrameEvent.Update)
        }
        if(!this.badGuy2IntervalGenerator) {
            this.badGuy2IntervalGenerator = this.startCoroutine(this.fireTarget(2,  this.badGuy2IntervalGenerator), FrameEvent.Update)
        }
        if(!this.badGuy3IntervalGenerator) {
            this.badGuy3IntervalGenerator = this.startCoroutine(this.fireTarget(3,  this.badGuy3IntervalGenerator), FrameEvent.Update)
        }
        if(!this.badGuy4IntervalGenerator) {
            this.badGuy4IntervalGenerator = this.startCoroutine(this.fireTarget(4,  this.badGuy4IntervalGenerator), FrameEvent.Update)
        }
        if( !this.badGuy5IntervalGenerator) {
            this.badGuy5IntervalGenerator = this.startCoroutine(this.fireTarget(5, this.badGuy5IntervalGenerator), FrameEvent.Update)
        }
        if(  !this.badGuy6IntervalGenerator) {
            this.badGuy6IntervalGenerator = this.startCoroutine(this.fireTarget(6,  this.badGuy6IntervalGenerator), FrameEvent.Update)
        }
        if(  !this.badGuy7IntervalGenerator) {
            this.badGuy7IntervalGenerator = this.startCoroutine(this.fireTarget(7,  this.badGuy7IntervalGenerator), FrameEvent.Update)
        }

        this.isStartingNextRound = false

        if( this.gameStarted === false) {
            this.spawnFromDeadGen = this.startCoroutine(this.spawnFromDead(), FrameEvent.EarlyUpdate)
        }
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

    start() {
        this.cacheTargets()
        // await this.delay(3000);
       // this.cacheLevel1Buffer()

    }

    @serializable()
    level1CacheInterval: number | undefined;

    private buffer: GameObject[] = [];
    private bufferLevel2: GameObject[] = [];


    private levelOneSpawn = 0;
    *cacheTarget() {
        while(true) {
            //console.log(`Level ${level} Pool Length ${pool.length}`)
            if(this.badGuy1Buffer.length > 50){
                // @ts-ignore
                this.stopCoroutine(this.badGuy1BufferGenerator)
            }
            this.myPrefab?.instantiate().then(async (prefabTarget) => {
                if(prefabTarget){
                    // @ts-ignore
                    GameObject.getComponent(prefabTarget, MoveTarget).setSpawnNumber(this.levelOneSpawn)
                    prefabTarget.position.set(-3+this.levelOneSpawn*.4, 0, -3.8 - this.levelOneSpawn%10 * .5 )
                    this.levelOneSpawn++;
                    // @ts-ignore
                    this.badGuy1Buffer.push(prefabTarget)
                }
                return this.level2?.instantiate()
            }).then( prefabTarget => {
                if (prefabTarget) {
                    // @ts-ignore
                    GameObject.getComponent(prefabTarget, MoveTarget).setSpawnNumber(this.levelOneSpawn)
                    prefabTarget.position.set(-3 + this.levelOneSpawn * .4, 0, -3.8 - this.levelOneSpawn % 10 * .5)
                    this.levelOneSpawn++;
                    // @ts-ignore
                    this.badGuy2Buffer.push(prefabTarget)
                }
                return this.level3?.instantiate()
            }).then( prefabTarget => {
                if (prefabTarget) {
                    // @ts-ignore
                    GameObject.getComponent(prefabTarget, MoveTarget).setSpawnNumber(this.levelOneSpawn)
                    prefabTarget.position.set(-3 + this.levelOneSpawn * .4, 0, -3.8 - this.levelOneSpawn % 10 * .5)
                    this.levelOneSpawn++;
                    // @ts-ignore
                    this.badGuy3Buffer.push(prefabTarget)
                }
            })
            yield WaitForSeconds(.5);
        }
    }


    private cacheTargets(){
        this.badGuy1BufferGenerator = this.startCoroutine(this.cacheTarget(), FrameEvent.Update)
        //this.badGuy2BufferGenerator = this.startCoroutine(this.cacheTarget(2, this.level2, this.badGuy2Buffer), FrameEvent.Update)
    }

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
            offSetY = scaleComponent?.getScaleY()
        }
        prefab.position.y = offSetY

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

    private getTargetFromPool(level:number){
        if(level === 1){
            return this.badGuy1Buffer.shift()
        }else if(level ===2){
            return this.badGuy2Buffer.shift()
        }else if(level ===3){
            return this.badGuy3Buffer.shift()
        } else {
            return new Error("Something missing")
        }

    }

    private addTargetToPool(level:number, target: GameObject){
        if(level === 1){
            // @ts-ignore
            this.badGuy1Buffer.push(target)
        }else if(level ===2){
            // @ts-ignore
            this.badGuy2Buffer.push(target)
        }else if(level ===3){
            // @ts-ignore
            this.badGuy3Buffer.push(target)
        }
        // @ts-ignore
        let levelOneSpawn = GameObject.getComponent(target, MoveTarget).getSpawnNumber()
        // @ts-ignore

        target.position.set(-3+levelOneSpawn*.4, 1000, -3.8 - levelOneSpawn%10 * .5 )
        let deadMoveTargetComponent = GameObject.getComponent(target, MoveTarget);
        // @ts-ignore
        deadMoveTargetComponent.setCurrentWaypoint(0);
        // @ts-ignore
        deadMoveTargetComponent.setInactive();

    }

    *fireTarget(level , coroutine: Generator | undefined) {
        while(true) {
            let levelManager = this.getLevelManager()

            if(level === 3){
                // @ts-ignore
                console.log(`Bad guy count ${levelManager.getBadGuysCount(level)}`)
            }
            // @ts-ignore
            if (levelManager.getBadGuysCount(level) <= 0) {
                // @ts-ignore
                this.stopCoroutine(coroutine)
            } else {
                if(level===1 ){
                    if(this.level1Counter%5 === 0 && this.level1Counter !== 0) {
                        yield WaitForSeconds(1);
                    }
                    this.level1Counter ++
                }
                if(level===2 ){
                    if(this.level2Counter === 0) { //this.level2Counter%5 === 0 ||
                        yield WaitForSeconds(1.3);
                    } else if (this.level2Counter%5 === 0){
                        yield WaitForSeconds(1);
                    }
                    this.level2Counter ++
                }

                if(level===3 ){
                    if(this.level3Counter === 0) { //this.level2Counter%5 === 0 ||
                        yield WaitForSeconds(1.8);
                    } else if (this.level3Counter%6 === 0){
                        yield WaitForSeconds(1);
                    }
                    this.level3Counter ++
                }

                if(level===4 ){
                    if(this.level4Counter === 0) { //this.level2Counter%5 === 0 ||
                        yield WaitForSeconds(2);
                    } else if (this.level4Counter%3 === 0){
                        yield WaitForSeconds(.5);
                    }
                    this.level4Counter ++
                }

                if(level===5 ){
                    if(this.level5Counter === 0) { //this.level2Counter%5 === 0 ||
                        yield WaitForSeconds(1);
                    } else if (this.level5Counter%4 === 0){
                        yield WaitForSeconds(.5);
                    }
                    this.level5Counter ++
                }

                if(level===6 ){
                    this.level6Counter ++
                }

                if(level===7 ){
                    this.level7Counter ++
                }

                let prefabTarget = this.getTargetFromPool(level)
                //console.log( `Level 1 remove Count ${this.badGuy1Buffer.length}`)
                // @ts-ignore
                let moveTargetComponent = GameObject.getComponent(prefabTarget, MoveTarget);
                // @ts-ignore
                moveTargetComponent.setLevel(level)
                // @ts-ignore
                moveTargetComponent.onStart();
                // moveTargetComponent.setWayPoints()
                this.offSetY(prefabTarget)
                // @ts-ignore
                console.log(`Pushing ${GameObject.getComponent(prefabTarget, MoveTarget).getTargetId()}`)
                // @ts-ignore
                // @ts-ignore
                this.targets.push(prefabTarget);
                // @ts-ignore
                this.unclaimedTargets.push(prefabTarget);
                console.log(this.targets)
                // @ts-ignore
                levelManager.decreaseBadGuysCount(level)
                // @ts-ignore
                // @ts-ignore

            }

            const min = 150;
            const max = 450;
            const randomNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
            yield WaitForSeconds(randomNumber / 1000);


        }
    }

    instantiateFromDead( prefab: GameObject, deadGameObject : GameObject | undefined, waypoint: number, newLevel: number){
        let moveTargetComponent = GameObject.getComponent(prefab, MoveTarget);
        if(moveTargetComponent === null ){
            if( prefab === null ){
                // @ts-ignore
                GameObject.destroy(deadGameObject)
                return
            }
            prefab.position.set(0, 1000, 0)
            // @ts-ignore
            GameObject.destroy(deadGameObject)
            return

        }
        // @ts-ignore
        moveTargetComponent.setLevel(newLevel)
        // @ts-ignore
        moveTargetComponent.setCurrentWaypoint(waypoint)
        // @ts-ignore
        prefab.position.set(deadGameObject.position.x, deadGameObject.position.y , deadGameObject.position.z)
        // @ts-ignore
        this.targets.push(prefab);
        // @ts-ignore
        this.unclaimedTargets.push(prefab);
    }



    fireTargetFromDeadGuy(deadLevel:number,  deadGameObject?: GameObject | undefined) {
        // @ts-ignore
        let deadCurrentWayPoint= deadMoveTargetComponent.getCurrentWaypoint();

        let newLevel;
        let prefabTarget;

        if( deadLevel == 3 ) {
            newLevel = 2;
            prefabTarget = this.getTargetFromPool(newLevel)
            this.instantiateFromDead(prefabTarget, deadGameObject, deadCurrentWayPoint, newLevel)
            // @ts-ignore
            //GameObject.destroy(deadGameObject)
        } else if ( deadLevel == 2 ){
            newLevel = 1;
            prefabTarget = this.getTargetFromPool(newLevel)
            this.instantiateFromDead(prefabTarget, deadGameObject, deadCurrentWayPoint, newLevel)
        } else if ( deadLevel === 4){
            this.level3?.instantiate().then(async (result) => {
                prefabTarget = result;
                newLevel = 3;
                this.instantiateFromDead(prefabTarget, deadGameObject, deadCurrentWayPoint, newLevel)
                // @ts-ignore
                GameObject.destroy(deadGameObject)
            })
        } else if ( deadLevel === 5){
            this.level4?.instantiate().then(async (result) => {
                prefabTarget = result;
                newLevel = 4;
                this.instantiateFromDead(prefabTarget, deadGameObject, deadCurrentWayPoint, newLevel)
                // @ts-ignore
                GameObject.destroy(deadGameObject)
            })
        } else if ( deadLevel === 6){
            this.level5?.instantiate().then(async (result) => {
                prefabTarget = result;
                newLevel = 5;
                this.instantiateFromDead(prefabTarget, deadGameObject, deadCurrentWayPoint, newLevel)
                // @ts-ignore
                GameObject.destroy(deadGameObject)
            })
        } else if ( deadLevel === 7){
            this.level6?.instantiate().then(async (result) => {
                prefabTarget = result;
                newLevel = 6;
                this.instantiateFromDead(prefabTarget, deadGameObject, deadCurrentWayPoint, newLevel)
                // @ts-ignore
                GameObject.destroy(deadGameObject)
            })
        }
    }

    getTargets(){
        return this.targets;
    }


    remove(deadObject: GameObject, spawnNextLevel: boolean) {
        // @ts-ignore
        this.targets = this.targets.filter(target => GameObject.getComponent(target, MoveTarget).getTargetId() !== GameObject.getComponent(deadObject, MoveTarget).getTargetId());

        this.shotAtLeastOnceThisRound = true
        // @ts-ignore
        this.deadList.push({"deadGuy":deadObject, "spawnNextLevel":spawnNextLevel}) //.fireTargetFromDeadGuy(deadObject)

        if(!this.gameStarted){
            this.gameStarted = true
            if (this.targets.length === 0 && !this.isStartingNextRound && this.gameStarted ) {
                this.isStartingNextRound = true;
                let levelManager = this.getLevelManager()
                // @ts-ignore
                levelManager.showNextRound()
                this.level1Counter = 0;
                this.level2Counter = 0;
                this.level3Counter = 0;
                this.level4Counter = 0;
                this.level5Counter = 0;
                this.level6Counter = 0;
                this.level7Counter = 0;
            }
        }
    }

    public getDeadList(){
        return this.deadList
    }

    murder(deadObject: GameObject) {
        // @ts-ignore
        this.targets = this.targets.filter(target => target.guid !== deadObject.guid);

        // @ts-ignore
        GameObject.destroy(GameObject) //.fireTargetFromDeadGuy(deadObject)

    }

    getUnclaimedTargets() {
        return this.unclaimedTargets
    }

    claimTarget(targetid){
        // @ts-ignore
        this.unclaimedTargets = this.unclaimedTargets.filter(target => GameObject.getComponent(target, MoveTarget).getTargetId()  !== targetid);
    }

    checkIfClaimed(targetid) {
        for(let i = 0;i<this.unclaimedTargets.length;i++){
            // @ts-ignore
            if(GameObject.getComponent(this.unclaimedTargets[i], MoveTarget).getTargetId() === targetid)
                return false
        }
        return true
    }

    private shotAtLeastOnceThisRound = false;
    *checkIfRoundIsOver() {
        while(true) {
            if (this.targets.length === 0 && !this.isStartingNextRound && this.gameStarted && this.shotAtLeastOnceThisRound) {
                this.shotAtLeastOnceThisRound = false;
                this.isStartingNextRound = true;
                let levelManager = this.getLevelManager()
                // @ts-ignore
                levelManager.showNextRound()
                this.level1Counter = 0;
                this.level2Counter = 0;
                this.level3Counter = 0;
                this.level4Counter = 0;
                this.level5Counter = 0;
                this.level6Counter = 0;
                this.level7Counter = 0;
            }
            yield WaitForSeconds(.6)
        }
    }

    private deadList = [];

    *spawnFromDead(){
        while(true){

            //let deadObject =   this.deadList[1]
            //for(let i=0;i<this.deadList.length;i++) {
            let deadObject = this.deadList.shift() //[i]
            if( deadObject ){


                let deadMoveTargetComponent = GameObject.getComponent(deadObject["deadGuy"], MoveTarget);
                // @ts-ignore
                let deadLevel = deadMoveTargetComponent.getLevel();

                //if(  deadObject["spawnNextLevel"] === true && deadLevel > 1 ) {
                ///    this.fireTargetFromDeadGuy(deadLevel, deadObject["deadGuy"])
                //} else {

                    // @ts-ignore
                this.addTargetToPool(deadLevel, deadObject["deadGuy"])
                //console.log( `Level 1  add Count ${this.badGuy1Buffer.length}`)

                //}

            }
            //console.log( this.deadList, this.unclaimedTargets, this.targets)
            yield WaitForSeconds(.1)
        }
    }

}