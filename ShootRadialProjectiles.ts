import { Behaviour, serializable, AssetReference, GameObject, InstantiateOptions, AudioSource, FrameEvent } from "@needle-tools/engine";
import { WaitForSeconds } from "@needle-tools/engine/engine/engine_coroutine";
import { Animator} from "@needle-tools/engine/engine-components/Animator"
import {Cache, Color, Object3D, Quaternion, Vector3} from "three";
import {TargetManager} from "./TargetManager";
import {GameManager} from "./GameManager";
import {Counter} from "./Counter";
import {MoveTarget} from "./MoveTarget"
import {tangentGeometry} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import {Connect} from "vite";


export class ShootRadialProjectiles extends Behaviour {

    @serializable(AssetReference)
    bullet1?: AssetReference;
    @serializable(AssetReference)
    bullet2?: AssetReference;
    @serializable(AssetReference)
    bullet3?: AssetReference;
    @serializable(AssetReference)
    bullet4?: AssetReference;
    @serializable(AssetReference)
    bullet5?: AssetReference;
    @serializable(AssetReference)
    bullet6?: AssetReference;
    @serializable(AssetReference)
    bullet7?: AssetReference;
    @serializable(AssetReference)
    bullet8?: AssetReference;

    @serializable()
    radius?: number = 1

    private yOffSet(){
        return .2
    }

    private shotsFired = {
        "1": undefined,
        "2": undefined,
        "3": undefined,
        "4": undefined,
        "5": undefined,
        "6": undefined,
        "7": undefined,
        "8": undefined
    }

    private _shortFired1 = undefined
    private _shortFired2 = undefined
    private _shortFired3 = undefined
    private _shortFired4 = undefined
    private _shortFired5 = undefined
    private _shortFired6 = undefined
    private _shortFired7 = undefined
    private _shortFired8 = undefined

    private _internval: Generator | undefined;

    private target: GameObject | undefined;

    @serializable()
    interval?: number = 1000

    @serializable()
    speed = 2;

    private active = false;
    private allLoaded = false;

    async altStart(){

        const opt = new InstantiateOptions();
        opt.parent = this.context.scene.getObjectByName("Content");
        //opt.visible = false
        await this.bullet1?.instantiate(opt)
            .then((result) => {
                // @ts-ignore
                this._shortFired1 = result;
                // @ts-ignore
                this._shortFired1.position.set(this.gameObject.position.x, this.gameObject.position.y+this.yOffSet(), this.gameObject.position.z)
                // @ts-ignore
                const opt1 = new InstantiateOptions();
                opt1.parent = this.context.scene.getObjectByName("Content");
                return this.bullet2?.instantiate(opt1)
            })
            .then((result) => {
                // @ts-ignore
                this._shortFired2 = result;
                // @ts-ignore
                this._shortFired2.position.set(this.gameObject.position.x, this.gameObject.position.y+this.yOffSet(), this.gameObject.position.z)
                const opt2 = new InstantiateOptions();
                //opt2.visible = false
                opt2.parent = this.context.scene.getObjectByName("Content");
                return this.bullet3?.instantiate(opt2)
            })
            .then((result) => {
                // @ts-ignore
                this._shortFired3 = result;
                // @ts-ignore
                this._shortFired3.position.set(this.gameObject.position.x, this.gameObject.position.y+this.yOffSet(), this.gameObject.position.z)
                const opt3 = new InstantiateOptions();
               // opt3.visible = false
                opt3.parent = this.context.scene.getObjectByName("Content");
                return this.bullet4?.instantiate(opt3)
            })
            .then((result) => {
                // @ts-ignore
                this._shortFired4 = result;
                // @ts-ignore
                this._shortFired4.position.set(this.gameObject.position.x, this.gameObject.position.y+this.yOffSet(), this.gameObject.position.z)
                const opt4 = new InstantiateOptions();
              //  opt4.visible = false
                opt4.parent = this.context.scene.getObjectByName("Content");
                return this.bullet5?.instantiate(opt4)
            })
            .then((result) => {
                // @ts-ignore
                this._shortFired5 = result;
                // @ts-ignore
                this._shortFired5.position.set(this.gameObject.position.x, this.gameObject.position.y+this.yOffSet(), this.gameObject.position.z)
                const opt5 = new InstantiateOptions();
               // opt5.visible = false
                opt5.parent = this.context.scene.getObjectByName("Content");
                return this.bullet6?.instantiate(opt5)
            })
            .then((result) => {
                // @ts-ignore
                this._shortFired6 = result;
                // @ts-ignore
                this._shortFired6.position.set(this.gameObject.position.x, this.gameObject.position.y+this.yOffSet(), this.gameObject.position.z)
                const opt6 = new InstantiateOptions();
               // opt6.visible = false
                opt6.parent = this.context.scene.getObjectByName("Content");
                return this.bullet7?.instantiate(opt6)
            })
            .then((result) => {
                // @ts-ignore
                this._shortFired7 = result;
                // @ts-ignore
                this._shortFired7.position.set(this.gameObject.position.x, this.gameObject.position.y+this.yOffSet(), this.gameObject.position.z)
                const opt7 = new InstantiateOptions();
                //opt7.visible = false
                opt7.parent = this.context.scene.getObjectByName("Content");
                return this.bullet8?.instantiate(opt7)
            })
            .then((result) => {
                // @ts-ignore
                this._shortFired8 = result;
                // @ts-ignore
                this._shortFired8.position.set(this.gameObject.position.x, this.gameObject.position.y+this.yOffSet(), this.gameObject.position.z)
            }).then(()=>{
                this.shotsFired = {
                    // @ts-ignore
                         "1":  {"shot": this._shortFired1, "state": undefined},
                    // @ts-ignore

                    "2":  {"shot": this._shortFired2, "state": undefined},
                    // @ts-ignore

                    "3":  {"shot": this._shortFired3, "state": undefined},
                    // @ts-ignore

                    "4":  {"shot": this._shortFired4, "state": undefined},
                    // @ts-ignore

                    "5":  {"shot": this._shortFired5, "state": undefined},
                    // @ts-ignore

                    "6":  {"shot": this._shortFired6, "state": undefined},
                    // @ts-ignore

                   "7":  {"shot": this._shortFired7, "state": undefined},
                    // @ts-ignore

                  "8":  {"shot": this._shortFired8, "state": undefined},
                    }
                this.allLoaded = true;

                this.startShooting()


            })

    }

    public onPurchase(){
        this.altStart().then(() => {})
        this.active = true
    }

    start(){
        //HACKKKKKKKKKK
        let a = GameObject.getComponents(this.gameObject, Animator)[0];

        if(a !== undefined){
            a.Play("Cylinder|Action"); // Play "top1" on layer 0
        }
    }

    getTargetManager() {
        const TargetManagerGM = this.context.scene.getObjectByName("TargetManager")
        // @ts-ignore
        return GameObject.getComponent(TargetManagerGM, TargetManager);
    }

    getCashCounter() {
        const CashCounter = this.context.scene.getObjectByName("CashCounter")

        // @ts-ignore
        return GameObject.getComponent(CashCounter, Counter);
    }

    withinRadius() {
        let tm = this.getTargetManager()
        // @ts-ignore
        let targets: GameObject[] = tm.getTargets();

        for (let i = 0; i < targets.length; i++) {
            //console.log(targets, this.gameObject.position.distanceTo(targets[i].position),  this.radius  )
            // @ts-ignore
            if( this.gameObject.position.distanceTo(targets[i].position) <= this.radius ){
                return true
            }

        }

        return false
    }

    private allOutSideOfRadius() {
        let tm = this.getTargetManager()
        // @ts-ignore
        let targets: GameObject[] = tm.getTargets();

        let result  = []
        for (let i = 0; i < targets.length; i++) {
            // @ts-ignore
            if( this.gameObject.position.distanceTo(targets[0].position) > this.radius ){
                //console.log( "good")
            } else{
                return false
            }
        }
        //console.log( targets)
        return true
    }

    resetShots(){
        for (const key in this.shotsFired) {
            this.shotsFired[key]["shot"].position.set(this.gameObject.position.x, this.gameObject.position.y + this.yOffSet(), this.gameObject.position.z)
            this.shotsFired[key]["shot"].shotNumber = 1
            this.shotsFired[key]["state"] = "WaitingToBeFired"
        }
    }

    private isAnimating = false
    private  shotNumber = 0

    async playAnimationAndWaitForTenSeconds(): Promise<void> {
        let a = GameObject.getComponents(this.gameObject, Animator)[0];
        if(a !== undefined){
            a.Play("Cylinder|CylinderAction"); // Play "top1" on layer 0
            //a.Play("top1", -1, 0, 0); // Play "top1" on layer 0
            //a.Play("top3", 1, 0, 1);
            //await new Promise(resolve => setTimeout(resolve, this.interval)); // wait for 10 seconds
            //this.isAnimating = false;
        }
    }



    checkIfGoneBeyondRadius( key, maxRadius){
        let distance = this.shotsFired[key]["shot"].position.distanceTo(this.gameObject.position);

        if (distance > maxRadius ) {
            this.shotsFired[key]["shot"].position.set(this.gameObject.position.x, this.gameObject.position.y + this.yOffSet(), this.gameObject.position.z)
            if (this.shotsFired[key]["shot"].shotNumber === undefined) {
                this.shotsFired[key]["shot"].shotNumber = 1
            } else {
                this.shotsFired[key]["shot"].shotNumber = this.shotsFired[key]["shot"].shotNumber + 1
            }
            this.shotsFired[key]["state"] = "WaitingToBeFired"
        }

    }

    updateProjectiles(){
        let angle = (2 * Math.PI) / 8; // divide 360 degrees into 8 equal parts
        let radius = this.speed  * this.context.time.deltaTime;

        for(const key in this.shotsFired) {
            //console.log( this.shotsFired[key]["state"]=== "Firing" )

            //waiting to be fired
            //set state to fire

                if (this.shotsFired[key]["state"] === "Firing" && !this.isInFuture(this.shotsFired[key]["shot"]?.shotNumber)) {
                    let x = this.shotsFired[key]["shot"].position.x + radius * Math.cos(angle * Number(key));
                    let z = this.shotsFired[key]["shot"].position.z + radius * Math.sin(angle * Number(key));
                    let direction = new Vector3().subVectors(new Vector3(x, this.shotsFired[key]["shot"].position.y, z), this.shotsFired[key]["shot"].position);
                    direction.normalize();
                    let velocity = direction.multiplyScalar(this.speed);
                    this.shotsFired[key]["shot"].rotation.z = angle * Number(key) + Math.PI / 2;
                    this.shotsFired[key]["shot"].position.add(velocity.clone().multiplyScalar(this.context.time.deltaTime));
                    this.checkIfGoneBeyondRadius(key, this.radius)

                    let distance = this.shotsFired[key]["shot"].position.distanceTo(this.gameObject.position);


                }
           // }
        }
    }

    public destroy(){
        // @ts-ignore
        GameObject.destroy(this._shortFired1)
        // @ts-ignore
        GameObject.destroy(this._shortFired2)
        // @ts-ignore
        GameObject.destroy(this._shortFired3)
        // @ts-ignore
        GameObject.destroy(this._shortFired4)
        // @ts-ignore
        GameObject.destroy(this._shortFired5)
        // @ts-ignore
        GameObject.destroy(this._shortFired6)
        // @ts-ignore
        GameObject.destroy(this._shortFired7)
        // @ts-ignore
        GameObject.destroy(this._shortFired8)
        // @ts-ignore
        this.stopCoroutine(this._internval)
    }

    private  delay(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    async playPopSound(){

        /*if( this.previousHitTime === undefined){
            this.previousHitTime = this.context.time.deltaTime
        }

        // @ts-ignore
        console.log( Math.abs(this.previousHitTime - this.context.time.deltaTime))*/

        // @ts-ignore
        this.previousHitTime = this.context.time.deltaTime
        // @ts-ignore
        let b = GameObject.getComponents(this.gameObject, AudioSource)[0];
        //console.log(b)
        if(b !== undefined){
            // @ts-ignore
            await this.delay(Math.random() * 100); // wait
            b.play()
        }
    }

    private isInFuture(shotNumber){
        for(const value of Object.values(this.shotsFired)) {
            // @ts-ignore
            if( value.shotNumber === undefined){
                return false
            }

            // @ts-ignore
            if( shotNumber > value.shotNumber){
                return true
            }
        }
        return false
    }

    private previousHitTime = undefined

    hitTarget() {
        let tm = this.getTargetManager()
        for(const key in this.shotsFired) {
            // @ts-ignore
            let targets: GameObject[] = tm.getTargets();

            for (let i = 0; i < targets.length; i++) {
                if (this.shotsFired[key]["shot"] !== undefined ) {
                    if (this.shotsFired[key]["shot"].position.distanceTo(targets[i].position) < .2) {
                        this.shotsFired[key]["state"] = "WaitingToBeFired"
                        this.playPopSound().then(() => {})
                        let getCashCounter = this.getCashCounter()
                        // @ts-ignore
                        //console.log(healthCounter.getValue())
                        //getCashCounter.add(1);

                         tm.remove(targets[i], true)
                        if(this.shotsFired[key]["shot"].shotNumber===undefined){
                            this.shotsFired[key]["shot"].shotNumber = 1
                        }else{
                            this.shotsFired[key]["shot"].shotNumber = this.shotsFired[key]["shot"].shotNumber + 1
                        }
                        //GameObject.setActive(this.shotsFired[key]["shot"], false, false, true) //, true)
                        //console.log( GameObject.isActiveSelf(this.shotsFired[key]["shot"]), key )*/
                        // @ts-ignore
                        this.shotsFired[key]["shot"].position.set(this.gameObject.position.x, this.gameObject.position.y+this.yOffSet(), this.gameObject.position.z)
                    }
                }
            }

        }
    }

    private counter = 0;

    *shootProjectiles()  {
        while(true) {
            if (this.withinRadius()) {
                for (const key in this.shotsFired) {

                    this.shotsFired[key]["state"] = "Firing";
                }
                let a = GameObject.getComponents(this.gameObject, Animator)[0];
                if (a !== undefined) {
                    a.Play("Cylinder|CylinderAction"); // Play "top1" on layer 0
                }
            }
            // @ts-ignore
            yield WaitForSeconds(this.interval / 1000);
            this.counter++
        }
    }


    private startShooting() {
       this._internval = this.startCoroutine(this.shootProjectiles(), FrameEvent.Update);
    }

    update() {

        if( this.active ) {
            if( this.allLoaded ) {
                this.updateProjectiles()
                this.hitTarget()
            }
        }
    }

    moveUp(amount){
        // @ts-ignore
        this._shortFired1.position.add(new Vector3(0,amount, 0))
        // @ts-ignore
        this._shortFired2.position.add(new Vector3(0,amount, 0))
        // @ts-ignore
        this._shortFired3.position.add(new Vector3(0,amount, 0))
        // @ts-ignore
        this._shortFired4.position.add(new Vector3(0,amount, 0))
        // @ts-ignore
        this._shortFired5.position.add(new Vector3(0,amount, 0))
        // @ts-ignore
        this._shortFired6.position.add(new Vector3(0,amount, 0))
        // @ts-ignore
        this._shortFired7.position.add(new Vector3(0,amount, 0))
        // @ts-ignore
        this._shortFired8.position.add(new Vector3(0,amount, 0))

    }


}