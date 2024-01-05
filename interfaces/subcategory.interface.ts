export interface Subcategory {
    _id: string;
    id: number;
    name: string;
    categoryParent: number;
    categoryId: {
        _id: string;
        id: number;
        name: string;
        type: string;
    };
}