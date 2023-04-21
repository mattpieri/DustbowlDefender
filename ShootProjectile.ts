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
    radius?: number = 3

    private shotFired: GameObject | undefined;

    private target: GameObject | undefined;


    @serializable()
    interval?: number = 500

    @serializable()
    speed = 3;

    @serializable()
    active: boolean = false


     private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private _interval: NodeJS.Timeout | undefined;
    async start() {

    }

    public destroy(){
        clearInterval(this._interval)
        // @ts-ignore
        GameObject.destroy(this.shotFired)
    }

    resetShots(){
        // @ts-ignore
        this.shotFired.position.set(this.gameObject.position.x, this.gameObject.position.y + .75, this.gameObject.position.z)
    }

    firstUnclaimedTargetInRadius() {
        // @ts-ignore
        let tm = this.getTargetManager()
        // @ts-ignore
        let targets  = tm.getTargets();

        for (let i = 0; i < targets.length; i++) {
            // @ts-ignore
            let withInRadius = this.gameObject.position.distanceTo(targets[i].position) < this.radius
            // @ts-ignore
            if (withInRadius && !tm.checkIfClaimed(GameObject.getComponent(targets[i], MoveTarget).getTargetId()) && this.target === undefined ) {
                // @ts-ignore
                //console.log(tm.getUnclaimedTargets())
                this.target = targets[i]
                // @ts-ignore
                tm.claimTarget(GameObject.getComponent(targets[i], MoveTarget).getTargetId())

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
                // @ts-ignore
                this.shotFired.position.set(handX, handY, handZ);

                // @ts-ignore
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
                    //console.log( "hello")
                    // a.SetTrigger("Test")
                    a.Play("Cylinder_002|Throw_003")
                    //console.log(a)
                }
            }
        }
    }

    public async purchase() {
        this.active = true
        let projectile = await this.myPrefab?.instantiate() as GameObject;
        if (projectile != undefined) {
            this.shotFired = projectile;
            this.shotFired.position.set(this.gameObject.position.x, this.gameObject.position.y + .75, this.gameObject.position.z)
        }
        this._interval =  setInterval(() => {
            this.shootProjectile();
        }, this.getRandomNumber(300, 600));

    }


    async shootProjectile() { //make this longer

        if(!this.active){
            return
        }

        let tm = this.getTargetManager()
        // @ts-ignore
        if (tm.getTargets().length > 0) {
            this.firstUnclaimedTargetInRadius();
           // console.log("helllo")
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

    checkIfGoneBeyondRadius( maxRadius){
        // @ts-ignore
        let distance = this.shotFired.position.distanceTo(this.gameObject.position);

        if (distance > maxRadius ) {
            let tm = this.getTargetManager()
            this.projectileHit(tm)
            this.resetShots()
            console.log("GONE TO FAR")
        }

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
        //console.log(b)
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
        tm.remove(this.target, true)

        this.target = undefined;

        this.resetShots()

    }

    update() {
        if(!this.active){
            return
        }

        if (this.shotFired !== undefined ) {
            // Set starting position of shot
            // @ts-ignore
            //let direction = this.target.position.clone().sub(this.gameObject.position).normalize();
            //let angle = Math.atan2(direction.x, -direction.z);
           // this.gameObject.rotation.y = angle;
            if( this.target) {
                let direction = this.target.position.clone().sub(this.gameObject.position).normalize();
                let angle = Math.atan2(direction.x, direction.z);
                this.gameObject.rotation.y = angle;


                this.updateProjectilePosition()
                // @ts-ignore
                let tm = this.getTargetManager()

                // @ts-ignore
                if (this.shotFired.position.distanceTo(this.target.position) < .15) {
                    this.projectileHit(tm)
                }

                this.checkIfGoneBeyondRadius(4)
            }
        }
    }

    moveUp(amount){
        // @ts-ignore
        if( this.shotFired) {
            this.shotFired.position.add(new Vector3(0, amount, 0))
        }
    }
}