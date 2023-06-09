

import { Behaviour, serializable, AssetReference, GameObject, EventList, InstantiateOptions, EventTrigger , WebXR, FrameEvent } from "@needle-tools/engine";
import {Vector3} from "three";
import {LevelManager} from "./LevelManager";
import {Market} from "./Market";
import {TargetManager} from "./TargetManager";
import {ScaleManager} from "./ScaleManager";
import { Animator} from "@needle-tools/engine/engine-components/Animator"
import {Radius2} from "./Radius2";
import {Upgrade} from "./Upgrade";
import {Counter} from "./Counter";
import {ShootRadialProjectiles} from "./ShootRadialProjectiles";
import { WaitForSeconds } from "@needle-tools/engine/engine/engine_coroutine";
import {LoadManager} from "./LoadManager";
import {ShootBomb} from "./ShootBomb";
import {ShootProjectile} from "./ShootProjectile";


export class Scale extends Behaviour {


    private isPressed = false;

    @serializable()
    type?: number = 1 //1 up
                      //2 down
                      //3 rotate right
                      //4 rotate left


    private isInWebXR = false


    private moveMarket(up, marketName: string){
        const cactusMarketObj = this.context.scene.getObjectByName(marketName)
        // @ts-ignore
        const cactusMarketComponent = GameObject.getComponent(cactusMarketObj, Market)
        cactusMarketComponent?.onMoveUp(up)

        cactusMarketObj?.position.add(new Vector3(0, up, 0));


        // @ts-ignore
        let purchasedObjs = cactusMarketComponent.getPurchased();
        //console.log(purchasedObjs)

        for (let i = 0; i < purchasedObjs.length; i++) {

            // @ts-ignore
            purchasedObjs[i].position.add(new Vector3(0, up, 0));


            // @ts-ignore
            const radiusComp = GameObject.getComponent(purchasedObjs[i], Radius2)
            radiusComp?.onMoveUp(up)


            // @ts-ignore
            const uppradeComp = GameObject.getComponent(purchasedObjs[i], Upgrade)
            uppradeComp?.onMoveUp(up)


            // @ts-ignore
            if( purchasedObjs[i].name.startsWith("short")) {
                // @ts-ignore
                GameObject.getComponent(purchasedObjs[i], ShootRadialProjectiles).moveUp(up)
                // @ts-ignore
            } else if ( purchasedObjs[i].name.startsWith("cannon")){
                // @ts-ignore
                GameObject.getComponent(purchasedObjs[i], ShootBomb).moveUp(up)
                // @ts-ignore
            } else if ( purchasedObjs[i].name.startsWith("cactus")){

                // @ts-ignore
                GameObject.getComponent(purchasedObjs[i], ShootProjectile).moveUp(up)
            }
        }
    }


    private moveUp(){
        let up;
        if(this.type == 1){
            up = .03
        } else if( this.type == 2){
            up = -.03
        }

        ////// LEVEL MANAGER
        const levelManagerObj = this.context.scene.getObjectByName("LevelManager")
        // @ts-ignore
        const levelManagerComponent = GameObject.getComponent(levelManagerObj, LevelManager)
        levelManagerComponent?.onMoveUp(up)




        ////// Health Counter
       const healthCounter = this.context.scene.getObjectByName("HealthCounter")
        // @ts-ignore
       const healthCounterComp = GameObject.getComponent(healthCounter, Counter)
        // @ts-ignore
        healthCounterComp.onMoveUp(up)

        ////// Cash Counter
        const cashCounterObj = this.context.scene.getObjectByName("CashCounter")
        // @ts-ignore
        const cashCounterComp = GameObject.getComponent(cashCounterObj, Counter)
        // @ts-ignore
        cashCounterComp.onMoveUp(up)


        const directionalLight = this.context.scene.getObjectByName("DirectionalLight")
        // @ts-ignore
        directionalLight.position.add(new Vector3(0, up, 0));

        const Scene = this.context.scene.getObjectByName("Scale")
        Scene?.position.add(new Vector3(0, up, 0));

        const button_up = this.context.scene.getObjectByName("button_up")
        // @ts-ignore
        button_up.position.add(new Vector3(0, up, 0));

        const button_down = this.context.scene.getObjectByName("button_down")
        // @ts-ignore
        button_down.position.add(new Vector3(0, up, 0));

        ////// SCALE MANAGER
        const ScaleObj = this.context.scene.getObjectByName("Scale")
        // @ts-ignore
        const ScaleComponenet = GameObject.getComponent(ScaleObj, ScaleManager)
        ScaleComponenet?.addY(up)

        //console.log("TEST")
        this.moveMarket(up, "CactusMarket")
        this.moveMarket(up, "ShortMarket")
        this.moveMarket(up, "BombMarket")

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

    previousTimestamp = null;
    onFrame = (timestamp, xrFrame) => {
        // Process the current frame and update your scene
        // ...

        const xrSession = this.context.renderer.xr.getSession();
        if (this.previousTimestamp !== null) {
            // Calculate the time taken to render one frame
            const frameTime = timestamp - this.previousTimestamp;

            // Display the frame time or use it for other calculations
            this.log(`Time taken for one frame: ${frameTime} ms`, xrFrame.toString());
        }

        // Update the previous timestamp
        this.previousTimestamp = timestamp;

        // Request the next animation frame
        // @ts-ignore
        xrSession.requestAnimationFrame(this.onFrame);
    };

    private coroutine: NodeJS.Timeout | undefined;
    private gameLoaded = false;
    start(){
        this.addGameStartListener(this.gameObject)

        const onWebXREnded = () => {
            GameObject.setActive(this.gameObject, false, false, true)


        }
        const onWebXRStarted = () =>{
            if( this.gameLoaded === false){

                this.coroutine  =  setInterval(() => {
                    this.waitForGameLoad();
                }, 100);
            } else {
                GameObject.setActive(this.gameObject, true, true, true)
            }

            //const xrSession = this.context.renderer.xr.getSession();
            // @ts-ignore
            //this.log(xrSession.frameRate,"")
            // @ts-ignore
            //xrSession.requestAnimationFrame(this.onFrame);
        }

        WebXR.addEventListener("xrStarted", onWebXRStarted);
        WebXR.addEventListener("xrStopped", onWebXREnded);
        GameObject.setActive(this.gameObject, false, false, true)

        //GameObject.setActive(this.gameObject, true, true, true)


    }

    waitForGameLoad() {
        //console.log("test")
        const loadingGameObject = this.context.scene.getObjectByName("LOADING")
        // @ts-ignore
        const loadComponenet = GameObject.getComponent(loadingGameObject, LoadManager)
        // @ts-ignore
        if(loadComponenet.isDone()){
            GameObject.setActive(this.gameObject, true, true, true)
            this.gameLoaded = true;
            // @ts-ignore
            clearInterval(this.coroutine)
        }

    }

    addGameStartListener(gameObject: GameObject){
        // @ts-ignore
        const eventTrigger = GameObject.getOrAddComponent(gameObject, EventTrigger);

        // Define a callback function that accepts the GameObject and event arguments as parameters
        const highlight = () => {
            this.isPressed = true;
        };

        const unhighlight = () => {
            this.isPressed = false;
            const ScaleObject = this.context.scene.getObjectByName("Scale")
            // @ts-ignore
            const scaleComponenet = GameObject.getComponent(ScaleObject, ScaleManager)
            // @ts-ignore
            this.gameObject.position.set(gameObject.position.x,  scaleComponenet.getScaleY() - .12, this.gameObject.position.z)
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


    private elapsedTime = 0
    update(){

        if( this.isPressed){
            if( this.type == 1 || this.type == 2 ) {
                this.moveUp()
                let speed = 5
                this.elapsedTime += this.context.time.deltaTime * speed;
                let oscillationHeight = Math.sin(this.elapsedTime)   * .005
                this.gameObject.position.add(new Vector3(0, oscillationHeight, 0));
            }
            if( this.type == 3 || this.type == 4 ) {
                this.rotate()
            }
        }
    }

}