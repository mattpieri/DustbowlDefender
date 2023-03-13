
import {Behaviour, Collision, GameObject, Renderer, showBalloonMessage, Text, WebXR, EventList, EventTrigger } from "@needle-tools/engine";
import { RaycastOptions } from "@needle-tools/engine/engine/engine_physics";
import { DragControls, DragEvents } from "@needle-tools/engine/engine-components/DragControls"
import {Cache, Color, Object3D, Ray, Vector3} from "three";
import {TargetManager} from "./TargetManager";
//import {DragControls} from "three/examples/jsm/controls/DragControls";
import { Market} from "./Market"
import {Radius2} from "./Radius2";

export class SnapToTile extends Behaviour {
    private currentCubeBelow = new Object3D();
    private previousCubeBelow = new Object3D();

    private purchased = false;

    private inValidLocation = false;


    private log(message, message2){
        const texty = this.context.scene.getObjectByName("Texty")
        // @ts-ignore
        const TextComponent = GameObject.getComponent(texty, Text)
        // @ts-ignore
        TextComponent.text = message + "\n" + message2
    }

    getCubeBelow(interactions) {
        for (const interaction of interactions) {
            if (interaction.object.name.startsWith("Plane")) {
                this.inValidLocation = true
                console.log("Overplane")
                //this.log("Overplane")
                return interaction.object;
            } else {
                //this.log("Not Overplane")
                this.inValidLocation = false
            }
        }
        return null;
    }

    highlight(cube) {
        const renderer = GameObject.getComponent(cube, Renderer);
        // @ts-ignore
        renderer.material.color = new Color(0.97, 0.98, 0, 1);
    }

    UnHighlight(cube) {
        const test = GameObject.getComponent(cube, Renderer);
        // @ts-ignore

        test.material.color = new Color(1, 1, 1, 1);
    }

    getMarket(type) {

        let MarketObj;
        if (type === "cactus") {
            MarketObj = this.context.scene.getObjectByName("CactusMarket")
        } else if (type === "short") {
            MarketObj = this.context.scene.getObjectByName("ShortMarket")
        } else if (type === "cannon") {
            MarketObj = this.context.scene.getObjectByName("BombMarket")
        }
        // @ts-ignore
        return GameObject.getComponent(MarketObj, Market);
    }

    getMarketObject(type) {

        let MarketObj;
        if (type === "cactus") {
            MarketObj = this.context.scene.getObjectByName("CactusMarket")
        } else if (type === "short") {
            MarketObj = this.context.scene.getObjectByName("ShortMarket")
        } else if (type === "cannon") {
            MarketObj = this.context.scene.getObjectByName("BombMarket")
        }
        // @ts-ignore
        return MarketObj;
    }

    private dragging = false;

    private resetGameObject(){
        const market = this.getMarketObject(this.gameObject.name)
        console.log("market", market.position)
        console.log("cactus", this.gameObject.position)
        // @ts-ignore
        this.gameObject.position.set( market.position.x, this.gameObject.position.y + .1, market.position.z)
    }

    start(){
        /*if( !WebXR.IsInWebXR) {
            this.log( "Hellllo", "not in XR " + this.gameObject.name)
            const dragControls = GameObject.getComponent(this.gameObject, DragControls)

            const dragStart = () => {
                console.log("Drag Started!")
                //this.log("Drag", "Started!")

                this.dragging = true

                const comp = GameObject.getComponent(this.gameObject, Radius2);
                // @ts-ignore
                comp.showRadius()
                // @ts-ignore
                comp.moveRadius()
            }

            const dragEnd = () => {
                //this.log("Drag", "Ended!")

                this.dragging = false
                const comp = GameObject.getComponent(this.gameObject, Radius2);
                // @ts-ignore
                comp.hideRadius()
                // @ts-ignore
                comp.stopMovingRadius()

                if (this.purchased === false) {
                    if (this.inValidLocation) {
                        this.purchased = true;
                        this.gameObject.position.set(this.gameObject.position.x, .1, this.gameObject.position.z)

                        // @ts-ignore
                        this.getMarket(this.gameObject.name).purchase()

                        // @ts-ignore
                        let component = this.gameObject.getComponent(DragControls)
                        // @ts-ignore
                        GameObject.removeComponent(component)

                    } else {
                        this.resetGameObject()
                    }
                }
            }

            if (dragControls) {
                dragControls.addDragEventListener(DragEvents.SelectEnd, dragEnd)
                dragControls.addDragEventListener(DragEvents.SelectStart, dragStart)
            }
        } else { */
        this.log( "Hellllo in XR ",this.gameObject.name)

        this.addGameStartListener(this.gameObject)
        //}

    }

    addGameStartListener(gameObject: GameObject){
        // @ts-ignore
        const eventTrigger = GameObject.getOrAddComponent(gameObject, EventTrigger);

        // Define a callback function that accepts the GameObject and event arguments as parameters
        const highlight = (gameObject: GameObject) => {
            this.log("Drag", "Started!")
            this.dragging = true

            const comp = GameObject.getComponent(gameObject, Radius2);

            if(comp != undefined) {
                // @ts-ignore
                comp.showRadius()
                // @ts-ignore
                comp.moveRadius()
            }
        };

        const unhighlight = (gameObject: GameObject) => {
            this.log("Drag", "Ended!")

            this.dragging = false
            const comp = GameObject.getComponent(gameObject, Radius2);
            console.log(comp)
            if(comp != undefined) {
                // @ts-ignore
                comp.hideRadius()
                // @ts-ignore
                comp.stopMovingRadius()
            }

            if (this.purchased === false) {
                if (this.inValidLocation) {
                    this.purchased = true;
                    this.gameObject.position.set(gameObject.position.x, .1, this.gameObject.position.z)
                    this.gameObject.rotation.set(0, 0,0)

                    // @ts-ignore
                    this.getMarket(gameObject.name).purchase()

                    // @ts-ignore
                    let component = gameObject.getComponent(DragControls)
                    // @ts-ignore
                    GameObject.removeComponent(component)

                } else {
                    this.resetGameObject()
                }
            }

        };

        // Create an EventList that will be invoked when the button is clicked
        const onEnterEvent: EventList = new EventList();
        // Add the onClickCallback function to the EventList
        onEnterEvent.addEventListener((...args: any[]) => {
            //if( this.dragging )
            //    return
            // @ts-ignore
            highlight(gameObject, ...args);
        });

        // Create an EventList that will be invoked when the button is clicked
        const onExitEvent: EventList = new EventList();
        // Add the onClickCallback function to the EventList
        onExitEvent.addEventListener((...args: any[]) => {
            // @ts-ignore
            unhighlight(gameObject, ...args);
        });

        // Add the onClickEventList to the EventTrigger's triggers array
        // @ts-ignore
        eventTrigger.triggers = [{
            eventID: 2, //0,
            callback: onEnterEvent,
        }, {
            eventID: 3, //1,
            callback: onExitEvent,
        }];
    }

    update() {
        //this.log("Hello", "World")
        if( this.dragging ) {
            this.log("Dragging", "!")
            //this.log("Dragging", "World")
            //this.gameObject.rotation.set(0, 0, 0)
            //this.gameObject.scale.set(.12, .12, .12)
            const ray = new Ray(this.gameObject.position, new Vector3(0, -1, 0));
            const options = new RaycastOptions();
            options.maxDistance = 100;
            const intersections = this.context.physics.raycastFromRay(ray, options)

            //this.log(this.context.physics)
            //this.log(intersections?.[0]?.object.name)

            //highlight the cube below
            let cubeBelow = this.getCubeBelow(intersections);
            if (cubeBelow !== null) { //in case where we are hovering in-between or or off the map
                if (cubeBelow !== this.currentCubeBelow) {
                    this.previousCubeBelow = this.currentCubeBelow;
                    this.currentCubeBelow = cubeBelow;
                    this.highlight(this.currentCubeBelow)
                    if (this.previousCubeBelow !== null) {
                        // @ts-ignore
                        const test = GameObject.getComponent(this.previousCubeBelow, Renderer);
                        // @ts-ignore
                        if (test !== null) {
                            // @ts-ignore
                            test.material.color = new Color(1, 0.65, 0.2, 1);
                        }
                    }
                }
            }
        }
    }
}