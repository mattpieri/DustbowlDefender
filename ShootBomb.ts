import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions, AudioSource, ParticleSystem, Renderer } from "@needle-tools/engine";

import { Animator} from "@needle-tools/engine/engine-components/Animator"
import {Cache, Color, Object3D, Quaternion, Vector3} from "three";
import {TargetManager} from "./TargetManager";
import {GameManager} from "./GameManager";
import {Counter} from "./Counter";
import {MoveTarget} from "./MoveTarget"


export class ShootBomb extends Behaviour {

    @serializable(AssetReference)
    myPrefab?: AssetReference;

    @serializable(AssetReference)
    upgradedPreb?: AssetReference;

    @serializable()
    radius?: number = 4

    private shotFired: GameObject | undefined;

    private target: GameObject | undefined;

    @serializable()
    interval?: number = 500

    @serializable()
    isUpgraded?: number = 0

    @serializable()
    surroundingMaxKills?: number = 3


    @serializable()
    blowUpSpeed = 2;

    @serializable()
    blowUpRadius = .01;

    @serializable()
    speed = 3

    private isActive = false


    private _interval: NodeJS.Timeout | undefined;

    async start() {
        //opt1.parent = this.context.scene.getObjectByName("Content");
        //return this.bullet2?.instantiate(opt1)

        this._interval =  setInterval(() => {
            this.shootProjectile();
        }, this.interval);
    }

    public destroy(){
        clearInterval(this._interval)
        if(this.target) {
            this.projectileHit()
        }
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
        if( !this.isActive) {
            return
        }
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


                        if( this.isUpgraded === 1){

                            this.shotFired.position.set(this.gameObject.position.x, this.gameObject.position.y + .36, this.gameObject.position.z)
                        }else{
                            this.shotFired.position.set(this.gameObject.position.x, this.gameObject.position.y + .1, this.gameObject.position.z)
                        }

                    }
                    // @ts-ignore
                    let direction = this.target.position.clone().sub(this.gameObject.position).normalize();
                    let angle = Math.atan2(direction.x, direction.z) + Math.PI/2;
                    this.gameObject.rotation.y = angle ;

                    let a = GameObject.getComponents(this.gameObject, Animator)[0];
                    if(a !== undefined){
                        //console.log( "hello")
                        // a.SetTrigger("Test")
                        //console.log("HELLLL O")
                        if( this.isUpgraded === 1){
                            a.Play("cannon|Location") //_barrel|Circle_001Action

                        }else {
                            //a.Play("cannon|Location") //_barrel|Circle_001Action
                            a.Play("cannon|Location", -1, 0, 1); // Play "top1" on layer 0
                            a.Play("spokes|Location", 1, 0, 1);
                            a.Play("rim|Location", 2, 0, 1);
                            a.Play("ring|Location", 3, 0, 1);
                            a.Play("bolt|Location", 4, 0, 1);
                            a.Play("bar|Location", 5, 0, 1);
                            a.Play("spokes|rotation", 6, 0, 1);
                            a.Play("rim|rotation", 7, 0, 1);
                            a.Play("cannon|rotation", 9, 0, 1);
                            a.Play("ring|rotation", 10, 0, 1);
                        }
                        //console.log(a)
                    }

                    let b = GameObject.getComponents(this.gameObject, AudioSource)[0];
                    if(b !== undefined){
                        //console.log( "hello")
                        // a.SetTrigger("Test")
                        b.play()
                        //console.log(b)
                        //console.log(a)
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

    withinExplosionRadius(target: GameObject, surroundingTarget: GameObject) {
        // @ts-ignore
        return target.position.distanceTo(surroundingTarget.position) < 1.4

    }

    // Calculate the predicted position of the target, given its current position,
    // velocity, and the time it will take the bullet to reach it
    predictTargetPosition(targetPosition, targetVelocity, timeToReach) {
        return targetPosition.clone().add(targetVelocity.clone().multiplyScalar(timeToReach));
    }

    // Calculate the time it takes for the bullet to reach the target, given the
    // distance between them and the bullet's speed
    calculateTimeToReach(distance) {
        return distance / this.speed;
    }

    updateProjectilePosition(){

        /*// @ts-ignore
        let initialDistance = this.gameObject.position.distanceTo(this.target.position);
        let timeToReach = this.calculateTimeToReach(initialDistance);

        // @ts-ignore
        let targetVelocity = GameObject.getComponent(this.target, MoveTarget).getTargetVelocity()

        // @ts-ignore
        let predictedPosition = this.predictTargetPosition(this.target.position, targetVelocity, timeToReach);
        let predictedDistance = this.gameObject.position.distanceTo(predictedPosition);

        if (Math.abs(predictedDistance - initialDistance) > 0.01) {
            timeToReach = this.calculateTimeToReach(predictedDistance);
            // @ts-ignore
            predictedPosition = this.predictTargetPosition(this.target.position, targetVelocity, timeToReach);
        }

        let shootingDirection = new Vector3().subVectors(predictedPosition, this.gameObject.position).normalize();

        const velocity = shootingDirection.clone().multiplyScalar(this.speed);
        const arcAmount = 1;
        // Add a small upward force to create an arc
        const arcForce = new Vector3(0, arcAmount, 0).multiplyScalar(this.context.time.deltaTime);
        // @ts-ignore
        this.shotFired.position.add(arcForce);
        // Set the velocity of the cannonball
        // @ts-ignore
        this.shotFired.position.add(velocity.clone().multiplyScalar(this.context.time.deltaTime));

        // Add a small sideways force to create an arc over time
        const cross = new Vector3().crossVectors(shootingDirection, new Vector3(0, 1, 0)).normalize();
        const angle = Math.PI / 8 * Math.sin(this.context.time.deltaTime * 2);
        const sideForce = cross.clone().multiplyScalar(angle * this.speed * this.context.time.deltaTime);
        // @ts-ignore
        this.shotFired.position.add(sideForce);*/

        // @ts-ignore
        let direction = new Vector3().subVectors(this.target.position, this.shotFired.position);
        direction.normalize();
        // Set the velocity of the projectile
        const velocity = direction.clone().multiplyScalar(this.speed);

        const arcAmount = 1
        // Add a small upward force to create an arc
        const arcForce = new Vector3(0, arcAmount, 0).multiplyScalar(this.context.time.deltaTime);
        // @ts-ignore
        this.shotFired.position.add(arcForce);

        // Set the velocity of the cannonball
        // @ts-ignore
        this.shotFired.position.add(velocity.clone().multiplyScalar(this.context.time.deltaTime));

        // Add a small sideways force to create an arc over time
        const cross = new Vector3().crossVectors(direction, new Vector3(0, 1, 0)).normalize();
        const angle = Math.PI / 8 * Math.sin(this.context.time.deltaTime * 2);
        const sideForce = cross.clone().multiplyScalar(angle * this.speed * this.context.time.deltaTime);
        // @ts-ignore
        this.shotFired.position.add(sideForce);
    }

    public blowUpSurroundingTargets(targetObject: GameObject ){
        // @ts-ignore
        let tm = this.getTargetManager()
        // @ts-ignore
        let targets: GameObject[] = tm.getTargets();

        const maxKill = this.surroundingMaxKills;
        let killCounter = 0;
        for (let i = 0; i < targets.length; i++) {
            // @ts-ignore
            if (this.withinExplosionRadius(targetObject, targets[i]) && !tm.checkIfClaimed(targets[i].guid) && killCounter < maxKill ) {
                //console.log( "HELLLOOOO")

                // @ts-ignore
                tm.claimTarget(targets[i].guid)

                // @ts-ignore
                tm.remove(targets[i], true)

                killCounter++
            }
        }
    }

    projectileHit(){
        let tm = this.getTargetManager()

        const ps = this.context.scene.getObjectByName("GameObject")
        const ps2 = this.context.scene.getObjectByName("GameObject2")
        // @ts-ignore
        ps.position.set(this.target.position.x, this.target.position.y+.2, this.target.position.z)
        // @ts-ignore
        ps2.position.set(this.target.position.x, this.target.position.y, this.target.position.z)
        // @ts-ignore
        const comp = GameObject.getComponent(ps, ParticleSystem)
        // @ts-ignore
        const comp2 = GameObject.getComponent(ps2, ParticleSystem)
        // @ts-ignore
        comp.play()
        // @ts-ignore
        comp2.play()
        //console.log( "explosion", comp )
        // @ts-ignore
        //this.explosionParticleSystem.setWorldPosition(this.target.position.x, this.target.position.y, this.target.position.z)
        // @ts-ignore
       // this.explosionParticleSystem.play()

        let getCashCounter = this.getCashCounter()
        // @ts-ignore
        //console.log(healthCounter.getValue())
        getCashCounter.add(1);

        // @ts-ignore
        this.blowUpSurroundingTargets(this.target)
        //console.log(tm.getTargets())
        // @ts-ignore

        tm.remove(this.target, true)


        // @ts-ignore
        //tm.remove(this.target.uuid)
        // console.log(tm.getTargets())

        // @ts-ignore
        this.target = undefined;
        // @ts-ignore
        GameObject.destroy(this.shotFired )
        this.shotFired = undefined;

    }

    public async upgrade() {


        const opt = new InstantiateOptions();
        opt.parent = this.context.scene.getObjectByName("Content");
        await this.upgradedPreb?.instantiate(opt)
            .then((result) => {
                // @ts-ignore
                result.position.set(this.gameObject.position.x, this.gameObject.position.y , this.gameObject.position.z)
                GameObject.destroy(this.gameObject)

            })
    }


    update() {
        if( this.isActive) {
            if (this.shotFired !== undefined) {
                // Set starting position of shot
                this.updateProjectilePosition()
                // @ts-ignore

                // @ts-ignore
                if (this.shotFired.position.distanceTo(this.target.position) < .2) {

                    this.projectileHit()
                }
            }
        }
    }

    public onPurchase() {
        this.isActive = true
    }
}