import { SequelizeHelper } from "@rpn-solution/utils-lib";
import { AuthenticationRepository } from "../../../../data/protocols/db";
import { LoadInformationUserAccountToUserCodeRepository } from "../../../../data/protocols/db/account";
import { GetMenuUserRepository, LoadUserPermissionsRepository, LoadUserProfilesRepository, LoadUserRolesRepository } from "../../../../data/protocols/db/account/load-user-permissions-repository";

export class AuthenticationSequelizeRepository implements AuthenticationRepository, LoadInformationUserAccountToUserCodeRepository,
  LoadUserPermissionsRepository,LoadUserRolesRepository, LoadUserProfilesRepository, GetMenuUserRepository {
  constructor(
    private readonly sequelize: typeof SequelizeHelper = SequelizeHelper
  ) { }

  async getMenuUser(request: GetMenuUserRepository.Request): Promise<GetMenuUserRepository.Response | null> {
    const { userCode } = request
    const sql = `

      SELECT DISTINCT M.*
      FROM MENUS M
      JOIN PERMISSION_MENU PM ON PM.MENU_ID = M.ID
      JOIN USER_PERMISSIONS UP ON UP.PERMISSION_SIGLA = PM.PERMISSION_SIGLA
      WHERE UP.USER_CODE = :userCode
        AND ISNULL(M.DL, '') <> '*'
        AND ISNULL(PM.DL, '') <> '*'
        AND ISNULL(UP.DL, '') <> '*'
        AND M.ACTIVE = 1
      ORDER BY M.ORDER_INDEX;

    `
    const replacements = {
      userCode: new String(userCode)
    }
    const dbResult = await this.sequelize.query<GetMenuUserRepository.Response[0]>(sql, replacements)
    if (!dbResult || dbResult.length === 0) {
      return null
    }
    console.log('MENUS', dbResult)
    return dbResult.length > 0 ? dbResult : null
  }

    async loadUserProfile(request: LoadUserProfilesRepository.Request): Promise<LoadUserProfilesRepository.Response | null> {
    const { userCode } = request
    const sql = `
      SELECT 
        P.ID AS profileId,
        P.NAME AS profileName,
        P.DESCRIPTION AS profileDescription
      FROM USER_PROFILES UP WITH (NOLOCK)
      INNER JOIN PROFILES P ON UP.PROFILE_ID = P.ID
      WHERE UP.USER_CODE = :userCode AND UP.DL = '' AND P.DL = ''

    `
    const replacements = {
      userCode: new String(userCode)
    }
    const dbResult = await this.sequelize.query<LoadUserProfilesRepository.Response[0]>(sql, replacements)
    if (!dbResult || dbResult.length === 0) {
      return null
    }
    console.log('PERMISSOES', dbResult)
    return dbResult.length > 0 ? [dbResult[0]] : null
  }

    async loadUserRole (request: LoadUserRolesRepository.Request): Promise<LoadUserRolesRepository.Response | null> {
    const { userCode } = request
    const sql = `
      -- ROLES VINDAS DOS PERFIS
      SELECT DISTINCT 
        R.ACTION action, 
        R.SUBJECT subject
      FROM USER_PROFILES UP
      INNER JOIN PROFILE_ROLES PR ON UP.PROFILE_ID = PR.PROFILE_ID
      INNER JOIN ROLES R ON PR.ROLE_ID = R.ID
      WHERE UP.USER_CODE = :userCode AND R.DL = '' AND PR.DL = ''

      UNION

      -- ROLES DIRETAS DO USUÁRIO
      SELECT 
        R.ACTION action, 
        R.SUBJECT subject
      FROM USER_ROLES UR
      INNER JOIN ROLES R ON R.ID = UR.ROLE_ID
      WHERE UR.USER_CODE = :userCode AND R.DL = '' AND UR.DL = ''

    `
    const replacements = {
      userCode: new String(userCode)
    }
    const dbResult = await this.sequelize.query<LoadUserRolesRepository.Response[0]>(sql, replacements)
    if (!dbResult || dbResult.length === 0) {
      return null
    }
    console.log('PERMISSOES', dbResult)
    return dbResult.length > 0 ? [dbResult[0]] : null
  }

  async loadUserPermission(request: LoadUserPermissionsRepository.Request): Promise<LoadUserPermissionsRepository.Response | null> {
    const { userCode } = request
    const sql = `
      -- PERMISSÕES POR PERFIL
      SELECT DISTINCT 
        PERM.PERMISSAO_SIGLA AS permissionSigla, 
        PERM.DESCRIPTION AS permissionDescription
      FROM USER_PROFILES UP
      INNER JOIN PROFILE_PERMISSIONS PP ON PP.PROFILE_ID = UP.PROFILE_ID
      INNER JOIN PERMISSIONS PERM ON PERM.ID = PP.PERMISSION_ID
      WHERE 
        UP.USER_CODE = :userCode
        AND ISNULL(UP.DL, '') <> '*'
        AND ISNULL(PP.DL, '') <> '*'
        AND ISNULL(PERM.DL, '') <> '*'

      UNION

      -- PERMISSÕES DIRETAS DO USUÁRIO
      SELECT 
        UP.PERMISSION_SIGLA AS permissionSigla,
        PERM.DESCRIPTION AS permissionDescription
      FROM USER_PERMISSIONS UP
      INNER JOIN PERMISSIONS PERM ON PERM.PERMISSAO_SIGLA = UP.PERMISSION_SIGLA
      WHERE 
        UP.USER_CODE =  :userCode
        AND ISNULL(UP.DL, '') <> '*'
        AND ISNULL(PERM.DL, '') <> '*'
    `
    const replacements = {
      userCode: new String(userCode)
    }
    const dbResult = await this.sequelize.query<LoadUserPermissionsRepository.Response[0]>(sql, replacements)
    if (!dbResult || dbResult.length === 0) {
      return null
    }
    console.log('PERMISSOES', dbResult)
    return dbResult.length > 0 ? [dbResult[0]] : null
  }


  async loadUserInformation(request: LoadInformationUserAccountToUserCodeRepository.Request): Promise<LoadInformationUserAccountToUserCodeRepository.Response | null> {
    const { userCode } = request
    const sql = `
      SELECT 
        -- Dados do LOGIN_SYSTEM
        L.USER_CODE AS userCode,
        L.LOGIN AS email,
        L.ACCOUNT_STATUS AS accountStatus,
        L.PASSWORD_EXPIRE AS passwordExpire,
        L.ACCOUNT_EXPIRE AS accountExpire,

        -- USER_PERSONAL_INFORMATION
        P.COMPLETE_NAME AS completeName,
        P.NICKNAME AS nickname,
        P.EMAIL_PERSONAL AS emailPersonal,
        P.CPF AS cpf,
        P.RG AS tg,
        P.CNH AS cnh,
        P.VOTER_REGISTRATION AS voterRegistration,
        P.EMPLOY_CONTRACT AS employContract,
        P.PHONE AS phone,
        P.DATE_OF_BIRD AS dateOfBirth,

        -- USER_ADDRESS_INFORMATION
        A.STREET AS street,
        A.NUMBER AS number,
        A.NEIGHBORHOOD AS neighborhood,
        A.CITY AS city,
        A.STATE AS [state],

        -- USER_RELATIVES
        R.FATHER_NAME AS fatherName,
        R.MOTHER_NAME AS motherName,
        R.WIFE_NAME AS wifeName,
        R.HOW_MANY_BROTHERS AS howManyBrothers,
        R.HOW_MANY_CHILDREN AS howManyChildren,

        -- USER_EMPLOY_DETAILS
        E.EMAIL_CORPORATIVE AS emailCorporate,
        E.ADMISSION_DATE AS admissionDate,
        E.POSITION AS position,
        E.CURRENT_SALARY AS currentSalary,
        E.NEXT_SALARY_VALUE AS nextSalaryValue,
        E.NEXT_INCREASE_DATE AS nextSalaryDate,
        E.WORK_SHIFT AS workShift,
        E.COST_CENTER_CODE AS costCenterCode,
        E.COST_CENTER_DESCRIPTION AS costCenterDescription,
        E.LUNCH_BREAK_DURATION AS lunchBreakDuration,
        E.LUNCH_BREAK_START AS lunchBreakStart,
        E.LUNCH_BREAK_END AS lunchBreakEnd,

        -- PERFIS (JSON)
        (
          SELECT 
            P.NAME AS name,
            P.DESCRIPTION AS profileDescription
          FROM USER_PROFILES UP
          INNER JOIN PROFILES P ON P.ID = UP.PROFILE_ID
          WHERE UP.USER_CODE = L.USER_CODE AND UP.DL = '' AND P.DL = ''
          FOR JSON PATH
        ) AS profile,

        -- PERMISSÕES (JSON)
        (
          SELECT * FROM (
            SELECT 
              PERM.PERMISSAO_SIGLA AS permissaoSigla,
              PERM.DESCRIPTION AS permissionDesciption
            FROM USER_PERMISSIONS UP
INNER JOIN PERMISSIONS PERM ON PERM.PERMISSAO_SIGLA = UP.PERMISSION_SIGLA
            WHERE UP.USER_CODE = L.USER_CODE AND UP.DL = '' AND PERM.DL = ''

            UNION

            SELECT 
              PERM.PERMISSAO_SIGLA,
              PERM.DESCRIPTION
            FROM USER_PROFILES UPR
            INNER JOIN PROFILE_PERMISSIONS PP ON UPR.PROFILE_ID = PP.PROFILE_ID
            INNER JOIN PERMISSIONS PERM ON PERM.ID = PP.PERMISSION_ID
            WHERE UPR.USER_CODE = L.USER_CODE AND UPR.DL = '' AND PP.DL = '' AND PERM.DL = ''
          ) AS PermissoesUnificadas
          FOR JSON PATH
        ) AS permissions,

        -- ROLES (JSON)
        (
          SELECT * FROM (
            SELECT 
              R.ACTION AS action,
              R.SUBJECT AS subject
            FROM USER_ROLES UR
            INNER JOIN ROLES R ON R.ID = UR.ROLE_ID
            WHERE UR.USER_CODE = L.USER_CODE AND UR.DL = '' AND R.DL = ''

            UNION

            SELECT 
              R.ACTION,
              R.SUBJECT
            FROM USER_PROFILES UPR
            INNER JOIN PROFILE_ROLES PR ON PR.PROFILE_ID = UPR.PROFILE_ID
            INNER JOIN ROLES R ON R.ID = PR.ROLE_ID
            WHERE UPR.USER_CODE = L.USER_CODE AND UPR.DL = '' AND PR.DL = '' AND R.DL = ''
          ) AS RolesUnificadas
          FOR JSON PATH
        ) AS roles

      FROM LOGIN_SYSTEM L
      INNER JOIN USER_PERSONAL_INFORMATION P ON L.USER_CODE = P.USER_CODE
      INNER JOIN USER_ADDRESS_INFORMATION A ON L.USER_CODE = A.USER_CODE
      INNER JOIN USER_RELATIVES R ON L.USER_CODE = R.USER_CODE
      INNER JOIN USER_EMPLOY_DETAILS E ON L.USER_CODE = E.USER_CODE
      WHERE 
        L.DL = '' AND P.DL = '' AND A.DL = '' AND R.DL = '' AND E.DL = ''
        AND L.ACCOUNT_STATUS = 'ATIVO'
        AND L.USER_CODE = :userCode

    `
    const replacements = {
      userCode: new String(userCode)
    }
    const dbResult = await this.sequelize.query<LoadInformationUserAccountToUserCodeRepository.Response[0]>(sql, replacements)
    if (!dbResult) {
      return null
    }
    console.log('O QUE TEM AQUI : ', dbResult)

    return dbResult
  }


  async authentication(request: AuthenticationRepository.Request): Promise<AuthenticationRepository.Response | null> {
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