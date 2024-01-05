export interface Transaction {
    _id: string;
    userId: { _id: string; name: string; email: string };
    type: string;
    amount: number;
    subcategoryId: { _id: string; name: string };
    description: string;
    date: string;
    source?: { _id: string; description: string };
}
