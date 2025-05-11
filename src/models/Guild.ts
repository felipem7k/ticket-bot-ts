export default class Guild {

    constructor(
        public readonly id: string,
        private _ticketCategoryId?: string
    ) {

    }

    
    public get ticketCategoryId(): string | undefined {
        return this._ticketCategoryId;
    }

    public set ticketCategoryId(v: string) {
        this._ticketCategoryId= v;
    }
    
    
}