import { Behaviour, serializable, GameObject } from "@needle-tools/engine";
import {Euler, Quaternion, Vector3} from "three";
import {Counter} from "./Counter";
import {Scale} from "./Scale";
import {Market} from "./Market";
import {ScaleManager} from "./ScaleManager";
import {TargetManager} from "./TargetManager";

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


    @serializable()
    waypoints: Vector3[] | null = null;

    @serializable()
    speed: number = 1;

    private _currentWaypoint = 0;

    active = true;

    @serializable()
    rotateSpeed = 1;

    start() {
        const initialRotation = new Quaternion();
        initialRotation.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2); // rotate 90 degrees around y-axis
        this.gameObject.quaternion.copy(initialRotation);
    }

    deactivate() {
        this.active = false;
    }

    getHealthCounter() {
        const HealthCounter = this.context.scene.getObjectByName("HealthCounter")

        // @ts-ignore
        return  GameObject.getComponent(HealthCounter, Counter);
    }


    update() {

        if( this.active ) {
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
                //console.log("actual position", this.gameObject.position.x,  this.gameObject.position.y,  this.gameObject.position.z)
                //console.log( this.gameObject.position.distanceTo(this.waypoints[this._currentWaypoint] ))
                if (this.gameObject.position.distanceTo(waypoint) < 0.05) {
                    if (this._currentWaypoint + 1 === this.waypoints.length) {
                        const HealthObject = this.context.scene.getObjectByName("HealthCounter")
                        // @ts-ignore
                        const heathComponenet = GameObject.getComponent(HealthObject, Counter)
                        // @ts-ignore
                        heathComponenet.add(-1)
                        const TargetManagerGM = this.context.scene.getObjectByName("TargetManager")
                        // @ts-ignore
                        GameObject.getComponent(TargetManagerGM, TargetManager).remove(this.gameObject.guid);
                    }


                    if (this._currentWaypoint + 1 < this.waypoints.length) {
                        //const buttonUp = this.context.scene.getObjectByName("button_up")
                        // @ts-ignore
                        //const scaleComponenet = GameObject.getComponent(buttonUp, Scale)
                        // @ts-ignore
                        //this.waypoints[this._currentWaypoint + 1].y+=scaleComponenet.getScaleY()
                        //console.log("HITTTTTTT")
                        // Get the direction to the next waypoint
                        const direction = new Vector3().subVectors(waypoint, this.gameObject.position).normalize();

                        // Set the rotation of the game object to face the direction
                        //this.gameObject.rotation.set(0, Math.atan2(direction.x, direction.z), 0);

                        this._currentWaypoint++;
                    }
                }

            }
        }
    }




}