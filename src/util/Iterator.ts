export interface Iterator {
    collection: Object;
    currentElement: Object;
    restart:() => void;
    getNext:() => Object | null;
    hasNext:() => boolean;
}