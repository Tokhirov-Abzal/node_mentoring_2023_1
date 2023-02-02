export interface User {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

export class UserEntity {
  id;
  login;
  password;
  age;
  isDeleted;

  constructor({ id, login, password, age, isDeleted }: User) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.age = age;
    this.isDeleted = isDeleted;
  }
}
