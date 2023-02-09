import { Behaviour, serializable, GameObject } from "@needle-tools/engine";
import { Vector3 } from "three";
import {Counter} from "./Counter";

export class MoveTarget extends Behaviour {


    @serializable()
    waypoints: Vector3[] | null = null;

    @serializable()
    speed = 1;

    currentWaypoint = 0;

    active = true;

    start() {

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
            if (this.waypoints && this.currentWaypoint < this.waypoints.length) {
                this.gameObject.position.lerp(
                    this.waypoints[this.currentWaypoint],
                    this.speed * this.context.time.deltaTime
                );

                if (this.gameObject.position.distanceTo(this.waypoints[this.waypoints.length-1]) < 0.1) {
                    let healthCounter = this.getHealthCounter()
                    // @ts-ignore
                    healthCounter.add(-1);
                }

                if (this.gameObject.position.distanceTo(this.waypoints[this.currentWaypoint]) < 0.1) {
                    this.currentWaypoint++;
                }


            }
        }
    }
}