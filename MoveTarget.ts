import { Behaviour, serializable, GameObject } from "@needle-tools/engine";
import {Euler, Quaternion, Vector3} from "three";
import {Counter} from "./Counter";

export class MoveTarget extends Behaviour {


    @serializable()
    waypoints: Vector3[] | null = null;

    @serializable()
    speed = 1;

    currentWaypoint = 0;

    active = true;


    @serializable()
    rotateSpeed = 1;

    @serializable()
    Gravity = 1;

    rotateX = true;
    rotateY = false;

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


    movingNorth() {
        return (
            // @ts-ignore
        this.waypoints[this.currentWaypoint].x < this.waypoints[this.currentWaypoint + 1].x &&
            // @ts-ignore
        this.waypoints[this.currentWaypoint].x !== this.waypoints[this.currentWaypoint + 1].x &&
            // @ts-ignore
            this.waypoints[this.currentWaypoint].z === this.waypoints[this.currentWaypoint + 1].z )
    }

    movingSouth() {
        // @ts-ignore
        return ( this.waypoints[this.currentWaypoint].x > this.waypoints[this.currentWaypoint + 1].x &&
            // @ts-ignore
            this.waypoints[this.currentWaypoint].x !== this.waypoints[this.currentWaypoint + 1].x &&
            // @ts-ignore
        this.waypoints[this.currentWaypoint].z === this.waypoints[this.currentWaypoint + 1].z )
    }

    movingWest() {
        // @ts-ignore
        return( this.waypoints[this.currentWaypoint].z > this.waypoints[this.currentWaypoint + 1].z
            // @ts-ignore
        && this.waypoints[this.currentWaypoint].z !== this.waypoints[this.currentWaypoint + 1].z
            // @ts-ignore
        && this.waypoints[this.currentWaypoint].x === this.waypoints[this.currentWaypoint + 1].x )
    }

    movingEast(){
        // @ts-ignore
        return( this.waypoints[this.currentWaypoint].z < this.waypoints[this.currentWaypoint + 1].z
            // @ts-ignore
        && this.waypoints[this.currentWaypoint].z !== this.waypoints[this.currentWaypoint + 1].z
            // @ts-ignore
        && this.waypoints[this.currentWaypoint].x === this.waypoints[this.currentWaypoint + 1].x )
    }

    update() {

        if( this.active ) {
            if (this.waypoints && this.currentWaypoint < this.waypoints.length ) {

                const time = this.context.time.time;

                // Calculate vertical offset
                //const bounceHeight = 0.01;
                //const bounceSpeed = 2;
                //const verticalOffset = bounceHeight * Math.sin(bounceSpeed * time);

                // Move game object with vertical offset
                //this.gameObject.position.set(this.gameObject.position.x, this.gameObject.position.y + verticalOffset, this.gameObject.position.z)
                //this.gameObject.position.lerp(this.waypoints[this.currentWaypoint], this.speed * this.context.time.deltaTime);
                const waypoint = this.waypoints[this.currentWaypoint];
                const direction = new Vector3(waypoint.x, waypoint.y, waypoint.z).clone().sub(this.gameObject.position).normalize();
                const velocity = direction.multiplyScalar(this.speed * this.context.time.deltaTime);

                // Rotate the ball based on the velocity
                const rotationAxis = new Vector3().crossVectors(this.gameObject.up, velocity).normalize();
                const rotationAngle = velocity.length() * 10; // Increase or decrease the factor to adjust the rotation speed
                this.gameObject.rotateOnWorldAxis(rotationAxis, rotationAngle);

                // Move the ball
                this.gameObject.position.add(velocity);

                if (this.gameObject.position.distanceTo(this.waypoints[this.currentWaypoint]) < 0.1) {
                    if (this.currentWaypoint + 1 < this.waypoints.length) {
                        // Get the direction to the next waypoint
                        const direction = new Vector3().subVectors(this.waypoints[this.currentWaypoint], this.gameObject.position).normalize();

                        // Set the rotation of the game object to face the direction
                        this.gameObject.rotation.set(0, Math.atan2(direction.x, direction.z), 0);

                        this.currentWaypoint++;
                    }
                }
                // update rotation and position
                /*if (this.gameObject.position.distanceTo(waypoint) < 0.1) {
                    if (this.currentWaypoint + 1 < this.waypoints.length) {
                        // get the direction to the next waypoint
                        const nextDirection = new Vector3(this.waypoints[this.currentWaypoint + 1].x, this.waypoints[this.currentWaypoint + 1].y, this.waypoints[this.currentWaypoint + 1].z)
                            .clone()
                            .sub(waypoint)
                            .normalize();

                        // update rotation to face the next waypoint
                        this.gameObject.rotation.y = Math.atan2(nextDirection.x, nextDirection.z);

                        this.currentWaypoint++;
                    }
                } else {
                    // update rotation to face the direction of movement
                    this.gameObject.rotation.y = Math.atan2(direction.x, direction.z);

                    // update position
                    const distance = this.speed * this.context.time.deltaTime;
                    const displacement = direction.multiplyScalar(distance);
                    this.gameObject.position.add(displacement);
                }*/





                //if( this.rotateX ) {
                //    this.gameObject.rotation.x += 0.05; // Rotate by 0.01 radians per frame
                //} else {
                //this.gameObject.rotation.y += 0.05; // Rotate by 0.01 radians per frame
                //this.gameObject.rotation.z -= 0.05; // Rotate by 0.01 radians per frame
                /*if(this.movingNorth()){
                    this.gameObject.rotation.x += 0.05;

                }
                if(this.movingEast()){
                  //this.gameObject.rotation.z += 0.05;
                }
                if(this.movingWest()){
                   //this.gameObject.rotation.z -= 0.05;
                }
                if(this.movingSouth()){
                   this.gameObject.rotation.x -= 0.05;
                }



                //}

                if (this.gameObject.position.distanceTo(this.waypoints[this.waypoints.length-1]) < 0.1) {
                    let healthCounter = this.getHealthCounter()
                    // @ts-ignore
                    healthCounter.add(-1);
                }



                if (this.gameObject.position.distanceTo(this.waypoints[this.currentWaypoint]) < 0.1) {
                    //console.log(this.currentWaypoint)



                    if ( this.currentWaypoint + 1 < this.waypoints.length ) { //NORTH
                        if (this.movingNorth()) { //SOUTH
                            //rotate game object
                            const rotation = new Quaternion();
                            rotation.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2); // rotate 90 degrees around y-axis
                            this.gameObject.quaternion.multiply(rotation)
                            this.gameObject.rotation.x = 0;
                            console.log("north")

                        }
                        if (this.movingSouth()) { //SOUTH
                            //rotate game object
                            const rotation = new Quaternion();
                            rotation.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2); // rotate 90 degrees around y-axis
                            this.gameObject.quaternion.multiply(rotation)
                            this.gameObject.rotation.x = 0;
                            console.log("south")
                        }
                        // @ts-ignore
                        if (this.movingWest())
                         {

                             //rotate game object
                            const rotation = new Quaternion();
                             let  rotationAxis = new Vector3(-direction.z, 0, direction.x).normalize();
                            rotation.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2); // rotate 90 degrees around y-axis
                            this.gameObject.quaternion.multiply(rotation)
                            this.gameObject.rotation.x = 0;



                             console.log("west")
                        }
                        if ( this.movingEast()) {
                            //rotate game object

                            const rotation = new Quaternion();
                            rotation.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2); // rotate 90 degrees around y-axis
                            this.gameObject.quaternion.multiply(rotation)
                            this.gameObject.rotation.x = 0;

                            console.log("east")
                        }

                    }
                    this.currentWaypoint++;


                }*/



            }
        }
    }
}