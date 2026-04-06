import { mockRoleRepository } from "../__mocks__/role-mocks";
import { RoleMother } from "../mother/role-mother";

import { CreateRole } from "../../src/auth/application/use-cases/role/create-role";
import { UpdateRole } from "../../src/auth/application/use-cases/role/update-role";
import { DeleteRole } from "../../src/auth/application/use-cases/role/delete-role";
import { FinderById } from "../../src/auth/application/use-cases/role/finder-by-id-role";
import { FinderRole } from "../../src/auth/application/use-cases/role/finder-role";

describe('ROLES: Use Cases', () => {

  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('Should create a new role', async () => {
    const role = RoleMother.createRole({});
    const createRole = new CreateRole(mockRoleRepository);
    await createRole.run({...role, listOfAccess: []});
    expect(mockRoleRepository.create).toHaveBeenCalledWith({...role, listOfAccess: []});
  })

  it('Should update a role and throw an error if role not found', async () => {
    const role = RoleMother.createRole({});
    const updateRole = new UpdateRole(mockRoleRepository);
    mockRoleRepository.getById.mockResolvedValueOnce(role);
    await updateRole.run({...role, listOfAccess: []});
    expect(mockRoleRepository.update).toHaveBeenCalledWith({...role, listOfAccess: []});

    mockRoleRepository.getResources.mockResolvedValueOnce([]);
    mockRoleRepository.getById.mockResolvedValueOnce(null);
    await expect(updateRole.run({...role, listOfAccess: []})).rejects.toThrow('Role not found');
  })

  it('Should delete a role and throw an error if role not found', async () => {
    const role = RoleMother.createRole({});
    const deleteRole = new DeleteRole(mockRoleRepository);
    mockRoleRepository.getById.mockResolvedValueOnce(role);
    await deleteRole.run(role.id);
    expect(mockRoleRepository.delete).toHaveBeenCalledWith(role.id);

    mockRoleRepository.getById.mockResolvedValueOnce(null);
    await expect(deleteRole.run(role.id)).rejects.toThrow('Role not found');
  })

  it('Should find a role by id and throw an error if role not found', async () => {
    const role = RoleMother.createRole({});
    const roleFinderById = new FinderById(mockRoleRepository);
    mockRoleRepository.getById.mockResolvedValueOnce(role);
    await roleFinderById.run(role.id);
    expect(mockRoleRepository.getById).toHaveBeenCalledWith(role.id);

    mockRoleRepository.getById.mockResolvedValueOnce(null);
    await expect(roleFinderById.run(role.id)).rejects.toThrow('Role not found');
  })

  it('Should find all roles', async () => {
    const roleFinder = new FinderRole(mockRoleRepository);
    await roleFinder.run(1, 2);
    expect(mockRoleRepository.getAll).toHaveBeenCalled();
  })


})
