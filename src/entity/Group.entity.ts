export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export interface Group {
  id: string;
  name: string;
  permissions: Permission[];
}

export class GroupEntity implements Group {
  id;
  name;
  permissions;

  constructor({ id, name, permissions }: Group) {
    this.id = id;
    this.name = name;
    this.permissions = permissions;
  }
}
