export default {
  name: "ec-route",
  transform(code: string, id: string) {
    if (!/vue&type=ec-route/.test(id)) return;
    console.log(code);
    return `
    export default Comp => {
      Comp.ecRoute = {
        ${code.trim().slice(1, -1)}
      }
      console.log(Comp)
    }`;
  },
};
