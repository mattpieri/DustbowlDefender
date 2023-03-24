import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions, AudioSource, EventList, EventTrigger, Renderer } from "@needle-tools/engine";
import {Radius2} from "./Radius2";
import {ScaleManager} from "./ScaleManager";
import {ShootProjectile} from "./ShootProjectile";

import { Animator} from "@needle-tools/engine/engine-components/Animator"
import {Color, Vector3} from "three";
import {Market} from "./Market";
import {Counter} from "./Counter";


export class Upgrade extends Behaviour {

    @serializable(AssetReference)
    upgrade?: AssetReference;

    @serializable(AssetReference)
    upgradeArrowPrefab?: AssetReference;

    @serializable(AssetReference)
    cashPrefab?: AssetReference;

    @serializable()
    cost: number | undefined;


    private clicked = false;

    private _arrow: GameObject |  undefined;
    private _cash: GameObject |  undefined;
    private _upgrade: GameObject |  undefined;

    private actualGameObject;

    private yOffset() {
        const ScaleObject = this.context.scene.getObjectByName("Scale")
        // @ts-ignore
        const scaleComponent = GameObject.getComponent(ScaleObject, ScaleManager)

        let offSetY = 0;
        if(scaleComponent){
            offSetY = scaleComponent?.getScaleY() -.43
        }
        return offSetY
    }

    public onClick (gameObject: GameObject) {

        if (this.clicked) {
            this.clicked = false;

            const comp = GameObject.getComponent(gameObject, Radius2);
            // @ts-ignore
            comp.hideRadius()
            // @ts-ignore
            //GameObject.setActive(this._arrow, false, false, true)
            if( this._arrow) {
                // @ts-ignore
                GameObject.setActive(this._arrow, false, false, true)
                // @ts-ignore
                GameObject.setActive(this._cash, false, false, true)
            }

        } else {
            this.clicked = true;
            const comp = GameObject.getComponent(gameObject, Radius2);
            //@ts-ignore
            comp.showRadius()

            if( this._arrow) {
                //@ts-ignore
                this._arrow.position.set(gameObject.position.x, gameObject.position.y + 1 ,gameObject.position.z)

                //@ts-ignore
                this._cash.position.set(gameObject.position.x, gameObject.position.y + 1.02 ,gameObject.position.z)
                // @ts-ignore
                GameObject.setActive(this._arrow, true, true, true)
                // @ts-ignore
                GameObject.setActive(this._cash, true, true, true)
            }
        }
    }

     async start() {
         /*if( !this.canUpgrade) {
             return
         }*/
         this.actualGameObject = this.gameObject;
         const opt = new InstantiateOptions();
         opt.parent = this.context.scene.getObjectByName("Content");
         //opt.visible = false ///SOME BIG?? OBJECTS WON'T LOADED
         await this.upgrade?.instantiate(opt)
             .then((result) => {
                 // @ts-ignore
                 this._upgrade = result;
                 // @ts-ignore
                 this._upgrade.position.set(this.gameObject.position.x, this.gameObject.position.y + 100, this.gameObject.position.z) ///SOME OBJECTS WON'T LOADED


                 const opt1 = new InstantiateOptions();
                 opt1.parent = this.context.scene.getObjectByName("Content");
                 opt1.visible = false
                 return  this.upgradeArrowPrefab?.instantiate(opt1)
             }).then((result) => {
                 // @ts-ignore
                 this._arrow = result;
                 // @ts-ignore
                 this._arrow.position.set(this.gameObject.position.x, this.gameObject.position.y+ 1.2 , this.gameObject.position.z)

                 // @ts-ignore
                 this.addOnClickEvent(this._arrow)

                 const opt2 = new InstantiateOptions();
                 opt2.parent = this.context.scene.getObjectByName("Content");
                 opt2.visible = false
                 return  this.cashPrefab?.instantiate(opt2)
                 }
             ).then((result)=>{
                 // @ts-ignore
                 this._cash = result;
                 // @ts-ignore
                 this._cash.position.set(this.gameObject.position.x, this.gameObject.position.y+ 1.4 , this.gameObject.position.z)
             })
     }

    private  reject = false;

    private addOnClickEvent(gameObject: GameObject){

         const eventTrigger = GameObject.getOrAddComponent(gameObject, EventTrigger);

         // @ts-ignore
         const highlight = (gameObject: GameObject) => {
             //this.log("Highlight!", "")
             // @ts-ignore
             const renderer = GameObject.getComponent(this._arrow, Renderer);
             // @ts-ignore
             renderer.material.color = new Color(1, 0.92, 0.016, 1);
         };
         // @ts-ignore
         const unhighlight = (gameObject: GameObject) => {
             //this.log("Don't Highlight!", "")
             // @ts-ignore
             const renderer = GameObject.getComponent(this._arrow, Renderer);
             // @ts-ignore
             renderer.material.color = new Color(1, 1, 1, 1);
         };

         // Create an EventList that will be invoked when the button is clicked
         const onEnterEvent: EventList = new EventList();
         // Add the onClickCallback function to the EventList
         onEnterEvent.addEventListener((...args: any[]) => {
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



         const onArrowClick = (gameObject) => {
             let cashCounter = this.context.scene.getObjectByName("CashCounter")
             // @ts-ignore
             const cashCounterComp = GameObject.getComponent(cashCounter, Counter)

             // @ts-ignore
             if (this.cost > cashCounterComp.getValue()) {
                 this.reject = true;
                 this.rejectTimer = 0;
                 return
             }
             // @ts-ignore
             cashCounterComp.getValue()

             // @ts-ignore
             cashCounterComp.add(-1 * this.cost)

             // @ts-ignore
             this._upgrade.position.set(this.actualGameObject.position.x,this.actualGameObject.position.y ,this.actualGameObject.position.z)

             let cactusMarket = this.context.scene.getObjectByName("CactusMarket")
             // @ts-ignore
             let marketComp = GameObject.getComponent( cactusMarket, Market)

             // @ts-ignore
             marketComp.addPurchased(this._upgrade)



             console.log(gameObject)
             const comp = GameObject.getComponent(this.actualGameObject, Radius2);
             // @ts-ignore
             comp.hideRadius()



             const shootercop = GameObject.getComponent(this.actualGameObject, ShootProjectile);
             // @ts-ignore
             shootercop.destory()

             // @ts-ignore
             GameObject.destroy(this._arrow)
             // @ts-ignore
             GameObject.destroy(this._cash)
             GameObject.destroy(this.actualGameObject)
         }

         const onClickEvent: EventList = new EventList();
         onClickEvent.addEventListener((...args: any[]) => {

             // @ts-ignore
             onArrowClick(gameObject, ...args);
         });

         // Add the onClickEventList to the EventTrigger's triggers array
         // @ts-ignore
         eventTrigger.triggers = [/*{
             eventID: 0,
             callback: onEnterEvent,
         }, {
             eventID: 1,
             callback: onExitEvent,
         }, */{
             eventID: 4,
             callback: onClickEvent,
         }];
     }
    private elapsedTime: number = 0;
    private rejectTimer = 0;

     update(){
        if(this._arrow){
            this._arrow.rotation.z = this._arrow.rotation.z + .01
            // @ts-ignore
            if(this._cash) {
                this._cash.rotation.y = this._cash.rotation.y + .01
            }

            if(this.reject){
                let speed = 15
                this.elapsedTime += this.context.time.deltaTime * speed;
                this.rejectTimer += this.context.time.deltaTime
                let oscillationHeight = Math.sin(this.elapsedTime)   * .25
                this._arrow.position.setZ( this.actualGameObject.position.z +  oscillationHeight );
                this._arrow.position.setY( 1.4 +  this.yOffset());
                if(this.rejectTimer > .5){
                    this._arrow.position.setZ( this.actualGameObject.position.z );
                    this.reject = false
                }

            }else {
                let speed = 5
                this.elapsedTime += this.context.time.deltaTime * speed;
                let oscillationHeight = Math.sin(this.elapsedTime)   * .05
                this._arrow.position.setY(1.4 + oscillationHeight + this.yOffset());
            }


        }
     }

     public onMoveUp(up){
         if( this._arrow){
             this._arrow.position.add(new Vector3(0, up, 0));
         }
         if( this._cash){
             this._cash.position.add(new Vector3(0, up, 0));
         }
         if( this._upgrade){
             this._upgrade.position.add(new Vector3(0, up, 0));
         }
     }
}




