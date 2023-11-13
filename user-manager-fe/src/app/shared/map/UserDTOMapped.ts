import {UserDTO} from "../user.service";

export const mappedResponse = (res: any): UserDTO => {
  const {
    id,
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
    id,
    firstName,
    lastName,
    username,
    email,
    profileImgUrl: profileImgUrl ?? `https://robohash.org/${username}` ,
    lastLoginDateDisplay,
    joinDate,
    role,
    authorities,
    active,
    notLocked
  }
}
