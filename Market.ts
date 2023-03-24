import { Behaviour, serializable, AssetReference, GameObject, Renderer, EventTrigger, EventList } from "@needle-tools/engine";

import {DragControls} from "three/examples/jsm/controls/DragControls";
import {Counter} from "./Counter";
import {Color, Vector3} from "three";
import {UpgradeShooter} from "./UpgradeShooter";
import {Radius} from "./Radius";
import {ShootProjectile} from "./ShootProjectile";
import {ShootRadialProjectiles} from "./ShootRadialProjectiles";
import {ShootBomb} from "./ShootBomb";
import {Upgrade} from "./Upgrade";

export class Market extends Behaviour {
    @serializable()
    price: number =  200;

    @serializable(AssetReference)
    myPrefab?: AssetReference;

    @serializable(AssetReference)
    greyedOutPrefab?: AssetReference;

    @serializable(AssetReference)
    cash?: AssetReference;

    purchased = [];

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
            this.greyedOutPrefab?.instantiate(content)
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
            //this.addEventListener2(this.forSaleObject)



            // @ts-ignore
            this.greyedOutForSaleObject = prefabs[2];

            let offset = .1
            // @ts-ignore
            if( this.forSaleObject.name === "cannon") {
                offset = .3
            }

            // @ts-ignore
            this.forSaleObject.position.set(this.gameObject.position.x, this.gameObject.position.y + offset, this.gameObject.position.z)

            // @ts-ignore
            this.greyedOutForSaleObject.position.set(this.gameObject.position.x, this.gameObject.position.y + offset, this.gameObject.position.z)

            // @ts-ignore
            this.floatingCash.position.set(this.gameObject.position.x , this.gameObject.position.y + .12 , this.gameObject.position.z - .35)

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
            this.purchased.push(this.forSaleObject)


            // @ts-ignore
            if( this.forSaleObject.name === "short") {
                // @ts-ignore
                const shooterProjectileCopmonenet = GameObject.getComponent(this.forSaleObject, ShootRadialProjectiles)
                // @ts-ignore
                shooterProjectileCopmonenet.onPurchase()
                // @ts-ignore
            } else if(  this.forSaleObject.name === "cannon" ) {
                // @ts-ignore
                const shooterProjectileCopmonenet = GameObject.getComponent(this.forSaleObject, ShootBomb)
                // @ts-ignore
                shooterProjectileCopmonenet.onPurchase()
            } else {
                // @ts-ignore
                const shooterProjectileCopmonenet = GameObject.getComponent(this.forSaleObject, ShootProjectile)
                // @ts-ignore
                shooterProjectileCopmonenet.purchase()
            }

            // @ts-ignore
            this.forSaleObject = gameObject
            // @ts-ignore
            this.forSaleObject.position.set(this.gameObject.position.x, this.gameObject.position.y + .1, this.gameObject.position.z)

            // @ts-ignore
            //GameObject.getOrAddComponent(this.forSaleObject, Radius)
            //wait radiusComponent.instantiate()

            // @ts-ignore
            //this.addEventListener2(this.forSaleObject)
            // @ts-ignore
            this.getCashCounter().add(this.price * -1)


        });



    }

    update() {
        if( this.floatingCash != undefined ){
            // @ts-ignore
            //const cameraPosition = this.context.mainCamera.position;

            //let direction = this.floatingCash.position.clone().sub(this.context.mainCamera.position).normalize();
            //let angle = Math.atan2(direction.x, direction.z);
            // @ts-ignore
            //this.floatingCash.rotation.z = angle * -1 + Math.PI;

        }
    }

    public getPurchased(){
        return this.purchased
    }

    public addPurchased(gameObject: GameObject){
        //@ts-ignore
        this.purchased.push(gameObject)
    }



    public onMoveUp(moveUpAmount){
        //@ts-ignore
        this.forSaleObject?.position.add(new Vector3(0, moveUpAmount, 0))
        // @ts-ignore
        this.greyedOutForSaleObject?.position.add(new Vector3(0, moveUpAmount, 0))
        // @ts-ignore             this.floatingCash = prefabs[0]
        this.floatingCash?.position.add(new Vector3(0, moveUpAmount, 0))
    }

    public rotate(amount){

        const rotationAxis = new Vector3(0, 1, 0);

        // @ts-ignore
        this.forSaleObject?.rotateOnAxis(rotationAxis, amount)
        // @ts-ignore
        this.greyedOutForSaleObject?.rotateOnAxis(rotationAxis, amount)
        // @ts-ignore
        this.floatingCash?.rotateOnAxis(rotationAxis, amount)
    }

}