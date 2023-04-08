import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions, EventList, AudioSource  } from "@needle-tools/engine";

import { Animator} from "@needle-tools/engine/engine-components/Animator"
import {Cache, Color, Object3D, Quaternion, Vector3} from "three";
import {TargetManager} from "./TargetManager";
import {GameManager} from "./GameManager";
import {Counter} from "./Counter";
import {MoveTarget} from "./MoveTarget"


export class ShootProjectile extends Behaviour {

    @serializable(AssetReference)
    myPrefab?: AssetReference;

    @serializable(AssetReference)
    test?: AssetReference;

    private _test;

    @serializable()
    radius?: number = 1

    private shotFired: GameObject | undefined;

    private target: GameObject | undefined;


    @serializable()
    interval?: number = 500

    @serializable()
    speed = 3;

    @serializable()
    active: boolean = false

    private _interval: NodeJS.Timeout | undefined;

    async start() {

        this._interval =  setInterval(() => {
            this.shootProjectile();
        }, this.interval);
    }

    public destroy(){
        clearInterval(this._interval)
    }

    firstUnclaimedTargetInRadius() {
        // @ts-ignore
        let tm = this.getTargetManager()
        // @ts-ignore
        let targets: GameObject[] = tm.getTargets();

        for (let i = 0; i < targets.length; i++) {
        //for (let i = targets.length - 1; i >= 0; i--) {
            // @ts-ignore
            //console.log( tm.checkIfClaimed(targets[i].guid))
            ///console.log( tm.getUnclaimedTargets().length)

            //console.log( this.gameObject )
            // @ts-ignore
            let withInRadius = this.gameObject.position.distanceTo(targets[i].position) < this.radius

            // @ts-ignore
            if (withInRadius && !tm.checkIfClaimed(targets[i].guid) && this.target === undefined ) {
                // @ts-ignore
                //console.log(tm.getUnclaimedTargets())
                this.target = targets[i]
                // @ts-ignore
                tm.claimTarget(this.target.guid)
            }
        }
    }

    public purchase(){
        this.active = true
    }


    async shootProjectile() {
        if(!this.active){
            return
        }
        let tm = this.getTargetManager()
        // @ts-ignore
        if (tm.getTargets().length > 0) {
            if (this.shotFired == undefined) {
                this.firstUnclaimedTargetInRadius();
                if( this.target !== undefined){
                    // @ts-ignore
                    //console.log("In Radius")
                    let projectile = await this.myPrefab?.instantiate() as GameObject;
                    if (projectile != undefined) {
                        this.shotFired = projectile;
                        //this.shotFired.position.set(this.gameObject.position.x, this.gameObject.position.y + .7, this.gameObject.position.z)

                        ////////////////////////////// SET BULLET STATING POSITION
                        // Constants for hand offsets
                        const horizontalOffset = -.35;
                        const verticalOffset = 0.75;

                        // Get player's rotation
                        const playerRotationY = this.gameObject.rotation.y + Math.PI / 2;

                        // Calculate hand position relative to the player
                        const handX = this.gameObject.position.x + horizontalOffset * Math.sin(playerRotationY); //try swtiching sign if need to rotate
                        const handY = this.gameObject.position.y + verticalOffset;
                        const handZ = this.gameObject.position.z + horizontalOffset * Math.cos(playerRotationY);

                        // Update the projectile's initial position
                        this.shotFired.position.set(handX, handY, handZ);

                        let direction = new Vector3().subVectors(this.target.position, this.shotFired.position);
                        let angle;
                        if (direction.y <= 0) {
                            angle = Math.atan2(-direction.y, direction.x) + Math.PI / 2;
                        } else {
                            angle = Math.atan2(direction.y, direction.x) + Math.PI / 2;
                        }
                        // @ts-ignore

                        //let angle = Math.atan2(direction.x, direction.z);
                        // @ts-ignore
                        this.shotFired.rotation.z = angle ;
                        //////////////////////////////

                        let a = GameObject.getComponents(this.gameObject, Animator)[0];
                        if(a !== undefined){
                            console.log( "hello")
                            // a.SetTrigger("Test")
                            a.Play("Cylinder_002|Throw_003")
                            //console.log(a)
                        }


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

        let angle;
        if (direction.y <= 0) {
            angle = Math.atan2(-direction.y, direction.x) + Math.PI / 2;
        } else {
            angle = Math.atan2(direction.y, direction.x) + Math.PI / 2;
        }

        // @ts-ignore
        this.shotFired.rotation.z = angle
    }

    playPopSound(){
        // @ts-ignore
        let b = GameObject.getComponents(this.gameObject, AudioSource)[0];
        console.log(b)
        if(b !== undefined){
            // @ts-ignore
            b.play()
        }
    }


    projectileHit(tm){
        let getCashCounter = this.getCashCounter()
        // @ts-ignore
        //console.log(healthCounter.getValue())
        getCashCounter.add(1);

        this.playPopSound()
        //console.log(tm.getTargets())
        // @ts-ignore
        tm.remove(this.target)
        // console.log(tm.getTargets())

        //console.log(tm.getTargets().length)
        // @ts-ignore
        //GameObject.destroy(this.target)
        this.target = undefined;

        //console.log(this.shotFired)
        // @ts-ignore
        GameObject.destroy(this.shotFired)
        this.shotFired = undefined;
        //console.log(this.shotFired)

    }

    update() {
        if(!this.active){
            return
        }

        if (this.shotFired !== undefined) {
            // Set starting position of shot
            // @ts-ignore
            //let direction = this.target.position.clone().sub(this.gameObject.position).normalize();
            //let angle = Math.atan2(direction.x, -direction.z);
           // this.gameObject.rotation.y = angle;

            let direction = this.target.position.clone().sub(this.gameObject.position).normalize();
            let angle = Math.atan2(direction.x, direction.z) ;
            this.gameObject.rotation.y = angle ;


            this.updateProjectilePosition()
            // @ts-ignore
            let tm = this.getTargetManager()



            // @ts-ignore
            if (this.shotFired.position.distanceTo(this.target.position) < .2) {
                this.projectileHit(tm)
            }

        }
    }
}