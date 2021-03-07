const bcrypt = require("bcrypt");
const saltRounds = 12;
const { ListEmployeesByEmail } = require("./api");

/**
 *
 * @param {*} secret
 */
const hash = async (secret, companyId) => {
  try {
    return await bcrypt.hash(`${companyId}${secret}`, saltRounds);
  } catch (e) {
    console.error("failed to hash secret", e);
    throw e;
  }
};
/**
 *
 * @param {*} secret
 * @param {*} hash
 */
const compare = async (secret, companyId, hash) => {
  try {
    return await bcrypt.compare(`${companyId}${secret}`, hash);
  } catch (e) {
    console.log(e);
  }
  return false;
};

/**
 *
 * @param {*} secret
 * @param {*} companyId
 */
const getEmployee = async (secret = "", companyId = "") => {
  const variables = {
    companyId,
    filter: { ident: { attributeExists: true } },
    limit: 50,
    sortDirection: "ASC",
  };
  let nextToken = undefined;
  do {
    const {
      data: {
        listEmployeesByEmail: { items, nextToken: nt },
      },
    } = await ListEmployeesByEmail({ ...variables, nextToken }, true);
    for (const employee of items) {
      if (await compare(secret, companyId, employee.ident)) return employee;
    }
    nextToken = nt;
  } while (nextToken);
};
