import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions } from "@needle-tools/engine";

import { Animator} from "@needle-tools/engine/engine-components/Animator"
import {Cache, Color, Object3D, Quaternion, Vector3} from "three";
import {TargetManager} from "./TargetManager";
import {GameManager} from "./GameManager";
import {Counter} from "./Counter";
import {MoveTarget} from "./MoveTarget"
import {tangentGeometry} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";


export class ShootRadialProjectiles extends Behaviour {

    @serializable(AssetReference)
    bullet1?: AssetReference;
    @serializable(AssetReference)
    bullet2?: AssetReference;
    @serializable(AssetReference)
    bullet3?: AssetReference;
    @serializable(AssetReference)
    bullet4?: AssetReference;
    @serializable(AssetReference)
    bullet5?: AssetReference;
    @serializable(AssetReference)
    bullet6?: AssetReference;
    @serializable(AssetReference)
    bullet7?: AssetReference;
    @serializable(AssetReference)
    bullet8?: AssetReference;

    @serializable()
    radius?: number = 1

    private shotsFired = {
        "1": undefined,
        "2": undefined,
        "3": undefined,
        "4": undefined,
        "5": undefined,
        "6": undefined,
        "7": undefined,
        "8": undefined
    }

    private target: GameObject | undefined;

    @serializable()
    interval?: number = 1000

    @serializable()
    speed = 1;

    async start() {
        await this.altStart()

        //setInterval(() => {
        //    this.shootProjectile();
        //}, this.interval);
    }


    async altStart(){

        const opt = new InstantiateOptions();
        opt.parent = this.context.scene.getObjectByName("Content");
        //opt.visible = false

        await this.bullet1?.instantiate(opt)
            .then((result) => {
                console.log("here")
                // @ts-ignore
                this.shotsFired[1] = result;
                // @ts-ignore
                this.shotsFired[1].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                const opt1 = new InstantiateOptions();
                opt1.parent = this.context.scene.getObjectByName("Content");
                return this.bullet2?.instantiate(opt1)
            })
            .then((result) => {
                // @ts-ignore
                this.shotsFired[2] = result;
                // @ts-ignore
                this.shotsFired[2].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                const opt2 = new InstantiateOptions();
                //opt2.visible = false
                opt2.parent = this.context.scene.getObjectByName("Content");
                return this.bullet3?.instantiate(opt2)
            })
            .then((result) => {
                // @ts-ignore
                this.shotsFired[3] = result;
                // @ts-ignore
                this.shotsFired[3].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                const opt3 = new InstantiateOptions();
               // opt3.visible = false
                opt3.parent = this.context.scene.getObjectByName("Content");
                return this.bullet4?.instantiate(opt3)
            })
            .then((result) => {
                // @ts-ignore
                this.shotsFired[4] = result;
                // @ts-ignore
                this.shotsFired[4].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                const opt4 = new InstantiateOptions();
              //  opt4.visible = false
                opt4.parent = this.context.scene.getObjectByName("Content");
                return this.bullet5?.instantiate(opt4)
            })
            .then((result) => {
                // @ts-ignore
                this.shotsFired[5] = result;
                // @ts-ignore
                this.shotsFired[5].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                const opt5 = new InstantiateOptions();
               // opt5.visible = false
                opt5.parent = this.context.scene.getObjectByName("Content");
                return this.bullet6?.instantiate(opt5)
            })
            .then((result) => {
                // @ts-ignore
                this.shotsFired[6] = result;
                // @ts-ignore
                this.shotsFired[6].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                const opt6 = new InstantiateOptions();
               // opt6.visible = false
                opt6.parent = this.context.scene.getObjectByName("Content");
                return this.bullet7?.instantiate(opt6)
            })
            .then((result) => {
                // @ts-ignore
                this.shotsFired[7] = result;
                // @ts-ignore
                this.shotsFired[7].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                const opt7 = new InstantiateOptions();
                //opt7.visible = false
                opt7.parent = this.context.scene.getObjectByName("Content");
                return this.bullet8?.instantiate(opt7)
            })
            .then((result) => {
                // @ts-ignore
                this.shotsFired[8] = result;
                // @ts-ignore
                this.shotsFired[8].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
            })

    }

    async firstUnclaimedTargetInRadius() {
        // @ts-ignore
        let tm = this.getTargetManager()
        // @ts-ignore
        let targets: GameObject[] = tm.getTargets();

        for (let i = 0; i < targets.length; i++) {
            //for (let i = targets.length - 1; i >= 0; i--) {
            // @ts-ignore
            //console.log( tm.checkIfClaimed(targets[i].guid))
            ///console.log( tm.getUnclaimedTargets().length)
            // @ts-ignore
            // @ts-ignore
            if( this.withinRadius(targets[i]) ) {
                // @ts-ignore
                this.shotsFired[1].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                // @ts-ignore
                this.shotsFired[2].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                // @ts-ignore
                this.shotsFired[3].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                // @ts-ignore
                this.shotsFired[4].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                // @ts-ignore
                this.shotsFired[5].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                // @ts-ignore
                this.shotsFired[6].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                // @ts-ignore
                this.shotsFired[7].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                // @ts-ignore
                this.shotsFired[8].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)

                // @ts-ignore
                GameObject.setActive(this.shotsFired[1], true, false, true) //, true)
                // @ts-ignore
                GameObject.setActive(this.shotsFired[2], true, false, true) //, true)
                // @ts-ignore
                GameObject.setActive(this.shotsFired[3], true, false, true) //, true)
                // @ts-ignore
                GameObject.setActive(this.shotsFired[4], true, false, true) //, true)
                // @ts-ignore
                GameObject.setActive(this.shotsFired[5], true, false, true) //, true)
                // @ts-ignore
                GameObject.setActive(this.shotsFired[6], true, false, true) //, true)
                // @ts-ignore
                GameObject.setActive(this.shotsFired[7], true, false, true) //, true)
                // @ts-ignore
                GameObject.setActive(this.shotsFired[8], true, false, true) //, true)


                let a = GameObject.getComponents(this.gameObject, Animator)[0];
                if(a !== undefined){
                    a.Play("top1", -1, 0, 0); // Play "top1" on layer 0
                    a.Play("top3", 1, 0, 1);
                    //console.log(a)
                }

            }  //&& !tm.checkIfClaimed(targets[i].guid)
        }
        return false
    }

    ifAtLeastOneBulletIsStillActive() {
        for (const value of Object.values(this.shotsFired)) {
            // @ts-ignore

            if (GameObject.isActiveSelf(value)) {
                return true;
            }
        }
        return false
    }

    async setProjetile( index, prefab){
        let projectile = await prefab?.instantiate() as GameObject
        if (projectile != undefined) {
            // @ts-ignore
            this.shotsFired[index] = projectile;
            // @ts-ignore
            this.shotsFired[index].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
        }
    }

    async shootProjectile() {
        let tm = this.getTargetManager()
        // @ts-ignore
        if (tm.getTargets().length > 0) {

            if (!this.ifAtLeastOneBulletIsStillActive()) {
               if( await this.firstUnclaimedTargetInRadius()) {
                    // @ts-ignore
                    console.log("In Radius")
                }
           }
        }
    }

    getTargetManager() {
        const TargetManagerGM = this.context.scene.getObjectByName("TargetManager")
        // @ts-ignore
        return GameObject.getComponent(TargetManagerGM, TargetManager);
    }

    getCashCounter() {
        const CashCounter = this.context.scene.getObjectByName("CashCounter")

        // @ts-ignore
        return GameObject.getComponent(CashCounter, Counter);
    }

    withinRadius() {
        let tm = this.getTargetManager()
        // @ts-ignore
        let targets: GameObject[] = tm.getTargets();

        for (let i = 0; i < targets.length; i++) {
            if( this.gameObject.position.distanceTo(targets[0].position) < 1 ){
                return true
            }

        }
        for(const key in this.shotsFired) {
            if(this.shotsFired[key]!==undefined) {
                this.shotsFired[key].position.set(this.gameObject.position.x, this.gameObject.position.y + .1, this.gameObject.position.z)
                 this.shotsFired[key].shotNumber = 1
            }
        }
        return false
        /*for (let i = 0; i < targets.length; i++) {
            // @ts-ignore
            if( this.gameObject.position.distanceTo(target.position) < 1 ){
                return true
            }
        }*/
    }

    private isAnimating = false
    private  shotNumber = 0

    async playAnimationAndWaitForTenSeconds(): Promise<void> {
        let a = GameObject.getComponents(this.gameObject, Animator)[0];
        if(a !== undefined){
            a.Play("top1", -1, 0, 0); // Play "top1" on layer 0
            a.Play("top3", 1, 0, 1);
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 10 seconds
            this.isAnimating = false;
        }
    }

    updateProjectilePosition(){

        let angle = (2 * Math.PI) / 8; // divide 360 degrees into 8 equal parts
        let radius = this.speed  * this.context.time.deltaTime;
        //let center = this.gameObject.position;
        //console.log(this.context.time.deltaTime)

        for(const key in this.shotsFired) {
            if( this.shotsFired[key] !== undefined ){
                if( this.withinRadius()) {
                    if (!this.isInFuture(this.shotsFired[key]?.shotNumber)) {
                        let x = this.shotsFired[key].position.x + radius * Math.cos(angle * Number(key));
                        let z = this.shotsFired[key].position.z + radius * Math.sin(angle * Number(key));
                        let direction = new Vector3().subVectors(new Vector3(x, this.shotsFired[key].position.y, z), this.shotsFired[key].position);
                        direction.normalize();
                        let velocity = direction.multiplyScalar(this.speed);
                        this.shotsFired[key].position.add(velocity.clone().multiplyScalar(this.context.time.deltaTime));

                        let distance = this.shotsFired[key].position.distanceTo(this.gameObject.position);

                        if( distance > .1 && !this.isAnimating) {
                            this.isAnimating = true;
                            this.playAnimationAndWaitForTenSeconds().then(() => {
                                // do something after animation has finished playing and 10 seconds have elapsed
                            });
                        }

                        if (distance > .8) {
                            //GameObject.setActive(this.shotsFired[key], false, false, true) //, true)
                            //console.log( GameObject.isActiveSelf(this.shotsFired[key]), key )
                            // @ts-ignore
                            this.shotsFired[key].position.set(this.gameObject.position.x, this.gameObject.position.y + .1, this.gameObject.position.z)
                            if (this.shotsFired[key].shotNumber === undefined) {
                                this.shotsFired[key].shotNumber = 1
                            } else {
                                this.shotsFired[key].shotNumber = this.shotsFired[key].shotNumber + 1
                            }
                        }
                    }
                }
            }
        }
    }

    private isInFuture(shotNumber){
        for(const value of Object.values(this.shotsFired)) {
            // @ts-ignore
            if( value.shotNumber === undefined){
                return false
            }

            // @ts-ignore
            if( shotNumber > value.shotNumber){
                return true
            }
        }
        return false
    }



    test() {
        let tm = this.getTargetManager()
        for(const key in this.shotsFired) {
            // @ts-ignore
            let targets: GameObject[] = tm.getTargets();
            for (let i = 0; i < targets.length; i++) {
                if (this.shotsFired[key] !== undefined ) {
                    if (this.shotsFired[key].position.distanceTo(targets[i].position) < .2) {
                        let getCashCounter = this.getCashCounter()
                        // @ts-ignore
                        //console.log(healthCounter.getValue())
                        //getCashCounter.add(1);
                        //Here
                        // @ts-ignore
                        tm.remove(targets[i].uuid)
                        if(this.shotsFired[key].shotNumber===undefined){
                            this.shotsFired[key].shotNumber = 1
                        }else{
                            this.shotsFired[key].shotNumber = this.shotsFired[key].shotNumber + 1
                        }
                        //GameObject.setActive(this.shotsFired[key], false, false, true) //, true)
                        //console.log( GameObject.isActiveSelf(this.shotsFired[key]), key )*/
                        // @ts-ignore
                        this.shotsFired[key].position.set(this.gameObject.position.x, this.gameObject.position.y+.1, this.gameObject.position.z)
                    }
                }
            }
        }
    }

    update() {
        //if (this.allFiring()) {
            //console.log("All firing")
            // Set starting position of shot
            this.updateProjectilePosition()
            // @ts-ignore
            this.test()
            // @ts-ignore

        //}
    }
}