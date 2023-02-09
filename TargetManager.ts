import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions } from "@needle-tools/engine";
import { Object3D, Vector3} from "three";

export class TargetManager extends Behaviour {

    @serializable(AssetReference)
    myPrefab?: AssetReference;

    private targets: GameObject[] = [];
    private unclaimedTargets: GameObject[] = [];

    async start() {
        setInterval(() => {
            this.startTarget();
        }, 500 );
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
            // @ts-ignore
            this.unclaimedTargets.push(prefabTarget);
        }
    }

    getTargets(){
        return this.targets;
    }

    remove(targetid) {
        this.targets = this.targets.filter(target => target.guid !== targetid);
        //console.log(this.targets)
    }

    getUnclaimedTargets() {
        return this.unclaimedTargets
    }

    claimTarget(targetid){
        this.unclaimedTargets = this.unclaimedTargets.filter(target => target.guid !== targetid);
    }

    checkIfClaimed(targetid) {
        for(let i = 0;i<this.unclaimedTargets.length;i++){
            if(this.unclaimedTargets[i].guid === targetid)
                return false
        }
        return true
    }


}