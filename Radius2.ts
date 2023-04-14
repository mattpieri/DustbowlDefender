import { Behaviour, serializable, AssetReference, GameObject, EventList, InstantiateOptions, EventTrigger} from "@needle-tools/engine";
import {Color, Vector3} from "three";
import {Scale} from "./Scale";
import {ScaleManager} from "./ScaleManager";
import {ShootProjectile} from "./ShootProjectile";




export class Radius2 extends Behaviour {


    @serializable(AssetReference)
    radiusPrefab?: AssetReference;

    private _radius: GameObject | undefined | null;

    private _moveRadius = false;

    @serializable()
    addOnClickListener: boolean = false;

    async start() {
        const opt = new InstantiateOptions();
        opt.parent = this.context.scene.getObjectByName("Content");
        opt.visible = false
        await this.radiusPrefab?.instantiate(opt).then((result) => {
            // @ts-ignore
            this._radius = result;
            const ScaleObject = this.context.scene.getObjectByName("Scale")
            // @ts-ignore
            const scaleComponenet = GameObject.getComponent(ScaleObject, ScaleManager)
            // @ts-ignore
            this._radius.position.set(this.gameObject.position.x, scaleComponenet.getScaleY() -.1 , this.gameObject.position.z)

            if( this.addOnClickListener){
                this.addOnClickEvent(this.gameObject)
            }
        })
    }

    public showRadius(){
        //console.log("SHOW RADIUS")
        const ScaleObject = this.context.scene.getObjectByName("Scale")
        // @ts-ignore
        const scaleComponenet = GameObject.getComponent(ScaleObject, ScaleManager)
        // @ts-ignore
        this._radius.position.set(this.gameObject.position.x, scaleComponenet.getScaleY() -.1 , this.gameObject.position.z)

        // @ts-ignore
        GameObject.setActive(this._radius, true, true, true)
    }

    public hideRadius(){
        const ScaleObject = this.context.scene.getObjectByName("Scale")
        // @ts-ignore
        const scaleComponenet = GameObject.getComponent(ScaleObject, ScaleManager)
        // @ts-ignore
        this._radius.position.set(this.gameObject.position.x, scaleComponenet.getScaleY() -.1 , this.gameObject.position.z)
        // @ts-ignore
        GameObject.setActive(this._radius, false, false, true)
    }

    public moveRadius(){
        this._moveRadius = true
    }

    public stopMovingRadius(){
        this._moveRadius = false
    }


    private clicked: boolean = false


    private addOnClickEvent(gameObject: GameObject){

        const eventTrigger = GameObject.getOrAddComponent(gameObject, EventTrigger);

        const onClick = () => {

            if (this.clicked) {
                this.clicked = false;
                // @ts-ignore
                this.hideRadius()
            } else {
                this.clicked = true;
                //@ts-ignore
                this.showRadius()
            }
        }

        const onClickEvent: EventList = new EventList();
        onClickEvent.addEventListener((...args: any[]) => {

            // @ts-ignore
            onClick( ...args);
        });

        // @ts-ignore
        eventTrigger.triggers = [{
            eventID: 4,
            callback: onClickEvent,
        }];
    }


    update(){
        if(this._moveRadius){
            if( this._radius) {

                const ScaleObject = this.context.scene.getObjectByName("Scale")
                // @ts-ignore
                const scaleComponenet = GameObject.getComponent(ScaleObject, ScaleManager)

                // @ts-ignore
                this._radius.position.set(this.gameObject.position.x, scaleComponenet.getScaleY() -.1 , this.gameObject.position.z)
            }
        }
    }

    public onMoveUp(up){
        if( this._radius){
            this._radius.position.add(new Vector3(0, up, 0));
        }
    }


}