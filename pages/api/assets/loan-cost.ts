// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CostGenerator } from '../../../lib/assets/costs';
import { DebtGenerator } from '../../../lib/assets/debts';
import { TilgungGenerator } from '../../../lib/assets/tilgung';
import { AnnualCostSeries, GraphData } from '../../../model/graph'
import { sanierung } from '../../../model/sanierung';

const stringParam = (param: string | string[]) => {
  return typeof param === "string" ? param : param[0]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GraphData<AnnualCostSeries>>
) {
  const params = req.query;
  const costGenerator = new CostGenerator(sanierung);
  const debtGenerator = new DebtGenerator(sanierung);
  const tilgungGenerator = new TilgungGenerator(sanierung);

  if (params.direktKredite !== undefined) {
    costGenerator.setDirektKredite(parseInt(stringParam(params.direktKredite), 10));
    debtGenerator.setDirektKredite(parseInt(stringParam(params.direktKredite), 10));
  }
  if (params.direktKreditZinsen !== undefined) {
    costGenerator.setDirektKreditZinsen(parseFloat(stringParam(params.direktKreditZinsen)));
    tilgungGenerator.setDirektKreditZinsen(parseFloat(stringParam(params.direktKreditZinsen)))
  }
  if (params.direktKreditTilgung !== undefined) {
    costGenerator.setDirektKreditTilgung(parseFloat(stringParam(params.direktKreditTilgung)));
    tilgungGenerator.setDirektKreditTilgung(parseFloat(stringParam(params.direktKreditTilgung)));
  }

  res.status(200).json({ 
    name: 'Loan Cost',
    series: {
      annualCosts: costGenerator.generateVariants(),
      debts: debtGenerator.generateVariants(),
      tilgung: tilgungGenerator.generateVariants(),
    },
  })
}
