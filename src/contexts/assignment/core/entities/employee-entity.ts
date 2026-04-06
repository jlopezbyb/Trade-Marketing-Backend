export class EmployeeEntity {
  constructor(
    public readonly id: string,
    public readonly employeeNumber: string,
    public readonly name: string | null,
    public readonly dpi: string | null,
    public readonly nit: string | null,
    public readonly company: string | null,

    public readonly departmentCode: string | null,
    public readonly department: string | null,

    public readonly areaCode: string | null,
    public readonly area: string | null,

    public readonly positionCode: string | null,
    public readonly position: string | null,

    public readonly employeeType: string | null,
    public readonly companyEmail: string | null,

    public readonly managerEmployeeNumber: string | null,

    public readonly costCenter: string | null,
    public readonly globalDimensionCode: string | null,

    public readonly supplierNumber: string | null,
    public readonly preferredBankAccountCode: string | null,
    public readonly statisticsGroupCode: string | null,

    public readonly accessToken?: string
  ) {}
  public static fromPrimitive(primitive: {
    id: string;
    employeeNumber: string;
    name?: string | null;
    dpi?: string | null;
    nit?: string | null;
    company?: string | null;

    departmentCode?: string | null;
    department?: string | null;

    areaCode?: string | null;
    area?: string | null;

    positionCode?: string | null;
    position?: string | null;

    employeeType?: string | null;
    companyEmail?: string | null;

    managerEmployeeNumber?: string | null;

    costCenter?: string | null;
    globalDimensionCode?: string | null;

    supplierNumber?: string | null;
    preferredBankAccountCode?: string | null;
    statisticsGroupCode?: string | null;
  }): EmployeeEntity {
    return new EmployeeEntity(
      primitive.id,
      primitive.employeeNumber,
      primitive.name ?? null,
      primitive.dpi ?? null,
      primitive.nit ?? null,
      primitive.company ?? null,

      primitive.departmentCode ?? null,
      primitive.department ?? null,

      primitive.areaCode ?? null,
      primitive.area ?? null,

      primitive.positionCode ?? null,
      primitive.position ?? null,

      primitive.employeeType ?? null,
      primitive.companyEmail ?? null,

      primitive.managerEmployeeNumber ?? null,

      primitive.costCenter ?? null,
      primitive.globalDimensionCode ?? null,

      primitive.supplierNumber ?? null,
      primitive.preferredBankAccountCode ?? null,
      primitive.statisticsGroupCode ?? null
    );
  }
  public toPrimitive() {
    return {
      id: this.id,
      employeeNumber: this.employeeNumber,
      name: this.name,
      dpi: this.dpi,
      nit: this.nit,
      company: this.company,

      departmentCode: this.departmentCode,
      department: this.department,

      areaCode: this.areaCode,
      area: this.area,

      positionCode: this.positionCode,
      position: this.position,

      employeeType: this.employeeType,
      companyEmail: this.companyEmail,

      managerEmployeeNumber: this.managerEmployeeNumber,

      costCenter: this.costCenter,
      globalDimensionCode: this.globalDimensionCode,

      supplierNumber: this.supplierNumber,
      preferredBankAccountCode: this.preferredBankAccountCode,
      statisticsGroupCode: this.statisticsGroupCode,

      accessToken: this.accessToken
    };
  }
}
