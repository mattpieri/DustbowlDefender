import { Behaviour, serializable, AssetReference, GameObject, Renderer, EventTrigger, EventList } from "@needle-tools/engine";

import {DragControls} from "three/examples/jsm/controls/DragControls";
import {Counter} from "./Counter";
import {Color} from "three";
import {UpgradeShooter} from "./UpgradeShooter";
import {Radius} from "./Radius";

export class Market extends Behaviour {
    @serializable()
    price: number =  200;

    @serializable(AssetReference)
    myPrefab?: AssetReference;

    @serializable(AssetReference)
    greyedOutPrefab?: AssetReference;

    @serializable(AssetReference)
    cash?: AssetReference;

    floatingCash = undefined;

    forSaleObject = undefined;

    greyedOutForSaleObject = undefined

    public makeGrey(){
        // @ts-ignore
        GameObject.setActive(this.greyedOutForSaleObject, true, true, true)
        // @ts-ignore
        GameObject.setActive(this.forSaleObject, false, true, false)
    }

    public makeNotGrey(){
        // @ts-ignore
        GameObject.setActive(this.forSaleObject, true, true, true)
        // @ts-ignore
        GameObject.setActive(this.greyedOutForSaleObject, false, true, false)
    }

    public getForSaleObject() {
        return this.forSaleObject
    }

    public getPrice() {
        return this.price
    }

    getCashCounter() {
        const CashCounter = this.context.scene.getObjectByName("CashCounter")

        // @ts-ignore
        return  GameObject.getComponent(CashCounter, Counter);
    }

    addEventListener2(gameObject: GameObject){

        // @ts-ignore
        const eventTrigger = GameObject.getOrAddComponent(gameObject, EventTrigger);

        // Define a callback function that accepts the GameObject and event arguments as parameters
        const onClickCallback = (gameObject: GameObject) => {
            const uuid = gameObject.uuid;
            const upgradeShooter = GameObject.getComponent(gameObject, UpgradeShooter)
            const radiusComponent = GameObject.getComponent(gameObject, Radius)
            // @ts-ignore
            if( upgradeShooter.isShow()){

                // @ts-ignore
                upgradeShooter.hideRing(gameObject, upgradeShooter.getRing())
            }else{
                // @ts-ignore
                //upgradeShooter.showUpdateButton(gameObject, upgradeShooter.getArrow())
                // @ts-ignore
                upgradeShooter.showRing(gameObject, upgradeShooter.getRing())
            }


            // @ts-ignore
            if( radiusComponent.isShow()){
                // @ts-ignore
                radiusComponent.hideRing(gameObject, radiusComponent.getRing())
            }else{
                // @ts-ignore
                radiusComponent.showRing(gameObject, radiusComponent.getRing())
            }
        };

        // Create an EventList that will be invoked when the button is clicked
        const onClickEventList: EventList = new EventList();
        // Add the onClickCallback function to the EventList
        onClickEventList.addEventListener((...args: any[]) => {
            // @ts-ignore
            onClickCallback(gameObject, ...args);
        });

        // Add the onClickEventList to the EventTrigger's triggers array
        // @ts-ignore
        eventTrigger.triggers = [{
            eventID: 4,
            callback: onClickEventList,
        }];
    }

    async start() {
        if (!this.cash || !this.myPrefab) {
            console.warn("It's possible that the warning message was logged during the first run of the start() function, " +
                "but then later on this.cash and this.myPrefab were defined by some other code, " +
                "which allowed the Promise.all() call to execute successfully during subsequent frames.");
            return;
        }
        const content = this.context.scene.getObjectByName("Content")
        await Promise.all([
            this.cash?.instantiate(content),
            this.myPrefab?.instantiate(content),
            this.greyedOutPrefab?.instantiate()
        ]).then(async (prefabs) => {

            // @ts-ignore
            this.floatingCash = prefabs[0]
            // @ts-ignore
            this.forSaleObject = prefabs[1];


            // @ts-ignore
            const onSelectComponent = GameObject.getOrAddComponent(this.forSaleObject, UpgradeShooter)
            await onSelectComponent.instantiate()
            // @ts-ignore
            GameObject.getOrAddComponent(this.forSaleObject, Radius)
            //await radiusComponent.instantiate()

            // @ts-ignore
            this.addEventListener2(this.forSaleObject)

            // @ts-ignore
            this.greyedOutForSaleObject = prefabs[2];

            // @ts-ignore
            this.forSaleObject.position.set(this.gameObject.position.x, this.gameObject.position.y + .1, this.gameObject.position.z)

            // @ts-ignore
            this.greyedOutForSaleObject.position.set(this.gameObject.position.x, this.gameObject.position.y + .1, this.gameObject.position.z)

            // @ts-ignore
            this.floatingCash.position.set(this.gameObject.position.x - .1, this.forSaleObject.position.y + 1, this.gameObject.position.z)

            // @ts-ignore
            if (this.price > this.getCashCounter().getValue()) { // this.getCashCounter().getValue()  ) {

                // @ts-ignore
                //let component = this.forSaleObject.getComponent(DragControls)
                // @ts-ignore
                //GameObject.removeComponent(component)

                this.makeGrey()
            } else {
                this.makeNotGrey()
            }
        })
        // @ts-ignore
    }


    async purchase(){

        //let forSaleObject = await this.myPrefab?.instantiateSynced({parent:this.gameObject}, true);
        const content = this.context.scene.getObjectByName("Content")

        await this.myPrefab?.instantiate(content).then(async (gameObject) => {

            // @ts-ignore
            this.forSaleObject = gameObject
            // @ts-ignore
            this.forSaleObject.position.set(this.gameObject.position.x, this.gameObject.position.y + .1, this.gameObject.position.z)


            // @ts-ignore
            const onSelectComponent = GameObject.getOrAddComponent(this.forSaleObject, UpgradeShooter)
            await onSelectComponent.instantiate()
            // @ts-ignore
            GameObject.getOrAddComponent(this.forSaleObject, Radius)
            //wait radiusComponent.instantiate()

            // @ts-ignore
            this.addEventListener2(this.forSaleObject)
            // @ts-ignore
            this.getCashCounter().add(this.price * -1)
        });



    }

    update() {
        if( this.floatingCash != undefined ){
            // @ts-ignore
            //const cameraPosition = this.context.mainCamera.position;

            let direction = this.floatingCash.position.clone().sub(this.context.mainCamera.position).normalize();
            let angle = Math.atan2(direction.x, direction.z);
            // @ts-ignore
            this.floatingCash.rotation.z = angle * -1 + Math.PI;

        }
    }
}