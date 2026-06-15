const PNG_FILTER_VALUE_NONE  = 0;
const PNG_FILTER_VALUE_SUB   = 1;
const PNG_FILTER_VALUE_UP    = 2;
const PNG_FILTER_VALUE_AVG   = 3;
const PNG_FILTER_VALUE_PAETH = 4;

// const filter_type = PNG_FILTER_VALUE_NONE;
// const filter_type = PNG_FILTER_VALUE_SUB;
// const filter_type = PNG_FILTER_VALUE_UP;
// const filter_type = PNG_FILTER_VALUE_AVG;
const filter_type = PNG_FILTER_VALUE_PAETH;

let rottingChance = 0;

export function setup(args)
{
  args.features = [ "idat" ];

  if (!args.params)
    throw new Error("WHERE ARE THE PARAMETERS?!?!!?")

  const integer = args.params[0]
  const decimalDigits = args.params[1]
  const number = integer / (Math.pow(10, decimalDigits))

  rottingChance = number
}

export function glitch_frame(frame, stream)
{
  const rows = frame.idat?.rows;
  console.log(rows?.length)
  console.log(rottingChance)
  if ( !rows )
    return;
  const length = rows.length;
  for ( let i = 0; i < length; i++ )
  {
    const row = rows[i];
    if (Math.random() > rottingChance) continue

    row[0] = filter_type;
  }
}