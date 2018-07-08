export const constraints = {
  url: {
    presence: { allowEmpty: false },
  },
  selector: {
  },
  diffThreshold: {
    presence: {},
    numericality: {
      greaterThanOrEqualTo: 0.0,
    }
  }
};

export default { constraints };
