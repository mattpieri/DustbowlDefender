import { Behaviour, serializable, GameObject, Rigidbody  } from "@needle-tools/engine";
import {Euler, Quaternion, Vector3} from "three";
import {Counter} from "./Counter";
import {Scale} from "./Scale";
import {Market} from "./Market";
import {ScaleManager} from "./ScaleManager";
import {TargetManager} from "./TargetManager";
import * as seedrandom from 'seedrandom';

export class MoveTarget extends Behaviour {
    public  getLevel(): number {
        return this._level;
    }

    public setLevel(value: number) {
        this._level = value;
    }

    public getCurrentWaypoint(): number {
        return this._currentWaypoint;
    }

    public setCurrentWaypoint(value: number) {
        this._currentWaypoint = value;
    }


    private _level = 1;


   // @serializable()
   // waypoints: Vector3[] | null = null;

    @serializable()
    speed: number = 1;

    private _currentWaypoint = 0;

    @serializable()
    active: boolean = true;

    @serializable()
    rotateSpeed = 1;

    public setActive2(){
        this.active = true;
    }

    private waypoints: Vector3[] | null = null;

    awake() {
        this.waypoints = [
            new Vector3(-2.44, .27, -3.14),
            new Vector3(-2.44, .27, -.3),
            new Vector3(-1.05, .27, -.3),
            new Vector3(-1.05, .27, -1.75),
            new Vector3(-.05, .27, -1.75),
            new Vector3(-.05, .27, .65),
            new Vector3(-1.94, .27, .65),
            new Vector3(-1.94, .27, 1.65),
            new Vector3(1.372, .27, 1.65),
            new Vector3(1.372, .27, 2.468),
            new Vector3(2.341, .27, 2.468),
            new Vector3(2.341, .27, -1.16),
            new Vector3(.88, .27, -1.16),
            new Vector3(.88, .27, -3.28),
        ]



    }

    onStart(){
        // @ts-ignore
        this.gameObject.position.set(this.waypoints[0].x, this.waypoints[0].y, this.waypoints[0].z )
        this._currentWaypoint++;
        const initialRotation = new Quaternion();
        initialRotation.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2); // rotate 90 degrees around y-axis
        this.gameObject.quaternion.copy(initialRotation);
        this.active = true;
    }

    getHealthCounter() {
        const HealthCounter = this.context.scene.getObjectByName("HealthCounter")

        // @ts-ignore
        return  GameObject.getComponent(HealthCounter, Counter);
    }


    private waypointsPassedAndStillNotDeleted = 0;

    update() {
        if( this.active ) {

            const TargetManagerGM = this.context.scene.getObjectByName("TargetManager")
            // @ts-ignore
            let tm =  GameObject.getComponent(TargetManagerGM, TargetManager);
            // @ts-ignore

            let deadlist = tm.getDeadList().filter(target => target.deadGuy.guid === this.gameObject.guid)
            if( deadlist.length !== 0 ){
                //GameObject.destroy(this.gameObject)
                //return

                let deadObject = deadlist[0]
                //if( deadObject ){

                if(  deadObject["spawnNextLevel"] === true  ) {
                    // @ts-ignore
                    tm.fireTargetFromDeadGuy(deadObject["deadGuy"])
                } else {
                    //GameObject.setActive(deadObject["deadGuy"], false, true, false)
                    GameObject.destroy(deadObject["deadGuy"])
                    //deadObject["deadGuy"].position.set(0,10000, 0)
                }

                    // @ts-ignore
                    // deadObject["deadGuy"].position.set(0,10000, 0)

                return
            }

            //this.test()

            if (this.waypoints && this._currentWaypoint < this.waypoints.length ) {
                const ScaleObject = this.context.scene.getObjectByName("Scale")
                // @ts-ignore
                const scaleComponent = GameObject.getComponent(ScaleObject, ScaleManager)
                let offSetY = 0;

                if(scaleComponent){
                    offSetY = scaleComponent?.getScaleY() - .40
                }

                // @ts-ignore
                const waypoint = new Vector3( this.waypoints[this._currentWaypoint].x, this.waypoints[this._currentWaypoint].y + offSetY, this.waypoints[this._currentWaypoint].z);

                const direction = new Vector3(waypoint.x, waypoint.y, waypoint.z).clone().sub(this.gameObject.position).normalize();
                const velocity = direction.multiplyScalar(this.speed * this.context.time.deltaTime);

                // Rotate the ball based on the velocity
                const rotationAxis = new Vector3().crossVectors(this.gameObject.up, velocity).normalize();
                const rotationAngle = velocity.length() * 10; // Increase or decrease the factor to adjust the rotation speed
                this.gameObject.rotateOnWorldAxis(rotationAxis, rotationAngle);

                // Move the ball
                this.gameObject.position.add(velocity);

                if (this.gameObject.position.distanceTo(waypoint) < 0.05) {
                    if (this._currentWaypoint + 1 === this.waypoints.length) {
                        const TargetManagerGM = this.context.scene.getObjectByName("TargetManager")
                        // @ts-ignore
                        let tm =  GameObject.getComponent(TargetManagerGM, TargetManager);

                        // @ts-ignore
                        if(tm.getUnclaimedTargets().filter(obj=>obj.guid===this.gameObject.guid).length !== 0){
                            const HealthObject = this.context.scene.getObjectByName("HealthCounter")
                            // @ts-ignore
                            const heathComponenet = GameObject.getComponent(HealthObject, Counter)
                            let deadMoveTargetComponent = GameObject.getComponent(this.gameObject, MoveTarget);
                            // @ts-ignore
                            heathComponenet.add(-deadMoveTargetComponent.getLevel())
                        }

                        // @ts-ignore
                        tm.remove(this.gameObject, false);
                        this.active = false
                    }

                    if (this._currentWaypoint + 1 < this.waypoints.length) {
                        this._currentWaypoint++;
                    }
                }

            }
        }
    }

}