import { Behaviour, serializable, AssetReference, GameObject, EventList} from "@needle-tools/engine";


export class UpgradeShooter extends Behaviour {

    @serializable(AssetReference)
    myPrefab?: AssetReference;

    @serializable(AssetReference)
    ringPrefab?: AssetReference;


    private arrowObject: GameObject | undefined | null;
    private _ring: GameObject | undefined | null;

    private toggle = false;

    public getArrow(){
        return this.arrowObject
    }

    public getRing(){
        return this._ring
    }



    async instantiate() {
        if (!this.myPrefab || !this.ringPrefab) {
            console.warn("It's possible that the warning message was logged during the first run of the start() function, " +
                "but then later on this.cash and this.myPrefab were defined by some other code, " +
                "which allowed the Promise.all() call to execute successfully during subsequent frames.");
            return;
        }
        const content = this.context.scene.getObjectByName("Content")
        await Promise.all([
           // this.myPrefab?.instantiate(content),
            this.ringPrefab?.instantiate(content)
        ]).then((promises)=>{
            // @ts-ignore
            //this.arrowObject = promises[0];
            // @ts-ignore
            this._ring = promises[0];

            // @ts-ignore
            //this.arrowObject.position.set(this.gameObject.position.x, this.gameObject.position.y+1, this.gameObject.position.z)
            // @ts-ignore
            this._ring.position.set(this.gameObject.position.x, this.gameObject.position.y, this.gameObject.position.z)
            //console.log("OKAYYYYYYYYYYYYYYY")
            //console.log(this._ring)
            // @ts-ignore
            //console.log(this._ring.visible)
            // @ts-ignore
            //GameObject.setActive(this._ring, false, true, false)
            // @ts-ignore
           // console.log(this._ring.visible)

            //GameObject.setActive(this._ring, false, true, false)
            // @ts-ignore
            //this.hideUpdateButton(this.gameObject, this.arrowObject)

            // @ts-ignore
            this.hideRing(this.gameObject, this._ring)
        })


        /*const flip = async () => {
            if( this.toggle === false){
                this.toggle = true;
                this.hideUpdateButton()
                this.hideRing()
            } else {
                this.toggle = false;
                this.showUpdateButton()
                this.showRing()
            }
        };
        setInterval(flip, 1000);*/

        // you can also just load and instantiate later
        // const myInstance = await this.myPrefab.loadAssetAsync();
        // this.gameObject.add(myInstance)
        // this is useful if you know that you want to load this asset only once because it will not create a copy
        // since ``instantiate()`` does create a copy of the asset after loading it
    }

    /*private arrow(){
        if(this.arrowObject === undefined){
            // @ts-ignore
            this.arrowObject = this.context.scene.getObjectByName("arrow_recaculated");
        }
        return this.arrowObject
    }

    private ring(){
        if(this._ring === undefined){
            // @ts-ignore
            this._ring = this.context.scene.getObjectByName("ring");
        }
        return this._ring
    }*/

    //ShowUpdateButton

    //OnButtonUpgradeClick

    public isShow(){
        return this.toggle
    }



    public showUpdateButton(gameObject: GameObject, arrow: GameObject){
        // @ts-ignore
        arrow.position.set(gameObject.position.x, gameObject.position.y+1, gameObject.position.z)
        // @ts-ignore
        GameObject.setActive(arrow, true, true, true)
        this.toggle = true
    }

    public showRing(gameObject: GameObject, ring: GameObject){
        // @ts-ignore
        ring.position.set(gameObject.position.x, gameObject.position.y, gameObject.position.z)
        // @ts-ignore
        GameObject.setActive(ring, true, true, true)
        this.toggle = true

    }

    public hideUpdateButton(gameObject: GameObject, arrow: GameObject){
        // @ts-ignore
        arrow.position.set(gameObject.position.x, gameObject.position.y+1, gameObject.position.z)
        // @ts-ignore
        GameObject.setActive(arrow, false, true, false)
        this.toggle = false
    }

    public hideRing(gameObject, ring: GameObject){
        // @ts-ignore
        ring.position.set(gameObject.position.x, gameObject.position.y, gameObject.position.z)
        // @ts-ignore
        GameObject.setActive(ring, false, true, false)
        this.toggle = false
    }



    //RecycleShooter

    //MoveShooter

    //DisplayUpgrades

    //HideUpgrades

}