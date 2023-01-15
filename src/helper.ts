import { UserEntity } from 'entity/User.entity';

export const findUserById = (id: string, users: UserEntity[]) => {
  const userById = users.find(user => user.id === id);

  return userById ? userById : null;
};

export const findUserByLogin = (login: string, users: UserEntity[]) => {
  const userByLogin = users.find(userObj => userObj.login === login);

  return userByLogin ? userByLogin : null;
};

export const getAutoSuggestUsers = (
  users: UserEntity[],
  loginSubstring: string,
  limit: number,
): UserEntity[] => {
  let usersCopy: UserEntity[] = [...users];

  if (loginSubstring) {
    usersCopy = users.filter(userObj =>
      userObj.login.toLowerCase().includes(loginSubstring.toLowerCase()),
    );
  }

  if (limit) {
    usersCopy = usersCopy.slice(0, limit);
  }

  return usersCopy;
};
