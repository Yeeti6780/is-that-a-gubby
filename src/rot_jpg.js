/*********************************************************************/
// new DC quantization coefficient
const dc_quant = 63; // EXPERIMENT BY CHANGING THIS VALUE

let rottingChance = 0;

/*********************************************************************/
export function setup(args)
{
  // select quantization table feature
  args.features = [ "dqt" ];

  if (!args.params)
    throw new Error("WHERE ARE THE PARAMETERS?!?!!?")

  const integer = args.params[0]
  const decimalDigits = args.params[1]
  const number = integer / (Math.pow(10, decimalDigits))

  rottingChance = number
}

export function glitch_frame(frame, stream)
{
  const tables = frame.dqt.tables;
  const table0 = tables[0];
  console.log(`The old DC quantization coefficient was ${table0[0]}`);
  // change the DC quantization coefficient for first table
  table0[0] = dc_quant;
  console.log(`The new DC quantization coefficient is ${table0[0]}`);
}