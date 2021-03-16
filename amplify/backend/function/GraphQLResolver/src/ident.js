const bcrypt = require("bcrypt");
const saltRounds = 12;

/**
 *
 * @param {*} secret
 * @param {*} companyId
 * @return A promise to be either resolved with the encrypted data salt or rejected with an Error
 */
const createIdent = async (secret, companyId) => {
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
const compareIdent = async (secret, companyId, hash) => {
  try {
    return await bcrypt.compare(`${companyId}${secret}`, hash);
  } catch (e) {
    console.log(e);
  }
  return false;
};

exports.createIdent = createIdent;
exports.compareIdent = compareIdent;
