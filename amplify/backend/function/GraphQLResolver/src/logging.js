/**
 *
 * @param {*} event the event passed to the lamda handler function
 * @returns the event or a copy of the event with sensitive info removed, like pins and passwords
 */
const removeSensitive = (event) => {
  try {
    switch (`${event.typeName}.${event.fieldName}`) {
      case "Mutation.punchInByPin":
      case "Mutation.createQP":
        return {
          ...event,
          arguments: {
            ...event.arguments,
            input: {
              ...event.arguments.input,
              b64EncodedPin: "XXXX",
              base64Ident: "XXXX",
            },
          },
        };

      default:
        return event;
    }
  } catch (error) {
    console.error(error);
    return { errorMsg: "removeSensitive failed" };
  }
};

exports.removeSensitive = removeSensitive;
