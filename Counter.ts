

import {Behaviour, serializable, AssetReference, GameObject, Renderer } from '@needle-tools/engine';
import {Color} from "three";



export class Counter extends  Behaviour{

    private curret_0_digit: GameObject | undefined;
    private curret_1_digit: GameObject | undefined;
    private curret_2_digit: GameObject | undefined;

    private previous_0_digit: GameObject | undefined;
    private previous_1_digit: GameObject | undefined;
    private previous_2_digit: GameObject | undefined;

    @serializable(AssetReference)
    zzero?: AssetReference;

    private zero_0_object: GameObject | undefined;

    @serializable(AssetReference)
    zzero_1?: AssetReference;

    private zero_1_object: GameObject | undefined;

    @serializable(AssetReference)
    zzero_2?: AssetReference;

    private zero_2_object: GameObject | undefined;

    @serializable(AssetReference)
    one?: AssetReference;

    private one_0_object: GameObject | undefined;

    @serializable(AssetReference)
    one_1?: AssetReference;

    private one_1_object: GameObject | undefined;

    @serializable(AssetReference)
    one_2?: AssetReference;

    private one_2_object: GameObject | undefined;

    @serializable(AssetReference)
    two?: AssetReference;

    private two_0_object: GameObject | undefined;

    @serializable(AssetReference)
    two_1?: AssetReference;

    private two_1_object: GameObject | undefined;

    @serializable(AssetReference)
    two_2?: AssetReference;

    private two_2_object: GameObject | undefined;

    @serializable(AssetReference)
    three?: AssetReference;

    private three_0_object: GameObject | undefined;

    @serializable(AssetReference)
    three_1?: AssetReference;

    private three_1_object: GameObject | undefined;

    @serializable(AssetReference)
    three_2?: AssetReference;

    private three_2_object: GameObject | undefined;

    @serializable(AssetReference)
    four?: AssetReference;

    private four_0_object: GameObject | undefined;

    @serializable(AssetReference)
    four_1?: AssetReference;

    private four_1_object: GameObject | undefined;

    @serializable(AssetReference)
    four_2?: AssetReference;

    private four_2_object: GameObject | undefined;

    @serializable(AssetReference)
    five?: AssetReference;

    @serializable(AssetReference)
    five_1?: AssetReference;

    @serializable(AssetReference)
    five_2?: AssetReference;

    private five_0_object: GameObject | undefined;
    private five_1_object: GameObject | undefined;
    private five_2_object: GameObject | undefined;

    @serializable(AssetReference)
    six?: AssetReference;

    @serializable(AssetReference)
    six_1?: AssetReference;

    @serializable(AssetReference)
    six_2?: AssetReference;

    private six_0_object: GameObject | undefined;
    private six_1_object: GameObject | undefined;
    private six_2_object: GameObject | undefined;

    @serializable(AssetReference)
    seven?: AssetReference;

    @serializable(AssetReference)
    seven_1?: AssetReference;

    @serializable(AssetReference)
    seven_2?: AssetReference;

    private seven_0_object: GameObject | undefined;
    private seven_1_object: GameObject | undefined;
    private seven_2_object: GameObject | undefined;

    @serializable(AssetReference)
    eight?: AssetReference;

    @serializable(AssetReference)
    eight_1?: AssetReference;

    @serializable(AssetReference)
    eight_2?: AssetReference;

    private eight_0_object: GameObject | undefined;
    private eight_1_object: GameObject | undefined;
    private eight_2_object: GameObject | undefined;

    @serializable(AssetReference)
    nine?: AssetReference;

    @serializable(AssetReference)
    nine_1?: AssetReference;

    @serializable(AssetReference)
    nine_2?: AssetReference;

    private nine_0_object: GameObject | undefined;
    private nine_1_object: GameObject | undefined;
    private nine_2_object: GameObject | undefined;

    @serializable()
    axis : string = 'x';

    @serializable()
    value : number = 150;

    private set_origin(obj, xOry, digit){
        if( xOry === "x") {
            if( digit === 0 ) {
                obj.position.set(this.gameObject.position.x, this.gameObject.position.y, this.gameObject.position.z)
                obj.rotation.set(this.gameObject.rotation.x, this.gameObject.rotation.y, this.gameObject.rotation.z)
                GameObject.setActive(obj, false, true, false)
            } else if( digit === 1) {
                obj.position.set(this.gameObject.position.x, this.gameObject.position.y, this.gameObject.position.z +  .35)
                obj.rotation.set(this.gameObject.rotation.x, this.gameObject.rotation.y, this.gameObject.rotation.z)
                GameObject.setActive(obj, false, true, false)
            }else if( digit === 2) {
                obj.position.set(this.gameObject.position.x, this.gameObject.position.y, this.gameObject.position.z +  .7)
                obj.rotation.set(this.gameObject.rotation.x, this.gameObject.rotation.y, this.gameObject.rotation.z)
                GameObject.setActive(obj, false, true, false)
            }
        }

        if( xOry === "y") {
            if( digit === 0 ) {
                obj.position.set(this.gameObject.position.x, this.gameObject.position.y, this.gameObject.position.z)
                obj.rotation.set(this.gameObject.rotation.x, this.gameObject.rotation.y, this.gameObject.rotation.z)
                GameObject.setActive(obj, false, true, false)
            } else if( digit === 1) {
                obj.position.set(this.gameObject.position.x -  .35, this.gameObject.position.y , this.gameObject.position.z )
                obj.rotation.set(this.gameObject.rotation.x, this.gameObject.rotation.y, this.gameObject.rotation.z)
                GameObject.setActive(obj, false, true, false)
            }else if( digit === 2) {
                obj.position.set(this.gameObject.position.x -  .7, this.gameObject.position.y  , this.gameObject.position.z)
                obj.rotation.set(this.gameObject.rotation.x, this.gameObject.rotation.y, this.gameObject.rotation.z)
                GameObject.setActive(obj, false, true, false)
            }
        }

    }

    async start() {
        // directly instantiate
        //const one = await this.one?.instantiate();
        // @ts-ignore
        this.zero_0_object = await this.zzero?.instantiate();
        // @ts-ignore
        this.zero_1_object = await this.zzero_1?.instantiate();
        // @ts-ignore
        this.zero_2_object = await this.zzero_2?.instantiate();
        // @ts-ignore
        this.one_0_object = await this.one?.instantiate();
        // @ts-ignore
        this.one_1_object = await this.one_1?.instantiate();
        // @ts-ignore
        this.one_2_object = await this.one_2?.instantiate();
        // @ts-ignore
        this.two_0_object = await this.two?.instantiate();
        // @ts-ignore
        this.two_1_object = await this.two_1?.instantiate();
        // @ts-ignore
        this.two_2_object = await this.two_2?.instantiate();
        // @ts-ignore
        this.three_0_object = await this.three?.instantiate();
        // @ts-ignore
        this.three_1_object = await this.three_1?.instantiate();
        // @ts-ignore
        this.three_2_object = await this.three_2?.instantiate();
        // @ts-ignore
        this.four_0_object = await this.four?.instantiate();
        // @ts-ignore
        this.four_1_object = await this.four_1?.instantiate();
        // @ts-ignore
        this.four_2_object = await this.four_2?.instantiate();

        // @ts-ignore
        this.five_0_object = await this.five?.instantiate();
        // @ts-ignore
        this.five_1_object = await this.five_1?.instantiate();
        // @ts-ignore
        this.five_2_object = await this.five_2?.instantiate();
        // @ts-ignore
        this.six_0_object = await this.six?.instantiate();
        // @ts-ignore
        this.six_1_object = await this.six_1?.instantiate();
        // @ts-ignore
        this.six_2_object = await this.six_2?.instantiate();

        // @ts-ignore
        this.seven_0_object = await this.seven?.instantiate();
        // @ts-ignore
        this.seven_1_object = await this.seven_1?.instantiate();
        // @ts-ignore
        this.seven_2_object = await this.seven_2?.instantiate();

        // @ts-ignore
        this.eight_0_object = await this.eight?.instantiate();
        // @ts-ignore
        this.eight_1_object = await this.eight_1?.instantiate();
        // @ts-ignore
        this.eight_2_object = await this.eight_2?.instantiate();
        // @ts-ignore

        this.nine_0_object = await this.nine?.instantiate();
        // @ts-ignore
        this.nine_1_object = await this.nine_1?.instantiate();
        // @ts-ignore
        this.nine_2_object = await this.nine_2?.instantiate();

        if( this.zero_0_object != undefined ) {
            this.set_origin(this.zero_0_object, this.axis, 0)
        }
        if( this.zero_1_object != undefined ) {
            this.set_origin(this.zero_1_object, this.axis, 1)
        }
        if( this.zero_2_object != undefined ) {
            this.set_origin(this.zero_2_object, this.axis, 2)
        }
        if( this.one_0_object != undefined ) {
            this.set_origin(this.one_0_object, this.axis, 0)
        }
        if( this.one_1_object != undefined ) {
            this.set_origin(this.one_1_object, this.axis, 1)
        }
        if( this.one_2_object != undefined ) {
            this.set_origin(this.one_2_object, this.axis, 2)
        }

        //// 2 /////

        if( this.two_0_object != undefined ) {
            this.set_origin(this.two_0_object, this.axis, 0)
        }
        if( this.two_1_object != undefined ) {
            this.set_origin(this.two_1_object, this.axis, 1)
        }
        if( this.two_2_object != undefined ) {
            this.set_origin(this.two_2_object, this.axis, 2)
        }

        //// 3 /////

        if( this.three_0_object != undefined ) {
            this.set_origin(this.three_0_object, this.axis, 0)
        }
        if( this.three_1_object != undefined ) {
            this.set_origin(this.three_1_object, this.axis, 1)
        }
        if( this.three_2_object != undefined ) {
            this.set_origin(this.three_2_object, this.axis, 2)
        }

        //// 4 /////

        if( this.four_0_object != undefined ) {
            this.set_origin(this.four_0_object, this.axis, 0)
        }
        if( this.four_1_object != undefined ) {
            this.set_origin(this.four_1_object, this.axis, 1)
        }
        if( this.four_2_object != undefined ) {
            this.set_origin(this.four_2_object, this.axis, 2)
        }

        if( this.five_0_object != undefined ) {
            this.set_origin(this.five_0_object, this.axis, 0)
        }
        if( this.five_1_object != undefined ) {
            this.set_origin(this.five_1_object, this.axis, 1)
        }
        if( this.five_2_object != undefined ) {
            this.set_origin(this.five_2_object, this.axis, 2)
        }

        if( this.six_0_object != undefined ) {
            this.set_origin(this.six_0_object, this.axis, 0)
        }
        if( this.six_1_object != undefined ) {
            this.set_origin(this.six_1_object, this.axis, 1)
        }
        if( this.six_2_object != undefined ) {
            this.set_origin(this.six_2_object, this.axis, 2)
        }

        if( this.seven_0_object != undefined ) {
            this.set_origin(this.seven_0_object, this.axis, 0)
        }
        if( this.seven_1_object != undefined ) {
            this.set_origin(this.seven_1_object, this.axis, 1)
        }
        if( this.seven_2_object != undefined ) {
            this.set_origin(this.seven_2_object, this.axis, 2)
        }

        if( this.eight_0_object != undefined ) {
            this.set_origin(this.eight_0_object, this.axis, 0)
        }
        if( this.eight_1_object != undefined ) {
            this.set_origin(this.eight_1_object, this.axis, 1)
        }
        if( this.eight_2_object != undefined ) {
            this.set_origin(this.eight_2_object, this.axis, 2)
        }

        if( this.nine_0_object != undefined ) {
            this.set_origin(this.nine_0_object, this.axis, 0)
        }
        if( this.nine_1_object != undefined ) {
            this.set_origin(this.nine_1_object, this.axis, 1)
        }
        if( this.nine_2_object != undefined ) {
            this.set_origin(this.nine_2_object, this.axis, 2)
        }
        // you can also just load and instantiate later
        // const myInstance = await this.myPrefab.loadAssetAsync();
        // this.gameObject.add(myInstance)
        // this is useful if you know that you want to load this asset only once because it will not create a copy
        // since ``instantiate()`` does create a copy of the asset after loading it
        setInterval(() => {
            this.value++
        }, 200);
    }

    setValue(number){
        this.value = number
    }

    setCurrent0DigitObject(obj){
        GameObject.setActive(obj, true, true, true)
        this.previous_0_digit = this.curret_0_digit
        this.curret_0_digit = obj
        // @ts-ignore
        if( this.previous_0_digit !== this.curret_0_digit) {
            // @ts-ignore
            GameObject.setActive(this.previous_0_digit, false, true, false)
        }
    }

    setCurrent1DigitObject(obj){
        GameObject.setActive(obj, true, true, true)
        this.previous_1_digit = this.curret_1_digit
        this.curret_1_digit = obj
        if( this.previous_1_digit !== this.curret_1_digit) {
            // @ts-ignore
            GameObject.setActive(this.previous_1_digit, false, true, false)
        }
    }

    setCurrent2DigitObject(obj){
        GameObject.setActive(obj, true, true, true)
        this.previous_2_digit = this.curret_2_digit
        this.curret_2_digit = obj
        if( this.previous_2_digit !== this.curret_2_digit) {
            // @ts-ignore
            GameObject.setActive(this.previous_2_digit, false, true, false)
        }
    }


    update(){

        let digits = this.value.toString()
        if( digits.length === 1){
            digits = "00" + digits
        } else if (digits.length === 2){
            digits = "0" + digits
        }

        for(let i = 0; i < digits.length; i++){
            if(i === 0 && digits[0] === '0'){
                this.setCurrent0DigitObject(this.zero_0_object)
            }
            if(i === 1 && digits[1] === '0'){
                this.setCurrent1DigitObject(this.zero_1_object)
            }
            if(i === 2 && digits[2] === '0'){
                this.setCurrent2DigitObject(this.zero_2_object)
            }
            if(i === 0 && digits[0] === '1'){
                this.setCurrent0DigitObject(this.one_0_object)
            }
            if(i === 1 && digits[1] === '1'){
                this.setCurrent1DigitObject(this.one_1_object)
            }
            if(i === 2 && digits[2] === '1'){
                this.setCurrent2DigitObject(this.one_2_object)
            }
            if(i === 0 && digits[0] === '2'){
                this.setCurrent0DigitObject(this.two_0_object)
            }
            if(i === 1 && digits[1] === '2'){
                this.setCurrent1DigitObject(this.two_1_object)
            }
            if(i === 2 && digits[2] === '2'){
                this.setCurrent2DigitObject(this.two_2_object)
            }
            if(i === 0 && digits[0] === '3'){
                this.setCurrent0DigitObject(this.three_0_object)
            }
            if(i === 1 && digits[1] === '3'){
                this.setCurrent1DigitObject(this.three_1_object)
            }
            if(i === 2 && digits[2] === '3'){
                this.setCurrent2DigitObject(this.three_2_object)
            }
            if(i === 0 && digits[0] === '4'){
                this.setCurrent0DigitObject(this.four_0_object)
            }
            if(i === 1 && digits[1] === '4'){
                this.setCurrent1DigitObject(this.four_1_object)
            }
            if(i === 2 && digits[2] === '4'){
                this.setCurrent2DigitObject(this.four_2_object)
            }
            if(i === 0 && digits[0] === '5'){
                this.setCurrent0DigitObject(this.five_0_object)
            }
            if(i === 1 && digits[1] === '5'){
                this.setCurrent1DigitObject(this.five_1_object)
            }
            if(i === 2 && digits[2] === '5'){
                this.setCurrent2DigitObject(this.five_2_object)
            }
            if(i === 0 && digits[0] === '6'){
                this.setCurrent0DigitObject(this.six_0_object)
            }
            if(i === 1 && digits[1] === '6'){
                this.setCurrent1DigitObject(this.six_1_object)
            }
            if(i === 2 && digits[2] === '6'){
                this.setCurrent2DigitObject(this.six_2_object)
            }
            if(i === 0 && digits[0] === '7'){
                this.setCurrent0DigitObject(this.seven_0_object)
            }
            if(i === 1 && digits[1] === '7'){
                this.setCurrent1DigitObject(this.seven_1_object)
            }
            if(i === 2 && digits[2] === '7'){
                this.setCurrent2DigitObject(this.seven_2_object)
            }
            if(i === 0 && digits[0] === '8'){
                this.setCurrent0DigitObject(this.eight_0_object)
            }
            if(i === 1 && digits[1] === '8'){
                this.setCurrent1DigitObject(this.eight_1_object)
            }
            if(i === 2 && digits[2] === '8'){
                this.setCurrent2DigitObject(this.eight_2_object)
            }
            if(i === 0 && digits[0] === '9'){
                this.setCurrent0DigitObject(this.nine_0_object)
            }
            if(i === 1 && digits[1] === '9'){
                this.setCurrent1DigitObject(this.nine_1_object)
            }
            if(i === 2 && digits[2] === '9'){
                this.setCurrent2DigitObject(this.nine_2_object)
            }
        }


    }


}