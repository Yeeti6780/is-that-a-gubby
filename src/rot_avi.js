/*********************************************************************/
// Go down to WHERE THE MAGIC HAPPENS to experiment with this script.

let rottingChance = 0;

/*********************************************************************/
export function setup(args)
{
  // select motion vector feature
  args.features = [ "mv" ];

  if (!args.params)
    throw new Error("WHERE ARE THE PARAMETERS?!?!!?")

  const integer = args.params[0]
  const decimalDigits = args.params[1]
  const number = integer / (Math.pow(10, decimalDigits))

  rottingChance = number
}

function glitch_mv(mv, action)
{
    switch (action) {
        case 0:
            mv[0] = 0;
            mv[1] = 0;
            break;

        case 1:
            mv[0], mv[1] = mv[1], mv[0]
            break;

        case 2:
            mv[0] = mv[0] * 3
            mv[1] = mv[1] * 3
            break;
        
        case 3:
            mv[0] = Math.pow(mv[1] - mv[0], 2)
            mv[1] = Math.pow(mv[0] - mv[1], 2)
    }
}

export function glitch_frame(frame)
{
  const fwd_mvs = frame.mv?.forward;
  // bail out if we have no forward motion vectors
  if ( !fwd_mvs )
      return;

  frame.mv.overflow = "truncate";

  // clear horizontal element of all motion vectors
  for ( let i = 0; i < fwd_mvs.length; i++ )
  {
    // loop through all rows
    const row = fwd_mvs[i];
    const action = Math.floor(Math.random() * 4)
    for ( let j = 0; j < row.length; j++ )
    {
      // loop through all macroblocks
      const mv = row[j];
      if (!mv) continue;

      if (Math.random() > rottingChance) continue;

      // THIS IS WHERE THE MAGIC HAPPENS

      glitch_mv(mv, action)
    }

    if (Math.random() < 0.01) {
        row.reverse()
    }
  }
}