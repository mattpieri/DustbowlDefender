import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions } from "@needle-tools/engine";
import { Object3D, Vector3} from "three";

export class TargetManager extends Behaviour {

    @serializable(AssetReference)
    myPrefab?: AssetReference;

    private targets: GameObject[] = [];

    async start() {
        setInterval(() => {
            this.startTarget();
        }, 700 );
    }

    async startTarget() {
        let prefabTarget = await this.myPrefab?.instantiate();
        //let instantiateOptions = new InstantiateOptions();
       // instantiateOptions.position = new Vector3(this.gameObject.position.x, this.gameObject.position.y+1, this.gameObject.position.z);
        //let prefabTarget = await this.myPrefab

        // @ts-ignore
        //let newProjectile = await GameObject.instantiate(prefabTarget) as GameObject;

        if (prefabTarget != undefined) {
            // @ts-ignore
            this.targets.push(prefabTarget);
        }
    }

    getTargets(){
        return this.targets;
    }

    removeFirst() {
        this.targets.splice(0,1)
    }
}