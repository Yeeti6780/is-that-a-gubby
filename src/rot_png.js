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

const glitch_remapping = {
  [PNG_FILTER_VALUE_NONE]: PNG_FILTER_VALUE_NONE,
  [PNG_FILTER_VALUE_SUB]: PNG_FILTER_VALUE_PAETH,
  [PNG_FILTER_VALUE_UP]: PNG_FILTER_VALUE_PAETH,
  [PNG_FILTER_VALUE_AVG]: PNG_FILTER_VALUE_PAETH,
  [PNG_FILTER_VALUE_PAETH]: PNG_FILTER_VALUE_AVG
}

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
  const originalRows = rows.slice();
  const filterTypesOriginal = [];
  const filterTypes = [];
  console.log(rows?.length)
  console.log(rottingChance)
  console.log('filter type:', filter_type)
  if ( !rows )
    return;
  const length = rows.length;
  for ( let i = 0; i < length; i++ )
  {
    const row = rows[i];
    originalRows[i] = row.slice()
    if (Math.random() > rottingChance) continue

    const newFilterType = glitch_remapping[row[0]]

    filterTypesOriginal.push(row[0])
    row[0] = newFilterType;
    filterTypes.push(row[0])
  }

  console.log('Checking if every row is still the same for some reason')
  var same = true
  for ( let i = 0; i < length; i++ )
  {
    const rowA = originalRows[i]
    const rowB = rows[i]

    for ( let j in rowA ) {
      if (rowA[j] !== rowB[j]) {
        same = false
        break;
      }
    }

    if (same == false)
      break;
  }

  console.log('Is the same:', same)
  console.log('Original filter types:', filterTypesOriginal)
  console.log('Filter types after processing:', filterTypes)
}