
import { Behaviour } from "@needle-tools/engine";

export class ScaleManager extends Behaviour {


    public getScaleY(){
        const obj = this.context.scene.getObjectByName("Scale")

        // @ts-ignore
        return obj.position.y
    }

    private y = 0;

    public addY(amount){
        this.y = this.y + amount
    }

}