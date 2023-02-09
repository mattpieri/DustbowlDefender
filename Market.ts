import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions } from "@needle-tools/engine";

import {DragControls} from "three/examples/jsm/controls/DragControls";

export class Market extends Behaviour {
    private price = 200;

    @serializable(AssetReference)
    myPrefab?: AssetReference;

    async purchase(){

        //let forSaleObject = await this.myPrefab?.instantiateSynced({parent:this.gameObject}, true);
        const content = this.context.scene.getObjectByName("Content")

        let forSaleObject = await this.myPrefab?.instantiate(content);
        if (forSaleObject != undefined) {
            forSaleObject.position.set(this.gameObject.position.x, this.gameObject.position.y+.4, this.gameObject.position.z)
            console.log(GameObject.getAllComponents(forSaleObject))
        }

    }
}