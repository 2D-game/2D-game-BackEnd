import { GiftBox } from "./GiftBox";
import { Item } from "./Item";
import { Iterator } from "../../util/Iterator";
export class GiftBoxIterator implements Iterator {
    collection: GiftBox;
    currentElement: number;

    public constructor(collection : GiftBox) {
        this.collection = collection;
        this.currentElement = 0;
    }

    public restart() : void {
        this.currentElement = 0;
    }

    public getNext() : Item | null {
        if (this.hasNext()) {
            return this.collection.getItem(this.currentElement++);
        }
        return null;
    }

    public hasNext() : boolean {
        return this.currentElement < (this.collection.length)

    }
}