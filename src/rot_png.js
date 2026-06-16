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

const filter_remapping = {
  [PNG_FILTER_VALUE_NONE]: PNG_FILTER_VALUE_PAETH,
  [PNG_FILTER_VALUE_SUB]: PNG_FILTER_VALUE_PAETH,
  [PNG_FILTER_VALUE_UP]: PNG_FILTER_VALUE_PAETH,
  [PNG_FILTER_VALUE_AVG]: PNG_FILTER_VALUE_PAETH,
  [PNG_FILTER_VALUE_PAETH]: PNG_FILTER_VALUE_AVG
}

const RANDOM_REMAPPING_CHANCE = 0.005
const ROW_CHANGE_CHANCE = 0.1
const PIXEL_CHANGE_CHANCE = 0.08

let rottingChance = 0;

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

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
  
  let rowChangeCount = 0;
  let pixelChangeCount = 0;

  console.log(rows?.length)
  console.log(rottingChance)
  if ( !rows )
    return;

  const length = rows.length;
  for ( let i = 0; i < length; i++ )
  {
    const row = rows[i];
    
    if (Math.random() > rottingChance) continue

    let newFilterType = filter_remapping[row[0]]
    if (Math.random() < RANDOM_REMAPPING_CHANCE)
      newFilterType = Math.floor(Math.random() * 4) + 1;

    row[0] = newFilterType;

    if (Math.random() < ROW_CHANGE_CHANCE) {
      rowChangeCount++;
      for ( let i = 1; i < row.length; i += 4 ) {
        if (Math.random() > PIXEL_CHANGE_CHANCE) continue;
        pixelChangeCount++;
       
        row[i] = (row[i] - 1) % 256
      }
    }
  }

  console.log('row changes:', rowChangeCount)
  console.log('pixel changes:', pixelChangeCount)
}
