
import {Behaviour, Collision, GameObject, Renderer } from "@needle-tools/engine";
import { RaycastOptions } from "@needle-tools/engine/engine/engine_physics";
import { DragControls, DragEvents } from "@needle-tools/engine/engine-components/DragControls"
import {Cache, Color, Object3D, Ray, Vector3} from "three";
//import {DragControls} from "three/examples/jsm/controls/DragControls";

export class SnapToTile extends Behaviour {
    private currentCubeBelow = new Object3D();
    private previousCubeBelow = new Object3D();
    private selectEndEventListener = 0;


    getCubeBelow(interactions) {
        for (const interaction of interactions) {
            if (interaction.object.name.startsWith("Cube")) {
                return interaction.object;
            }
        }
        return null;
    }

    highlight(cube){
        const renderer = GameObject.getComponent(cube, Renderer);
        // @ts-ignore
        renderer.material.color = new Color(0.97, 0.98, 0, 1);
    }

    UnHighlight(cube){
        const test = GameObject.getComponent(cube, Renderer);
        // @ts-ignore
        test.material.color = new Color(1, 1, 1, 1);
    }



    update() {
        const ray = new Ray(this.gameObject.position, new Vector3(0, -1, 0));
        const options = new RaycastOptions();
        options.maxDistance = 100;
        const intersections = this.context.physics.raycastFromRay(ray, options)

        //highlight the cube below
        let cubeBelow = this.getCubeBelow(intersections);
        if (cubeBelow !== null) { //in case where we are hovering in-between or or off the map
            if( cubeBelow !== this.currentCubeBelow ) {
                this.previousCubeBelow = this.currentCubeBelow;
                this.currentCubeBelow = cubeBelow;
                this.highlight(this.currentCubeBelow)
                if( this.previousCubeBelow !== null) {
                    // @ts-ignore
                    const test = GameObject.getComponent(this.previousCubeBelow, Renderer);
                    // @ts-ignore
                    if (test !== null) {
                        // @ts-ignore
                        test.material.color = new Color(1, 0.65, 0.2, 1);
                    }
                }
            }
        }
        const dragControls = GameObject.getComponent(this.gameObject, DragControls)
        const func = () => {
            console.log("Drag Ended!")
            this.gameObject.position.set(this.currentCubeBelow.position.x,
                this.gameObject.position.y,
                this.currentCubeBelow.position.z)
            this.selectEndEventListener = 0;
        }

        if(this.selectEndEventListener==0) {
            if(dragControls) {
                dragControls.addDragEventListener(DragEvents.SelectEnd, func)
                console.log(dragControls)
            }
            this.selectEndEventListener = 1;
        }
    }
}