export type ILoadInformationUserAccountToUserCodeRequest = {
  userCode: string
}

export type ILoadInformationUserAccountToUserCodeResponse = {
  personalInformation: {
    completeName: string
    nickname: string
    emailPersonal: string
    cpf: string
    phone: string
    dateOfBirth: string
    rg: string
    cnh: string
    cnhCategory: string
    voterRegistration: string
    maritalStatus: string
  }
  address: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
  }
  relatives: {
    fatherName: string
    motherName: string
    wifeName: string
    howManyBrothers: number
    howManyChildren: number
  }
  employeeDetails: {
    emailCorporate: string
    admissionDate: string
    position: string
    salary: number
    workShift: string
    costCenterCode: string
    costCenterDescription: string
    lunchBreakDuration: string
    lunchBreakStart: string
    lunchBreakEnd: string
  }
}