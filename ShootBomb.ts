import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions } from "@needle-tools/engine";

import { Animator} from "@needle-tools/engine/engine-components/Animator"
import {Cache, Color, Object3D, Quaternion, Vector3} from "three";
import {TargetManager} from "./TargetManager";
import {GameManager} from "./GameManager";
import {Counter} from "./Counter";
import {MoveTarget} from "./MoveTarget"


export class ShootBomb extends Behaviour {

    @serializable(AssetReference)
    myPrefab?: AssetReference;

    @serializable()
    radius?: number = 1

    private shotFired: GameObject | undefined;

    private target: GameObject | undefined;

    private isBlowingUp: boolean | undefined;

    @serializable()
    interval?: number = 500

    @serializable()
    blowUpSpeed = 2;

    @serializable()
    blowUpRadius = 1.5;

    @serializable()
    speed = 5;

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
            if (this.withinRadius(targets[i]) && !tm.checkIfClaimed(targets[i].guid) && this.target === undefined ) {
                // @ts-ignore
                //console.log(tm.getUnclaimedTargets())
                this.target = targets[i]
                // @ts-ignore
                tm.claimTarget(this.target.guid)
            }
        }
    }


    async shootProjectile() {
        let tm = this.getTargetManager()
        // @ts-ignore
        if (tm.getTargets().length > 0) {
            if (this.shotFired == undefined) {
                await this.firstUnclaimedTargetInRadius();
                if( this.target !== undefined){
                    // @ts-ignore
                    //console.log("In Radius")
                    let projectile = await this.myPrefab?.instantiate() as GameObject;
                    if (projectile != undefined) {
                        this.shotFired = projectile;
                        this.shotFired.position.set(this.gameObject.position.x, this.gameObject.position.y + 1, this.gameObject.position.z)
                    }
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
        let direction = new Vector3().subVectors(this.target.position, this.shotFired.position);
        direction.normalize();
        // Set the velocity of the projectile
        let velocity = direction.multiplyScalar(this.speed); // adjust the speed as needed
        // @ts-ignore
        this.shotFired.position.add(velocity.clone().multiplyScalar(this.context.time.deltaTime));
    }

    blowUp(){
        let scaleSpeed = new Vector3(this.blowUpSpeed, this.blowUpSpeed, this.blowUpSpeed);
        // @ts-ignore
        this.shotFired.scale.addScaledVector(scaleSpeed, this.context.time.deltaTime);

        this.test()
        // @ts-ignore
        if (Math.max(this.shotFired.scale.x, this.shotFired.scale.y, this.shotFired.scale.z) > this.blowUpRadius) {
            // @ts-ignore
            GameObject.destroy(this.shotFired)
            this.shotFired = undefined;
            this.isBlowingUp = false;
        }
    }

    test() {
        let tm = this.getTargetManager()
            // @ts-ignore
        let targets: GameObject[] = tm.getTargets();
        //let sphereRadius = this.shotFired. //radius * Math.max(this.shotFired.scale.x, this.sphere.scale.y, this.sphere.scale.z);

        for (let i = 0; i < targets.length; i++) {
            if (this.shotFired !== undefined) {

                let distance = this.shotFired.position.distanceTo(targets[i].position);
                let maxSphereRadius = Math.max(this.shotFired.scale.x, this.shotFired.scale.y, this.shotFired.scale.z) * 0.5;
                if (distance <= maxSphereRadius) {
                    // Perform collision detection actions
                    let getCashCounter = this.getCashCounter();
                    // @ts-ignore
                    getCashCounter.add(1);

                    // @ts-ignore
                    tm.remove(targets[i].uuid);
                    GameObject.destroy(targets[i]);
                }

                /*if (this.shotFired.position.distanceTo(targets[i].position) < .2) {
                    let getCashCounter = this.getCashCounter()
                    // @ts-ignore
                    //console.log(healthCounter.getValue())
                    getCashCounter.add(1);

                    // @ts-ignore
                    tm.remove(targets[i].uuid)
                    GameObject.destroy(targets[i])
                }*/
            }
        }
    }

    projectileHit(tm){
        let getCashCounter = this.getCashCounter()
        // @ts-ignore
        //console.log(healthCounter.getValue())
        getCashCounter.add(1);

        //console.log("HIT")

        //console.log(tm.getTargets())
        // @ts-ignore
        tm.remove(this.target.guid)
        // @ts-ignore
        tm.remove(this.target.uuid)
        // console.log(tm.getTargets())

        // @ts-ignore
        GameObject.destroy(this.target)
        this.target = undefined;

        //console.log(this.shotFired)
        this.isBlowingUp = true;



        // @ts-ignore
        //GameObject.destroy(this.shotFired)
        //this.shotFired = undefined;
        //console.log(this.shotFired)

    }

    update() {
        if (this.shotFired !== undefined) {

            if(this.isBlowingUp){
                this.blowUp()

            }else {
                // Set starting position of shot
                this.updateProjectilePosition()
                // @ts-ignore
                let tm = this.getTargetManager()

                // @ts-ignore
                let direction = this.target.position.clone().sub(this.gameObject.position).normalize();
                let angle = Math.atan2(direction.y, direction.z);
                this.gameObject.rotation.z = angle;

                // @ts-ignore
                if (this.shotFired.position.distanceTo(this.target.position) < .2) {

                    this.projectileHit(tm)
                }
            }
        }
    }
}