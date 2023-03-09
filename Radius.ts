import { Behaviour, serializable, AssetReference, GameObject, EventList, InstantiateOptions, EventTrigger} from "@needle-tools/engine";
import {Cache, Color, Object3D, Quaternion, Euler, Vector3} from "three";
import {ShootBomb} from "./ShootBomb";

const delay = ms => new Promise(res => setTimeout(res, ms));

export class Radius extends Behaviour {
    @serializable(AssetReference)
    ringPrefab?: AssetReference;

    @serializable(AssetReference)
    upgrade1Prefab?: AssetReference;

    @serializable(AssetReference)
    upgrade2Prefab?: AssetReference;

    private _ring: GameObject | undefined | null;

    private _upgrade1:  GameObject | undefined | null;
    private _upgrade2:  GameObject | undefined | null;

    private toggleUpgrades = false;
    private toggle = false;

    private _gameObject: GameObject | undefined

    public setGameObject(gameObject: GameObject){
        this._gameObject = gameObject;
    }

    public getGameObject(){
        return this._gameObject;
    }

    async start() {
        if (!this.ringPrefab ) {
            console.warn("It's possible that the warning message was logged during the first run of the start() function, " +
                "but then later on this.cash and this.myPrefab were defined by some other code, " +
                "which allowed the Promise.all() call to execute successfully during subsequent frames.");
            return;
        }
        if (!this.upgrade1Prefab ) {
            console.warn("It's possible that the warning message was logged during the first run of the start() function, " +
                "but then later on this.cash and this.myPrefab were defined by some other code, " +
                "which allowed the Promise.all() call to execute successfully during subsequent frames.");
            return;
        }
        const content = this.context.scene.getObjectByName("Content")

        const opt = new InstantiateOptions();
        opt.visible = false;
        opt.parent = content;



        await this.ringPrefab?.instantiate(opt).then(async (result) => {
            // @ts-ignore
            this._ring = result;

            // @ts-ignore
            this.addOnUpgradeListener(this._ring)

            const opt2 = new InstantiateOptions();
            let content2 = this.context.scene.getObjectByName("Content")

            opt2.visible = true; //need to figure why
            opt2.parent = content2;
            await this.upgrade1Prefab?.instantiate(opt2).then(async (result) => {
                // @ts-ignore
                this._upgrade1 = result

                // @ts-ignore
                this.addRangeUpgradeSelectListener(this._upgrade1)

                // @ts-ignore
                this.hideUpgrades(this.gameObject, this._upgrade1)
                // @ts-ignore

                let content3 = this.context.scene.getObjectByName("Content")

                opt2.visible = true; //need to figure why
                opt2.parent = content3;
                await this.upgrade2Prefab?.instantiate(opt2).then((result) => {
                    // @ts-ignore
                    this._upgrade2 = result

                    // @ts-ignore
                    this.addSpeedUpgradeSelectListener(this._upgrade2)
                    // @ts-ignore
                    this.hideUpgrades(this.gameObject, this._upgrade2)
                    // @ts-ignore
                })
            })

        })
    }

    addOnUpgradeListener(gameObject: GameObject){

        // @ts-ignore
        const eventTrigger = GameObject.getOrAddComponent(gameObject, EventTrigger);

        // Define a callback function that accepts the GameObject and event arguments as parameters
        const onClickCallback = (gameObject: GameObject) => {
            console.log("HELLLLLLLLLLLLLLLLLLLLO")
            // @ts-ignore
            if( this.toggleUpgrades ){
                // @ts-ignore
                this.hideUpgrades(gameObject, this._upgrade1)
                // @ts-ignore
                this.hideUpgrades(gameObject, this._upgrade2)}
            else{
                // @ts-ignore
                this.showUpgrades(gameObject, this._upgrade1)
                // @ts-ignore
                this.showUpgrades(gameObject, this._upgrade2)
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

    addSpeedUpgradeSelectListener(gameObject: GameObject){

        // @ts-ignore
        const eventTrigger = GameObject.getOrAddComponent(gameObject, EventTrigger);

        // Define a callback function that accepts the GameObject and event arguments as parameters
        const onClickCallback = (gameObject: GameObject) => {
            console.log("Speed Upgrade Selected", gameObject)


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

    addRangeUpgradeSelectListener(gameObject: GameObject){

        // @ts-ignore
        const eventTrigger = GameObject.getOrAddComponent(gameObject, EventTrigger);

        // Define a callback function that accepts the GameObject and event arguments as parameters
        const onClickCallback = (gameObject: GameObject) => {
            console.log("Range Upgrade Selected", gameObject)

            // @ts-ignore
            if( this._gameObject.name === "cannon") {
                // @ts-ignore
                const shootingComponenet = GameObject.getComponent(this._gameObject, ShootBomb)
                // @ts-ignore
                shootingComponenet.upgrade()
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

    public isShow(){
        return this.toggle
    }

    public getRing(){
        return this._ring
    }

    public showRing(gameObject: GameObject, ring: GameObject){
        console.log("INSIDE SHOW")
        console.log("BEFORE", ring)
        // @ts-ignore
        ring.position.set(gameObject.position.x, gameObject.position.y+1, gameObject.position.z)
        // @ts-ignore
        GameObject.setActive(ring, true, false, true, true)
        console.log("AFTER", ring)

        this.toggle = true

    }

    public hideRing(gameObject, ring: GameObject){
        console.log("INSIDE HIDE")
        console.log("BEFORE", ring)
        // @ts-ignore
        ring.position.set(gameObject.position.x, gameObject.position.y+1, gameObject.position.z)
        // @ts-ignore
        GameObject.setActive(ring, false, false, true, true)
        console.log("AFTER", ring)
        this.toggle = false
    }

    public showUpgrades(gameObject, test: GameObject){
        //console.log( test )
        // @ts-ignore
        test.position.set(gameObject.position.x+.5, gameObject.position.y + (-.5), gameObject.position.z)
        // @ts-ignore
        GameObject.setActive(test, true, false, true) //, true)
        this.toggleUpgrades = true
    }

    public hideUpgrades(gameObject, test: GameObject){
        //console.log( test )
        // @ts-ignore
        test.position.set(gameObject.position.x+.5, gameObject.position.y + (-.5), gameObject.position.z)
        // @ts-ignore
        GameObject.setActive(test, false, false, true) //, true)
        this.toggleUpgrades = false
    }

    private _angleUpgrade1 = 90;
    private _angleUpgrade2 = 180;
    update(){
        // Move the GameObject up and down
        if( this._ring !== undefined) {
            //const yMovement = Math.sin(this.context.time.deltaTime * 5 ) * 0.5;
            //console.log(newPosition)
            // @ts-ignore
            //const newPosition = this._ring.position.clone().add(new Vector3(0, yMovement, 0));
            // @ts-ignore
            //this._ring.position.set(newPosition.x, newPosition.y, newPosition.z);

            // Rotate the ring in 360 degrees
            // @ts-ignore
            this._ring.rotation.z += this.context.time.deltaTime * .5;

            if(this._upgrade1 !== undefined) {
                const distance = .7;
                const speed = .5;

                // Calculate the new position of the orbiting object
                const angle = (this._angleUpgrade1 + speed * this.context.time.deltaTime) % (2 * Math.PI);
                // @ts-ignore
                const x = this._ring.position.x + distance * Math.sin(angle);
                // @ts-ignore
                const z = this._ring.position.z + distance * Math.cos(angle);
                // @ts-ignore
                const newPosition = new Vector3(x, this._upgrade1.position.y, z);
                // @ts-ignore
                this._upgrade1.position.copy(newPosition);
                this._angleUpgrade1 = angle;
                // @ts-ignore

                this._upgrade1.rotation.y -= this.context.time.deltaTime * .5;
            }

            if(this._upgrade2 !== undefined) {
                const distance = .7;
                const speed = .5;

                // Calculate the new position of the orbiting object
                const angle = (this._angleUpgrade2 + speed * this.context.time.deltaTime) % (2 * Math.PI);
                // @ts-ignore
                const x = this._ring.position.x + distance * Math.sin(angle);
                // @ts-ignore
                const z = this._ring.position.z + distance * Math.cos(angle);
                // @ts-ignore
                const newPosition = new Vector3(x, this._upgrade1.position.y, z);
                // @ts-ignore
                this._upgrade2.position.copy(newPosition);
                this._angleUpgrade2 = angle;
                // @ts-ignore

                this._upgrade2.rotation.y -= this.context.time.deltaTime * .5;
            }
        }

    }

}