import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions, AudioSource, EventList, EventTrigger } from "@needle-tools/engine";
import {Radius2} from "./Radius2";
import {ScaleManager} from "./ScaleManager";
import {ShootProjectile} from "./ShootProjectile";




export class Upgrade extends Behaviour {

    @serializable(AssetReference)
    upgrade?: AssetReference;

    @serializable(AssetReference)
    upgradeArrowPrefab?: AssetReference;

    @serializable()
    canUpgrade: boolean = false;

    private clicked = false;

    private _arrow: undefined;
    private _upgrade: undefined;

    private actualGameObject;

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
            }

        } else {
            this.clicked = true;
            const comp = GameObject.getComponent(gameObject, Radius2);
            //@ts-ignore
            comp.showRadius()

            if( this._arrow) {
                //@ts-ignore
                this._arrow.position.set(gameObject.position.x, gameObject.position.y + 1,gameObject.position.z)
                // @ts-ignore
                GameObject.setActive(this._arrow, true, true, true)
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
                 this._arrow.position.set(this.gameObject.position.x, this.gameObject.position.y+ 1 , this.gameObject.position.z)

                 // @ts-ignore
                 this.addOnClickEvent(this._arrow)

                 }
             )
     }

     private addOnClickEvent(gameObject: GameObject){

         const eventTrigger = GameObject.getOrAddComponent(gameObject, EventTrigger);

         const onArrowClick = (gameObject) => {
             // @ts-ignore
             this._upgrade.position.set(this.actualGameObject.position.x,this.actualGameObject.position.y ,this.actualGameObject.position.z)
             console.log(gameObject)
             const comp = GameObject.getComponent(this.actualGameObject, Radius2);
             // @ts-ignore
             comp.hideRadius()

             const shootercop = GameObject.getComponent(this.actualGameObject, ShootProjectile);
             // @ts-ignore
             shootercop.destory()

             // @ts-ignore
             GameObject.destroy(this._arrow)
             GameObject.destroy(this.actualGameObject)
         }

         const onClickEvent: EventList = new EventList();
         onClickEvent.addEventListener((...args: any[]) => {

             // @ts-ignore
             onArrowClick(gameObject, ...args);
         });

         // Add the onClickEventList to the EventTrigger's triggers array
         // @ts-ignore
         eventTrigger.triggers = [{
             eventID: 4,
             callback: onClickEvent,
         }]
     }
}



