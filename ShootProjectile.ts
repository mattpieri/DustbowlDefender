import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions } from "@needle-tools/engine";

import { Animator} from "@needle-tools/engine/engine-components/Animator"
import {Cache, Color, Object3D, Quaternion, Vector3} from "three";
import {TargetManager} from "./TargetManager";
import {GameManager} from "./GameManager";
import {Counter} from "./Counter";
import {MoveTarget} from "./MoveTarget"


export class ShootProjectile extends Behaviour {

    @serializable(AssetReference)
    myPrefab?: AssetReference;

    private shotFired: GameObject | undefined;

    async start() {

        setInterval(() => {
            this.shootProjectile();
        }, 3000);
    }

    async shootProjectile() {
        let tm = this.getTargetManager()

        // @ts-ignore
        if(tm.getTargets().length > 0) {
            if (this.shotFired == undefined) {
                //let instantiateOptions = new InstantiateOptions();
                //instantiateOptions.position = new Vector3(this.gameObject.position.x, this.gameObject.position.y, this.gameObject.position.z);
                let projectile = await this.myPrefab?.instantiate() as GameObject;
                /*l
                instantiateOptions.context = this.context;
                // @ts-ignore
                let newProjectile = GameObject.instantiate(projectile, instantiateOptions) as GameObject;*/
                if (projectile != undefined) {
                    this.shotFired = projectile;
                }
            }
        }
    }

    getTargetManager() {
        const TargetManagerGM = this.context.scene.getObjectByName("TargetManager")
        // @ts-ignore
        return  GameObject.getComponent(TargetManagerGM, TargetManager);
    }

    getCashCounter() {
        const CashCounter = this.context.scene.getObjectByName("CashCounter")

        // @ts-ignore
        return  GameObject.getComponent(CashCounter, Counter);
    }


    update() {
        if (this.shotFired !== undefined) {
            if( this.shotFired.position.x === 0 && this.shotFired.position.x === 0 && this.shotFired.position.x === 0 ) {
                this.shotFired.position.set(this.gameObject.position.x, this.gameObject.position.y+ 1, this.gameObject.position.z);
                return
            }
            let tm = this.getTargetManager()
            // @ts-ignore
            if (tm.getTargets().length > 0) {
                // @ts-ignore
                let target = tm.getTargets()[0];

                let direction = new Vector3().subVectors(target.position, this.shotFired.position);
                direction.normalize();
                // Set the velocity of the projectile
                let velocity = direction.multiplyScalar(3); // adjust the speed as needed
                this.shotFired.position.add(velocity.clone().multiplyScalar(this.context.time.deltaTime));

                // Check for collision with the target
                if (this.shotFired.position.distanceTo(target.position) < .2) {

                    let getCashCounter = this.getCashCounter()
                    // @ts-ignore
                    //console.log(healthCounter.getValue())
                    getCashCounter.add(1);

                    console.log("HIT")

                    //console.log(tm.getTargets())
                    // @ts-ignore
                    tm.removeFirst()
                    // console.log(tm.getTargets())

                    GameObject.destroy(target)

                    //console.log(this.shotFired)
                    GameObject.destroy(this.shotFired)
                    this.shotFired = undefined;
                    //console.log(this.shotFired)

                }
            }
        }
    }
}