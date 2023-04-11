
import {Behaviour, Collision, GameObject, Renderer, showBalloonMessage, Text, WebXR, EventList, EventTrigger } from "@needle-tools/engine";
import { RaycastOptions } from "@needle-tools/engine/engine/engine_physics";
import { DragControls, DragEvents } from "@needle-tools/engine/engine-components/DragControls"
import {Cache, Color, Object3D, Ray, Vector3} from "three";
import {TargetManager} from "./TargetManager";
//import {DragControls} from "three/examples/jsm/controls/DragControls";
import { Market} from "./Market"
import {Radius2} from "./Radius2";
import {Scale} from "./Scale";
import {ScaleManager} from "./ScaleManager";
import {Upgrade} from "./Upgrade";

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

    getCubeBelow() {
        const ray = new Ray(this.gameObject.position, new Vector3(0, -1, 0));
        const options = new RaycastOptions();
        options.maxDistance = 100;
        const intersections = this.context.physics.raycastFromRay(ray, options)
        console.log(intersections)
        let surfIsBelow = false;
        let planeIsBelow = false;
        for (const interaction of intersections) {
            if (interaction.object.name.startsWith("surf")) {
                surfIsBelow = true
            }
            if (interaction.object.name.startsWith("Plane")) {
                planeIsBelow = true
            }
        }
        if( surfIsBelow && planeIsBelow){
            this.inValidLocation = true
            this.log("Overplane", "")
            let radiusObject = GameObject.getComponent(this.gameObject, Radius2)
            // @ts-ignore
            radiusObject.showRadius();
        } else {
            this.inValidLocation = false
            this.log("Not Overplane", "")
            let radiusObject = GameObject.getComponent(this.gameObject, Radius2)
            // @ts-ignore
            radiusObject.hideRadius();
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

        const ScaleObject = this.context.scene.getObjectByName("Scale")
        // @ts-ignore
        const scaleComponenet = GameObject.getComponent(ScaleObject, ScaleManager)

        let offset = .2
        // @ts-ignore
        if( this.gameObject.name === "cannon") {
            offset = 0
        } else if ( this.gameObject.name === "short"){
            offset = .2
        }
        // @ts-ignore
        this.gameObject.position.set( market.position.x, scaleComponenet.getScaleY() -offset, market.position.z)
    }

    start(){
        this.addGameStartListener(this.gameObject)
    }

    addGameStartListener(gameObject: GameObject){
        // @ts-ignore
        const eventTrigger = GameObject.getOrAddComponent(gameObject, EventTrigger);

        // Define a callback function that accepts the GameObject and event arguments as parameters
        const highlight = (gameObject: GameObject) => {

            if(this.purchased){
                return
            }
            //this.log("Drag", "Started!")
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
            //this.log("Drag", "Ended!")
            if(this.purchased){
                return
            }

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

                    const ScaleObject = this.context.scene.getObjectByName("Scale")
                    // @ts-ignore
                    const scaleComponenet = GameObject.getComponent(ScaleObject, ScaleManager)

                    // @ts-ignore
                    if(this.gameObject.name === "short"){
                        // @ts-ignore
                        this.gameObject.position.set(gameObject.position.x,  scaleComponenet.getScaleY() -.25, this.gameObject.position.z)
                        this.gameObject.rotation.set(0, 0,0)

                    } else if(this.gameObject.name === "cannon"){
                        // @ts-ignore
                        this.gameObject.position.set(gameObject.position.x,  scaleComponenet.getScaleY() -.02 , this.gameObject.position.z)
                        this.gameObject.rotation.set(0, Math.PI/2*3,0)

                    } else {
                        // @ts-ignore
                        this.gameObject.position.set(gameObject.position.x,  scaleComponenet.getScaleY() -.3, this.gameObject.position.z)
                        this.gameObject.rotation.set(0, Math.PI/2*2,0)
                    }

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

        const onClick = (gameObject: GameObject) => {
            if (this.purchased === false) {
                return
            } else {
                let comp = GameObject.getComponent(gameObject, Upgrade)
                // @ts-ignore
                comp.onClick(gameObject)
            }
        }

        const onClickEvent: EventList = new EventList();
        onClickEvent.addEventListener((...args: any[]) => {
            // @ts-ignore
            onClick(gameObject, ...args);
        });

        // Add the onClickEventList to the EventTrigger's triggers array
        // @ts-ignore
        eventTrigger.triggers = [{
            eventID: 2, //0,
            callback: onEnterEvent,
        }, {
            eventID: 3, //1,
            callback: onExitEvent,
        },{
            eventID: 4,
            callback: onClickEvent,
        }]
    }

    update() {
        if( this.dragging ) {
            //this.log(this.context.physics)
            //this.log(intersections?.[0]?.object.name)

            //highlight the cube below
            let cubeBelow = this.getCubeBelow();
            if (cubeBelow !== null) { //in case where we are hovering in-between or or off the map
                if (cubeBelow !== this.currentCubeBelow) {
                    this.previousCubeBelow = this.currentCubeBelow;
                    this.currentCubeBelow = cubeBelow;
                    //this.highlight(this.currentCubeBelow)
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