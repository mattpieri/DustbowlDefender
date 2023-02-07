
import {Behaviour, TransformData, GameObject } from '@needle-tools/engine';


export class GameManager extends Behaviour{
    private _health: number = 150;
    private _money: number = 0;

    get health(): number {
        return this._health;
    }

    set health(value: number) {
        this._health = value;
    }

    get money(): number {
        return this._money;
    }

    set money(value: number) {
        this._money = value;
    }

    subtractHealth(damage: number): void {
        this._health -= damage;
    }

    addMoney(amount: number): void {
        this._money += amount;
    }


}
