export const moduleOfType = allModules => type => {
  const model = allModules[type];
  if (!model) {
    throw `"${type}" could not be found.`;
  }
  return model;
};

export default { moduleOfType };
