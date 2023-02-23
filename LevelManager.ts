


import {Behaviour, TransformData, GameObject, serializable } from '@needle-tools/engine';
import {Vector3} from "three";
import {Counter} from "./Counter";
import {TargetManager} from "./TargetManager";

const LEVEL_MAP = {
    "1":{
        "Level1BadGuys":50,
        "Level2BadGuys":0,
        "Level3BadGuys":60,
    },
    "2":{
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":5,
    },
    "3":{
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":5,
    },
    "4":{
        "Level1BadGuys":0,
        "Level2BadGuys":0,
        "Level3BadGuys":5,
    },
    "5":{
        "Level1BadGuys":30,
        "Level2BadGuys":20,
        "Level3BadGuys":5,
    },
    "6":{
        "Level1BadGuys":30,
        "Level2BadGuys":25,
        "Level3BadGuys":10,
    },
    "7":{
        "Level1BadGuys":40,
        "Level2BadGuys":30,
        "Level3BadGuys":20,
    },
    "8":{
        "Level1BadGuys":50,
        "Level2BadGuys":40,
        "Level3BadGuys":30,
    },
    "9":{
        "Level1BadGuys":50,
        "Level2BadGuys":50,
        "Level3BadGuys":50,
    },
    "10":{
        "Level1BadGuys":75,
        "Level2BadGuys":75,
        "Level3BadGuys":75,
    }
}

export class LevelManager extends Behaviour {

    private currentLevel = 1;

    public decreaseLevel1BadGuysCount() {
        LEVEL_MAP[String(this.currentLevel)]["Level1BadGuys"] = LEVEL_MAP[String(this.currentLevel)]["Level1BadGuys"] - 1;
    }

    public decreaseLevel2BadGuysCount() {
        LEVEL_MAP[String(this.currentLevel)]["Level2BadGuys"] = LEVEL_MAP[String(this.currentLevel)]["Level2BadGuys"] - 1;
    }

    public decreaseLevel3BadGuysCount() {
        LEVEL_MAP[String(this.currentLevel)]["Level3BadGuys"] = LEVEL_MAP[String(this.currentLevel)]["Level3BadGuys"] - 1;
    }

    public getLevel1BadGuysCount() {
        return LEVEL_MAP[String(this.currentLevel)]["Level1BadGuys"]
    }
    public getLevel2BadGuysCount() {
        return LEVEL_MAP[String(this.currentLevel)]["Level2BadGuys"]
    }
    public getLevel3BadGuysCount() {
        return LEVEL_MAP[String(this.currentLevel)]["Level3BadGuys"]
    }


    getTargetManager() {
        const TM = this.context.scene.getObjectByName("TargetManager")

        // @ts-ignore
        return  GameObject.getComponent(TM, TargetManager);
    }

    async startNextRound(){
        console.log('Starting next round');
        await this.delay(3000);
        console.log('3');
        await this.delay(3000);
        console.log('2');
        await this.delay(3000);
        console.log('1');
        await this.delay(3000);
        console.log('go');
        this.currentLevel++
        let tm = this.getTargetManager()
        console.log(this.currentLevel)
        // @ts-ignore
        tm.start()
    }


    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

