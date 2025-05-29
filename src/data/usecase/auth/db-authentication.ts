import * as dotenv from "dotenv";
import { IAuthentication } from "../../../domain/usecase";
import { JwtAdapter } from "../../../infra/cryptography/jwt-adapter";
import { AuthenticationRepository } from "../../protocols/db";
import { LoadInformationUserAccountToUserCodeRepository } from "../../protocols/db/account";
dotenv.config();
export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly loadInformationUserAccountToUserCodeRepository: LoadInformationUserAccountToUserCodeRepository
  ) {}

  async login (request: IAuthentication.Request): Promise<IAuthentication.Response | null> {
    const {email, password } = request

    
    console.log('DbAuthentication.login', request)
    const userLogin = await this.authenticationRepository.authentication({ email, password })
    console.log('PRIMEIRO', userLogin)
    if (!userLogin) {
      return null
    }
    console.log('CODIGO', userLogin.userCode)
    const userAccountInformation = await this.loadInformationUserAccountToUserCodeRepository.loadUserInformation({
      userCode: userLogin.userCode
    })
    console.log('SEGUNDO', userAccountInformation)
    console.log('NOMEEEE', userAccountInformation.)
    if (!userAccountInformation) {
       throw new Error('User account information not found')
    }
    const accessToken = JwtAdapter.generate({
      email: email,
      accountStatus: userLogin.accountStatus,
      userCode: userLogin.userCode,
      accountModel: {
        address: {
          city: userAccountInformation.address.city,
          state: userAccountInformation.address.state,
          neighborhood: userAccountInformation.address.neighborhood,
          number: userAccountInformation.address.number,
          street: userAccountInformation.address.street
        },
        employeeDetails: {
          admissionDate: userAccountInformation.employeeDetails.admissionDate,
          costCenterCode: userAccountInformation.employeeDetails.costCenterCode,
          costCenterDescription: userAccountInformation.employeeDetails.costCenterDescription,
          emailCorporate: userAccountInformation.employeeDetails.emailCorporate,
          lunchBreakDuration: userAccountInformation.employeeDetails.lunchBreakDuration,
          lunchBreakEnd: userAccountInformation.employeeDetails.lunchBreakEnd,
          lunchBreakStart: userAccountInformation.employeeDetails.lunchBreakStart,
          position: userAccountInformation.employeeDetails.position,
          salary: userAccountInformation.employeeDetails.salary,
          workShift: userAccountInformation.employeeDetails.workShift,
          employContract: userAccountInformation.employeeDetails.employContract,
          currentSalary: userAccountInformation.employeeDetails.currentSalary,
          nextSalaryDate: userAccountInformation.employeeDetails.nextSalaryDate,
          nextSalaryValue: userAccountInformation.employeeDetails.nextSalaryValue
        },
        personalInformation: {
          cnh: userAccountInformation.personalInformation.cnh,
          cnhCategory: userAccountInformation.personalInformation.cnhCategory,
          completeName: userAccountInformation.personalInformation.completeName,
          cpf: userAccountInformation.personalInformation.cpf,
          dateOfBirth: userAccountInformation.personalInformation.dateOfBirth,
          emailPersonal: userAccountInformation.personalInformation.emailPersonal,
          maritalStatus: userAccountInformation.personalInformation.maritalStatus,
          nickname: userAccountInformation.personalInformation.nickname,
          phone: userAccountInformation.personalInformation.phone,
          rg: userAccountInformation.personalInformation.rg,
          voterRegistration: userAccountInformation.personalInformation.voterRegistration
        },
        relatives: {
          fatherName: userAccountInformation.relatives.fatherName,
          howManyBrothers: userAccountInformation.relatives.howManyBrothers,
          howManyChildren: userAccountInformation.relatives.howManyChildren,
          motherName: userAccountInformation.relatives.motherName,
          wifeName: userAccountInformation.relatives.wifeName
        }
      }
    },
    process.env.JWT_SECRET as string,
  )

  console.log('ACCESSTOKEN AQUI :', accessToken)
    return {
      email: userLogin.email,
      userCode: userLogin.userCode,
      accountStatus: userLogin.accountStatus,
      accessToken: accessToken,
      accountExpire: userLogin.accountExpire  
    }
  }
}