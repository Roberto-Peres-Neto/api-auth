import { SequelizeHelper } from "@rpn-solution/utils-lib";
import { AuthenticationRepository } from "../../../../data/protocols/db";
import { LoadInformationUserAccountToUserCodeRepository } from "../../../../data/protocols/db/account";

export class AuthenticationSequelizeRepository implements AuthenticationRepository, LoadInformationUserAccountToUserCodeRepository {
  constructor(
    private readonly sequelize: typeof SequelizeHelper = SequelizeHelper
  ) { }

    async loadUserInformation (request: LoadInformationUserAccountToUserCodeRepository.Request): Promise<LoadInformationUserAccountToUserCodeRepository.Response | null> {
    const { userCode } = request
    const sql = `
        SELECT 
        -- LOGIN_SYSTEM
        L.USER_CODE userCode,
        L.LOGIN email,
        L.ACCOUNT_STATUS accountStatus,
        L.PASSWORD_EXPIRE passwordExpire,
        L.ACCOUNT_EXPIRE accountExpire,

        -- USER_PERSONAL_INFORMATION
        P.COMPLETE_NAME completeName,
        P.NICKNAME nickname,
        P.EMAIL_PERSONAL emailPersonal,
        P.CPF cpf,
        P.RG tg,
        P.CNH cnh,
        P.VOTER_REGISTRATION voterRegistration,
        P.EMPLOY_CONTRACT employContract,
        P.PHONE phone,
        P.DATE_OF_BIRD dateOfBirth,

        -- USER_ADDRESS_INFORMATION
        A.STREET street,
        A.NUMBER number,
        A.NEIGHBORHOOD neighborhood,
        A.CITY city,
        A.STATE [state],

        -- USER_RELATIVES
        R.FATHER_NAME fatherName,
        R.MOTHER_NAME motherName,
        R.WIFE_NAME wifeName,
        R.HOW_MANY_BROTHERS howManyBrothers,
        R.HOW_MANY_CHILDREN howManyChildren,

        -- USER_EMPLOY_DETAILS
        E.EMAIL_CORPORATIVE emailCorporate,
        E.ADMISSION_DATE admissionDate,
        E.POSITION position,
        E.CURRENT_SALARY currentSalary,
        E.NEXT_SALARY_VALUE nextSalaryValue,
        E.NEXT_INCREASE_DATE nextSalaryDate,
        E.WORK_SHIFT workShift,
        E.COST_CENTER_CODE costCenterCode,
        E.COST_CENTER_DESCRIPTION costCenterDescription,
        E.LUNCH_BREAK_DURATION lunchBreakDuration,
        E.LUNCH_BREAK_START lunchBreakStart,
        E.LUNCH_BREAK_END lunchBreakEnd

      FROM LOGIN_SYSTEM L
      INNER JOIN USER_PERSONAL_INFORMATION P ON L.USER_CODE = P.USER_CODE
      INNER JOIN USER_ADDRESS_INFORMATION A ON L.USER_CODE = A.USER_CODE
      INNER JOIN USER_RELATIVES R ON L.USER_CODE = R.USER_CODE
      INNER JOIN USER_EMPLOY_DETAILS E ON L.USER_CODE = E.USER_CODE

      WHERE L.DL = '' AND P.DL = '' AND A.DL = '' AND R.DL = '' AND E.DL = ''
        AND L.ACCOUNT_STATUS = 'ATIVO'
        AND L.USER_CODE = :userCode
    `
    const replacements = {
      userCode: new String(userCode)
    }
    const dbResult = await this.sequelize.query<LoadInformationUserAccountToUserCodeRepository.Response[0]>(sql, replacements)
    if (!dbResult ) {
      return null
    }
    console.log('O QUE TEM AQUI : ', dbResult)

    return dbResult
  }


async authentication (request: AuthenticationRepository.Request): Promise<AuthenticationRepository.Response | null> {    
  const { email, password } = request
    const sql = `SELECT LOGIN email, USER_CODE userCode, ACCOUNT_STATUS accountStatus, ACCOUNT_EXPIRE accountExpire FROM LOGIN_SYSTEM WHERE LOGIN = :email AND PASSWORD = :password`
    console.log('SQL', sql)
    const replacements = {
      email: new String(email),
      password: new String(password)
    }

  const dbResult = await this.sequelize.query<AuthenticationRepository.Response>(sql, replacements)

    if (!dbResult || dbResult.length === 0) {
      return null
    }
    console.log('dbResult', dbResult)
    return dbResult[0]
  }
}