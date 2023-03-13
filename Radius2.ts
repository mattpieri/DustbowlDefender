import { Behaviour, serializable, AssetReference, GameObject, EventList, InstantiateOptions} from "@needle-tools/engine";




export class Radius2 extends Behaviour {


    @serializable(AssetReference)
    radiusPrefab?: AssetReference;

    private _radius: GameObject | undefined | null;

    private _moveRadius = false;



    async start() {
        const opt = new InstantiateOptions();
        opt.parent = this.context.scene.getObjectByName("Content");
        opt.visible = false
        await this.radiusPrefab?.instantiate(opt).then((result) => {
            // @ts-ignore
            this._radius = result;
            // @ts-ignore
            this._radius.position.set(this.gameObject.position.x, .3, this.gameObject.position.z)
        })
    }

    public showRadius(){
        console.log("SHOW RADIUS")
        // @ts-ignore
        GameObject.setActive(this._radius, true, true, true)
    }

    public hideRadius(){
        // @ts-ignore
        GameObject.setActive(this._radius, false, false, true)
    }

    public moveRadius(){
        this._moveRadius = true
    }

    public stopMovingRadius(){
        this._moveRadius = false
    }

    update(){
        if(this._moveRadius){
            if( this._radius) {
                this._radius.position.set(this.gameObject.position.x, .3, this.gameObject.position.z)
            }
        }
    }
}