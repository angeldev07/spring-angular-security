import {UserDTO} from "../user.service";

export const mappedResponse = (res: any): UserDTO => {
  const {
    firstName,
    lastName,
    username,
    email,
    profileImgUrl,
    lastLoginDateDisplay,
    joinDate,
    role,
    authorities,
    active,
    notLocked
  } = res

  return {
    firstName,
    lastName,
    username,
    email,
    profileImgUrl,
    lastLoginDateDisplay,
    joinDate,
    role,
    authorities,
    active,
    notLocked
  }
}
