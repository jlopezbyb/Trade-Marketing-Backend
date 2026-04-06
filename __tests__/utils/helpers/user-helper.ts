import { UserModel } from "../../../src/contexts/shared/infrastructure/models/auth/user.model"


export class UserHelper {
  static async  getUserByRoleId(roleId: string): Promise<any> {
    const user = await UserModel.findOne({where: {role_id: roleId}});
    return user
  }
}
