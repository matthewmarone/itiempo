/* Amplify Params - DO NOT EDIT
	API_ITIEMPO_GRAPHQLAPIENDPOINTOUTPUT
	API_ITIEMPO_GRAPHQLAPIIDOUTPUT
	AUTH_AUTH_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const fetch = require("node-fetch");
const URL = require("url");
const AWS = require("aws-sdk");
const Mutations = require("./graphql/mutations");
const Queries = require("./graphql/queries");

AWS.config.update({
  region: process.env.REGION,
  credentials: new AWS.Credentials(
    process.env.AWS_ACCESS_KEY_ID,
    process.env.AWS_SECRET_ACCESS_KEY,
    process.env.AWS_SESSION_TOKEN
  ),
});

const uri = URL.parse(process.env.API_ITIEMPO_GRAPHQLAPIENDPOINTOUTPUT);

const CreateCompany = async (variables) => {
  const operationName = "CreateCompany";
  const graphQL = Mutations.createCompany;
  return await query(operationName, graphQL, variables);
};

const CreateEmployee = async (variables) => {
  const operationName = "CreateEmployee";
  const graphQL = Mutations.createEmployee;
  return await query(operationName, graphQL, variables);
};

const UpdateEmployee = async (variables) => {
  const operationName = "UpdateEmployee";
  const graphQL = Mutations.updateEmployee;
  return await query(operationName, graphQL, variables);
};

const CreateTimeRecord = async (variables) => {
  const operationName = "CreateTimeRecord";
  const graphQL = Mutations.createTimeRecord;
  return await query(operationName, graphQL, variables);
};

const UpdateTimeRecord = async (variables) => {
  const operationName = "UpdateTimeRecord";
  const graphQL = Mutations.updateTimeRecord;
  return await query(operationName, graphQL, variables);
};

const GetEmployee = async (id) => {
  const operationName = "GetEmployee";
  const graphQL = Queries.getEmployee;
  return await query(operationName, graphQL, { id });
};

const query = async (operationName, query, variables = {}) => {
  const postBody = { operationName, query, variables };
  try {
    const httpRequest = new AWS.HttpRequest(uri.href, process.env.REGION);
    httpRequest.headers.host = uri.host;
    httpRequest.headers["Content-Type"] = "application/json";
    httpRequest.method = "POST";
    httpRequest.body = JSON.stringify(postBody);

    await AWS.config.credentials.getPromise();
    const signer = new AWS.Signers.V4(httpRequest, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

    const options = {
      method: httpRequest.method,
      body: httpRequest.body,
      headers: httpRequest.headers,
    };

    const res = await fetch(uri.href, options);
    return await res.json();
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
    throw e;
  }
};

exports.CreateCompany = CreateCompany;
exports.CreateEmployee = CreateEmployee;
exports.UpdateEmployee = UpdateEmployee;
exports.GetEmployee = GetEmployee;
exports.CreateTimeRecord = CreateTimeRecord;
exports.UpdateTimeRecord = UpdateTimeRecord;
