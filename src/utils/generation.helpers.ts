export const generateLogMessage = (
  instance?: string,
  methodName?: string,
  passedArgs?: object,
  error?: any,
): string => {
  const logArr = [`Service: ${instance}, Method: ${methodName}`];

  if (passedArgs) {
    logArr.push(` Passed args: ${JSON.stringify(passedArgs)}`);
  }

  if (error) {
    if (typeof error === 'object') {
      logArr.push(JSON.stringify(error));
    } else {
      logArr.push(`Error: ${error}`);
    }
  }
  return logArr.join();
};
