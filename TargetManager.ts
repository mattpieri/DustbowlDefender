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

    private badGuy1Interval: NodeJS.Timeout | undefined;
    private badGuy1IntervalGenerator: Generator | undefined;
    private badGuy2Interval: NodeJS.Timeout | undefined;
    private badGuy2IntervalGenerator: Generator | undefined;
    private badGuy3Interval: NodeJS.Timeout | undefined;
    private badGuy3IntervalGenerator: Generator | undefined;

    private isStartingNextRound = false;

    /*async startGame() {
        return
        await Promise.all([
            this.startInterval1(),
            this.startInterval2(),
            this.startInterval3(),
        ]).then(() =>{
            this.isStartingNextRound = false
        });
    }*/

    startGame() {
        //GameObject.setActive(this.object, false);
        this.badGuy1IntervalGenerator = this.startCoroutine(this.testFireTarget(1),  FrameEvent.Update)
        this.badGuy2IntervalGenerator = this.startCoroutine(this.testFireTarget(2),  FrameEvent.Update)
        this.badGuy3IntervalGenerator = this.startCoroutine(this.testFireTarget(3),  FrameEvent.Update)
        this.isStartingNextRound = false
        //this.startCoroutine(this.recycleRoutine(),  FrameEvent.Update)
    }


    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async start() {
        await this.delay(3000);
        this.cacheLevel1Buffer()
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
                    prefabTarget.position.y = -1000
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
                    prefabTarget.position.y = -1000
                })
            }
        };
        setInterval(addToLevel2Buffer, 500);
    }

    stopInterval1() {
        if (this.badGuy1Interval) {
            clearInterval(this.badGuy1Interval);
            this.badGuy1Interval = undefined;
        }
    }

    stopInterval2() {
        if (this.badGuy2Interval) {
            clearInterval(this.badGuy2Interval);
            this.badGuy2Interval = undefined;
        }
    }

    stopInterval3() {
        if (this.badGuy3Interval) {
            clearInterval(this.badGuy3Interval);
            this.badGuy3Interval = undefined;
        }
    }

    private startInterval1() {
        let levelManager = this.getLevelManager()
        // @ts-ignore


        if(levelManager.getLevel1BadGuysCount() > 0 ) {
            const fireLevel2 = async () => {
                await this.fireTarget(1);
            };
            this.badGuy1Interval = setInterval(fireLevel2, 533);
        }
    }


    private startInterval2() {
        let levelManager = this.getLevelManager()
        // @ts-ignore
        if(levelManager.getLevel2BadGuysCount() > 0) {
            const fireLevel2 = async () => {
                await this.fireTarget(2);
            };
            this.badGuy2Interval = setInterval(fireLevel2, 650);
        }
    }

    private startInterval3() {
        let levelManager = this.getLevelManager()
        // @ts-ignore
        if(levelManager.getLevel3BadGuysCount() > 0 ) {
            const fireLevel3 = async () => {
                await this.fireTarget(3);
            };
            this.badGuy3Interval = setInterval(fireLevel3, 754);
        }
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

    *testFireTarget(level) {
        while(true) {
            let levelManager = this.getLevelManager()

            if (level === 1) {
                // @ts-ignore
                if (levelManager.getLevel1BadGuysCount() <= 0) {
                    // @ts-ignore
                    this.stopCoroutine(this.badGuy1IntervalGenerator)
                } else {
                    this.myPrefab?.instantiate().then(async (prefabTarget) => {
                        let moveTargetComponent = GameObject.getComponent(prefabTarget, MoveTarget);
                        // @ts-ignore
                        moveTargetComponent.setLevel(level)

                       // moveTargetComponent.setWayPoints()
                        this.offSetY(prefabTarget)
                        // @ts-ignore
                        this.targets.push(prefabTarget);
                        // @ts-ignore
                        this.unclaimedTargets.push(prefabTarget);
                        // @ts-ignore
                        levelManager.decreaseLevel1BadGuysCount()
                        // @ts-ignore

                    })
                }
                const min = 150;
                const max = 450;
                const randomNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
                yield WaitForSeconds(randomNumber / 1000);

            } else if ( level === 2) {
                // @ts-ignore
                if (levelManager.getLevel2BadGuysCount() <= 0) {
                    // @ts-ignore
                    this.stopCoroutine(this.badGuy2IntervalGenerator)
                } else {
                    this.level2?.instantiate().then(async (prefabTarget) => {
                        let moveTargetComponent = GameObject.getComponent(prefabTarget, MoveTarget);
                        // @ts-ignore
                        moveTargetComponent.setLevel(level)
                        this.offSetY(prefabTarget)
                        // @ts-ignore
                        this.targets.push(prefabTarget);
                        // @ts-ignore
                        this.unclaimedTargets.push(prefabTarget);
                        // @ts-ignore
                        levelManager.decreaseLevel2BadGuysCount()

                    })
                }

                const min = 150;
                const max = 450;
                const randomNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
                yield WaitForSeconds(randomNumber / 1000);

            }else if ( level === 3) {
                // @ts-ignore
                if (levelManager.getLevel3BadGuysCount() <= 0) {
                    // @ts-ignore
                    this.stopCoroutine(this.badGuy3IntervalGenerator)
                } else {
                    this.level3?.instantiate().then(async (prefabTarget) => {
                        let moveTargetComponent = GameObject.getComponent(prefabTarget, MoveTarget);
                        // @ts-ignore
                        moveTargetComponent.setLevel(level)
                        this.offSetY(prefabTarget)
                        // @ts-ignore
                        this.targets.push(prefabTarget);
                        // @ts-ignore
                        this.unclaimedTargets.push(prefabTarget);
                        // @ts-ignore
                        // @ts-ignore
                        levelManager.decreaseLevel3BadGuysCount()

                    })
                }
                const min = 150;
                const max = 450;
                const randomNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
                yield WaitForSeconds(randomNumber / 1000);

            }
        }
    }

    async fireTarget(level){

        let levelManager = this.getLevelManager()

        if( level === 1) {
             await this.myPrefab?.instantiate().then(async (prefabTarget) => {
                 let moveTargetComponent = GameObject.getComponent(prefabTarget, MoveTarget);

                 // @ts-ignore
                 moveTargetComponent.setLevel(level)
                 this.offSetY(prefabTarget)
                 // @ts-ignore
                 this.targets.push(prefabTarget);
                 // @ts-ignore
                 this.unclaimedTargets.push(prefabTarget);
                 // @ts-ignore
                 levelManager.decreaseLevel1BadGuysCount()
                 // @ts-ignore
                 if (levelManager.getLevel1BadGuysCount() <= 0) {
                     await this.stopInterval1()
                 }
             })

        } else if ( level === 2) {
            await this.level2?.instantiate().then(async (prefabTarget) => {
                let moveTargetComponent = GameObject.getComponent(prefabTarget, MoveTarget);

                // @ts-ignore
                moveTargetComponent.setLevel(level)
                this.offSetY(prefabTarget)
                // @ts-ignore
                this.targets.push(prefabTarget);
                // @ts-ignore
                this.unclaimedTargets.push(prefabTarget);
                // @ts-ignore
                levelManager.decreaseLevel2BadGuysCount()
                // @ts-ignore
                if (levelManager.getLevel2BadGuysCount() <= 0) {
                    await this.stopInterval2()
                }
            })
        }else if ( level === 3) {
            await this.level3?.instantiate().then(async (prefabTarget) => {
                let moveTargetComponent = GameObject.getComponent(prefabTarget, MoveTarget);

                // @ts-ignore
                moveTargetComponent.setLevel(level)
                this.offSetY(prefabTarget)
                // @ts-ignore
                this.targets.push(prefabTarget);
                // @ts-ignore
                this.unclaimedTargets.push(prefabTarget);
                // @ts-ignore
                // @ts-ignore
                levelManager.decreaseLevel3BadGuysCount()
                // @ts-ignore
                if (levelManager.getLevel3BadGuysCount() <= 0) {
                    await this.stopInterval3()
                }
            })
        } else {

        }

    }


    fireTargetFromDeadGuy( deadGameObject?: GameObject) {
        // @ts-ignore
        let deadMoveTargetComponent = GameObject.getComponent(deadGameObject, MoveTarget);
        // @ts-ignore

        if(deadMoveTargetComponent === undefined ){
            return
        }

        // @ts-ignore
        let deadLevel = deadMoveTargetComponent.getLevel();
        // @ts-ignore
        let deadCurrentWayPoint= deadMoveTargetComponent.getCurrentWaypoint();
        let newLevel;

        if( deadLevel == 3 ) {

            let prefabTarget = this.bufferLevel2.pop();

            if( prefabTarget === undefined){
                throw new Error(" oooonn nooo WOOOOOOOOOOOOOAH")
            }

            newLevel = 2;
            let moveTargetComponent = GameObject.getComponent(prefabTarget, MoveTarget);

            // @ts-ignore
            moveTargetComponent.setLevel(newLevel)

            // @ts-ignore
            moveTargetComponent.setCurrentWaypoint(deadCurrentWayPoint)

            // @ts-ignore
            prefabTarget.position.set(deadGameObject.position.x, deadGameObject.position.y, deadGameObject.position.z)

            // @ts-ignore
            this.targets.push(prefabTarget);
            // @ts-ignore
            this.unclaimedTargets.push(prefabTarget);

            // @ts-ignore
            //GameObject.destroy(deadGameObject)

        } else if ( deadLevel == 2 ){
             //await this.myPrefab2?.instantiate().then( (prefabTarget) => {
            let prefabTarget = this.buffer.pop();

            newLevel = 1;
            // @ts-ignore
            let moveTargetComponent = GameObject.getComponent(prefabTarget, MoveTarget);


            if( moveTargetComponent === null || moveTargetComponent === undefined){
                throw new Error(" WEE WOOOOOOOOOOOOOAH")
            }

            // @ts-ignore
            moveTargetComponent.setLevel(newLevel)

            // @ts-ignore
            moveTargetComponent.setActive2()

            // @ts-ignore
             moveTargetComponent.setCurrentWaypoint(deadCurrentWayPoint)

             // @ts-ignore
             prefabTarget.position.set(deadGameObject.position.x, deadGameObject.position.y, deadGameObject.position.z)

             // @ts-ignore
             this.targets.push(prefabTarget);
             // @ts-ignore
             this.unclaimedTargets.push(prefabTarget);
             // @ts-ignore
             //GameObject.destroy(deadGameObject)


        } else if(deadLevel == 1  ) {

            // @ts-ignore
            //GameObject.destroy(deadGameObject)
            return
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

        if (this.targets.length === 0 && !this.isStartingNextRound) {
            this.isStartingNextRound = true;
            let levelManager = this.getLevelManager()
            // @ts-ignore
            levelManager.showNextRound()
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


}