

import { Behaviour, serializable, AssetReference, GameObject, EventList, InstantiateOptions, EventTrigger , WebXR } from "@needle-tools/engine";
import {Vector3} from "three";
import {LevelManager} from "./LevelManager";
import {Market} from "./Market";
import {TargetManager} from "./TargetManager";
import {ScaleManager} from "./ScaleManager";
import { Animator} from "@needle-tools/engine/engine-components/Animator"

export class Scale extends Behaviour {


    private isPressed = false;

    @serializable()
    type?: number = 1 //1 up
                      //2 down
                      //3 rotate right
                      //4 rotate left


    private isInWebXR = false

    private moveUp(){
        let up;
        if(this.type == 1){
            up = .02
        } else if( this.type == 2){
            up = -.02
        }

        ////// LEVEL MANAGER
        const levelManagerObj = this.context.scene.getObjectByName("LevelManager")
        // @ts-ignore
        const levelManagerComponent = GameObject.getComponent(levelManagerObj, LevelManager)
        levelManagerComponent?.onMoveUp(up)

        ////// CACTUS MARKET
        const cactusMarketObj = this.context.scene.getObjectByName("CactusMarket")
        // @ts-ignore
        const cactusMarketComponent = GameObject.getComponent(cactusMarketObj, Market)
        cactusMarketComponent?.onMoveUp(up)

        cactusMarketObj?.position.add(new Vector3(0, up, 0));

        // @ts-ignore
        let purchasedObjs = cactusMarketComponent.getPurchased();
        for (let i = 0; i < purchasedObjs.length; i++) {
            // @ts-ignore
            purchasedObjs[i].position.add(new Vector3(0, up, 0));

        }
        const Scene = this.context.scene.getObjectByName("Scale")

        Scene?.position.add(new Vector3(0, up, 0));

        ////// SCALE MANAGER
        const ScaleObj = this.context.scene.getObjectByName("Scale")
        // @ts-ignore
        const ScaleComponenet = GameObject.getComponent(ScaleObj, ScaleManager)
        ScaleComponenet?.addY(up)

    }

    private rotate(){
        let left;
        if(this.type == 3){
            left = Math.PI / 720;
        } else if( this.type == 4){
            left = (Math.PI / 720)*-1;
        }
        const rotationAxisZ = new Vector3(0, 0, 1);
        const rotationAxisY = new Vector3(0, 1, 0);

        const Scene = this.context.scene.getObjectByName("Scale")

        Scene?.rotateOnAxis(rotationAxisZ, left)

        ////// LEVEL MANAGER
        const levelManagerObj = this.context.scene.getObjectByName("LevelManager")
        // @ts-ignore
        const levelManagerComponent = GameObject.getComponent(levelManagerObj, LevelManager)
        levelManagerComponent?.rotate(left)

        ////// CACTUS MARKET
        const cactusMarketObj = this.context.scene.getObjectByName("CactusMarket")
        // @ts-ignore
        const cactusMarketComponent = GameObject.getComponent(cactusMarketObj, Market)
        cactusMarketComponent?.rotate(left)

        cactusMarketObj?.rotateOnAxis(rotationAxisY, left)

        // @ts-ignore
        let purchasedObjs = cactusMarketComponent.getPurchased();
        for (let i = 0; i < purchasedObjs.length; i++) {
            // @ts-ignore
            purchasedObjs[i].rotateOnAxis(rotationAxisY, left)
        }
    }




    private log(message, message2){
        const texty = this.context.scene.getObjectByName("Texty")
        // @ts-ignore
        const TextComponent = GameObject.getComponent(texty, Text)
        // @ts-ignore
        TextComponent.text = message + "\n" + message2
    }

    public show(){
        if(WebXR.IsInWebXR){
            GameObject.setActive(this.gameObject, true, true, true)
        }
    }

    public hide(){
        if(WebXR.IsInWebXR){
            GameObject.setActive(this.gameObject, false, false, true)
        }
    }

    start(){
        this.addGameStartListener(this.gameObject)

        const onWebXREnded = () => {
            GameObject.setActive(this.gameObject, false, false, true)

        }
        const onWebXRStarted = () =>{
            GameObject.setActive(this.gameObject, true, true, true)
        }

        WebXR.addEventListener("xrStarted", onWebXRStarted);
        WebXR.addEventListener("xrStopped", onWebXREnded);
        GameObject.setActive(this.gameObject, false, false, true)


    }

    addGameStartListener(gameObject: GameObject){
        // @ts-ignore
        const eventTrigger = GameObject.getOrAddComponent(gameObject, EventTrigger);

        // Define a callback function that accepts the GameObject and event arguments as parameters
        const highlight = () => {
            this.isPressed = true;

            // @ts-ignore
            let animationComponent =  GameObject.getComponent(this.gameObject, Animator)
            // @ts-ignore
            //animationComponent?.play("Cube|Action");
            //animationComponent.Play("Cube|Action_001")
            console.log()
        };

        const unhighlight = () => {
            this.isPressed = false;

        };

        // Create an EventList that will be invoked when the button is clicked
        const onEnterEvent: EventList = new EventList();
        // Add the onClickCallback function to the EventList
        onEnterEvent.addEventListener(() => {
            //if( this.dragging )
            //    return
            // @ts-ignore
            highlight();
        });

        // Create an EventList that will be invoked when the button is clicked
        const onExitEvent: EventList = new EventList();
        // Add the onClickCallback function to the EventList
        onExitEvent.addEventListener(() => {
            // @ts-ignore
            unhighlight();
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

    update(){

        if( this.isPressed){
            if( this.type == 1 || this.type == 2 ) {
                this.moveUp()
            }
            if( this.type == 3 || this.type == 4 ) {
                this.rotate()
            }
        }
    }

}