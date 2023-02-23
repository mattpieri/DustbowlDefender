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
    interval?: number = 500

    @serializable()
    speed = 1;

    async start() {

        setInterval(() => {
            this.shootProjectile();
        }, this.interval);
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
                await this.setProjetile("1", this.bullet1);
                await this.setProjetile("2", this.bullet2);
                await this.setProjetile("3", this.bullet3);
                await this.setProjetile("4", this.bullet4);
                await this.setProjetile("5", this.bullet5);
                await this.setProjetile("6", this.bullet6);
                await this.setProjetile("7", this.bullet7);
                await this.setProjetile("8", this.bullet8);

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

    allFiring() {
        for (const value of Object.values(this.shotsFired)) {
            if (value === undefined) {
                return false;
            }
        }
        return true;
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

            if (!this.allFiring()) {
               if( await this.firstUnclaimedTargetInRadius()) {
                    // @ts-ignore
                    console.log("In Radius")
                    //for(const key in this.shotsFired) {
                        // @ts-ignore
                    /*this.shotsFired["1"]= await this.bullet1?.instantiate(this.gameObject) as GameObject;
                    // @ts-ignore
                    this.shotsFired["2"]= await this.bullet2?.instantiate(this.gameObject) as GameObject;
                    // @ts-ignore
                    this.shotsFired["3"]= await this.bullet3?.instantiate(this.gameObject) as GameObject;
                    // @ts-ignore
                    this.shotsFired["4"]= await this.bullet4?.instantiate(this.gameObject) as GameObject;
                    // @ts-ignore
                    this.shotsFired["5"]= await this.bullet5?.instantiate(this.gameObject) as GameObject;
                    // @ts-ignore
                    this.shotsFired["6"]= await this.bullet6?.instantiate(this.gameObject) as GameObject;
                    // @ts-ignore
                    this.shotsFired["7"]= await this.bullet7?.instantiate(this.gameObject) as GameObject;
                    // @ts-ignore
                    this.shotsFired["8"]= await this.bullet8?.instantiate(this.gameObject) as GameObject;*/

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

    withinRadius(target: GameObject) {
        // @ts-ignore
        return this.gameObject.position.distanceTo(target.position) < this.radius
    }


    updateProjectilePosition(){
        // @ts-ignore
        /*let direction = new Vector3().subVectors(this.target.position, this.shotFired.position);
        direction.normalize();
        // Set the velocity of the projectile
        let velocity = direction.multiplyScalar(this.speed); // adjust the speed as needed
        // @ts-ignore
        this.shotFired.position.add(velocity.clone().multiplyScalar(this.context.time.deltaTime));*/

        /*let angle = (2 * Math.PI) / 8; // divide 360 degrees into 8 equal parts
        let radius = this.speed * 40 * this.context.time.deltaTime;
        let center = this.gameObject.position;
        console.log(radius)
        for(const key in this.shotsFired) {
            let x = center.x + radius * Math.cos(angle * Number(key));
            let z = center.z + radius * Math.sin(angle * Number(key));
            this.shotsFired[key].position.set(x, center.y+1, z);
        }*/

        let angle = (2 * Math.PI) / 8; // divide 360 degrees into 8 equal parts
        let radius = this.speed  * this.context.time.deltaTime;
        //let center = this.gameObject.position;
        //console.log(this.context.time.deltaTime)
        for(const key in this.shotsFired) {
            if (this.shotsFired[key] !== undefined) {
                let x = this.shotsFired[key].position.x + radius * Math.cos(angle * Number(key));
                let z = this.shotsFired[key].position.z + radius * Math.sin(angle * Number(key));
                let direction = new Vector3().subVectors(new Vector3(x, this.shotsFired[key].position.y, z), this.shotsFired[key].position);
                direction.normalize();
                let velocity = direction.multiplyScalar(this.speed);
                this.shotsFired[key].position.add(velocity.clone().multiplyScalar(this.context.time.deltaTime));

                let distance = this.shotsFired[key].position.distanceTo(this.gameObject.position);
                if (distance > 1) {
                    GameObject.destroy(this.shotsFired[key])
                    this.shotsFired[key] = undefined
                }
            }
        }


    }

    /*projectileHit(tm, target, whoShot){


    }*/

    test() {
        let tm = this.getTargetManager()
        for(const key in this.shotsFired) {
            // @ts-ignore
            let targets: GameObject[] = tm.getTargets();
            for (let i = 0; i < targets.length; i++) {
                if (this.shotsFired[key] !== undefined) {
                    if (this.shotsFired[key].position.distanceTo(targets[i].position) < .2) {
                        let getCashCounter = this.getCashCounter()
                        // @ts-ignore
                        //console.log(healthCounter.getValue())
                        getCashCounter.add(1);

                        // @ts-ignore
                        tm.remove(targets[i].uuid)
                        GameObject.destroy(this.shotsFired[key])

                        this.shotsFired[key] = undefined
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