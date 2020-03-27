export interface ICharacterInfo {
    name: string;
    class: string;
    resources: {
        hp: number[];
        mp?: number[];
        rage?: number[];
    };
}
