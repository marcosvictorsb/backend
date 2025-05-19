export class CategoryEntity {
  public readonly id: number;
  public readonly name: string;
  public readonly id_user: number;
  public readonly color: string;

  constructor(params: {
    id: number;
    name: string;
    id_user: number;
    color: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.id_user = params.id_user;
    this.color = params.color;
  }
}
