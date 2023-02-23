import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions } from "@needle-tools/engine";
import { Object3D, Vector3} from "three";

import { MoveTarget} from "./MoveTarget";
import {LevelManager} from "./LevelManager";

export class TargetManager extends Behaviour {

    @serializable(AssetReference)
    myPrefab?: AssetReference;

    @serializable(AssetReference)
    level2?: AssetReference;

    @serializable(AssetReference)
    level3?: AssetReference;

    private targets: GameObject[] = [];
    private unclaimedTargets: GameObject[] = [];

    private badGuy1Interval: NodeJS.Timeout | undefined;
    private badGuy2Interval: NodeJS.Timeout | undefined;
    private badGuy3Interval: NodeJS.Timeout | undefined;

    private isStartingNextRound = false;

    async start() {
        await Promise.all([
            this.startInterval1(),
            this.startInterval2(),
            this.startInterval3(),
        ]).then(() =>{
            this.isStartingNextRound = false
        });
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
        if(levelManager.getLevel1BadGuysCount() > 0) {
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
        if(levelManager.getLevel3BadGuysCount() > 0) {
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

    async fireTarget(level){
        let prefabTarget;

        let levelManager = this.getLevelManager()

        if( level === 1) {
             await this.myPrefab?.instantiate().then(async (prefabTarget) => {
                 let moveTargetComponent = GameObject.getComponent(prefabTarget, MoveTarget);

                 // @ts-ignore
                 moveTargetComponent.setLevel(level)
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
            // @ts-ignore

        } else if ( level === 2) {
            await this.level2?.instantiate().then(async (prefabTarget) => {
                let moveTargetComponent = GameObject.getComponent(prefabTarget, MoveTarget);

                // @ts-ignore
                moveTargetComponent.setLevel(level)
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
            throw new Error("level is incorrect")
        }

    }

    async fireTargetFromDeadGuy( deadGameObject?: GameObject) {
        // @ts-ignore
        let deadMoveTargetComponent = GameObject.getComponent(deadGameObject, MoveTarget);
        // @ts-ignore
        let deadLevel = deadMoveTargetComponent.getLevel();
        // @ts-ignore
        let deadCurrentWayPoint= deadMoveTargetComponent.getCurrentWaypoint();
        let newLevel;

        if( deadLevel == 3 ) {

            await this.level2?.instantiate().then((prefabTarget)=>{
                if( prefabTarget === null ){
                    return
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

            });
            // @ts-ignore


        } else if ( deadLevel == 2 ){
             await this.myPrefab?.instantiate().then((prefabTarget)=>{
                 if( prefabTarget === null ){
                     return
                 }

                newLevel = 1;
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

            });

        } else if(deadLevel == 1  ) {
            return
        }

    }

    getTargets(){
        return this.targets;
    }

    async remove(targetid) {
        for (let i = 0; i < this.targets.length; i++) {
            if (this.targets[i].guid === targetid) {
                // @ts-ignore
                let deadObject = this.targets[i];

                await this.fireTargetFromDeadGuy(deadObject)
                this.targets = this.targets.filter(target => target.guid !== targetid);
            }
        }

        //console.log(this.targets)

        if (this.targets.length === 0 && !this.isStartingNextRound) {
            this.isStartingNextRound = true;
            let levelManager = this.getLevelManager()
            // @ts-ignore
            await levelManager.startNextRound()
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