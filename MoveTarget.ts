import { Behaviour, serializable, GameObject } from "@needle-tools/engine";
import { Vector3 } from "three";

export class MoveTarget extends Behaviour {


    @serializable()
    waypoints: Vector3[] | null = null;

    @serializable()
    speed = 2.0;

    currentWaypoint = 0;

    active = true;

    start() {

    }

    deactivate() {
        this.active = false;
    }

    update() {

        if( this.active ) {
            if (this.waypoints && this.currentWaypoint < this.waypoints.length) {
                this.gameObject.position.lerp(
                    this.waypoints[this.currentWaypoint],
                    this.speed * this.context.time.deltaTime
                );

                if (this.gameObject.position.distanceTo(this.waypoints[this.currentWaypoint]) < 0.1) {
                    this.currentWaypoint++;
                }
            }
        }
    }
}