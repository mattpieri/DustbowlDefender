import {Behaviour, TransformData, GameObject } from '@needle-tools/engine';
import { Color } from "three";
import {TargetManager} from "./TargetManager";

export class LookAt extends Behaviour {


    getTargetManager() {
        const TargetManagerGM = this.context.scene.getObjectByName("TargetManager")
        // @ts-ignore
        return  GameObject.getComponent(TargetManagerGM, TargetManager);
    }

    update() {

        let tm = this.getTargetManager()
        // @ts-ignore
        if (tm.getTargets().length > 0) {
            // @ts-ignore
            let target = tm.getTargets()[0];
            let direction = target.position.clone().sub(this.gameObject.position).normalize();
            let angle = Math.atan2(direction.x, direction.z);
            this.gameObject.rotation.y = angle;
        }

    }
}