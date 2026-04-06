import { mockUserRepository } from "../__mocks__/user-mocks";
import { mockRoleRepository } from "../__mocks__/role-mocks";
import { UserMother } from "../mother/user-mother";

import { CreateUser } from "../../src/auth/application/use-cases/user/create-user";
import { UpdateUser } from "../../src/auth/application/use-cases/user/update-user";
import { DeleteUser } from "../../src/auth/application/use-cases/user/delete-user";
import { FinderById } from "../../src/auth/application/use-cases/user/finder-by-id-user";
import { FinderUser } from "../../src/auth/application/use-cases/user/finder-user";

describe('USER: Use Cases', () => {

  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('Should create a new user', async () => {
    const user = UserMother.createUser({});
    const createUser = new CreateUser(mockUserRepository, mockRoleRepository);
    await createUser.run(user);
    expect(mockUserRepository.create).toHaveBeenCalledWith(user);
  })

  it('Should update a user and throw an error if user not found', async () => {
    const user = UserMother.createUser({});
    const updateUser = new UpdateUser(mockUserRepository,mockRoleRepository);
    mockUserRepository.getById.mockResolvedValueOnce(user);
    await updateUser.run(user);
    expect(mockUserRepository.update).toHaveBeenCalledWith(user);
    mockUserRepository.getById.mockResolvedValueOnce(null);
    await expect(updateUser.run(user)).rejects.toThrow('User not found');
  })

  it('Should delete a user and throw an error if user not found', async () => {
    const user = UserMother.createUser({});
    const deleteUser = new DeleteUser(mockUserRepository);
    mockUserRepository.getById.mockResolvedValueOnce(user);
    await deleteUser.run(user.id);
    expect(mockUserRepository.delete).toHaveBeenCalledWith(user.id);

    mockUserRepository.getById.mockResolvedValueOnce(null);
    await expect(deleteUser.run(user.id)).rejects.toThrow('User not found');
  })

  it('Should find a user by id and throw an error if user not found', async () => {
    const user = UserMother.createUser({});
    const userFinderById = new FinderById(mockUserRepository);
    mockUserRepository.getById.mockResolvedValueOnce(user);
    await userFinderById.run(user.id);
    expect(mockUserRepository.getById).toHaveBeenCalledWith(user.id);

    mockUserRepository.getById.mockResolvedValueOnce(null);
    await expect(userFinderById.run(user.id)).rejects.toThrow('User not found');
  })

  it('Should find all users', async () => {
    const userFinder = new FinderUser(mockUserRepository);
    await userFinder.run(1, 2);
    expect(mockUserRepository.getAll).toHaveBeenCalled();
  })


})
