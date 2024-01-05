export interface Account {
    _id?: string;
    userId?: { _id: string; name: string; email: string };
    name: string;
    amount: number;
}
